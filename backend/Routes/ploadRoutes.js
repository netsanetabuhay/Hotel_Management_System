const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { upload, handleUploadErrors } = require('../Middleware/upload');
const uploadController = require('../Controllers/uploadController');
const { authenticate, authorize } = require('../Middleware/auth');

// Public route to serve uploaded images
router.get('/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;
    const safeType = ['food', 'rooms', 'temp'].includes(type) ? type : 'temp';
    const filePath = path.join(__dirname, '..', 'uploads', safeType, filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error serving image' });
  }
});

// Protected upload routes
router.use(authenticate);

// Upload single image
router.post('/single',
  authorize(['admin']),
  upload.single('image'),
  handleUploadErrors,
  uploadController.uploadImage
);

// Upload multiple images
router.post('/multiple',
  authorize(['admin']),
  upload.array('images', 10), // Max 10 images
  handleUploadErrors,
  uploadController.uploadMultipleImages
);

// Delete image
router.delete('/:filename',
  authorize(['admin']),
  uploadController.deleteImage
);

module.exports = router;