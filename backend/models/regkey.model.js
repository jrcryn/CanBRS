import mongoose from 'mongoose';

const RegKeySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUsed: {
        type: Date,
        default: null
    },
    usedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAdmin',
        default: null
    }
});

const RegKey = mongoose.model('RegKey', RegKeySchema);

export default RegKey;