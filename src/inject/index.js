/* global chrome, moment, DATE_FORMAT_KEY, URIS_KEY, DEFAULT_DATE_FORMAT */

/**
 * Check whether the current page is a landpage or not
 * @returns {boolean}
 */
function isLandPage() {
  const uri = window.location.pathname.substring(1);
  return uri.split('/').length === 2;
}

/**
 * Check whether the gdc has been injected or not
 *
 * @returns {boolean}
 */
function hasInjected() {
  return document.getElementById('gdc') !== null;
}

/**
 * Get a complete uri in the format of https://api.github.com/repos/{:owner}/{:repository}
 * @returns {string}
 */
function getRepositoryURI() {
  const API = 'https://api.github.com/repos';
  const uri = window.encodeURI(window.location.pathname.substring(1));
  const [owner, repository] = uri.split('/');
  return `${API}/${owner}/${repository}`;
}

/**
 * Get an URI from a local storage
 * @param uri
 * @returns {Promise}
 */
function getURIFromStorage(uri) {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ [URIS_KEY]: {} }, (response) => {
      const uris = response[URIS_KEY];
      if (uris[uri]) resolve(uris[uri]);
      else resolve(null);
    });
  });
}

/**
 * Add a new URI to a local storage
 * @param uri
 * @param date
 * @returns {Promise}
 */
function addURIToStorage(uri, date) {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ [URIS_KEY]: {} }, (response) => {
      const uris = response[URIS_KEY];
      uris[uri] = date;
      chrome.storage.sync.set({ [URIS_KEY]: uris }, () => {
        resolve();
      });
    });
  });
}


/**
 * Get a date from a given URI
 * @param uri
 * @returns {Promise.<String>}
 */
async function getDateOfCreation(uri) {
  try {
    // If the uri exists in the storage, which means
    // it has been fetched before, the stored data will be
    // used without fetching again.
    const existingDate = await getURIFromStorage(uri);
    if (existingDate) {
      return existingDate;
    }

    // Otherwise, fetch the uri and store it inside the storage
    const response = await fetch(uri);
    const data = await response.json();
    const date = data.created_at;
    await addURIToStorage(uri, date); // eslint-disable-line no-unused-expressions
    return date;
  } catch (e) {
    throw new Error(e);
  }
}

/**
 * Get date format
 * @returns Promise
 */
function getDateFormat() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ [DATE_FORMAT_KEY]: DEFAULT_DATE_FORMAT }, (response) => {
      resolve(response[DATE_FORMAT_KEY]);
    });
  });
}

/**
 * Format the given date using moment.js
 * @param date
 * @param format
 * @returns {String}
 */
function formatDate(date, format) {
  return moment(date).format(format);
}

/**
 * Inject the given date into HTML
 * @param date
 */
function injectDateToHTML(date) {
  const ul = document.querySelector('ul.numbers-summary');
  const dateHTML = (
    `<li id="gdc">
      <a>
        <svg class="octicon octicon-calendar" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13 2h-1v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H6v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H2c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 12H2V5h11v9zM5 3H4V1h1v2zm6 0h-1V1h1v2zM6 7H5V6h1v1zm2 0H7V6h1v1zm2 0H9V6h1v1zm2 0h-1V6h1v1zM4 9H3V8h1v1zm2 0H5V8h1v1zm2 0H7V8h1v1zm2 0H9V8h1v1zm2 0h-1V8h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1zm2 0h-1v-1h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1z"></path></svg>
        ${date}
      </a>
      </li>`
  );

  ul.insertAdjacentHTML('beforeend', dateHTML);
}

/**
 * Main function
 */
async function init() {
  if (isLandPage() && !hasInjected()) {
    const uri = getRepositoryURI();
    const date = await getDateOfCreation(uri);
    const dateFormat = await getDateFormat();
    const formattedDate = formatDate(date, dateFormat);
    injectDateToHTML(formattedDate);
  }
}

document.addEventListener('pjax:end', init, false);
init();
