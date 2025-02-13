import { useState, useEffect } from "react";
import "./JobsListPage.css";
import JobCard from "../../components/JobCard";
import { Job } from "../../types/Job";
import { useNavigate } from "react-router-dom";
import { EmploymentType, JobCategory, JobHours } from "../../types/JobEnums";

const JobsListPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | "">(
    ""
  );
  const [selectedHours, setSelectedHours] = useState<JobHours | "">("");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<
    EmploymentType | ""
  >("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/jobs`);
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (
      !searchTerm &&
      !selectedCategory &&
      !selectedHours &&
      !selectedEmploymentType
    ) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter((job) => {
      const matchesSearch = searchTerm
        ? job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesCategory = selectedCategory
        ? job.category === selectedCategory
        : true;

      const matchesHours = selectedHours ? job.hours === selectedHours : true;

      const matchesEmploymentType = selectedEmploymentType
        ? job.employmentType === selectedEmploymentType
        : true;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesHours &&
        matchesEmploymentType
      );
    });

    setFilteredJobs(filtered);
  }, [
    searchTerm,
    selectedCategory,
    selectedHours,
    selectedEmploymentType,
    jobs,
  ]);

  return (
    <div className="jobs-list-page">
      <header className="page-header">
        <h1>Quest Board</h1>
        <p>Embark on your next adventure!</p>
      </header>

      <section className="filters">
        <input
          type="text"
          placeholder="I yearn for quests..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as JobCategory)}
        >
          <option value="">All Categories</option>
          {Object.values(JobCategory).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          className="hours-filter"
          value={selectedHours}
          onChange={(e) => setSelectedHours(e.target.value as JobHours)}
        >
          <option value="">Any Hours</option>
          {Object.values(JobHours).map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>
        <select
          className="hours-filter"
          value={selectedEmploymentType}
          onChange={(e) =>
            setSelectedEmploymentType(e.target.value as EmploymentType)
          }
        >
          <option value="">Any Type</option>
          {Object.values(EmploymentType).map((et) => (
            <option key={et} value={et}>
              {et}
            </option>
          ))}
        </select>
      </section>

      {loading && <p>Loading quests...</p>}
      {error && <p className="error-message">{error}</p>}

      {filteredJobs.length != 0 ? (
        <section className="job-cards-grid">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} navigate={navigate} />
          ))}
        </section>
      ) : (
        <p className="error-message">No matching jobs found.</p>
      )}
    </div>
  );
};

export default JobsListPage;
