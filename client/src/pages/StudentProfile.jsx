import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function StudentProfile() {
  const { id } = useParams();

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [fieldTrips, setFieldTrips] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5555/students", { credentials: "include" })
      .then((res) => res.json())
      .then(setStudents);

    fetch("http://localhost:5555/subjects", { credentials: "include" })
      .then((res) => res.json())
      .then(setSubjects);

    fetch("http://localhost:5555/lessons", { credentials: "include" })
      .then((res) => res.json())
      .then(setLessons);

    fetch("http://localhost:5555/attendance", { credentials: "include" })
      .then((res) => res.json())
      .then(setAttendance);

    fetch("http://localhost:5555/field-trips", { credentials: "include" })
      .then((res) => res.json())
      .then(setFieldTrips);
  }, []);

  const student = students.find((student) => student.id === parseInt(id));

  if (!student) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-card">
          <h1>Loading student profile...</h1>
        </section>
      </main>
    );
  }

  const studentSubjects = subjects.filter(
    (subject) => subject.student_id === student.id
  );

  const studentAttendance = attendance.filter(
    (record) => record.student_id === student.id
  );

  const studentTrips = fieldTrips.filter(
    (trip) => trip.student_id === student.id
  );

  const studentLessons = lessons.filter((lesson) =>
    studentSubjects.some((subject) => subject.id === lesson.subject_id)
  );

  const completedLessons = studentLessons.filter(
    (lesson) => lesson.status === "Completed"
  ).length;

  const presentDays = studentAttendance.filter(
    (record) => record.status === "Present"
  ).length;

  const attendanceRate =
    studentAttendance.length === 0
      ? 0
      : Math.round((presentDays / studentAttendance.length) * 100);

  function getSubjectProgress(subjectId) {
    const subjectLessons = lessons.filter(
      (lesson) => lesson.subject_id === subjectId
    );

    if (subjectLessons.length === 0) return 0;

    const completed = subjectLessons.filter(
      (lesson) => lesson.status === "Completed"
    ).length;

    return Math.round((completed / subjectLessons.length) * 100);
  }

  return (
    <main className="dashboard-page">
      <section className="profile-hero">
        <div>
          <p className="eyebrow">Student Profile</p>
          <h1>{student.name}</h1>
          <span>Grade: {student.grade_level}</span>
        </div>
        <div className="profile-avatar">🎓</div>
      </section>

      <section className="mini-stats-grid">
        <div className="mini-stat-card">
          <div className="mini-icon">📚</div>
          <div>
            <p>Subjects</p>
            <h3>{studentSubjects.length}</h3>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-icon">✅</div>
          <div>
            <p>Completed Lessons</p>
            <h3>{completedLessons}</h3>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-icon">📅</div>
          <div>
            <p>Attendance</p>
            <h3>{attendanceRate}%</h3>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-icon">🚌</div>
          <div>
            <p>Field Trips</p>
            <h3>{studentTrips.length}</h3>
          </div>
        </div>
      </section>

      <section className="dashboard-card">
        <h2>Subject Progress</h2>

        {studentSubjects.map((subject) => {
          const progress = getSubjectProgress(subject.id);

          return (
            <div className="student-card" key={subject.id}>
              <h3>{subject.name}</h3>
              <p>{progress}% complete</p>

              <div className="course-progress-bar">
                <div
                  className="course-progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="dashboard-card">
        <h2>Recent Lessons</h2>

        {studentLessons.slice(-3).reverse().map((lesson) => (
          <div className="student-card" key={lesson.id}>
            <h3>{lesson.title}</h3>
            <p>Status: {lesson.status}</p>
            <p>Date: {lesson.lesson_date}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

export default StudentProfile;