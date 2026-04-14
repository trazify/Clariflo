import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  settings: {
    activeTheme: { type: String, default: 'aurora-mesh' },
    clockFormat: { type: String, default: '12h' },
    quoteCategory: { type: String, default: 'all' },
    alertSound: { type: String, default: 'chime' },
    focusDuration: { type: Number, default: 25 },
    breakDuration: { type: Number, default: 5 },
    longBreakDuration: { type: Number, default: 15 },
    musicUrl: { type: String, default: '' }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
