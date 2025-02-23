import React from "react";
import { Job } from "../../../types/Job";
import "../JobDetailsPage.css";

interface JobDescriptionProps {
  job: Job;
  isEditingJob: boolean;
  onChange: (field: keyof Job, value: any) => void;
}

const JobDescription: React.FC<JobDescriptionProps> = ({
  job,
  isEditingJob,
  onChange,
}) => {
  return !isEditingJob ? (
    <div className="job-description">
      <h2>Job Description</h2>
      <p>{job.description}</p>
    </div>
  ) : (
    <div className="job-description">
      <h2>Job Description</h2>
      <textarea
        value={job.description}
        onChange={(e) => onChange("description", e.target.value)}
      />
    </div>
  );
};

export default JobDescription;
