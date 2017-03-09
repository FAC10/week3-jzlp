// ***************************************************************
// APP
// ***************************************************************
waterfall({}, [getLocation, getWeather, getImage], displayData);



function waterfall(appData, tasks, finalCallback) {
  if (tasks.length === 0) {
    return finalCallback(null, appData);
  }
  tasks[0](appData, function(err, res) {
    if (err) {
      return finalCallback(err);
    }
    waterfall(res, tasks.slice(1), finalCallback);
  });
}




// ***************************************************************
// LOCATION
// ***************************************************************
function getLocation(appData, handleUpdatedDataCallback) {
  fetch('GET', makeLocationUrl(appData), function(err, jsonResponseObject) {
    if (err) {
      return handleUpdatedDataCallback(err);
    }
    handleUpdatedDataCallback(null, mergeLocation(appData, jsonResponseObject));
  });
}


function makeLocationUrl(appData){
  return 'https://geoip.nekudo.com/api/';
}


function mergeLocation(appData, jsonResponseObject) {
  appData.latitude = jsonResponseObject.location.latitude;
  appData.longitude = jsonResponseObject.location.longitude;
  return appData;
}




// ***************************************************************
// WEATHER
// ***************************************************************
function getWeather(appData, handleUpdatedDataCallback) {
  fetch('GET', makeWeatherUrl(appData), function(err, jsonResponseObject) {
    handleUpdatedDataCallback(null, mergeWeather(appData, jsonResponseObject));
  });
}


function makeWeatherUrl(appData) {
  return `http://api.openweathermap.org/data/2.5/weather?lat=${appData.latitude}&lon=${appData.longitude}&appid=${openWeatherKey}&units=metric`; // eslint-disable-line no-undef
}


function mergeWeather(appData, jsonResponseObject) {
  appData.display = {};
  appData.display.city = jsonResponseObject.name;
  appData.display.temperature = jsonResponseObject.main.temp;
  appData.display.summary = jsonResponseObject.weather[0].main;
  appData.description = jsonResponseObject.weather[0].description;
  return appData;
}




// ***************************************************************
// IMAGES
// ***************************************************************
function getImage(appData, handleUpdatedDataCallback) {
  fetch('GET', makeImageUrl(appData), function(err, jsonResponseObject) {
    handleUpdatedDataCallback(null, mergeImage(appData, jsonResponseObject));
  });
}


function makeImageUrl(appData) {
  var encodedDescription = encodeURIComponent(appData.description);
  return `http://api.giphy.com/v1/gifs/search?q=${encodedDescription}&api_key=dc6zaTOxFJmzC`;
}


function mergeImage(appData, jsonResponseObject) {
  appData.display.image = jsonResponseObject.data[0].images.downsized_medium.url;
  return appData;
}




// ***************************************************************
// FETCH
// ***************************************************************
function fetch(method, url, handleResponseCallback) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var jsonObj = JSON.parse(xhr.responseText);
      handleResponseCallback(null, jsonObj);
    }
  };

  xhr.onerror = function() {
    handleResponseCallback('Api response error');
  };

  xhr.open(method, url, true);
  xhr.send();
}




// ***************************************************************
// DISPLAY
// ***************************************************************
function displayData(err, appData) {
  console.log(1, err, Error);
  if (err) {
    document.querySelector(`.summary`).textContent = 'Sorry, data unavailable';
    return Error;
  }

  for (var key in appData.display) {
    if (key === 'image') {
      document.querySelector(`.${key}`).src = appData.display[key];
    } else {
      document.querySelector(`.${key}`).textContent = appData.display[key];
    }
  }
}
