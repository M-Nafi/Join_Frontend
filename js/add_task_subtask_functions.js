/**
 * Changes the visibility and styling of the subtask buttons and input field based on the length of the subtaskList array.
 * @return {void} This function does not return a value.
 */
function changeButtonsSubtask() {
  if (subtaskList.length < 5) {
    document.getElementById('subtask-right-regular').classList.add('dnone');
    document.getElementById('subtask-right-add').classList.remove('dnone');
  } else {
    document.getElementById('subtaskInput').style =
      'color:red; font-weight:bold;';
    document.getElementById('subtaskInput').readOnly = true;
    document.getElementById('subtaskInput').value = 'Maximal 5 Subtasks!';
    document.getElementById('subtaskContainer').style.border = '1px solid red';
  }
}

/**
 * Removes a subtask by clearing the input value and toggling visibility of subtask buttons.
 * @return {void} This function does not return a value.
 */
function removeSubtask() {
  subtask = document.getElementById('subtaskInput');
  subtask.value = '';
  document.getElementById('subtask-right-regular').classList.remove('dnone');
  document.getElementById('subtask-right-add').classList.add('dnone');
}

/**
 * Removes icons by toggling visibility of subtask buttons.
 * @return {void} This function does not return a value.
 */
function removeIcons() {
  document.getElementById('subtask-right-regular').classList.remove('dnone');
  document.getElementById('subtask-right-add').classList.add('dnone');
}

/**
 * Adds a new subtask to the list if there are fewer than 5 subtasks already.
 * If there are already 5 subtasks, displays an error message.
 * @return {void} This function does not return a value.
 */
function addSubtask() {
  let input = document.getElementById('subtaskInput').value;
  if (input == '') {
    document.getElementById('subtaskInput').placeholder =
      'Bitte etwas eingeben!';
    return;
  }
  if (subtaskList.length < 5) {
    document.getElementById('subtaskInput').placeholder = 'Add new Subtask';
    let newTask = { subtasktext: input, checked: false };
    subtaskList.push(newTask);
    renderSubtask();
    document.getElementById('subtaskInput').value = '';
    removeSubtask();
  }
}

/**
 * Deletes a subtask from the subtaskList array and updates the UI accordingly.
 * @param {number} i - The index of the subtask to be deleted.
 * @return {void} This function does not return a value.
 */
function deleteSubtask(i) {
  subtaskList.splice(i, 1);
  renderSubtask();
  document.getElementById('subtaskInput').value = '';
  document.getElementById('subtaskInput').readOnly = false;
  document.getElementById('subtaskInput').style = 'color:black;';
  document.getElementById('subtaskContainer').style.border =
    '1px solid #d1d1d1';
}

/**
 * Edits the subtask at the specified index.
 * @param {number} i - The index of the subtask to edit.
 * @return {void} This function does not return anything.
 */
function editSubtask(i) {
  document.getElementById(`subtaskList${i}`).readOnly = false;
  edit = document.getElementById(`edit-images${i}`);
  edit.innerHTML = editSubtaskHTML(i);
  document
    .getElementById(`mainSubtask-container${i}`)
    .classList.remove('subtask-list');
  document
    .getElementById(`mainSubtask-container${i}`)
    .classList.add('edit-subtask-list');
  document.getElementById(`edit-images${i}`).classList.add('flex');
}

/**
 * Updates the subtask text in the subtaskList array and triggers the rendering of subtasks.
 * @param {number} i - The index of the subtask to update.
 * @return {void} This function does not return a value.
 */
function checkSubtask(i) {
  subtaskList[i].subtasktext = document.getElementById(`subtaskList${i}`).value;
  renderSubtask();
}
