import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '/default-avatar.svg' },
  bio: { type: String, default: '' },
  // Badges for user achievements
  badges: [{ type: String }],
  // Users this user is following
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Users following this user
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Saved/bookmarked posts (REMOVED)
  // savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
