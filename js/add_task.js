/**
 * Initializes the add task functionality by performing the following steps:
 * 1. Restricts the date selection to future dates.
 * 2. Includes HTML content.
 * 3. Retrieves the list of users asynchronously.
 * 4. Retrieves the list of tasks asynchronously.
 * 5. Renders the list of users.
 * 6. Renders the list of categories.
 * @return {Promise<void>} A promise that resolves when all the initialization steps are completed.
 */
async function initAdd() {
  restrictPastDate();
  includeHTML();
  await usersArray();
  await tasksArray();
  renderUsers();
  renderCategorys();
  console.log(tasks);
  console.log(users);
}

let subtaskList = [];

/**
 * Resets the style of HTML elements by removing the 'selected' class, setting background color to white, and text color to black.
 * Updates the fill color of SVG paths based on the 'onclick' attribute value.
 *
 * @param {Element[]} elements - The array of HTML elements to reset.
 */
function resetElements(elements) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove("selected");
    elements[i].style.backgroundColor = "white";
    elements[i].style.color = "black";
    let svgPaths = elements[i].querySelectorAll("svg path");
    if (svgPaths) {
      for (let j = 0; j < svgPaths.length; j++) {
        if (elements[i].getAttribute("onclick").includes("medium")) {
          svgPaths[j].style.fill = "#FFA800";
        } else {
          svgPaths[j].style.fill = svgPaths[j].getAttribute("originalColor");
        }
      }
    }
  }
}

/**
 * Sets the styles for a selected element based on the provided background color, text color, and SVG color.
 * @param {HTMLElement} selectedElement - The element to set the styles for.
 * @param {string} backgroundColor - The background color to set for the element.
 * @param {string} textColor - The text color to set for the element.
 * @param {string} svgColor - The SVG color to set for the element's SVG paths.
 */
function setPriorityStyles(
  selectedElement,
  backgroundColor,
  textColor,
  svgColor
) {
  if (selectedElement) {
    selectedElement.classList.add("selected");
    selectedElement.style.backgroundColor = backgroundColor;
    selectedElement.style.color = textColor;
    let svgPaths = selectedElement.querySelectorAll("svg path");
    if (svgPaths) {
      for (let j = 0; j < svgPaths.length; j++) {
        svgPaths[j].style.fill = svgColor;
      }
    }
  }
}

/**
 * Toggles the priority of the elements with the class 'prio-button' based on the provided priority.
 * @param {string} priority - The priority to toggle. Must be one of 'urgent', 'medium', or 'low'.
 * @return {void} This function does not return a value.
 */
function togglePriority(priority) {
  let elements = document.getElementsByClassName("prio-button");
  resetElements(elements);
  let selectedElement = document.querySelector("[onclick*='" + priority + "']");
  if (priority === "urgent") {
    setPriorityStyles(selectedElement, "#FF3D00", "white", "white");
  } else if (priority === "medium") {
    setPriorityStyles(selectedElement, "#FFA800", "white", "white");
  } else if (priority === "low") {
    setPriorityStyles(selectedElement, "#7AE229", "white", "white");
  }
}

/**
 * Sets the original color of the SVG paths in each 'prio-button' element to their current fill color.
 * @return {void} This function does not return anything.
 */
window.onload = function () {
  let elements = document.getElementsByClassName("prio-button");
  for (let i = 0; i < elements.length; i++) {
    let svgPaths = elements[i].querySelectorAll("svg path");
    if (svgPaths) {
      for (let j = 0; j < svgPaths.length; j++) {
        svgPaths[j].setAttribute("originalColor", svgPaths[j].style.fill);
      }
    }
  }
};

/**
 * Renders the list of users by appending their HTML representation to the 'users' element.
 * @return {void} This function does not return a value.
 */
function renderUsers() {
  let content = document.getElementById("users");
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.id == 1) continue;
    content.innerHTML += renderUsersHTML(user, i);
  }
}

/**
 * Renders the categorys HTML elements on the page.
 * @return {void} This function does not return a value.
 */
function renderCategorys() {
  let task = document.getElementById("tasks");
  for (let i = 0; i < categorys.length; i++) {
    task.innerHTML += renderCategorysHTML(i);
  }
}

