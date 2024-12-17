import axios from 'axios';
import mongoose from 'mongoose';

import ReservationRequest from '../models/reservationRequest.model.js';
import Listing from '../models/listing.model.js';

import { sendReservationRequestApprovedSMS } from '../semaphore/sms.js';


import dotenv from 'dotenv';
dotenv.config();

// Create a new reservation request
export const createReservation = async (req, res) => {
  try {
    const { resources, purpose, startDate, endDate, recaptchaToken } = req.body;
    const residentId = req.userId; // from verifyToken middleware
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    // Verify reCAPTCHA token first
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify`;

    try {
      const verificationResponse = await axios.post(verificationURL, null, {
        params: {
          secret: secretKey,
          response: recaptchaToken,
        },
      });
    
      const { success } = verificationResponse.data;
    
      if (!success) {
        return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
      }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error verifying reCAPTCHA' });
    }

    //Then pwede na mag create ng reservation
    const newReservation = new ReservationRequest({
      resident: residentId,
      resources,
      purpose,
      startDate,
      endDate,
      // Extract address from resources if any resource is a facility
      address: resources.find(item => item.resourceId.type === 'facility') 
               ? req.body.address 
               : undefined,
    });

    await newReservation.save();
    res.status(201).json({ success: true, data: newReservation });

  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all reservations (for admin)
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await ReservationRequest.find()
      .populate({
        path: 'resident',
        select: '-validIDfront -validIDback -selfie', // Exclude image fields
      })
      .populate({
        path: 'resources.resourceId',
        select: '-image -description', // Exclude image and description fields
      });
    res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get reservations for the logged-in resident
export const getReservationsForResident = async (req, res) => {
  try {
    const residentId = req.userId; 
    const reservations = await ReservationRequest.find({ resident: residentId })
      .populate('resident')
      .populate({
        path: 'resources.resourceId',
        select: 'name type address', // Include 'type' and 'address'
      });
    res.status(200).json({ success: true, data: reservations });

  } catch (error) {
    console.error('Error fetching resident reservations:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update reservation details (for admin)
export const updateReservationAdmin = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const updates = req.body;

    // If appointmentDate is present, convert it to a Date object
    if (updates.appointmentDate) {
      updates.appointmentDate = new Date(updates.appointmentDate);
    }

    // Fetch the original reservation
    const originalReservation = await ReservationRequest.findById(id)
      .populate('resources.resourceId')
      .session(session);

    if (!originalReservation) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Retrieve original and updated status
    const originalStatus = originalReservation.status;
    const updatedStatus = updates.status || originalStatus;

    // Retrieve original and updated resources
    const originalResources = originalReservation.resources || [];
    const updatedResources = updates.resources || originalResources;

    // Adjust inventory based on status change (helper function)
    await adjustInventory(
      originalResources,
      updatedResources,
      originalStatus,
      updatedStatus,
      session
    );

    // Update the reservation
    const updatedReservation = await ReservationRequest.findByIdAndUpdate(
      id,
      updates,
      { new: true, session }
    )
      .populate('resident', 'firstname lastname phone') // Only necessary fields
      .populate('resources.resourceId', 'name inventory type address'); // Avoid image data

    if (updates.status === 'Approved' && originalStatus !== 'Approved') {
      try {
        await sendReservationRequestApprovedSMS(updatedReservation.resident.phone);
      } catch (smsError) {
        console.error('Error sending approval SMS:', smsError);
        // Continue with the transaction even if SMS fails
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, data: updatedReservation });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error updating reservation:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Helper function to adjust inventory
const adjustInventory = async (
  originalResources = [],
  updatedResources = [],
  originalStatus,
  updatedStatus,
  session
) => {
  try {
    // Determine status transitions
    const statusChangedToApproved =
      originalStatus !== 'Approved' && updatedStatus === 'Approved';

    const statusChangedFromApprovedToCancelledOrDeclinedOrPending =
      originalStatus === 'Approved' &&
      ['Declined', 'Cancelled', 'Pending'].includes(updatedStatus);

    const statusChangedToInUse =
      originalStatus !== 'In-Use' && updatedStatus === 'In-Use';

    const statusChangedFromApprovedToInUse =
      originalStatus === 'Approved' && updatedStatus === 'In-Use';

    const statusChangedFromInUseToReturned =
      originalStatus === 'In-Use' && updatedStatus === 'Returned';

    const statusChangedToReturned =
      originalStatus !== 'Returned' && updatedStatus === 'Returned';

    // Handle status change to 'Approved' (Deduct inventory)
    if (statusChangedToApproved) {
      for (const item of updatedResources) {
        const resourceId =
          typeof item.resourceId === 'object'
            ? item.resourceId._id.toString()
            : item.resourceId.toString();

        const listing = await Listing.findById(resourceId)
          .select('-image')
          .session(session);
        if (!listing) throw new Error(`Listing not found for ID: ${resourceId}`);

        listing.inventory = Math.max(0, listing.inventory - item.quantity);
        await listing.save({ session });
      }
    }
    // Handle status change from 'Approved' to 'Declined' or 'Cancelled' (Return inventory)
    else if (statusChangedFromApprovedToCancelledOrDeclinedOrPending) {
      for (const item of originalResources) {
        const resourceId =
          typeof item.resourceId === 'object'
            ? item.resourceId._id.toString()
            : item.resourceId.toString();

        const listing = await Listing.findById(resourceId)
          .select('-image')
          .session(session);
        if (!listing) throw new Error(`Listing not found for ID: ${resourceId}`);

        listing.inventory += item.quantity;
        await listing.save({ session });
      }
    }
    // Handle status change from 'Approved' to 'In-Use' (No inventory adjustment needed)
    else if (statusChangedFromApprovedToInUse) {
      // Inventory remains the same
    }
    // Handle status change from 'In-Use' to 'Returned' (Increase inventory)
    else if (statusChangedFromInUseToReturned) {
      for (const item of originalResources) {
        const resourceId =
          typeof item.resourceId === 'object'
            ? item.resourceId._id.toString()
            : item.resourceId.toString();

        const listing = await Listing.findById(resourceId)
          .select('-image')
          .session(session);
        if (!listing) throw new Error(`Listing not found for ID: ${resourceId}`);

        listing.inventory += item.quantity;
        await listing.save({ session });
      }
    }
    
    // Handle status change to 'Returned' from other statuses (e.g., directly from 'Approved')
    else if (statusChangedToReturned) {
      for (const item of originalResources) {
        const resourceId =
          typeof item.resourceId === 'object'
            ? item.resourceId._id.toString()
            : item.resourceId.toString();

        const listing = await Listing.findById(resourceId)
          .select('-image')
          .session(session);
        if (!listing) throw new Error(`Listing not found for ID: ${resourceId}`);

        listing.inventory += item.quantity;
        await listing.save({ session });
      }
    }
    // Handle resource quantity updates while status is 'Approved'
    else if (
      originalStatus === 'Approved' &&
      updatedStatus === 'Approved' &&
      JSON.stringify(originalResources) !== JSON.stringify(updatedResources)
    ) {
      const originalMap = new Map(
        originalResources.map((item) => [
          typeof item.resourceId === 'object'
            ? item.resourceId._id.toString()
            : item.resourceId.toString(),
          item.quantity,
        ])
      );

      const updatedMap = new Map(
        updatedResources.map((item) => [
          typeof item.resourceId === 'object'
            ? item.resourceId._id.toString()
            : item.resourceId.toString(),
          item.quantity,
        ])
      );

      // Adjust inventory based on quantity differences
      for (const [resourceId, updatedQuantity] of updatedMap) {
        const originalQuantity = originalMap.get(resourceId) || 0;
        const difference = originalQuantity - updatedQuantity; // Positive if original > updated

        if (difference !== 0) {
          const listing = await Listing.findById(resourceId)
            .select('-image')
            .session(session);
          if (!listing) throw new Error(`Listing not found for ID: ${resourceId}`);

          listing.inventory += difference;
          await listing.save({ session });
        }
      }
    }
    // For other status changes, no inventory adjustment is needed
  } catch (error) {
    console.error('Error in adjustInventory:', error);
    throw error;
  }
};