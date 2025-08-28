let BASE_URL = 'http://127.0.0.1:8000/api/auth/';

/**
 * Returns the headers for a request, optionally including the token.
 */
function getHeaders(includeToken = false) {
    let headers = { 'Content-Type': 'application/json' };

    if (includeToken) {
        let sessionToken = sessionStorage.getItem('token');
        let localToken = localStorage.getItem('token');
        let isGuest = sessionStorage.getItem('isGuest') === 'true';

        let token = sessionToken || localToken;
        if (isGuest && sessionToken) {
            token = sessionToken;
        }
        if (!token) {
            console.warn(
                'Kein gültiger Token gefunden. Umleitung zur Login-Seite.'
            );
            window.location.href = '../index.html';
        }
        headers['Authorization'] = `Token ${token}`;
    }
    return headers;
}

/**
 * Logs out the current user by removing the user ID from session storage and redirecting to the index page.
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
 */
async function loadData(path = '') {
    let response = await fetch(BASE_URL + path + '/', {
        method: 'GET',
        headers: getHeaders(true),
    });
    return await response.json();
}

/**
 * Asynchronously posts data to a specified path using the Firebase Realtime Database API.
 */
async function postData(
    path = '',
    data = {},
    includeToken = true,
    context = 'general'
) {
    try {
        let response = await fetch(BASE_URL + path + '/', {
            method: 'POST',
            headers: getHeaders(includeToken),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            let errorDetails = await response.json().catch(() => ({}));
            throw errorDetails;
        }
        return await response.json();
    } catch (error) {
        console.error('Fehler beim POST-Request:', error);
        showError(error, context);
        throw error;
    }
}

/**
 * Deletes data from the server at the specified path.
 */
async function deleteData(path = '') {
    let response = await fetch(BASE_URL + path + '/', {
        method: 'DELETE',
        headers: getHeaders(true),
    });
    try {
        if (response.status === 204) {
            return { success: true, message: 'Erfolgreich gelöscht' };
        }
        if (!response.ok) {
            let errorDetails = await response.json().catch(() => ({}));
            throw new Error(
                `Fehler beim Löschen: ${response.status} ${
                    response.statusText
                }. Details: ${JSON.stringify(errorDetails)}`
            );
        }
    } catch (error) {
        console.error('Fehler beim Senden der Anfrage:', error.message);
    }
}

/**
 * Updates data at the specified path.
 */
async function putData(path = '', data = {}, context = 'general') {
    try {
        let response = await fetch(BASE_URL + path + '/', {
            method: 'PUT',
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            let errorDetails = await response.json().catch(() => ({}));
            throw errorDetails;
        }
        return await response.json();
    } catch (error) {
        console.error('Fehler beim PUT-Request:', error);
        showError(error, context);
        throw error;
    }
}

/**
 * Partially updates data at the specified path using the Firebase Realtime Database API.
 */
async function patchData(path = '', data = {}) {
    try {
        let response = await fetch(BASE_URL + path + '/', {
            method: 'PATCH',
            headers: getHeaders(true),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            let errorDetails = await response.json().catch(() => ({}));
            throw errorDetails;
        }
        return await response.json();
    } catch (error) {
        console.error('Fehler beim PUT-Request:', error);
        showError(error, context);
        throw error;
    }
}
