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

    let token = sessionToken || localToken; // Standardmäßig Session zuerst

    // 🚨 Wenn ein Gast eingeloggt ist, nutze NUR den SessionStorage-Token
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
 * Asynchronously posts data to a specified path using the Firebase Realtime Database API.
 * @param {string} [path=''] - The path to the data in the Firebase Realtime Database. Defaults to an empty string.
 * @param {Object} [data={}] - The data to be posted. Defaults to an empty object.
 * @return {Promise<Object>} - A promise that resolves to the parsed JSON response from the Firebase Realtime Database.
 */
async function postData(path = "", data = {}, includeToken = true) {
  try {
      let response = await fetch(BASE_URL + path + "/", {
          method: "POST",
          headers: getHeaders(includeToken),
          body: JSON.stringify(data)
      });

      // 🛑 403 Forbidden – Benutzer automatisch ausloggen
      if (response.status === 403) {
          console.warn('Timeout erkannt. Benutzer wird automatisch ausgeloggt.');
          logout();
          return;
      }

      // 🛑 401 Unauthorized – Token ungültig
      if (response.status === 401) {
          console.warn('Token ungültig. Benutzer wird automatisch ausgeloggt.');
          logout();
          return;
      }

      if (!response.ok) {
          throw new Error(`HTTP-Error: ${response.status}`);
      }

      return await response.json();
  } catch (error) {
      console.error('Fehler beim Senden der Anfrage:', error.message);
      if (error.message.includes('401') || error.message.includes('403')) {
          console.warn('Token ungültig oder Timeout erkannt. Benutzer wird ausgeloggt.');
          logout();
      }
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

