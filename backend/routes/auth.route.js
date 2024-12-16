import express from 'express';
import multer from 'multer';
const router = express.Router();

import { checkAuth, 
         signup, generateRegistrationKey, getRegistrationKeys , deleteRegistrationKey, residentSignup , verifySignup, 
         login, verifyLoginOtp, forgotPassword, resetPassword,
         logout, 
} from '../controllers/auth.controller.js';

import { verifyToken } from '../middleware/verifyToken.js';

// configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  }, filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });


//verifyToken making the routes protected, utilized also in resident route
router.get("/check-auth", verifyToken, checkAuth) //working backend

router.post(
  "/admin-signup", 
  upload.single('profilePicture'), 
  signup
) //working backend

router.post('/resident-signup', upload.fields([
    { name: 'validIDfront', maxCount: 1 },
    { name: 'validIDback', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
  ]), residentSignup);

router.post("/verify-signup-otp", verifySignup) //working backend

router.post("/generate-registration-key", verifyToken, generateRegistrationKey);

router.get ("/registration-keys", verifyToken, getRegistrationKeys);

router.post ("/delete-registration-key", verifyToken, deleteRegistrationKey);

router.post("/login", login) //working backend

router.post('/verify-login-otp', verifyLoginOtp); //working backend

router.post("/forgot-password", forgotPassword) //working backend

router.post("/reset-password/:token", resetPassword) //working backend

router.post("/logout", logout) //working backend



export default router