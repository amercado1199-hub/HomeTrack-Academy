import { useEffect, useState } from "react";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [attendance, setAttendance] = useState([]);

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
  }, []);

  const completedLessons = lessons.filter((lesson) => lesson.status === "Completed").length;
  const plannedLessons = lessons.filter((lesson) => lesson.status === "Planned").length;
  const needsWorkLessons = lessons.filter((lesson) => lesson.status === "Needs Work").length;
  const recentLessons = lessons.slice(-3).reverse();

  function getSubjectLessons(subjectId) {
    return lessons.filter((lesson) => lesson.subject_id === subjectId);
  }

  function getCompletedLessons(subjectId) {
    return getSubjectLessons(subjectId).filter(
      (lesson) => lesson.status === "Completed"
    );
  }

  function getSubjectProgress(subjectId) {
    const total = getSubjectLessons(subjectId).length;
    const completed = getCompletedLessons(subjectId).length;
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }

  return (
    <main className="dashboard-page course-dashboard">
      <section className="dashboard-topper fun-hero">
        <div className="hero-copy">
          <p className="eyebrow">Welcome back</p>
          <h1>Ready for today’s learning?</h1>
          <span>
            Plan lessons, track progress, record attendance, and celebrate wins.
          </span>
        </div>

        <div className="topper-badge">
          <strong>{students.length}</strong>
          <small>Students</small>
        </div>

        <div className="hero-doodle doodle-one">✨</div>
        <div className="hero-doodle doodle-two">📚</div>
        <div className="hero-doodle doodle-three">💗</div>
      </section>

      <section className="quick-stats">
        <div className="mini-stat-card">
          <div className="mini-icon">👩‍🎓</div>
          <div>
            <p>Total Students</p>
            <h3>{students.length}</h3>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-icon">✅</div>
          <div>
            <p>Completed</p>
            <h3>{completedLessons}</h3>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-icon">📝</div>
          <div>
            <p>Planned</p>
            <h3>{plannedLessons}</h3>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-icon">⚠️</div>
          <div>
            <p>Needs Work</p>
            <h3>{needsWorkLessons}</h3>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-icon">📅</div>
          <div>
            <p>Attendance</p>
            <h3>{attendance.length}</h3>
          </div>
        </div>
      </section>

      <section className="dashboard-two-column">
        <div className="dashboard-panel">
          <div className="section-header">
            <h2>My Subjects</h2>
            <p>Progress based on completed lessons.</p>
          </div>

          {subjects.length === 0 ? (
            <div className="empty-dashboard-card">
              <h3>No subjects yet</h3>
              <p>Add a student to automatically create starter subjects.</p>
            </div>
          ) : (
            <div className="course-grid compact-course-grid">
              {subjects.map((subject, index) => {
                const totalLessons = getSubjectLessons(subject.id).length;
                const completed = getCompletedLessons(subject.id).length;
                const progress = getSubjectProgress(subject.id);
                const icons = ["➗", "📚", "🔬", "✏️", "🌎", "🎨", "🧠"];

                return (
                  <div className="course-card" key={subject.id}>
                    <div className="course-icon">{icons[index % icons.length]}</div>

                    <div className="course-info">
                      <h3>{subject.name}</h3>
                      <p>{completed} / {totalLessons} complete</p>
                    </div>

                    <div className="course-progress-row">
                      <span>{progress}%</span>
                      <span>{completed}/{totalLessons}</span>
                    </div>

                    <div className="course-progress-bar">
                      <div
                        className="course-progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="dashboard-panel">
          <div className="section-header">
            <h2>Recent Lessons</h2>
            <p>Your latest lesson activity.</p>
          </div>

          {recentLessons.length === 0 ? (
            <div className="empty-dashboard-card">
              <h3>No lessons yet</h3>
              <p>Add a lesson to see recent activity here.</p>
            </div>
          ) : (
            recentLessons.map((lesson) => (
              <div className="student-card" key={lesson.id}>
                <h3>{lesson.title}</h3>
                <p>Date: {lesson.lesson_date}</p>
                <p>Status: {lesson.status}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;