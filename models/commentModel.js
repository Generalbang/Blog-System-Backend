const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      required: [true, "Review can not be empty!"],
    },
    // likes: {
    //   type: Number,
    //   default: 0,
    // },
    // dislikes: {
    //   type: Number,
    //   default: 0,
    // },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "News must belong to an article"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "News must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// commentSchema.index({ article: 1, author: 1 }, { unique: true });

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;
