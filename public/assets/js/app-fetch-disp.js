// *****************************
// APP
// *****************************
waterfall({}, [getLocation], displayData);


function waterfall(appData, tasks, cb) {
  if (tasks.length === 0) {
    return cb(null, appData)
  }
  tasks[0](appData, function(err, res) {
    if (err) {
      return cb(err)
    }
    waterfall(res, tasks.slice(1), cb);
  });
}




// *****************************
// LOCATION
// *****************************
function getLocation(appData, cb) {
  var locationUrl = 'https://geoip.nekudo.com/api/';
  fetch('GET', locationUrl, function(err, jsonObject) {
    cb(null, processLocation(appData, jsonObject));
  });
}


function processLocation(appData, jsonObject) {
  appData.latitude = jsonObject.location.latitude;
  appData.longitude = jsonObject.location.longitude;
  return appData;
}




// *****************************
// WEATHER
// *****************************
function getWeather() {
  return 2;
}


function processWeather() {
  return 2;
}




// *****************************
// IMAGES
// *****************************
function getImages() {
  return 3;
}

function processImages() {
  return 3;
}






// *****************************
// FETCH
// *****************************
function fetch(method, url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var jsonObj = JSON.parse(xhr.responseText);
      cb(null, jsonObj);
    }
  }
  xhr.open(method, url, true);
  xhr.send();
}



// *****************************
// DISPLAY
// *****************************
function displayData(err, appData) {
  for (key in appData) {
    document.querySelector(`.${key}`).textContent = appData[key];
  }
}
