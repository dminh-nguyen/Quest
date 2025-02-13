import React from "react";
import "./ApplicationModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  setFile: (file: File | null) => void;
  onSubmit: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  setFile,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="application-modal-overlay" onClick={onClose}>
      <div
        className="application-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <FontAwesomeIcon className="close-btn" icon={faX} onClick={onClose} />
        <h2>Apply for this Job</h2>
        <input
          type="file"
          name="coverLetterFile"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
        <button className="modal-button" onClick={onSubmit}>
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default ApplicationModal;
