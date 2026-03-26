const express = require('express');
const multer = require('multer');
const File = require('../models/file');

const router = express.Router();

// Use memory storage in multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Upload a file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Invalid file type' });

    const file = new File({
      filename: req.file.filename,
      originalname: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
      size: req.file.size
    });

    await file.save();
    res.status(201).json({ message: 'File uploaded successfully', fileId: file._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Get all files (metadata only)
router.get('/allfiles', async (req, res) => {
  try {
    const files = await File.find().select('-data'); // Exclude actual data
    if (!files.length) return res.status(404).json({ message: 'No files found' });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving files' });
  }
});

// Get file by ID (download file)
router.get('/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.originalname}"`);
    res.send(file.data);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving file' });
  }
});

// Get metadata only by ID
router.get('/metadata/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id).select('-data');
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving metadata' });
  }
});

module.exports = router;