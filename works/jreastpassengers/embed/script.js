function addCommas(num){
  return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}


function getPopupContent(station){
  var ret =
    '<div class="name">JR ' + station[0] + ' station</div>'
  +	'<div class="label">Average daily passengers:</div>'
  +	'<div class="right">' + addCommas(station[1]) + '</div>'
  ;

  return ret;
}


var kMap = L.map('map').setView([35.679, 139.732], 10);
var kMarkers = [];

L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  maxZoom: 16,
  minZoom: 6
}).addTo(kMap);


$.ajaxSetup({
  cache: false
});


$.getJSON("data.json", function(data){
  $.each(data, function(i, station){
    let num = station[1];
    let kType =  'k1';
    if  (10000 < num) kType = 'k2';
    if  (50000 < num) kType = 'k3';
    if (100000 < num) kType = 'k4';
    if (200000 < num) kType = 'k5';

    kMarkers[i] = L.marker([station[2], station[3]], {icon: L.divIcon({className: 'location ' + kType})})
      .addTo(kMap)
      .bindPopup(getPopupContent(station));
  });
});
