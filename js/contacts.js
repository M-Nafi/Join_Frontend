let currentSelectedContactId = null;
/**
 * Initializes the contact functionality by including HTML, loading contacts data asynchronously,
 * and rendering the list of contacts.
 * @return {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initContact() {
  await includeHTML();
  await contactsArray();
  await loggedUser();
  sortContacts();
  renderListContact();
}

/**
 * Renders the list of contacts asynchronously.
 * 1. Retrieves the user object.
 * 2. Clears the innerHTML of the user container and the list contact container.
 * 3. If the user is logged in, renders the user container with the 'current-user' class.
 * 4. Sorts the contacts array by name.
 * 5. Calls renderContactsWithoutUser to render the list of contacts.
 * @return {Promise<void>} A promise that resolves when the rendering is complete.
 */
async function renderListContact() {
  let userContainer = document.getElementById("loggedUserContainer");
  let listContact = document.getElementById("divList");

  listContact.innerHTML = "";
  userContainer.innerHTML = "";

  if (profile && profile.username) {
    userContainer.innerHTML = renderUserContainerHTML(profile);
  }
  sortContacts();
  renderContactsWithoutUser(listContact);
}

/**
 * Renders contacts in the list excluding the specified user, grouping them by the first letter
 * of their name. If the first letter changes, a header is added to the list.
 * @param {HTMLElement} listContact - The HTML element where the contacts will be rendered.
 * @param {Object} user - The user object to exclude from the rendering.
 */
function renderContactsWithoutUser(listContact) {
  let currentLetter = "";
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];

    let firstLetter = contact.name.charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      listContact.innerHTML += `
        <div class="contact-letter-header">${currentLetter}</div>
      `;
    }
    listContact.innerHTML += renderListContactHTML(contact, i);
  }
}

/**
 * Creates a new contact by retrieving the input values from the dialog, creating a new contact object,
 * saving it to the server, adding it to the contacts array, rendering the list of contacts, closing the dialog,
 * showing the details of the new contact, and cleaning the input fields.
 * @param {Event} event - The event object triggered by the form submission.
 * @return {Promise<void>} A promise that resolves when the creation is complete.
 */
async function newContact(event) {
  event.preventDefault();
  let nameContact = document.getElementById("nameContact").value;
  let nameContactUpper = nameContact[0].toUpperCase() + nameContact.slice(1);
  let newContact = {
    name: nameContactUpper,
    email: document.getElementById("emailContact").value,
    phone: document.getElementById("phoneContact").value,
    emblem: renderEmblem(nameContact),
    color: colorRandom()
  };

  try {
    let saveContact = await postData("contacts", newContact, true);

    if (!saveContact) {
      throw new Error('Fehler beim Erstellen des Kontakts oder keine Antwort erhalten.');
    }

    contacts.push(saveContact);
    sortContacts();
    await renderListContact();
    closeDialog();
    showDetails(saveContact.id, "contact");
    cleanContactControls();
  } catch (error) {
    console.error('Fehler beim Erstellen des Kontakts:', error);
    showError(error);
  }
}

/**
 * Shows the given error message in the error div.
 * @param {string} error - The error message to show.
 */
function showError(error) {
  let divError = document.getElementById("errorMessage");
  divError.style.display = "block";
  let message = error.message ? error.message.replace(/^Error:\s*/, '') : error;

  divError.innerHTML = `
    <div class="error">
      <p>${message}</p>
    </div>
  `;
}

/**
 * Edits an existing contact.
 * @param {Event} event - Das Form-Event.
 * @param {number} index - Der Index des Kontakts im Array.
 */
async function editContact(event, id) {
  event.preventDefault();
  const contactEdit = contacts.find((c) => c.id === id);

  contactEdit.name = document.getElementById("nameContact").value;
  contactEdit.email = document.getElementById("emailContact").value;
  contactEdit.phone = document.getElementById("phoneContact").value;
  contactEdit.emblem = renderEmblem(contactEdit.name);
  try {
    await putData(`contacts/${contactEdit.id}`, contactEdit, true);
    sortContacts();
    renderListContact();
    showDetails(contactEdit.id, "contact");
    closeDialog();
    cleanContactControls();
  } catch (error) {
    showError(error);
  }
}

/**
 * Edits the current user's information.
 * @param {Event} event - The form event.
 * @return {Promise<void>} A promise that resolves when the user is successfully edited and the UI is updated.
 */
