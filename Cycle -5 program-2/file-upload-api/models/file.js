const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,         // Name of file in DB
  originalname: String,     // Original uploaded file name
  contentType: String,      // MIME type (image/png, image/jpeg, etc.)
  data: Buffer,             // Actual binary file data
  size: Number              // File size in bytes
});

module.exports = mongoose.model('File', fileSchema);