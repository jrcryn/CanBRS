import express from 'express';
import { 
    createReservation, 
    getAllReservations, 
    getReservationsForResident, 
    updateReservationAdmin,
    deleteReservationAdmin
} from '../controllers/reservation.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Resident creates a reservation
router.post('/request-form', verifyToken , createReservation);

//Resident gets all reservations
router.get('/track-reservations', verifyToken, getReservationsForResident);

// Admin gets all reservations
router.get('/reservations', verifyToken, getAllReservations);

// Admin updates a reservation
router.put('/reservations/:id', verifyToken, updateReservationAdmin);

//Admin deletes a reservation
router.delete('/reservations/:id', verifyToken, deleteReservationAdmin);


export default router;