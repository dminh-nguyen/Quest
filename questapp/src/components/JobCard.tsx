import { Job } from "../types/Job";
import "./JobCard.css";
import paperPin from "../assets/paper-pin.svg";
import { MouseEventHandler } from "react";

const JobCard = ({
  job,
  navigate,
}: {
  job: Job;
  navigate: (to: string) => void;
}) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    navigate(`/jobs/${job._id}`);
  };

  const truncateDescription = (description: string, wordLimit: number = 9) => {
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : description;
  };

  return (
    <div className="job-card">
      <div className="job-card-pin">
        <img src={paperPin} />
      </div>
      <h3 className="job-title">{job.title}</h3>
      <p className="job-category">{job.category}</p>
      <p className="job-company">@{job.company}</p>
      <p className="job-hours">{job.hours}</p>
      <p className="job-location">📍 {job.location}</p>
      <p className="job-description">{truncateDescription(job.description)}</p>
      <button onClick={handleClick} className="apply-button">
        Take Quest
      </button>
    </div>
  );
};

export default JobCard;
