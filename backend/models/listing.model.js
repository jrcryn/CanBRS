import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    inventory: {
        type: Number,
        required: function() { return this.type === 'equipment'; },
    },
    address: {
        type: String,
        required: function() { return this.type === 'facility'; },
    },
    type: {
        type: String,
        enum: ['equipment', 'facility'],
        required: true,
    },
    image: {
        data: String,
        contentType: String,
    },
}, {
    timestamps: true,
});

const Listing = mongoose.model('Listing', ListingSchema);

export default Listing;