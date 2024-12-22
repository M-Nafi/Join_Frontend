/**
 * Renders the HTML for adding a task to a board.
 * @param {string} boardStatus - The status of the board.
 * @return {string} The HTML code for adding a task to a board.
 */
function renderBoardAddTaskHTML(boardStatus) {
  return /*html*/ `

  <div id="addTaskMainContainer" class="add-task-main-container" onclick="dontCloseTask(event)">
  <div id="taskAddedToBoard" class="task-added-to-board dnone">
    <div class="task-added-to-board-style">
      <span>Task added to board</span>
      <img src="../assets/icons/board.svg" alt="">
    </div>
  </div>
  <div class="task-top">
      <h1 class="headline-task">Add Task</h1>
        <img
        class="close-board"
        onclick="closeAddTaskBoard()"
        src="../assets/icons/close_icon.svg"
        alt="schließen"
        />
    </div>
  <form class="add-task-container" onsubmit="createNewTaskBoard('${boardStatus}',event); return false;">
    <div class="group-task1-input">
      <span>Title<span class="required-color">*</span></span>
      <input id="title" type="text" required />
      <span>Description</span>
      <textarea name="" id="description" cols="30" rows="5"></textarea>
      <span>Assigned to</span>
      <div onclick="showUsers(event)" class="contact-container">
        <span>Select user to assign</span>
        <img id="arrowDownUser" src="../assets/icons/arrow_down_icon.svg" alt="">
        <img id="arrowUpUser" src="../assets/icons/arrow_up_icon.svg" style="display: none;">
        <ul id="users" class="users"></ul>
      </div>
      <div id="usersEmblem" class="users-emblem"></div>
      <div>
        <p class="required-field-text">
          <span class="required-color">*</span>This field is required
        </p>
      </div>
    </div>
    <div class="board-addtask-seperator"></div>
    <div class="group-task2-input">
      <span>Due date<span class="required-color">*</span></span>
      <input id="date" type="date" required />
      <span>Prio</span>
      <div class="prio-container">
        <div class="prioBtn" id="urgentPrio" onclick="togglePriority('urgent')">
          Urgent
          <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z"
              fill="#FF3D00" />
            <path
              d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z"
              fill="#FF3D00" />
          </svg>
        </div>
        <div class="prioBtn midBtn-Color" id="mediumPrio"  onclick="togglePriority('medium')">
          Medium
          <svg width="21" height="8" viewBox="0 0 21 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z"
              fill="white" />
            <path
              d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z"
              fill="white" />
          </svg>
        </div>
        <div class="prioBtn" id="lowPrio" onclick="togglePriority('low')">
          Low
          <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z"
              fill="#7AE229" />
            <path
              d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z"
              fill="#7AE229" />
          </svg>
        </div>
      </div>
      <span>Category<span class="required-color">*</span></span>
      <div onclick="showCategories()" class="contact-container" id="selectedCategoryContainer">
        <span id="selectedCategory">Select task category</span >
        <img id="arrowDownCategory" src="../assets/icons/arrow_down_icon.svg" alt="">
        <img id="arrowUpCategory" src="../assets/icons/arrow_up_icon.svg" style="display: none;">
        <ul id="boardTasks" class="tasks"></ul>
        <span id="categoryErrorMessage" class="categoryErrorMessage"></span> 
      </div>      
      <span class="subtask-label">Subtask</span>
        <div class="subtask-container" id="subtaskContainer">
          <input
            type="text"
            id="subtaskInput"
            placeholder="Add new subtask"
            onclick="changeButtonsSubtask()"
          />
          <div class="subtask-right">
            <div id="subtask-right-add" class="subtask-right-add dnone">
              <img
                onclick="removeSubtask()"
                src="../assets/icons/cancel.svg"
                alt=""
              />
              <div class="subtask-right-seperator"></div>
              <img
                onclick="addSubtask()"
                src="../assets/icons/check.svg"
                alt=""
              />
            </div>
            <div id="subtask-right-regular" class="subtask-right-regular">
              <img
                onclick="changeButtonsSubtask()"
                src="../assets/icons/add.svg"
                alt=""
              />
            </div>
          </div>
        </div>
        <div id="subtask" class="subtask"></div>
        <div type="submit" class="addtask-button-container">
          <button formnovalidate class="clear-button" onclick="clearAllTasks(event)">
            Clear
            <img class="icon-cancel-svg" src="../assets/icons/cancel.svg">
          </button>
          <button class="task-button">
            Create Task
            <img src="..//assets/icons/checkWhite.svg">
          </button>
        </div>
        </div>
      </div>
  </form>
</div>
  `;
}

