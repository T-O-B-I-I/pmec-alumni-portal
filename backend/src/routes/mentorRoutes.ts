import express from 'express';
import multer from 'multer';
import path from 'path';
import User from '../models/User';
import MentorProfile from '../models/MentorProfile';
import { auth, authorizeRole } from '../middleware/auth';

import fs from 'fs';

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

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
router.post('/profile', auth, authorizeRole('mentor'), upload.single('photo'), async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { yearOfJoining, mobileNumber, branch, specialization } = req.body;

    let profile = await MentorProfile.findOne({ user: userId });
    
    const updateData: any = {
      user: userId,
      yearOfJoining,
      mobileNumber,
      branch,
      specialization
    };

    if (req.file) {
      updateData.photoUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.photoUrl) {
      updateData.photoUrl = req.body.photoUrl;
    }
    
    if (profile) {
      profile = await MentorProfile.findOneAndUpdate(
        { user: userId },
        { $set: updateData },
        { new: true }
      );
    } else {
      profile = new MentorProfile(updateData);
      await profile.save();
    }

    res.json(profile);
  } catch (err: any) {
    console.error('Mentor profile save error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Get all mentor profiles (for directory)
router.get('/directory', async (req, res) => {
  try {
    const profiles = await MentorProfile.find().populate('user', 'name email role');
    res.json(profiles);
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

// Get mentor profile by User ID (Public)
router.get('/public/:userId', async (req, res) => {
  try {
    const profile = await MentorProfile.findOne({ user: req.params.userId }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
