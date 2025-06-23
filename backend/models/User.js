import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: '/default-avatar.svg' },
  bio: { type: String, default: '' },

  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });


export default mongoose.model('User', userSchema);
