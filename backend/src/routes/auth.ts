import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import AlumniProfile from '../models/AlumniProfile';
import { auth, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Delete Own Account Route
router.delete('/me', auth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    
    // Check if it's the hardcoded superadmin
    if (userId === 'superadmin-000') {
      return res.status(403).json({ message: 'Cannot delete super admin account' });
    }

    // Delete user from User model
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete profile if exists
    await AlumniProfile.findOneAndDelete({ user: userId });

    res.json({ message: 'Account and associated profile deleted successfully' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || 'alumni'
    });

    const savedUser = await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({ token, user: { id: savedUser._id, name, email, role: savedUser.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check for hardcoded super admin from .env
    if (email === process.env.SUPERADMIN_EMAIL && password === process.env.SUPERADMIN_PASSWORD) {
      const token = jwt.sign(
        { userId: 'superadmin-000', role: 'superadmin' },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
      );
      return res.json({ token, user: { id: 'superadmin-000', name: 'Super Admin', email, role: 'superadmin' } });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify role if provided
    if (role && user.role !== role) {
      return res.status(400).json({ message: `Account is not registered as a ${role}` });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Change Password Route (Logged in User)
router.post('/change-password', auth, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { oldPassword, newPassword } = req.body;

    if (userId === 'superadmin-000') {
      return res.status(403).json({ message: 'Cannot change super admin password via this endpoint' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Forgot Password Route (Public)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return res.json({ message: 'If an account with that email exists, a reset request has been sent to the coordinators.' });
    }

    user.resetPasswordRequested = true;
    await user.save();

    res.json({ message: 'Password reset request sent to coordinators.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Pending Reset Requests (Coordinator / Superadmin)
router.get('/reset-requests', auth, authorizeRole('coordinator', 'superadmin'), async (req, res) => {
  try {
    const requests = await User.find({ resetPasswordRequested: true }).select('name email role');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Reset Password (Coordinator / Superadmin)
router.post('/reset-password', auth, authorizeRole('coordinator', 'superadmin'), async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Format new password: <FirstName>123
    const firstName = user.name.split(' ')[0].trim();
    const newPassword = `${firstName}123`;

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetPasswordRequested = false;
    await user.save();

    res.json({ message: `Password successfully reset to ${newPassword}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
