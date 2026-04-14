import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true
  },
  sessions: {
    type: Number,
    default: 0
  },
  focusMinutes: {
    type: Number,
    default: 0
  },
  tasksCompleted: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// One stat doc per user per day
statSchema.index({ userId: 1, date: 1 }, { unique: true });

const Stat = mongoose.model('Stat', statSchema);
export default Stat;
