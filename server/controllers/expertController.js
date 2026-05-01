import Expert from '../models/Expert.js';

// GET /experts?page=1&limit=6&search=John&category=Tech
export const getExperts = async (req, res, next) => {
  try {
    const { page = 1, limit = 6, search = '', category = '' } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;

    const total = await Expert.countDocuments(filter);
    const experts = await Expert.find(filter)
      .select('-availableSlots') // Don't send slots in list view (heavy data)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ rating: -1 });

    res.json({
      experts,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// GET /experts/:id
export const getExpertById = async (req, res, next) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ message: 'Expert not found' });
    res.json(expert);
  } catch (err) {
    next(err);
  }
};