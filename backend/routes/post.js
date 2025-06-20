import express from 'express';
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    const post = new Post({ userId: req.user.id, content, imageUrl });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get global feed
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('userId', 'name profilePic');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like (clap) a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.likedBy.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }
    post.likedBy.push(req.user.id);
    post.likeCount += 1;
    await post.save();
    res.json({ likeCount: post.likeCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
