import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { Job } from "../../types/Job";
import "./EmployerJobsPage.css";
import { Link } from "react-router-dom";

const EmployerJobsPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
              <strong>Type:</strong> {job.employmentType}
            </p>
            <p>{truncateDescription(job.description, 9)}</p>
            {/* You can add buttons here for editing, deleting, or viewing applications */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerJobsPage;
