/**
 * Renders a contact list item.
 */
function renderListContactHTML(contact, i) {
    return /*html*/ `
    <div id="contact-${contact.id}" class="contact-list-container ${i}" onclick="showDetails(${contact.id}, 'contact')">
      <div class="contact-emblem" style="background-color: ${contact.color}">
        ${contact.emblem}
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
 */
function renderUserContainerHTML(profile) {
    return /*html*/ `
    <div class="logged-user" onclick="showDetails(${profile.id}, 'profile')">
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
 * Renders the details of a contact or profile.
 */
function renderDetailsHTML(detail, type) {
    let actions = getDetailActions(type, detail.id);

    return /*html*/ `
    <div class="headline-contact">
      <div class="emblem-info-container">
        <div class="emblem-container">
          <div class="emblem-info" id="emblem" style="background-color: ${
              detail.color
          }">
            ${detail.emblem}
          </div>
          <div class="name-contact">
            <p id="name_contact">${detail.name || detail.username}</p>
            <div class="a-name-contact" id="a_nameContact">
              <a class="dflex-align-center" onclick="${actions.edit}">
                <img class="img-btns" src="../assets/icons/edit-contacts_icon.svg"> Edit
              </a>
              <a class="dflex-align-center" onclick="${actions.delete}">
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
            <a class="dflex-align-center" onclick="${actions.edit}">
              <img class="img-btns" src="../assets/icons/edit-contacts_icon.svg"> Edit
            </a>
            <a class="dflex-align-center" onclick="${actions.delete}">
              <img class="img-btns" src="../assets/icons/delete_contact_icon.svg"> Delete
            </a>
          </div>
        </div>
      </div>
      <div class="info">${actions.infoTitle}</div>
      <div class="contact-information">
        <div><b>Email</b></div>
        <a id="email_contact">${detail.email}</a>
        <div><b>Phone</b></div>
        <div id="phone_contact">${detail.phone}</div>
      </div>
    </div>
  `;
}

/**
 * Renders a dialog for editing the user profile.
 */
function renderProfileDialog(profile) {
    return /*html*/ `
    <div class="dialog">
      <div class="join-add-contact">
        <button class="button-mobile-close" onclick="closeDialog()">
          <img class="imgBtns" src="../assets/icons/closeWhite_icon.svg">
        </button>
        <img class="icon-join-contact" src="../assets/icons/joinWhite.svg">
        <div class="contact-details-title">Edit User Profile</div>
        <div id="textAdd" class="add-text">Update your personal information</div>
        <div class="seperator-add"></div>
      </div>
      <div class="emblem-info emblem-edit" id="emblem" style="background-color: ${profile.color}">
        ${profile.emblem}
      </div>
      <div class="form-edit-style">
        <form class="add-contact-form" onsubmit="editProfile(event, ${profile.id})">
          <div class="group-contact-input">
            <div class="inputs">
              <input value="${profile.username}" type="text" id="nameProfile" placeholder="Name" required />
              <img src="../assets/icons/personInput_icon.svg">
            </div>
            <div class="inputs">
              <input value="${profile.email}" type="email" id="emailProfile" placeholder="Email" required />
              <img src="../assets/icons/mail_icon.svg">
            </div>
            <div class="inputs">
              <input value="${profile.phone}" type="tel" id="phoneProfile" placeholder="Phone" required />
              <img src="../assets/icons/call_icon.svg">
            </div>
            <div id="errorMessage" class="error-message d-none"></div>
            <div class="form-button">
              <button class="button-guest button-text-style" type="button" onclick="closeDialog()">Cancel</button>
              <button class="add-contact-button-mobile button-text-style" type="submit">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>`;
}

/**
 * Renders a contact dialog for adding or editing a contact.
 */
function renderContactDialog(contact) {
    return /*html*/ `
    <div class="dialog">
      <div class="join-add-contact">
        <button class="button-mobile-close" onclick="closeDialog()">
          <img class="imgBtns" src="../assets/icons/closeWhite_icon.svg">
        </button>
        <img class="icon-join-contact" src="../assets/icons/joinWhite.svg">
        <div class="contact-details-title">Edit Contact</div>
        <div id="textAdd" class="add-text">Update personal information</div>
        <div class="seperator-add"></div>
      </div>
      <div class="emblem-info emblem-edit" id="emblem" style="background-color: ${contact.color}">
        ${contact.emblem}
      </div>
      <div class="form-edit-style">
        <form class="add-contact-form" onsubmit="editContact(event, ${contact.id})">
          <div class="group-contact-input">
            <div class="inputs">
              <input value="${contact.name}" type="text" id="nameContact" placeholder="Name" required />
              <img src="../assets/icons/personInput_icon.svg">
            </div>
            <div class="inputs">
              <input value="${contact.email}" type="email" id="emailContact" placeholder="Email" required />
              <img src="../assets/icons/mail_icon.svg">
            </div>
            <div class="inputs">
              <input value="${contact.phone}" type="tel" id="phoneContact" placeholder="Phone" required />
              <img src="../assets/icons/call_icon.svg">
            </div>
            <div id="errorMessage" class="error-message d-none"></div>
            <div class="form-button">
              <button class="button-guest button-text-style" type="button" onclick="closeDialog()">Cancel</button>
              <button class="add-contact-button-mobile button-text-style" type="submit">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>`;
}

/**
 * Renders a dialog for adding a new contact.
 * The dialog includes input fields for the contact's name, email, and phone number,
 * as well as buttons to cancel or submit the form.
 */
function renderAddContactDialog() {
    return /*html*/ `
    <div class="dialog">
      <div class="join-add-contact">
        <button class="button-mobile-close" onclick="closeDialog()">
          <img class="imgBtns" src="../assets/icons/closeWhite_icon.svg">
        </button>
        <img class="icon-join-contact" src="../assets/icons/joinWhite.svg">
        <div class="contact-details-title">Contact</div>
        <div id="textAdd" class="add-text">Add a new Contact</div>
        <div class="seperator-add"></div>
      </div>
      <div class="emblem-person">
        <img class="emblem-icon" src="../assets/icons/person_icon.svg">
      </div>
      <div class="form-edit-style">
        <form class="add-contact-form" onsubmit="newContact(event)">
          <div class="group-contact-input">
            <div class="inputs">
              <input type="text" id="nameContact" placeholder="Name" required />
              <img src="../assets/icons/personInput_icon.svg">
            </div>
            <div class="inputs">
              <input type="email" id="emailContact" placeholder="Email" required />
              <img src="../assets/icons/mail_icon.svg">
            </div>
            <div class="inputs">
              <input type="tel" id="phoneContact" placeholder="Phone" required />
              <img src="../assets/icons/call_icon.svg">
            </div>
            <div id="errorMessage" class="error-message d-none"></div>
            <div class="form-button">
              <button class="button-guest button-text-style" type="button" onclick="closeDialog()">Cancel</button>
              <button class="add-contact-button-mobile button-text-style" type="submit">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>`;
}
