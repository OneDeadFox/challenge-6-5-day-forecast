//position stack api access key ba7a6538984170b23d612af3e809e197

//todo: have the city input bar fetch location data from position stack and weather data from open weather
//todo: load weather data from open weather into top div of main
//todo: load 5 day forcast data from open weather to 5 cards in main div
//todo: store previous searches in search history which displays in list below search bar.
//todo: on history item click load the current and 5 day weather data for specified location

//todo: determine why the image request for banner sometimes fails

$ (function (){
    let searchButton = $('#search-btn');
    var searchList = $('#past-search-list')
    let searchCrit = $('#search-criteria');
    let weatherBanner = $('#weather-banner');
    let forecastDays = $('#forecast-days');
    let oldSearchBtn;
    let weatherIcon;
    let input;

  initialSearch();
  initalizeList();

//Event Listeners------------------------------------------------
    searchButton.on('click', function(){
      //user input
      input = '&location=' + searchCrit.val();  
      fetchForecast();
    });

    searchCrit.keyup(function(e){
        var action = e;
        //check if enter key is pressed
        if(action.which == 13){
          input = '&location=' + searchCrit.val();  
          fetchForecast();
        }
    });

    searchList.on('click', '.custom-btn', function(){      
      var repeatSearchVal = $(this).context.innerText;

      input = '&location=' + repeatSearchVal;
      fetchForecast();
    });



//Functions------------------------------------------------------
    //store input in local storage and initiate search
    function initialSearch(){
      input = "&location=Seattle";
      fetchForecast();
    }

    //fetch location data and use that to fetch weather data
    function fetchForecast(){
      //position vars
      var posAccessKey = 
      '?key=ZFD5pPPWBtt5h0OFfjA2eC0JOkZpOdkd'
      var requestPos = 
      'https://www.mapquestapi.com/geocoding/v1/address';
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

      //response receivers objects
      var weather = {
        city: '',
        date: '', //unix result
        weatherType: '',
        temp: '', //kelvin result
        humidity: '', //add %
        windSpeed: '', //round up add mph
      };
      var fullForecast = [];

      
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

          //fetch current weather data---------------------------
          fetch(requestWeather)
            .then(function(res){
              return res.json();
            })
              .then(function(data){
                //set weather object key values
                weather.city = data.name + ", " + data.sys.country;
                weather.date = dayjs.unix(data.dt).format('MMM DD, YYYY');
                weather.weatherType = data.weather[0].main;
                weather.icon = data.weather[0].icon;
                weather.temp = Math.round(1.8*(data.main.temp - 273) + 32);
                weather.humidity = data.main.humidity;
                weather.windSpeed = Math.round(data.wind.speed);

                //set local storage
                var saveData = [data.name, searchCrit.val()]
                localStorage.setItem(`${data.name}`, JSON.stringify(saveData));
                //call search hisorty function
                if(searchCrit.val() != ''){
                    setSearchHistory(data.name)
                }
                //delete search bar val
                searchCrit.val('');
                setWeatherBannerElement(weather);
              });

          //fetch forecast data----------------------------------
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
                  icon: [],
                  temp: [],
                  humidity: [],
                  windSpeed: []
                };
                var day1 = {
                  date: '',
                  weather: [],
                  icon: [],
                  temp: [],
                  humidity: [],
                  windSpeed: []
                };
                var day2 = {
                  date: '',
                  weather: [],
                  icon: [],
                  temp: [],
                  humidity: [],
                  windSpeed: []
                };
                var day3 = {
                  date: '',
                  weather: [],
                  icon: [],
                  temp: [],
                  humidity: [],
                  windSpeed: []
                };
                var day4 = {
                  date: '',
                  weather: [],
                  icon: [],
                  temp: [],
                  humidity: [],
                  windSpeed: []
                };
                //#endregion Day Objects

                //array to hold 5 day forecast objects
                fullForecast = [day0, day1, day2, day3, day4];

                //set 5 day forecast object values from response-
                for (let i = 0; i < data.list.length; i++) {
                  //set current day to day in index of response array
                  currentDay = dayjs.unix(data.list[i].dt).format('MM/DD/YYYY');
                  
                  //do nothing if currentDate equals today
                  if(currentDay === dayjs().format('MM/DD/YYYY')){}
                  //initialize fullForecast arr
                  else if(fullForecast[0].date == ''){
                    fullForecast[dayCount].date = currentDay;
                    fullForecast[dayCount].weather.push(data.list[i].weather[0].main);
                    fullForecast[dayCount].icon.push(data.list[i].weather[0].icon);
                    fullForecast[dayCount].temp.push(data.list[i].main.temp);
                    fullForecast[dayCount].humidity.push(data.list[i].main.humidity);
                    fullForecast[dayCount].windSpeed.push(data.list[i].wind.speed);
                  }
                  //iterate over fullForecast and add response data to objects
                  else if(currentDay === fullForecast[dayCount].date){
                    fullForecast[dayCount].date = currentDay;
                    fullForecast[dayCount].weather.push(data.list[i].weather[0].main);
                    fullForecast[dayCount].icon.push(data.list[i].weather[0].icon);
                    fullForecast[dayCount].temp.push(data.list[i].main.temp);
                    fullForecast[dayCount].humidity.push(data.list[i].main.humidity);
                    fullForecast[dayCount].windSpeed.push(data.list[i].wind.speed);
                  } 
                  //increase dayCount and set object keys in next day
                  else {
                    dayCount++;
                    fullForecast[dayCount].date = currentDay;
                    fullForecast[dayCount].weather.push(data.list[i].weather[0].main);
                    fullForecast[dayCount].icon.push(data.list[i].weather[0].icon);
                    fullForecast[dayCount].temp.push(data.list[i].main.temp);
                    fullForecast[dayCount].humidity.push(data.list[i].main.humidity);
                    fullForecast[dayCount].windSpeed.push(data.list[i].wind.speed);
                  }
                }

                //consolidate fullforecast arrays----------------
                for (let i = 0; i < fullForecast.length; i++) {
                  var day = fullForecast[i];
                  
                  //set the weather value as a string
                  day.weather = day.weather.sort((a,b) => 
                      day.weather.filter(val => val === a).length 
                      - day.weather.filter(val => val === b).length
                      ).pop();
                  day.icon = day.icon.sort((a,b) => 
                      day.icon.filter(val => val === a).length 
                      - day.icon.filter(val => val === b).length
                      ).pop();
                  day.temp = Math.round(1.8*((day.temp.reduce((a, b) => a + b) / day.temp.length) - 273) + 32);
                  day.humidity = Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length);
                  day.windSpeed = Math.round(day.windSpeed.reduce((a, b) => a + b) / day.windSpeed.length);

                }
                setForecastElements(fullForecast);
              });
          });
    }

    //display fetched data in weather banner
    function setWeatherBannerElement(el){
      weatherIcon = $('<img id="banner-img">');
      weatherIcon.attr('src', `http://openweathermap.org/img/wn/${el.icon}@2x.png`)

      //set banner heading
      weatherBanner.children('#city-date-weather').text(el.city + ' - ' + el.date + ' ' + el.weatherType);
      weatherBanner.children('#city-date-weather').append(weatherIcon)

      //set banner details
      weatherBanner.children('#banner-temp').text('Temp: ' + el.temp + '℉');
      weatherBanner.children('#banner-humidity').text('Humidity: ' + el.humidity + '%');
      weatherBanner.children('#banner-wind').text('Wind: ' + el.windSpeed + 'MPH');
    }

    //display fetched data in forecast cards
    function setForecastElements(arr){
      $('.card').remove();
      var forecastDays = $('#forecast-days')

      //set card items
      for (let i = 0; i < arr.length; i++) {
        //set card icon
        var card = $('<div class="col-2 card custom-card">');
        var cardIcon = $(`<img id="card-icon-${i}">`);
        cardIcon.attr('src', `http://openweathermap.org/img/wn/${arr[i].icon}@2x.png`);
        cardIcon.attr('class', 'card-img');
        
        //set card values
        card.attr('id', `day${i}`);

        //set date
        card.append(`<p id="card${i}-date" class="card-item bold">`);
        card.children(`#card${i}-date`).text(arr[i].date);

        //set weather
        card.append(`<p id="card${i}-weather" class="card-item">`);
        card.children(`#card${i}-weather`).text(arr[i].weather + ' ');
        card.children(`#card${i}-weather`).append(cardIcon);

        //set temp
        card.append(`<p id="card${i}-temp" class="card-item">`);
        card.children(`#card${i}-temp`).text('Temp: ' + arr[i].temp + '℉');

        //set humidity
        card.append(`<p id="card${i}-humidity" class="card-item">`);
        card.children(`#card${i}-humidity`).text('Humidity: ' + arr[i].humidity + '%');

        //set wind
        card.append(`<p id="card${i}-wind" class="card-item">`);
        card.children(`#card${i}-wind`).text('Wind: ' + arr[i].windSpeed + 'MPH');
        
        forecastDays.append(card);
      }
    }

    //create past search buttons
    function setSearchHistory(cityName){
      var pastitems = $('.search-item') 
      let pastSearches = JSON.parse(localStorage.getItem('currentList'));

      //get stored info
      var fetchedArr = JSON.parse(localStorage.getItem(`${cityName}`));

      //get desired item from stored array
      var fetchedCity = fetchedArr[0];
      
      //find duplicates re reduce redundancy
      if(pastSearches != null){
        console.log('in here');
        var duplicate = pastSearches.indexOf(fetchedCity);

        //put repeated search back at top and remove previous instance
        if(duplicate != -1){
          pastSearches.splice(duplicate, 1);
          pastSearches.unshift(fetchedCity);
        }else{
          pastSearches.unshift(fetchedCity);
        }
      }else{
        pastSearches = [];
        pastSearches.unshift(fetchedCity);
      }

      //delete old list items
      pastitems.remove();

      //make new list
      fillList(pastSearches);
      
    }

    function fillList(arr){ 
      if(arr != null){
        for (let i = 0; i < arr.length; i++) {
          var searchItem = $('<li class="search-item">');
          var itemButton = $('<button type="button" class="btn btn-light custom-btn">');
          var el = arr[i];
          
          //remove any element that would exist over index 5
          while (arr.length > 6) {
            arr.pop();
          }

          //add elements to page
          itemButton.text(el);
          searchItem.append(itemButton);
          searchList.append(searchItem);
          oldSearchBtn = $('.custom-btn');
        }
      }
    //save array to local storage
    localStorage.setItem('currentList', JSON.stringify(arr));
    }

    function initalizeList(){
      var oldList = JSON.parse(localStorage.getItem('currentList'))

      fillList(oldList);
    }
    
});
//ls nuke
//localStorage.clear();
