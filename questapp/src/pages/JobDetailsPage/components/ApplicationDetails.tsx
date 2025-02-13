import React from "react";
import { Application } from "../../../types/Application";
import "../JobDetailsPage.css";

interface ApplicationDetailsProps {
  application: Application;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
}) => {
  return (
    <section className="application-details-section">
      <h2>Your Application Details</h2>
      <p>
        <strong>Status:</strong> {application.status}
      </p>
      <p>
        <strong>Applied On:</strong>{" "}
        {new Date(application.appliedAt).toLocaleDateString()}
      </p>
      <p>
        <strong>Cover Letter: </strong>
        <a
          href={application.coverLetterFileUrl}
          target="_blank"
          rel="noreferrer"
        >
          {application.coverLetterFileName}
        </a>
      </p>
      {application.feedback && (
        <p>
          <strong>Feedback:</strong> {application.feedback}
        </p>
      )}
    </section>
  );
};

export default ApplicationDetails;
