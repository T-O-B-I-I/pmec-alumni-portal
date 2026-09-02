import express from 'express';
import { auth, authorizeRole } from '../middleware/auth';
import Notice from '../models/Notice';

const router = express.Router();

// Get all notices (Public)
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).populate('author', 'name role');
    res.json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a new notice (Coordinator or Superadmin only)
router.post('/', auth, authorizeRole('coordinator', 'superadmin'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = (req as any).user.userId;

    const notice = new Notice({
      title,
      content,
      author: authorId
    });

    await notice.save();
    
    // Populate author before returning
    await notice.populate('author', 'name role');
    
    res.status(201).json(notice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a notice (Coordinator or Superadmin only)
router.delete('/:id', auth, authorizeRole('coordinator', 'superadmin'), async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
