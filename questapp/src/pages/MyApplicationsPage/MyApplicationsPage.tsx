import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import "./MyApplicationsPage.css";

interface JobDetails {
  _id: string;
  title: string;
  category: string;
  location: string;
  hours: string;
  employmentType: string;
}

interface Application {
  _id: string;
  job: JobDetails;
  coverLetter: string;
  status: string; // e.g. "applied", "under review", "shortlisted", "accepted", "rejected"
  feedback?: string; // optional employer feedback
  appliedAt: string; // Date string
}

const MyApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is not authenticated, redirect them to login
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/applications`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch applications");
        }
        const data = await response.json();
        setApplications(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [backendUrl, isAuthenticated, navigate]);

  if (loading) {
    return <p>Loading your applications...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="my-applications-page">
      <h1>My Applications</h1>
      {applications.length === 0 ? (
        <p>You have not applied to any jobs yet.</p>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app._id} className="application-card">
              <Link to={`/jobs/${app.job._id}`}>
                <h2>{app.job.title}</h2>
              </Link>
              <p>
                <strong>Category:</strong> {app.job.category}
              </p>
              <p>
                <strong>Location:</strong> {app.job.location}
              </p>
              <p>
                <strong>Hours:</strong> {app.job.hours}
              </p>
              <p>
                <strong>Employment Type:</strong> {app.job.employmentType}
              </p>
              <p>
                <strong>Status:</strong> {app.status}
              </p>
              {app.feedback && (
                <p>
                  <strong>Feedback:</strong> {app.feedback}
                </p>
              )}
              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(app.appliedAt).toLocaleDateString()}
              </p>
              {/* <p>
                <strong>Cover Letter:</strong> {app.coverLetter}
              </p> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