async function editProfile(event) {
  event.preventDefault();

  const updatedUser = {
    id: profile.id,
    username: document.getElementById("nameProfile").value,
    email: document.getElementById("emailProfile").value,
    phone: document.getElementById("phoneProfile").value,
    emblem: renderEmblem(document.getElementById("nameProfile").value)
  };

  try {
    await putData(`user`, updatedUser, true); 
    sortContacts();
    await loggedUser();
    showDetails(profile.id, "profile");
    closeDialog();
  } catch (error) {
    showError(error);
  }
}

/**
 * Deletes the currently logged-in user from the server and redirects to the login page.
 * @return {Promise<void>} A promise that resolves when the user is deleted and the redirect is complete.
 */
async function deleteProfile(id) {
  if (id !== profile.id) return;
  try {
    await deleteData(`user`, true); 
    window.location.href = "../index.html";
  } catch (error) {
    console.error("Fehler beim Löschen des Benutzers:", error);
  }
}

/**
 * Deletes a contact by removing it from the contacts array, clearing the details div,
 * deleting the contact from the server, and re-rendering the list of contacts.
 * @param {number} i - Der Index des Kontakts im Array.
 */
async function deleteContact(id) {
  const contact = contacts.find((c) => c.id === id);
  try {
    await deleteData(`contacts/${contact.id}`, true);
    const index = contacts.findIndex((c) => c.id === id);
    if (index !== -1) contacts.splice(index, 1);
    renderListContact();
  } catch (error) {
    console.error("Fehler beim Löschen des Kontakts:", error);
  }
  renderListContact();
  sortContacts();
  closeDetailDialog();

  if (window.innerWidth <= 710) {
    backMobileContListe();
  }
}

/**
 * Generates an emblem based on the given name.
 * @param {string} name - The name to generate the emblem from.
 * @return {string} The generated emblem.
 */
function renderEmblem(name) {
  let aux = name.split(" ");
  let capital = "";
  for (let j = 0; j < aux.length; j++) {
    if (j <= 1) {
      capital += aux[j].slice(0, 1).toUpperCase();
    }
  }
  return capital;
}

/**
 * Generates a random color from the given array of colors.
 * @return {string} The randomly generated color.
 */
function colorRandom() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

/**
 * Sorts the contacts array alphabetically by name and groups them by the first letter.
 * Adds a property 'group' to each contact representing the first letter of their name.
 * @return {void} This function does not return anything.
 */
function sortContacts() {
  contacts.sort((a, b) => a.name.localeCompare(b.name));

  contacts.forEach((contact) => {
    contact.group = contact.name.charAt(0).toUpperCase();
  });
}


/**
 * Shows or hides the details dialog based on the given id and type.
 * @param {number} id - The id of the contact to show or hide.
 * @param {string} type - The type of the contact to show or hide.
 * @return {void} This function does not return anything.
 */
function showDetails(id, type) {
  let dialog = document.getElementById("divDetails");

  if (currentSelectedContactId === id) {
    hideDetails(dialog);
  } else {
    removeSelectedClassFromAllContacts(); 
    currentSelectedContactId = id; 
    showDetailDialog(dialog); 
    handleContactDetails(id, type); 
  }
}

/**
 * Zeigt den Detail-Dialog an, indem die Klasse 'd-none' entfernt
 * und die Klasse 'move-left' hinzugefügt wird. Nach 250ms wird die
 * Klasse 'move-left' wieder entfernt.
 * @param {HTMLElement} dialog - Das HTMLElement, dass den Detail-Dialog darstellt.
 */
function showDetailDialog(dialog) {
  dialog.classList.remove("d-none");
  dialog.classList.add("move-left");
  setTimeout(() => dialog.classList.remove("move-left"), 250);
}

/**
 * Versteckt den Detail-Dialog mit Animation
 * und entfernt die selected-Class von allen Kontakten
 * und setzt currentSelectedContactId auf null.
 * @param {HTMLElement} dialog - Das HTMLElement, dass den Detail-Dialog darstellt.
 */
function hideDetails(dialog) {
  dialog.classList.add("move-right");
  setTimeout(() => {
    dialog.classList.add("d-none");
    dialog.classList.remove("move-right");
    removeSelectedClassFromAllContacts();  
    currentSelectedContactId = null;  
  }, 250);
}

/**
 * Handles showing the details of a contact or profile.
 * @param {number} id - The id of the contact or profile.
 * @param {string} type - The type of the contact or profile ('profile' or 'contact').
 * @return {void} This function does not return anything.
 */
