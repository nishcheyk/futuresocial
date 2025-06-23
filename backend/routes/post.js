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
      reaction = { emoji, count: 0 };
      post.emojiReactions.push(reaction);
    }
    reaction.count = (reaction.count || 0) + 1;
    await post.save();
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

// Add comment to a post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const user = await User.findById(req.user.id);
    const comment = {
      user: req.user.id,
      name: user.name,
      text,
      createdAt: new Date()
    };
    post.comments.push(comment);
    await post.save();
    res.status(201).json({ comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add comment like endpoint
router.post('/:postId/comment/:commentIdx/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const idx = parseInt(req.params.commentIdx, 10);
    if (isNaN(idx) || !post.comments[idx]) return res.status(404).json({ message: 'Comment not found' });
    post.comments[idx].likes = (post.comments[idx].likes || 0) + 1;
    await post.save();
    res.json({ likes: post.comments[idx].likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
