import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

// Load models
import User from '../models/User';
import MentorProfile from '../models/MentorProfile';

// Load env vars
dotenv.config();

const PHOTOS_JSON_PATH = 'C:/Users/DELL/.gemini/antigravity-ide/brain/177515be-71e3-422a-a08c-b3466d8604da/scratch/faculty_photos.json';

async function updatePhotos() {
  try {
    const rawData = fs.readFileSync(PHOTOS_JSON_PATH, 'utf8');
    const photosData = JSON.parse(rawData);
    console.log(`Loaded ${photosData.length} photo entries.`);

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni_portal');
    console.log('Connected to MongoDB');

    let updatedCount = 0;
    let notFoundCount = 0;

    for (let i = 0; i < photosData.length; i++) {
      const data = photosData[i];
      if (!data.photoUrl) continue;
      
      console.log(`Processing ${i + 1}/${photosData.length}: ${data.email}`);
      const user = await User.findOne({ email: data.email });
      if (!user) {
        console.log(`User not found for email: ${data.email}`);
        notFoundCount++;
        continue;
      }

      const mentorProfile = await MentorProfile.findOne({ user: user._id });
      if (mentorProfile) {
        mentorProfile.photoUrl = data.photoUrl;
        await mentorProfile.save();
        updatedCount++;
      } else {
        console.log(`MentorProfile not found for user: ${data.email}`);
      }
    }

    console.log(`Update completed. Updated ${updatedCount} profiles. ${notFoundCount} users not found.`);
  } catch (error) {
    console.error('Error updating photos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updatePhotos();
