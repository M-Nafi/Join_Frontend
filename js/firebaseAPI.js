const BASE_URL = "http://127.0.0.1:8000/api/";

/**
 * Asynchronously loads data from a specified path using the Firebase Realtime Database API.
 * @param {string} [path=''] - The path to the data in the Firebase Realtime Database. Defaults to an empty string.
 * @return {Promise<Object>} - A promise that resolves to the parsed JSON response from the Firebase Realtime Database.
 */
async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + "/");
  return await response.json();
}

/**
 * Asynchronously posts data to a specified path using the Firebase Realtime Database API.
 * @param {string} [path=''] - The path to the data in the Firebase Realtime Database. Defaults to an empty string.
 * @param {Object} [data={}] - The data to be posted. Defaults to an empty object.
 * @return {Promise<Object>} - A promise that resolves to the parsed JSON response from the Firebase Realtime Database.
 */
async function postData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + "/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

/**
 * Deletes data from the server at the specified path.
 * @param {string} path - the path to the data to be deleted
 * @return {Promise} a Promise that resolves to the JSON response from the server
 */
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + "/", {
    method: "DELETE"
  });
  if (response.status === 204) {
    return;
  }
  if (!response.ok) {
    throw new Error(
      `Fehler beim Löschen: ${response.status} ${response.statusText}`
    );
  }
}

/**
 * Updates data at the specified path using the Firebase Realtime Database API.
 * @param {string} [path=''] - The path to the data in the Firebase Realtime Database. Defaults to an empty string.
 * @param {Object} [data={}] - The data to be updated. Defaults to an empty object.
 * @return {Promise<Object>} - A promise that resolves to the parsed JSON response from the Firebase Realtime Database.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + "/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

/**
 * Updates data at the specified path using the Firebase Realtime Database API.
 * @param {string} [path=''] - The path to the data in the Firebase Realtime Database. Defaults to an empty string.
 * @param {Object} [data={}] - The data to be updated. Defaults to an empty object.
 * @return {Promise<Object>} - A promise that resolves to the parsed JSON response from the Firebase Realtime Database.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + "/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

/**
 * Partially updates data at the specified path using the Firebase Realtime Database API.
 * @param {string} [path=''] - The path to the data in the Firebase Realtime Database. Defaults to an empty string.
 * @param {Object} [data={}] - The data to be partially updated. Defaults to an empty object.
 * @return {Promise<Object>} - A promise that resolves to the parsed JSON response from the Firebase Realtime Database.
 */
async function patchData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + "/", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return await response.json();
}

