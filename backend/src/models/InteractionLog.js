const mongoose = require("mongoose");

const interactionLogSchema = new mongoose.Schema(
  {
    ip: { type: String, index: true },
    method: { type: String, index: true },
    path: { type: String, index: true },
    statusCode: { type: Number, index: true },
    durationMs: Number,
    userAgent: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    userRole: { type: String, index: true }
  },
  { timestamps: true }
);

interactionLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("InteractionLog", interactionLogSchema);
