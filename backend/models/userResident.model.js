import mongoose from "mongoose";

const UserResidentSchema = new mongoose.Schema({
    validIDfront: {
        data: String, //Bass64 encoded image
        contentType: String,
    },
    validIDback: {
        data: String, //Bass64 encoded image
        contentType: String,
    },
    validIdNumber: {
        type: Number,
        required: true
    },
    selfie: {
        data: String, //Bass64 encoded image
        contentType: String,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false
    }, 
    classification: {
        type: String,
        enum: ['Regular', 'PWD', 'Pregnant', 'Elderly'],
    },
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String
    },
    lastname: {
        type: String,
        required: true,
    },
    suffix: {
        type: String
    },

    birthdate: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },

    blknum: {
        type: String,
        required: true
    },
    lotnum: {
        type: String,
        required: true
    },
    sitio: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
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
    resetPasswordToken: String, //for resetting password
    resetPasswordTokenExpiresAt: Date, //for resetting password, with an expiration date
    verificationToken: String, //for email or number verification
    verificationTokenExpiresAt: Date, //for email or number verification
    loginOtp: String, //for two-factor authentication, via number or email
    loginOtpExpiresAt: Date, //for two-factor authentication, with an expiration date
}, {
    timestamps: true // createdAt and updatedAt fields
});

UserResidentSchema.pre('save', function(next){
    if (!this.email && !this.phone) {
        throw new Error('Please provide either an email or phone number.');
    } else {
    next();
    }
})

const UserResident = mongoose.model('UserResident', UserResidentSchema);

export default UserResident;