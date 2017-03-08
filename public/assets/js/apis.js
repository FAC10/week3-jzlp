/*
What we need from each returned JSON object
(assuming obj = JSON.parse(xhr.responseText))

Nekudo api call:

obj.location.latitude;
obj.location.longtitude

weather api call:

obj.weather[0].main (this gives the overall kind of weather)
obj.weather[0].description
obj.main.temp

giphy api call:

obj.data[0].images.downsized_medium.url

*/
