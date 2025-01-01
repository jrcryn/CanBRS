import express from 'express';
import multer from 'multer';
import { deleteListing, getListing, createListing, updateListing } from '../controllers/listing.controller.js';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});

const upload = multer({ storage });
//we will have all of the end points in this file 
router.get("/listing", getListing);

router.post('/create-listing', upload.single('image'), createListing);

router.put("/update-listing/:id", upload.single('image'), updateListing);

router.delete("/delete-listing/:id", deleteListing);

export default router; 