const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: String,
  caption: String,
  description: String,
  alt_text: String,
  filename: String,
  filetype: String,
  dimesions: String,
  cloudinary_id: String,
  url: String,
  width: String,
  height: String,
  resource_type: String,
  format: String,
  size: Number, // Size in bytes
  storage_type: {
    type: String,
    enum: ['local', 'cloudinary', 'aws', 'other'],
    default: 'cloudinary',
  },
  author: String,
  domain: String,
  category: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Media', mediaSchema);