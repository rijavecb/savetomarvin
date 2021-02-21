let pageTitle = '';
let pageUrl = '';
let titleAddons = '';
let rewardPoints = 0;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  pageTitle = tabs[0].title;
  pageUrl = tabs[0].url;
  const titleField = document.getElementById('title');
  titleField.value = pageTitle;
  titleField.focus();
  titleField.select();
});

var storedApiToken = '';
chrome.storage.sync.get('apiKey', function(data) {
  storedApiToken = data.apiKey;
});

chrome.storage.sync.get('scheduleButtons', function(data) {
  if (!data.scheduleButtons) document.getElementById('scheduleButtons').classList.add('hidden');
});

chrome.storage.sync.get('planningButtons', function(data) {
  if (!data.planningButtons) document.getElementById('planningButtons').classList.add('hidden');
});

chrome.storage.sync.get('timeEstimateButtons', function(data) {
  if (!data.timeEstimateButtons) document.getElementById('timeEstimateButtons').classList.add('hidden');
});

chrome.storage.sync.get('priorityButtons', function(data) {
  if (!data.priorityButtons) document.getElementById('priorityButtons').classList.add('hidden');
});

chrome.storage.sync.get('rewardPointsButtons', function(data) {
  if (!data.rewardPointsButtons) document.getElementById('rewardPointsButtons').classList.add('hidden');
});

const dimmer = document.getElementById('dimmer');
const error = document.getElementById('error');
const confirmation = document.getElementById('confirmation');

function showError() {
  error.style.display = 'flex';
}

function hideError() {
  error.style.display = 'none';
}

function startLoad() {
  dimmer.style.display = 'block';
  hideError();
}

function endLoad() {
  dimmer.style.display = 'none';
}

function newTaskSucceeded(title, dateString) {
  const successTextPara = document.getElementById('successText');
  let successTextHTML = ''
  if (dateString !== 'unassigned') {
    successTextHTML = 'New task <b>' + title + '</b> added on <b>' + dateString + '</b>.';
  } else {
    successTextHTML = 'New task <b>' + title + '</b> added as <b>unscheduled</b>.'; 
  }
  successTextPara.innerHTML = successTextHTML;
  confirmation.style.display = 'block';
}

let uncheckSiblings = function (element) {
  let descendants = element.parentNode.children;
  for (descendant of descendants) {
    if (descendant !== element) {
      descendant.classList.remove("checked");
    }
 }
}

document.addEventListener('click', function (event) {
	if (event.target.matches('.button')) {
    uncheckSiblings(event.target);
    event.target.classList.toggle("checked");
	}
});

let appendToTitle = function(checkedButtons) {
  for (checkedButton of checkedButtons) {
    buttonContents = String(checkedButton.innerHTML);
    buttonContents.match(/\$/) ? setRewardPoints(checkedButton.value) : titleAddons += ` ${checkedButton.value}`;
 }
}

let setRewardPoints = function(elementValue) {
  rewardPoints = parseFloat(elementValue);
}

function addTask(title, pageUrl) {
  let date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const dateString = date.toISOString().slice(0,10);

  let checkedButtons = document.getElementsByClassName("checked");
  appendToTitle(checkedButtons);
  
  let data = {};
  data.title = title + titleAddons;
  data.note = pageUrl;
  data.rewardPoints = rewardPoints;
  console.log(JSON.stringify(data))

  fetch('https://serv.amazingmarvin.com/api/addTask', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'X-API-Token': storedApiToken
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    endLoad();
    if (!response.ok) {
      throw new Error('Network error');
    }
    return response.json();
  })
  .then(responseJSON => {
    newTaskSucceeded(responseJSON.title, responseJSON.day);
  })
  .catch((error) => {
    showError();
  });
};

const titleField = document.getElementById('title');

const submitAction = function() {
  startLoad();
  let title = titleField.value;
  addTask(title, pageUrl);
}

const checkForEnter = function() {
  const key = window.event.keyCode;

  // If the user has pressed enter
  if (key === 13) {
    submitAction();
    return false;
  } else {
    return true;
  }
}

titleField.onkeypress = checkForEnter;

const button = document.getElementById('submitButton');
button.onclick = submitAction;