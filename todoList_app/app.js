const API_URL = "http://localhost:3002/todos";
const $todoForm = document.querySelector(".todo_form");
const $todoInput = document.querySelector(".todo_input");
const $todos = document.querySelector(".todos");

// 페이지네이션
const $pagination = document.querySelector(".pagination");
const limit = 5; //한페이지당 보여줄 todo개수
const totalCount = 100;
const pageCount = 5; //한번에 보여줄 페이지 번호 버튼의 개수
let currentPage = 3;

const pagination = () => {
  let totalPage = Math.ceil(totalCount / limit);
  let pageGroup = Math.ceil(currentPage / pageCount);
  console.log("전체페이지" + totalPage);
  console.log("페이지그룹:" + pageGroup);

  let lastNum = pageGroup * pageCount;
  if (lastNum > totalPage) {
    lastNum = totalPage;
  }
  let firstNum = lastNum - (pageCount - 1);

  const next = lastNum + 1;
  const prev = firstNum - 1;

  let html = "";

  //첫페이지 그룹이 아닐때만 이전 버튼 보이기
  if (prev > 0) {
    html += `<button class="prev" data-fn="prev">이전</button>`;
  }

  //현재 그룹에 해당하는 페이지 번호들을 버튼으로 만듦
  for (let i = firstNum; i <= lastNum; i++) {
    html += `<button class="pageNum" id="page_${i}">${i}</button>`;
  }

  // 마지막 페이지 그룹이 아닐때만 다음 버튼 보이기
  if (lastNum < totalPage) {
    html += `<button class="next" data-fn="next">다음</button>`;
  }

  $pagination.innerHTML = html;

  //현재 페이지 번호 버튼 color적용
  const $currentPageNum = document.querySelector(`#page_${currentPage}`);
  $currentPageNum.style.color = "orange";

  const $currentPageNumAll = document.querySelectorAll(".pagination button");

  $currentPageNumAll.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.fn === "prev") {
        currentPage = prev;
      } else if (btn.dataset.fn === "next") {
        currentPage = next;
      } else {
        currentPage = Number(btn.innerText);
        console.log(currentPage);
      }
      pagination(); //버튼 다시 렌더링
      getTodos(); //현재 currentPage에 해당하는 데이터 fetch
    });
  });
};

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
    const res = await fetch(`${API_URL}?_page=${currentPage}&_limit=${limit}`);
    const todosData = await res.json();
    $todos.innerHTML = ""; //페이지 변경시 기존 목록 지우기
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
    pagination();
  });
  $todoForm.addEventListener("submit", addTodo);
  $todos.addEventListener("click", changeEditEl);
  $todos.addEventListener("click", editTodo);
  $todos.addEventListener("click", deleteTodo);
  $todos.addEventListener("click", toggleCheck);
};
init();
