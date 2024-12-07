/**
 * Searches for tasks based on a search query and updates the HTML accordingly.
 * @return {void} This function does not return a value.
 */
function searchTasks() {
  let searchQuery = getSearchQuery();
  if (isSearchQueryTooShort(searchQuery)) {
    updateHTML();
    return;
  }
  let filteredTasks = filterTasks(searchQuery);
  clearTaskContainers();
  renderFilteredTasks(filteredTasks);
}

/**
 * Retrieves the search query input value from the 'search' element and converts it to lowercase.
 * @return {string} The lowercase search query input value.
 */
function getSearchQuery() {
  return document.getElementById('search').value.toLowerCase();
}

/**
 * Checks if the search query is too short.
 * @param {string} searchQuery - The search query to be checked.
 * @return {boolean} Returns true if the search query is shorter than 2 characters, false otherwise.
 */
function isSearchQueryTooShort(searchQuery) {
  return searchQuery.length < 2; // angepasst auf 3 Zeichen
}

/**
 * Filters tasks based on the search query by checking if the task title or description includes the search query.
 * @param {string} searchQuery - The search query to filter tasks by.
 * @return {Array} An array of tasks that match the search query criteria.
 */
function filterTasks(searchQuery) {
  return tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(searchQuery) ||
      task.description.toLowerCase().includes(searchQuery)
    );
  });
}

/**
 * Clears the content of the task containers by setting their innerHTML to an empty string.
 * @return {void} This function does not return a value.
 */
function clearTaskContainers() {
  document.getElementById('toDo').innerHTML = '';
  document.getElementById('inProgress').innerHTML = '';
  document.getElementById('awaitFeedback').innerHTML = '';
  document.getElementById('done').innerHTML = '';
}

/**
 * Renders the filtered tasks onto the HTML page.
 * @param {Array} filteredTasks - The array of tasks to render.
 * @return {void} This function does not return a value.
 */
function renderFilteredTasks(filteredTasks) {
  filteredTasks.forEach((task) => {
    let elementId = getElementIdByStatus(task.status);
    document.getElementById(elementId).innerHTML += renderSmallCardHTML(task);
    showSmallUsersEmblem(task);
    renderSmallSubtasks(task);
    renderProgressBar(task.cardId, tasks);
  });
}
