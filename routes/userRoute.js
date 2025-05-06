const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { upload, resizeImage } = require("../utils/imageFeatures");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

router.use(authController.protect);
router.patch(
  "/update-profile",
  upload.single("photo"),
  resizeImage,
  authController.userInfoUpdate
);
router.patch("/update-password", authController.updateUserPassword);

router.use(authController.restrictTo("admin"));
router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
