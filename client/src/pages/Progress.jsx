import { useEffect, useState } from "react";
import DonutChart from "../components/DonutChart";

function Progress() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    fetch("http://localhost:5555/students", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStudents(data));

    fetch("http://localhost:5555/subjects", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setSubjects(data));

    fetch("http://localhost:5555/lessons", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setLessons(data));

    fetch("http://localhost:5555/attendance", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAttendance(data));
  }, []);

  function isInSelectedMonth(dateString) {
    if (!dateString) return false;
    return dateString.slice(0, 7) === selectedMonth;
  }

  const monthlyLessons = lessons.filter((lesson) =>
    isInSelectedMonth(lesson.lesson_date)
  );

  const monthlyAttendance = attendance.filter((record) =>
    isInSelectedMonth(record.attendance_date)
  );

  function getStudentSubjects(studentId) {
    return subjects.filter((subject) => subject.student_id === studentId);
  }

  function getSubjectLessons(subjectId) {
    return monthlyLessons.filter((lesson) => lesson.subject_id === subjectId);
  }

  function getCompletedLessons(subjectId) {
    return getSubjectLessons(subjectId).filter(
      (lesson) => lesson.status === "Completed"
    );
  }

  function getNeedsWorkLessons(subjectId) {
    return getSubjectLessons(subjectId).filter(
      (lesson) => lesson.status === "Needs Work"
    );
  }

  function getStudentAttendance(studentId) {
    return monthlyAttendance.filter((record) => record.student_id === studentId);
  }

  function getAttendanceRate(studentId) {
    const records = getStudentAttendance(studentId);

    if (records.length === 0) {
      return "No attendance yet";
    }

    const presentRecords = records.filter(
      (record) => record.status === "Present"
    ).length;

    return `${Math.round((presentRecords / records.length) * 100)}%`;
  }

  return (
    <main className="dashboard-page">
      <section className="hero">
        <h1>Progress Reports</h1>
        <p>View monthly lesson progress and attendance reports.</p>
      </section>

      <section className="dashboard-card">
        <h2>Monthly Progress Report</h2>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <div className="mini-stats-grid">
          <div className="mini-stat-card">
            <div className="mini-icon">📚</div>
            <div>
              <p>Lessons This Month</p>
              <h3>{monthlyLessons.length}</h3>
            </div>
          </div>

          <div className="mini-stat-card">
            <div className="mini-icon">✅</div>
            <div>
              <p>Completed</p>
              <h3>
                {
                  monthlyLessons.filter(
                    (lesson) => lesson.status === "Completed"
                  ).length
                }
              </h3>
            </div>
          </div>

          <div className="mini-stat-card">
            <div className="mini-icon">⚠️</div>
            <div>
              <p>Needs Work</p>
              <h3>
                {
                  monthlyLessons.filter(
                    (lesson) => lesson.status === "Needs Work"
                  ).length
                }
              </h3>
            </div>
          </div>

          <div className="mini-stat-card">
            <div className="mini-icon">📅</div>
            <div>
              <p>Attendance Records</p>
              <h3>{monthlyAttendance.length}</h3>
            </div>
          </div>
        </div>
      </section>

      {students.length === 0 ? (
        <section className="dashboard-card">
          <h2>No students yet</h2>
          <p>Add students first to see progress reports.</p>
        </section>
      ) : (
        students.map((student) => {
          const studentSubjects = getStudentSubjects(student.id);
          const attendanceRate = getAttendanceRate(student.id);

          return (
            <section className="dashboard-card" key={student.id}>
              <h2>{student.name}</h2>
              <p>Grade: {student.grade_level}</p>
              <p>Monthly Attendance Rate: {attendanceRate}</p>

              <h3>Subject Progress This Month</h3>

              {studentSubjects.length === 0 ? (
                <p>No subjects assigned yet.</p>
              ) : (
                studentSubjects.map((subject) => {
                  const totalLessons = getSubjectLessons(subject.id).length;
                  const completedLessons = getCompletedLessons(subject.id).length;
                  const needsWorkLessons = getNeedsWorkLessons(subject.id).length;

                  const progress =
                    totalLessons === 0
                      ? 0
                      : Math.round((completedLessons / totalLessons) * 100);

                  return (
                    <div
                      className="student-card progress-subject-card"
                      key={subject.id}
                    >
                      <DonutChart percentage={progress} />

                      <div>
                        <h3>{subject.name}</h3>
                        <p>Total Lessons This Month: {totalLessons}</p>
                        <p>Completed Lessons: {completedLessons}</p>
                        <p>Needs Work: {needsWorkLessons}</p>
                        <p>
                          Progress:{" "}
                          {totalLessons === 0
                            ? "No lessons this month"
                            : `${progress}%`}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          );
        })
      )}
    </main>
  );
}

export default Progress;