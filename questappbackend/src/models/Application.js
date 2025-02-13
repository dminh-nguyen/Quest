const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetterFileUrl: { type: String, required: true },
    coverLetterFileName: { type: String },
    coverLetterFileType: { type: String },
    status: {
      type: String,
      enum: ["applied", "under review", "shortlisted", "accepted", "rejected"],
      default: "applied",
    },
    feedback: { type: String, default: "" },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
