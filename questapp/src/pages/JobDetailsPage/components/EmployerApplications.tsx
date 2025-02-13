import React from "react";
import { Application } from "../../../types/Application";
import "../JobDetailsPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSave, faX } from "@fortawesome/free-solid-svg-icons";

interface EmployerApplicationsProps {
  applications: Application[];
  allowedStatuses: string[];
  handleStatusChange: (applicationId: string, newStatus: string) => void;
  handleFeedbackChange: (applicationId: string, newFeedback: string) => void;
  handleSubmitChanges: (applicationId: string) => void;
  activeApplicationId: string | null;
  handleEditClick: (applicationId: string) => void;
  handleCancelClick: () => void;
}

const EmployerApplications: React.FC<EmployerApplicationsProps> = ({
  applications,
  allowedStatuses,
  handleStatusChange,
  handleFeedbackChange,
  handleSubmitChanges,
  activeApplicationId,
  handleEditClick,
  handleCancelClick,
}) => {
  return (
    <section className="employer-applications-section">
      <h2>Applications for this Job</h2>
      {applications.length === 0 ? (
        <p>No applications have been submitted yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} className="employer-application-card">
            <p>
              <strong>Applicant ID:</strong> {app.applicant}
            </p>
            <p>
              <strong>Cover Letter:</strong>
              <a href={app.coverLetterFileUrl} target="_blank" rel="noreferrer">
                {" "}
                {app.coverLetterFileName}
              </a>
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
            {activeApplicationId === app._id ? (
              <div className="update-application-form">
                <select
                  defaultValue={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                >
                  {allowedStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Add feedback..."
                  defaultValue={app.feedback || ""}
                  onChange={(e) =>
                    handleFeedbackChange(app._id, e.target.value)
                  }
                />
                <button
                  className="submit-button"
                  onClick={() => handleSubmitChanges(app._id)}
                >
                  {<FontAwesomeIcon icon={faSave} />} Save
                </button>
                <button className="cancel-button" onClick={handleCancelClick}>
                  {<FontAwesomeIcon icon={faX} />} Cancel
                </button>
              </div>
            ) : (
              <button
                className="edit-button"
                onClick={() => handleEditClick(app._id)}
              >
                {<FontAwesomeIcon icon={faPen} />} Edit
              </button>
            )}
          </div>
        ))
      )}
    </section>
  );
};

export default EmployerApplications;
