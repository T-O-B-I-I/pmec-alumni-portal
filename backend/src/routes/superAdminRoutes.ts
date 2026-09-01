import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { auth, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Ensure only superadmin can access these routes
router.use(auth, authorizeRole('superadmin'));

// Create a new admin-level user (Coordinator or Mentor)
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!['coordinator', 'mentor'].includes(role)) {
      return res.status(400).json({ message: 'Can only create coordinators and mentors' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      passwordHash,
      role
    });

    await user.save();
    
    res.status(201).json({ message: 'User created successfully', user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all admin-level users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['coordinator', 'mentor'] } }).select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete an admin-level user (except alumni)
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Superadmin is only allowed to delete coordinators and mentors
    if (user.role === 'alumni') {
      return res.status(403).json({ message: 'Superadmin cannot delete alumni accounts directly' });
    }
    
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
