// ***************************************************************
// APP
// ***************************************************************
waterfall({
  toBeDisplayed: {},
  info: {}
}, [
  [getResource, makeLocationUrl, mergeLocation],
  [getResource, makeWeatherUrl, mergeWeather],
  [getResource, makeImageUrl, mergeImage]
],
displayData);


function waterfall(appData, tasks, finalCallback) {
  if (tasks.length === 0) {
    return finalCallback(null, appData);
  }
  tasks[0][0](appData, ...tasks[0].slice(1), function(err, updatedAppData) {
    if (err) {
      return finalCallback(err);
    }
    waterfall(updatedAppData, tasks.slice(1), finalCallback);
  });
}




// ***************************************************************
// API RESOURCE GETTER
// ***************************************************************
function getResource(appData, makeUrl, mergeResource, updatedDataCallback) {
  fetch('GET', makeUrl(appData), function(err, jsonResponseObject) {
    if (err) {
      return updatedDataCallback(err);
    }
    updatedDataCallback(null, mergeResource(appData, jsonResponseObject));
  });
}




// ***************************************************************
// LOCATION
// ***************************************************************
function mergeLocation(appData, jsonResponseObject) {
  appData.info.latitude = jsonResponseObject.location.latitude;
  appData.info.longitude = jsonResponseObject.location.longitude;
  return appData;
}


function makeLocationUrl(appData) {
  return 'https://geoip.nekudo.com/api/';
}




// ***************************************************************
// WEATHER
// ***************************************************************
function mergeWeather(appData, jsonResponseObject) {
  appData.toBeDisplayed.city = jsonResponseObject.name;
  appData.toBeDisplayed.temperature = `${Math.round(parseFloat(jsonResponseObject.main.temp))}°C`;
  appData.toBeDisplayed.summary = jsonResponseObject.weather[0].main;
  appData.info.description = jsonResponseObject.weather[0].description;
  return appData;
}


function makeWeatherUrl(appData) {
  return `http://api.openweathermap.org/data/2.5/weather?lat=${appData.info.latitude}&lon=${appData.info.longitude}&appid=${openWeatherKey}&units=metric`; // eslint-disable-line no-undef
}




// ***************************************************************
// IMAGE
// ***************************************************************
function mergeImage(appData, jsonResponseObject) {
  appData.toBeDisplayed.images = jsonResponseObject.data.map(function(item) {
    return item.images.downsized_medium.url;
  });

  return appData;
}


function makeImageUrl(appData) {
  var encodedDescription = encodeURIComponent(appData.toBeDisplayed.summary);
  return `http://api.giphy.com/v1/gifs/search?q=${encodedDescription}&api_key=dc6zaTOxFJmzC`;
}




// ***************************************************************
// FETCH
// ***************************************************************
function fetch(method, url, responseCallback) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      responseCallback(null, JSON.parse(xhr.responseText));
    }
  };

  xhr.onerror = function() {
    responseCallback('Api response error');
  };

  xhr.open(method, url, true);
  xhr.send();
}




// ***************************************************************
// DISPLAY
// ***************************************************************
function displayData(err, appData) {
  if (err) {
    document.querySelector(`.summary`).textContent = 'Sorry, data unavailable';
    return Error;
  }
  for (let key in appData.toBeDisplayed) {
    if (key === 'images') {
      animateImage(appData.toBeDisplayed.images, 5000);

    } else {
      document.querySelector(`.${key}`).textContent = appData.toBeDisplayed[key];
    }
  }
}


function animateImage(images, delay) {
  let imageCounter = 0;
  let imageDummyElement;
  const imagesDOM = document.querySelector('.images');
  imagesDOM.src = images[imageCounter];

  setTimeout(function() {
    imagesDOM.style.opacity = 0;
  }, delay - 1000);
  setTimeout(function() {
    imagesDOM.style.opacity = 1;
  }, delay + 200);

  setInterval(function() {
    setTimeout(function() {
      imagesDOM.style.opacity = 0;
    }, delay - 1000);
    setTimeout(function() {
      imagesDOM.style.opacity = 1;
    }, delay + 200);


    imageCounter = (++imageCounter) % images.length;
    // Preload the following image for smoother experience
    imageDummyElement = new Image();
    imageDummyElement.src = images[(imageCounter+1) % images.length];
    console.log(imageCounter);
    imagesDOM.src = images[imageCounter];
  }, delay);
}





// ***************************************************************
// HELPERS
// ***************************************************************
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}
