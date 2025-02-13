import React from "react";
import { Job } from "../../../types/Job";
import "../JobDetailsPage.css";

interface JobInfoProps {
  job: Job;
}

const JobInfo: React.FC<JobInfoProps> = ({ job }) => {
  return (
    <div className="job-info">
      <p>
        <strong>Category:</strong> {job.category}
      </p>
      <p>
        <strong>Company:</strong> {job.company}
      </p>
      <p>
        <strong>Location:</strong> {job.location}
      </p>
      <p>
        <strong>Hours:</strong> {job.hours}
      </p>
      <p>
        <strong>Type:</strong> {job.employmentType}
      </p>
    </div>
  );
};

export default JobInfo;
