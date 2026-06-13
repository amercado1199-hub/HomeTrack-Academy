import { useEffect, useState } from "react";

function FieldTrips() {
  const [fieldTrips, setFieldTrips] = useState([]);
  const [students, setStudents] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [notes, setNotes] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    fetch("http://localhost:5555/field-trips", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setFieldTrips(data));

    fetch("http://localhost:5555/students", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStudents(data));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:5555/field-trips", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        location,
        trip_date: tripDate,
        notes,
        student_id: parseInt(studentId),
      }),
    })
      .then((res) => res.json())
      .then((newTrip) => {
        setFieldTrips([...fieldTrips, newTrip]);
        setTitle("");
        setLocation("");
        setTripDate("");
        setNotes("");
        setStudentId("");
      });
  }

  function getStudentName(id) {
    const student = students.find((student) => student.id === id);
    return student ? student.name : "Unknown Student";
  }

  return (
    <main className="dashboard-page">
      <section className="hero">
        <h1>Field Trips</h1>
        <p>Plan educational adventures and learning experiences.</p>
      </section>

      <section className="dashboard-card">
        <h2>Add Field Trip</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Trip Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="date"
            value={tripDate}
            onChange={(e) => setTripDate(e.target.value)}
          />

          <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            <option value="">Choose a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <button type="submit">Add Field Trip</button>
        </form>
      </section>

      <section className="field-trip-grid">
        {fieldTrips.map((trip) => (
          <div className="field-trip-card" key={trip.id}>
            <div className="field-trip-icon">🚌</div>
            <h3>{trip.title}</h3>
            <p><strong>Student:</strong> {getStudentName(trip.student_id)}</p>
            <p><strong>Date:</strong> {trip.trip_date}</p>
            <p><strong>Location:</strong> {trip.location}</p>
            <p>{trip.notes}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

export default FieldTrips;