document.addEventListener("click", function (event) {
  let categoryContainer = document.getElementById("selectedCategoryContainer");
  let tasksContainer = document.getElementById("tasks");
  let arrowDownCategory = document.getElementById("arrowDownCategory");
  let arrowUpCategory = document.getElementById("arrowUpCategory");
  if (!categoryContainer.contains(event.target)) {
    if (tasksContainer.classList.contains("show")) {
      tasksContainer.classList.remove("show");
      arrowDownCategory.style.display = "block";
      arrowUpCategory.style.display = "none";
    }
  }
});

/**
 * Toggles the visibility of the category list and the corresponding arrow icons.
 * @return {void} This function does not return a value.
 */
function showCategories() {
  resetCategoryErrorMessage();
  if (document.getElementById("tasks").classList.contains("show")) {
    document.getElementById("tasks").classList.remove("show");
    document.getElementById("arrowDownCategory").style.display = "block";
    document.getElementById("arrowUpCategory").style.display = "none";
  } else {
    document.getElementById("tasks").classList.add("show");
    document.getElementById("arrowDownCategory").style.display = "none";
    document.getElementById("arrowUpCategory").style.display = "block";
  }
}

/**
 * Selects a category from the list and updates the selected category element.
 * @param {Event} event - The event object that triggered the function.
 * @param {number} index - The index of the category to be selected.
 * @return {void} This function does not return a value.
 */
function selectCategory(event, index) {
  event.stopPropagation();
  let selectedCategory = categorys[index];
  document.getElementById("selectedCategory").innerHTML = selectedCategory;
  showCategories();
}

/**
 * Resets the error message content in the category error element.
 * @return {void} This function does not return a value.
 */
function resetCategoryErrorMessage() {
  document.getElementById("categoryErrorMessage").innerHTML = "";
}

/**
 * Restricts the date input field to allow only future dates.
 * @return {void} This function does not return a value.
 */
function restrictPastDate() {
  let dateInput = document.getElementById("date");
  let today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);
}

/**
 * Renders users' emblems based on certain conditions.
 * @return {void} This function does not return a value.
 */
function showUsersEmblem() {
  let usersEmblem = document.getElementById("usersEmblem");
  usersEmblem.innerHTML = "";
  let renderedCount = 0;
  let extraCount = 0;
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    if (user.id == 1) continue;
    let userListChecked = document.getElementById("contactList" + i);
    let checkedUser = document.getElementById(`checkbox${i}`);
    if (checkedUser.checked == true) {
      userListChecked.classList.add("contact-list-selected");
      if (renderedCount < 5) {
        usersEmblem.innerHTML += renderEmblemUsers(user);
        renderedCount++;
      } else {
        extraCount++;
      }
    } else {
      userListChecked.classList.remove("contact-list-selected");
    }
  }
  if (extraCount > 0) {
    usersEmblem.innerHTML += renderGreyEmblem(extraCount);
  }
}

document.addEventListener("click", function (event) {
  let usersContainer = document.getElementById("users");
  let arrowDownUser = document.getElementById("arrowDownUser");
  let arrowUpUser = document.getElementById("arrowUpUser");
  let contactContainer = document.querySelector(".contact-container");
  if (
    !usersContainer.contains(event.target) &&
    !contactContainer.contains(event.target)
  ) {
    if (usersContainer.classList.contains("show")) {
      usersContainer.classList.remove("show");
      arrowDownUser.style.display = "block";
      arrowUpUser.style.display = "none";
    }
  }
});

/**
 * Toggles the visibility of the user list and the corresponding arrow icons.
 * @return {void} This function does not return a value.
 */
function showUsers() {
  if (document.getElementById("users").classList.contains("show")) {
    document.getElementById("users").classList.remove("show");
    document.getElementById("arrowDownUser").style.display = "block";
    document.getElementById("arrowUpUser").style.display = "none";
  } else {
    document.getElementById("users").classList.add("show");
    document.getElementById("arrowDownUser").style.display = "none";
    document.getElementById("arrowUpUser").style.display = "block";
  }
}

/**
 * Renders the subtask list by updating the HTML content of the 'subtask' element.
 * @return {void} This function does not return a value.
 */
function renderSubtask() {
  let subtask = document.getElementById("subtask");
  subtask.innerHTML = "";
  for (let i = 0; i < Math.min(subtaskList.length, 5); i++) {
    subtask.innerHTML += renderSubtaskHTML(i);
  }
}

