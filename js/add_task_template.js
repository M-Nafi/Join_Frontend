/**
 * Renders users based on the users array.
 *
 * @return {void} This function does not return a value.
 */
function renderUsersHTML(user, i) {
  return /*html*/ `
        <label for="checkbox${i}">
            <li class="contact-list" id="contactList${i}">        
                <div tabindex="0" class="emblem" style="background-color: ${user.color}">
                  ${user.emblem}
                </div> 
                <div class="contact-name" >${user.username}</div> 
                <input class="user-checkbox" onclick="showUsersEmblem()" type="checkbox" id="checkbox${i}" data-userid="${user.id}">          
            </li>
        </label> `;
}

/**
 * Renders an emblem HTML element with the given contact information.
 * @param {Object} contact - The contact information for the emblem.
 * @param {string} contact.color - The background color of the emblem.
 * @param {string} contact.userId - The ID of the user associated with the emblem.
 * @param {string} contact.emblem - The emblem icon to be displayed.
 * @return {string} The HTML string representing the emblem.
 */
function renderEmblemUsers(user) {
  return /*html*/ `
        <div class="emblem" style="background-color: ${user.color}" id="${user.id}">
        ${user.emblem}
      </div>  `;
}

/**
 * Renders the category HTML elements based on the index.
 *
 * @param {number} i - The index of the category to render
 * @return {string} The HTML string representing the category element
 */
function renderCategorysHTML(i) {
  return /*html*/ `
            <li class="contact-list">
                  <span for="">
                      <div class="category-list" tabindex="0" onclick="selectCategory(event, ${i})">
                        ${categorys[i]}
                      </div>
                  </span>
              </li>
          `;
}

/**
 * Renders a grey emblem HTML element with the given extra count.
 *
 * @param {number} extraCount - The count to be displayed in the emblem.
 * @return {string} The HTML string representing the grey emblem.
 */
function renderGreyEmblem(extraCount) {
  return `<div class="grey-emblem">+${extraCount}</div>`;
}

/**
 * Renders a grey emblem HTML element with the given remaining count.
 *
 * @param {number} remainingCount - The count to be displayed in the emblem.
 * @return {string} The HTML string representing the grey emblem.
 */
function renderGreyEmblem(remainingCount) {
  return `<div class="grey-emblem">+${remainingCount}</div>`;
}

/**
 * Renders the HTML for a subtask list item.
 *
 * @param {number} i - The index of the subtask in the list.
 * @return {string} The HTML string representing the subtask list item.
 */
function renderSubtaskHTML(i) {
  return /*html*/ `
      <div class="subtask-list" id="mainSubtask-container${i}">
              <input
                readonly
                type="text"
                id="subtaskList${i}"
                value="${subtaskList[i].subtasktext}"
                />
                <div class="edit-images" id="edit-images${i}">
                  <img onclick="editSubtask(${i})" id="editSubtask${i}" src="../assets/icons/edit_contacts_icon.svg" alt="">
                  <div class="edit-seperator"></div>
                  <img onclick="deleteSubtask(${i})" id="deleteSubtask${i}" src="../assets/icons/delete_contact_icon.svg" alt="">
                </div>
              </div>
          </div>`;
}

/**
 * Returns an HTML string for an edit subtask element with a delete and check button.
 *
 * @param {number} i - The index of the subtask.
 * @return {string} The HTML string for the edit subtask element.
 */
function editSubtaskHTML(i) {
  return /*html*/ `
      <img onclick="deleteSubtask(${i})" id="deleteSubtask${i}" src="../assets/icons/delete_contact_icon.svg" alt="">
      <div class="edit-seperator"></div>
      <img  onclick="checkSubtask(${i})" id="checkSubtask${i}" src="../assets/icons/check.svg" alt="">
    `;
}

/**
 * Returns an HTML string for an edit subtask element with delete and edit buttons.
 *
 * @param {number} i - The index of the subtask.
 * @return {string} The HTML string for the edit subtask element.
 */
function checkSubtaskHTML(i) {
  return /*html*/ `
      <img onclick="editSubtask(${i})" id="editSubtask${i}" src="../assets/icons/edit_contacts_icon.svg" alt="">
      <div class="edit-seperator"></div>
      <img onclick="deleteSubtask(${i})" id="deleteSubtask${i}" src="../assets/icons/delete_contact_icon.svg" alt="">
    `;
}
