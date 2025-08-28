/**
 * Closes the add task board by animating it and adding the 'dnone' class to hide it.
 */
function closeAddTaskBoard() {
  closeBoardAddTaskAnimation();
  setTimeout(() => {
    document.getElementById('boardAddTask').classList.add('dnone');
  }, 250);
}

/**
 * Clears the title and description input fields.
 */
function clearTitleAndDescription() {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
}

/**
 * Clears the value of the 'date' input field and sets the priority to 'medium'.
 */
function clearDateAndPriority() {
  document.getElementById('date').value = '';
  togglePriority('medium');
}

/**
 * Clears the selected category by setting the innerHTML of the element with
 * the id 'selectedCategory' to 'Select task category'.
 */
function clearSelectedCategory() {
  document.getElementById('selectedCategory').innerHTML =
    'Select task category';
}

/**
 * Clears the subtask list by resetting the subtaskList array and the value of the 'subtaskInput' element.
 * Then, it calls the 'renderSubtask' function to update the UI.
 */
function clearSubtasks() {
  subtaskList = [];
  document.getElementById('subtaskInput').value = '';
  renderSubtask();
}

/**
 * Clears the input field for subtasks by resetting its value, placeholder, read-only status, and text color.
 * Also resets the border style of the subtask container element.
 */
function clearSubtaskInput() {
  let subtaskInput = document.getElementById('subtaskInput');
  subtaskInput.value = '';
  subtaskInput.placeholder = 'Add new Subtask';
  subtaskInput.readOnly = false;
  subtaskInput.style.color = 'black';
  document.getElementById('subtaskContainer').style.border =
    '1px solid #d1d1d1';
}

/**
 * Resets the display for the user section by hiding it and updating the arrow icons.
 */
function resetUserDisplay() {
  let users = document.getElementById('users');
  users.classList.remove('show');
  document.getElementById('arrowDownUser').style.display = 'block';
  document.getElementById('arrowUpUser').style.display = 'none';
}

/**
 * Clears all checkboxes on the page by setting their 'checked' property to false.
 */
function clearAllCheckbox() {
  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
}
