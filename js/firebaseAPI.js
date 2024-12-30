const BASE_URL = "http://127.0.0.1:8000/api/auth/";

/**
 * Returns the headers for a request, optionally including the token.
 * @param {boolean} includeToken - Whether to include the authorization token.
 * @return {Object} - Headers object for the request.
 */
function getHeaders(includeToken = false) {
  const headers = { "Content-Type": "application/json" };

  if (includeToken) {
    const sessionToken = sessionStorage.getItem("token");
    const localToken = localStorage.getItem("token");
    const isGuest = sessionStorage.getItem("isGuest") === "true";

    let token = sessionToken || localToken;
    if (isGuest && sessionToken) {
      token = sessionToken;
    }
    if (!token) {
      console.warn("Kein gültiger Token gefunden. Umleitung zur Login-Seite.");
      window.location.href = "../index.html";
    }
    headers["Authorization"] = `Token ${token}`;
  }
  return headers;
}

/**
 * Logs out the current user by removing the user ID from session storage and redirecting to the index page.
 *
 * @return {void} This function does not return anything.
 */
function logout() {
  console.warn('Benutzer wird automatisch ausgeloggt.');
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('isGuest');
  window.location.href = '../index.html';
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
 * Asynchronously sends a POST request to the specified path with the given data and returns the JSON response from the server.
 * @param {string} path - the path to the data to be created
 * @param {Object} data - the data to be sent to the server
 * @param {boolean} [includeToken=true] - whether to include the authentication token in the request
 * @return {Promise<Object>} - a Promise that resolves to the parsed JSON response from the server
 */
async function postData(path, data, includeToken = true) {
    const response = await fetch(BASE_URL + path + "/", {
      method: "POST",
      headers: getHeaders(includeToken),
      body: JSON.stringify(data),
    });
    try {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.email ? errorData.email[0] : 'Ein Fehler ist aufgetreten.');
    }

    return await response.json();
  } catch (error) {
    console.error('Fehler beim Senden der Anfrage:', error.message);
    throw error; 
  }
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
    const errorDetails = await response.json().catch(() => ({}));
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
  try {
    const response = await fetch(BASE_URL + path + "/", {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json(); 
      } catch {
        throw new Error(`Serverfehler: ${response.status} ${response.statusText}`);
      }
      throw new Error(errorData.email ? errorData.email[0] : `Ein Fehler ist aufgetreten (Status: ${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fehler beim Senden der Anfrage:", error.message);
    throw error;
  }
}


/**
 * Partially updates data at the specified path using the Firebase Realtime Database API.
 * @param {string} [path=''] - The path to the data in the Firebase Realtime Database. Defaults to an empty string.
 * @param {Object} [data={}] - The data to be partially updated. Defaults to an empty object.
 * @return {Promise<Object>} - A promise that resolves to the parsed JSON response from the Firebase Realtime Database.
 */
async function patchData(path = "", data = {}) {
  try {
    let response = await fetch(BASE_URL + path + "/", {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        throw new Error(`Serverfehler: ${response.status} ${response.statusText}`);
      }
      throw new Error(
        errorData.email
          ? errorData.email[0]
          : `Ein Fehler ist aufgetreten (Status: ${response.status})`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Fehler beim Senden der Anfrage:", error.message);
    throw error;
  }
}

