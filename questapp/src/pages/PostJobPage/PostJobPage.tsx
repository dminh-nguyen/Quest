import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostJobPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { EmploymentType, JobCategory, JobHours } from "../../types/JobEnums";

const PostJobPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<JobCategory | "">("");
  const [hours, setHours] = useState<JobHours | "">("");
  const [employmentType, setEmploymentType] = useState<EmploymentType | "">("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!title || !category || !hours || !description || !location) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Unauthorised! Please log in!");
      }
      const response = await fetch(`${backendUrl}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, category, hours, description, location }),
      });

      if (!response.ok) {
        throw new Error("Failed to post job. Please try again.");
      }

      setSuccessMessage("Job posted successfully!");
      setTimeout(() => {
        navigate("/jobs");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="post-job-page">
      <FontAwesomeIcon icon={faThumbTack} />
      <h1>Hang a Commission</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as JobCategory)}
          required
        >
          <option value="">Select Category</option>
          {Object.values(JobCategory).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Hours:</label>
        <select
          value={hours}
          onChange={(e) => setHours(e.target.value as JobHours)}
          required
        >
          <option value="">Select Hours</option>
          {Object.values(JobHours).map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>

        <label>Employment Type:</label>
        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
          required
        >
          <option value="">Select Employment Type</option>
          {Object.values(EmploymentType).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label>Company</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
};

export default PostJobPage;
