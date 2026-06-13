import { useEffect, useState } from "react";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    fetch("http://localhost:5555/attendance", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAttendance(data));

    fetch("http://localhost:5555/students", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:5555/attendance", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        attendance_date: attendanceDate,
        status,
        student_id: parseInt(studentId),
      }),
    })
      .then((res) => res.json())
      .then((newRecord) => {
        setAttendance([...attendance, newRecord]);
        setAttendanceDate("");
        setStatus("Present");
        setStudentId("");
      });
  }

  function getStudentName(id) {
    const student = students.find((student) => student.id === id);
    return student ? student.name : "Unknown Student";
  }

  return (
    <div className="dashboard-card">
      <h1>Attendance</h1>

      <form onSubmit={handleSubmit}>
        <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
          <option value="">Choose a student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={attendanceDate}
          onChange={(e) => setAttendanceDate(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Excused">Excused</option>
        </select>

        <button type="submit">Add Attendance</button>
      </form>

      {attendance.map((record) => (
        <div className="student-card" key={record.id}>
          <h3>{getStudentName(record.student_id)}</h3>
          <p>Date: {record.attendance_date}</p>
          <p>Status: {record.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Attendance;