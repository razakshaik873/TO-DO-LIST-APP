const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");
const dueDateInput = document.getElementById("dueDate");
const categoryInput = document.getElementById("category");
const darkModeToggle = document.getElementById("darkModeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";


if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
  darkModeToggle.checked = true;
}


darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark", darkModeToggle.checked);
  localStorage.setItem("darkMode", darkModeToggle.checked);
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks
    .filter(task => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "task-item";
      if (task.completed) li.classList.add("completed");

      const taskLeft = document.createElement("div");
      taskLeft.className = "task-left";

      const span = document.createElement("span");
      span.textContent = `${task.text} (${task.category})`;

      const meta = document.createElement("div");
      meta.className = "task-meta";
      if (task.dueDate) meta.textContent =` Due: ${task.dueDate}`;

      taskLeft.appendChild(span);
      taskLeft.appendChild(meta);

      const buttons = document.createElement("div");
      buttons.className = "task-buttons";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.onchange = () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      };

      const editBtn = document.createElement("button");
      editBtn.innerHTML = "✏";
      editBtn.className = "edit-btn";
      editBtn.onclick = () => {
        const newText = prompt("Edit your task:", task.text);
        if (newText) {
          task.text = newText.trim();
          saveTasks();
          renderTasks();
        }
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "🗑";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => {
        li.classList.add("removing");
        setTimeout(() => {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        }, 400);
      };

      buttons.appendChild(checkbox);
      buttons.appendChild(editBtn);
      buttons.appendChild(deleteBtn);

      li.appendChild(taskLeft);
      li.appendChild(buttons);
      taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const category = categoryInput.value;

  if (text === "") {
    alert("Enter a task!");
    return;
  }

  tasks.push({ text, completed: false, dueDate, category });
  taskInput.value = "";
  dueDateInput.value = "";
  categoryInput.value = "General";
  saveTasks();
  renderTasks();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();