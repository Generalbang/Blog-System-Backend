const factoryCode = require("./factoryController");
const Blog = require("../models/blogModel");

exports.getAllBlog = factoryCode.getAll(Blog);
exports.getBlog = factoryCode.getOne(Blog, { path: "comments" });
exports.createBlog = factoryCode.createOne(Blog);
exports.updateBlog = factoryCode.updateOne(Blog);
exports.deleteBlog = factoryCode.deleteOne(Blog);
