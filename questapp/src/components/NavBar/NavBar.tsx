import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const linksRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const toggleExpandButton = () => {
    if (!isExpanded) {
      const height = linksRef.current!.scrollHeight;
      linksRef.current!.style.maxHeight = `${height}px`;
    } else {
      linksRef.current!.style.maxHeight = `0px`;
    }
    setIsExpanded(!isExpanded);
  };

  // auto collapse when route changes
  useEffect(() => {
    setIsExpanded(false);
    const height = linksRef.current!.scrollHeight;
    linksRef.current!.style.maxHeight = `${height}px`;
  }, [location]);

  // auto collapse when window too wide
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 600) {
        setIsExpanded(false);
        const height = linksRef.current!.scrollHeight;
        linksRef.current!.style.maxHeight = `${height}px`;
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">
          <img src={logo} alt="Quest Logo" />
        </Link>
      </div>
      <div className={isExpanded ? "navbar-links show" : "navbar-links"}>
        <div className="links" ref={linksRef}>
          <Link to="/home" className="navbar-link">
            Home
          </Link>
          <Link to="/jobs" className="navbar-link">
            Jobs
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to="/post-job" className="navbar-link">
                Post Job
              </Link>
              {user?.roles.includes("employer") && (
                <Link to="/posted-jobs" className="navbar-link">
                  My Listings
                </Link>
              )}
              <Link to="/applications" className="navbar-link">
                My Applications
              </Link>
              <Link to="/logout" className="navbar-link" onClick={logout}>
                Logout
              </Link>
            </>
          )}
        </div>
      </div>
      <button className="navbar-toggle" onClick={toggleExpandButton}>
        <FontAwesomeIcon icon={faBars} />
      </button>
    </nav>
  );
};

export default Navbar;
