import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String, 
    required: true,
    unique: true
  },
  username: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  photoUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

export default mongoose.model('User', userSchema);