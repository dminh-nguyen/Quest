import React from "react";
import { Job } from "../../../types/Job";
import "../JobDetailsPage.css";

interface JobDescriptionProps {
  job: Job;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ job }) => {
  return (
    <div className="job-description">
      <h2>Job Description</h2>
      <p>{job.description}</p>
    </div>
  );
};

export default JobDescription;
