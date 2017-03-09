// *****************************
// APP
// *****************************
waterfall({}, [getLocation, getWeather, getImage], displayData);


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
  fetch('GET', makeLocationUrl(appData), function(err, jsonObject) {
    cb(null, processLocation(appData, jsonObject));
  });
}

function makeLocationUrl(appData){
  return 'https://geoip.nekudo.com/api/';
}

function processLocation(appData, jsonObject) {
  appData.latitude = jsonObject.location.latitude;
  appData.longitude = jsonObject.location.longitude;
  return appData;
}




// *****************************
// WEATHER
// *****************************
function getWeather(appData, cb) {
  fetch('GET', makeWeatherUrl(appData), function(err, jsonObject){
    cb(null, processWeather(appData, jsonObject));
  })
}

function makeWeatherUrl(appData){
  return `http://api.openweathermap.org/data/2.5/weather?lat=${appData.latitude}&lon=${appData.longitude}&appid=${openWeatherKey}&units=metric`;
}


function processWeather(appData, jsonObject) {
  appData.description = jsonObject.weather[0].description;
  appData.main = jsonObject.weather[0].main;
  appData.temperature = jsonObject.main.temp;
  return appData;
}




// *****************************
// IMAGES
// *****************************
function getImage(appData, cb) {
  fetch('GET', makeImageUrl(appData), function(err, jsonObject) {
    cb(null, processImages(appData, jsonObject));
  })
}

function makeImageUrl(appData){
  var encodedDescription = encodeURIComponent(appData.description);
  return `http://api.giphy.com/v1/gifs/search?q=${encodedDescription}&api_key=dc6zaTOxFJmzC`;
}

function processImages(appData, jsonObject) {
  appData.image = jsonObject.data[0].images.downsized_medium.url;
  return appData;
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
    if (key === 'image') {
      document.querySelector(`.${key}`).src = appData[key];
    }
    else {
      document.querySelector(`.${key}`).textContent = appData[key];
    }
  }
}
