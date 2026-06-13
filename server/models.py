from config import db, bcrypt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(
        db.String,
        nullable=False,
        unique=True
    )

    email = db.Column(
        db.String,
        nullable=False,
        unique=True
    )

    password_hash = db.Column(db.String)

    students = db.relationship(
        "Student",
        backref="user",
        cascade="all, delete-orphan"
    )

    @property
    def password(self):
        raise AttributeError("Password is private.")

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.generate_password_hash(
            password
        ).decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self.password_hash,
            password
        )

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String,
        nullable=False
    )

    grade_level = db.Column(db.String)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id")
    )

    subjects = db.relationship(
        "Subject",
        backref="student",
        cascade="all, delete-orphan"
    )

    attendance_records = db.relationship(
        "Attendance",
        backref="student",
        cascade="all, delete-orphan"
    )
    field_trips = db.relationship(
    "FieldTrip",
    backref="student",
    cascade="all, delete-orphan"
)
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "grade_level": self.grade_level,
            "user_id": self.user_id
        }


class Subject(db.Model):
    __tablename__ = "subjects"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String,
        nullable=False
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id")
    )

    lessons = db.relationship(
        "Lesson",
        backref="subject",
        cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "student_id": self.student_id
        }


class Lesson(db.Model):
    __tablename__ = "lessons"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(
        db.String,
        nullable=False
    )

    lesson_date = db.Column(db.String)

    status = db.Column(
        db.String,
        default="Planned"
    )

    work_image = db.Column(db.String)
    future_work_image = db.Column(db.String)

    subject_id = db.Column(
        db.Integer,
        db.ForeignKey("subjects.id")
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "lesson_date": self.lesson_date,
            "status": self.status,
            "work_image": self.work_image,
            "future_work_image": self.future_work_image,
            "subject_id": self.subject_id
        }


class Attendance(db.Model):
    __tablename__ = "attendance"

    id = db.Column(db.Integer, primary_key=True)

    attendance_date = db.Column(db.String)

    status = db.Column(
        db.String,
        default="Present"
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id")
    )

    def to_dict(self):
        return {
            "id": self.id,
            "attendance_date": self.attendance_date,
            "status": self.status,
            "student_id": self.student_id
        }

class FieldTrip(db.Model):
    __tablename__ = "field_trips"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    location = db.Column(db.String)
    trip_date = db.Column(db.String)
    notes = db.Column(db.String)

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("students.id")
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "location": self.location,
            "trip_date": self.trip_date,
            "notes": self.notes,
            "student_id": self.student_id
        }