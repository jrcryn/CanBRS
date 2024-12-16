import UserResident from "../models/userResident.model.js";
import UserAdmin from "../models/userAdmin.model.js";
import { sendResidentAccountApprovedSMS, sendResidentAccountDeclinedSMS } from "../semaphore/sms.js";


export const getResidents = async (req, res) => {
    try {
      const residents = await UserResident.find();
      res.status(200).json({ residents });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
export const approveResident = async (req, res) => {
    try {
        const { id } = req.params;
        const { classification } = req.body;

        // Validate classification
        if (!classification) {
            return res.status(400).json({ 
                message: 'Classification is required for approval.' 
            });
        }

        // Validate classification value
        const validClassifications = ['Regular', 'PWD', 'Pregnant', 'Elderly'];
        if (!validClassifications.includes(classification)) {
            return res.status(400).json({ 
                message: 'Invalid classification value.' 
            });
        }

        const resident = await  UserResident.findByIdAndUpdate(
            id,
            { isApproved: true, classification: classification, isVerified: true },
            { new: true }
        );

        if (!resident) {
            return res.status(404).json({ message: 'Resident not found' });
        }

        await sendResidentAccountApprovedSMS(resident.phone);
        
        res.status(200).json({ 
          success: true, 
          message: 'Resident approved successfully', 
          resident
         });
    } catch (error) {
        res.status(500).json({ 
          succes: false, 
          message: error.message
         });
    }
};

export const declineResident = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Decline reason is required.',
      });
    }

    if (reason.length > 80) {
      return res.status(400).json({
        success: false,
        message: 'Decline reason must be 60 characters or less.',
      });
    }

    const resident = await UserResident.findByIdAndDelete(id);

    if (!resident) {
      return res.status(404).json({ success: false, message: 'Resident not found' });
    }

    // Send SMS notification
    await sendResidentAccountDeclinedSMS(resident.phone, reason);

    res.status(200).json({
      success: true,
      message: 'Resident declined',
      resident: resident,
    });
  } catch (error) {
    console.error('Error in declineResident:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdmins = async (req, res) => {
    try {
      const admins = await UserAdmin.find();
      res.status(200).json({ admins });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
