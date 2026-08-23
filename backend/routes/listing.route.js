import express from 'express';

import { deleteListing, getListing, createListing, updateListing } from '../controllers/listing.controller.js';

const router = express.Router();


//we will have all of the end points in this file 
router.get("/listing", getListing);

router.post('/create-listing', createListing);

router.put("/update-listing/:id", updateListing);

router.delete("/delete-listing/:id", deleteListing);

export default router; 