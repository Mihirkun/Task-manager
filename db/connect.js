const mongoose = require('mongoose');
// const connctionString = 'mongodb://localhost:27017/Task';

const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
