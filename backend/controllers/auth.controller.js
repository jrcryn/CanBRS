import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

import UserAdmin from "../models/userAdmin.model.js";
import UserResident from "../models/userResident.model.js";
import RegKey from "../models/regkey.model.js";

import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendPasswordResetEmail, sendResetSuccessEmail, sendLoginOtpEmail } from "../mailtrap/emails.js";
import { sendPasswordResetSMS, sendResetSuccessSMS, sendLoginOtpSMS } from "../semaphore/sms.js";

//CHECK AUTHENTICATION
export const checkAuth = async (req, res) => {
    console.log('checkAuth function called');
    try {
        let user = await UserAdmin.findById(req.userId).select('-password');
        if (!user) {
            user = await UserResident.findById(req.userId).select('-password');
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });

    } catch (error) {
        console.log("error in checking authentication: ", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//GENERATE REGISTRATION KEY
export const generateRegistrationKey = async (req, res) => {
    try {
        const key = crypto.randomBytes(20).toString('hex');
        const newRegKey = new RegKey({ 
          key,
          createdAt: new Date(),
          lastUsed: null,
          usedBy: null
         });
        await newRegKey.save();
        res.status(200).json({ success: true, key: newRegKey });
    } catch (error) {
        console.log("error in generating registration key: ", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//GET REGISTRATION KEYS
export const getRegistrationKeys = async (req, res) => {
  try {
      const keys = await RegKey.find().sort({ createdAt: -1 }); // Get all keys, newest first
      res.status(200).json({ success: true, keys });
  } catch (error) {
      console.log("error in getting registration keys: ", error);
      res.status(500).json({ success: false, message: error.message });
  }
};

//DELETE REGISTRATION KEY
export const deleteRegistrationKey = async (req, res) => {
  try {
      const { keyId } = req.body;
      const key = await RegKey.findByIdAndDelete(keyId);
      if (!key) {
          return res.status(404).json({ success: false, message: 'Registration key not found' });
      }

      res.status(200).json({ success: true, message: 'Registration key deleted successfully' });
  } catch (error) {
      console.log("error in deleting registration key: ", error);
      res.status(500).json({ success: false, message: error.message });
  }
};

//ADMIN SIGNUP
export const signup = async (req, res) => {
    const { name, sitio, email, password, registrationKey } = req.body;
    
    try {

        if (!name || !sitio || !email || !password || !registrationKey) {
            return res.status(400).json({ success: false, message: 'Please provide all fields.' });
        }

        // Check if registration key is valid
        const validKey = await RegKey.findOne({ key: registrationKey });
        if (!validKey) {
            return res.status(400).json({ success: false, message: 'Invalid registration key.' });
        }

        // Check if user already exists in redidents collection
        const userAlreadyExists = await UserResident.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: 'Email provided already exists as a resident .' });
        };

        // Check if user already exists in admin collection
        const userAlreadyExists2 = await UserAdmin.findOne({ email });
        if (userAlreadyExists2) {
            return res.status(400).json({ success: false, message: 'User already exists as an admin.' });
        };
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new UserAdmin({ 
            name, 
            sitio, 
            email, 
            password: hashedPassword,
            role: 'admin',
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
         });

        await sendVerificationEmail(user.email, verificationToken);

        await user.save(); //save user

        validKey.lastUsed = new Date();
        validKey.usedBy = user._id;
        await validKey.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);

        res.status(201).json({ 
            success: true, 
            message: 'User created successfully', 
            user: {
                ...user._doc,
                password: undefined,
            } 
        });

    } catch (error) {
        console.log("error in signing up: ", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//RESIDENT SIGNUP
export const residentSignup = async (req, res) => {
    const {
      firstname,
      middlename,
      lastname,
      suffix,
      birthdate,
      blknum,
      lotnum,
      sitio,
      phone,
      password,
      validIdNumber,
      gender,
    } = req.body;

    // Fetch the files
    const validIDfrontPath = req.files['validIDfront'] ? req.files['validIDfront'][0] : null;
    const validIDbackPath = req.files['validIDback'] ? req.files['validIDback'][0] : null;
    const selfiePath = req.files['selfie'] ? req.files['selfie'][0] : null;

    // Read file data
    const validIDfrontData = fs.readFileSync(validIDfrontPath.path, 'base64');
    const validIDbackData = fs.readFileSync(validIDbackPath.path, 'base64');
    const selfieData = fs.readFileSync(selfiePath.path, 'base64');
  
    try {
      if (
        !firstname ||
        !lastname ||
        !blknum ||
        !lotnum ||
        !sitio ||
        !phone ||
        !password ||
        !validIdNumber ||
        !birthdate ||
        !gender ||
        !req.files['validIDfront'] ||
        !req.files['validIDback'] ||
        !req.files['selfie']
      ) {
        return res
          .status(400)
          .json({ success: false, message: 'Please provide all required fields.' });
      }
  
  
      // Check if user already exists in redidents collection
      const userAlreadyExists = await UserResident.findOne({ $or: [{ firstname }, { lastname }, { phone }] });
      if (userAlreadyExists) {
        return res.status(400).json({ success: false, message: 'User already exists as a resident.' });
      };
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new UserResident({
        firstname,
        middlename,
        lastname,
        suffix,
        birthdate,
        blknum,
        lotnum,
        sitio,
        phone,
        password: hashedPassword,
        validIdNumber,
        gender,
        role: 'resident',
        validIDfront: {
          data: validIDfrontData,
          contentType: validIDfrontPath.mimetype,
        },
        validIDback: {
          data: validIDbackData,
          contentType: validIDbackPath.mimetype,
        },
        selfie: {
          data: selfieData,
          contentType: selfiePath.mimetype,
        },
        isAppproved: false,
      });


      await user.save();

      // Delete the files after processing
      fs.unlinkSync(validIDfrontPath.path);
      fs.unlinkSync(validIDbackPath.path);
      fs.unlinkSync(selfiePath.path);

      //jwt
      generateTokenAndSetCookie(res, user._id);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      console.log('Error in residentSignup: ', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

//VERIFY EMAIL OR PHONE UPON ACCOUNT CREATION
export const verifySignup = async (req, res) => {
    const { code } = req.body;

    try {
        //chedck admin collection
        const user = await UserAdmin.findOne({ 
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
         });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
        };


         user.isVerified = true;
         user.verificationToken = undefined; /*once user is verified, set the verification token and expires at 
         to undefined, because there's no point of keeping it anymore*/
         user.verificationTokenExpiresAt = undefined;

         await user.save();

         res.status(200).json({ 
            success: true, 
            message: 'Email verified successfully.',
            user: {
                ...user._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log("error in verifying email: ", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// LOGIN
export const login = async (req, res) => {
    const { identifier, password } = req.body;
  
    try {
      //Try muna find users sa admin collection
      let user = await UserAdmin.findOne({ email: identifier });

      // If not found, try Residents collection
      if (!user) {
        user = await UserResident.findOne({ phone: identifier });
      }
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'Invalid Credentials' });
      }

      // For resident users, check approval status
      if (user instanceof UserResident && !user.isApproved) {
        return res.status(400).json({ 
          success: false, 
          message: 'Account not yet validated and approved by admin' 
        });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(404).json({ success: false, message: 'Invalid Credentials' });
      }

      if (!user.isVerified) {
    
        if (!user.verificationToken || user.verificationTokenExpiresAt < Date.now()) {
        // Generate a new verification token
        user.verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();
        }
  
        await sendVerificationEmail(user.email, user.verificationToken);
    
        return res.status(400).json({ success: false, message: 'Please verify your phone or email first before logging in' });
      }



      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.loginOtp = otp;
      user.loginOtpExpiresAt = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes
      await user.save();
  
      // Send OTP via email or phone
      if (user.email) {
        await sendLoginOtpEmail(user.email, otp); 
      } else if (user.phone) {
        await sendLoginOtpSMS(user.phone, otp);
      }
  
      res.status(200).json({ 
        success: true, 
        message: 'OTP sent',
        userId: user._id
      });
    } catch (error) {
      console.log('Error in login:', error);
      res.status(500).json({ success: false, message: error.message });
    }
};

//VERIFY LOGIN OTP
export const verifyLoginOtp = async (req, res) => {
    const {  userId, otp } = req.body;
  
    try {
      let user = await UserAdmin.findById(userId);

      // If not found, try Residents collection
      if (!user) {
        user = await UserResident.findById(userId);
      }
  
      if (!user || user.loginOtp !== otp || user.loginOtpExpiresAt < Date.now()) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
      }
  
      // Clear OTP fields
      user.loginOtp = undefined;
      user.loginOtpExpiresAt = undefined;
      await user.save();
  
      // Generate JWT and set cookie
      generateTokenAndSetCookie(res, user._id);

      res.status(200).json({ 
        success: true, 
        message: 'Login successful.',
        user: {
            ...user._doc,
            isVerified: user.isVerified,
            password: undefined,
        }
    });

    } catch (error) {
      console.log('Error in verifyLoginOtp:', error);
      res.status(500).json({ success: false, message: error.message });
    }
};

//FORGOT PASSWORD EMAIL AND DIRECT LINK TO RESET
export const forgotPassword = async (req, res) => {
    const { identifier } = req.body;

    try {
        let user = await UserAdmin.findOne({ email: identifier });

        if (!user) {
          user = await UserResident.findOne({
            $or: [{ email: identifier }, { phone: identifier }],
          });
        }

        if(!user) {
            return res.status(404).json({ success: false, message: 'User not found' }); 
        }

        //generate reset token and set it to the user
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = Date.now() + 10 * 60 * 1000; //10 minutes

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;

        await user.save();
        //for requesting and giving the link to reset password
        if (user.email) {
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`); 
        } else if (user.phone) {
        await sendPasswordResetSMS(user.phone, `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`); 
        }

        res.status(200).json({ success: true, message: 'Password reset link sent successfully' });

    } catch (error) {
        console.log("error in forgotPassword: ", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//ACTUAL RESET PASSWORD CONTROLLER
export const resetPassword = async (req, res) => {

    try {
       const { token } = req.params;
       const { password } = req.body;

       let user = await UserAdmin.findOne({
           resetPasswordToken: token,
           resetPasswordTokenExpiresAt: { $gt: Date.now() },
       });

       if (!user) {
        user = await UserResident.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() },
        });
       }

       if(!user) {
        res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
       }

       //update password
       const hashedPassword = await bcrypt.hash(password, 10);

       user.password = hashedPassword;
       user.resetPasswordToken = undefined;
       user.resetPasswordTokenExpiresAt = undefined;

       await user.save();

       if (user.email) {
        await sendResetSuccessEmail(user.email); 
       } else if (user.phone) {
        await sendResetSuccessSMS(user.phone); 
       }

       res.status(200).json({ success: true, message: 'Password reset successfully' });

    } catch (error) {
        console.log("error in resetPassword: ", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

//ADMIN LOGOUT
export const logout = async (req, res) => {
  res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      path: '/' // Important! Specify the path
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
