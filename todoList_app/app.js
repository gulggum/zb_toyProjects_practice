const API_URL = "http://localhost:3002/todos";
const $todoForm = document.querySelector(".todo_form");
const $todoInput = document.querySelector(".todo_input");
const $todos = document.querySelector(".todos");

const createTodoElement = (item) => {
  const { id, content, completed } = item;
  const isChecked = completed ? "checked" : "";
  const $todoItem = document.createElement("div");
  $todoItem.classList.add("item");
  $todoItem.dataset.id = id;
  $todoItem.innerHTML = `
            <div class="content">
              <input
                type="checkbox"
                class='todo_checkbox'
                ${isChecked}
              />
              <label>${content}</label>
              <input type="text" value="${content}" />
            </div>
            <div class="item_buttons content_buttons">
              <button class="todo_edit_button">
                <i class="far fa-edit"></i>
              </button>
              <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
            <div class="item_buttons edit_buttons">
              <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
              </button>
              <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
              </button>
            </div>
      `;
  return $todoItem;
};

//json_server 데이터 불러오기
const getTodos = async () => {
  try {
    const res = await fetch(API_URL);
    const todosData = await res.json();
    renderAllTodos(todosData);
  } catch (error) {
    throw new Error("데이터를 불러오지 못했습니다");
  }
};

//투두 데이터 화면에 렌더링
const renderAllTodos = (todosData) => {
  todosData.forEach((data) => {
    const todosEl = createTodoElement(data);
    const $todos = document.querySelector(".todos");
    $todos.appendChild(todosEl);
  });
};

const addTodo = async (e) => {
  e.preventDefault();
  const todoText = $todoInput.value;
  console.log(todoText);
  const todo = {
    content: todoText,
    completed: false,
  };

  await fetch(API_URL, {
    method: "POST", //보내기
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
};

const changeEditEl = (e) => {
  const target = e.target;
  const $item = target.closest(".item");
  const $label = $item.querySelector("label");
  const $input = $item.querySelector('input[type="text"]');
  const $contentBtns = $item.querySelector(".content_buttons");
  const $editBtns = $item.querySelector(".edit_buttons");
  if (target.className === "todo_edit_button") {
    $label.style.display = "none";
    $input.style.display = "block";
    $contentBtns.style.display = "none";
    $editBtns.style.display = "block";
  }
  if (target.className === "todo_edit_cancel_button") {
    $label.style.display = "block";
    $input.style.display = "none";
    $contentBtns.style.display = "block";
    $editBtns.style.display = "none";
    $input.value = $label.innerText; //수정하려다 삭제시 기존text 복귀
  }
  return;
};

const editTodo = async (e) => {
  const target = e.target;
  if (target.className !== "todo_edit_confirm_button") return;
  const $item = target.closest(".item");
  const $input = $item.querySelector('input[type="text"]');
  const $contentBtns = $item.querySelector(".content_buttons");
  const $editBtns = $item.querySelector(".todo_edit_button");
  const id = $item.dataset.id;
  const content = $input.value;

  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  $editBtns.style.display = "none";
};

const deleteTodo = async (e) => {
  const target = e.target;
  if (target.className !== "todo_remove_button") return;
  const $item = target.closest(".item");
  const id = $item.dataset.id;
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};

const toggleCheck = async (e) => {
  e.preventDefault();
  const target = e.target;
  const $item = target.closest(".item");
  const id = $item.dataset.id;
  const completed = target.checked; //checked toggle
  console.log(completed);
  if (target.className !== "todo_checkbox") return;

  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
};

const init = () => {
  window.addEventListener("DOMContentLoaded", () => {
    getTodos();
  });
  $todoForm.addEventListener("submit", addTodo);
  $todos.addEventListener("click", changeEditEl);
  $todos.addEventListener("click", editTodo);
  $todos.addEventListener("click", deleteTodo);
  $todos.addEventListener("click", toggleCheck);
};
init();
