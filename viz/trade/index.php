<?php require_once(dirname(__FILE__) . "/../../php/header.php"); ?>
		<title></title>
		<style>
			*{
				color: rgba(255,255,255,0.9);
			}
			
			html,body {
				background-color: rgb(30,60,90);
			}
			
			.row {
				width: 98%;
				max-width: 960px;
				margin: auto;
				padding-bottom: 20px;
			}
			
			.row * {
				font-size: small;
			}
			
			.row h1 {
				padding-top: 30px;
				font-size: x-large;
			}
			
			.row h3 {
				font-size: large;
				padding-bottom: 30px;
			}
			
			.row-block {
				padding-top: 10px;
				padding-bottom: 10px;
			}

			#canvas {
				width: 100%;
				height: calc(100% - 60px);
				display: grid;
				grid-template-columns: 1fr 1fr;
			}
			
			#canvas .half {
				padding: 10% 110px 5% 110px;
				display: grid;
				grid-template-columns: 40px 1fr 40px;
			}
			
			#canvas-title {
				width: 100%;
				height: 60px;
				padding-top: 30px;
				display: grid;
				grid-template-columns: 1fr 1fr;
				text-align: center;
			}
			
			#canvas-title .description {
				font-size: small;
				padding-top: 10px;
			}
			
			#canvas .half .stack .box {
				box-sizing: border-box;
				z-index: 10;
				width: 100%;
				margin-bottom: 1px;
			}
			
			#canvas .box.hovered {
				background-color: #fcc !important;
			}

			.box .box-info {
				position: absolute;
				text-align: right;
				width: 100px;
				height: 100px;
				left: -110px;
				top: calc(50% - 1em);
				font-size: x-small;
				transition: 0.2s;
				opacity: 0;
			}
			
			.box.hovered .box-info,
			.box.selected .box-info {
				opacity: 1;
			}
			
			#import-products .box-info,
			#export-countries .box-info {
				text-align: left;
				left: auto;
				right: -110px;
			}

			#import .box-info,#import .box-number {color: #8dd;}
			#export .box-info,#export .box-number {color: #dd8;}
			
			.stack-title {
                          font-size: small;
			position: absolute;
			color: rgba(255,255,255,0.8);
			width: 100px;
			  text-align: center;
			  margin-top: -20px;
			  margin-left: -30px;
                        }

			.box-inner {
				position: absolute;
				width: 100%;
				height: 100%;
			}
			
			#canvas .lines {
				height: 100%;
			}
			
			.lines-cover {
				z-index: 20;
				position: absolute;
				right: 0;
				margin: 0 0 0 1%;
				width: 99%;
				height: 105%;
				background-color: rgb(30,60,90);
			}

			canvas{
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: 0;
			}
		</style>
		<div class="row">
			<h1>Material to Product</h1>
			<h3>Import and Export between Japan and the World, 2016</h3>
			<div class="row-block">
				<p>4 August 2017: Kazuki OGIWARA</p>
			</div>
			<div class="row-block">
				<p>- Sankey diagram with animation of import and export of Japan in 2016</p>
				<p>- Left side indicates import from other countries, right side indicates export</p>
				<p>- Curve line shows import / export an item from / to a country</p>
				<p>- Mainly Japan imports materials such as fuel then exports products including car</p>
				<p>- Curve line that relates to the story is pale red while others are grey</p>
			</div>
			<div class="row-block">
				<p>Unit: 1 million (1,000,000) GBP (converted as 1 GBP = 146 JPY)</p>
				<p>Data source: <a href="http://www.customs.go.jp/toukei/info/index_e.htm" target="_href">Trade Statistics of Japan</a></p>
			</div>
		</div>
		<div id="canvas-title">
			<div>
				<div>Import</div>
				<div class="description">452,342 million GBP in total</div>
			</div>
			<div>
				<div>Export</div>
				<div class="description">479,697 million GBP in total</div>
			</div>
		</div>
		<div id="canvas">
			<div class="half" id="import">
				<div class="stack" id="import-countries">
                                  <div class="stack-title">Countries</div>
                                </div>
				<div class="lines" id="import-lines">
					<div class="lines-cover"></div>
				</div>
				<div class="stack" id="import-products">
                                  <div class="stack-title">Products</div>
                                </div>
			</div>
			<div class="half" id="export">
				<div class="stack" id="export-products">
                                  <div class="stack-title">Products</div>
                                </div>
				<div class="lines" id="export-lines">
					<div class="lines-cover"></div>
				</div>
				<div class="stack" id="export-countries">
                                  <div class="stack-title">Countries</div>
                                </div>
			</div>
		</div>
		<script>
			var total = 479697;	// import: 66041973885, export: 70035770383. 70035770383 / 146000 = 479697
			var msec = 1800;
			var targetDatetime;

			var data;
			var boxW = $(".box").width();
			var canvasW = $("#canvas").width();
			var canvasH = $("#canvas").height();
			var coverW = $(".lines-cover").width();
			
      // The same function as map in Processing
      function map(value, low1, high1, low2, high2) {
        var ret = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
        return ret;
      }
			
			function addBoxes(array, target, color) {
				$.each(array, function(index, value){
					//console.log(color.slice(1,2));
					
					var length = $(target).find(".box").length;
					var r = Math.floor(map(length, 0, 6, parseInt(color.slice(1,3), 16), 255));
					var g = Math.floor(map(length, 0, 6, parseInt(color.slice(3,5), 16), 255));
					var b = Math.floor(map(length, 0, 6, parseInt(color.slice(5,7), 16), 255));
					
					var height = map(value.value, 0, total, 0, 100);
					var html =	'<div class="box" style="height: calc(' + height + '% - 1px); background-color: rgb(' + r + ',' + g + ',' + b + ');">'
											+	'<div class="box-info">' + value.name
												+	'<div class="box-number" orig="' + value.value + '">' + 1 + '</div>'
											+ '</div>'
											+	'<div class="box-inner"></div>'
										+	'</div>';
					$(target).append(html);
				});
			}
			
			// Adopted from http://qiita.com/zawascript/items/922b5db574ef2b126069
			function addComma(num){
				return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
			}
			
			function countUp(){
				var date = new Date();
				
				if (date > targetDatetime) {
					$.each($(".counting"), function() {
						$(this).text(addComma($(this).attr("value")));
					});
					$(".counting").removeClass(".counting");
				} else {
					$(".counting").each(function() {
						var diff = targetDatetime.getTime() - date.getTime();
						var v = map(diff, msec, 0, 0, $(this).attr("value"));
						v = addComma(parseInt(v));
						$(this).text(v);
					});
					setTimeout('countUp()', 10);
				}
			}
			
			function bindBoxHover(){
				$(document).on("mouseenter touchstart", ".box-inner", function(){
					if (!$(this).closest(".box").hasClass("hovered")) {
						$(this).closest(".half").find(".box").removeClass("hovered");
						$(this).closest(".half").find(".box").removeClass("selected");
						$(this).closest(".stack").siblings(".stack").find(".box").addClass("selected");
						$(this).closest(".box").addClass("hovered");
						
						$(this).closest(".half").find(".lines-cover").stop();
						$(this).closest(".half").find(".lines-cover").animate({width: coverW}, 0);
	
						//var high = $(this).offset().top;
						//var low  = $(this).offset().top + $(this).height();
						var position = "left";
						var type     = "import";
						
						if ($(this).closest("#import-products")[0] || $(this).closest("#export-countries")[0]) {
							position = "right";
						}
						
						if ($(this).closest("#export")[0]) {
							type = "export";
						}
						
						// Indicate amount value
						var box_number = $(this).closest(".box").find(".box-number");
						
						var eq = $(this).closest(".stack").find(".box-inner").index(this);
						var len = $(this).closest(".stack").find(".box-inner").length;
						var stack = $(this).closest(".stack").siblings(".stack");
						//console.log("eq: " + eq);
						
						box_number.attr("value", box_number.attr("orig"));
						var idx = 0;
						for (i = eq; i < data.lines[type].length; i = i + len) {
							var num = data.lines[type][i];
							stack.find(".box-number").eq(idx).attr("value", num);
							idx++;
						}
						
						$(".counting").removeClass("counting");
						box_number.addClass("counting");
						stack.find(".box-number").addClass("counting");

						targetDatetime = new Date();
						targetDatetime.setMilliseconds(msec);
						
						countUp();
						
						//showLines(type, position, low, high, $(this).closest(".half").find(".lines-cover"));
						showLines(type, position, eq, $(this).closest(".half").find(".lines-cover"));
					}
				});
			}

			$(function(){
				$.getJSON("data.json").done(function(t){
					data = t;
					
					addBoxes(data.countries.import, "#import-countries", "#ffff99");
					addBoxes(data.products.import,  "#import-products",  "#99ffff");
					addBoxes(data.products.export,  "#export-products",  "#99ffff");
					addBoxes(data.countries.export, "#export-countries", "#ffff99");
					
					// p5 and sketch are loaded after json was stored in a variable
					$.getScript("//cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.6/p5.min.js");
					$.getScript("sketch.js");

					$("#cover").fadeOut();
					
					bindBoxHover();
				});
			});
		</script>
	</body>
</html>
