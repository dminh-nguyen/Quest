const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Please provide a title"] },
  category: { type: String, required: [true, "Please provide a category"] },
  location: { type: String, required: [true, "Please provide a location"] },
  hours: { type: String, required: [true, "Please provide working hours"] },
  employmentType: {
    type: String,
    required: [true, "Please provide an employment type"],
  },
  company: {
    type: String,
    required: [true, "Please provide the company name"],
  },
  description: {
    type: String,
    required: [true, "Please provide the job description"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Job", JobSchema);
