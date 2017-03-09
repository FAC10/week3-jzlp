QUnit.test('processLocation should return latitude and longitude as an object when given a fake jsonObject', function(assert) {
  var jsonObject = {color: 'red', wheels: 4, location: {latitude: 4, longitude: 5, city: 'London'}};
  assert.deepEqual(processLocation({}, jsonObject), {latitude: 4, longitude: 5}, 'processLocation returns latitude and longitude!')
});


QUnit.test('processWeather should return an appData object with full description of weather when given a fake jsonObject', function(assert) {
  var jsonObject = {
    color: 'red',
    wheels: 4,
    weather: [{main: 'firstMain', description: 'sunny spells'}],
    main: {temp: 32, mood: 'smiley'},
    city: 'London'
  };
  assert.deepEqual(processWeather({}, jsonObject), {description: 'sunny spells', main: 'firstMain', temperature: 32}, 'Yay -- weather description returned!')
});

QUnit.test('processImages should return an object with a url when given a fake jsonObject', function(assert) {
  var jsonObject = {
    color: 'red',
    wheels: 4,
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
  assert.deepEqual(processImages({}, jsonObject), {image: 'https://media.giphy.com/media/xtGpIp4ixR6Gk/giphy.gif'}, 'image url is returned in a object!')
});
