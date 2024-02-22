
const newTaskInput = document.getElementById("newTaskInput");
const createTaskButton = document.getElementById("createTaskButton");
const loginErrorMsg = document.getElementById("login-error-msg");


let taskController = new TaskController();


createTaskButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (newTaskInput !== "") {
        var newTask = document.createElement("li");
        newTask.className = "task";
        newTask.id = "task" + Date.now(); // Unique ID for each task
        newTask.draggable = true;
        newTask.addEventListener("dragstart", drag);

        newTask.innerHTML = newTaskInput;

        var todoColumn = document.getElementById("todo");
        todoColumn.appendChild(newTask);

        newTaskInput.value = ""; // Clear the input field
    }

    if (taskController.addTask(username, password)) {
        alert("You have successfully signed in.");
        location.reload();
    } else {
        loginErrorMsg.style.opacity = 1;
    }

})

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    var targetList = event.target.closest('.tasks');

    if (targetList) {
        targetList.appendChild(draggedElement);
    }
}