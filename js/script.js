let categorys = ['Technical Task', 'User Story', 'Development', 'Editing'];
let users = [];
let tasks = [];
let contacts = [];
let isTasksArrayLoading = false;
let profile = {};

/**
 * Asynchronously loads the tasks array from the 'tasks' data source and updates the global 'tasks' array.
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
 */
async function usersArray() {
    let usersJson = await loadData('users');
    for (let key in usersJson) {
        let user = usersJson[key];
        users.push(user);
    }
}

/**
 * Asynchronously loads the currently logged-in user's data from the 'user' data source and updates the global 'profile' object.
 */
async function loggedUser() {
    let userProfile = await loadData('user');
    profile = userProfile;
}

/**
 * Prevents the default event propagation by calling stopPropagation on the global 'event' object.
 * This function is intended to be used as an event handler for elements that should not close when clicked.
 */
function dontClose() {
    event.stopPropagation();
}

/**
 * Asynchronously includes HTML content in elements with the attribute 'w3-include-html'.
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        let element = includeElements[i];
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
 */
function focusSidebar() {
    let currentPage = window.location.href.split('/').pop();
    let menu = document.getElementById('mysidebar');
    let navItems = menu.querySelectorAll('.a-nav');

    for (let navItem of navItems) {
        let link = navItem.querySelector('a');
        let linkHref = link.getAttribute('href').replace('./', '');

        if (linkHref === currentPage.replace('?', '')) {
            navItem.classList.add('active');
        } else {
            navItem.classList.remove('active');
        }
    }
}

/**
 * Focuses on the mobile sidebar link that corresponds to the current page.
 */
function focusMobileSidebar() {
    let currentPage = window.location.href.split('/').pop();
    let mobileMenu = document.getElementById('mobile-menu');
    let mobileLinks = [...mobileMenu.getElementsByTagName('a')];

    mobileLinks.forEach((link) => {
        let linkHref = link.getAttribute('href').replace('./', '');
        link.classList.toggle(
            'active',
            linkHref === currentPage.replace('?', '')
        );
        if (linkHref === currentPage.replace('?', '')) {
            link.focus();
        }
    });
}

/**
 * Retrieves the user object from the 'users' data source based on the user token stored in the session or local storage.
 * If no token is found, redirects to the login page.
 * If the token does not correspond to a user, returns null.
 */
async function getUserLogin() {
    let sessionToken = sessionStorage.getItem('token');
    let localToken = localStorage.getItem('token');
    let isGuest = sessionStorage.getItem('isGuest') === 'true';

    let token = sessionToken || localToken;

    if (isGuest && sessionToken) {
        token = sessionToken;
    }

    if (!token) {
        console.error('Kein Token gefunden. Umleitung zur Login-Seite.');
        window.location.href = '../index.html';
        return null;
    }

    try {
        let user = await loadData('user');
        if (user) {
            return user;
        } else {
            console.warn(
                'Kein Benutzer gefunden, der mit diesem Token übereinstimmt.'
            );
            return null;
        }
    } catch (error) {
        console.error('Fehler beim Laden des Benutzers:', error);
        return null;
    }
}

/**
 * Asynchronously retrieves the user object from the 'users' data source based on the user token stored in the session storage.
 */
