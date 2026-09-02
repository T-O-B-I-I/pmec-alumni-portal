import express from 'express';
import Notice from '../models/Notice';
import { auth, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Get all notices (Public)
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 }).populate('author', 'name email');
    res.json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a notice (Coordinator/SuperAdmin)
router.post('/', auth, authorizeRole('coordinator', 'superadmin'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = (req as any).user.userId;
    
    const notice = new Notice({
      title,
      content,
      author,
      date: new Date()
    });

    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a notice (Coordinator/SuperAdmin)
router.delete('/:id', auth, authorizeRole('coordinator', 'superadmin'), async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
