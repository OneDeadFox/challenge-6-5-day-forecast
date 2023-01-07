//position stack api access key ba7a6538984170b23d612af3e809e197

//todo: have the city input bar fetch location data from position stack and weather data from open weather
//todo: load weather data from open weather into top div of main
//todo: load 5 day forcast data from open weather to 5 cards in main div
//todo: store previous searches in search history which displays in list below search bar.
//todo: on history item click load the current and 5 day weather data for specified location

$ (function (){
    let searchButton = $('search-btn');
    let searchCrit = $('search-criteria')

    searchButton.on('click', function(e){
        var input = searchCrit.val();
        console.log(input);
    });
});