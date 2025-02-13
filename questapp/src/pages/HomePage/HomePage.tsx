import { useAuth } from "../../auth/AuthContext";
import "./HomePage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Scholar's Guild!</h1>
          <p>Find the quests that suit you best.</p>
          <div className="hero-buttons">
            <Link to="/jobs" className="hero-button primary">
              Explore Quests
            </Link>
            <Link to="/register" className="hero-button secondary">
              Join our Guild
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>Toss A Coin To Your Witcher</h2>
        <p>
          Welcome to the Adventurer's Guild, your portal to thrilling quests and
          golden opportunities! Whether you seek part-time endeavors, noble
          internships, or daring freelance missions, our guild stands ready to
          chart your path to greatness.
        </p>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Our Guild?</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Wide Range of Quests</h3>
            <p>Find quests in various professions tailored for you.</p>
          </div>
          <div className="feature">
            <h3>Swift Enrollment</h3>
            <p>
              Embark on your chosen quest with ease—your path to adventure is
              just a click away!
            </p>
          </div>
          <div className="feature">
            <h3>Trusted Employers</h3>
            <p>
              Forge connections with esteemed and reliable employers from across
              the realm.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <h2>Tales from Fellow Adventurers</h2>
        <div className="testimonials-grid">
          <div className="testimonial">
            <p>
              "This platform helped me find my first internship. Highly
              recommend!"
            </p>
            <span>- Alex, Computer Science Student</span>
          </div>
          <div className="testimonial">
            <p>"Super easy to use and filled with great opportunities!"</p>
            <span>- Mia, Business Administration Student</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Duc Minh Nguyen. All rights reserved.</p>
        <p>
          <Link to="/home">Home</Link> | <Link to="/jobs">Jobs</Link> |{" "}
          {isAuthenticated ? (
            <Link to="/home" onClick={logout}>
              Logout
            </Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
