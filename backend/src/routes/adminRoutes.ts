import express from 'express';
import { auth, authorizeRole } from '../middleware/auth';
import User from '../models/User';
import AlumniProfile from '../models/AlumniProfile';
import exceljs from 'exceljs';

const router = express.Router();

// Middleware to ensure user is a coordinator (admin) or superadmin
router.use(auth, authorizeRole('coordinator', 'superadmin'));

// Export Alumni Data to Excel
router.get('/export', async (req, res) => {
  try {
    const alumni = await AlumniProfile.find().populate('user', 'name email');
    
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Alumni Data');
    
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Registration Number', key: 'regNo', width: 20 },
      { header: 'Branch', key: 'branch', width: 20 },
      { header: 'Batch', key: 'batch', width: 15 },
      { header: 'Company', key: 'company', width: 25 },
      { header: 'Job Profile', key: 'jobProfile', width: 25 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Phone', key: 'phone', width: 15 }
    ];

    alumni.forEach(profile => {
      worksheet.addRow({
        name: (profile.user as any)?.name || 'N/A',
        email: (profile.user as any)?.email || 'N/A',
        regNo: profile.registrationNumber,
        branch: profile.branch,
        batch: profile.batch,
        company: profile.professionalDetails?.company,
        jobProfile: profile.professionalDetails?.jobProfile,
        city: profile.locationDetails?.city,
        phone: profile.socialLinks?.phone
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + 'alumni_data.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error generating excel:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

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
