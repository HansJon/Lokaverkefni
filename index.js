// INITIALIZE AND CENTER MAP
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: 63.986807, lng: -22.627967},
    //mapTypeId: google.maps.MapTypeId.HYBRID,
    styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
  });

  var geocoder = new google.maps.Geocoder();

  $(document).on("click", "#flight-data tr", function(e) {
    geocodeAddress(this.id, geocoder, map);
  });
}

// Get the address location for the airport and mark it on the map
function geocodeAddress(destination, geocoder, resultsMap) {
  var address = destination;
  var localAirport = {lat: 63.986807, lng: -22.627967};

  resultsMap.setCenter(localAirport);

  var markerLocalAirport = new google.maps.Marker({
    map: resultsMap,
    position: localAirport
  });

  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      var destinationAirport = results[0].geometry.location;

      // Get weather by city
        $.ajax({
          'url': 'http://api.openweathermap.org/data/2.5/weather?q=' + address + '&APPID=fc1985651a1e35c2012d94faa3c8f43e',
          'type': 'GET',
          'dataType': 'json',
          success: function(response) {
            //console.log(address + ': ' + response.main.temp);
            console.log(address + ': ' + response.main.temp);
          }
        });

      var contentString = address;

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      var markerDestinationAirport = new google.maps.Marker({
        map: resultsMap,
        position: destinationAirport,
        title: address
      });

      markerDestinationAirport.addListener('click', function() {
        infowindow.open(resultsMap, markerDestinationAirport);
      });


      var flightPlanCoordinates = [
        localAirport,
        destinationAirport
      ];
      var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: 'white',
        strokeOpacity: 1.0,
        strokeWeight: 1
      });

      flightPath.setMap(resultsMap);



    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}


// POPULATE FLIGHT TABLE

$.ajax({
  'url': 'http://apis.is/flight',
  'type': 'GET',
  'dataType': 'json',
  'data': {'language': 'en', 'type': 'departures'},
  success: function(response) {
    console.log(response);
    SetTable(response);
  }
});

function SetTable(data) {
  var d = data.results;

  for (var i = 0; i < d.length; i++) {
  $(  '<tr id="' + d[i].to + '">' +
      '<td>' + d[i].to + '</td>' +
      '<td>' + d[i].airline + '</td>' +
      '<td>' + d[i].date + '</td>' +
      '<td>' + d[i].flightNumber + '</td>' +
      '<td>' + d[i].plannedArrival + '</td>' +
      '<td>' + d[i].realArrival + '</td>' +
      '</tr>'
    ).insertAfter('#table-data');
  }
}