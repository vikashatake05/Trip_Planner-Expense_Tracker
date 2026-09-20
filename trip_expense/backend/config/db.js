const mongoose = require('mongoose');
const dns = require('dns');

// Fix Node.js DNS resolution on Windows (bypasses local router DNS blocking SRV records)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignore if fallback fails
}
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

/**
 * Connect to MongoDB Atlas using Mongoose
 */
const connectDB = async () => {
  const mongoURI = (process.env.MONGO_URI || '').trim();

  if (!mongoURI || mongoURI.includes('<username>')) {
    console.log('⚠️  MONGO_URI not set or contains placeholders in backend/.env');
    console.log('👉 Please add your MongoDB Atlas connection string to backend/.env:');
    console.log('   MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/tripledger?retryWrites=true&w=majority');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not crash server process so user can inspect endpoints or paste connection string
  }
};

module.exports = connectDB;
