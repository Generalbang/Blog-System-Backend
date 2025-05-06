const express = require("express");
const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
const cors = require("cors");

const blogRouter = require("./routes/blogRoute");
const commentRouter = require("./routes/commentRoute");
const userRouter = require("./routes/userRoute");

const app = express();
app.use(express.json());

// implement CORS
app.use(cors());

app.use("/image", express.static("image"));

app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/user", userRouter);

const port = process.env.PORT || 8000;
const LOCAL_DB_URL = "mongodb://localhost:27017/blog";
const DB_URL =
  process.env.DATABASE?.replace("<db_password>", process.env.DB_PASSWORD) ||
  LOCAL_DB_URL;

mongoose
  .connect(DB_URL)
  .then(console.log(`Database connected successfully!!!. To url:${DB_URL}`));

app.listen(port, () => {
  console.log(`app connected successfully!!!. To port ${port}`);
});
