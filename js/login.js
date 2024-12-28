/**
 * Initializes the login process by performing the following steps:
 * - Calls the joinAnimation function to animate the login process.
 * - Calls the moveIcon function to move the icon to the desired position.
 * - Loads the users data by calling the loadData function with the parameter 'users'.
 * @return {Promise<void>} A Promise that resolves when the login process is completed.
 */
async function initLogin() {
  joinAnimation();
  moveIcon();
}

/**
 * Initializes the button element by disabling it and updating its class.
 */
function init() {
  let btn = document.getElementById("btnSignUp");
  btn.setAttribute("disabled", "");
  btn.classList.remove("btn-join");
  btn.classList.add("btn-disabled");
}

/**
 * Enables the button element with the id 'btnSignUp' by removing the 'disabled' attribute and updating its class.
 * @return {void} This function does not return anything.
 */
function isChecked() {
  const btn = document.getElementById("btnSignUp");
  btn.removeAttribute("disabled", "");
  btn.classList.add("btn-join");
  btn.classList.remove("btn-disabled");
}

/**
 * Adds a user to the system by validating the user's input and creating a new user.
 * @param {Event} event - The event object triggered by the form submission.
 * @return {Promise<boolean>} A promise that resolves to true if the user is successfully added, or false if there is an error.
 */
async function AddUser(event) {
  event.preventDefault();
  let username = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("signupPhone").value;
  let password = document.getElementById("password").value;
  let confirm_password = document.getElementById("passwordConfirm").value;

  let user = await createUser(username, email, phone, password, confirm_password);
  console.log("User added:", user);
  await postData("registration", user, false);
  showSignUpDialog();
  await sleep(3000);
  cleanContactControls();
  backToLogin();
}

/**
 * Displays an error message indicating that the passwords do not match.
 */
function showPasswordError() {
  let pwErrorElement = document.getElementById("pwErrorCheck");
  pwErrorElement.style.display = "flex";
  pwErrorElement.innerText = "* Passwords are not the same";
}

/**
 * Creates a new user object with the given name, email, and password.
 * @param {string} username - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @return {Promise<Object>} A promise that resolves to the newly created user object.
 */
async function createUser(username, email, phone, password, confirm_password) {
  return {
    username: username,
    email: email,
    phone: phone,
    password: password,
    confirm_password: confirm_password,
    emblem: getEmblemUser(username),
    color: colorRandom()
  };
}

/**
 * Displays the sign up dialog by setting the display style of the 'dialogSingUp' element to 'flex'.
 * @return {void} This function does not return a value.
 */
function showSignUpDialog() {
  document.getElementById("dialogSingUp").style.display = "flex";
}

/**
 * Shows the login dialog by setting the display style of the 'dialogLogin' element to 'flex'.
 * @return {void} This function does not return a value.
 */
function showLoginDialog() {
  document.getElementById("dialogLogin").style.display = "flex";
}

/**
 * Checks if an email already exists in the users data.
 * @param {string} email - The email to check.
 * @return {Promise<boolean>} A promise that resolves to true if the email already exists, false otherwise.
 */
async function emailExists(email) {
  let usersJson = await loadData("users");
  for (let key in usersJson) {
    if (usersJson[key].email === email) {
      return true;
    }
  }
  return false;
}

/**
 * Generates a random color from the `colors` array.
 * @return {string} A randomly selected color from the `colors` array.
 */
function colorRandom() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

/**
 * Generates initials from a given name.
 * @param {string} name - The name from which to generate initials.
 * @return {string} The initials generated from the name.
 */
function getEmblemUser(name) {
  let nameParts = name.split(" ");
  let initials = "";
  for (let i = 0; i < nameParts.length; i++) {
    if (i <= 1) {
      initials += nameParts[i].slice(0, 1).toUpperCase();
    }
  }
  return initials;
}

/**
 * Creates a promise that resolves after the specified time.
 * @param {number} ms - The time in milliseconds to sleep.
 * @return {Promise} A promise that resolves after the specified time.
 */
let sleep = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Clears the input values of the contact form.
 */
function cleanContactControls() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("passwordConfirm").value = "";
}

/**
 * Handles the login process.
 * @param {Event} event - The event object that triggered the function.
 * @return {boolean} Returns false if login fails, otherwise redirects to the summary page.
 */
async function doLogin(event) {
  if (event) event.preventDefault();
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  try {
    const response = await postData("login", { email, password }, false);
    const token = response.token;
    const remember = document.getElementById("remember");
    setToken(token, remember);
    console.log("Token:", response);
    showLoginDialog();
    await sleep(3000);
    window.location.href = "./templates/summary.html";
  } catch (error) {
    console.error("Login fehlgeschlagen:", error.message);
    showLoginError(error.message);
    return false;
  }
}