async function getGuestLogin(event) {
    event.preventDefault();
    sessionStorage.removeItem('token');
    try {
        let response = await postData('guest-login', {}, false);
        if (response.token) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('isGuest', 'true');
            localStorage.removeItem('token');
            location.href = './templates/summary.html';
        } else {
            console.error('Gast-Login: Kein Token empfangen');
        }
    } catch (error) {
        console.error('Fehler beim Gast-Login:', error);
        alert('Gast-Login fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
}

/**
 * Asynchronously retrieves the current user's emblem and updates the 'emblemUser' element with it.
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
 * Logs out the current user by removing the user ID from session and local storage.
 * If the user is a guest, the guest token is removed from session storage.
 * If the user is not a guest, the user token is removed from local storage and a logout request is sent to the server.
 */
async function userLogOut() {
    try {
        let isGuest = sessionStorage.getItem('isGuest') === 'true';

        if (isGuest) {
            await postData('guest-logout', {}, true);
            sessionStorage.removeItem('isGuest');
        } else {
            await postData('logout', {}, true);
        }
    } catch (error) {
        console.error('Logout-Fehler:', error);
    } finally {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '../index.html';
    }
}

/**
 * Asynchronously opens the sidebar rules for the current user. If the user is not logged in,
 * the sidebar and mobile sidebar are hidden, and the back button is set to redirect to the index page.
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

/**
 * Asynchronously validates the token on page load. If the token is not found, the user is logged out.
 */
async function validateTokenOnLoad() {
    let currentPage = window.location.pathname.split('/').pop();
    if (['index.html', 'signUp.html'].includes(currentPage)) {
        return;
    }

    let token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        console.warn(' Kein Token gefunden. Benutzer wird ausgeloggt.');
        logout();
        return;
    }

    try {
        let response = await fetch(BASE_URL + 'validate-token/', {
            method: 'GET',
            headers: getHeaders(true),
        });

        if (response.status === 401) {
            console.warn(
                ' Token ist ungültig oder abgelaufen. Benutzer wird ausgeloggt.'
            );
            logout();
        } else if (response.ok) {
            // console.warn(' Token ist gültig.');
        } else {
            console.warn(
                ' Unerwartete Antwort bei der Token-Validierung:',
                response.status
            );
        }
    } catch (error) {
        console.error(' Fehler bei der Token-Validierung:', error.message);
        logout();
    }
}

setInterval(async () => {
    try {
        let currentPage = window.location.pathname.split('/').pop();
        if (['index.html', 'signUp.html'].includes(currentPage)) {
            for (let i = 0; i < 1000; i++) {
                clearInterval(i);
            }
            return;
        }

        let token =
            localStorage.getItem('token') || sessionStorage.getItem('token');
        let isGuest = sessionStorage.getItem('isGuest') === 'true';

        if (!token) {
            console.warn('Kein Token gefunden. Ping wird nicht gesendet.');
            return;
        }
        await postData('ping-activity', {}, true);
    } catch (error) {
        console.error('Fehler beim Activity-Ping:', error.message);
    }
}, 0.1 * 60 * 1000);

/**
 * Logs out the current user by removing any stored token and guest status from local and session storage,
 * and redirects to the index page. This function is typically called when a user's token is invalid or expired.
 */
function logout() {
    console.warn('Token ungültig. Benutzer wird ausgeloggt.');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('isGuest');
    window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    await validateTokenOnLoad();
});

/**
 * Displays user-friendly error messages in the UI.
 *
 * This function takes an error object or a string and displays the
 * appropriate error messages in the "errorMessage" container on the webpage.
 * It handles error contexts such as 'user', 'contact', and 'general', and
 * extracts relevant error messages based on the provided context.
 */
function showError(error, context = 'general') {
    let divError = document.getElementById('errorMessage');
    divError.classList.remove('d-none');
    divError.innerHTML = '';

    console.warn('Debugging Error Object:', error, 'Context:', context);

    if (typeof error === 'string') {
        divError.innerHTML = `<p>${error}</p>`;
        return;
    }

    let errorMessages = [];

    if (context === 'user') {
        if (error?.email) errorMessages.push(error.email[0]);
        if (error?.username) errorMessages.push(error.username[0]);
        if (error?.phone) errorMessages.push(error.phone[0]);
    }

    if (context === 'contact') {
        if (error?.email) errorMessages.push(error.email[0]);
        if (error?.name) errorMessages.push(error.name[0]);
        if (error?.phone) errorMessages.push(error.phone[0]);
    }

    if (error?.non_field_errors) {
        errorMessages.push(error.non_field_errors[0]);
    }

    if (error?.detail) {
        errorMessages.push(error.detail);
    }

    if (errorMessages.length === 1) {
        divError.innerHTML = `<p>*${errorMessages[0]}</p>`;
    } else if (errorMessages.length > 1) {
        divError.innerHTML = `
        ${errorMessages.map((msg) => `<p>*${msg}</p>`).join('')}
    `;
    } else {
        divError.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    }
}
