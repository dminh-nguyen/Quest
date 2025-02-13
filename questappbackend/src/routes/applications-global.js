const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const authMiddleware = require("../middlewares/authentication");

router.get("/", authMiddleware, async (req, res) => {
  const applications = await Application.find({
    applicant: req.user.userId,
  }).populate("job", "title category location hours description");
  res.status(200).json(applications);
});

module.exports = router;
