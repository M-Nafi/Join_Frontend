/**
 * Initializes the login process by performing the following steps:
 * - Calls the joinAnimation function to animate the login process.
 * - Calls the moveIcon function to move the icon to the desired position.
 * - Loads the users data by calling the loadData function with the parameter 'users'.
 */
async function initLogin() {
    joinAnimation();
    moveIcon();
}

/**
 * Initializes the button element by disabling it and updating its class.
 */
function init() {
    let btn = document.getElementById('btnSignUp');
    btn.setAttribute('disabled', '');
    btn.classList.remove('btn-join');
    btn.classList.add('btn-disabled');
}

/**
 * Enables the button element with the id 'btnSignUp' by removing the 'disabled' attribute and updating its class.
 */
function isChecked() {
    let btn = document.getElementById('btnSignUp');
    btn.removeAttribute('disabled', '');
    btn.classList.add('btn-join');
    btn.classList.remove('btn-disabled');
}

/**
 * Adds a user to the system by validating the user's input and creating a new user.
 */
async function AddUser(event) {
    event.preventDefault();
    let username = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('signupPhone').value;
    let password = document.getElementById('password').value;
    let confirm_password = document.getElementById('passwordConfirm').value;

    try {
        let user = await createUser(
            username,
            email,
            phone,
            password,
            confirm_password
        );
        await postData('registration', user, false, 'user');
        showSignUpDialog();
        await sleep(3000);
        cleanContactControls();
    } catch (error) {
        console.error('Error adding user:', error.message);
        return;
    }
    window.location.href = '../index.html';
}

/**
 * Displays an error message indicating that the passwords do not match.
 */
function showPasswordError() {
    let pwErrorElement = document.getElementById('pwErrorCheck');
    pwErrorElement.style.display = 'flex';
    pwErrorElement.innerText = '* Passwords are not the same';
}

/**
 * Creates a new user object with the given name, email, and password.
 */
async function createUser(username, email, phone, password, confirm_password) {
    return {
        username: username,
        email: email,
        phone: phone,
        password: password,
        confirm_password: confirm_password,
        emblem: getEmblemUser(username),
        color: colorRandom(),
    };
}

/**
 * Displays the sign up dialog by setting the display style of the 'dialogSingUp' element to 'flex'.
 */
function showSignUpDialog() {
    document.getElementById('dialogSingUp').style.display = 'flex';
}

/**
 * Shows the login dialog by setting the display style of the 'dialogLogin' element to 'flex'.
 */
function showLoginDialog() {
    document.getElementById('dialogLogin').style.display = 'flex';
}

/**
 * Generates a random color from the `colors` array.
 */
