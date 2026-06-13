import { useEffect, useState } from "react";

function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [title, setTitle] = useState("");
  const [lessonDate, setLessonDate] = useState("");
  const [status, setStatus] = useState("Planned");
  const [subjectId, setSubjectId] = useState("");
  const [workImage, setWorkImage] = useState(null);
  const [futureWorkImage, setFutureWorkImage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5555/lessons", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setLessons(data));

    fetch("http://localhost:5555/subjects", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setSubjects(data));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("lesson_date", lessonDate);
    formData.append("status", status);
    formData.append("subject_id", subjectId);

    if (workImage) {
      formData.append("work_image", workImage);
    }

    if (futureWorkImage) {
      formData.append("future_work_image", futureWorkImage);
    }

    fetch("http://localhost:5555/lessons", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((newLesson) => {
        setLessons([...lessons, newLesson]);
        setTitle("");
        setLessonDate("");
        setStatus("Planned");
        setSubjectId("");
        setWorkImage(null);
        setFutureWorkImage(null);
      });
  }

  function handleStatusChange(id, newStatus) {
    fetch(`http://localhost:5555/lessons/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
      .then((res) => res.json())
      .then((updatedLesson) => {
        setLessons(
          lessons.map((lesson) =>
            lesson.id === id ? updatedLesson : lesson
          )
        );
      });
  }

  function getSubjectName(id) {
    const subject = subjects.find((subject) => subject.id === id);
    return subject ? subject.name : "No subject assigned";
  }

  function getStatusClass(status) {
    if (status === "Completed") return "completed";
    if (status === "Needs Work") return "needs-work";
    if (status === "Skipped") return "skipped";
    return "planned";
  }

  return (
    <div className="dashboard-card">
      <h1>Lessons</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="date"
          value={lessonDate}
          onChange={(e) => setLessonDate(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Planned">Planned</option>
          <option value="Completed">Completed</option>
          <option value="Needs Work">Needs Work</option>
          <option value="Skipped">Skipped</option>
        </select>

        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          <option value="">Choose a subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>

        <label>Completed Work Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setWorkImage(e.target.files[0])}
        />

        <label>Future Work Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFutureWorkImage(e.target.files[0])}
        />

        <button type="submit">Add Lesson</button>
      </form>

      {lessons.map((lesson) => (
        <div
          className={`student-card ${getStatusClass(lesson.status)}`}
          key={lesson.id}
        >
          <h3>{lesson.title}</h3>
          <p>Date: {lesson.lesson_date}</p>
          <p>Subject: {getSubjectName(lesson.subject_id)}</p>

          <select
            value={lesson.status}
            onChange={(e) =>
              handleStatusChange(lesson.id, e.target.value)
            }
          >
            <option value="Planned">Planned</option>
            <option value="Completed">Completed</option>
            <option value="Needs Work">Needs Work</option>
            <option value="Skipped">Skipped</option>
          </select>

          {lesson.work_image && (
            <div>
              <h4>Completed Work</h4>
              <img
                src={`http://localhost:5555${lesson.work_image}`}
                alt="Completed Work"
                className="lesson-image"
              />
            </div>
          )}

          {lesson.future_work_image && (
            <div>
              <h4>Future Work</h4>
              <img
                src={`http://localhost:5555${lesson.future_work_image}`}
                alt="Future Work"
                className="lesson-image"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Lessons;