function handleContactDetails(id, type) {
  if (profile.id == id && type === "profile") {
    displayContactDetails(profile, type);
    addSelectedClassToCurrentContact(id, "profile");
  } else if (type === "contact") {
    let contact = contacts.find((c) => c.id === id);
    if (contact) {
      displayContactDetails(contact, type);
      addSelectedClassToCurrentContact(id, "contact");
    }
  }
}

/**
 * Removes the 'contact-list-container-selected' class from all contact containers and the logged user container.
 * This is used to unselect all contacts when the details dialog is closed.
 * @return {void} This function does not return a value.
 */
function removeSelectedClassFromAllContacts() {
  let allContactContainers = document.querySelectorAll(".contact-list-container");
  for (let i = 0; i < allContactContainers.length; i++) {
    let container = allContactContainers[i];
    container.classList.remove("contact-list-container-selected");
  }
  let userContainer = document.getElementById("loggedUserContainer");
  userContainer.classList.remove("contact-list-container-selected");
}

/**
 * Adds the 'contact-list-container-selected' class to the element with the given id and type.
 * @param {number} id - The id of the contact or profile.
 * @param {string} type - The type ('profile' or 'contact').
 * @return {Promise<void>} A promise that resolves when the class has been added.
 */
async function addSelectedClassToCurrentContact(id, type) {
  if (type === "profile") {
    let userContainer = document.getElementById("loggedUserContainer");
    userContainer.classList.add("contact-list-container-selected");
  } else if (type === "contact") {
    let contactListContainer = document.getElementById(`contact-${id}`);
    contactListContainer.classList.add("contact-list-container-selected");
  }
}

/**
 * Displays the details of a contact or profile.
 * @param {object} detail - The detail object (profile or contact).
 * @param {string} type - The type ('profile' or 'contact').
 */
function displayContactDetails(detail, type) {
  let infoContact = document.getElementById("divDetails");
  infoContact.innerHTML = "";
  infoContact.classList.remove("move-left");
  infoContact.offsetWidth;
  infoContact.classList.add("move-left");

  infoContact.innerHTML += renderDetailsHTML(detail, type);
  mobileDetails();
}

/**
 * Generates actions based on the detail type.
 * @param {string} type - Type of detail ('profile' or 'contact').
 * @param {number} id - ID of the detail.
 * @returns {object} Object containing 'edit' and 'delete' actions.
 */
function getDetailActions(type, id) {
  if (type === "profile") {
    return {
      edit: `openProfileDialog()`,
      delete: `deleteProfile(${id})`,
      infoTitle: "Profile Information"
    };
  } else if (type === "contact") {
    return {
      edit: `openEditContactDialog(${id})`,
      delete: `deleteContact(${id})`,
      infoTitle: "Contact Information"
    };
  }
}

/**
 * Animates the dialog in with a slide-in animation, and renders the
 * content of the add contact dialog.
 */
function slideIn() {
  let dialog = document.getElementById("dialog");
  let dialogContent = document.getElementById("dialogContent");
  dialog.classList.remove("d-none");
  dialogContent.classList.add("move-left");

  setTimeout(() => {
    dialogContent.classList.remove("move-left");
  }, 250);

  dialog.classList.remove("d-none");
  dialogContent.innerHTML = renderAddContactDialog();
}

/**
 * Opens a dialog to add a new contact.
 */
function openAddContactDialog() {
  slideIn();
}

/**
 * Opens a dialog to edit the user profile.
 */
function openProfileDialog() {
  slideIn();
  dialogContent.innerHTML = renderProfileDialog(profile);
}

/**
 * Opens a dialog to edit an existing contact.
 * @param {number} contactId - The ID of the contact to edit.
 */
function openEditContactDialog(id) {
  slideIn();
  const contact = contacts.find((c) => c.id === id);
  if (!contact) {
    console.error(`Contact with ID ${id} not found.`);
    return;
  }
  dialogContent.innerHTML = renderContactDialog(contact);
}

/**
 * Closes the dialog box.
 * @return {void} This function does not return anything.
 */
function closeDetailDialog() {
  let dialog = document.getElementById("divDetails");
  dialog.classList.add("d-none");
}

/**
 * Displays the details of a newly created contact.
 * @param {Object} newContact - The newly created contact object.
 * @return {void} This function does not return a value.
 */
function showNewContactDetails(newContact) {
  closeDialog();
  cleanContactControls();
  renderListContact();
  displayNewContactDetails(newContact);
  document.getElementById("contactCreated").classList.remove("d-none");
  contactCreatedDiv();
}

