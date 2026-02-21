const mongoose = require("mongoose");
const auditPlugin = require("./plugins/audit.plugin");
const softDeletePlugin = require("./plugins/softDelete.plugin");
const ROLES = require("../constants/Roles");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // IMPORTANT: never returned by default
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
  },
  { timestamps: true },
);

userSchema.plugin(auditPlugin);
userSchema.plugin(softDeletePlugin);

module.exports = mongoose.model("User", userSchema);
