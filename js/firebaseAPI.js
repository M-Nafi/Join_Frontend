const BASE_URL = "http://127.0.0.1:8000/api/auth/";

/**
 * Returns the headers for a request, optionally including the token.
 * @param {boolean} includeToken - Whether to include the authorization token.
 * @return {Object} - Headers object for the request.
 */
function getHeaders(includeToken = false) {
  const headers = { "Content-Type": "application/json" };

  if (includeToken) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      throw new Error("Token nicht vorhanden. Anmeldung erforderlich.");
    }
    headers["Authorization"] = `Token ${token}`;
  }

  return headers;
}

/**
 * Asynchronously loads data from a specified path using the Firebase Realtime Database API.
 * @param {string} [path=''] - The path to the data in the Firebase Realtime Database. Defaults to an empty string.
 * @return {Promise<Object>} - A promise that resolves to the parsed JSON response from the Firebase Realtime Database.
 */
async function loadData(path = "") {
  let response = await fetch(BASE_URL + path + "/", {
    method: "GET",
    headers: getHeaders(true),
  });
    
  return await response.json();
}

/**
 * Asynchronously posts data to a specified path using the Firebase Realtime Database API.
 * @param {string} [path=''] - The path to the data in the Firebase Realtime Database. Defaults to an empty string.
 * @param {Object} [data={}] - The data to be posted. Defaults to an empty object.
 * @return {Promise<Object>} - A promise that resolves to the parsed JSON response from the Firebase Realtime Database.
 */
async function postData(path = "", data = {}, includeToken= {}) {
  let response = await fetch(BASE_URL + path + "/", {
    method: "POST",
    headers: getHeaders(includeToken),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`HTTP-Error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

/**
 * Deletes data from the server at the specified path.
 * @param {string} path - the path to the data to be deleted
 * @return {Promise} a Promise that resolves to the JSON response from the server
 */
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + "/", {
    method: "DELETE",
    headers: getHeaders(true),
  });
  if (response.status === 204) {
    return { success: true, message: "Erfolgreich gelöscht" };
  }
  if (!response.ok) {
    const errorDetails = await response.json().catch(() => ({})); // JSON-Daten extrahieren, falls vorhanden
    throw new Error(
      `Fehler beim Löschen: ${response.status} ${response.statusText}. Details: ${JSON.stringify(errorDetails)}`
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
    headers: getHeaders(true),
    body: JSON.stringify(data)
  });
  console.log("direction to", BASE_URL + path + "/");
  if (!response.ok) {
    throw new Error(`HTTP-Error: ${response.status} ${response.statusText}`);
  }
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
    headers: getHeaders(true),
    body: JSON.stringify(data)
  });
  console.log("direction to", BASE_URL + path + "/");
  if (!response.ok) {
    throw new Error(`HTTP-Error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

