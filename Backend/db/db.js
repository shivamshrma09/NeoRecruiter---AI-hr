const mongoose = require('mongoose');
const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/neorecruiterDatabase';
    console.log('Connecting to MongoDB:', mongoURI);
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(mongoURI, options);
    console.log('✅ MongoDB connected successfully');
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Using fallback mode - data will not persist');
    return null;
  }
};
module.exports = connectToDatabase;
