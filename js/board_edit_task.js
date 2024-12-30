/**
 * Edits a task on the board by finding the task with the given cardId, creating an object with the task's information,
 * adding the object to the boardEdit array, logging the boardEdit array, setting the innerHTML of the element with the
 * id 'showBigCard' to the result of the boardAddTaskEdit function with the cardId parameter, and calling the renderInformation
 * function with the cardId parameter.
 * @param {string} cardId - The id of the card associated with the task to be edited.
 * @return {void} This function does not return anything.
 */
function editTaskOfBoard(cardId) {
  let task = tasks.find((t) => t.cardId == cardId);
  let information = {
    cardId: cardId,
    category: task.category,
    date: task.date,
    user: task.user,
    description: task.description,
    priority: task.priority,
    status: task.status,
    title: task.title,
    subtasks: task.subtasks,
  };
  boardEdit.push(information);
  document.getElementById('showBigCard').innerHTML = boardAddTaskEdit(cardId);
  renderInformation(cardId);
}

/**
 * Closes the edit board by hiding the 'showBigCard' element and resetting the boardEdit array.
 * @return {void} This function does not return anything.
 */
function closeEditBoard() {
  document.getElementById('showBigCard').classList.add('dnone');
  boardEdit = [];
}

/**
 * Renders information of a task based on the cardId.
 * @param {number} cardId - The unique identifier of the task.
 * @return {void} This function does not return anything.
 */
function renderInformation(cardId) {
  let task = tasks.find((t) => t.cardId == cardId);
  document.getElementById('editTitle').value = task.title;
  document.getElementById('editDescription').value = task.description;
  document.getElementById('editDate').value = task.date;
  editTogglePriority(task.priority);
  renderEditUsers();
  restrictEditPastDate();
  showPickedUsersEmblems(cardId);
  renderEditSubtask(task.subtasks);
}

/**
 * Toggles the visibility of the 'editUsers' element and updates the arrow icons accordingly.
 * @return {void} This function does not return a value.
 */
function showEditUsers() {
  event.stopPropagation();
  if (document.getElementById('editUsers').classList.contains('show')) {
    document.getElementById('editUsers').classList.remove('show');
    document.getElementById('arrowDownUser').style.display = 'block';
    document.getElementById('arrowUpUser').style.display = 'none';
  } else {
    document.getElementById('editUsers').classList.add('show');
    document.getElementById('arrowDownUser').style.display = 'none';
    document.getElementById('arrowUpUser').style.display = 'block';
  }
}

/**
 * Adds a new subtask to the boardEdit object if the input is not empty and there are less than 5 subtasks already.
 * If the input is empty, it sets the placeholder of the input field to 'Bitte etwas eingeben!'.
 * If there are already 5 subtasks, it sets the placeholder of the input field to 'Add new Subtask'.
 * It then creates a new subtask object with the input value and sets the checked property to false.
 * The new subtask is then added to the boardEdit object's subtask array.
 * The input field is cleared and the editSubtaskInput element is re-rendered with the new subtask.
 * The editRemoveSubtask function is called to reset the input field and update the visibility of the subtask buttons.
 * @return {void} This function does not return anything.
 */
function editAddSubtask() {
  let input = document.getElementById('editSubtaskInput').value;
  if (input == '') {
    document.getElementById('editSubtaskInput').placeholder =
      'Bitte etwas eingeben!';
    return;
  }
  if (!boardEdit[0].subtasks) {
    return;
  }
  if (boardEdit[0].subtasks.length < 5) {
    document.getElementById('editSubtaskInput').placeholder = 'Add new Subtask';
    let newSubtask = { subtasktext: input, checked: false };
    boardEdit[0].subtasks.push(newSubtask);
    document.getElementById('editSubtaskInput').value = '';
    renderEditSubtask(boardEdit[0].subtasks);
    editRemoveSubtask();
  }
}

/**
 * Renders the subtasks in the 'editSubtask' element on the page.
 * @param {Array} subtasks - An array of subtask objects.
 * @return {void} This function does not return anything.
 */
function renderEditSubtask(subtasks) {
  let editSubtask = document.getElementById('editSubtask');
  editSubtask.innerHTML = '';
  if (!subtasks) {
    return;
  }
  for (let i = 0; i < Math.min(subtasks.length, 5); i++) {
    editSubtask.innerHTML += renderEditSubtaskHTML(subtasks[i].subtasktext, i);
  }
}

/**
 * Resets the style and color of the given elements, and restores the original color of their SVG paths if they have one.
 * @param {Array<HTMLElement>} elements - The elements to reset.
 * @return {void} This function does not return anything.
 */
