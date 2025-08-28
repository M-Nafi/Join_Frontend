let currentSelectedContactId = null;
let lastSelectedContactId = null;
/**
 * Initializes the contact functionality by including HTML, loading contacts data asynchronously,
 * and rendering the list of contacts.
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
 */
async function renderListContact() {
    let userContainer = document.getElementById('loggedUserContainer');
    let listContact = document.getElementById('divList');

    listContact.innerHTML = '';
    userContainer.innerHTML = '';
    if (profile && profile.username) {
        userContainer.innerHTML = renderUserContainerHTML(profile);
    }
    sortContacts();
    renderContactsWithoutUser(listContact);
}

/**
 * Renders contacts in the list excluding the specified user, grouping them by the first letter
 * of their name. If the first letter changes, a header is added to the list.
 */
function renderContactsWithoutUser(listContact) {
    let currentLetter = '';
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
 * Asynchronously saves data to a specified URL using the provided method.
 * Logs an error to the console if the method fails.
 */
async function saveData(url, data, method) {
    try {
        return await method(url, data, 'contact');
    } catch (error) {
        console.error(`Fehler bei ${method.name}:`, error);
    }
}

/**
 * Creates a new contact by retrieving the input values from the dialog, creating a new contact object,
 * saving it to the server, adding it to the contacts array, rendering the list of contacts, closing the dialog,
 * showing the details of the new contact, and cleaning the input fields.
 */
async function newContact(event) {
    event.preventDefault();
    let newContact = {
        name:
            document.getElementById('nameContact').value[0].toUpperCase() +
            document.getElementById('nameContact').value.slice(1),
        email: document.getElementById('emailContact').value,
        phone: document.getElementById('phoneContact').value,
        emblem: renderEmblem(document.getElementById('nameContact').value),
        color: colorRandom(),
    };

    let saveContact = await saveData('contacts', newContact, postData);
    if (saveContact) {
        contacts.push(saveContact);
        sortContacts();
        await renderListContact();
        closeDialog();
        cleanContactControls();
        showDetails(saveContact.id, 'contact');
    }
}

/**
 * Edits an existing contact by retrieving the input values from the dialog, creating a new contact object,
 * saving it to the server, adding it to the contacts array, rendering the list of contacts, closing the dialog,
 * showing the details of the new contact, and cleaning the input fields.
 */
async function editContact(event, id) {
    event.preventDefault();
    let contactEdit = Object.assign(
        contacts.find((c) => c.id === id),
        {
            name: document.getElementById('nameContact').value,
            email: document.getElementById('emailContact').value,
            phone: document.getElementById('phoneContact').value,
            emblem: renderEmblem(document.getElementById('nameContact').value),
        }
    );

    let result = await saveData(
        `contacts/${contactEdit.id}`,
        contactEdit,
        putData
    );
    if (result) {
        sortContacts();
        await renderListContact();
        closeDialog();
        cleanContactControls();
        displayContactDetailsWithAnimation(contactEdit.id, 'contact');
    }
}

/**
 * Edits the current user's information.
 */
async function editProfile(event) {
    event.preventDefault();
    let updatedUser = {
        id: profile.id,
        username: document.getElementById('nameProfile').value,
        email: document.getElementById('emailProfile').value,
        phone: document.getElementById('phoneProfile').value,
        emblem: renderEmblem(document.getElementById('nameProfile').value),
    };

    let result = await saveData('user', updatedUser, putData);
    if (result) {
        sortContacts();
        await loggedUser();
        await renderListContact();
        closeDialog();
        displayContactDetailsWithAnimation(profile.id, 'profile');
    }
}

/**
 * Deletes the currently logged-in user from the server and redirects to the login page.
 */
async function deleteProfile(id) {
    if (id !== profile.id) return;
    try {
        await deleteData(`user`, true);
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Fehler beim Bearbeiten des Kontakts:', error.message);
    }
}

/**
 * Deletes a contact by removing it from the contacts array, clearing the details div,
 * deleting the contact from the server, and re-rendering the list of contacts.
 */
async function deleteContact(id) {
    let contact = contacts.find((c) => c.id === id);
    try {
        await deleteData(`contacts/${contact.id}`, true);
        let index = contacts.findIndex((c) => c.id === id);
        if (index !== -1) contacts.splice(index, 1);
        renderListContact();
    } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
        showError(error.message);
    }
    renderListContact();
    sortContacts();
    hideContactDetails();
    if (window.innerWidth <= 710) {
        backMobileContListe();
    }
}

/**
 * Generates an emblem based on the given name.
 */
function renderEmblem(name) {
    let aux = name.split(' ');
    let capital = '';
    for (let j = 0; j < aux.length; j++) {
        if (j <= 1) {
            capital += aux[j].slice(0, 1).toUpperCase();
        }
    }
    return capital;
}

/**
 * Displays the given error message on the webpage in the "divError" container.
 * The message is displayed until the function is called again with a different
 * error message.
 */
function showError(error) {
    let divError = document.getElementById('divError');
    divError.classList.remove('d-none');
    divError.innerHTML = `
      <p>${error}.</p>
  `;
}

