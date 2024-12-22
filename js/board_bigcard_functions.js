/**
 * Closes the big card by performing the close animation and adding the 'dnone' class to the 'showBigCard' element.
 * @return {void} This function does not return anything.
 */
function closeBigCard() {
  closeBigCardAnimation(`bigCard`);
  document.getElementById('showBigCard').classList.add('dnone');
}

/**
 * Asynchronously displays the user emblems for the given card ID in the 'bigUsersEmblem' element.
 * @param {string} cardId - The ID of the card to display emblems for.
 * @return {Promise<void>} A promise that resolves when the function completes.
 */
async function showBigUsersEmblem(cardId) {
  let bigUsersEmblem = document.getElementById('bigUsersEmblem');
  bigUsersEmblem.innerHTML = '';

  const task = tasks.find((t) => t.cardId === cardId);
  if (task) {
    if (task.user && task.user.length > 0) {
      for (let i = 0; i < task.user.length; i++) {
        user = task.user[i].user;
          bigUsersEmblem.innerHTML += renderBigEmblemUsers(user);
      }
    }
  }
}

/**
 * Renders the big subtasks for a given card ID.
 * @param {string} cardId - The ID of the card.
 * @return {Promise<void>} - A promise that resolves when the big subtasks have been rendered.
 */
async function renderBigSubtasks(cardId) {
  let bigSubtask = document.getElementById('bigSubtasks');
  bigSubtask.innerHTML = ''; // Clear existing subtasks
  const task = tasks.find((t) => t.cardId === cardId);
  if (task && task.subtasks) {
    for (let j = 0; j < task.subtasks.length; j++) {
      const subtask = task.subtasks[j];
      bigSubtask.innerHTML += renderBigSubtasksHTML(cardId, subtask, j); // Append each subtask's HTML to the string
    }
  }
}

/**
 * Prevents the default event propagation.
 *
 * @return {void} This function does not return a value.
 */
function dontClose() {
  event.stopPropagation();
}

/**
 * Prevents the default event propagation.
 * @return {void} This function does not return a value.
 */
function dontCloseTask() {
  event.stopPropagation();

  let boardTasks = document.getElementById('boardTasks');
  let arrowDownCategory = document.getElementById('arrowDownCategory');
  let arrowUpCategory = document.getElementById('arrowUpCategory');
  let users = document.getElementById('users');
  let arrowDownUser = document.getElementById('arrowDownUser');
  let arrowUpUser = document.getElementById('arrowUpUser');

  boardTasks.classList.remove('show');
  arrowDownCategory.style.display = 'block';
  arrowUpCategory.style.display = 'none';
  users.classList.remove('show');
  arrowDownUser.style.display = 'block';
  arrowUpUser.style.display = 'none';
}

/**
 * Prevents the default event propagation, hides the 'editUsers' element, and updates the arrow icons.
 *
 * @return {void} This function does not return a value.
 */
function dontCloseEdit() {
  event.stopPropagation();
  let editUser = document.getElementById('editUsers');
  let arrowDownUser = document.getElementById('arrowDownUser');
  let arrowUpUser = document.getElementById('arrowUpUser');
  editUser.classList.remove('show');
  arrowDownUser.style.display = 'block';
  arrowUpUser.style.display = 'none';
}

/**
 * Opens a big card animation based on the provided card ID.
 * @param {string} cardId - The ID of the card to animate.
 */
function openBigCardAnimation(cardId) {
  let bigCard = document.getElementById(cardId);
  if (bigCard) {
    bigCard.classList.add('move-left');
  }
}

/**
 * Closes the big card animation by removing the 'move-left' class from the element with the provided card ID.
 * @param {string} cardId - The ID of the card to close the animation for.
 * @return {void} This function does not return anything.
 */
function closeBigCardAnimation(cardId) {
  let bigCard = document.getElementById(cardId);
  if (bigCard) {
    bigCard.classList.remove('move-left');
  }
}
