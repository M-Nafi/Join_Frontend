let lastClickedContact = null;

/**
 * Initializes the contact functionality by including HTML, loading contacts data asynchronously,
 * and rendering the list of contacts.
 * @return {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initContact() {
  await includeHTML();
  await contactsArray();
  renderListContact();
}

/**
 * Creates a new contact and adds it to the contacts array.
 * @param {Event} event - The event object for the form submission.
 * @return {Promise<void>} - A promise that resolves when the new contact is added and saved to the server.
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
    color: colorRandom(),
    checked: false
  };
  contacts.push(newContact);
  await postData("contacts", newContact);
  showNewContactDetails(newContact);
}

/**
 * Asynchronously edits a contact by updating its properties and saving the changes to the server.
 * @param {Event} event - The event object for the form submission.
 * @param {number} i - The index of the contact to be edited in the contacts array.
 * @return {Promise<void>} A promise that resolves when the contact is successfully edited and saved.
 */
async function editContact(event, i) {
  event.preventDefault();
  contactEdit = contacts[i];
  contactEdit["name"] = document.getElementById("nameContact").value;
  contactEdit["email"] = document.getElementById("emailContact").value;
  contactEdit["phone"] = document.getElementById("phoneContact").value;
  contactEdit["emblem"] = renderEmblem(
    document.getElementById("nameContact").value
  );
  await firebaseUpdate(contactEdit);
  closeDialog();
  cleanContactControls();
  renderListContact();
  showDetailContact(i);
}

/**
 * Deletes a contact from the contacts list and Firebase database.
 * @param {number} i - The index of the contact to delete in the contacts array.
 * @return {Promise<void>} A promise that resolves when the contact is deleted and the list is updated.
 */
async function deleteContact(i) {
  let contactDelete = contacts[i];
  contacts.splice(i, 1);
  document.getElementById("divDetails").innerHTML = "";
  await firebaseDelete(contactDelete);
  renderListContact();
  if (window.innerWidth <= 710) {
    backMobileContListe();
  }
}

/**
 * Updates a contact in the Firebase database.
 * @param {Object} contactEdit - The contact data to be updated.
 * @param {string} contactEdit.id - The ID of the contact to update.
 * @return {Promise<void>} A promise that resolves when the update is complete.
 */
async function firebaseUpdate(contactEdit) {
  let contactsJson = await loadData("contacts");
  for (key in contactsJson) {
    let contactDB = contactsJson[key];
    if (contactDB.id == contactEdit.id) {
      contactId = contactDB.id;
    }
  }
  await patchData(`contacts/${contactId}`, contactEdit);
}

/**
 * Deletes a contact from the Firebase database by finding the contact with the matching contactId
 * and deleting it.
 * @param {Object} contactDelete - The contact object to be deleted.
 * @return {Promise<void>} A promise that resolves when the contact is successfully deleted.
 */
async function firebaseDelete(contactDelete) {
  let contactsJson = await loadData("contacts");
  for (key in contactsJson) {
    let contactDB = contactsJson[key];
    if (contactDB.id == contactDelete.id) {
      contactId = contactDB.id;
    }
  }
  deleteData(`contacts/${contactId}`);
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
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Sorts the contacts array in ascending order based on the contact's name.
 * @return {void} This function does not return anything.
 */
function sortContacts() {
  contacts = contacts.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });
}

/**
 * Toggles the display of contact details for the selected contact.
 * Highlights the selected contact and updates the contact details view.
 * @param {number} i - The index of the contact in the contacts array to show details for.
 * @return {void} This function does not return anything.
 */
function showDetailContact(i) {
  let contactListContainer = document.getElementById(`contactListContainer${i}`);
  let infoContact = document.getElementById("divDetails");
  if (lastClickedContact === i) {
    contactListContainer.classList.remove("contact-list-container-selected");
    helpToShowContactDetails(infoContact);
    lastClickedContact = null;
  } else {
    if (lastClickedContact !== null) {
      document.getElementById(`contactListContainer${lastClickedContact}`).classList.remove("contact-list-container-selected");
    }
    contactListContainer.classList.add("contact-list-container-selected");
    helpRemoveContactDetails(infoContact);
    infoContact.innerHTML = renderContactinList(i); 
    lastClickedContact = i;
  }
  mobileDetails();
}

/**
 * Animates the contact details to slide in from the left to the right.
 * Removes the 'move-left' class and adds the 'move-right' class to trigger the animation.
 * @param {HTMLElement} infoContact - The element representing the contact details to animate.
 * @return {void} This function does not return anything.
 */
function helpToShowContactDetails(infoContact) {
  infoContact.classList.remove("move-left");
  infoContact.classList.add("move-right");
}

