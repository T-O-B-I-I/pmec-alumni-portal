import express from 'express';
import User from '../models/User';

const router = express.Router();

// Get all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('name email _id');
    res.json(mentors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
