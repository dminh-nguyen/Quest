const express = require("express");
const router = express.Router({ mergeParams: true });
const Application = require("../models/Application");
const Job = require("../models/Job");
const requireRole = require("../middlewares/requireRole");
const authMiddleware = require("../middlewares/authentication");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/coverLetters/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${req.params.jobId}_${
      req.user.userId
    }_${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Apply to a job
router.post(
  "/",
  authMiddleware,
  upload.single("coverLetterFile"),
  async (req, res) => {
    const { jobId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const coverLetterFileUrl = `${baseUrl}/uploads/coverLetters/${req.file.filename}`;
    const coverLetterFileName = req.file.originalname;
    const coverLetterFileType = req.file.mimetype;

    const application = await Application.create({
      job: jobId,
      applicant: req.user.userId,
      coverLetterFileUrl,
      coverLetterFileName,
      coverLetterFileType,
      status: "applied",
    });

    res.status(201).json({ message: "Application submitted", application });
  }
);

// Employers get applications for a job they posted.
router.get(
  "/",
  authMiddleware,
  requireRole(["employer", "admin"]),
  async (req, res) => {
    const { jobId } = req.params;
    const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const applications = await Application.find({ job: jobId });
    res.status(200).json(applications);
  }
);

// Employer updates an application (feedback and status)
router.put(
  "/:applicationId",
  authMiddleware,
  requireRole(["employer", "admin"]),
  async (req, res) => {
    const { jobId, applicationId } = req.params;
    const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId });
    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }
    const { status, feedback } = req.body;
    const allowedStatuses = [
      "applied",
      "under review",
      "shortlisted",
      "accepted",
      "rejected",
    ];
    const updateFields = {};
    if (status && status.trim() !== "") {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status provided" });
      }
      updateFields.status = status;
    }
    if (feedback && feedback.trim() !== "") {
      updateFields.feedback = feedback;
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    res
      .status(200)
      .json({ message: "Application updated", updatedApplication });
  }
);

module.exports = router;
