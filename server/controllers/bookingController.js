import Booking from '../models/Booking.js';

// POST /bookings
export const createBooking = async (req, res, next) => {
  try {
    const { expertId, name, email, phone, date, timeSlot, notes } = req.body;

    // Basic validation
    if (!expertId || !name || !email || !phone || !date || !timeSlot) {
      return res.status(400).json({ message: 'All fields (expertId, name, email, phone, date, timeSlot) are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const booking = await Booking.create({ expertId, name, email, phone, date, timeSlot, notes });

    // Broadcast real-time slot update to all connected clients
    req.io.emit('slotBooked', { expertId, date, timeSlot });

    res.status(201).json(booking);
  } catch (err) {
    // MongoDB duplicate key error (code 11000) = slot already booked
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'This slot is already booked. Please choose a different time.',
      });
    }
    next(err);
  }
};

// PATCH /bookings/:id/status
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// GET /bookings?email=user@example.com
export const getBookingsByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'email query parameter is required.' });

    const bookings = await Booking.find({ email: email.toLowerCase() })
      .populate('expertId', 'name category avatar')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};