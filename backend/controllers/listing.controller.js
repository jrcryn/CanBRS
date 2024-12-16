import mongoose from 'mongoose';
import Listing from "../models/listing.model.js";
import fs from 'fs';
import { io } from '../server.js';


// GET listings (working)
export const getListing = async (req, res) => {
    try {
        // Check if excludeImages query parameter is set to true
        const excludeImages = req.query.excludeImages === 'true';
    
        // Determine fields to select based on excludeImages
        const selectFields = excludeImages ? '-image' : '';
    
        // Fetch listings with or without images
        const listings = await Listing.find().select(selectFields);
    
        res.status(200).json({ success: true, data: listings });
      } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
      }
};

// CREATE listing (working)
export const createListing = async (req, res) => {
    try {
        const { name, inventory, description, type, address } = req.body;

        if (!name || !description || !type || !req.file) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        // Validate fields based on type
        if (type === 'equipment' && !inventory) {
            return res.status(400).json({ success: false, message: 'Inventory is required for equipment.' });
        }
        if (type === 'facility' && !address) {
            return res.status(400).json({ success: false, message: 'Address is required for facility.' });
        }

        const newListing = new Listing({
            name,
            description,
            type,
            image: {
                data: fs.readFileSync(req.file.path, 'base64'),
                contentType: req.file.mimetype
            },
        });

        // Add inventory or address based on type
        if (type === 'equipment') {
            newListing.inventory = inventory;
        } else if (type === 'facility') {
            newListing.address = address;
        }

        await newListing.save();
        res.status(201).json({ success: true, data: newListing });

        io.emit('listingCreated', newListing);

    } catch (error) {
        console.error('Error uploading listing:', error.message);
        res.status(500).json({ success: false, message: 'Error uploading listing' });
    }
};



//UPDATE or PUT listing (working)
export const updateListing = async (req, res) => {
    const { id } = req.params;
    const { name, inventory, description, type, address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Listing Id' });
    }

    try {
        const updateData = { name, description, type };

        if (type === 'equipment') {
            updateData.inventory = inventory;
            updateData.address = undefined; // Remove address if switching to equipment
        } else if (type === 'facility') {
            updateData.address = address;
            updateData.inventory = undefined; // Remove inventory if switching to facility
        }

        if (req.file) {
            updateData.image = {
                data: fs.readFileSync(req.file.path, 'base64'),
                contentType: req.file.mimetype
            };
        }

        const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedListing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        io.emit('listingUpdated', updatedListing);

        res.status(200).json({ success: true, data: updatedListing });
    } catch (error) {
        console.error('Error updating listing:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// DELETE listing (working)
export const deleteListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid Listing Id' });
    }

    try {
        await Listing.findByIdAndDelete(id);

        // Emit an event to all connected clients
        io.emit('listingDeleted', { id });

        res.status(200).json({ success: true, message: 'Listing Deleted', data: { id } });
    } catch (error) {
        console.log('Error in deleting Listing');
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

