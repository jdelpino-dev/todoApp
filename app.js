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
  let lastTodoId = 0;

  initializeApp();
  registerEventHandlers();

  // Initializes the App with the content of the LocalStorage
  // in case it is available.
  function initializeApp() {
    if ("storedTodos" in localStorage && localStorage.storedTodos) {
      loadStoredTodos();
    } else {
      loadTodoSample();
    }
  }

  function loadStoredTodos() {
    // Retrieves the last Id and store it in a temporary variable
    lastTodoId = parseInt(localStorage.lastTodoId);
    // Creates temporary object and stores the data parsed from
    // local storage.
    todosInDom = JSON.parse(localStorage.storedTodos);
    // Adds the retrieved data to the DOM
    for (let todoId in todosInDom) {
      addNewTodo(
        todosInDom[todoId].text,
        todosInDom[todoId].status,
        todoId,
        (shouldUpdate = false)
      );
    }
  }

  function loadTodoSample() {
    // In case the local storage is empty it just
    // add a todo tutorial example to the DOM.
    lastTodoId = 0;
    localStorage.lastTodoId = lastTodoId;
    const text =
      "Sample todo… Try the checkbox and the delete \
                 button";
    addNewTodo(text, "todo-sample", (shouldUpdate = false));
  }

  function registerEventHandlers() {
    // Adds the functionality that add todos
    todoAdderForm.addEventListener("submit", function (event) {
      // Disables the form default behavior
      event.preventDefault();
      // It trims the new todo input from spaces and checks
      // if there is morethan just spaces.
      const todoInputText = todoInput.value.trim();
      if (!todoInputText) {
        alert("The new todo is empty");
        todoInput.value = "";
      } else {
        // Add the new todo
        const newTodoId = lastTodoId + 1;
        addNewTodo(
          todoInput.value,
          "pending",
          newTodoId,
          (shouldUpdate = true)
        );
        // Updates the lastTodoId values in memoryt and storage
        lastTodoId++;
        localStorage.lastTodoId = lastTodoId;
        // Clears the input field
        todoInput.value = "";
      }
    });

    // Adds the main functionality for the todo list:
    //      checking a todo as done, uncheking it as todo,
    //      and removing it from the list.
    todoList.addEventListener("click", function (event) {
      const clickTarget = event.target;
      const targetName = clickTarget.tagName;
      const targetParent = clickTarget.parentElement;
      // Behaves depending on the object clicked
      if (targetName === "BUTTON") {
        targetParent.remove(); // Removes the todo
        updateObjectAndStorage(targetParent, "remove");
        // localStorage.lastTodoId = lastTodoId;
      } else if (targetName === "INPUT") {
        const todoText = targetParent.querySelector(".todo-text");
        // Mark a todo as done or pending
        todoText.classList.toggle("done");
        todoText.classList.toggle("pending");
        updateObjectAndStorage(targetParent, "toggle-checkbox");
      }
    });
  }

  // High level function that adds a new todo element:
  //        to the dom, the todo object and the storage
  function addNewTodo(text, status, todoId, shouldUpdate) {
    // Creates the new todo element
    const newTodo = createNewTodo(text, status, todoId);
    // Adds the todo to the list
    todoList.appendChild(newTodo);
    if ((status !== "todo-sample") & shouldUpdate) {
      updateObjectAndStorage(newTodo, "add");
    }
  }

  // This functions creates the newTodo html element
  function createNewTodo(text, status, todoId) {
    // Creates the new todo pieces
    const newTodo = document.createElement("li");
    const checkBox = document.createElement("input");
    const todoText = document.createElement("span");
    const removeBtn = document.createElement("button");
    // Set the todo attributes
    newTodo.setAttribute("data-id", todoId);
    checkBox.type = "checkbox";
    checkBox.name = "a-checkbox";
    if (status === "done" || status === "todo-sample") {
      checkBox.checked = true;
    }
    if (status === "todo-sample") {
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
  function updateObjectAndStorage(todoItem, operation) {
    // Excludes the sample todo from local storage.
    notSample = !todoItem.classList.contains("todo-sample");
    if (notSample) {
      // Convert the data-id into an integer
      const todoId = parseInt(todoItem.getAttribute("data-id"));
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
          todosInDom[todoId] = {
            text: text,
            status: status,
          };
          break;
        case "toggle-checkbox":
          todosInDom[todoId].status = status;
          break;
        case "remove":
          delete todosInDom[todoId];
          break;
      }
      // Store the changes in the local storage
      localStorage.storedTodos = JSON.stringify(todosInDom);
    }
  }
})();
