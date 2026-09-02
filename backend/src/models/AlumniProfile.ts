import mongoose, { Schema, Document } from 'mongoose';

export interface IAlumniProfile extends Document {
  user: mongoose.Types.ObjectId;
  registrationNumber: string;
  batch: string;
  branch: string;
  graduationYear?: string;
  professionalDetails?: {
    jobProfile?: string;
    company?: string;
    jobLocation?: string;
    experience?: string;
    sector?: string;
  };
  locationDetails?: {
    city?: string;
    subDistrict?: string;
    district?: string;
    state?: string;
    pincode?: string;
    fullAddress?: string;
  };
  socialLinks?: {
    github?: string;
    linkedin?: string;
    email?: string;
    instagram?: string;
    phone?: string;
    whatsapp?: string;
  };
  mentorId?: mongoose.Types.ObjectId;
  photoUrl: string;
  videoTestimonialUrl?: string;
  writtenTestimonial?: string;
}

const AlumniProfileSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  registrationNumber: { type: String },
  batch: { type: String },
  branch: { type: String },
  graduationYear: { type: String },
  professionalDetails: {
    jobProfile: { type: String },
    company: { type: String },
    jobLocation: { type: String },
    experience: { type: String },
    sector: { type: String },
  },
  locationDetails: {
    city: { type: String },
    subDistrict: { type: String },
    district: { type: String },
    state: { type: String },
    pincode: { type: String },
    fullAddress: { type: String },
  },
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    email: { type: String },
    instagram: { type: String },
    phone: { type: String },
    whatsapp: { type: String },
  },
  mentorId: { type: Schema.Types.ObjectId, ref: 'User' },
  photoUrl: { type: String, default: 'https://via.placeholder.com/150' },
  videoTestimonialUrl: { type: String },
  writtenTestimonial: { type: String },
});

export default mongoose.model<IAlumniProfile>('AlumniProfile', AlumniProfileSchema);
