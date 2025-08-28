/**
 * Searches for tasks based on a search query and updates the HTML accordingly.
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
 */
function getSearchQuery() {
    return document.getElementById('search').value.toLowerCase();
}

/**
 * Checks if the search query is too short.
 */
function isSearchQueryTooShort(searchQuery) {
    return searchQuery.length < 2;
}

/**
 * Filters tasks based on the search query by checking if the task title or description includes the search query.
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
 */
function clearTaskContainers() {
    document.getElementById('toDo').innerHTML = '';
    document.getElementById('inProgress').innerHTML = '';
    document.getElementById('awaitFeedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';
}

/**
 * Renders the filtered tasks onto the HTML page.
 */
function renderFilteredTasks(filteredTasks) {
    filteredTasks.forEach((task) => {
        let elementId = getElementIdByStatus(task.status);
        document.getElementById(elementId).innerHTML +=
            renderSmallCardHTML(task);
        showSmallUsersEmblem(task);
        renderSmallSubtasks(task);
        renderProgressBar(task.cardId, tasks);
    });
}
