import express from 'express';
import multer from 'multer';
import path from 'path';
import AlumniProfile from '../models/AlumniProfile';
import User from '../models/User';
import { auth, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get public stats (alumni count, mentors count)
router.get('/stats/public', async (req, res) => {
  try {
    const alumniCount = await AlumniProfile.countDocuments();
    const mentorsCount = await User.countDocuments({ role: 'mentor' });
    
    // Calculate unique companies
    const uniqueCompanies = await AlumniProfile.distinct('company');
    const companiesCount = uniqueCompanies.filter(c => c && c.trim() !== '').length;

    res.json({
      alumniCount,
      mentorsCount,
      companiesCount
    });
  } catch (err) {
    console.error('Error fetching public stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all alumni (with optional search and filter)
router.get('/', async (req, res) => {
  try {
    const { search, batch, branch, company } = req.query;
    
    // Build filter query
    let query: any = {};
    
    if (batch) query.batch = batch;
    if (branch) query.branch = branch;
    if (company) query['professionalDetails.company'] = new RegExp(company as string, 'i');
    
    // We will do text matching manually after fetching to include populated user names
    const profiles = await AlumniProfile.find(query).populate('user', 'name email role');
    
    // If search by name is needed, we filter in memory after populate
    let filteredProfiles = profiles;
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredProfiles = profiles.filter(profile => {
        const user = profile.user as any;
        const nameMatch = user?.name?.toLowerCase().includes(searchLower);
        const roleMatch = profile.professionalDetails?.jobProfile?.toLowerCase().includes(searchLower);
        const compMatch = profile.professionalDetails?.company?.toLowerCase().includes(searchLower);
        const cityMatch = profile.locationDetails?.city?.toLowerCase().includes(searchLower);
        const stateMatch = profile.locationDetails?.state?.toLowerCase().includes(searchLower);
        
        return nameMatch || roleMatch || compMatch || cityMatch || stateMatch;
      });
    }

    res.json(filteredProfiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create or update current user's profile
router.post('/profile', auth, upload.single('photo'), async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    
    // Since we are using FormData, complex objects might come as strings or need manual parsing
    let profileData: any = { user: userId };
    
    // Helper to safely parse JSON strings from form data
    const safeParse = (str: string | undefined) => {
      if (!str) return undefined;
      try { return JSON.parse(str); } catch { return undefined; }
    };

    // Extract basic fields
    if (req.body.registrationNumber !== undefined) profileData.registrationNumber = req.body.registrationNumber;
    if (req.body.batch !== undefined) profileData.batch = req.body.batch;
    if (req.body.branch !== undefined) profileData.branch = req.body.branch;
    if (req.body.graduationYear !== undefined) profileData.graduationYear = req.body.graduationYear;
    
    if (req.body.mentorId !== undefined) {
      if (req.body.mentorId === '') {
        profileData.$unset = { mentorId: 1 };
      } else {
        profileData.mentorId = req.body.mentorId;
      }
    }
    
    // Extract nested objects
    const profDetails = safeParse(req.body.professionalDetails);
    if (profDetails) profileData.professionalDetails = profDetails;
    
    const locDetails = safeParse(req.body.locationDetails);
    if (locDetails) profileData.locationDetails = locDetails;
    
    const socLinks = safeParse(req.body.socialLinks);
    if (socLinks) profileData.socialLinks = socLinks;

    // Handle file upload
    if (req.file) {
      // Create a URL path relative to the server
      profileData.photoUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.photoUrl) {
      profileData.photoUrl = req.body.photoUrl;
    }
    
    let profile = await AlumniProfile.findOne({ user: userId });
    
    if (profile) {
      // Update
      const updateObj: any = { $set: profileData };
      if (profileData.$unset) {
        updateObj.$unset = profileData.$unset;
        delete profileData.$unset;
      }
      
      profile = await AlumniProfile.findOneAndUpdate(
        { user: userId },
        updateObj,
        { new: true }
      );
    } else {
      // Create
      delete profileData.$unset;
      profile = new AlumniProfile(profileData);
      await profile.save();
    }
    
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get profile by User ID (or Profile ID fallback)
router.get('/:id', async (req, res) => {
  try {
    let profile = await AlumniProfile.findOne({ user: req.params.id }).populate('user', 'name email');
    if (!profile) {
      // Fallback in case a Profile ID was passed
      profile = await AlumniProfile.findById(req.params.id).populate('user', 'name email');
    }
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
