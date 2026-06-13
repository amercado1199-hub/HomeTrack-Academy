from config import app, db
from models import Student

with app.app_context():
    Student.query.delete()

    student1 = Student(name="Sample Student", grade_level="3rd Grade")
    student2 = Student(name="Test Student", grade_level="5th Grade")

    db.session.add_all([student1, student2])
    db.session.commit()

    print("Database seeded!")