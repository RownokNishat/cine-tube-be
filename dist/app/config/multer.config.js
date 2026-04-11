import multer from "multer";
// Use memory storage so files are available as req.file.buffer
// for manual upload to Cloudinary v2 via uploadFileToCloudinary()
export const multerUpload = multer({ storage: multer.memoryStorage() });
//# sourceMappingURL=multer.config.js.map