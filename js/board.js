/**
 * Initializes the board by including HTML, fetching user and task data, and updating the HTML.
 */
async function initBoard() {
    includeHTML();
    await usersArray();
    await tasksArray();
    await updateHTML();
}

let boardEdit = [];
let status = ['toDo', 'in Progress', 'awaitFeedback', 'done'];
let currentDraggedElement;

/**
 * Updates the HTML by calling functions to update tasks by status.
 */
async function updateHTML() {
    await tasksArray();
    updateTasksByStatus('toDo', 'toDo');
    updateTasksByStatus('inProgress', 'inProgress');
    updateTasksByStatus('awaitFeedback', 'awaitFeedback');
    updateTasksByStatus('done', 'done');
}

/**
 * Updates tasks on the board based on their status.
 */
function updateTasksByStatus(status, elementId) {
    let filteredTasks = tasks.filter((task) => task.status == status);
    let boardCard = document.getElementById(elementId);
    boardCard.innerHTML = '';
    if (filteredTasks.length == 0) {
        boardCard.innerHTML = renderEmptyBoard(status);
        return;
    } else
        for (let i = 0; i < filteredTasks.length; i++) {
            boardCard.innerHTML += renderSmallCardHTML(filteredTasks[i], i);
            showSmallUsersEmblem(filteredTasks[i]);
            renderProgressBar(filteredTasks[i].cardId, tasks);
        }
}

/**
 * Returns the background color category based on the given task's category.
 */
function getBackgroundCategory(task) {
    switch (task.category) {
        case 'User Story':
            return '#0038FF';
        case 'Technical Task':
            return '#1FD7C1';
        case 'Development':
            return '#FFBB2B';
        case 'Editing':
            return '#FF5EB3';
    }
}

/**
 * Displays the small users emblem on the task card.
 */
function showSmallUsersEmblem(task) {
    let smallUsersEmblem = document.getElementById(
        `smallUsersEmblem${task.cardId}`
    );
    smallUsersEmblem.innerHTML = '';

    let { renderedCount, extraCount } = renderUserEmblems(
        task,
        smallUsersEmblem
    );

    if (extraCount > 0) {
        smallUsersEmblem.innerHTML += renderGreyEmblem(extraCount);
    }
}

/**
 * Renders user emblems in a container based on the provided task.
 */
function renderUserEmblems(task, container) {
    let renderedCount = 0;
    let extraCount = 0;

    if (task.user && task.user.length > 0) {
        for (let user of task.user) {
            if (renderedCount < 5) {
                container.innerHTML += renderSmallUsersEmblem(user.user);
                renderedCount++;
            } else {
                extraCount++;
            }
        }
    }
    return { renderedCount, extraCount };
}

/**
 * Renders small subtasks HTML elements for a given task.
 */
function renderSmallSubtasks(task) {
    let smallSubtask = document.getElementById(
        `subtaskProgressBar${task.cardId}`
    );
    if (task.subtask && task.subtask.length > 0) {
        for (let j = 0; j < task.subtask.length; j++) {
            let subtask = task.subtask[j];
            smallSubtask.innerHTML += `<div>${subtask}</div> `;
        }
    }
}

/**
 * Sets the `currentDraggedElement` to the provided `cardId` when dragging starts.
 */
function startDragging(cardId) {
    currentDraggedElement = cardId;
}

/**
 * Prevents the default behavior of the event, allowing elements to be dragged and dropped.
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Moves a task to a specified status by updating the task object and calling the updateBoard and updateHTML functions.
 */
async function moveTo(event, status) {
    event.stopPropagation();
    let taskId = currentDraggedElement;
    removeHighlight(status);
    await patchData(`tasks/${taskId}`, { status: status }, true);
    await updateHTML();
}

/**
 * Highlights an element with the specified cardId by adding the 'drag-area-highlight' class to its classList.
 */
function highlight(cardId) {
    document.getElementById(cardId).classList.add('drag-area-highlight');
}

/**
 * Removes the 'drag-area-highlight' class from the element with the specified status.
 */
