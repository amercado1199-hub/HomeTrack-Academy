import os
from werkzeug.utils import secure_filename
from flask import send_from_directory
from flask import request, session
from config import app, db
from models import User, Student, Subject, Lesson, Attendance, FieldTrip

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    
@app.route("/")
def index():
    return {"message": "HomeTrack Academy API is running!"}


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    existing_user = User.query.filter(
        (User.username == data["username"]) | (User.email == data["email"])
    ).first()

    if existing_user:
        return {"error": "Username or email already exists"}, 422

    user = User(
        username=data["username"],
        email=data["email"]
    )

    user.password = data["password"]

    db.session.add(user)
    db.session.commit()

    session["user_id"] = user.id

    return user.to_dict(), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data["email"]).first()

    if user and user.authenticate(data["password"]):
        session["user_id"] = user.id
        return user.to_dict(), 200

    return {"error": "Invalid credentials"}, 401


@app.route("/check_session")
def check_session():
    user_id = session.get("user_id")

    if user_id:
        user = User.query.get(user_id)
        return user.to_dict(), 200

    return {"error": "Unauthorized"}, 401


@app.route("/logout", methods=["DELETE"])
def logout():
    session.pop("user_id", None)
    return {}, 204


@app.route("/students", methods=["GET", "POST"])
def students():
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    if request.method == "GET":
        students = Student.query.filter_by(user_id=user_id).all()
        return [student.to_dict() for student in students], 200

    if request.method == "POST":
        data = request.get_json()

        new_student = Student(
            name=data.get("name"),
            grade_level=data.get("grade_level"),
            user_id=user_id
        )

        db.session.add(new_student)
        db.session.commit()

        basic_subjects = [
            "Math",
            "Reading",
            "Writing",
            "Science",
            "Social Studies",
            "Art"
        ]

        for subject_name in basic_subjects:
            subject = Subject(
                name=subject_name,
                student_id=new_student.id
            )
            db.session.add(subject)

        db.session.commit()

        return new_student.to_dict(), 201


@app.route("/students/<int:id>", methods=["PATCH"])
def update_student(id):
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    student = Student.query.filter_by(id=id, user_id=user_id).first()

    if not student:
        return {"error": "Student not found"}, 404

    data = request.get_json()

    student.name = data.get("name", student.name)
    student.grade_level = data.get("grade_level", student.grade_level)

    db.session.commit()

    return student.to_dict(), 200


@app.route("/students/<int:id>", methods=["DELETE"])
def delete_student(id):
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    student = Student.query.filter_by(id=id, user_id=user_id).first()

    if not student:
        return {"error": "Student not found"}, 404

    db.session.delete(student)
    db.session.commit()

    return {}, 204


@app.route("/subjects", methods=["GET", "POST"])
def subjects():
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    if request.method == "GET":
        subjects = (
            Subject.query
            .join(Student)
            .filter(Student.user_id == user_id)
            .all()
        )

        return [subject.to_dict() for subject in subjects], 200

    if request.method == "POST":
        data = request.get_json()

        student = Student.query.filter_by(
            id=data.get("student_id"),
            user_id=user_id
        ).first()

        if not student:
            return {"error": "Student not found"}, 404

        subject = Subject(
            name=data.get("name"),
            student_id=student.id
        )

        db.session.add(subject)
        db.session.commit()

        return subject.to_dict(), 201

@app.route("/lessons", methods=["GET", "POST"])
def lessons():
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    if request.method == "GET":
        page = request.args.get("page", 1, type=int)
        per_page = request.args.get("per_page", 5, type=int)

        query = (
            Lesson.query
            .join(Subject)
            .join(Student)
            .filter(Student.user_id == user_id)
        )

        paginated_lessons = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        return {
            "lessons": [lesson.to_dict() for lesson in paginated_lessons.items],
            "page": paginated_lessons.page,
            "pages": paginated_lessons.pages,
            "total": paginated_lessons.total
        }, 200

    if request.method == "POST":
        title = request.form.get("title")


@app.route("/lessons/<int:id>", methods=["PATCH"])
def update_lesson(id):
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    lesson = (
        Lesson.query
        .join(Subject)
        .join(Student)
        .filter(
            Lesson.id == id,
            Student.user_id == user_id
        )
        .first()
    )

    if not lesson:
        return {"error": "Lesson not found"}, 404

    data = request.get_json()

    lesson.title = data.get("title", lesson.title)
    lesson.lesson_date = data.get("lesson_date", lesson.lesson_date)
    lesson.status = data.get("status", lesson.status)

    db.session.commit()

    return lesson.to_dict(), 200


@app.route("/attendance", methods=["GET", "POST"])
def attendance():
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    if request.method == "GET":
        attendance = (
            Attendance.query
            .join(Student)
            .filter(Student.user_id == user_id)
            .all()
        )

        return [record.to_dict() for record in attendance], 200

    if request.method == "POST":
        data = request.get_json()

        student = Student.query.filter_by(
            id=data.get("student_id"),
            user_id=user_id
        ).first()

        if not student:
            return {"error": "Student not found"}, 404

        record = Attendance(
            attendance_date=data.get("attendance_date"),
            status=data.get("status"),
            student_id=student.id
        )

        db.session.add(record)
        db.session.commit()

        return record.to_dict(), 201

@app.route("/field-trips", methods=["GET", "POST"])
def field_trips():
    user_id = session.get("user_id")

    if not user_id:
        return {"error": "Unauthorized"}, 401

    if request.method == "GET":
        trips = (
            FieldTrip.query
            .join(Student)
            .filter(Student.user_id == user_id)
            .all()
        )

        return [trip.to_dict() for trip in trips], 200

    if request.method == "POST":
        data = request.get_json()

        student = Student.query.filter_by(
            id=data.get("student_id"),
            user_id=user_id
        ).first()

        if not student:
            return {"error": "Student not found"}, 404

        trip = FieldTrip(
            title=data.get("title"),
            location=data.get("location"),
            trip_date=data.get("trip_date"),
            notes=data.get("notes"),
            student_id=student.id
        )

        db.session.add(trip)
        db.session.commit()

        return trip.to_dict(), 201

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(
        UPLOAD_FOLDER,
        filename
    )
       
if __name__ == "__main__":
    app.run(port=5555, debug=True)