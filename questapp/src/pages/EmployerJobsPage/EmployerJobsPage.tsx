import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { Job } from "../../types/Job";
import "./EmployerJobsPage.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const EmployerJobsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(`${backendUrl}/api/jobs/employer`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch job listings");
        }
        const data = await response.json();
        setJobs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchEmployerJobs();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <p>You must be logged in as an employer to view this page.</p>;
  }

  const truncateDescription = (description: string, wordLimit: number = 9) => {
    const words = description.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : description;
  };

  const navigateToJobPage = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const jobCardElement = e.currentTarget.parentElement?.parentElement;
    const linkElement = jobCardElement?.querySelector("a");
    const jobId = linkElement?.getAttribute("href")?.split("/").pop();
    if (!jobId) return;

    navigate(`/jobs/${jobId}`, { state: { isEditingJob: true } });
  };

  const deleteJob = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const jobCardElement = e.currentTarget.parentElement?.parentElement;
    const linkElement = jobCardElement?.querySelector("a");
    const jobId = linkElement?.getAttribute("href")?.split("/").pop();

    if (!jobId) return;

    const token = localStorage.getItem("token");
    fetch(`${backendUrl}/api/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete job listing");
        }
        setJobs(jobs.filter((job) => job._id !== jobId));
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="employer-jobs-page">
      <h1>Your Job Listings</h1>
      {loading && <p>Loading job listings...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && jobs.length === 0 && <p>You haven't posted any jobs yet.</p>}
      <div className="employer-jobs-grid">
        {jobs.map((job) => (
          <div key={job._id} className="employer-job-card">
            <Link to={`/jobs/${job._id}`}>
              <h2>{job.title}</h2>
            </Link>
            <p>
              <strong>Category:</strong> {job.category}
            </p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>
              <strong>Hours:</strong> {job.hours}
            </p>
            <p>
              <strong>Employment Type:</strong> {job.employmentType}
            </p>
            <p>{truncateDescription(job.description, 15)}</p>
            <div className="employer-job-card-actions">
              <button className="edit-button" onClick={navigateToJobPage}>
                <FontAwesomeIcon icon={faPen} />
                Edit
              </button>
              <button className="delete-button" onClick={deleteJob}>
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerJobsPage;