/**
 * Function to determine the selected priority based on the 'selected' class of buttons.
 * @return {string} The selected priority ('urgent', 'low', or 'medium').
 */
function getSelectedPrio() {
  let urgentBtn = document.getElementById("urgentPrio");
  let lowprioBtn = document.getElementById("lowPrio");
  if (urgentBtn.classList.contains("selected")) {
    return "urgent";
  } else if (lowprioBtn.classList.contains("selected")) {
    return "low";
  } else {
    return "medium";
  }
}

/**
 * Retrieves the IDs of all selected checkboxes in the contact list.
 * @return {Array<string>} An array of selected user IDs.
 */
function getSelectedUserIds() {
  let checkboxes = document.querySelectorAll(
    '.contact-list input[type="checkbox"]:checked'
  );
  let selectedUserIds = [];
  for (let checkbox of checkboxes) {
    let userId = +checkbox.getAttribute("data-userid");
    user = users.find((u) => u.id === userId);
    if (userId) {
      selectedUserIds.push(user.id);
    } else {
      console.error(`Kontakt mit ID ${userId} nicht gefunden.`);
    }
  }
  return selectedUserIds;
}

/**
 * Creates a new task and adds it to the board.
 * @param {Event} event - The event object that triggered the function.
 * @return {Promise<void>} - A promise that resolves when the task is created and added to the board.
 */
async function createNewTask(event) {
  event.preventDefault();
  let selectedCategory = document.getElementById("selectedCategory").innerHTML;
  let spanContactContainer = document.getElementById(
    "selectedCategoryContainer"
  );
  let categoryErrorMessage = document.getElementById("categoryErrorMessage");
  if (
    selectedCategory === "Select task category" ||
    selectedCategory.trim() === ""
  ) {
    spanContactContainer.style.border = "1px solid red";
    categoryErrorMessage.style.color = "red";
    categoryErrorMessage.style.display = "flex";
    categoryErrorMessage.innerHTML = "Please select a category";
    return;
  }
  let selectedUserIds = getSelectedUserIds();
  let task = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    user_ids: selectedUserIds,
    date: document.getElementById("date").value,
    priority: getSelectedPrio(),
    category: selectedCategory,
    subtasks: subtaskList,
    status: "toDo"
  };
  console.log(task);
  taskAddedToBoard();
  setTimeout(async function () {
    resetUserDisplay();
    await postData("tasks", task , true);
    location.href = "board.html";
    clearAllTasks(event);
  }, 3000);
}

/**
 * Clears all tasks by preventing the default behavior of the button, resetting form fields,
 * clearing checkboxes, showing user emblems, clearing date and priority, clearing selected category,
 * clearing subtasks, clearing subtask input, and resetting user display.
 * @param {Event} event - The event object triggered by the button click.
 * @return {void} This function does not return anything.
 */
function clearAllTasks(event) {
  event.preventDefault();
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  clearAllCheckbox();
  showUsersEmblem();
  clearDateAndPriority();
  clearSelectedCategory();
  clearSubtasks();
  removeSubtask();
  clearSubtaskInput();
  resetUserDisplay();
}

/**
 * Resets the category error message by clearing the border style, hiding the error message,
 * resetting the color, and emptying the inner HTML of the category error message element.
 * @return {void} This function does not return anything.
 */
function resetCategoryErrorMessage() {
  let spanContactContainer = document.getElementById(
    "selectedCategoryContainer"
  );
  let categoryErrorMessage = document.getElementById("categoryErrorMessage");
  spanContactContainer.style.border = "";
  categoryErrorMessage.style.display = "none";
  categoryErrorMessage.style.color = "";
  categoryErrorMessage.innerHTML = "";
}

/**
 * Displays a task added to the board by showing the taskAddedToBoard element
 * and adding the 'move-top' class to the taskAddedToBoardStyle element. After
 * 3 seconds, the taskAddedToBoard element is hidden.
 * @return {void} This function does not return a value.
 */
function taskAddedToBoard() {
  let boardAddedToTask = document.getElementById("taskAddedToBoard");
  let boardAddedToTaskContainer = document.getElementById(
    "taskAddedToBoardStyle"
  );
  boardAddedToTask.style.display = "flex";
  boardAddedToTaskContainer.classList.add("move-top");
  setTimeout(function () {
    document.getElementById("taskAddedToBoard").style.display = "none";
  }, 3000);
}
