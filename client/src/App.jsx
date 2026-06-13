import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Subjects from "./pages/Subjects";
import Attendance from "./pages/Attendance";
import Lessons from "./pages/Lessons";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Progress from "./pages/Progress";
import FieldTrips from "./pages/FieldTrips";
import StudentProfile from "./pages/StudentProfile";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5555/check_session", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((user) => {
        if (user) setUser(user);
      });
  }, []);

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/students" element={user ? <Students /> : <Navigate to="/login" />} />
        <Route path="/subjects" element={user ? <Subjects /> : <Navigate to="/login" />} />
        <Route path="/attendance" element={user ? <Attendance /> : <Navigate to="/login" />} />
        <Route path="/lessons" element={user ? <Lessons /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/progress" element={user ? <Progress /> : <Navigate to="/login" />} />
        <Route path="/field-trips" element={user ? <FieldTrips /> : <Navigate to="/login" />} />
        <Route path="/students/:id" element={user ? <StudentProfile /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;