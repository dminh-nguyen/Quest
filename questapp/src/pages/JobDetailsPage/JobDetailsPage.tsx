import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./JobDetailsPage.css";
import { useAuth } from "../../auth/AuthContext";
import Modal from "../../components/Modal";
import ApplicationModal from "../../components/ApplicationModal";
import JobInfo from "./components/JobInfo";
import JobDescription from "./components/JobDescription";
import EmployerApplications from "./components/EmployerApplications";
import ApplicationDetails from "./components/ApplicationDetails";
import { Job } from "../../types/Job";
import { Application } from "../../types/Application";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faPen, faSave } from "@fortawesome/free-solid-svg-icons";

const allowedStatuses = [
  "applied",
  "under review",
  "shortlisted",
  "accepted",
  "rejected",
];

const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplicationModal, setIsApplicationModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [userApplication, setUserApplication] = useState<Application | null>(
    null
  );
  const [hasApplied, setHasApplied] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isOwner, setIsOwner] = useState(false);
  const [employerApplications, setEmployerApplications] = useState<
    Application[]
  >([]);
  const [updatedApplications, setUpdatedApplications] = useState<{
    [key: string]: { status: string; feedback: string };
  }>({});
  const [activeApplicationId, setActiveApplicationId] = useState<string | null>(
    null
  );
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [editedJob, setEditedJob] = useState<Job | null>(null);
  const location = useLocation();

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backendUrl}/api/jobs/${id}`);
        if (!response.ok) {
          const errorMessage = (await response.json()).error;
          throw new Error(errorMessage);
        }
        const data = await response.json();
        setJob(data);
        setEditedJob(data);
        if (location.state && location.state.isEditingJob)
          setIsEditingJob(true);
        if (user?.roles.includes("employer") && data.createdBy === user?.id) {
          const response = await fetch(
            `${backendUrl}/api/jobs/${id}/applications`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (!response.ok) {
            const errorMessage = (await response.json()).error;
            throw new Error(errorMessage);
          }
          const data = await response.json();
          setIsOwner(true);
          setEmployerApplications(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [user, id, backendUrl]);

  // Fetch user's applications to see if they applied for this job
  useEffect(() => {
    if (isAuthenticated && job) {
      const fetchUserApplications = async () => {
        try {
          const response = await fetch(`${backendUrl}/api/applications`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (response.ok) {
            const applications: Application[] = await response.json();
            const applicationForJob = applications.find((app) => {
              if (typeof app.job === "string") {
                return app.job === job._id;
              } else if (app.job && typeof app.job === "object") {
                return app.job._id === job._id;
              }
              return false;
            });
            if (applicationForJob) {
              setUserApplication(applicationForJob);
              setHasApplied(true);
            } else {
              setUserApplication(null);
              setHasApplied(false);
            }
          }
        } catch (err) {
          console.error("Error fetching applications:", err);
        }
      };

      fetchUserApplications();
    }
  }, [isAuthenticated, job, backendUrl]);

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!job) {
    return <p>No job details available.</p>;
  }

  const handleApply = () => {
    if (!isAuthenticated) {
      setIsApplicationModal(false);
      setIsModalOpen(true);
    } else {
      if (!hasApplied) {
        setIsApplicationModal(true);
        setIsModalOpen(true);
      } else {
        setIsApplicationModal(false);
        setIsModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogin = () => {
    localStorage.setItem("returnTo", window.location.pathname);
    navigate("/login");
  };

  const handleJobInfoChange = (field: keyof Job, value: any) => {
    if (editedJob) {
      setEditedJob({ ...editedJob, [field]: value });
    }
  };

  const handleSubmitJobUpdate = async () => {
    if (!editedJob) return;
    try {
      const response = await fetch(`${backendUrl}/api/jobs/${job._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editedJob),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Job update failed");
      }
      const updatedJob = await response.json();
      setJob(updatedJob);
      setEditedJob(updatedJob);
      setIsEditingJob(false);
      alert("Job updated successfully!");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleSubmitApplication = async () => {
    if (!file) {
      alert("Please upload your resume.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("coverLetterFile", file);

      const response = await fetch(
        `${backendUrl}/api/jobs/${job._id}/applications`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Application submission failed");
      }
      alert("Application submitted successfully!");
      setHasApplied(true);
      setUserApplication({
        _id: "new-app-id",
        applicant: user?.id,
        coverLetterFileUrl: "",
        coverLetterFileName: file.name,
        coverLetterFileType: file.type,
        status: "applied",
        appliedAt: new Date().toISOString(),
        job: job._id,
      });
      setIsModalOpen(false);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleUpdateApplication = async (
    applicationId: string,
    newStatus: string | undefined,
    newFeedback: string | undefined
  ) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/jobs/${job._id}/applications/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus, feedback: newFeedback }),
        }
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Update failed");
      }
      setEmployerApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === applicationId
            ? { ...app, status: newStatus, feedback: newFeedback }
            : app
        )
      );
      alert("Application updated successfully!");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: string) => {
    setUpdatedApplications((prev) => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        status: newStatus,
      },
    }));
  };

  const handleFeedbackChange = (applicationId: string, newFeedback: string) => {
    setUpdatedApplications((prev) => ({
      ...prev,
      [applicationId]: {
        ...prev[applicationId],
        feedback: newFeedback,
      },
    }));
  };

  const handleSubmitApplicationChanges = (applicationId: string) => {
    const status =
      updatedApplications[applicationId].status ||
      employerApplications.find((app) => app._id === applicationId)?.status;
    const feedback =
      updatedApplications[applicationId].feedback ||
      employerApplications.find((app) => app._id === applicationId)?.feedback;
    if (status || feedback) {
      handleUpdateApplication(applicationId, status, feedback);
      setActiveApplicationId(null);
    }
  };

  const handleEditApplicationClick = (applicationId: string) => {
    setActiveApplicationId(applicationId);
  };

  const handleCancelApplicationClick = () => {
    setActiveApplicationId(null);
  };

  const handleEditJobClick = () => {
    setIsEditingJob(true);
  };

  return (
    <div className="job-details-page">
      <section className="job-details-header">
        <h1>{job.title}</h1>
        {isOwner && !isEditingJob && (
          <button className="edit-button" onClick={handleEditJobClick}>
            <FontAwesomeIcon icon={faPen} /> Edit
          </button>
        )}
        {isEditingJob && (
          <>
            <button className="save-button" onClick={handleSubmitJobUpdate}>
              <FontAwesomeIcon icon={faSave} /> Save
            </button>
            <button
              className="cancel-button"
              onClick={() => {
                setIsEditingJob(false);
                setEditedJob(job);
              }}
            >
              <FontAwesomeIcon icon={faCancel} /> Cancel
            </button>
          </>
        )}
      </section>
      <section className="job-details-body">
        <JobInfo
          job={isEditingJob && editedJob ? editedJob : job}
          isEditingJob={isEditingJob}
          onChange={handleJobInfoChange}
        />
        <JobDescription
          job={isEditingJob && editedJob ? editedJob : job}
          isEditingJob={isEditingJob}
          onChange={handleJobInfoChange}
        />
      </section>
      <section className="job-details-footer">
        {isOwner ? (
          <button disabled className="apply-button">
            You posted this position
          </button>
        ) : (
          <button
            className="apply-button"
            onClick={handleApply}
            disabled={hasApplied && isAuthenticated}
          >
            {hasApplied && isAuthenticated ? "Already Applied" : "Apply Now"}
          </button>
        )}
      </section>

      {isModalOpen && !isApplicationModal && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          message={
            !isAuthenticated
              ? "You have to log in first!"
              : "You have already applied for this position."
          }
          showLoginButton={!isAuthenticated}
          onLogin={handleLogin}
        />
      )}
      {isModalOpen && isApplicationModal && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          setFile={setFile}
          onSubmit={handleSubmitApplication}
        />
      )}

      {isAuthenticated &&
        user?.roles.includes("employer") &&
        job.createdBy === user.id && (
          <EmployerApplications
            applications={employerApplications}
            allowedStatuses={allowedStatuses}
            handleStatusChange={handleStatusChange}
            handleFeedbackChange={handleFeedbackChange}
            handleSubmitChanges={handleSubmitApplicationChanges}
            activeApplicationId={activeApplicationId}
            handleEditClick={handleEditApplicationClick}
            handleCancelClick={handleCancelApplicationClick}
          />
        )}

      {hasApplied && userApplication && (
        <ApplicationDetails application={userApplication} />
      )}
    </div>
  );
};

export default JobDetailsPage;
