const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A news must have a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A news must have a content"],
      trim: true,
    },
    thumbnail: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "A news must have a category"],
      enum: [
        "technology",
        "cryptocurrency",
        "fashion",
        "automobile",
        "politics",
        "food",
        "nature",
        "others",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "News must belong to a user"],
    },
    // comments: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Comment",
    //   // required: [true, "News must belong to a user"],
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate
blogSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "article",
  localField: "_id",
});

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "name photo",
  });
  next();
});

const Blog = new mongoose.model("Blog", blogSchema);

module.exports = Blog;