function colorRandom() {
    return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`;
}

/**
 * Generates initials from a given name.
 */
function getEmblemUser(name) {
    let nameParts = name.split(' ');
    let initials = '';
    for (let i = 0; i < nameParts.length; i++) {
        if (i <= 1) {
            initials += nameParts[i].slice(0, 1).toUpperCase();
        }
    }
    return initials;
}

/**
 * Creates a promise that resolves after the specified time.
 */
let sleep = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Clears the input values of the contact form.
 */
function cleanContactControls() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('passwordConfirm').value = '';
}

/**
 * Handles the login process.
 */
async function doLogin(event) {
    if (event) event.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    try {
        let response = await postData(
            'login',
            { email, password },
            false,
            'user'
        );
        let token = response.token;
        let remember = document.getElementById('remember');
        setToken(token, remember);
        showLoginDialog();
        await sleep(3000);
        window.location.href = './templates/summary.html';
    } catch (error) {
        console.error('Login fehlgeschlagen:', error.message);
        return false;
    }
}

/**
 * Stores the given token in either local or session storage, depending on the state of the 'remember' checkbox.
 */
function setToken(token, remember) {
    if (remember.checked) {
        localStorage.setItem('token', token);
    } else {
        sessionStorage.setItem('token', token);
    }
    return false;
}

/**
 * Displays a login error message on the webpage.
 */
function showLoginError() {
    let loginErrorElement = document.getElementById('loginErrorCheck');
    loginErrorElement.style.display = 'flex';
    loginErrorElement.innerText = '* user does not exist or wrong password';
}

/**
 * Displays an error message on the webpage for a login failure. The error message
 * is displayed for 3 seconds before being hidden.
 */
function errorLogin() {
    document.getElementById('errorMessageContainer').classList.remove('dnone');
    setTimeout(function () {
        document.getElementById('errorMessageContainer').classList.add('dnone');
    }, 3000);
}

/**
 * Sets the userId in the session storage to 0 and redirects the user to the summary page.
 */
async function getGuestLogin(event) {
    event.preventDefault();
    try {
        let response = await postData('guest-login', {}, false);
        let token = response.token;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('isGuest', 'true');
        location.href = './templates/summary.html';
    } catch (error) {
        console.error('Fehler beim Gast-Login:', error);
        alert('Gast-Login fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
}

/**
 * Toggles the type of the password input field between "password" and "text" depending
 * on its current state. Also updates the icon next to the field to represent the
 * current state.
 */
function showPassword() {
    let passwordInput = document.getElementById('password');
    let toggleIcon = document.querySelector('#password + img');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = '../assets/icons/visibility_off.svg';
        toggleIcon.alt = 'Hide Password';
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = '../assets/icons/visibility.svg';
        toggleIcon.alt = 'Show Password';
    }
}

/**
 * Function to toggle password visibility.
 */
function showPasswordConf() {
    let passwordInput = document.getElementById('passwordConfirm');
    let toggleIcon = document.querySelector('#passwordConfirm + img');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = '../assets/icons/visibility_off.svg';
        toggleIcon.alt = 'Hide Password';
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = '../assets/icons/visibility.svg';
        toggleIcon.alt = 'Show Password';
    }
}

/**
 * Moves the icon to the container after a delay of 3000 milliseconds.
 */
function moveIcon() {
    setTimeout(() => {
        document.getElementById('containerLog').style.display = 'flex';
    }, 3000);
}

/**
 * Redirects the user to the sign up page and hides the sign up div if the window width is 700 or more.
 */
function signUp() {
    location.href = './templates/signUp.html';
    if (700 <= window.innerWidth) {
        document.getElementById('divSignUp').classList.add('d-none');
    }
}

/**
 * Redirects the user back to the login page and hides the sign up div if the window width is 700 or more.
 */
function backToLogin() {
    location.href = '../index.html';
    if (700 <= window.innerWidth) {
        document.getElementById('divSignUp').classList.remove('d-none');
    } else {
        document
            .getElementById('mobileDivSignUp')
            .classList.remove('d-none-important');
    }
}

/**
 * Toggles the visibility and styling of the animation elements based on the window width.
 */
function joinAnimation() {
    let animation = document.getElementById('iconContainer');
    let mobileanimation = document.getElementById('mobileIconContainer');
    let mobileanimationwhite = document.getElementById(
        'mobileIconContainerWhite'
    );
    let mainContainerLogin = document.getElementById('mainContainerLogin');
    if (700 <= window.innerWidth) {
        animation.classList.remove('d-none');
        animation.classList.add('icon-container');
    } else {
        mainContainerLogin.style.backgroundColor = '#06192c';
        mobileanimation.classList.remove('d-none');
        mobileanimationwhite.classList.remove('d-none');
        mobileanimation.classList.add('mobile-icon-container');
        mobileanimationwhite.classList.add('mobile-icon-container-white');
    }
}

/**
 * Validates the sign-up form fields for name, email, password, confirm password, and checkbox.
 */
function validateSignUpForm() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmpassword = document.getElementById('passwordConfirm').value;
    let checkBox = document.getElementById('acepptRules');
    if (
        name == '' ||
        email == '' ||
        password == '' ||
        confirmpassword == '' ||
        checkBox.checked == false
    ) {
        init();
    } else {
        isChecked();
    }
}

/**
 * Hides the password error message element.
 */
function resetError() {
    document.getElementById('pwErrorCheck').style.display = 'none';
}

/**
 * Hides the login error check element.
 */
function resetErrorLogIn() {
    let loginErrorElement = document.getElementById('loginErrorCheck');
    if (loginErrorElement) {
        loginErrorElement.style.display = 'none';
    }
}
