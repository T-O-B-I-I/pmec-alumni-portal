import express from 'express';
import User from '../models/User';
import MentorProfile from '../models/MentorProfile';
import { auth, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Get mentor profile
router.get('/profile', auth, authorizeRole('mentor'), async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    let profile = await MentorProfile.findOne({ user: userId });
    
    if (!profile) {
      // Create empty profile if it doesn't exist
      profile = new MentorProfile({ user: userId });
      await profile.save();
    }
    
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update mentor profile
router.post('/profile', auth, authorizeRole('mentor'), async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { yearOfJoining, mobileNumber, branch, specialization } = req.body;

    let profile = await MentorProfile.findOne({ user: userId });
    
    if (profile) {
      profile.yearOfJoining = yearOfJoining;
      profile.mobileNumber = mobileNumber;
      profile.branch = branch;
      profile.specialization = specialization;
      await profile.save();
    } else {
      profile = new MentorProfile({
        user: userId,
        yearOfJoining,
        mobileNumber,
        branch,
        specialization
      });
      await profile.save();
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all mentors (Public/Alumni)
router.get('/', async (req, res) => {
  try {
    // Fetch all users with mentor role and their associated profiles
    const mentors = await User.find({ role: 'mentor' }).select('name email _id');
    res.json(mentors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
