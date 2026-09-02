import express from 'express';
// Reloading backend due to UTF-16 fix in .env
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

import authRoutes from './routes/auth';
import alumniRoutes from './routes/alumniRoutes';
import adminRoutes from './routes/adminRoutes';
import mentorRoutes from './routes/mentorRoutes';
import superAdminRoutes from './routes/superAdminRoutes';
import contentRoutes from './routes/contentRoutes';
import noticeRoutes from './routes/noticeRoutes';
import path from 'path';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni_portal')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/notices', noticeRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
