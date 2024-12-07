let colors = [
  '#FF7A00',
  '#FF5EB3',
  '#6E52FF',
  '#9327FF',
  '#00BEE8',
  '#1FD7C1',
  '#FF745E',
  '#FFA35E',
  '#FC71FF',
  '#FFC701',
  '#0038FF',
  '#C3FF2B',
  '#FFE62B',
  '#FF4646',
  '#FFBB2B',
];

let categorys = ['Technical Task', 'User Story', 'Development', 'Editing'];
let users = [];
let tasks = [];
let contacts = [];
let isTasksArrayLoading = false;

/**
 * Asynchronously loads the tasks array from the 'tasks' data source and updates the global 'tasks' array.
 *
 * @return {Promise<void>} A Promise that resolves when the tasks array is updated.
 */
async function tasksArray() {
  if (isTasksArrayLoading) {
    return;
  }
  isTasksArrayLoading = true;
  try {
    tasks = [];

    let tasksJson = await loadData('tasks');

    for (let key in tasksJson) {
      let task = tasksJson[key];
      tasks.push(task);
    }
  } finally {
    isTasksArrayLoading = false;
  }
}

/**
 * Asynchronously loads contacts data from the server and populates the contacts array.
 */
async function contactsArray() {
  let contactsJson = await loadData('contacts');
  for (key in contactsJson) {
    let contact = contactsJson[key];
    contacts.push(contact);
  }
}

/**
 * Asynchronously loads the users array from the 'users' data source and updates the global 'users' array.
 *
 * @return {Promise<void>} A Promise that resolves when the users array is updated.
 */
async function usersArray() {
  let usersJson = await loadData('users');
  for (let key in usersJson) {
    let user = usersJson[key];
    users.push(user);
  }
}

/**
 * Asynchronously includes HTML content in elements with the attribute 'w3-include-html'.
 *
 * @return {Promise<void>} A Promise that resolves after including the HTML content.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute('w3-include-html');
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
  focusSidebar();
  focusMobileSidebar();
  getuseremblem();
  openSidebarRules();
}

/**
 * Focuses on the sidebar link that corresponds to the current page.
 *
 * @return {undefined} This function does not return a value.
 */
function focusSidebar() {
  let currentPage = window.location.href.split('/').pop();
  let menu = document.getElementById('mysidebar');
  let links = menu.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    let linkHref = links[i].getAttribute('href');
    if (linkHref.replace('./', '') === currentPage.replace('?', '')) {
      links[i].focus();
      links[i].classList.add('active');
      break;
    }
  }
}

/**
 * Focuses on the mobile sidebar link that corresponds to the current page.
 *
 * @return {undefined} This function does not return a value.
 */
function focusMobileSidebar() {
  let currentPage = window.location.href.split('/').pop();
  let mobileMenu = document.getElementById('mobile-menu');
  let mobileLinks = mobileMenu.getElementsByTagName('a');
  for (let i = 0; i < mobileLinks.length; i++) {
    let linkHref = mobileLinks[i].getAttribute('href');
    if (linkHref.replace('./', '') === currentPage.replace('?', '')) {
      mobileLinks[i].focus();
      mobileLinks[i].classList.add('active');
      break;
    }
  }
}

/**
 * Asynchronously retrieves the user object from the 'users' data source based on the user ID stored in the session storage.
 *
 * @return {Promise<Object|null>} A Promise that resolves to the user object if found, or null if not found.
 */
async function getUserLogin() {
  let userID = window.sessionStorage.getItem('userId');
  let usersJson = await loadData('users');
  for (key in usersJson) {
    let user = usersJson[key];
    if (user.userId.toString() == userID) {
      return user;
    }
  }
  return null;
}

/**
 * Asynchronously retrieves the current user's emblem and updates the 'emblemUser' element with it.
 *
 * @return {Promise<void>} A Promise that resolves when the emblem has been updated.
 */
async function getuseremblem() {
  let currentUser = await getUserLogin();
  if (currentUser != null) {
    let emblemUser = document.getElementById('emblemUser');
    emblemUser.innerHTML = currentUser.emblem;
  } else {
    emblemUser.innerHTML = '';
  }
}

/**
 * Asynchronously retrieves the current user's emblem and updates the 'emblemUser' element with it.
 *
 * @return {Promise<void>} A Promise that resolves when the emblem has been updated.
 */
async function getuseremblem() {
  let currentUser = await getUserLogin();
  if (currentUser != null) {
    let emblemUser = document.getElementById('emblemUser');
    emblemUser.innerHTML = currentUser.emblem;
  } else {
    emblemUser.innerHTML = '';
  }
}

/**
 * Logs out the current user by removing the user ID from session storage and redirecting to the index page.
 *
 * @return {void} This function does not return anything.
 */
function userLogOut() {
  window.sessionStorage.removeItem('userId');
  window.location.href = '../index.html';
}

/**
 * Asynchronously opens the sidebar rules for the current user. If the user is not logged in,
 * the sidebar and mobile sidebar are hidden, and the back button is set to redirect to the index page.
 *
 * @return {Promise<void>} A Promise that resolves when the sidebar rules are opened.
 */
async function openSidebarRules() {
  let currentUser = await getUserLogin();
  let sidebarRules = document.getElementById('menu');
  let mobileSidebarRules = document.getElementById('mobile-mysidebar');
  if (currentUser == null) {
    sidebarRules.style.display = 'none';
    mobileSidebarRules.style.display = 'none';
    let arrowBack = document.getElementById('backSummaryRules');
    arrowBack.href = '../index.html';
  }
}
