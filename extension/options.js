const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", saveSettings);

function saveSettings() {
  const apiKey = document.getElementById("apiKey").value;
  const scheduleButtons = document.getElementById("scheduleButtons").checked;
  const planningButtons = document.getElementById("planningButtons").checked;
  const timeEstimateButtons = document.getElementById("timeEstimateButtons").checked;
  const priorityButtons = document.getElementById("priorityButtons").checked;
  const rewardPointsButtons = document.getElementById("rewardPointsButtons").checked;

  chrome.storage.sync.set(
    {
      apiKey: apiKey,
      scheduleButtons: scheduleButtons,
      planningButtons: planningButtons,
      timeEstimateButtons: timeEstimateButtons,
      priorityButtons: priorityButtons,
      rewardPointsButtons: rewardPointsButtons,
    },
    () => {}
  );
}

// Setting the state of apiKey input field and toggle switches based on what's stored in Chrome

chrome.storage.sync.get(null, (items) => {
  const allKeys = Object.keys(items);
  allKeys.forEach((element) => {
    element === "apiKey" ? getApiKey() : setSwitchValue(element);
  });
});

function getApiKey() {
  chrome.storage.sync.get("apiKey", function (data) {
    if (data.apiKey !== undefined)
      document.getElementById("apiKey").value = data.apiKey;
  });
}

function setSwitchValue(element) {
  chrome.storage.sync.get(element, function (data) {
    data[element]
      ? (document.getElementById(element).checked = true)
      : (document.getElementById(element).checked = false);
  });
}
