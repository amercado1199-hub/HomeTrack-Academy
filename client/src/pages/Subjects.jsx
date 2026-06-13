import { useEffect, useState } from "react";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    fetch("http://localhost:5555/subjects", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setSubjects(data));

    fetch("http://localhost:5555/students", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:5555/subjects", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        student_id: parseInt(studentId),
      }),
    })
      .then((res) => res.json())
      .then((newSubject) => {
        setSubjects([...subjects, newSubject]);
        setName("");
        setStudentId("");
      });
  }

  function getStudentName(id) {
    const student = students.find((student) => student.id === id);
    return student ? student.name : "No student assigned";
  }

  return (
    <div className="dashboard-card">
      <h1>Subjects</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">Choose a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>

        <button type="submit">Add Subject</button>
      </form>

      {subjects.map((subject) => (
        <div key={subject.id} className="student-card">
          <h3>{subject.name}</h3>
          <p>Student: {getStudentName(subject.student_id)}</p>
        </div>
      ))}
    </div>
  );
}

export default Subjects;