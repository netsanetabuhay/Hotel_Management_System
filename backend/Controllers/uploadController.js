const fs = require('fs');
const path = require('path');
const { sendSuccess, sendError } = require('../Utils/response');
const { uploadDirs } = require('../Middleware/upload');

const uploadController = {
  // Upload single image
  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        return sendError(res, 'No file uploaded', 400);
      }

      const uploadType = req.body.uploadType || 'temp';
      const filename = req.file.filename;
      const imageUrl = `/uploads/${uploadType}/${filename}`;
      
      return sendSuccess(res, 'Image uploaded successfully', {
        filename: filename,
        originalname: req.file.originalname,
        image_url: imageUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

    } catch (error) {
      console.error('Upload image error:', error);
      return sendError(res, 'Error uploading image', 500);
    }
  },

  // Upload multiple images
  uploadMultipleImages: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return sendError(res, 'No files uploaded', 400);
      }

      const uploadType = req.body.uploadType || 'temp';
      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        image_url: `/uploads/${uploadType}/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
      }));

      return sendSuccess(res, 'Images uploaded successfully', uploadedFiles);

    } catch (error) {
      console.error('Upload multiple images error:', error);
      return sendError(res, 'Error uploading images', 500);
    }
  },

  // Delete image
  deleteImage: async (req, res) => {
    try {
      const { filename } = req.params;
      const { type = 'temp' } = req.query;

      if (!filename) {
        return sendError(res, 'Filename is required', 400);
      }

      const filePath = path.join(__dirname, '..', uploadDirs[type] || uploadDirs.temp, filename);

      if (!fs.existsSync(filePath)) {
        return sendError(res, 'Image not found', 404);
      }

      fs.unlinkSync(filePath);

      return sendSuccess(res, 'Image deleted successfully');

    } catch (error) {
      console.error('Delete image error:', error);
      return sendError(res, 'Error deleting image', 500);
    }
  },

  // Get image full path
  getImageFullPath: (filename, type = 'temp') => {
    return path.join(uploadDirs[type], filename);
  },

  // Get image URL
  getImageUrl: (filename, type = 'temp') => {
    return `/uploads/${type}/${filename}`;
  }
};

module.exports = uploadController;