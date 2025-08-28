/**
 * Updates the progress bar display and subtasks count display for a given card ID and subtasks.
 */
function updateProgressBarDisplay(cardId, subtasks) {
    if (subtasks != null && subtasks.length > 0) {
        let checkedSubtasks = countCheckedSubtasks(subtasks);
        let percent = calculateProgress(checkedSubtasks, subtasks.length);
        updateProgressBar(cardId, percent);
        updateSubtasksCountDisplay(cardId, checkedSubtasks, subtasks.length);
    } else {
        let colorProgressBar = document.getElementById(
            `subtaskProgressBar${cardId}`
        );
        colorProgressBar.style.display = 'none';
    }
}

/**
 * Counts the number of checked subtasks in an array of subtasks.
 */
function countCheckedSubtasks(subtasks) {
    let checkedSubtasks = 0;
    for (let i = 0; i < subtasks.length; i++) {
        if (subtasks[i].checked === true) {
            checkedSubtasks += 1;
        }
    }
    return checkedSubtasks;
}

/**
 * Calculates the progress of a task based on the number of checked subtasks and the total number of subtasks.
 */
function calculateProgress(checkedSubtasks, totalSubtasks) {
    if (totalSubtasks === 0) return 0;
    let percent = checkedSubtasks / totalSubtasks;
    return Math.round(percent * 100).toFixed(0);
}

/**
 * Updates the progress bar with the given card ID and percentage.
 */
function updateProgressBar(cardId, percent) {
    let colorProgressBar = document.getElementById(
        `subtaskProgressBar${cardId}`
    );
    colorProgressBar.value = percent;
}

/**
 * Updates the subtasks count display for a specific card with the number of checked subtasks and total subtasks.
 */
function updateSubtasksCountDisplay(cardId, checkedSubtasks, totalSubtasks) {
    let subtasksCount = document.getElementById(`subtasksCount${cardId}`);
    subtasksCount.innerHTML = `${checkedSubtasks}/${totalSubtasks} Subtasks`;
}
