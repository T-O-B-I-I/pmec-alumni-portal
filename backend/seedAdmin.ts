import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni_portal');
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@pmec.edu' });
    if (existingAdmin) {
      console.log('Super Admin already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    const superAdmin = new User({
      name: 'Super Admin',
      email: 'admin@pmec.edu',
      passwordHash,
      role: 'superadmin'
    });

    await superAdmin.save();
    console.log('Super Admin seeded successfully! (admin@pmec.edu / admin123)');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding super admin:', err);
    process.exit(1);
  }
};

seedSuperAdmin();