function removeHighlight(status) {
    document.getElementById(status).classList.remove('drag-area-highlight');
}

/**
 * Returns the element ID corresponding to the given status.
 */
function getElementIdByStatus(status) {
    switch (status) {
        case 'toDo':
            return 'toDo';
        case 'inProgress':
            return 'inProgress';
        case 'awaitFeedback':
            return 'awaitFeedback';
        case 'done':
            return 'done';
        default:
            return '';
    }
}

/**
 * Asynchronously shows a big card on the page.
 */
async function showBigCard(cardId) {
    document.getElementById('showBigCard').classList.remove('dnone');
    let content = document.getElementById('showBigCard');
    content.innerHTML = '';
    content.innerHTML = renderBigCardHTML(cardId);
    showBigUsersEmblem(cardId);
    renderBigSubtasks(cardId);
    openBigCardAnimation(`bigCard${cardId}`);
}

/**
 * Deletes a task from the board by calling the deleteTask function with the given cardId.
 * Then, it updates the HTML by calling the updateHTML function.
 * Finally, it closes the big card by calling the closeBigCard function.
 */
async function deleteTaskOfBoard(cardId) {
    await deleteTask(cardId);
    await updateHTML();
    closeBigCard();
}

/**
 * Deletes a task associated with a given card ID.
 */
async function deleteTask(cardId) {
    let tasksJSON = await loadData('tasks');
    for (let key in tasksJSON) {
        let task = tasksJSON[key];
        if (task.cardId == cardId) {
            await deleteData(`tasks/${task.cardId}`, true);
        }
    }
}

/**
 * Updates the status of a subtask and refreshes the HTML display.
 */
async function checkedSubtask(cardId, isubtask) {
    let value = document.getElementById('checkbox' + isubtask).checked;
    await updateSubtasks(cardId, isubtask, value);
    await updateHTML();
}

/**
 * Updates the status of a subtask in the tasks JSON data and refreshes the HTML display.
 */
async function updateSubtasks(cardId, isubtask, value) {
    let tasksJSON = await loadData('tasks');
    for (let key in tasksJSON) {
        let task = tasksJSON[key];
        if (task.cardId == cardId) {
            let subtaskId = task.subtasks[isubtask].id;
            let patchUrl = `tasks/${task.cardId}/subtasks/${subtaskId}`;
            let response = await patchData(patchUrl, { checked: value }, true);
        }
    }
}

/**
 * Renders a progress bar for a given card ID and tasks.
 */
function renderProgressBar(cardId, tasks) {
    let task = tasks.find((t) => t.cardId == cardId);
    let subtasks = task.subtasks;
    updateProgressBarDisplay(cardId, subtasks);
}

/**
 * A function that handles moving a card to a different status on a mobile device.
 */
async function mobilemoveTo(status, cardId, event) {
    event.stopPropagation();
    currentDraggedElement = cardId;
    moveTo(event, status);
}

/**
 * Opens the mobile options for a specific card.
 */
function openMobileOptions(cardId, status, event) {
    event.stopPropagation();
    let link = document.getElementById('moveTo_' + cardId + '_' + status);
    link.classList.add('disabled');
    document.getElementById('amobile_boardOptions' + cardId).style.display =
        'flex';
}

/**
 * Closes the mobile options for a specific card.
 */
function closeMobilOptions(event, cardId) {
    event.stopPropagation();
    document.getElementById('amobile_boardOptions' + cardId).style.display =
        'none';
}

let mobilWindow = window.matchMedia('(max-width: 770px)');
mobilWindow.addEventListener('change', myFunc);

/**
 * Updates the display style of elements with the class 'mobileBoard' based on the current media query match.
 */
function myFunc() {
    let elements = document.querySelectorAll('.mobileBoard');
    elements.forEach((element) => {
        if (mobilWindow.matches) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

/**
 * Updates the display style of elements with the class 'mobileBoard' based on the current window width.
 */
function mobileDetails() {
    let elements = document.querySelectorAll('.mobileBoard');
    outWidth = window.innerWidth;
    elements.forEach((element) => {
        if (outWidth <= 770) {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}
