<?php require_once(dirname(__FILE__) . "/../../php/header.php"); ?>
    <title class="hascover">Population Pyramids</title>
    <style>
      *{
        color: rgba(255,255,255,0.9);
      }
      
      .box{
        position: fixed;
        background-color: rgba(0,0,0,0.6);
        color: rgba(255,255,255,0.9);
        padding: 10px;
        z-index: 5;
				min-width: 100px;
				min-height: 100px;
      }
      
      .box h1{
        font-size: xx-large;  
      }
      
      .btn-control{
        position: absolute;
        left: 10px;
        bottom: 10px;
        width: 60px;
        height: 30px;
        border: 2px solid rgb(120, 200, 230);
        border-radius: 5px;
        background-color: rgba(0,0,0,0.9);
				background-repeat: no-repeat;
				background-size: 30%;
				background-position: center center;
      }
      
      .btn-control:hover{
        background-color: rgb(40, 60, 70);
        cursor: pointer;
      }
			
      .btn-control.play{
				background-image: url(control-play.png);
			}
			
      .btn-control.stop{
				background-image: url(control-stop.png);
			}
			
			#title-box {
				left: 10px;
				top: 10px;
			}
			
			#title-box p {
				font-size: small;
			}
			
			#detail-box {
				right: 10px;
				bottom: 10px;
				width: 300px;
			}
			
			#detail-box,#detail-box * {
				transition: all 0.3s;
			}

			#detail-box .name {
				width: 100%;
				text-align: center;
				font-size: small;
				margin-bottom: 10px;
			}
			
			#detail-box .age {
				width: 100%;
				height: 10px;
				display: grid;
				grid-template-columns: 1fr 1fr;
			}
			
			#detail-box .bar {
				border: 1px solid rgba(0,0,0,0.6);
				height: 100%;
			}
			
			#detail-box .gauge.f {
				transform: rotateY(180deg);
			}

			#detail-box .bar.f {
				background-color: #395;
			}
			
			#detail-box .bar.m {
				background-color: #a83;
				left: 0;
			}
			
			#detail-box .legends {
				display: grid;
				grid-template-columns: 1fr 1fr;
			}

			#detail-box .legend.f {
				margin-left: 10px;
			}

			#detail-box .legend.m {
				text-align: right;
				margin-right: 10px;
			}
			
			.move-button {
				position: fixed;
				width: 40px;
				height: 40px;
				border-radius: 20px;
				border: 2px solid #fff;
				background-color: rgba(0,0,0,0.9);
			}
			
			.move-button:hover {
				background-color: #666;
				cursor: pointer;
			}
    </style>
    <div id="canvas-area"></div>
    <div class="box" id="title-box">
			<h1>From Uganda to Japan:<br>Population Pyramids in each country</h1>
			<br>
			<p>21 July 2017: Kazuki OGIWARA</p>
			<br>
			<p>- Ordered population pyramid of each 201 country on the planet by average age</p>
			<p>- Each pyramid consists of 21 age classes from 0 - 5 y.o. to 100 y.o. -</p>
			<p>- The youngest country is Uganda, with triangle-shaped pyramid</p>
			<p>- The oldest is Japan, whose pyramid has become "vase-shaped"</p>
			<p>- You can rotate, zoom, and pan camera with mouse and cursor keys</p>
			<p>- Data source: <a href="https://esa.un.org/unpd/wpp/Download/Standard/Population/" target="_blank">World Population Prospects</a></p>
    </div>
    <div class="box" id="detail-box">
      <div class="name"></div>
      <div class="ages">
			</div>
      <div class="legends">
				<div class="legend f">Female</div>
				<div class="legend m">Male</div>
			</div>
    </div>
    <button class="btn-control play"><i class="fa fa-play"></i></button>
    <script src="//cdnjs.cloudflare.com/ajax/libs/three.js/84/three.min.js"></script>
    <script>
      var status = 0;
      
      function getScript(src) {
        $.getScript(src, function() {
          status++;
          if (status == 2) {
            $.getScript("default.js");
          }
        });
      }

      $(function(){
				for (var i = 0; i < 21; i++) {
					var html =
							'<div class="age">'
							+	'<div class="gauge f"><div class="bar f"></div></div>'
							+	'<div class="gauge m"><div class="bar m"></div></div>'
						+	'</div>';
						
					$("#detail-box").find(".ages").append(html);
				}

        getScript("OrbitControls.js");
        getScript("Detector.js");
      });
    </script>
<?php require_once(dirname(__FILE__) . "/../../php/footer.php"); ?>
