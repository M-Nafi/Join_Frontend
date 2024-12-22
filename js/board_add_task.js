let subtaskList = [];

/**
 * Renders the board add task based on the board status.
 * @param {type} boardStatus - The status of the board
 * @return {type} description of return value
 */
function showBoardAddTask(boardStatus) {
  document.getElementById("boardAddTask").classList.remove("dnone");
  let content = document.getElementById("boardAddTask");
  content.innerHTML = "";
  content.innerHTML = renderBoardAddTaskHTML(boardStatus);
  renderUsers();
  renderCategorys();
  restrictPastDate();
}

/**
 * Resets the style and color of the given elements, and restores the original color of their SVG paths if they have one.
 * @param {Array<HTMLElement>} elements - The elements to reset.
 * @return {void} This function does not return anything.
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
 * Toggles the priority of elements based on the provided priority.
 * @param {string} priority - The priority to toggle.
 * @return {void} This function does not return a value.
 */
function togglePriority(priority) {
  let elements = document.getElementsByClassName("prioBtn");
  resetElements(elements);
  let selectedElement = document.getElementById(priority + "Prio");
  if (priority === "urgent") {
    setPriorityStyles(selectedElement, "#FF3D00", "white", "white");
  } else if (priority === "medium") {
    setPriorityStyles(selectedElement, "#FFA800", "white", "white");
  } else if (priority === "low") {
    setPriorityStyles(selectedElement, "#7AE229", "white", "white");
  }
}

/**
 * Sets the original color of the SVG paths in each 'prioBtn' element to their current fill color.
 * @return {void} This function does not return anything.
 */
window.onload = function () {
  let elements = document.getElementsByClassName("prioBtn");
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
 * Renders the list of categorys by appending their HTML representation to the 'boardTasks' element.
 * @return {void} This function does not return a value.
 */
function renderCategorys() {
  let task = document.getElementById("boardTasks");

  for (let i = 0; i < categorys.length; i++) {
    task.innerHTML += renderCategorysHTML(i);
  }
}

/**
 * Toggles the visibility of the category list and the corresponding arrow icons.
 * @return {void} This function does not return a value.
 */
function showCategories() {
  event.stopPropagation();
  resetCategoryErrorMessage();
  if (document.getElementById("boardTasks").classList.contains("show")) {
    document.getElementById("boardTasks").classList.remove("show");
    document.getElementById("arrowDownCategory").style.display = "block";
    document.getElementById("arrowUpCategory").style.display = "none";
  } else {
    document.getElementById("boardTasks").classList.add("show");
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
 * Clears the category error message by emptying the inner HTML of the element.
 * @return {void} This function does not return anything.
 */
function resetCategoryErrorMessage() {
  document.getElementById("categoryErrorMessage").innerHTML = "";
}

/**
 * Restricts the date input field to allow only past dates.
 * @return {void} This function does not return anything.
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
    if(user.id ==1) continue;
    let userListChecked = document.getElementById("contactList" + i);
    let checkedUser = document.getElementById(`checkbox${i}`);
    if (checkedUser.checked == true) {
      userListChecked.classList.add("contactlist-selected");
      if (renderedCount < 5) {
        usersEmblem.innerHTML += renderEmblemUsers(user);
        renderedCount++;
      } else {
        extraCount++;
      }
    } else {
      userListChecked.classList.remove("contactlist-selected");
    }
  }
  if (extraCount > 0) {
    usersEmblem.innerHTML += renderGreyEmblem(extraCount);
  }
}

/**
 * Toggles the visibility of the 'users' element and updates the display style of the 'arrowDownUser' and 'arrowUpUser' elements accordingly.
 * @param {Event} event - The event object that triggered the function.
 * @return {void} This function does not return a value.
 */
function showUsers() {
  event.stopPropagation();
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
 * Determines the selected priority based on the presence of 'selected' class on buttons.
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
    '.contactlist input[type="checkbox"]:checked'
  );
  let selectedUserIds = [];
  for (let checkbox of checkboxes) {
    let userId = +checkbox.getAttribute("data-userid");
    user = users.find((u) => u.id === userId);
    if (user) {
      selectedUserIds.push(user.id);
    } else {
      console.error(`Kontakt mit ID ${userId} nicht gefunden.`);
    }
  }
  return selectedUserIds;
}

/**
 * Creates a new task board with the given board status and event.
 * @param {string} boardStatus - The status of the board.
 * @param {Event} event - The event that triggered the function.
 * @return {Promise<void>} A promise that resolves when the task is created and added to the board.
 */
async function createNewTaskBoard(boardStatus, event) {
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
    status: boardStatus
  };
  console.log(task);
  taskAddedToBoard();
  setTimeout(async function () {
    resetUserDisplay();
    await postData("tasks", task, true);
    clearAllTasks(event);
    closeAddTaskBoard();
    updateHTML();
  }, 3000);
}

/**
 * Resets the error message related to the category selection.
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
 * Clears all tasks by resetting the form fields, clearing checkboxes,
 * showing user emblems, clearing date and priority, clearing selected category,
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
 * Removes the 'dnone' class from the 'taskAddedToBoard' element, making it visible.
 * After 3 seconds, the 'dnone' class is added back to the element, hiding it again.
 * @return {void} This function does not return a value.
 */
function taskAddedToBoard() {
  document.getElementById("taskAddedToBoard").classList.remove("dnone");
  setTimeout(function () {
    document.getElementById("taskAddedToBoard").classList.add("dnone");
  }, 3000);
}

/**
 * Animates the addition of a task by removing the 'move-right' class and adding the 'move-left' class to the 'addTaskMainContainer' element.
 * @return {void} This function does not return a value.
 */
function boardAddTaskAnimation() {
  let addTaskContainer = document.getElementById("addTaskMainContainer");
  addTaskContainer.classList.remove("move-right");
  addTaskContainer.classList.add("move-left");
}

/**
 * Animates the closing of the board add task by adding the 'move-right' class and removing the 'move-left' class from the 'addTaskMainContainer' element.
 * @return {void} This function does not return a value.
 */
function closeBoardAddTaskAnimation() {
  let addTaskContainer = document.getElementById("addTaskMainContainer");
  addTaskContainer.classList.add("move-right");
  addTaskContainer.classList.remove("move-left");
}