/**
 * Animates the contact details to slide out from the right to the left.
 * Removes the 'move-right' class and adds the 'move-left' class to trigger the animation.
 * @param {HTMLElement} infoContact - The element representing the contact details to animate.
 * @return {void} This function does not return anything.
 */
function helpRemoveContactDetails(infoContact) {
  infoContact.classList.remove("move-right");
  infoContact.classList.add("move-left");
}

/**
 * Removes the 'contact-list-container-selected' class from all contact list containers.
 * This function ensures that no contact list container is marked as selected.
 * @return {void} This function does not return anything.
 */
function removeSelectedClassFromAllContacts() {
  let allContactContainers = document.querySelectorAll(
    ".contact-list-container"
  );
  for (let i = 0; i < allContactContainers.length; i++) {
    let container = allContactContainers[i];
    container.classList.remove("contact-list-container-selected");
  }
}

/**
 * Adds the 'contact-list-container-selected' class to the currently selected contact.
 * @param {number} i - The index of the contact in the contacts array.
 * @return {void} This function does not return anything.
 */
function addSelectedClassToCurrentContact(i) {
  let contactListContainer = document.getElementById(
    `contactListContainer${i}`
  );
  contactListContainer.classList.add("contact-list-container-selected");
}

/**
 * Displays the details of the selected contact.
 * @param {number} i - The index of the contact in the contacts array.
 * @return {void} This function does not return anything.
 */
let isVisible = false; 
function displayContactDetails(i) {
  let infoContact = document.getElementById("divDetails");
  if (!isVisible) {
    infoContact.innerHTML = " ";
    infoContact.classList.remove("move-right");
    infoContact.offsetWidth; 
    infoContact.classList.add("move-left"); 
    infoContact.innerHTML += renderContactinList(i); 
  } else {
    infoContact.classList.remove("move-left"); 
    infoContact.offsetWidth; 
    infoContact.classList.add("move-right"); 
  }
  isVisible = !isVisible;
  mobileDetails();
}

/**
 * Opens a dialog box for adding or editing a contact.
 * @param {boolean} newContact - Indicates whether to open the dialog for adding a new contact or editing an existing one.
 * @param {number} i - The index of the contact in the contacts array (only used when editing an existing contact).
 * @return {void} This function does not return anything.
 */
function openDialog(newContact, i) {
  let dialog = document.getElementById("dialog");

  dialog.classList.remove("move-left", "move-right"); 
  dialog.offsetWidth; 
  dialog.classList.add("move-left"); 

  dialog.classList.remove("d-none"); 

  if (newContact == true) {
    let functionNew = "newContact(event)";
    dialog.innerHTML = renderContactDialog("Add contact", functionNew, "Create Contact");
  } else {
    let contact = contacts[i];
    let functionNew = "editContact(event," + i + ")";
    dialog.innerHTML = renderContactDialog("Edit contact", functionNew, "Save");
    document.getElementById("iconContact").outerHTML = `<div class="emblem-info" id="emblemContact" style="background-color: ${contact["color"]}">${contact["emblem"]}</div>`;
    helpFunctionOpenDialog(contact);
  }
}

/**
 * Populates the contact form fields with the details of the contact to be edited and hides the 'textAdd' element.
 * @return {void} This function does not return a value.
 */
function helpFunctionOpenDialog(contact) {
  document.getElementById("textAdd").classList.add("d-none");
  document.getElementById("nameContact").value = contact["name"];
  document.getElementById("emailContact").value = contact["email"];
  document.getElementById("phoneContact").value = contact["phone"];
}

/**
 * Closes the dialog box.
 * @return {void} This function does not return anything.
 */
function closeDialog() {
  let dialog = document.getElementById("dialog");
  dialog.classList.remove("move-left", "move-right"); 
  dialog.offsetWidth; 
  dialog.classList.add("move-right"); 

  setTimeout(() => {
    dialog.classList.add("d-none"); 
  }, 500); 
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
  document.getElementById("contactCreated").classList.remove("d-none");
  for (let i = 0; i < contacts.length; i++) {
    if (newContact.name == contacts[i].name) {
      let infoContact = document.getElementById("divDetails");
      infoContact.innerHTML = " ";
      infoContact.classList.remove("move-left");
      infoContact.innerHTML += renderContactinList(i);
      mobileDetails();
    }
  }
  contactCreatedDiv();
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
 * Toggles the display of the "mobileMode" element. If the element is currently hidden, it will be displayed as a flex container. If it is already displayed, it will be hidden.
 * @return {void} This function does not return a value.
 */
function openMobileDialog() {
  let mobileMode = document.getElementById("amobile_nameContact");
  if (mobileMode != null) {
    if (mobileMode.style.display == "none") {
      mobileMode.style.display = "flex";
    } else {
      mobileMode.style.display = "none";
    }
  }
}