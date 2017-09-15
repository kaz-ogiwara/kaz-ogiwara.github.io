<?php require_once(dirname(__FILE__) . "/../../php/header.php"); ?>
		<title>140 Years of Temperature in Tokyo</title>
		<div id="tooltip">
			<div id="tooltip-inner"></div>
		</div>
		<div class="container">
			<div id="section-title">
				<h1>140 Years of Temperature in Tokyo</h1>
				<p>Mapped average temperatures on each day in Tokyo from 1876 to 2015.</p>
				<p>Similar to other cities in the world, Tokyo is gradually becoming hotter.</p>
				<p>Now the city has longer / hotter summer and shorter / warmer winter than 140 years ago.</p>
			</div>
		</div>
		<div id="heatmap-wrapper">
			<div id="heatmap"></div>
		</div>
		<div class="container">
			<div id="footer">
				<p>- Data source: <a href="http://www.jma.go.jp/" target="_blank">Japan Meteorological Agency</a></p>
				<p>- Data was collected by using PHP, then processed by using SQL)</p>
				<p>- Place: Tokyo lat. 35°41.5′ North / long. 139°45.0′ East</p>
				<p>- Reference values are treated as usual</p>
				<p>- Empty when the value is unmeasurable (ex. 24 Dec 1880)</p>
				<p>- Intercalary days (29 Februrary) are not indicated</p>
			</div>
		</div>
		<style>
			body{
				background-color: #555;
				background-image: url(tweed.png)
			}
			
			h1,p,a {
				color: #fdfdfd;
			}
			
			.container{
				margin: auto;
				width: 96%;
				max-width: 800px;
			}
			
			#section-title {
				padding-bottom: 40px;
			}
			
			#section-title h1 {
				font-size: xx-large;
				margin-top: 40px;
				margin-bottom: 20px;
			}
			
			#footer {
				margin-top: 40px;
				margin-bottom: 30px;
			}
			
			#heatmap-wrapper {
				width: 100%;
				padding: 40px 10px 10px 60px;
			}
			
			#heatmap {
				margin: 0;
				padding: 0;
				border: 0;
				display: grid;
				grid-template-columns:
					4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px
					4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px
					4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px
					4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px 4px;
			}
			
			#heatmap d {
				position: relative;
				border: none;
				width: 4px;
			}
			
			#heatmap v {
				position: relative;
				display: block;
				border: none;
				width: 4px;
				height: 4px;
        border-top: 1px solid #999;
        border-right: 1px solid #999;
			}
			
			v.selected {
				background-color: #fff !important;
			}

			#tooltip {
				position: fixed;
				box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
				text-align: center;
				display: none;
				padding: 15px;
				background-color: #fdfdfd;
				border-radius: 5px;
				z-index: 60;
			}
			
			#tooltip * {
				color: #333;
			}

			.b{
				font-weight: bold;
			}
			
			line {
				position: absolute;
				width: 0;
				height: 0;
				border-bottom: 1px solid #bbb;
				border-left: 1px solid #bbb;
			}
			
			line.v   {height: 3px; top: 34px;}
			line.h   {width:  3px; left: 54px;}
			line.v.l {height: 7px; top: 30px;}
			line.h.l {width:  7px; left: 50px;}

			.legend {
				position: absolute;
				width: 80px;
				height: 20px;
				margin-left: -40px;
				margin-top: -8px;
				top: 20px;
				left: 28px;
				text-align: center;
				color: #fdfdfd;
				font-size: small;
			}
			
		</style>
		<script>
			function cMonth(m) {
        switch(m) {
					case  "1": return "Jan"; break;
					case  "2": return "Feb"; break;
					case  "3": return "Mar"; break;
					case  "4": return "Apr"; break;
					case  "5": return "May"; break;
					case  "6": return "Jun"; break;
					case  "7": return "Jul"; break;
					case  "8": return "Aug"; break;
					case  "9": return "Sep"; break;
					case "10": return "Oct"; break;
					case "11": return "Nov"; break;
					case "12": return "Dec"; break;
					default: return ""
				}
      }
			
      // The same function as map in Processing
      function map(value, low1, high1, low2, high2) {
        var ret = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
        //if (ret > high2) {ret = high2;}
        //if (ret < low2)  {ret = low2;}
        return ret;
      }
      
			function getColor(value) {
/*
				var r,g,b;

        r = map(value,  5, 20,   0, 255);
        if (value <= 25) {g = map(value,  0, 10, 100, 255);}
        if (value >  25) {g = map(value, 25, 40, 255, 0);}
        b = map(value, 10, 30, 255, 0);

        var str = "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";
        // console.log(value + ": " + str);
*/
        if (value <= 0.0) {str = "#0066ff";}
        if ( 0.0 < value && value <=  5.0) {str = "#00ccff";}
        if ( 5.0 < value && value <= 10.0) {str = "#66ffff";}
        if (10.0 < value && value <= 15.0) {str = "#66ff66";}
        if (15.0 < value && value <= 20.0) {str = "#ccff33";}
        if (20.0 < value && value <= 25.0) {str = "#ffffcc";}
        if (25.0 < value && value <= 30.0) {str = "#ffcc00";}
        if (30.0 < value && value <= 35.0) {str = "#ff6600";}
        if (35.0 < value) {str = "#ff3300";}

				return str;
      }
			
			$(function(){
				$.getJSON("data.json" , function(data) {
					
					// Add cells
					$.each(data, function(key, val) {
						var values = "";
						
						$.each(val[2], function(key2, val2) {
							values += '<v y="' + val2[0] + '" v="' + val2[1] + '"/>';
						});
						
						$("#heatmap").append('<d m="' + val[0] + '" d="' + val[1] + '">' + values + '</d>');

						$("#heatmap").find("d:last").find("v").each(function(){
							var value = $(this).attr("v");
							var color = getColor(value);
							$(this).css("background-color", color);
							if (value == null || value == "") {$(this).css("background-color","#eee");}
						});
					});
					
					// Add vertical lines and legends (Jan - Dec)
					for (var i = 1; i <= 241; i++) {
						var x = map(i, 1, 241, 60, (4 * 365) + 60);
						$("#heatmap-wrapper").append('<line class="v" />');
						var line = $("line.v:last");
						line.css("left", x + "px");
						
						if (i % 10 === 1) {
              line.addClass("l");
            }

						if (i % 20 === 11) {
							var idx = (i + 9) / 20;
							var str = cMonth(idx.toString());
							$("#heatmap-wrapper").append('<div class="legend month">' + str + '</div>');
							$(".legend.month:last").css("left", x + "px");
            }
          }
					
					// Add horizontal lines and legends (1876 - 2015)
					for (var i = 0; i <= 70; i++) {
						var y = map(i, 0, 70, 40, (140 * 4) + 40);
						if (i === 70) {y = y - 1;}
						
						$("#heatmap-wrapper").append('<line class="h" />');
						var line = $("line.h:last");
						line.css("top", y + "px");
						
						if (i % 5 === 0) {
              				line.addClass("l");
            			}

						if (i % 10 === 0) {
							var yy = (i * 2) + 1876;
							if (yy === 2016) {yy = 2015;}
							$("#heatmap-wrapper").append('<div class="legend year">' + yy + '</div>');
							$(".legend.year:last").css("top", y + "px");
            			}
          			}

					$("#cover").fadeOut();
				});
				
				$(document).on("mouseenter touchstart", "v", function(){
					var MIN_YEAR = 1876;
					var index	= $(this).closest("d").index(this);
					var tYear	= parseInt($(this).attr("y")) + MIN_YEAR;
					var tMonth	= $(this).closest("d").attr("m");
					var tDay	= $(this).closest("d").attr("d");
					var tVal	= $(this).attr("v");
					
					$(this).addClass("selected");
					$("#tooltip-inner").html(
						tDay + " " + cMonth(tMonth) + " " + tYear + "<br><span class='b'>" + tVal + "°C</span>"
					);

					var cellX = $(this).offset().left;
					var cellY = $(this).offset().top - $(window).scrollTop();
					
					var left = cellX + 30;
					var top  = cellY - ($("#tooltip").height() / 2) - 10;
					if (cellX > 600) {
						left = cellX - $("#tooltip").width() - 40;
					}
					
					$("#tooltip").css("left", left);
					$("#tooltip").css("top",  top);
					$("#tooltip").show();
				});

				$(document).on("mouseleave", "v", function(){
					$("#tooltip").hide();
					$(this).removeClass("selected");
				});

			});
		</script>
<?php require_once(dirname(__FILE__) . "/../../php/footer.php"); ?>

