import express from 'express';
import { auth, authorizeRole } from '../middleware/auth';
import SiteContent from '../models/SiteContent';

const router = express.Router();

// GET site content by page name (Public)
router.get('/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const content = await SiteContent.findOne({ page });
    
    if (!content) {
      // Return 404 if no content exists yet so the frontend can use defaults
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT site content (Protected: Coordinators and SuperAdmins)
router.put('/:page', auth, authorizeRole('coordinator', 'superadmin'), async (req, res) => {
  try {
    const { page } = req.params;
    const { data } = req.body;
    const userId = (req as any).user.id;

    if (!data) {
      return res.status(400).json({ message: 'Data is required' });
    }

    let content = await SiteContent.findOne({ page });
    
    if (content) {
      content.data = data;
      content.lastUpdatedBy = userId;
      await content.save();
    } else {
      content = new SiteContent({
        page,
        data,
        lastUpdatedBy: userId
      });
      await content.save();
    }

    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
