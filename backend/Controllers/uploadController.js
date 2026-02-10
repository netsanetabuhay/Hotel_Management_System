const fs = require('fs');
const path = require('path');

const uploadController = {
  // Upload single image
  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const uploadType = req.body.uploadType || 'temp';
      const filename = req.file.filename;
      const imageUrl = `/uploads/${uploadType}/${filename}`;
      
      return res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          filename: filename,
          originalname: req.file.originalname,
          image_url: imageUrl,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });

    } catch (error) {
      console.error('Upload image error:', error);
      return res.status(500).json({
        success: false,
        error: 'Error uploading image'
      });
    }
  },

  // Upload multiple images
  uploadMultipleImages: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No files uploaded'
        });
      }

      const uploadType = req.body.uploadType || 'temp';
      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        image_url: `/uploads/${uploadType}/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
      }));

      return res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: uploadedFiles
      });

    } catch (error) {
      console.error('Upload multiple images error:', error);
      return res.status(500).json({
        success: false,
        error: 'Error uploading images'
      });
    }
  },

  // Delete image
  deleteImage: async (req, res) => {
    try {
      const { filename } = req.params;
      const { type = 'temp' } = req.query;

      if (!filename) {
        return res.status(400).json({
          success: false,
          error: 'Filename is required'
        });
      }

      const filePath = path.join(__dirname, '..', 'uploads', type, filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          error: 'Image not found'
        });
      }

      fs.unlinkSync(filePath);

      return res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });

    } catch (error) {
      console.error('Delete image error:', error);
      return res.status(500).json({
        success: false,
        error: 'Error deleting image'
      });
    }
  }
};

module.exports = uploadController;