/**
 * Generates a random color from the given array of colors.
 */
function colorRandom() {
    return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`;
}

/**
 * Sorts the contacts array alphabetically by name and groups them by the first letter.
 * Adds a property 'group' to each contact representing the first letter of their name.
 */
function sortContacts() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));
    contacts.forEach((contact) => {
        contact.group = contact.name.charAt(0).toUpperCase();
    });
}

/**
 * Displays contact details with animation if the contact ID is different from the last selected.
 * If the contact ID is the same as the last selected, it hides the contact details.
 */
function showDetails(id, type) {
    if (lastSelectedContactId === id) {
        hideContactDetails();
        return;
    }
    switchTitle(type);
    displayContactDetailsWithAnimation(id, type);
    lastSelectedContactId = id;
}

/**
 * Switches the title of the contact details header based on the type.
 */
function switchTitle(type) {
    let title = document.getElementById('contactDetailsTitle');
    if (type === 'profile') {
        title.innerHTML = 'User';
    } else if (type === 'contact') {
        title.innerHTML = 'Contacts';
    }
}

/**
 * Hides the contact details with animation and removes the selected class from all contacts.
 */
function hideContactDetails() {
    let dialog = document.getElementById('divDetails');
    dialog.classList.remove('move-left');
    dialog.classList.add('move-right');

    setTimeout(() => {
        dialog.classList.add('d-none');
        dialog.classList.remove('move-right');
        switchTitle('contact');
    }, 250);
    removeSelectedClassFromAllContacts();
    lastSelectedContactId = null;
}

/**
 * Displays the contact or profile details with a slide-in animation.
 * Removes the selected class from all contacts before displaying the new details.
 * Depending on the type, it displays either the profile or contact details
 * and adds a selected class to the current contact.
 */
function displayContactDetailsWithAnimation(id, type) {
    let dialog = document.getElementById('divDetails');
    dialog.classList.remove('d-none', 'move-right');
    dialog.offsetWidth;
    dialog.classList.add('move-left');

    removeSelectedClassFromAllContacts();

    if (profile.id == id && type == 'profile') {
        displayContactDetails(profile, type);
        addSelectedClassToCurrentContact(id, 'profile');
    } else if (type == 'contact') {
        let contact = contacts.find((c) => c.id === id);
        if (contact) {
            displayContactDetails(contact, type);
            addSelectedClassToCurrentContact(id, 'contact');
        }
    }
}

/**
 * Removes the 'contact-list-container-selected' class from all contact list containers.
 * This function ensures that no contact list container is marked as selected.
 */
function removeSelectedClassFromAllContacts() {
    let allContactContainers = document.querySelectorAll(
        '.contact-list-container'
    );
    for (let i = 0; i < allContactContainers.length; i++) {
        let container = allContactContainers[i];
        container.classList.remove('contact-list-container-selected');
    }
    let userContainer = document.getElementById('loggedUserContainer');
    userContainer.classList.remove('contact-list-container-selected');
}

/**
 * Adds the 'contact-list-container-selected' class to the currently selected contact.
 */
async function addSelectedClassToCurrentContact(id, type) {
    if (type === 'profile') {
        let userContainer = document.getElementById('loggedUserContainer');
        userContainer.classList.add('contact-list-container-selected');
    } else if (type === 'contact') {
        let contactListContainer = document.getElementById(`contact-${id}`);
        contactListContainer.classList.add('contact-list-container-selected');
    }
}

/**
 * Displays the details of a contact or profile.
 */
function displayContactDetails(detail, type) {
    let infoContact = document.getElementById('divDetails');
    infoContact.innerHTML = '';
    infoContact.classList.remove('move-left');
    infoContact.offsetWidth;
    infoContact.classList.add('move-left');

    infoContact.innerHTML += renderDetailsHTML(detail, type);
    mobileDetails();
}

/**
 * Generates actions based on the detail type.
 */
function getDetailActions(type, id) {
    if (type === 'profile') {
        return {
            edit: `openProfileDialog()`,
            delete: `deleteProfile(${id})`,
            infoTitle: 'Profile Information',
        };
    } else if (type === 'contact') {
        return {
            edit: `openEditContactDialog(${id})`,
            delete: `deleteContact(${id})`,
            infoTitle: 'Contact Information',
        };
    }
}

/**
 * Opens a dialog to add a new contact.
 */
function openAddContactDialog() {
    helpOpenDialog();
    setTimeout(() => {
        dialogContent.innerHTML = renderAddContactDialog();
        dialogContent.classList.add('move-left');
    }, 50);
}

/**
 * Opens a dialog to edit the user profile.
 */
function openProfileDialog() {
    helpOpenDialog();
    setTimeout(() => {
        dialogContent.innerHTML = renderProfileDialog(profile);
        dialogContent.classList.add('move-left');
    }, 50);
}

/**
 * Opens a dialog to edit an existing contact.
 */
function openEditContactDialog(id) {
    helpOpenDialog();
    let contact = contacts.find((c) => c.id === id);
    if (!contact) {
        console.error(`Contact with ID ${contactId} not found.`);
        return;
    }
    dialogContent.innerHTML = renderContactDialog(contact);
}

/**
 * Resets the dialog to its initial state and makes it visible.
 */
function helpOpenDialog() {
    let dialog = document.getElementById('dialog');
    let dialogContent = document.getElementById('dialogContent');
    dialogContent.classList.remove('move-left', 'move-right');
    dialogContent.innerHTML = '';
    dialog.classList.remove('d-none');
}

/**
 * Displays the details of a newly created contact.
 */
function showNewContactDetails(newContact) {
    closeDialog();
    cleanContactControls();
    renderListContact();
    displayNewContactDetails(newContact);
    document.getElementById('contactCreated').classList.remove('d-none');
    contactCreatedDiv();
}

/**
 * Displays the details of a newly created contact.
 * Iterates over the contacts array and finds the index of the newly created contact.
 * Clears the innerHTML of the contact details div, removes the 'move-left' class,
 * renders the contact using renderDetailsHTML and adds the rendered HTML to the div,
 * and calls the mobileDetails function.
 */
function displayNewContactDetails(newContact) {
    for (let i = 0; i < contacts.length; i++) {
        if (newContact.name == contacts[i].name) {
            let infoContact = document.getElementById('divDetails');
            infoContact.innerHTML = ' ';
            infoContact.classList.remove('move-left');
            infoContact.innerHTML += renderDetailsHTML(i);
            mobileDetails();
        }
    }
}

/**
 * Sets a timeout to hide the 'contactCreated' element after 2400 milliseconds.
 */
function contactCreatedDiv() {
    setTimeout(() => {
        document.getElementById('contactCreated').classList.add('d-none');
    }, 2400);
}

/**
 * Clears the values of the 'nameContact', 'emailContact', and 'phoneContact' input fields.
 */
function cleanContactControls() {
    document.getElementById('nameContact').value = '';
    document.getElementById('emailContact').value = '';
    document.getElementById('phoneContact').value = '';
}

let mobilWindow = window.matchMedia('(max-width:710px)');
mobilWindow.addEventListener('change', () => myFunc());

/**
 * Function to handle mobile window changes and adjust contact details display accordingly.
 */
function myFunc() {
    if (mobilWindow.matches) {
        document.getElementById('divContactDetails').style.display = 'none';
        document.getElementById('divContactList').style.display = 'flex';
    } else {
        document.getElementById('divContactDetails').style.display = 'flex';
        document.getElementById('divContactList').style.display = 'flex';
        let amobileDiv = document.getElementById('amobile_nameContact');
        if (amobileDiv != null) {
            amobileDiv.style.display = 'none';
        }
    }
}

/**
 * Toggles the display of the contact details and contact list based on the window width.
 * If the window width is less than or equal to 710 pixels, the contact details are displayed and the contact list is hidden.
 * The 'move-left' class is removed from the 'divDetails' element.
 */
function mobileDetails() {
    outWidth = window.innerWidth;
    if (outWidth <= 710) {
        document.getElementById('divContactDetails').style.display = 'flex';
        document.getElementById('divContactList').style.display = 'none';
        document.getElementById('divDetails').classList.remove('move-left');
    }
}

/**
 * Hides the contact details and displays the contact list when the window width is less than or equal to 710 pixels.
 */
function backMobileContListe() {
    outWidth = window.innerWidth;
    if (outWidth <= 710) {
        document.getElementById('divContactDetails').style.display = 'none';
        document.getElementById('divContactList').style.display = 'flex';
    }
}

/**
 * Toggles the active state and dropdown menu of the mobile contact button.
 * @param {HTMLElement} button - The button triggering the dropdown toggle.
 */
function toggleActive(button) {
    let mobileMode = document.getElementById('amobile_nameContact');
    if (!mobileMode) return;
    button.classList.toggle('active');
    mobileMode.style.display = button.classList.contains('active')
        ? 'flex'
        : 'none';

    function handleOutsideClick(event) {
        if (
            !button.contains(event.target) &&
            !mobileMode.contains(event.target)
        ) {
            button.classList.remove('active');
            mobileMode.style.display = 'none';
            document.removeEventListener('click', handleOutsideClick);
        }
    }
    if (button.classList.contains('active')) {
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
        }, 0);
    } else {
        document.removeEventListener('click', handleOutsideClick);
    }
}

/**
 * Closes a dialog with an animation.
 * The dialog is closed by adding the 'move-right' class to the dialog content,
 * and then 250ms later, the 'd-none' class is added to the dialog to hide it,
 * and the 'move-right' class is removed from the dialog content.
 */
function closeDialog() {
    let dialog = document.getElementById('dialog');
    let dialogContent = document.getElementById('dialogContent');

    dialogContent.classList.remove('move-left', 'move-right');
    dialogContent.offsetWidth;
    dialogContent.classList.add('move-right');

    setTimeout(() => {
        dialog.classList.add('d-none');
        dialogContent.innerHTML = '';
    }, 250);
}
