import express from 'express';
import Post from '../models/Post.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { content, imageUrl } = req.body;
    // Extract @mentions
    const mentionUsernames = (content.match(/@\w+/g) || []).map(m => m.slice(1));
    const mentionedUsers = await User.find({ name: { $in: mentionUsernames } });
    const mentions = mentionedUsers.map(u => u._id);
    const post = new Post({ userId: req.user.id, content, imageUrl, mentions });
    await post.save();
    console.log(`[CREATE POST] User ${req.user.id} created post ${post._id} with mentions:`, mentions);
    res.status(201).json(post);
  } catch (err) {
    console.error('[CREATE POST ERROR]', err);
    res.status(500).json({ message: err.message });
  }
});

// Get global feed or posts by IDs
router.get('/', async (req, res) => {
  try {
    if (req.query.ids) {
      const ids = req.query.ids.split(',');
      const posts = await Post.find({ _id: { $in: ids } }).populate('userId', 'name profilePic');
      return res.json(posts);
    }
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
    post.likeCount += 1;
    await post.save();
    res.json({ likeCount: post.likeCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dislike a post
router.post('/:id/dislike', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.dislikeCount += 1;
    await post.save();
    res.json({ dislikeCount: post.dislikeCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increment view count
router.post('/:id/view', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ viewCount: post.viewCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add emoji reaction
router.post('/:id/emoji', auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    let reaction = post.emojiReactions.find(r => r.emoji === emoji);
    if (!reaction) {
      reaction = { emoji, users: [] };
      post.emojiReactions.push(reaction);
    }
    if (!reaction.users.map(u => u.toString()).includes(req.user.id)) {
      reaction.users.push(req.user.id);
      await post.save();
      console.log(`[EMOJI] User ${req.user.id} reacted to post ${post._id} with ${emoji}`);
    }
    res.json({ emojiReactions: post.emojiReactions });
  } catch (err) {
    console.error('[EMOJI ERROR]', err);
    res.status(500).json({ message: err.message });
  }
});

// Remove emoji reaction
router.post('/:id/emoji/remove', auth, async (req, res) => {
  try {
    const { emoji } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    let reaction = post.emojiReactions.find(r => r.emoji === emoji);
    if (reaction) {
      reaction.users = reaction.users.filter(u => u.toString() !== req.user.id);
      await post.save();
      console.log(`[EMOJI REMOVE] User ${req.user.id} removed reaction ${emoji} from post ${post._id}`);
    }
    res.json({ emojiReactions: post.emojiReactions });
  } catch (err) {
    console.error('[EMOJI REMOVE ERROR]', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
