let todos = [];

let renderTaskList = (todos) => {
  let elTaskList = document.querySelector("#task-list");
  elTaskList.innerHTML = "";

  let htmlUI = "";
  for (let i = 0; i < todos.length; i++) {
    htmlUI += `
      <li class="task-item">
      <span class="task-text" style="${todos[i].isCompleted ? "text-decoration: line-through" : ""}">${todos[i].title}</span>
      <span class="task-time">${todos[i].createdAt}</span>
      <div class="task-actions">
        <i class="fa-solid fa-trash-can" style="color: red;"></i>
      </div>
    </li>
    `;
  }

  elTaskList.innerHTML = htmlUI;
};

//crete a task
let elAddBtn = document.querySelector("#add-btn");
let elInputTask = document.querySelector("#input-task");

let handleAddTodo = (e) => {
  e.preventDefault();
  let todoTitle = elInputTask.value;
  let newTodo = {
    title: todoTitle,
    createdAt: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    isCompleted: false,
  };
  todos.push(newTodo);
  renderTaskList(todos);
  elInputTask.value = "";
};

elAddBtn.addEventListener("click", handleAddTodo);
window.onload = () => renderTaskList(todos);