function setToken(token, remember) {
  if (remember.checked) {
    localStorage.setItem("token", token);
    console.log("Token gespeichert in Local Storage.");
  } else {
    sessionStorage.setItem("token", token);
    console.log("Token gespeichert in Session Storage.");
  }
  return false;
}

/**
 * Displays a login error message on the webpage.
 */
function showLoginError() {
  let loginErrorElement = document.getElementById("loginErrorCheck");
  loginErrorElement.style.display = "flex";
  loginErrorElement.innerText = "* user does not exist or wrong password";
}

/**
 * Displays an error message on the webpage for a login failure. The error message
 * is displayed for 3 seconds before being hidden.
 * @return {void} This function does not return anything.
 */
function errorLogin() {
  document.getElementById("errorMessageContainer").classList.remove("dnone");
  setTimeout(function () {
    document.getElementById("errorMessageContainer").classList.add("dnone");
  }, 3000);
}

/**
 * Sets the userId in the session storage to 0 and redirects the user to the summary page.
 * @param {Event} event - The event object representing the form submission.
 * @return {void} This function does not return anything.
 */
async function getGuestLogin(event) {
  event.preventDefault();
  try {
      const response = await postData("guest-login", {}, false);
      const token = response.token;
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("isGuest", "true");
      location.href = "./templates/summary.html";
  } catch (error) {
      console.error("Fehler beim Gast-Login:", error);
      alert("Gast-Login fehlgeschlagen. Bitte versuchen Sie es erneut.");
  }
}

function showPassword() {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.querySelector("#password + img");
  
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.src = "../assets/icons/visibility_off.svg";
    toggleIcon.alt = "Hide Password";
  } else {
    passwordInput.type = "password";
    toggleIcon.src = "../assets/icons/visibility.svg";
    toggleIcon.alt = "Show Password";
  }
}


/**
 * Function to toggle password visibility.
 */
function showPasswordConf() {
  const passwordInput = document.getElementById("passwordConfirm");
  const toggleIcon = document.querySelector("#passwordConfirm + img");
  
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleIcon.src = "../assets/icons/visibility_off.svg";
    toggleIcon.alt = "Hide Password";
  } else {
    passwordInput.type = "password";
    toggleIcon.src = "../assets/icons/visibility.svg";
    toggleIcon.alt = "Show Password";
  }
}

/**
 * Moves the icon to the container after a delay of 3000 milliseconds.
 * @return {void} This function does not return anything.
 */
function moveIcon() {
  setTimeout(() => {
    document.getElementById("containerLog").style.display = "flex";
  }, 3000);
}

/**
 * Redirects the user to the sign up page and hides the sign up div if the window width is 700 or more.
 * @return {void} This function does not return anything.
 */
function signUp() {
  location.href = "./templates/signUp.html";
  if (700 <= window.innerWidth) {
    document.getElementById("divSignUp").classList.add("d-none");
  }
}

/**
 * Redirects the user back to the login page and hides the sign up div if the window width is 700 or more.
 * @return {void} This function does not return anything.
 */
function backToLogin() {
  location.href = "../index.html";
  if (700 <= window.innerWidth) {
    document.getElementById("divSignUp").classList.remove("d-none");
  } else {
    document
      .getElementById("mobileDivSignUp")
      .classList.remove("d-none-important");
  }
}

/**
 * Toggles the visibility and styling of the animation elements based on the window width.
 * @return {void} This function does not return anything.
 */
function joinAnimation() {
  let animation = document.getElementById("iconContainer");
  let mobileanimation = document.getElementById("mobileIconContainer");
  let mobileanimationwhite = document.getElementById(
    "mobileIconContainerWhite"
  );
  let mainContainerLogin = document.getElementById("mainContainerLogin");
  if (700 <= window.innerWidth) {
    animation.classList.remove("d-none");
    animation.classList.add("icon-container");
  } else {
    mainContainerLogin.style.backgroundColor = "#06192c";
    mobileanimation.classList.remove("d-none");
    mobileanimationwhite.classList.remove("d-none");
    mobileanimation.classList.add("mobile-icon-container");
    mobileanimationwhite.classList.add("mobile-icon-container-white");
  }
}

/**
 * Validates the sign-up form fields for name, email, password, confirm password, and checkbox.
 * @return {void} Calls either the init() function or isChecked() based on form field validation.
 */
function validateSignUpForm() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmpassword = document.getElementById("passwordConfirm").value;
  let checkBox = document.getElementById("acepptRules");
  if (
    name == "" ||
    email == "" ||
    password == "" ||
    confirmpassword == "" ||
    checkBox.checked == false
  ) {
    init();
  } else {
    isChecked();
  }
}

/**
 * Hides the password error message element.
 * @return {void} This function does not return anything.
 */
function resetError() {
  document.getElementById("pwErrorCheck").style.display = "none";
}

/**
 * Hides the login error check element.
 * @return {void} This function does not return anything.
 */
function resetErrorLogIn() {
  document.getElementById("loginErrorCheck").style.display = "none";
}
