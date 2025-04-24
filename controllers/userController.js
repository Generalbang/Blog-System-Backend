const factoryCode = require("./factoryController");
const User = require("../models/userModel");

exports.getAllUser = factoryCode.getAll(User);
exports.getUser = factoryCode.getOne(User);
exports.createUser = factoryCode.createOne(User);
exports.updateUser = factoryCode.updateOne(User);
exports.deleteUser = factoryCode.deleteOne(User);
