// middleware/upload.js
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// Memory storage (no raw file saved)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) cb(null, true);
  else cb(new Error("Only jpeg, jpg, or png images allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Resize and save image to disk
const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${req.user.name}-${Date.now()}.jpeg`;
  const outputPath = path.join("image/user", filename);

  try {
    await sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    // Attach new filename to req.file for use in controller
    req.file.filename = filename;
    next();
  } catch (err) {
    next(err);
  }
};

// Rename and save image to disk
const renameImage = async (req, res, next) => {
  if (!req.file) return next();

  const filename = `article-${req.body.title}-${Date.now()}.jpeg`;
  const outputPath = path.join("image/article", filename);

  try {
    await sharp(req.file.buffer)
      // .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    // Attach new filename to req.file for use in controller
    req.file.filename = filename;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, resizeImage, renameImage };
