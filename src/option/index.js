function init() {
  // Get the date-format field and initialize its value
  const dateFormatElement = document.getElementById('date-format');
  chrome.storage.sync.get({ [DATE_FORMAT_KEY]: DEFAULT_DATE_FORMAT }, (response) => {
    dateFormatElement.value = response[DATE_FORMAT_KEY];
  });

  // Bind onChange event
  dateFormatElement.addEventListener('change', (event) => {
    chrome.storage.sync.set({ [DATE_FORMAT_KEY]: event.target.value });
  });
}

init();
