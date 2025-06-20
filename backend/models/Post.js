import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  likeCount: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikeCount: { type: Number, default: 0 },
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