/**
 * Renders the HTML for a user in the contact list.
 * @param {Object} user - The user object containing the user's information.
 * @param {number} i - The index of the user in the list.
 * @return {string} The HTML string representing the user in the contact list.
 */
function renderUsersHTML(user, i) {
  return /*html*/ `
      <label for="checkbox${i}">
          <li class="contactlist" id="contactList${i}">        
              <div tabindex="0" class="emblem" style="background-color: ${user.color}">
                ${user.emblem}
              </div> 
              <div class="contact-name" >${user.username}</div> 
              <input class="user-checkbox" onclick="showUsersEmblem()" type="checkbox" id="checkbox${i}" data-userid="${user.id}">          
          </li>
      </label>
        `;
}

/**
 * Renders the HTML for a category in the category list.
 * @param {number} i - The index of the category in the list.
 * @return {string} The HTML string representing the category in the category list.
 */
function renderCategorysHTML(i) {
  return /*html*/ `
          <li class="contactlist">
              <span for="">
                <div class="categorylist" tabindex="0" onclick="selectCategory(event,${i})">
                  ${categorys[i]}
                </div>
              </span>
          </li>`;
}

/**
 * Renders a grey emblem with the specified extra count.
 * @param {number} extraCount - The additional count to display on the emblem.
 * @return {string} The HTML for the grey emblem with the extra count.
 */
function renderGreyEmblem(extraCount) {
  return `<div class="grey-emblem">+${extraCount}</div>`;
}

/**
 * Renders a grey emblem with the specified remaining count.
 *
 * @param {number} remainingCount - The remaining count to display on the emblem.
 * @return {string} The HTML for the grey emblem with the remaining count.
 */
function renderGreyEmblem(remainingCount) {
  return `<div class="grey-emblem">+${remainingCount}</div>`;
}

/**
 * Renders an emblem for a given contact.
 * @param {Object} contact - The contact object containing color, emblem, and userId properties.
 * @return {string} The HTML string representing the emblem.
 */
function renderEmblemUsers(contact) {
  return /*html*/ `
      <div class="emblem" style="background-color: ${contact.color}" id="${contact.id}">
      ${contact.emblem}
    </div>  `;
}

/**
 * Renders a subtask HTML element with the given index.
 * @param {number} i - The index of the subtask.
 * @return {string} The HTML string representing the subtask element.
 */
function renderSubtaskHTML(i) {
  return /*html*/ `
    <div class="subtasklist" id="mainSubtask-container${i}">
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
        </div> `;
}

/**
 * Returns an HTML string representing the edit subtask image elements with the given index.
 * @param {number} i - The index of the subtask.
 * @return {string} The HTML string representing the edit subtask image elements.
 */
function editSubtaskHTML(i) {
  return /*html*/ `
    <img onclick="deleteSubtask(${i})" id="deleteSubtask${i}" src="../assets/icons/delete_contact_icon.svg" alt="">
    <div class="edit-seperator"></div>
    <img  onclick="checkSubtask(${i})" id="checkSubtask${i}" src="../assets/icons/check.svg" alt="">
  `;
}

/**
 * Generates HTML elements for editing a subtask.
 * @param {number} i - The index of the subtask.
 * @return {string} The HTML elements for editing a subtask.
 */
function checkSubtaskHTML(i) {
  return /*html*/ `
    <img onclick="editSubtask(${i})" id="editSubtask${i}" src="../assets/icons/edit_contacts_icon.svg" alt="">
    <div class="edit-seperator"></div>
    <img onclick="deleteSubtask(${i})" id="deleteSubtask${i}" src="../assets/icons/delete_contact_icon.svg" alt="">
  `;
}
