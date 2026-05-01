import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },   // "YYYY-MM-DD"
    times: [{ type: String }],                // ["09:00", "10:00", ...]
  },
  { _id: false }
);

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    experience: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 4.5, min: 1, max: 5 },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    availableSlots: [slotSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Expert', expertSchema);