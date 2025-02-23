const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const authMiddleware = require("../middlewares/authentication");
const requireRole = require("../middlewares/requireRole");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const router = express.Router();
const isIdValid = require("mongoose").Types.ObjectId.isValid;

// Create a job
router.post("/", authMiddleware, async (req, res) => {
  const job = await Job.create({ ...req.body, createdBy: req.user.userId });
  res.status(201).json(job);
});

// Get all jobs
router.get("/", async (req, res) => {
  const jobs = await Job.find({});
  res.status(200).json(jobs);
});

// Get my posted jobs
router.get(
  "/employer",
  authMiddleware,
  requireRole(["employer"]),
  async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId });
    if (jobs.length === 0) {
      throw new NotFoundError("No jobs here");
    }
    res.status(200).json(jobs);
  }
);

// Get job
router.get("/:jobId", async (req, res) => {
  const { jobId } = req.params;
  if (!jobId || !isIdValid(jobId)) {
    throw new BadRequestError("Invalid Job ID");
  }
  const job = await Job.findById(jobId);
  if (!job) {
    throw new NotFoundError("Job not found");
  }
  res.status(200).json(job);
});

// Edit job
router.put(
  "/:jobId",
  authMiddleware,
  requireRole(["employer"]),
  async (req, res) => {
    const {
      body: { title, category, location, hours, description },
      user: { userId },
      params: { jobId },
    } = req;
    if (
      title === "" ||
      category === "" ||
      location === "" ||
      hours === "" ||
      description === ""
    ) {
      throw new BadRequestError("No fields should be empty");
    }
    const job = await Job.findByIdAndUpdate(
      { _id: jobId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      throw new NotFoundError("Job not found");
    }
    res.status(200).json(job);
  }
);

// Delete job
router.delete(
  "/:jobId",
  authMiddleware,
  requireRole(["employer"]),
  async (req, res) => {
    const {
      user: { userId },
      params: { jobId },
    } = req;
    const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
    if (!job) {
      throw new NotFoundError("Job not found");
    }
    await Application.deleteMany({ job: jobId });
    res.status(200).json(job);
  }
);

const applicationsRouter = require("./applications-nested");
router.use("/:jobId/applications", applicationsRouter);

module.exports = router;
