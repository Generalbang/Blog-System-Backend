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

app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/user", userRouter);

const port = process.env.PORT || 8000;
const DB_URL = "mongodb://localhost:27017/blog";

mongoose
  .connect(DB_URL)
  .then(console.log(`Database connected successfully!!!. To url:${DB_URL}`));

app.listen(port, () => {
  console.log(`app connected successfully!!!. To port ${port}`);
});
