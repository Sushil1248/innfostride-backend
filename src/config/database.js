const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Succesfuly connected with Database!!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // More specific details of an error for a future debugging
    if (error.name === 'MongoNetworkError') {
      console.error('MongoDB is not reachable. Check your network connection.');
    } else if (error.name === 'MongoTimeoutError') {
      console.error('MongoDB connection timed out. Check your MongoDB server.');
    } else if (error.name === 'ValidationError') {
      console.error('Validation error:', error.message);
    } else {
      console.error('An unexpected error occurred.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;