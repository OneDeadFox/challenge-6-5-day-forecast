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

    searchButton.on('click', function(){
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

        //lat={lat}&lon={lon}&appid={API key}

        
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
                  weather.date = dayjs(data.dt);
                  weather.weatherType = data.weather.main;
                  weather.temp = 1.8*(data.main.temp - 273) + 32;
                  weather.humidity = data.main.humidity;
                  weather.windSpeed = data.wind.speed;

                  console.log(weather);
                });

            //fetch forecast data
            fetch(requestForecast)
              .then(function(res){
                return res.json();
              })
                .then(function(data){
                  console.log(data);
                });
            });
    });
});