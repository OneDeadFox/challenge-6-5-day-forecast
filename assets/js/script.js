//position stack api access key ba7a6538984170b23d612af3e809e197

//todo: have the city input bar fetch location data from position stack and weather data from open weather
//todo: load weather data from open weather into top div of main
//todo: load 5 day forcast data from open weather to 5 cards in main div
//todo: store previous searches in search history which displays in list below search bar.
//todo: on history item click load the current and 5 day weather data for specified location

$ (function (){
    let searchButton = $('#search-btn');
    let searchCrit = $('#search-criteria')

    searchButton.on('click', function(){
        //user input  
        var input = '&location=' + searchCrit.val();

        //position vars
        var posAccessKey = '?key=ZFD5pPPWBtt5h0OFfjA2eC0JOkZpOdkd'
        var requestPos = 'http://www.mapquestapi.com/geocoding/v1/address';
        var returnedLat;
        var returnedLng;
        requestPos += posAccessKey + input;

        //open weather vars
        var weatherAccessKey = '?access_key=c33d28d593af473e62aaaced9c1ad9cd';

        
        //lat and lon request
        fetch(requestPos)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            returnedLat = data.results[0].locations[0].latLng.lat;
            returnedLng = data.results[0].locations[0].latLng.lng;
            console.log(data.results[0].locations[0].latLng.lat);
            console.log(data.results[0].locations[0].latLng.lng);
            });
    });
});