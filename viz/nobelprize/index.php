<?php require_once(dirname(__FILE__) . "/../../php/header.php"); ?>
    <style>
      * {
        color: #666;
      }
      
      html,body {
        text-align: center;
        font-size: small;
        background-color: #fefefe;
        background-image: url(background.png);
      }

      .select,button {
        border: 1px solid #eee;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        transition: all 0.3s !important;
        -webkit-transition: all 0.3s !important;
      }
      
      .select:hover,button:hover {
        cursor: pointer;
        box-shadow: 0 2px 3px rgba(0,0,0,0.4);
      }
      
      #section-title {
        width: 100%;
        background-image: url(title-background.jpg);
        background-size: cover;
        background-position: bottom center;
        background-repeat: no-repeat;
        background-size: cover;
        background-attachment: fixed;
        filter: grayscale(100%);
        box-shadow: 0 2px 4px rgba(0,0,0,0.4);
      }
      
      #section-title * {
        color: #fefefe;
      }
      
      #section-title .cover {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(20,40,90,0.8);
      }
      
      #section-title h1{
        padding-top: 80px;
      }
      
      #explanation {
        margin: 0 auto;
        padding-top: 80px;
        padding-bottom: 80px;
        width: calc(100% - 96px);
        max-width: 800px;
        text-align: left;
      }
      
      #explanation p {
        line-height: 2em;
      }

      .container {
        position: relative;
        margin: 0 auto;
        width: calc(100% - 96px);
        max-width: 800px;
      }
      
      #controller {
        padding: 40px 0 0 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
      
      .select-caption {
        text-align: left;
        margin-left: calc(50% - 115px);
      }
      
      .select {
        width: 240px;
        height: 28px;
        border-radius: 15px;
        overflow: hidden;
        padding-left: 26px;
        margin: auto;
        background-image: url("caret.png");
        background-repeat: no-repeat;
        background-position: 94% center;
        background-color: #fefefe;
      }
      
      select:hover {
        cursor: pointer;
      }
      
      .select-color {
        position: absolute;
        top: 7px;
        left: 7px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #fff;
      }
      
      select {
        outline: none;
        border: none;
        background: transparent;
        font-size: medium;
        height: 29px;
        padding: 5px;
        width: 268px;
      }
      
      #notes {
        height: 60px;
        padding-top: 20px;
        text-align: left;
      }
      
      #laureates-box {
        margin-bottom: 60px;
        position: relative;
        margin: 0 auto;
        width: 100%;
        max-width: 720px;
        z-index: 10;
      }
      
      #laureates-box:before {
        content:"";
        display: block;
        padding-top: 60%;
      }

      #laureates {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 20;
        
        display: grid;
        /* from 1901 to 2016: 116 columns */
        grid-template-columns:
          1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr
          1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr
          1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr
          1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr
          1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr
          1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      }
      
      .vertical {
        width: 100%;
        height: 432px;
        z-index: 50;
      }
      
      .vertical:hover{
        background-color: rgba(200,210,230,0.5);
      }

      .laureate {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        z-index: 60;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 0 0;
        -webkit-transition: all 0.1s;
        -moz-transition: all 0.1s;
        -o-transition: all 0.1s;
        transition: all 0.1s;
      }

      .laureate.selected {
        position: absolute;
        width: 60px;
        height: 60px;
        margin-left: -26px;
        margin-bottom: -26px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        background-size: cover;
        z-index: 70;
      }

      .laureate.selected:hover {
        cursor: pointer;
      }
      
      #detail-box {
        position: fixed;
        background-color: rgba(0,0,0,0.8);
        color: #f0f0f0;
        padding: 10px;
        display: none;
        z-index: 50;
        bottom: 10px;
        right: 10px;
        width: 300px;
      }

      #detail-box div {
        color: rgba(255,255,255,0.8);
        font-size: x-small;
        text-align: left;
      }
      
      #detail-box .title {
        color: rgba(255,255,255,0.9);
        font-size: medium;
        text-align: center;
        margin-bottom: 20px;
      }
      
      #detail-box .picture {
        margin: auto;
        width: 60px;
        height: 60px;
        border: 1px solid rgba(255,255,255,0.8);
        border-radius: 50%;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
      }
      
      #detail-box .info {
        margin-bottom: 20px;
        display: grid;
        grid-template-columns: 90px 190px;
      }
      
      #detail-box .name {
        margin-top: 5px;
        margin-bottom: 10px;
        color: rgba(255,255,255,0.9);
        font-size: small;
      }

      .line {
        position: absolute;
        width: 100%;
        height: 100%;
        border-left: 1px dotted #ccc;
        border-top: 1px dotted #ccc;
        top: 0;
        left: 0;
        z-index: 40;
      }
