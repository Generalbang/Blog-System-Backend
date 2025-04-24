const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const JWT_SECRET = "God is a good God";
const JWT_EXPIRES_IN = "90d";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || JWT_EXPIRES_IN,
  });
};

const sendTokenAndRes = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    // sameSite: "None",
  };
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Permission Denied", 403));
    }
    next();
  };
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.auth_token) {
    token = req.headers.auth_token;
  }
  // console.log(token, !token);
  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  // verify token
  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

  // check if user still exist
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("User not found", 401));
  }

  req.user = user;
  next();
});

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendTokenAndRes(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide a valid email and password", 400));
  }

  // check if user exist and password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  sendTokenAndRes(user, 200, res);
});

exports.userInfoUpdate = catchAsync(async (req, res, next) => {
  // check if password is mistakingly passed
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("This route can not update/modify user password", 400)
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  sendTokenAndRes(user, 200, res);
});

exports.updateUserPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect current password", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  sendTokenAndRes(user, 200, res);
});
