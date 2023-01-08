//position stack api access key ba7a6538984170b23d612af3e809e197

//todo: have the city input bar fetch location data from position stack and weather data from open weather
//todo: load weather data from open weather into top div of main
//todo: load 5 day forcast data from open weather to 5 cards in main div
//todo: store previous searches in search history which displays in list below search bar.
//todo: on history item click load the current and 5 day weather data for specified location

$ (function (){
    let searchButton = $('#search-btn');
    let searchCrit = $('#search-criteria');
    let weather = {
      city: '',
      date: '', //unix result
      weatherType: '',
      temp: '', //kelvin result
      humidity: '', //add %
      windSpeed: '', //round up add mph
    };
    let forecast = [];


//Event Listeners------------------------------------------------
    searchButton.on('click', function(){
        fetchForecast();
    });

    searchCrit.keyup(function(e){
        var action = e;
        //check if enter key is pressed
        if(action.which == 13){
          fetchForecast();
        }
    });

//Functions------------------------------------------------------
    function fetchForecast(){
      //user input  
      var input = '&location=' + searchCrit.val();

      //position vars
      var posAccessKey = 
      '?key=ZFD5pPPWBtt5h0OFfjA2eC0JOkZpOdkd'
      var requestPos = 
      'http://www.mapquestapi.com/geocoding/v1/address';
      var returnedLat;
      var returnedLng;
      requestPos += posAccessKey + input;

      //open weather vars
      var weatherAccessKey = 
      '&appid=c33d28d593af473e62aaaced9c1ad9cd';
      var requestWeather = 
      'https://api.openweathermap.org/data/2.5/weather?'
      var requestForecast = 
      'https://api.openweathermap.org/data/2.5/forecast?'

      
      //lat and lon request
      fetch(requestPos)
        .then(function(res){
          return res.json();
        })
        .then(function(data){
          //get latitude and longitude of requested location
          returnedLat = 'lat=' + data.results[0].locations[0].latLng.lat;
          returnedLng = '&lon=' + data.results[0].locations[0].latLng.lng;
          
          //update weater request info
          requestWeather += returnedLat +returnedLng + weatherAccessKey;
          requestForecast += returnedLat + returnedLng +weatherAccessKey;

          console.log(requestWeather);
          console.log(requestForecast);

          //fetch current weather data
          fetch(requestWeather)
            .then(function(res){
              return res.json();
            })
              .then(function(data){
                weather.city = data.name;
                weather.date = dayjs.unix(data.dt).format('ddd, MMM DD, YYYY');
                weather.weatherType = data.weather[0].main;
                weather.temp = Math.round(1.8*(data.main.temp - 273) + 32);
                weather.humidity = data.main.humidity;
                weather.windSpeed = Math.round(data.wind.speed);
              });

          //fetch forecast data
          fetch(requestForecast)
            .then(function(res){
              return res.json();
            })
              .then(function(data){
                var dayCount = 0;
                var currentDay;
                var _test = 0;
                //5 day forecast objects
                //#region Day Objects
                var day0 = {
                  date: '',
                  weather: [],
                  temp: [],
                  humidity: [],
                  windSpeed: []
                };
                var day1 = {
                  date: '',
                  weather: [],
                  temp: [],
                  humidity: [],
                  windSpeed: []
                };
                var day2 = {
                  date: '',
                  weather: [],
                  temp: [],
                  humidity: [],
                  windSpeed: []
                };
                var day3 = {
                  date: '',
                  weather: [],
                  temp: [],
                  humidity: [],
                  windSpeed: []
                };
                var day4 = {
                  date: '',
                  weather: [],
                  temp: [],
                  humidity: [],
                  windSpeed: []
                };
                //#endregion Day Objects

                //array to hold 5 day forecast objects
                var fullForecast = [day0, day1, day2, day3, day4];
                for (let i = 0; i < data.list.length; i++) {
                  //set current day to day in index of response array
                  currentDay = dayjs.unix(data.list[i].dt).format('MM/DD/YYYY');
                  
                  //do nothing if currentDate equals today
                  if(currentDay === dayjs().format('MM/DD/YYYY')){}
                  //initialize fullForecast arr
                  else if(fullForecast[0].date == ''){
                    fullForecast[dayCount].date = currentDay;
                    fullForecast[dayCount].weather.push(data.list[i].weather[0].main);
                    fullForecast[dayCount].temp.push(data.list[i].main.temp);
                    fullForecast[dayCount].humidity.push(data.list[i].main.humidity);
                    fullForecast[dayCount].windSpeed.push(data.list[i].wind.speed);
                  }
                  //iterate over fullForecast and add response data to objects
                  else if(currentDay === fullForecast[dayCount].date){
                    fullForecast[dayCount].date = currentDay;
                    fullForecast[dayCount].weather.push(data.list[i].weather[0].main);
                    fullForecast[dayCount].temp.push(data.list[i].main.temp);
                    fullForecast[dayCount].humidity.push(data.list[i].main.humidity);
                    fullForecast[dayCount].windSpeed.push(data.list[i].wind.speed);
                  } 
                  //increase dayCount and set object keys in next day
                  else {
                    dayCount++;
                    fullForecast[dayCount].date = currentDay;
                    fullForecast[dayCount].weather.push(data.list[i].weather[0].main);
                    fullForecast[dayCount].temp.push(data.list[i].main.temp);
                    fullForecast[dayCount].humidity.push(data.list[i].main.humidity);
                    fullForecast[dayCount].windSpeed.push(data.list[i].wind.speed);
                  }
                }
                console.log(fullForecast);
                console.log(data)

                //consolidate fullforecast arrays
                for (let i = 0; i < fullForecast.length; i++) {
                  var day = fullForecast[i];
                  
                  //set the weather value as a string
                  day.weather = day.weather.sort((a,b) => 
                      day.weather.filter(val => val === a).length 
                      - day.weather.filter(val => val === b).length
                      ).pop();
                }
              });
          });
    }
});