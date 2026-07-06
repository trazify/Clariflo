import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    global.isMockDB = false;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection failed: ${error.message}`);
    console.warn(`⚠️ Starting server in local MOCK DB mode (in-memory data storage)...`);
    global.isMockDB = true;
  }
};

export default connectDB;
