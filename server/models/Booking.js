import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true },      // "YYYY-MM-DD"
    timeSlot: { type: String, required: true },  // "09:00"
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);


// MongoDB will reject a duplicate insert at the database level.
bookingSchema.index({ expertId: 1, date: 1, timeSlot: 1 }, { unique: true });

export default mongoose.model('Booking', bookingSchema);