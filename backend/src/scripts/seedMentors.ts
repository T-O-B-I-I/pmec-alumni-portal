import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load models
import User from '../models/User';
import MentorProfile from '../models/MentorProfile';

// Load env vars
dotenv.config();

const FACULTY_JSON_PATH = 'C:/Users/DELL/.gemini/antigravity-ide/brain/177515be-71e3-422a-a08c-b3466d8604da/scratch/faculty.json';

async function seed() {
  try {
    const rawData = fs.readFileSync(FACULTY_JSON_PATH, 'utf8');
    const faculties = JSON.parse(rawData);
    console.log(`Loaded ${faculties.length} faculties.`);

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni_portal');
    console.log('Connected to MongoDB');

    let addedCount = 0;
    let existingCount = 0;

    for (const faculty of faculties) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: faculty.email });
      if (existingUser) {
        existingCount++;
        continue;
      }

      // Extract first name for password
      // Remove common titles: Dr., Mr., Ms., Mrs., Miss., Prof.
      const titleRegex = /^(Dr\.|Mr\.|Ms\.|Mrs\.|Miss\.|Prof\.)\s+/i;
      const cleanName = faculty.name.replace(titleRegex, '').trim();
      
      // Get the first word and lowercase it
      const firstName = cleanName.split(/\s+/)[0].toLowerCase();
      const rawPassword = `${firstName}123`;
      
      console.log(`Adding ${faculty.name} with password ${rawPassword}`);
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(rawPassword, salt);

      // Create User
      const user = new User({
        name: faculty.name,
        email: faculty.email,
        passwordHash: hashedPassword,
        role: 'mentor',
        isVerified: true // Assume faculties are pre-verified
      });

      await user.save();

      // Create Mentor Profile
      const mentorProfile = new MentorProfile({
        user: user._id,
        branch: faculty.department,
        specialization: faculty.areasOfInterest || faculty.designation
      });

      await mentorProfile.save();
      addedCount++;
    }

    console.log(`Seed completed. Added ${addedCount} mentors. Skipped ${existingCount} existing.`);
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
