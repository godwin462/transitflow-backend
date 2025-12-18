import { memoryStorage } from 'multer';

export const imageUploadOptions = {
  // 1. Where to save the files temporarily
  storage: memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
  // Optional: file filter for security (e.g., only allow images)
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
};