function resetEditElements(elements) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].classList.remove('edit-selected');
    elements[i].style.backgroundColor = 'white';
    elements[i].style.color = 'black';
    let svgPaths = elements[i].querySelectorAll('svg path');
    if (svgPaths) {
      for (let j = 0; j < svgPaths.length; j++) {
        if (elements[i].getAttribute('onclick').includes('medium')) {
          svgPaths[j].style.fill = '#FFA800';
        } else {
          svgPaths[j].style.fill = svgPaths[j].getAttribute('originalColor');
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
function setEditPriorityStyles(
  selectedElement,
  backgroundColor,
  textColor,
  svgColor
) {
  if (selectedElement) {
    selectedElement.classList.add('edit-selected');
    selectedElement.style.backgroundColor = backgroundColor;
    selectedElement.style.color = textColor;
    let svgPaths = selectedElement.querySelectorAll('svg path');
    if (svgPaths) {
      for (let j = 0; j < svgPaths.length; j++) {
        svgPaths[j].style.fill = svgColor;
      }
    }
  }
}

/**
 * Toggles the priority of elements based on the provided priority.
 * @param {string} priority - The priority to toggle. Must be one of 'urgent', 'medium', or 'low'.
 * @return {void} This function does not return a value.
 */
function editTogglePriority(priority) {
  let elements = document.getElementsByClassName('edit-priobtn');
  resetEditElements(elements);
  let selectedElement = document.getElementById('edit' + priority + 'Prio');
  if (priority === 'urgent') {
    setEditPriorityStyles(selectedElement, '#FF3D00', 'white', 'white');
  } else if (priority === 'medium') {
    setEditPriorityStyles(selectedElement, '#FFA800', 'white', 'white');
  } else if (priority === 'low') {
    setEditPriorityStyles(selectedElement, '#7AE229', 'white', 'white');
  }
}

/**
 * Initializes the original color attribute for SVG paths within elements with the 'edit-priobtn' class on window load.
 */
window.onload = function () {
  let elements = document.getElementsByClassName('edit-priobtn');
  for (let i = 0; i < elements.length; i++) {
    let svgPaths = elements[i].querySelectorAll('svg path');
    if (svgPaths) {
      for (let j = 0; j < svgPaths.length; j++) {
        svgPaths[j].setAttribute('originalColor', svgPaths[j].style.fill);
      }
    }
  }
};

/**
 * Retrieves the selected priority from the edit buttons.
 * @return {string} The selected priority ('urgent', 'low', or 'medium').
 */
function getEditSelectedPrio() {
  let urgentBtn = document.getElementById('editurgentPrio');
  let lowprioBtn = document.getElementById('editlowPrio');
  if (urgentBtn.classList.contains('edit-selected')) {
    return 'urgent';
  } else if (lowprioBtn.classList.contains('edit-selected')) {
    return 'low';
  } else {
    return 'medium';
  }
}

/**
 * Restricts the date input field to allow only future dates for the edit date input field.
 * @return {void} This function does not return a value.
 */
function restrictEditPastDate() {
  let dateInput = document.getElementById('editDate');
  let today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

/**
 * Renders the edit users by appending their HTML representation to the 'editUsers' element.
 * @return {void} This function does not return a value.
 */
function renderEditUsers() {
  let content = document.getElementById('editUsers');
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if(user.id ==1) continue;
    content.innerHTML += renderEditUsersHTML(user, i);
  }
}

let hiddenUserIds = new Set();
/**
 * Displays the user emblems for the given card ID in the 'editUsersEmblem' element.
 * Only renders up to 5 emblems, with any additional emblems displayed as grey.
 * Hides any user emblems that are not present in the 'task.userId' array.
 * @param {string} cardId - The ID of the card to display emblems for.
 * @return {void} This function does not return a value.
 */
function showPickedUsersEmblems(cardId) {
  let editUsersEmblem = document.getElementById('editUsersEmblem');
  editUsersEmblem.innerHTML = '';
  let renderedCount = 0;
  let extraCount = 0;
  const task = tasks.find((t) => t.cardId == cardId);
  if (task && task.cardId) {
    for (let user of task.user) {
      if (user && user.checked && renderedCount < 5) {
        editUsersEmblem.innerHTML += renderEditEmblemUsers(user.user);
        renderedCount++;
      } else {
        extraCount++;
      }
    }
    hiddenUserIds.clear();
    if (extraCount > 0) {
      let hiddenUsers = task.user.slice(5);
      for (let userId of hiddenUsers) {
        hiddenUserIds.add(userId);
      }
      editUsersEmblem.innerHTML += renderGreyEmblem(extraCount);
    }
  }
  checkUserCheckboxesBasedOnEmblems();
  updateContactListSelection();
}

/**
 * Renders the emblem for each user in the 'editUsersEmblem' element based on the checked state of their checkbox.
 * If the number of rendered emblems exceeds 5, additional emblems are rendered as grey.
 * @return {void} This function does not return a value.
 */
function showEditUsersEmblem() {
  let usersEmblem = document.getElementById('editUsersEmblem');
  usersEmblem.innerHTML = '';
  let renderedCount = 0;
  let extraCount = 0;
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    if(user.id ==1) continue;
    let userListChecked = document.getElementById('edit-contactlist' + i);
    let checkedUser = document.getElementById(`editCheckbox${i}`);
    if (checkedUser.checked == true) {
      userListChecked.classList.add('edit-contactlist-selected');
      if (renderedCount < 5) {
        usersEmblem.innerHTML += renderEditEmblemUsers(user);
        renderedCount++;
      } else {
        extraCount++;
      }
    } else {
      userListChecked.classList.remove('edit-contactlist-selected');
    }
  }
  if (extraCount > 0) {
    usersEmblem.innerHTML += renderGreyEmblem(extraCount);
  }
  updateContactListSelection();
}

/**
 * Updates the state of user checkboxes based on the rendered emblems.
 * @return {void} This function does not return a value.
 */
function checkUserCheckboxesBasedOnEmblems() {
  let renderedEmblems = document.querySelectorAll(
    '#editUsersEmblem .edit-emblem'
  );
  let renderedUserIds = new Set();
  for (let emblem of renderedEmblems) {
    renderedUserIds.add(emblem.id);
  }
  let userCheckboxes = document.querySelectorAll('.edit-user-checkbox');
  for (let checkbox of userCheckboxes) {
    let userId = checkbox.dataset.userid;
    checkbox.checked = renderedUserIds.has(userId) || hiddenUserIds.has(userId);
  }
}

/**
 * Updates the 'edit-contactlist-selected' class for each contact based on their checked state.
 * @return {void} This function does not return a value.
 */
function updateContactListSelection() {
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    if(user.id ==1) continue;
    let userListChecked = document.getElementById('edit-contactlist' + i);
    let checkedUser = document.getElementById(`editCheckbox${i}`);
    if (checkedUser.checked) {
      userListChecked.classList.add('edit-contactlist-selected');
    } else {
      userListChecked.classList.remove('edit-contactlist-selected');
    }
  }
}

/**
 * Retrieves the IDs of all selected checkboxes in the contact list.
 * @return {Array<string>} An array of selected user IDs.
 */
function getEditSelectedUserIds() {
  let checkboxes = document.querySelectorAll(
    '.edit-contactlist input[type="checkbox"]:checked'
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
 * Edits a task by updating its properties and saving the changes.
 * @param {number} cardId - The ID of the card associated with the task.
 * @param {Event} event - The event object that triggered the function.
 * @return {Promise<void>} A promise that resolves when the task is successfully edited and the UI is updated.
 */
async function editTask(cardId, event) {
  event.preventDefault();
  let selectedUserIds = getEditSelectedUserIds();
  let updatedTask = {
    title: document.getElementById('editTitle').value,
    description: document.getElementById('editDescription').value,
    user_ids: selectedUserIds,
    date: document.getElementById('editDate').value,
    priority: getEditSelectedPrio(),
    category: boardEdit[0].category,
    subtasks: boardEdit[0].subtasks,
    status: boardEdit[0].status,
    cardId: cardId,
  };
  resetEditUserDisplay();
  await updateEditBoard(cardId, updatedTask);
  await updateHTML();
  closeEditBoard();
  showBigCard(cardId);
}

/**
 * Updates the task board with the updated task information.
 * @param {number} cardId - The ID of the card associated with the task.
 * @param {Object} updatedTask - The updated task object containing the new task information.
 * @return {Promise<void>} A promise that resolves when the task board is successfully updated.
 */
async function updateEditBoard(cardId, updatedTask) {
  let tasksJSON = await loadData('tasks');
  for (let key in tasksJSON) {
    let task = tasksJSON[key];
    if (task.cardId == cardId) {
      await putData(`tasks/${task.cardId}`, updatedTask);
    }
  }
}

/**
 * Resets the display for the user section by hiding it and updating the arrow icons.
 * @return {void} This function does not return a value.
 */
function resetEditUserDisplay() {
  let users = document.getElementById('editUsers');
  users.classList.remove('show');
  document.getElementById('arrowDownUser').style.display = 'block';
  document.getElementById('arrowUpUser').style.display = 'none';
}