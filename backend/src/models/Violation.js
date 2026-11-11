const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Signal Jumping", "Over Speeding", "Wrong Parking", "No Helmet", "Wrong Way", "Other"],
      required: true,
    },
    description: String,
    vehicleNumber: String,
    evidence: [String],
    location: {
      lat: Number,
      lng: Number,
      area: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Validated", "Rejected", "Assigned", "In Progress", "Resolved"],
      default: "Submitted",
    },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    officer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    history: [
      {
        status: String,
        note: String,
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Violation", violationSchema);
