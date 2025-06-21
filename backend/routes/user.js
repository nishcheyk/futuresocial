import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user profile
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) return res.status(403).json({ message: 'Unauthorized' });
    const { name, bio, profilePic } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, bio, profilePic }, { new: true }).select('-password');
    console.log(`[PROFILE UPDATE] User ${req.params.id} updated profile:`, { name, bio, profilePic });
    res.json(user);
  } catch (err) {
    console.error('[PROFILE UPDATE ERROR]', err);
    res.status(500).json({ message: err.message });
  }
});

// Follow a user
router.post('/:id/follow', auth, async (req, res) => {
  try {
    if (req.user.id === req.params.id) return res.status(400).json({ message: 'Cannot follow yourself' });
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { following: req.params.id } });
    await User.findByIdAndUpdate(req.params.id, { $addToSet: { followers: req.user.id } });
    console.log(`[FOLLOW] User ${req.user.id} followed ${req.params.id}`);
    res.json({ following: true });
  } catch (err) {
    console.error('[FOLLOW ERROR]', err);
    res.status(500).json({ message: err.message });
  }
});

// Unfollow a user
router.post('/:id/unfollow', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $pull: { following: req.params.id } });
    await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user.id } });
    console.log(`[UNFOLLOW] User ${req.user.id} unfollowed ${req.params.id}`);
    res.json({ following: false });
  } catch (err) {
    console.error('[UNFOLLOW ERROR]', err);
    res.status(500).json({ message: err.message });
  }
});

// Get followers
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'name profilePic');
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log(`[GET FOLLOWERS] User ${req.params.id} has ${user.followers.length} followers`);
    res.json(user.followers);
  } catch (err) {
    console.error('[GET FOLLOWERS ERROR]', err);
    res.status(500).json({ message: err.message });
  }
});

// Get following
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'name profilePic');
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log(`[GET FOLLOWING] User ${req.params.id} is following ${user.following.length} users`);
    res.json(user.following);
  } catch (err) {
    console.error('[GET FOLLOWING ERROR]', err);
    res.status(500).json({ message: err.message });
  }
});

// Award a badge (admin or self for demo)
router.post('/:id/badge', auth, async (req, res) => {
  try {
    const { badge } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { $addToSet: { badges: badge } }, { new: true });
    res.json(user.badges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
