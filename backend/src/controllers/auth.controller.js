const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/token");
const { successResponse } = require("../utils/response");

/**
 * Register new user
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return successResponse({
        res,
        responseCode: 409,
        responseMessage: "Email already registered",
        responseObject: null
      });
    }

    const user = new User({
      name,
      email,
      password: await hashPassword(password)
    });

    // 🔥 audit support
    user._userId = user._id;

    await user.save();

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    return successResponse({
      res,
      responseCode: 201,
      responseMessage: "User registered successfully",
      responseObject: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    next(err);
  }
};

/**
 * Login user
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return successResponse({
        res,
        responseCode: 401,
        responseMessage: "Invalid credentials",
        responseObject: null
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return successResponse({
        res,
        responseCode: 401,
        responseMessage: "Invalid credentials",
        responseObject: null
      });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    return successResponse({
      res,
      responseMessage: "Login successful",
      responseObject: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get logged-in user
 */
exports.me = async (req, res) => {
  return successResponse({
    res,
    responseMessage: "User fetched successfully",
    responseObject: req.user
  });
};

/**
 * Reset password by email (user provides new password)
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return successResponse({
        res,
        responseCode: 404,
        responseMessage: "User not found",
        responseObject: null
      });
    }

    user.password = await hashPassword(password);
    await user.save();

    return successResponse({
      res,
      responseMessage: "Password reset successful",
      responseObject: {
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * List all users
 */
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return successResponse({
      res,
      responseMessage: "Users fetched successfully",
      responseObject: users
    });
  } catch (err) {
    next(err);
  }
};
