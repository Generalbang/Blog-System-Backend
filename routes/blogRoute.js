const express = require("express");
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");
const { upload, renameImage } = require("../utils/imageFeatures");

const router = express.Router();

router
  .route("/")
  .get(blogController.getAllBlog)
  .post(
    authController.protect,
    upload.single("thumbnail"),
    renameImage,
    blogController.createBlog
  );

router.use(authController.protect);
router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

module.exports = router;
