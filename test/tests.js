QUnit.test('mergeLocation should return latitude and longitude as an object when given a fake jsonObject', function(assert) {
  var jsonObject = {color: 'red', wheels: 4, location: {latitude: 4, longitude: 5, city: 'London'}};
  assert.deepEqual(mergeLocation({}, jsonObject), {latitude: 4, longitude: 5}, 'mergeLocation returns latitude and longitude!')
});


QUnit.test('mergeWeather should return an appData object with full description of weather when given a fake jsonObject', function(assert) {
  var jsonObject = {
    color: 'red',
    wheels: 4,
    weather: [{main: 'firstMain', description: 'sunny spells'}],
    main: {temp: 32, mood: 'smiley'},
    city: 'London'
  };
  assert.deepEqual(mergeWeather({}, jsonObject), {description: 'sunny spells', main: 'firstMain', temperature: 32}, 'Yay -- weather description returned!')
});

QUnit.test('mergeImages should return an object with a url when given a fake jsonObject', function(assert) {
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
  assert.deepEqual(mergeImages({}, jsonObject), {image: 'https://media.giphy.com/media/xtGpIp4ixR6Gk/giphy.gif'}, 'image url is returned in a object!')
});
