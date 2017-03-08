
function request(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var jsonObj = JSON.parse(xhr.responseText);
      cb(jsonObj);
    }
  }
  xhr.open('GET', url, true);
  xhr.send();
}

waterfall({}, [getLocation, getWeather], displayData);

