import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  viewCount: { type: Number, default: 0 },
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  emojiReactions: [{ emoji: String, count: { type: Number, default: 0 } }],

  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    text: String,
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
  }]
}, { timestamps: true });

// Add unique compound index to prevent duplicate posts
postSchema.index({ userId: 1, content: 1 }, { unique: true });

export default mongoose.model('Post', postSchema);
