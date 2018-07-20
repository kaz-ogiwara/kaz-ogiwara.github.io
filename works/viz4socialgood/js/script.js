var kCountryCode = "";


function addCommas(num){
  return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}



function drawMap() {
  Highcharts.mapChart('gc-map', {
    chart: {
      map: 'custom/world',
      backgroundColor: 'transparent'
    },
    title: {
      text: null
    },
    legend: {
      enabled: false
    },
    colors: ['#f64'],
    credits: {
      enabled: false
    },
    series: [{
      data: [
        [kCountryCode, 1]
      ]
    }]
  });
}

function drawMapWithData(code){
  kCountryCode = code.toLowerCase();
  drawMap();
}



/*
function updateInfo(kType, kCode, kValue, kName){
  $("#info-block").empty();
  $("#info-block").removeClass("show");

  $("#info-block").append("<p>ABC</p>");


  $("#info-block").addClass("show");


}
*/








