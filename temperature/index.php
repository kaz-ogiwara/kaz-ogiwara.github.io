<?php
	if (!isset($_GET["key"]) || $_GET["key"] != "ECRaM2iMa6h35ter3RY6") {
		exit();
	}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<title>140 Years of Temperature in Tokyo</title>
		<script type="text/javascript" src="../assets/js/jquery-2.2.1.min.js"></script>
	</head>
	<body>
		<div id="tooltip">
			<div id="tooltip-inner"></div>
		</div>
		<div id="container">
			<div id="row">
				<h2>140 Years of Temperature in Tokyo</h2>
				<h4>Kazuki OGIWARA</h4>
				<p>
					Visualized temperature in Tokyo from 1876 to 2015.<br>
					Similar to other cities in the world, Tokyo is gradually becoming hotter.<br>
				</p>
				<p>
					Now the city has longer / hotter summer and shorter / warmer winter than 140 years ago.<br>
					(When I arrived Edinburgh in August, I was surprised how comfortable it is.)<br>
				</p>
				<div id="loading">(Loading data...)</div>
				<table id="data-table"></table>
				<p>
					- Data source: <a href="http://www.jma.go.jp/" target="_blank">Japan Meteorological Agency</a> <br>
					- (Data was (were?) collected by using PHP, then processed by using SQL)<br>
					- Place: Tokyo (Tokyo) lat. 35°41.5′ North / long. 139°45.0′ East<br>
					- Reference values are treated as usual<br>
					- Empty when the value is unmeasurable (ex. 24 Dec 1880)<br>
					- Bissextile days (29 Februrary) are not indicated<br>
				</p>
				<div id="pad"></div>
			</div>
		</div>
		<style>
			*{
				font-family: Helvetica;
				color: #444;
			}
			
			body{
				background-image: linear-gradient(transparent 20%,
														rgba(130, 206, 238,.15) 20%,
														rgba(130, 206, 238,.15) 25%,
														transparent 25%),
													linear-gradient(90deg,
														transparent 20%,
														rgba(130, 206, 238,.15) 20%,
														rgba(130, 206, 238,.15) 25%,
														transparent 25%);
				background-size: 20px 20px;
			}
			
			#container{
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				margin: auto;
				min-width: 720px;
				max-width: 1080px;
			}
			
			#row{
				padding-right: 20px;
				padding-left: 20px;
			}
			
			#pad {
				height: 30px;
			}
			
			#data-table {
				margin: 0;
				padding: 0;
				border: 0;
				border-collapse: collapse;
			}
			
			#data-table td {
				width: 6px;
				height: 2px;
				border: 1px solid #fff;
			}
			
			td.selected {
				background-color: #fff !important;
			}

			#tooltip {
				position: fixed;
				box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.75);
				text-align: center;
				display: none;
				padding: 15px;
				background-color: #fff;
				border-radius: 5px;
				z-index: 60;
			}
/*	
			#tooltip:before{
				content:"";
				display:block;
				position:absolute;
				height:0;
				width:0;
				top: calc(50% - 10px);
				border: 10px transparent solid;
				border-right-width:0;
				border-left-color:#fff;
				z-index: 50;
				left: -10px;
				transform:rotate(180deg);
			}
*/			
			.b{
				font-weight: bold;
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
			
			$(function(){
				$.getJSON("data.json" , function(data) {
					$("#loading").text("");
					$.each(data, function(key, val) {
						var vc = "";
						
						$.each(val[2], function(key2, val2) {
							vc += '<td y="' + val2[0] + '" v="' + val2[1] + '">';
						});
						
						$("#data-table").append('<tr m="' + val[0] + '" d="' + val[1] + '">' + vc + '</tr>');

						$("#data-table").find("tr").last().find("td").each(function(){
							var value = $(this).attr("v");
							
							if (value <= 0.0) {$(this).css("background-color","#0066ff");}
							if ( 0.0 < value && value <=  5.0) {$(this).css("background-color","#00ccff");}
							if ( 5.0 < value && value <= 10.0) {$(this).css("background-color","#66ffff");}
							if (10.0 < value && value <= 15.0) {$(this).css("background-color","#66ff66");}
							if (15.0 < value && value <= 20.0) {$(this).css("background-color","#ccff33");}
							if (20.0 < value && value <= 25.0) {$(this).css("background-color","#ffffcc");}
							if (25.0 < value && value <= 30.0) {$(this).css("background-color","#ffcc00");}
							if (30.0 < value && value <= 35.0) {$(this).css("background-color","#ff6600");}
							if (35.0 < value) {$(this).css("background-color","#ff3300");}
							
							if (value == null || value == "") {$(this).css("background-color","#eee");}
						});
					});
				});
				
				$(document).on("mouseenter", "td", function(){
					var MIN_YEAR = 1876;
					var index	= $(this).closest("tr").index(this);
					var tYear	= parseInt($(this).attr("y")) + MIN_YEAR;
					var tMonth	= $(this).closest("tr").attr("m");
					var tDay	= $(this).closest("tr").attr("d");
					var tVal	= $(this).attr("v");
					
					$(this).addClass("selected");
					$("#tooltip-inner").html(
						tDay + " " + cMonth(tMonth) + " " + tYear + "<br><span class='b'>" + tVal + "°C</span>"
					// + "<br>"+ tYear + "年" + tMonth + "月" + tDay + "日：" + tVal + "°C"
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

				$(document).on("mouseleave", "td", function(){
					$("#tooltip").hide();
					$(this).removeClass("selected");
				});

			});
		</script>
	</body>
</html>

