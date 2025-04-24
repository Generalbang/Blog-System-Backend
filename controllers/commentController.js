const factoryCode = require("./factoryController");
const Comment = require("../models/commentModel");

exports.getAllComment = factoryCode.getAll(Comment);
exports.getComment = factoryCode.getOne(Comment);
exports.createComment = factoryCode.createOne(Comment);
exports.updateComment = factoryCode.updateOne(Comment);
exports.deleteComment = factoryCode.deleteOne(Comment);
