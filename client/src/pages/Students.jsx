import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Students() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");

  useEffect(() => {
    fetch("http://localhost:5555/students", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const newStudent = {
      name,
      grade_level: gradeLevel,
    };

    fetch("http://localhost:5555/students", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStudent),
    })
      .then((res) => res.json())
      .then((student) => {
        setStudents([...students, student]);
        setName("");
        setGradeLevel("");
      });
  }

  function handleDelete(id) {
    fetch(`http://localhost:5555/students/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      setStudents((currentStudents) =>
        currentStudents.filter((student) => student.id !== id)
      );
    });
  }

  return (
    <div className="dashboard-card">
      <h1>Students</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Grade Level"
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value)}
        />

        <button type="submit">Add Student</button>
      </form>

      {students.map((student) => (
        <div className="student-card" key={student.id}>
          <h3>{student.name}</h3>
          <p>{student.grade_level}</p>

          <Link to={`/students/${student.id}`}>
            <button type="button">View Profile</button>
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(student.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Students;