/*
      .line.v {
        width: 0px;
        height: 5px;
        border-left: 1px solid #ccc;
      }
      
      .line.v.long {
        height: 12px;
      }
*/      
      .line.h {
        height: 0px;
      }

      #legends {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      .legend {
        position: absolute;
        font-size: small;
        width: 40px;
        text-align: center;
        color: #245;
      }
      
      .legend.age {
        left: -40px;
      }

      .legend.year {
        top: -20px;
      }

      canvas {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 30;
      }
      
      .icon {
        display: none;
        position: fixed;
        z-index: 40;
        background-color: #333;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        -webkit-transition: all 0.1s;
        -moz-transition: all 0.1s;
        -o-transition: all 0.1s;
        transition: all 0.1s;
      }
      
      #footer {
        text-align: left;
        margin-top: 40px;
        margin-bottom: 40px;
      }
    </style>
		<title>Scientists Making a Queue: How Nobel Prize laureates are Getting Older</title>
    <div id="section-title">
      <div class="cover"></div>
      <h1>Scientists Making a Queue:<br>How Nobel Prize laureates are Getting Older</h1>
      <div id="explanation">
        <p>Nobel Prize winners in natural sciences are gradually getting older.</p>
        <p>In Physics, for example, the latest 10 laureates (avg. 71.1) are 23.3 years older than the first 10 (avg. 47.8).</p>
        <p>Here is a visualisation of age and year.</p>
      </div>
    </div>
    <div class="container">
      <div id="controller">
        <div class="select-wrapper">
          <div class="select-caption">Main - laureates and trend line</div>
          <div class="select">
            <div class="select-color" style="opacity: 0.9"></div>
            <select id="select-prize">
            </select>
          </div>
        </div>
        <div class="select-wrapper">
          <div class="select-caption">Sub - pale trend line</div>
          <div class="select">
            <div class="select-color" style="opacity: 0.3"></div>
            <select id="select-prize2">
              <option></option>
            </select>
          </div>
        </div>
      </div>
      <div id="notes"></div>
      <div id="laureates-box">
        <div id="legends"></div>
        <div id="laureates">
          <div id="verticals"></div>
        </div>
      </div>
      <div id="footer">
        <p>- Data source: <a href="http://www.nobelprize.org/" target="_blank">Nobel Prize Official Website</a></p>
        <p>- Trend line is moving average line in the past 30 years</p>
        <p>- Prize in Economic Sciences is also treated as one of Nobel Prizes</p>
      </div>
    </div>
    <div id="detail-box"></div>
    <div class="icon"></div>
    <div class="icon"></div>
    <div class="icon"></div>
    <script src="../../js/default.js"></script>
    <script>
      var minYear = 1901;
      var maxYear = 2016;
      var minAge = 10;
      var maxAge = 90;
      var json;
      var colors = {
        'physics':            [123,   0, 127]
      , 'chemistry':          [ 60,  10, 140]
      , 'medicine':           [  0,  92, 153]
      , 'literature':         [  0, 153, 110]
      , 'peace':              [160, 176,  46]
      , 'economic-sciences':  [153,  95,   0]
      };

      
      var prizes = {
        'physics': 'Physics'
      , 'chemistry': 'Chemistry'
      , 'medicine': 'Medicine'
      , 'literature': 'Literature'
      , 'peace': 'Peace'
      , 'economic-sciences': 'Economic Sciences'
      };

      // The same function as map in Processing
      function map(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
      }
      
      function drawLaureates() {
        var type = $("#select-prize").val();
        var data = json["data"][type];

        // Empty space
        $("#laureates").children().not("canvas").remove();

        // Add horizontal lines and legends
        for (var i = minAge; i <= maxAge; i += 10) {

          var top = map(i, minAge, maxAge, 0, 100);

          if (i !== minAge && i !== maxAge) {
            $("#laureates").append('<div class="line h"></div>');
            $(".h:last").css("top",  top + "%");
          }

          if (i !== maxAge && i !== 10) {
            $("#legends").append('<div class="legend age">' + i + '</div>');
            $(".legend:last").css("top", "calc(100% - " + top + "% - 7px)");
          }
        }

        // Add vertical legends
        for (var i = 0; i <= 6; i++) {
          
          var year = (i * 20) + 1900;
          if (i === 0) {year = minYear;}
          if (i === 6) {year = maxYear;}
          var x = map(year, minYear, maxYear, 0, 100);

          $("#legends").append('<div class="legend year">' + year + '</div>');
          $(".legend:last").css("left", "calc(" + x + "% - 20px)");
        }

        // Add verticals (virtual area for hovering)
        for (var i = minYear; i <= maxYear; i++) {
          var vertical = '<div class="vertical" year="' + i + '"></div>';
          $("#laureates").append(vertical);
/*
          var x = map(i, minYear, maxYear, 0, 100);
          $("#laureates").append('<div class="line v"></div>');
          $(".line.v:last").css("left", "calc(" + x + "%)");
*/
        }
/*
        // Add interruption due to WWII
        $("#laureates").append('<div class="interrupt-bar"></div>');
        $("#laureates").append('<div class="interrupt-legend">Inter</div>');
*/
        // Add laureates
        for (var i = minYear; i <= maxYear; i++) {
          for (var j = 0; j < 3; j++) {
            if (data[i] && data[i][j] && data[i][j]["birthdate"] !== "") {

              var year = i;
              var age  = parseInt((((year * 10000) + 1001) - parseInt(data[i][j]["birthdateN"])) / 10000);

              $("#laureates").append('<div class="laureate ' + year + '" style="background-image:url(' + data[i][j]["imgurl"] + ')"></div>');
              var laureate = $(".laureate:last");
  
              var x = map(year, minYear, maxYear, 0, 100);
              var y = map(age,  minAge,  maxAge,  0, 100);
    
              laureate.css("left",   "calc(" + x + "% * 0.99)");
              laureate.css("bottom", "calc(" + y + "%)");
              
              if (age <= 30) {laureate.css("background-color","#CAF270");}
              if (31 <= age && age <= 40) {laureate.css("background-color","#80DA83");}
              if (41 <= age && age <= 50) {laureate.css("background-color","#43BD93");}
              if (51 <= age && age <= 60) {laureate.css("background-color","#219D98");}
              if (61 <= age && age <= 70) {laureate.css("background-color","#317B8D");}
              if (71 <= age && age <= 80) {laureate.css("background-color","#435A74");}
              if (81 <= age && age <= 90) {laureate.css("background-color","#453B52");}
            }
          }
        }
      }
      
      function addDetail(data) {
        var html = ''
          + '<div class="info">'
            + '<div class="picture" style="background-image:url(' + data["imgurl"] + ')"></div>'
            + '<div>'
              + '<div class="name">' + data["name"] + '</div>';

              if (data["age"] !== "" && data["age"] <= 1000) {
                html += '<div class="awarded">Awarded at the age of ' + data["age"] + '</div>';
              }
              
              if (data["birthdate"] !== "") {
                html += '<div class="born">Born: ' + data["birthdate"] + " at " + data["birthplace"] + '</div>';
              }

              if (data["deathdate"] !== "") {
                html += '<div class="died">Died: ' + data["deathdate"] + " at " + data["deathplace"] + '</div>';
              }

        html += '</div></div>';

        $("#detail-box").append(html);
      }

      function updateSelectColor() {
        $.each($(".select"), function() {
          var value = $(this).find("select").val();
          if (value !== "") {
            var color = colors[value];
            var r = color[0].toString(16); if(r.length === 1){r = "0" + r;}
            var g = color[1].toString(16); if(g.length === 1){g = "0" + g;}
            var b = color[2].toString(16); if(b.length === 1){b = "0" + b;}
            $(this).find(".select-color").css("background-color", "#" + r + g + b);
          } else {
            $(this).find(".select-color").css("background-color", "#fff");
          }
        });
      }
      
      // Events: Load JSON
      $(function(){
        
        $.getJSON("data.json", function(ret) {
          json = ret;
          drawLaureates();
          $.getScript("https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.11/p5.min.js");
          $.getScript("sketch.js");
        });
        
        // Load prizes in select tag
        $.each(prizes, function(value, name) {
          $("#select-prize").append('<option value="' + value + '">' + name + '</option>');
          $("#select-prize2").append('<option value="' + value + '">' + name + '</option>');
        });

        updateSelectColor();

        $("#select-prize,#select-prize2").on("change",function(){
          updateSelectColor();
          drawLaureates();
        });

        var curYear = 0;
        
        // When .vertical is hovered
        $(document).on("mouseenter touchstart", ".vertical", function(){
          var year = $(this).attr("year");
          if (year !== curYear) {
            $(".laureate").removeClass("selected");
            $(".laureate." + year + "").addClass("selected");
          }
          
          // Show detail
          var box = $("#detail-box");
          var type = $("#select-prize").val();
          box.empty();
          box.append('<div class="title">' + prizes[type] + " " + year + '</div>');
          
          if (!json["data"][type][year]) {
            box.append("<p>No laureates in this year</p><br><br><br>")
          } else {
            for (i = 0; i < 3; i++) {
              if (json["data"][type][year][i]) {
                addDetail(json["data"][type][year][i]);
              }
            }
          }

          box.show();
        });

        // When the mouse left from #laureates 
        $(document).on("mouseleave", "#laureates", function(){
          $(".laureate").removeClass("selected");
          $("#detail-box").hide();
        });
        
        // When the mouse left from #laureates 
        $(document).on("click", ".laureate.selected", function(){
          var url = $(this).css("background-image");
          url = url.replace('url("', '');
          url = url.replace('_postcard.jpg")', '');
          url += '-facts.html';
          window.open(url, "_blank");
        });
      });
    </script>
<?php require_once(dirname(__FILE__) . "/../../php/footer.php"); ?>