/**
 * Displays the details of a newly created contact.
 * Iterates over the contacts array and finds the index of the newly created contact.
 * Clears the innerHTML of the contact details div, removes the 'move-left' class,
 * renders the contact using renderDetailsHTML and adds the rendered HTML to the div,
 * and calls the mobileDetails function.
 * @param {Object} newContact - The newly created contact object.
 * @return {void} This function does not return a value.
 */
function displayNewContactDetails(newContact) {
  for (let i = 0; i < contacts.length; i++) {
    if (newContact.name == contacts[i].name) {
      let infoContact = document.getElementById("divDetails");
      infoContact.innerHTML = " ";
      infoContact.classList.remove("move-left");
      infoContact.innerHTML += renderDetailsHTML(i);
      mobileDetails();
    }
  }
}

/**
 * Sets a timeout to hide the 'contactCreated' element after 2400 milliseconds.
 * @return {void} This function does not return a value.
 */
function contactCreatedDiv() {
  setTimeout(() => {
    document.getElementById("contactCreated").classList.add("d-none");
  }, 2400);
}

/**
 * Clears the values of the 'nameContact', 'emailContact', and 'phoneContact' input fields.
 * @return {void} This function does not return a value.
 */
function cleanContactControls() {
  document.getElementById("nameContact").value = "";
  document.getElementById("emailContact").value = "";
  document.getElementById("phoneContact").value = "";
}

let mobilWindow = window.matchMedia("(max-width:710px)");
mobilWindow.addEventListener("change", () => myFunc());

/**
 * Function to handle mobile window changes and adjust contact details display accordingly.
 */
function myFunc() {
  if (mobilWindow.matches) {
    document.getElementById("divContactDetails").style.display = "none";
    document.getElementById("divContactList").style.display = "flex";
  } else {
    document.getElementById("divContactDetails").style.display = "flex";
    document.getElementById("divContactList").style.display = "flex";
    let amobileDiv = document.getElementById("amobile_nameContact");
    if (amobileDiv != null) {
      amobileDiv.style.display = "none";
    }
  }
}

/**
 * Toggles the display of the contact details and contact list based on the window width.
 * If the window width is less than or equal to 710 pixels, the contact details are displayed and the contact list is hidden.
 * The 'move-left' class is removed from the 'divDetails' element.
 * @return {void} This function does not return a value.
 */
function mobileDetails() {
  outWidth = window.innerWidth;
  if (outWidth <= 710) {
    document.getElementById("divContactDetails").style.display = "flex";
    document.getElementById("divContactList").style.display = "none";
    document.getElementById("divDetails").classList.remove("move-left");
  }
}

/**
 * Hides the contact details and displays the contact list when the window width is less than or equal to 710 pixels.
 * @return {void} This function does not return a value.
 */
function backMobileContListe() {
  outWidth = window.innerWidth;
  if (outWidth <= 710) {
    document.getElementById("divContactDetails").style.display = "none";
    document.getElementById("divContactList").style.display = "flex";
  }
}

/**
 * Toggles the active state and dropdown menu of the mobile contact button.
 * @param {HTMLElement} button - The button triggering the dropdown toggle.
 */
function toggleActive(button) {
  const mobileMode = document.getElementById("amobile_nameContact");
  if (!mobileMode) return;
  button.classList.toggle("active");
  mobileMode.style.display = button.classList.contains("active")
    ? "flex"
    : "none";

  function handleOutsideClick(event) {
    if (!button.contains(event.target) && !mobileMode.contains(event.target)) {
      button.classList.remove("active");
      mobileMode.style.display = "none";
      document.removeEventListener("click", handleOutsideClick);
    }
  }

  if (button.classList.contains("active")) {
    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 0);
  } else {
    document.removeEventListener("click", handleOutsideClick);
  }
}

/**
 * Closes a dialog with the specified ID.
 * If no dialogId is given, it defaults to "dialog".
 * The dialog is closed by adding the 'move-right' class to the dialog content,
 * and then 250ms later, the 'd-none' class is added to the dialog to hide it,
 * and the 'move-right' class is removed from the dialog content.
 * @param {string} dialogId - The ID of the dialog to close.
 * @return {void} This function does not return a value.
 */
function closeDialog(dialogId = "dialog") {
  let dialogContent = document.getElementById("dialogContent");
  let dialog = document.getElementById(dialogId);
  if (dialog) {
    dialogContent.classList.add("move-right");
    setTimeout(() => {
      dialog.classList.add("d-none");
      dialogContent.classList.remove("move-right");
    }, 250);
  }
}