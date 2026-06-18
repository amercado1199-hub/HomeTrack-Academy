# HomeTrack Academy

## Overview

HomeTrack Academy is a full-stack homeschool management application designed to help parents organize and track their students' educational progress. The platform allows users to manage students, subjects, lessons, attendance records, and educational field trips from a single dashboard.

This project was built as a Flatiron School Software Engineering capstone project using React, Flask, SQLAlchemy, and SQLite.

## Features

* User authentication (Sign Up, Login, Logout)
* Student management
* Subject management
* Lesson planning and tracking
* Lesson status tracking (Planned, Completed, Needs Work)
* Attendance records
* Field trip management
* Dashboard with progress statistics
* Image uploads for student work
* User-specific data protection

## Technologies Used

### Frontend

* React
* React Router
* CSS

### Backend

* Flask
* Flask SQLAlchemy
* Flask Migrate
* Flask Session

### Database

* SQLite

## Installation

### Backend Setup

```bash
cd server
pipenv install
pipenv shell
python seed.py
python app.py
```

Backend runs on:

```text
http://127.0.0.1:5555
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Database Models

### User

* id
* username
* email
* password_hash

### Student

* id
* name
* grade_level
* user_id

### Subject

* id
* name
* student_id

### Lesson

* id
* title
* lesson_date
* status
* subject_id
* completed_image
* future_image

### Attendance

* id
* date
* status
* student_id

### FieldTrip

* id
* title
* location
* date
* notes
* user_id

## Future Improvements

* Progress charts and reports
* Printable report cards
* Assignment tracking
* Calendar integration
* Parent reminders and notifications
* Student achievement badges

## Author

Alyssa Mercado

Flatiron School Software Engineering Program
