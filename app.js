class Student {
  constructor(name, age, school, email, parname, roll) {
    this.name = name;
    this.age = age;
    this.school = school;
    this.email = email;
    this.parname = parname;
    this.roll = roll;
  }
}

class UI {
  addStudentToList(student) {
    const list = document.getElementById("student-list");
    // Create a tr
    const row = document.createElement("tr");
    // Append html
    row.innerHTML = `
    <td>${student.name}</td>
    <td>${student.age}</td>
    <td>${student.school}</td>
    <td>${student.email}</td>
    <td>${student.parname}</td>
    <td>${student.roll}</td>
    <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
  }

  deleteStudent(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  showAlert(msg, className) {
    // Create a div
    const div = document.createElement("div");
    // set class
    div.className = `alert ${className}`;
    // Inner text
    div.appendChild(document.createTextNode(msg));
    // Get container
    const container = document.querySelector(".container");
    // Get form
    const form = document.querySelector("#student-form");
    // Insert div
    container.insertBefore(div, form);

    // remove alert after 2 secs
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }

  clearFields() {
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("school").value = "";
    document.getElementById("email").value = "";
    document.getElementById("parent").value = "";
    document.getElementById("roll-number").value = "";
  }
}

// Ls class
class Store {
  static getStudent() {
    let students;
    if (localStorage.getItem("students") === null) {
      students = [];
    } else {
      students = JSON.parse(localStorage.getItem("students"));
    }

    return students;
  }
  static displayStudent() {
    const students = Store.getStudent();

    students.forEach((student) => {
      const ui = new UI();

      ui.addStudentToList(student);
    });
  }
  static addStudent(student) {
    const students = Store.getStudent();

    students.push(student);

    localStorage.setItem("students", JSON.stringify(students));
  }
  static removeStudent(rollNumber) {
    const students = Store.getStudent();

    students.forEach((student, index) => {
      if (student.roll === rollNumber) {
        students.splice(index, 1);
      }
    });
    localStorage.setItem("students", JSON.stringify(students));
  }
}

// Dom load
document.addEventListener("DOMContentLoaded", Store.displayStudent);

// Event litsener for add book
document.querySelector("#student-form").addEventListener("submit", (e) => {
  // Get Inp vals
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const school = document.getElementById("school").value;
  const email = document.getElementById("email").value;
  const parname = document.getElementById("parent").value;
  const rollNumber = document.getElementById("roll-number").value;
  // Instansiate Student
  const student = new Student(name, age, school, email, parname, rollNumber);

  // Instansiate UI
  const ui = new UI();

  if (
    name === "" ||
    school === "" ||
    email === "" ||
    parname === "" ||
    rollNumber === ""
  ) {
    ui.showAlert("Please fill in all fields", "fail");
  } else {
    // Add student to list
    ui.addStudentToList(student);
    // Add student to ls
    Store.addStudent(student);
    // show alert
    ui.showAlert("Student Added", "success");
    // Clear the fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event litsener for delete
document.getElementById("student-list").addEventListener("click", (e) => {
  const ui = new UI();

  ui.deleteStudent(e.target);

  // Add alert
  if (e.target.className === "delete") {
    // Remove from ls
    Store.removeStudent(
      e.target.parentElement.previousElementSibling.textContent
    );
    ui.showAlert("Student Removed", "success");
  }

  e.preventDefault();
});
