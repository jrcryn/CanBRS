import mongoose from "mongoose";

const UserAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sitio: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    profilePicture: {
        data: Buffer,
        contentType: String,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    }, 
    resetPasswordToken: String, //for resetting password
    resetPasswordTokenExpiresAt: Date, //for resetting password, with an expiration date
    verificationToken: String, //for email verification
    verificationTokenExpiresAt: Date,  //for email verification, with an expiration date
    loginOtp: String, //for two-factor authentication
    loginOtpExpiresAt: Date, //for two-factor authentication, with an expiration date
}, {
    timestamps: true // createdAt and updatedAt fields
});

const UserAdmin = mongoose.model('UserAdmin', UserAdminSchema);

export default UserAdmin;