/* eslint no-undef: 0 */

QUnit.test('mergeLocation should return latitude and longitude as an object when given a fake jsonObject', function(assert) {
  var jsonObject = {color: 'red', wheels: 4, location: {latitude: 4, longitude: 5, city: 'London'}};
  assert.deepEqual(mergeLocation({}, jsonObject), {latitude: 4, longitude: 5}, 'mergeLocation returns latitude and longitude!');
});



QUnit.test('mergeWeather should return an appData object with full description of weather when given a fake jsonObject', function(assert) {
  var jsonObject = {
    color: 'red',
    wheels: 4,
    weather: [{main: 'firstMain', description: 'sunny spells'}],
    main: {temp: 32, mood: 'smiley'},
    name: 'London'
  };

  var expected = {
    display: {
      city: 'London',
      temperature: 32 + '°C',
      summary: 'firstMain'
    },
    description: 'sunny spells'
  };

  assert.deepEqual(mergeWeather({display:{}}, jsonObject), expected, 'Yay -- weather description returned!');
});



QUnit.test('mergeImage should return an object with a url when given a fake jsonObject', function(assert) {
  var jsonObject = {
    data: [{
      images:
      {
        downsized_medium:
        {
          url: 'https://media.giphy.com/media/xtGpIp4ixR6Gk/giphy.gif'
        }
      }
    }]
  };

  var fakeAppData = {
    display: {
      image: null
    }
  };

  var expected = {
    display: {
      image: 'https://media.giphy.com/media/xtGpIp4ixR6Gk/giphy.gif'
    }
  };

  assert.deepEqual(mergeImage(fakeAppData, jsonObject), expected, 'image url is returned in a object!');
});



QUnit.test('makeLocationUrl should return the nekudo url', function(assert) {
  var appData = {};
  assert.equal(makeLocationUrl(appData), 'https://geoip.nekudo.com/api/', 'makeLocationUrl returns the nekudo url!');
});



//Declare test openWeatherKey variable so that function has access to the fake variable
var openWeatherKey = '123456';
QUnit.test('makeWeatherUrl should return the open weather url with correct latitude, longitude and api key!', function(assert) {
  var appData = { latitude: 50, longitude: 40};
  assert.equal(makeWeatherUrl(appData), 'http://api.openweathermap.org/data/2.5/weather?lat=50&lon=40&appid=123456&units=metric', 'makeWeatherUrl returns the open weather url with correct lat, long and api key!');
});



QUnit.test('makeImageUrl should return the giphy url with correct description', function(assert) {
  var appData = {
    display: {
      image: null
    }
  };

  appData.display.summary = encodeURIComponent('sunny');

  assert.equal(makeImageUrl(appData), 'http://api.giphy.com/v1/gifs/search?q=sunny&api_key=dc6zaTOxFJmzC', 'makeImageUrl returns the giphy url with correct description!');
});



QUnit.test('displayData throws an error if appData not passed', function(assert) {
  assert.equal(displayData('u'), Error);
});



QUnit.test('displayData should modify the DOM respective to the values of the object passed to it', function(assert){
  var myObj = {
    display: {
      city: 'london',
      temperature: '420',
      summary: 'raining',
      image: 'myimage.jpeg'
    }
  };

  displayData(null, myObj);

  var bgImage = document.getElementById('js-body').style.backgroundImage;
  var myCity = document.querySelector('.city').textContent;
  var myTemp = document.querySelector('.temperature').textContent;
  var mySum = document.querySelector('.summary').textContent;

  assert.equal(bgImage, 'url("' + myObj.display.image + '")', '#js-body background image should have the same url as appData.display.image');
  assert.equal(myCity, myObj.display.city, '.city textContent should be the same as the value of appData.display.city');
  assert.equal(myTemp, myObj.display.temperature, '.temperature textContent should be the same as the value of appData.display.temperature');
  assert.equal(mySum, myObj.display.summary, '.summary textContent should be the same as the value of appData.display.summary');
});
