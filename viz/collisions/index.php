<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.1/leaflet.css" rel="stylesheet" />
    <title>Vehicle collisions in Edinburgh</title>
    <style>
      *{
        margin: 0;
        color: rgba(255,255,255,0.9);
        font-family: Helvetica;
      }
      
      html,body,#content,#map{
        width: 100%;
        height: 100%;
      }
      
      #detail-block{
        z-index: 50;
        position: fixed;
        width: 20%;
        height: 100%;
        top: 0;
        right: -25%;
        background-color: rgba(0,0,0,0.7);
        padding: 10px;
        font-size: small;
        
        -webkit-transition: right 0.5s;
        -moz-transition: right 0.5s;
        -o-transition: right 0.5s;
        -ms-transition: right 0.5s;
        transition: right 0.5s;
      }
      
      .detail-title{
        padding-top: 10px;
        font-size: x-small;
        color: rgba(255,255,255,0.7);
      }
      
      #title-block{
        z-index: 50;
        position: fixed;
        top: 0;
        left: 0;
        padding: 10px;
        color: rgba(255,255,255,0.7);
        font-size: small;
        text-shadow:
            rgba(0,0,0,0.8) 1px 1px 0px,
            rgba(0,0,0,0.8) -1px 1px 0px,
            rgba(0,0,0,0.8) 1px -1px 0px,
            rgba(0,0,0,0.8) -1px -1px 0px;
      }
      
      #title-block h1{
        font-size: x-large;
        color: rgba(255,255,255,0.95);
      }
      
      #check-block{
        z-index: 50;
        position: fixed;
        bottom: 10px;
        left: 10px;
        padding: 10px;
        background-color: rgba(0,0,0,0.7);
        color: rgba(255,255,255,0.8);
        font-size: x-small;
        text-shadow:
            rgba(0,0,0,0.8) 1px 1px 0px,
            rgba(0,0,0,0.8) -1px 1px 0px,
            rgba(0,0,0,0.8) 1px -1px 0px,
            rgba(0,0,0,0.8) -1px -1px 0px;
      }
      
      #check-block .check-column{
        min-height: 100px;
        float: left;
        margin-right: 2em;
      }

      #check-block .column-title{
        color: rgba(255,255,255,0.9);
        font-size: small;
        margin-bottom: 1em;
      }
      
      .checkbox-wrapper{
        width: 100%;
        height: 3em;
        line-height: 1.5em;
      }

      .checkbox {
        width: 1em;
        height: 1em;
        border: 1px solid rgba(255,255,255,0.9);
        border-radius: 2px;
        margin: 2px 5px 0 0;
        float: left;
      }

      .checkbox.selected{
        background-color: rgba(150,255,150,0.9);
      }
      
      .checkbox-wrapper input{
        display: none;
      }

      .checkbox-wrapper:hover{
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div id="content">
      <div id="map"></div>
    </div>
    <div id="title-block">
      <h1>Vehicle collisions in Edinburgh</h1>
      <br>
      <p>- Motor vehicle collisions in Edinburgh, 2012</p>
      <p>- You can see detail information of each accident by clicking</p>
      <br>
      <p>Data source: <a href="http://data.edinburghopendata.info/dataset/vehicle-collisions" target="_blank">Edinburgh Open Data</a></p>
      <p>Map API: <a href="https://www.eegeo.com" target="_blank">eegeo</a></p>
    </div>
    <div id="check-block">
      <div class="check-column" name="severity" value="all">
        <div class="column-title">Severity</div>
        <div class="checkbox-wrapper"><div class="checkbox selected" value="all"></div><input type="checkbox"> All</div>
        <div class="checkbox-wrapper"><div class="checkbox" value="slight"></div><input type="checkbox"> Slight</div>
        <div class="checkbox-wrapper"><div class="checkbox" value="serious"></div><input type="checkbox"> Serious</div>
        <div class="checkbox-wrapper"><div class="checkbox" value="fatal"></div><input type="checkbox"> Fatal</div>
      </div>
      <div class="check-column" name="weather" value="all">
        <div class="column-title">Weather</div>
        <div class="checkbox-wrapper"><div class="checkbox selected" value="all"></div><input type="checkbox"> All</div>
        <div class="checkbox-wrapper"><div class="checkbox" value="fine"></div><input type="checkbox"> Fine</div>
        <div class="checkbox-wrapper"><div class="checkbox" value="raining"></div><input type="checkbox"> Raining</div>
      </div>
      <div class="check-column" name="light" value="all">
        <div class="column-title">Light</div>
        <div class="checkbox-wrapper"><div class="checkbox selected" value="all"></div><input type="checkbox"> All</div>
        <div class="checkbox-wrapper"><div class="checkbox" value="daylight"></div><input type="checkbox"> Daylight</div>
        <div class="checkbox-wrapper"><div class="checkbox" value="darkness"></div><input type="checkbox"> Darkness</div>
      </div>
    </div>
    <div id="detail-block">
      <div class="detail-title">Severity:</div>
      <div id="detail-severity"></div>
      <div class="detail-title">Number of Vehicles:</div>
      <div id="detail-vehicles"></div>
      <div class="detail-title">Number of casualty:</div>
      <div id="detail-casualty"></div>
      <div class="detail-title">Date time:</div>
      <div id="detail-date"></div>
      <div class="detail-title">Road type:</div>
      <div id="detail-roadType"></div>
      <div class="detail-title">Speed limit:</div>
      <div id="detail-limit"></div>
      <div class="detail-title">Junction det:</div>
      <div id="detail-junc_det"></div>
      <div class="detail-title">Junction control:</div>
      <div id="detail-junc_ctrl"></div>
      <div class="detail-title">Light condition:</div>
      <div id="detail-light"></div>
      <div class="detail-title">Weather:</div>
      <div id="detail-weather"></div>
      <div class="detail-title">Road surface:</div>
      <div id="detail-surface"></div>
    </div>
    <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/0.8.3/jquery.csv.min.js"></script>
    <script src="https://cdn-webgl.eegeo.com/eegeojs/early_access/latest/eegeo.js"></script>
    <script>
      var csvList;
      var map;
      var markers = [];
      var isMarkerClicked = false;

      var icon1 = L.icon({
        iconUrl: 'img/icon1.png',
        iconSize: [40, 40]
      });
      
      var icon2 = L.icon({
        iconUrl: 'img/icon2.png',
        iconSize: [40, 40]
      });
      
      var icon3 = L.icon({
        iconUrl: 'img/icon3.png',
        iconSize: [40, 40]
      });
      
      // severity:
      // Slight
      // Serious
      // Fatal
      
      // Light condition:
      // Darkness: ...
      // Daylight: ...
      
      // Weather:
      // Fine (without high winds)
      // Fine with high winds
      // Fog (or mist if hazard)
      // Other
      // Raining (without high winds)
      // Raining with high winds
      // Snowing (without high winds)
      // Unknown

      function convertFlag(name, value) {
        if (name === "severity") {
          return value.toLowerCase();
        }
        
        if (name === "light") {
          return value.substr(0, 8).toLowerCase();
        }

        if (name === "weather") {
          if (value.substr(0, 4) === "Fine")    {return "fine";}
          if (value.substr(0, 3) === "Fog")     {return "other";}
          if (value.substr(0, 5) === "Other")   {return "other";}
          if (value.substr(0, 7) === "Raining") {return "raining";}
          if (value.substr(0, 7) === "Snowing") {return "other";}
          if (value.substr(0, 7) === "Unknown") {return "other";}
        }
      }

      function init() {

        map = L.eeGeo.map("map", "ac2bb8f79140222c0c434eca137fd327", {
          center: [55.9446152, -3.1872792]
        , zoom: 16
        });
        
        // Weathers:
        // L.eeGeo.themes.weather.Clear
        // L.eeGeo.themes.weather.Overcast
        // L.eeGeo.themes.weather.Rainy
        // L.eeGeo.themes.weather.Snowy
        
        // Times:
        // L.eeGeo.themes.time.Dawn
        // L.eeGeo.themes.time.Day
        // L.eeGeo.themes.time.Dusk
        // L.eeGeo.themes.time.Night
        
        map.themes.setWeather(L.eeGeo.themes.weather.Overcast);
        map.themes.setTime(L.eeGeo.themes.time.Dawn);

      	for (var i = 1; i < csvList.length; i++) {
          var loc = csvList[i][38].split(",");
          var lat = loc[0];
          var lng = loc[1];
          var _severity = convertFlag("severity", csvList[i][2]);
          var _light    = convertFlag("light",    csvList[i][21]);
          var _weather  = convertFlag("weather",  csvList[i][22]);
          var myIcon;
          
          if (_severity === "slight")   {myIcon = icon1;}
          if (_severity === "serious")  {myIcon = icon2;}
          if (_severity === "fatal")    {myIcon = icon3;}
          
          markers[i] = L.eeGeo.marker([lat, lng], {
            index: i
          , severity: _severity
          , light: _light
          , weather: _weather
          , icon: myIcon
          }).addTo(map);
          
          markers[i].on('click', function() {

            var i = parseInt(this.options.index);
            if (markers[i].options.opacity == 1) {
              showAccident(i);
            }
            
            isMarkerClicked = true;
          });
        }
      }
      
      function showMarkers() {
        
        for (var i = 1; i < markers.length; i++) {
          var num = 0;

          if ($(".check-column[name='severity']").attr("value") === "all" || $(".check-column[name='severity']").attr("value") === markers[i].options.severity) {
            num++;
          }
        
          if ($(".check-column[name='light']").attr("value") === "all" || $(".check-column[name='light']").attr("value") === markers[i].options.light) {
            num++;
          }

          if ($(".check-column[name='weather']").attr("value") === "all" || $(".check-column[name='weather']").attr("value") === markers[i].options.weather) {
            num++;
          }

          if (num === 3) {
            markers[i].setOpacity(1);
          } else {
            markers[i].setOpacity(0);
          }
        }
      }
      
      function showAccident(i){
        var severity	= csvList[i][2];	// severity
        var vehicles  = csvList[i][3];	// number of vehicles
        var casualty  = csvList[i][4];	// number of casualty
        var date			= csvList[i][5];	
        var hour			= csvList[i][10];
        var minute		= csvList[i][11];
        var roadType	= csvList[i][15];
        var limit			= csvList[i][16];
        var junc_det	= csvList[i][17];
        var junc_ctrl	= csvList[i][18];
        var light			= csvList[i][21];
        var weather		= csvList[i][22];
        var surface		= csvList[i][23];
        
        $("#detail-severity").text(severity);
        $("#detail-vehicles").text(vehicles);
        $("#detail-casualty").text(casualty);
        $("#detail-date").text(date + " " + hour + ":" + minute);
        $("#detail-roadType").text(roadType);
        $("#detail-limit").text(limit);
        $("#detail-junc_det").text(junc_det);
        $("#detail-junc_ctrl").text(junc_ctrl);
        $("#detail-light").text(light);
        $("#detail-weather").text(weather);
        $("#detail-surface").text(surface);
        
        $("#detail-block").css("right", "0");
      }
      
      function hideAccident(){
        $("#detail-block").css("right", "-25%");
      }
      
      $(function(){
        $.ajax({
          url: 'data/accidentlocations.csv',
          success: function(data) {
            csvList = $.csv.toArrays(data);
            init();
          }
        });



        $(".checkbox-wrapper").on("click",function(){
          $(this).closest(".check-column").find(".checkbox").removeClass("selected");
          $(this).closest(".check-column").find("input").prop("checked",false);

          $(this).find(".checkbox").addClass("selected");
          $(this).find("input").prop("checked",true);
          
          $(this).closest(".check-column").attr("value", $(this).find(".checkbox").attr("value"));
          
          if ($(this).closest(".check-column").attr("name") === "weather") {
            
            if ($(this).find(".checkbox").attr("value") === "all") {
              map.themes.setWeather(L.eeGeo.themes.weather.Overcast);
            }
  
            if ($(this).find(".checkbox").attr("value") === "fine") {
              map.themes.setWeather(L.eeGeo.themes.weather.Clear);
            }
  
            if ($(this).find(".checkbox").attr("value") === "raining") {
              map.themes.setWeather(L.eeGeo.themes.weather.Rainy);
            }
          }
          
          if ($(this).closest(".check-column").attr("name") === "light") {
            if ($(this).find(".checkbox").attr("value") === "all") {
              map.themes.setTime(L.eeGeo.themes.time.Dawn);
            }
  
            if ($(this).find(".checkbox").attr("value") === "daylight") {
              map.themes.setTime(L.eeGeo.themes.time.Day);
            }
  
            if ($(this).find(".checkbox").attr("value") === "darkness") {
              map.themes.setTime(L.eeGeo.themes.time.Night);
            }
          }

          showMarkers();
        });
        
        $("#map").on("click",function(){
          
          if (!isMarkerClicked) {
            hideAccident();
          }

          isMarkerClicked = false;
        });
      });
    </script>
  </body>
</html>
