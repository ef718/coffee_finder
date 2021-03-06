$(function() {
  var coffeeShops = [];

  // Event listener for submit button.
  $('[type=submit]').on("click", function(evt) {
    evt.preventDefault();

    // Clear list of coffee shops if necessary.
    $('#list').html('');

    // List out coffee shops.
    getCoffee();

    // Clear form inputs.
    $('form').trigger('reset');
   });


  // Retrieve 10 nearby coffee shops.
  function getCoffee() {

    // Retrieve data from form.
    var enteredAddress = $('[name=street]').val() + ' ' + $('[name=city]').val() + ' ' + $('[name=state]').val();

    // Reformat data for Google's Geocoding API.
    var reformattedAddress = enteredAddress.split(' ').join('+');

    // Retrieve coordinates for address using Geocoding API.
    var latitude = '';
    var longitude = '';
    var latlong = '';
    $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + reformattedAddress, function(data) {

      latitude = data["results"][0]["geometry"]["location"]["lat"].toFixed(2);
      longitude = data["results"][0]["geometry"]["location"]["lng"].toFixed(2);

    }).then(function() {

      // Reformat latitude and longitude for FourSquare's API.
      latlong = latitude + ',' + longitude;

    }).then(function() {

      // Retrieve 10 coffee shops using FourSquare's Venue Search API.
      var url = 'https://api.foursquare.com/v2/venues/search?categoryId=4bf58dd8d48988d1e0931735&radius=5000&intent=checkin&ll=' + latlong + '&client_id=4YTT5GDS35ESCRRB1RT500AZEUSXK2KRPI3YELXLJTQBRQS0&client_secret=SGJ4YO3LOEPKALUV01SA11GDSF1LUUVRBNLCZ1Q52JNPW2RE&v=20141012&limit=50';
      $.get(url, function(data) {
        coffeeShops = data["response"]["venues"];

      }).then(function() {

        // Sort shops by distance.
        var sortedCoffeeShops = coffeeShops.sort(function (a, b) {
          if (a.location.distance > b.location.distance) {
            return 1;
          } else if (a.location.distance < b.location.distance) {
            return -1;
          } else {
            return 0;
          }
        });

        // Append coffee shops to page.
        $('#list').append('<h2>Nearby Coffee Shops:</h2>');
        for (var i = 0; i < 10; i++) {
          var shopName = sortedCoffeeShops[i]["name"];
          var shopAddress = sortedCoffeeShops[i]["location"]["formattedAddress"];
          var html = '<div class="shop"><h3>' + shopName + '</h3><p>' + shopAddress[0] + '</p><p>' + shopAddress[1] + '</p></div>';
          $('#list').append(html);
        }
      });
    });
  }
});
