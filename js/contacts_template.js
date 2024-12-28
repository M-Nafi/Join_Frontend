/**
 * Renders a contact list item.
 * @param {object} contact - The contact object to render.
 * @return {string} The HTML string representing the contact list item.
 */
function renderListContactHTML(contact, isCurrentUser = false) {
  return /*html*/ `
    <div id="contact-${contact.id}" class="contact-list-container ${
    isCurrentUser ? "current-user" : ""
  }" onclick="showDetailContact(${contact.id})">
      <div class="contact-emblem" style="background-color: ${contact.color}">
        ${renderEmblem(contact.name)}
      </div>
      <div class="contact-info-container">
        <p>${contact.name}</p>
        <a>${contact.email}</a>
      </div>
    </div>
  `;
}

/**
 * Renders the HTML for the user container, which displays the user's emblem and name.
 * @param {object} user - The user object containing the user's information.
 * @return {string} The HTML string representing the user container.
 */
function renderUserContainerHTML(profile) {
  return /*html*/ `
    <div class="logged-user" onclick="showDetailContact(${profile})">
      <div class="contact-emblem" style="background-color: ${profile.color}">
        ${profile.emblem}
      </div>
      <div class="user-name">
        <p class="current-user-text">Current User</p>
        <p>${profile.username}</p>
      </div>
    </div>
  `;
}

/**
 * Renders detailed view of a contact.
 * @param {object} contact - Das Kontaktobjekt.
 * @return {string} Das HTML f端r die Detailansicht.
 */
function renderContactinList(contact) {
  return /*html*/ `
    <div class="headline-contact">
      <div class="emblem-info-container">
        <div class="emblem-container">
          <div class="emblem-info" id="emblem" style="background-color: 
            ${contact.color}">${contact.emblem}
          </div>
          <div class="name-contact">
            <p id="name_contact">${contact.name || contact.username}</p>
            <div class="a-name-contact" id="a_nameContact">
              <a class="dflex-align-center" onclick="openDialog('edit', ${contacts.indexOf(contact)})">
                <img class="img-btns" src="../assets/icons/edit-contacts_icon.svg"> Edit
              </a>
              <a class="dflex-align-center" onclick="deleteContact(${contacts.indexOf(contact)})">
                <img class="img-btns" src="../assets/icons/delete_contact_icon.svg"> Delete
              </a>
            </div>
          </div>
        </div>
      <div class="mobile-contact">
        <div class="three-dots-button" onclick="toggleActive(this)">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <div class="mobile-dropdown-menu" id="amobile_nameContact" style="display:none">
          <a class="dflex-align-center" onclick="openDialog('edit', ${contacts.indexOf(contact)})">
          <img class="img-btns" src="../assets/icons/edit-contacts_icon.svg"> Edit</a>
          <a class="dflex-align-center" onclick="deleteContact(${contacts.indexOf(contact)})">
          <img class="img-btns" src="../assets/icons/delete_contact_icon.svg"> Delete</a>
        </div>
      </div>
    </div>
    <div class="info">Contact Information</div>
      <div class="contact-information">
        <div><b>Email</b></div>
        <a id="email_contact">${contact.email}</a>
        <div><b>Phone</b></div>
        <div id="phone_contact">${contact.phone}</div>
      </div>
  `;
}

/**
 * Renders a contact dialog for adding or editing a contact.
 * @param {string} mode - 'add' oder 'edit'.
 * @param {object} [contact] - Das Kontaktobjekt (nur f端r 'edit' Modus).
 * @param {number} [index] - Der Index des Kontakts (nur f端r 'edit' Modus).
 * @return {string} Das HTML f端r den Dialog.
 */
function renderContactDialog(mode, contact = {}, index = null) {
  const isEditMode = mode === "edit";
  const title = isEditMode ? "Edit Contact" : "Add Contact";
  const submitHandler = isEditMode
    ? `editContact(event, ${index})`
    : "newContact(event)";

  return /*html*/ `
  <div class="dialog">
    <div class="join-add-contact">
      <button class="button-mobile-close" onclick="closeDialog()">
        <img class="imgBtns" src="../assets/icons/closeWhite_icon.svg">
      </button>
      <img class="icon-join-contact" src="../assets/icons/joinWhite.svg">
      <div class="contact-details-title">${title}</div>
      <div id="textAdd" class="add-text">Tasks are better with a team</div>
      <div class="seperator-add"></div>
    </div>
    <div class="edit-icon" id="iconContact"><img src="../assets/icons/person_icon.svg"></div>
    <div class="form-edit-style">
      <form class="add-contact-form" onsubmit="${submitHandler}">
        <div class="group-contact-input">
          <input class="inputs-contact inputfield-text-style" type="text" id="nameContact"
            placeholder="Name" value="${contact.name || ""}" required/>
          <input class="inputs-contact inputfield-text-style" type="email" id="emailContact"
            placeholder="Email" value="${contact.email || ""}" required/>
          <input class="inputs-contact inputfield-text-style" type="tel" id="phoneContact"
            placeholder="Phone" value="${contact.phone || ""}" required/>
          <div class="form-button">
            <button class="button-guest button-text-style" type="button" onclick="closeDialog()">Cancel</button>
            <button class="add-contact-button-mobile button-text-style" type="submit">
              ${isEditMode ? "Save" : "Create"}
              <img class="button-images" src="../assets/icons/checkWhite.svg">
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>`;
}