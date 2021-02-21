function saveSettings() {
  const apiKey = document.getElementById('apiKey').value;
  const scheduleButtons = document.getElementById('scheduleButtons').checked;
  const planningButtons = document.getElementById('planningButtons').checked;
  const timeEstimateButtons = document.getElementById('timeEstimateButtons').checked;
  const priorityButtons = document.getElementById('priorityButtons').checked;
  const rewardPointsButtons =document.getElementById('rewardPointsButtons').checked;
  chrome.storage.sync.set({
    apiKey: apiKey,
    scheduleButtons: scheduleButtons,
    planningButtons: planningButtons,
    timeEstimateButtons: timeEstimateButtons,
    priorityButtons: priorityButtons,
    rewardPointsButtons: rewardPointsButtons
  }, function() {
  })
}

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', saveSettings);

chrome.storage.sync.get('apiKey', function(data) {
  if (data.apiKey !== undefined) {
    document.getElementById('apiKey').value = data.apiKey;
  }
});

chrome.storage.sync.get('scheduleButtons', function(data) {
  document.getElementById('scheduleButtons').checked;
  data.scheduleButtons ? document.getElementById('scheduleButtons').checked = true : document.getElementById('scheduleButtons').checked = false;
});

chrome.storage.sync.get('planningButtons', function(data) {
  document.getElementById('planningButtons').checked;
  data.planningButtons ? document.getElementById('planningButtons').checked = true : document.getElementById('planningButtons').checked = false;
});

chrome.storage.sync.get('timeEstimateButtons', function(data) {
  document.getElementById('timeEstimateButtons').checked;
  data.timeEstimateButtons ? document.getElementById('timeEstimateButtons').checked = true : document.getElementById('timeEstimateButtons').checked = false;
});

chrome.storage.sync.get('priorityButtons', function(data) {
  document.getElementById('priorityButtons').checked;
  data.priorityButtons ? document.getElementById('priorityButtons').checked = true : document.getElementById('priorityButtons').checked = false;
});

chrome.storage.sync.get('rewardPointsButtons', function(data) {
  document.getElementById('rewardPointsButtons').checked;
  data.rewardPointsButtons ? document.getElementById('rewardPointsButtons').checked = true : document.getElementById('rewardPointsButtons').checked = false;
});