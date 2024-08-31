const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box"),
    addTodoBtn = document.querySelector(".todo-btn"); // Adjusted class name

let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list")) || [];

// Existing code for filter functionality
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status === "completed" ? "checked" : "";
            if (filter === todo.status || filter === "all") {
                liTag += `<li class="task">
                    <label for="${id}">
                        <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="${completed}">${todo.name}</p>
                    </label>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="task-menu">
                            <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                            <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                        </ul>
                    </div>
                </li>`;
            }
        });
    }

    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");

// Existing code for showing menu
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName !== "I" || e.target !== selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

// Existing code for updating status
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

// Existing code for editing task
function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
    checkInput(); // Check input when editing a task
}

// Existing code for deleting task
function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

// Existing code for clearing all tasks
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos = [];
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
});

// Handle adding tasks with Enter key and "Add Todo" button
function addTask() {
    let userTask = taskInput.value.trim();
    if (userTask) {
        if (!isEditTask) {
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
        checkInput(); // Check input when adding a task
    }
}

// Check input and toggle button state
function checkInput() {
    if (taskInput.value.trim()) {
        addTodoBtn.classList.add("active");
    } else {
        addTodoBtn.classList.remove("active");
    }
}

// Event listener for Enter key
taskInput.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        addTask();
    }
    checkInput(); // Check input on keyup
});

// Event listener for "Add Todo" button
addTodoBtn.addEventListener("click", addTask);

// Initial check to disable button if input is empty
checkInput();
