/*
  TODO Exercise from Unit 4
  of Springboard SWE Bootcamp
   
  Solution by José Delpino*/

// App function that encapsulates everything.
//This minimizes global variables by wrapping all the app code inside an IIFE
// (Immediately Invoked Function Expression), which encasulates all
// variables and functions.

(function todoApp() {
  // Defines the global constants and variables
  const todoAdderForm = document.querySelector("#add-todo");
  const todoInput = document.querySelector("#todo-input");
  const todoList = document.querySelector("#todo-list");
  let todosInDom = {};
  let todosFromLocalStorage;
  let lastId = 0;

  // Initializes the App with the cobntentc of the LocalStorage
  // in case it is available.
  //    —I should encapsulate this a initialzation functions and
  //    two loading functions—.
  if ("storedTodos" in localStorage && localStorage.storedTodos) {
    // Retrieves the last Id and store it in a temporary variable
    maxId = localStorage.lastId;
    // Creates temporary object and stores the data parsed from
    // local storage.
    todosFromLocalStorage = JSON.parse(localStorage.storedTodos);
    // Adds the retrieved data to the DOM
    for (let id in todosFromLocalStorage) {
      addNewTodo(
        todosFromLocalStorage[id].text,
        todosFromLocalStorage[id].status,
        (isUpdateNeeded = false)
      );
    }
    // Updates the data object used to keep track of changes
    // and update the local storage in real time.
    todosInDom = todosFromLocalStorage;
    todosFromLocalStorage = {};
    // Updates stores the last assign ID into the global variable
    // and local storage
    lastId = maxId;
    localStorage.lastId = maxId;
  } else {
    // In case the local storage is empty it just
    // add a todo tutorial example to the DOM.
    const text =
      "Sample todo… Try the checkbox and the delete \
                 button";
    localStorage.lastId = lastId;
    addNewTodo(text, "todo-sample", (isUpdateNeeded = false));
  }

  // Registers the main event handlers:
  //      1. The handler for the todo adder form
  //      2. The handler for the todo list behavior

  // Adds the functionality that add todos
  todoAdderForm.addEventListener("submit", function (event) {
    // Disables the form default behavior
    event.preventDefault();
    // It trims the new todo input from spaces and checks
    // if there is morethan just spaces.
    let todoInputText = todoInput.value.trim();
    if (!todoInputText) {
      alert("The new todo is empty");
      todoInput.value = "";
    } else {
      // Add the new todo
      addNewTodo(todoInput.value, "pending", (isUpdateNeeded = true));
      localStorage.lastId = lastId;
      // Clears the input field
      todoInput.value = "";
    }
  });

  // Adds the main functionality for the todo list:
  //      checking a todo as done, uncheking it as todo,
  //      and removing it from the list.
  todoList.addEventListener("click", function (event) {
    const clickTarget = event.target;
    const targetName = event.target.tagName;
    const targetParent = event.target.parentElement;
    // Behaves depending on the object clicked
    if (targetName === "BUTTON") {
      targetParent.remove(); // Removes the todo
      updateStorage(targetParent, "remove");
      localStorage.lastId = lastId;
    } else if (targetName === "INPUT") {
      const todoText = targetParent.querySelector(".todo-text");
      // Mark a todo as done or pending
      todoText.classList.toggle("done");
      todoText.classList.toggle("pending");
      updateStorage(targetParent, "toggle-checkbox");
    }
  });

  // High level function that adds a new todo element:
  //        to the dom, the todo object and the storage
  function addNewTodo(text, status, isUpdateNeeded) {
    // Creates the new todo element
    const newTodo = createNewTodo(text, status);
    // Adds the todo to the list
    todoList.appendChild(newTodo);
    if (status != "todo-sample") {
      lastId++;
    }
    if ((status != "todo-sample") & isUpdateNeeded) {
      updateStorage(newTodo, "add");
    }
  }

  // This functions creates the newTodo html element
  function createNewTodo(text, status) {
    // Creates the new todo pieces
    const newTodo = document.createElement("li");
    const checkBox = document.createElement("input");
    const todoText = document.createElement("span");
    const removeBtn = document.createElement("button");
    let id;
    // Adds the todo id
    if (status === "todo-sample") {
      newTodo.setAttribute("data-id", 0);
    } else {
      newTodo.setAttribute("data-id", lastId + 1);
    }
    // Adds the other attributes to the todo element
    checkBox.type = "checkbox";
    checkBox.name = "a-checkbox";
    if (status === "done" || status === "todo-sample") {
      checkBox.checked = true;
      newTodo.classList.toggle("todo-sample");
      status = "done";
    }
    todoText.innerText = text;
    todoText.classList.toggle("todo-text");
    todoText.classList.toggle(status);
    removeBtn.classList.toggle("removerBtn");
    removeBtn.innerText = "x";
    // Puts all the pieces together into a todo
    newTodo.appendChild(checkBox);
    newTodo.appendChild(todoText);
    newTodo.appendChild(removeBtn);
    return newTodo;
  }

  // Updates both the local storage and the JS object mirror
  // of the todo in the DOM.
  //        Handles properly different changes
  //        that could take place in the todo list: insertions,
  //         removals, and change of status.
  function updateStorage(todoItem, command) {
    // Excludes the sample todo from local storage.
    notSample = !todoItem.classList.contains("todo-sample");
    if (notSample) {
      // Convert the data-id into an integer
      const id = parseInt(todoItem.getAttribute("data-id"));
      const todoText = todoItem.querySelector(".todo-text");
      // Gets the status of the todo item
      let status;
      if (todoText.classList.contains("done")) {
        status = "done";
      } else {
        status = "pending";
      }
      // Applies the proper update to JS mirror object
      // according to each case.
      switch (command) {
        case "add":
          const text = todoText.innerText;
          todosInDom[id] = {
            text: text,
            status: status,
          };
          break;
        case "toggle-checkbox":
          todosInDom[id].status = status;
          break;
        case "remove":
          delete todosInDom[id];
          break;
      }
      // Store the changes in the local storage
      localStorage.storedTodos = JSON.stringify(todosInDom);
    }
  }
})();
