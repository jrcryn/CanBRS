import express from "express";
const router = express.Router();

import { 
    approveResident,
    declineResident,
    getResidents,
    getAdmins
 } from "../controllers/residents.controller.js";

 import { verifyToken } from '../middleware/verifyToken.js';

 router.put ("/approve-resident/:id", verifyToken, approveResident);

 router.put("/decline-resident/:id", verifyToken, declineResident);

router.get ("/admin-accounts", verifyToken, getAdmins);

 router.get ("/resident-accounts", verifyToken, getResidents);

export default router;