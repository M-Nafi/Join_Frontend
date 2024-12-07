/**
 * Changes the visibility of the subtask buttons based on the length of the subtask array.
 * If the length is less than 5, the 'editSubtaskRightRegular' button is hidden and the
 * 'editSubtaskRightAdd' button is shown. Otherwise, the 'editSubtaskInput' field is set to
 * read-only and its style is changed to display an error message. The border of the
 * 'editSubtaskContainer' is also changed to red.
 * @return {void}
 */
function editChangeButtonsSubtask() {
  if (!Array.isArray(boardEdit[0].subtasks)) {
    boardEdit[0].subtasks = [];
  }
  if (boardEdit[0].subtasks.length < 5) {
    document.getElementById('editSubtaskRightRegular').classList.add('dnone');
    document.getElementById('editSubtaskRightAdd').classList.remove('dnone');
  } else {
    document.getElementById('editSubtaskInput').style =
      'color:red; font-weight:bold;';
    document.getElementById('editSubtaskInput').readOnly = true;
    document.getElementById('editSubtaskInput').value = 'Maximal 5 Subtasks!';
    document.getElementById('editSubtaskContainer').style.border =
      '1px solid red';
  }
}

/**
 * Resets the value of the 'editSubtaskInput' element and updates the visibility of the subtask buttons.
 * @return {void} This function does not return anything.
 */
function editRemoveSubtask() {
  subtask = document.getElementById('editSubtaskInput');
  subtask.value = '';
  document.getElementById('editSubtaskRightRegular').classList.remove('dnone');
  document.getElementById('editSubtaskRightAdd').classList.add('dnone');
}

/**
 * Hides the 'editSubtaskRightAdd' button and shows the 'editSubtaskRightRegular' button.
 * @return {void} This function does not return anything.
 */
function editRemoveIcons() {
  document.getElementById('editSubtaskRightRegular').classList.remove('dnone');
  document.getElementById('editSubtaskRightAdd').classList.add('dnone');
}

/**
 * Edits the subtask at the specified index.
 * @param {number} i - The index of the subtask to edit.
 * @return {void} This function does not return anything.
 */
function editThisSubtask(i) {
  document.getElementById(`editSubtaskList${i}`).readOnly = false;
  edit = document.getElementById(`edit-images${i}`);
  edit.innerHTML = editThisSubtaskHTML(i);
  document
    .getElementById(`edit-main-subtask-container${i}`)
    .classList.remove('edit-subtasklist');
  document
    .getElementById(`edit-main-subtask-container${i}`)
    .classList.add('edit-list');
  document.getElementById(`edit-images${i}`).classList.add('flex');
}

/**
 * Deletes a subtask from the boardEdit object's subtask array at the specified index.
 * Renders the edit subtask section with the updated subtask list.
 * Resets the value of the 'editSubtaskInput' element.
 * Sets the 'editSubtaskInput' element to be editable.
 * Sets the color of the 'editSubtaskInput' element to black.
 * Sets the border of the 'editSubtaskContainer' element to '1px solid #d1d1d1'.
 * @param {number} i - The index of the subtask to be deleted.
 * @return {void} This function does not return anything.
 */
function editDeleteSubtask(i) {
  boardEdit[0].subtasks.splice(i, 1);
  renderEditSubtask(boardEdit[0].subtasks);
  document.getElementById('editSubtaskInput').value = '';
  document.getElementById('editSubtaskInput').readOnly = false;
  document.getElementById('editSubtaskInput').style = 'color:black;';
  document.getElementById('editSubtaskContainer').style.border =
    '1px solid #d1d1d1';
}

/**
 * Edits the subtask at the specified index.
 * @param {number} i - The index of the subtask to edit.
 * @return {void} This function does not return anything.
 */
function editCheckSubtask(i) {
  document.getElementById(`editSubtaskList${i}`).readOnly = true;
  boardEdit[0].subtasks[i].subtasktext = document.getElementById(
    `editSubtaskList${i}`
  ).value;
  edit = document.getElementById(`edit-images${i}`);
  edit.innerHTML = checkThisSubtaskHTML(i);
  document
    .getElementById(`edit-main-subtask-container${i}`)
    .classList.add('edit-subtasklist');
  document
    .getElementById(`edit-main-subtask-container${i}`)
    .classList.remove('edit-list');
  document.getElementById(`edit-images${i}`).classList.remove('flex');
}
