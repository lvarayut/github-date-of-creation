/* global chrome */

function isLandPage() {
  const uri = window.location.pathname.substring(1);
  return uri.split('/').length === 2;
}

function getRepositoryURI() {
  const API = 'https://api.github.com/repos';
  const uri = window.location.pathname.substring(1);
  const [owner, repository] = uri.split('/');
  return `${API}/${owner}/${repository}`;
}

async function getDateOfCreation(uri) {
  try {
    const response = await fetch(uri);
    const data = await response.json();
    return data['created_at'];
  } catch(e) {
    console.error(e);
  }
}

function formatDate(date, format) {
  return moment(date).format(format);
}

function injectDateToHTML(date) {
  const ul = document.querySelector('ul.numbers-summary');
  const dateHTML =  (
    `<li>
      <a>
        <svg class="octicon octicon-calendar" viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M13 2h-1v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H6v1.5c0 .28-.22.5-.5.5h-2c-.28 0-.5-.22-.5-.5V2H2c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 12H2V5h11v9zM5 3H4V1h1v2zm6 0h-1V1h1v2zM6 7H5V6h1v1zm2 0H7V6h1v1zm2 0H9V6h1v1zm2 0h-1V6h1v1zM4 9H3V8h1v1zm2 0H5V8h1v1zm2 0H7V8h1v1zm2 0H9V8h1v1zm2 0h-1V8h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1zm2 0h-1v-1h1v1zm-8 2H3v-1h1v1zm2 0H5v-1h1v1zm2 0H7v-1h1v1zm2 0H9v-1h1v1z"></path></svg>
        ${date}
      </a>
      </li>`
  );

  ul.insertAdjacentHTML('beforeend', dateHTML);
}

async function init() {
  if (isLandPage()) {
    const uri = getRepositoryURI();
    const date = await getDateOfCreation(uri);
    const formattedDate = formatDate(date, 'MMMM, YYYY');
    injectDateToHTML(formattedDate);
  }
}

init();
