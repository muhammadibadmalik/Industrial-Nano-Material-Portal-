const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌  MONGO_URI is missing in your .env file');
    process.exit(1);
  }

  const options = {
    serverSelectionTimeoutMS: 10000, // 10 s — stop waiting if Atlas unreachable
    socketTimeoutMS: 45000,
    family: 4,                        // force IPv4 — fixes most DNS/network issues
  };

  try {
    const conn = await mongoose.connect(uri, options);
    console.log(`✅  MongoDB connected → ${conn.connection.host}`);
  } catch (error) {
    console.error('❌  MongoDB connection failed:', error.message);

    // Give the developer a helpful hint
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.error('');
      console.error('💡  Atlas DNS lookup failed. Try one of these fixes:');
      console.error('    1. Switch to local MongoDB:');
      console.error('       Change MONGO_URI in .env to: mongodb://127.0.0.1:27017/nanocal');
      console.error('       Then run: mongod  (in a separate terminal)');
      console.error('    2. Atlas → Network Access → Add your current IP address');
      console.error('    3. Change DNS to 8.8.8.8 / 1.1.1.1 in your network settings');
      console.error('');
    }

    process.exit(1);
  }
};

module.exports = connectDB;
