import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  likeCount: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikeCount: { type: Number, default: 0 },
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // View count
  viewCount: { type: Number, default: 0 },
  // Mentions: array of mentioned user IDs
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Emoji reactions: { emoji: String, count: Number }
  emojiReactions: [{ emoji: String, count: { type: Number, default: 0 } }],
  // Comments: { user: ObjectId, name: String, text: String, createdAt: Date }
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    text: String,
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
  }]
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
