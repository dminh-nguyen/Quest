import { faExclamationCircle, faX } from "@fortawesome/free-solid-svg-icons";
import "./Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  showLoginButton?: boolean;
  onLogin?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  message,
  showLoginButton,
  onLogin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <FontAwesomeIcon icon={faExclamationCircle} />
        <p>{message}</p>
        {showLoginButton && (
          <button className="modal-button login-btn" onClick={onLogin}>
            Login
          </button>
        )}
        <FontAwesomeIcon icon={faX} onClick={onClose} className="close-btn" />
      </div>
    </div>
  );
};

export default Modal;
