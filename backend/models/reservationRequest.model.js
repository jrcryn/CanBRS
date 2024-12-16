import mongoose from 'mongoose';

const ReservationRequestSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserResident',
    required: true,
  },
  resources: [
    {
      resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  purpose: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  appointmentDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Declined', 'In-Use', 'Returned'],
    default: 'Pending',
  },
  initialRemarks: { //remarks once reservation marked in-use
    type: String,
  },
  returnedRemarks: { //remarks once reservation marked returned
    type: String,
  },
  adminMessage: { //message from admin to resident once approved/declined, can be for additional requirements or declined reason
    type: String,
  }
}, {
  timestamps: true,
});

const ReservationRequest = mongoose.model('ReservationRequest', ReservationRequestSchema);

export default ReservationRequest;