/**
 * Initializes the summary by including HTML, fetching tasks, counting task statuses,
 * displaying a greeting, displaying a user, and handling mobile greeting.
 * @return {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initSummary() {
  await includeHTML();
  await tasksArray();
  countsTaskStatus();
  displayGreeting();
  displayUser();
  mobileGreeting();
}

/**
 * Returns a greeting based on the current time and whether the user is a guest or not.
 * @param {boolean} isGuest - Whether the user is a guest or not.
 * @return {string} The greeting message.
 */
function getGreeting(isGuest) {
  let time = new Date().getHours();
  let greeting;
  if (time < 12) {
    greeting = 'Good Morning';
  } else if (time < 18) {
    greeting = 'Good Day';
  } else {
    greeting = 'Good Evening';
  }
  greeting += isGuest ? '!' : ',';
  return greeting;
}

/**
 * Displays a greeting message based on the current time and whether the user is a guest or not.
 * @return {Promise<void>} A promise that resolves when the greeting message has been displayed.
 */
async function displayGreeting() {
  let currentUser = await getUserLogin();
  let isGuest = currentUser.userId == 0;
  document.getElementById('greetText').innerHTML = getGreeting(isGuest);
}
async function displayGreeting() {
  let currentUser = await getUserLogin();
  let isGuest = currentUser.userId == 0;
  document.getElementById('greetText').innerHTML = getGreeting(isGuest);
}

/**
 * Asynchronously displays the current user's name in the HTML element with the id 'greetUserName'.
 * If the user is a guest (userId == 0), the element's innerHTML is set to an empty string.
 * @return {Promise<void>} A Promise that resolves when the user's name has been displayed.
 */
async function displayUser() {
  let currentUser = await getUserLogin();
  let currentUserName = document.getElementById('greetUserName');
  if (currentUser.userId == 0) {
    currentUserName.innerHTML = ' ';
  } else {
    currentUserName.innerHTML = currentUser.name;
  }
}

let todo = 0;
let inProgress = 0;
let awaitFeedback = 0;
let done = 0;
let urgent = 0;
let dateUrgent = '2100-01-01';

/**
 * Loops through tasks array, counts task status and priority, and updates corresponding counters.
 */
function countsTaskStatus() {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status == 'toDo') {
      todo += 1;
    } else if (tasks[i].status == 'inProgress') {
      inProgress += 1;
    } else if (tasks[i].status == 'awaitFeedback') {
      awaitFeedback += 1;
    } else {
      done += 1;
    }
    if (tasks[i].priority == 'urgent') {
      urgent += 1;
      if (tasks[i].date < dateUrgent) {
        dateUrgent = tasks[i].date;
      }
    }
  }
  rendernCountTasks();
}

/**
 * Updates the count of tasks in the DOM based on the current values of the `todo`, `done`, `inProgress`, `awaitFeedback`, `tasks.length`, and `urgent` variables.
 */
function rendernCountTasks() {
  document.getElementById('toDoCount').innerHTML = todo;
  document.getElementById('doneCount').innerHTML = done;
  document.getElementById('inProgressCount').innerHTML = inProgress;
  document.getElementById('awaitFeedbackCount').innerHTML = awaitFeedback;
  document.getElementById('allTasksCount').innerHTML = tasks.length;
  document.getElementById('urgentCount').innerHTML = urgent;
  if (urgent == 0) {
    document.getElementById('nextUrgentDate').innerHTML = '';
  } else {
    document.getElementById('nextUrgentDate').innerHTML =
      convertDate(dateUrgent);
  }
}

/**
 * Converts a given date string into a formatted date string.
 * @param {string} dateUrgent - The date string to be converted.
 * @return {string} The formatted date string.
 */
function convertDate(dateUrgent) {
  let date = new Date(dateUrgent);
  let options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Displays a greeting message on mobile devices and then shows the summary card.
 * The greeting message is displayed for 4 seconds before the summary card is shown.
 * The visibility of the greeting and summary cards is adjusted based on the window width.
 * @return {void} This function does not return anything.
 */
function mobileGreeting() {
  let summaryContainer = document.getElementById('summaryCardContainer');
  let greetingContainer = document.getElementById('greetingContainer');
  let greetingTimeout;

  /**
   * Executes a series of actions to show a greeting message followed by displaying the summary card.
   */
  function showGreetingThenSummary() {
    clearTimeout(greetingTimeout);
    summaryContainer.style.display = 'none';
    greetingContainer.style.display = 'flex';
    greetingContainer.classList.remove('fadeOut');
    greetingContainer.classList.add('fadeIn');

    greetingTimeout = setTimeout(function () {
      greetingContainer.classList.remove('fadeIn');
      summaryContainer.style.display = 'flex';
      greetingContainer.style.display = 'none';
    }, 4000);
  }

  /**
   * Adjusts the visibility of the greeting and summary containers based on the window width.
   * If the window width is less than 800 pixels, the function calls the `showGreetingThenSummary` function.
   * Otherwise, it clears the `greetingTimeout`, sets the display style of the greeting and summary containers to 'flex',
   * and removes the 'fadeOut' and 'fadeIn' classes from the greeting and summary containers.
   * @return {void} This function does not return anything.
   */
  function adjustVisibility() {
    if (window.innerWidth < 800) {
      showGreetingThenSummary();
    } else {
      clearTimeout(greetingTimeout);
      greetingContainer.style.display = 'flex';
      summaryContainer.style.display = 'flex';
      greetingContainer.classList.remove('fadeOut', 'fadeIn');
      summaryContainer.classList.remove('fadeOut', 'fadeIn');
    }
  }
  adjustVisibility();
  window.addEventListener('resize', adjustVisibility);
}

window.addEventListener('load', initSummary);
