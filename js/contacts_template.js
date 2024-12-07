/**
 * Renders the contact list on the webpage by populating the contentList element with
 * the contact information. The contacts are sorted alphabetically before rendering.
 * The function iterates through the contacts array and creates HTML elements for each contact.
 * If the contact's name starts with a different letter than the previous contact, a new
 * div element is created with the first letter of the contact's name in uppercase.
 * The contact's name, email, and emblem are displayed in the contact list container div.
 * @return {void} This function does not return anything.
 */
function renderListContact() {
  let contentList = document.getElementById('divList');
  contentList.innerHTML = '';
  sortContacts();
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (
      i == 0 ||
      contact['name'].slice(0, 1) != contacts[i - 1]['name'].slice(0, 1)
    ) {
      contentList.innerHTML += `<div class="a-z-contact-list ">${contact['name']
        .slice(0, 1)
        .toUpperCase()}</div>`;
    }
    contentList.innerHTML += /*html*/ `
      <div id="contactListContainer${i}" class="contact-list-container" onclick="showDetailContact(${i})">
      <div class="contact-emblem" style="background-color: ${
        contact['color']
      }"> ${renderEmblem(contact['name'])} </div>
      <div class="contact-info-container">
          <p>${contact['name']}</p>
          <a>${contact['email']}</a>
      </div>
      </div>
      `;
  }
}

/**
 * Renders a contact in a list format.
 * @param {number} i - The index of the contact in the contacts array.
 * @return {string} The HTML string representing the contact in a list format.
 */
function renderContactinList(i) {
  return /*html*/ `
    <div class="headline-contact">
        <div class="emblem-info" id="emblem" style="background-color: ${contacts[i]['color']}">${contacts[i]['emblem']}</div>
        <div class="name-contact">
            ${contacts[i]['name']}
          <div class="a-name-contact" id="a_nameContact">
              <a class="dflex-align-center" onclick="openDialog(false, ${i})"><img class="img-btns" src="../assets/icons/edit-contacts_icon.svg"> Edit</a>
              <a class="dflex-align-center" onclick="deleteContact(${i})"><img class="img-btns" src="../assets/icons/delete_contact_icon.svg"> Delete</a>
          </div>
        </div>
    </div>
    <div class="info">Contact Information</div>
    <div class="contact-information">
      <div><b>Email</b></div>
      <a id="email_contact">${contacts[i]['email']}</a>
      <div><b>Phone</b></div>
      <div id="phone_contact">${contacts[i]['phone']}</div> 
    
      <div class="mobile-contact" onclick="openMobileDialog()"><img class="arrow" src="..//assets/icons/menu_ContactOptions.svg" />
        <div class="mobile-dropdown-menu" id="amobile_nameContact" style="display:none">
          <a class="dflex-align-center" onclick="openDialog(false, ${i})"><img class="img-btns" src="../assets/icons/edit-contacts_icon.svg"> Edit</a>
          <a class="dflex-align-center" onclick="deleteContact( ${i})"><img class="img-btns" src="../assets/icons/delete_contact_icon.svg"> Delete</a>
        </div>
      </div>
    </div> `;
}

/**
 * Renders a contact dialog with the given title, function, and button text.
 * @param {string} title1 - The title of the contact dialog.
 * @param {function} functionNew - The function to be called when the form is submitted.
 * @param {string} btnText - The text of the submit button.
 * @return {string} The HTML string representing the contact dialog.
 */
function renderContactDialog(title1, functionNew, btnText) {
  return /*html*/ `
  <div class="dialog">
  <div class="join-add-contact">
  <button class="button-mobile-close" onclick="closeDialog()"><img class="imgBtns"
  src="../assets/icons/closeWhite_icon.svg"></button>
    <img class="icon-join-contact" src="../assets/icons/joinWhite.svg">
    <div class="contact-details-title">${title1}</div>
    <div id="textAdd" class="add-text">Task are better with a team</div>
    <div class="seperator-add"></div>
  </div>
  <div class="edit-icon" id="iconContact"><img src="../assets/icons/person_icon.svg">
  </div>
  <div class="form-edit-style">
    <button class="button-close" onclick="closeDialog()"><img class="button-images "
        src="../assets/icons/cancel.svg"></button>
    <form class="add-contact-form" onsubmit=${functionNew}>
      <div class="group-contact-input">
        <input class="inputs-contact inputfield-text-style" type="text" id="nameContact"
          style="background-image: url(../assets/icons/personInput_icon.svg)" placeholder="Name" required/>
        <input class="inputs-contact inputfield-text-style" type="email" id="emailContact"
          style="background-image: url(../assets/icons/mail_icon.svg)" placeholder="Email" required/>
        <input class="inputs-contact inputfield-text-style" pattern="[0-9+ ]{6,20}" type="tel" id="phoneContact"
          style="background-image: url(../assets/icons/call_icon.svg)" placeholder="Phone" required/>
        <div class="form-button">
          <button class="button-guest inputfield-text-style" type="button" onclick="closeDialog()">Delete</button>
          <button class="add-contact-button-mobile button-text-style" type="submit">${btnText} <img class="button-images " src="../assets/icons/checkWhite.svg"></button>
        </div>
      </div>
    </form>
  </div>  
  </div>`;
}
