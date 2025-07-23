const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://shivamsharma27107:simplepass123@cluster0.ll4gdko.mongodb.net/neorecruiter?retryWrites=true&w=majority&appName=Cluster0';
    
    // Set up connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout to 30s
      maxPoolSize: 10, // Maintain up to 10 socket connections
      connectTimeoutMS: 30000, // Connection timeout
      socketTimeoutMS: 45000, // Socket timeout
    };
    
    // Connect to MongoDB
    await mongoose.connect(mongoURI, options);
    
    console.log('MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; // Rethrow to handle at application level
  }
};

module.exports = connectToDatabase;