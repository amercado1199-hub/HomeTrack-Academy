import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/hometrack-logo.png";

function Navbar({ user, setUser }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    fetch("http://localhost:5555/logout", {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      setUser(null);
      setMenuOpen(false);
    });
  }

  return (
    <header className="site-header">
      {/* Logo Section */}
      <div className="header-brand">
        <Link
          to="/"
          className="wordmark"
          onClick={() => setMenuOpen(false)}
        >
          <img src={logo} alt="HomeTrack Academy" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="hamburger"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Navigation */}
      <nav className={menuOpen ? "nav-links open" : "nav-links"}>
        {user && (
          <>
            <Link to="/">🏠 Dashboard</Link>
            <Link to="/students">👩‍🎓 Students</Link>
            <Link to="/subjects">📚 Subjects</Link>
            <Link to="/lessons">✏️ Lessons</Link>
            <Link to="/attendance">🗓️ Attendance</Link>
            <Link to="/progress">📈 Progress</Link>
            <Link to="/field-trips">🚌 Field Trips</Link>

            <div className="nav-user">
              <span>Welcome, {user.username}</span>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;