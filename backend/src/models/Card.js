const mongoose = require("mongoose");
const auditPlugin = require("./plugins/audit.plugin");
const softDeletePlugin = require("./plugins/softDelete.plugin");

const cardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true
    },

    name: String,
    email: String,
    phone: String,
    company: String,

    rawText: { type: String, required: true },
    category: { type: String, default: "General" },

    isPublic: { type: Boolean, default: false },
    publicCode: { type: String, unique: true, sparse: true }
  },
  { timestamps: true }
);

cardSchema.plugin(auditPlugin);
cardSchema.plugin(softDeletePlugin);

module.exports = mongoose.model("Card", cardSchema);
