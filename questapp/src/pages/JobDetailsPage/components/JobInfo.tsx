import React from "react";
import { Job } from "../../../types/Job";
import "../JobDetailsPage.css";
import { EmploymentType, JobCategory, JobHours } from "../../../types/JobEnums";

interface JobInfoProps {
  job: Job;
  isEditingJob: boolean;
  onChange: (field: keyof Job, value: any) => void;
}

const JobInfo: React.FC<JobInfoProps> = ({ job, isEditingJob, onChange }) => {
  return !isEditingJob ? (
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
  ) : (
    <div className="job-info">
      <p>
        <strong>
          Category:
          <select
            value={job.category}
            onChange={(e) =>
              onChange("category", e.target.value as JobCategory)
            }
          >
            {Object.values(JobCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </strong>
      </p>
      <p>
        <strong>
          Company:
          <input
            type="text"
            value={job.company}
            onChange={(e) => onChange("company", e.target.value)}
          />
        </strong>
      </p>
      <p>
        <strong>
          Location:
          <input
            type="text"
            value={job.location}
            onChange={(e) => onChange("location", e.target.value)}
          />
        </strong>
      </p>
      <p>
        <strong>
          Hours:
          <select
            value={job.hours}
            onChange={(e) => onChange("hours", e.target.value as JobHours)}
          >
            {Object.values(JobHours).map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </strong>
      </p>
      <p>
        <strong>
          Type:
          <select
            value={job.employmentType}
            onChange={(e) =>
              onChange("employmentType", e.target.value as EmploymentType)
            }
          >
            {Object.values(EmploymentType).map((et) => (
              <option key={et} value={et}>
                {et}
              </option>
            ))}
          </select>
        </strong>
      </p>
    </div>
  );
};

export default JobInfo;
