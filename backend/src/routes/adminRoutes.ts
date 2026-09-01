import express from 'express';
import { auth, authorizeRole } from '../middleware/auth';
import User from '../models/User';
import AlumniProfile from '../models/AlumniProfile';

const router = express.Router();

// Middleware to ensure user is a coordinator (admin)
router.use(auth, authorizeRole('coordinator'));

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAlumni = await User.countDocuments({ role: 'alumni' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    
    // Aggregate alumni by branch
    const branchStats = await AlumniProfile.aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 } } }
    ]);

    // Aggregate alumni by batch
    const batchStats = await AlumniProfile.aggregate([
      { $group: { _id: '$batch', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      totalUsers,
      totalAlumni,
      totalMentors,
      branchStats,
      batchStats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all users (for management)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a user and their profile
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Delete the user
    await User.findByIdAndDelete(userId);
    
    // Delete their associated profile if it exists
    await AlumniProfile.findOneAndDelete({ user: userId });
    
    res.json({ message: 'User and associated data successfully deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
