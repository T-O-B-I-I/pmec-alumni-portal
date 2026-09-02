import mongoose from 'mongoose';

const mentorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  yearOfJoining: {
    type: String,
    required: false
  },
  mobileNumber: {
    type: String,
    required: false
  },
  branch: {
    type: String,
    required: false
  },
  specialization: {
    type: String,
    required: false
  },
  photoUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
}, { timestamps: true });

const MentorProfile = mongoose.model('MentorProfile', mentorProfileSchema);

export default MentorProfile;
