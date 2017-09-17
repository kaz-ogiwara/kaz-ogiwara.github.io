var canW = $(window).width();
var canH = $(window).height();
var scene, camera, renderer,controls;
var json;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
	mouse.x = -1000;
	mouse.y = -1000;

var meshArray = [];
var yearMeshArray = [];
var ageMeshArray = [];

var prevIntersectObject, prevIntersectColor;


function init(){
	var container = $("#canvas-area")[0];
	if(!Detector.webgl)Detector.addGetWebGLMessage({parent: container});//WebGL環境確認
 
	scene = new THREE.Scene();
 
	// カメラ:透視投影
	camera = new THREE.PerspectiveCamera( 60, canW/canH, 1, 1000);
	scene.add(camera);
	camera.position.set(100, 100, 100);

	// ライト:環境光 + ポイントライトx3
	var ambientLight = new THREE.AmbientLight(0x888888);
	var pointLights = [];
	pointLights[0] = new THREE.PointLight(0xffffff, .8, 0);
	pointLights[1] = new THREE.PointLight(0xffffff, .8, 0);
	pointLights[2] = new THREE.PointLight(0xffffff, .8, 0);
	pointLights[0].position.set(   0,  200,    0);
	pointLights[1].position.set( 100,  200,  100);
	pointLights[2].position.set(-100, -200, -100);
	scene.add(ambientLight, pointLights[0],pointLights[1],pointLights[2]);

	// レンダラー
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(canW,canH);
	container.appendChild(renderer.domElement);
	
	// フォント
	var loader = new THREE.FontLoader();
	loader.load("data/helvetiker_regular.typeface.json", function(f) {
		var font = f;

		for(var y = 0; y < 13; y ++){
			var yr = 1980 + (y * 5);
			var cx = y * 10 - 65;
/*
			var textMesh1 = getTextMesh(font, yr.toString(), 0xffccff);
			textMesh1.rotation.z = Math.PI / 2;
			textMesh1.position.set(cx - 2, -30, -110);
			scene.add(textMesh1);
*/
			yearMeshArray[y] = getTextMesh(font, yr.toString(), 0xaaffff);
			yearMeshArray[y].rotation.z = -Math.PI / 2;
			yearMeshArray[y].position.set(cx + 1.7, -30, 98);
			scene.add(yearMeshArray[y]);
		}

		for(var x = 0; x < 19; x ++){
			var cy  = x * 10 - 95;
			var age = getAgeString(x);
			
			ageMeshArray[x] = getTextMesh(font, age, 0xffffaa);
			ageMeshArray[x].rotation.z = Math.PI;
			ageMeshArray[x].position.set(60, -30, cy + 1.7);
			scene.add(ageMeshArray[x]);
		}
		
    $("#cover").fadeOut();
	});


 
	var i = 0;
  for(var y = 0; y < 13; y ++){
    for(var x = 0; x < 19; x ++){
      var yr = 1980 + (y * 5);
      var vl = json[yr.toString()][x]["m"] + json[yr.toString()][x]["f"];
      var cv = (vl / 10000000) * 100;
      var c = getColor(x,y);
			
			var cx = y * 10 - 65;
			var cy = x * 10 - 95;
			var ch = cv;
			
			var w = 4;
			var d = 4;
			
			var geometry = new THREE.BoxGeometry(w, ch, d, 1, ch / 5, 1);
			var material = new THREE.MeshPhongMaterial({color: c, wireframe:true});
			//var material = new THREE.MeshPhongMaterial({color: c, side: THREE.DoubleSide});
			
			meshArray[i] = new THREE.Mesh(geometry, material);
			meshArray[i].position.set(cx, 0.5 * ch - 30, cy);

			meshArray[i].y = y;
			meshArray[i].x = x;
			
			scene.add(meshArray[i]);
			i++;
		}
  }

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 10;
	controls.maxDistance = 500;
	controls.maxPolarAngle = (Math.PI * 0.48);

	controls.autoRotate = true;
	controls.autoRotateSpeed = 2.0;

 	document.addEventListener('mousemove', onDocumentMouseMove, false);

	rendering();
}

function getColor(x,y) {
	// x: 0 - 18
	// y: 0 - 12
	var r = 10;
	var g = 10;
	var b = 10;
	
	//y = Math.abs(y - 12);

	if(x ===  0) {r = 90; g = 10; b = 10;}
	if(x ===  1) {r = 75; g = 20; b = 10;}
	if(x ===  2) {r = 60; g = 30; b = 10;}
	if(x ===  3) {r = 45; g = 45; b = 10;}
	if(x ===  4) {r = 30; g = 60; b = 10;}
	if(x ===  5) {r = 20; g = 75; b = 10;}
	if(x ===  6) {r = 10; g = 90; b = 10;}
	if(x ===  7) {r = 10; g = 75; b = 20;}
	if(x ===  8) {r = 10; g = 60; b = 30;}
	if(x ===  9) {r = 10; g = 45; b = 45;}
	if(x === 10) {r = 10; g = 30; b = 60;}
	if(x === 11) {r = 10; g = 20; b = 75;}
	if(x === 12) {r = 10; g = 10; b = 90;}
	if(x === 13) {r = 20; g = 10; b = 75;}
	if(x === 14) {r = 30; g = 10; b = 60;}
	if(x === 15) {r = 45; g = 10; b = 45;}
	if(x === 16) {r = 60; g = 10; b = 30;}
	if(x === 17) {r = 75; g = 10; b = 20;}
	if(x === 18) {r = 90; g = 10; b = 10;}
	
	r = r + (y * 17); if(r > 256){r = 255;}
	g = g + (y * 17); if(g > 256){g = 255;}
	b = b + (y * 17); if(b > 256){b = 255;}
	
	var sr = r.toString(16); if(sr.length === 1){sr = "0" + sr;}
	var sg = g.toString(16); if(sg.length === 1){sg = "0" + sg;}
	var sb = b.toString(16); if(sb.length === 1){sb = "0" + sb;}
	
	var ret = "#" + sr + sg + sb;

	return ret;
}

 
function rendering(){
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(meshArray);
	
	if (intersects.length >= 1) {
		if (prevIntersectObject != intersects[0].object) {

			resetColors();
			showInfo(intersects[0].object.x, intersects[0].object.y);
			intersects[0].object.material.color.set(0xffff00);
			
			yearMeshArray[intersects[0].object.y].material.color.set(0xff3333);
			ageMeshArray[intersects[0].object.x].material.color.set(0xff3333);
		}
	} else {
		$("#info-box").hide();
	}

	requestAnimationFrame(rendering, renderer.domElement);
	controls.update();
	renderer.render(scene, camera);
}


function resetColors() {
  for(var y = 0; y < 13; y ++){
    for(var x = 0; x < 19; x ++){
			var i = (y * 19) + x;
			var c = getColor(x,y);
			meshArray[i].material.color.set(c);
		}
	}
	
	if (yearMeshArray) {
		for(var y = 0; y < 13; y++){
			yearMeshArray[y].material.color.set(0xaaffff);
		}
  }

	if (ageMeshArray) {
		for(var x = 0; x < 19; x++){
			ageMeshArray[x].material.color.set(0xffaaff);
		}
  }
}


function onDocumentMouseMove(e) {
	e.preventDefault();
	mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
}


function getTextMesh(font, text, color) {
	var textGeometry = new THREE.TextGeometry(text, {
		font: font,
		size: 3,
		height: 0,
		curveSegments: 0,
		bevelThickness: 0,
		bevelEnabled: false
	});


	var textMaterial = new THREE.MeshPhongMaterial({color: color/*, specular: 0xffffff*/});
	var textMesh = new THREE.Mesh(textGeometry, textMaterial);
	textMesh.rotation.y = Math.PI;
	textMesh.rotation.x = Math.PI / 2;
	
	return textMesh;
}


function getAgeString(x) {
	var age1 = x * 5;
	var age2 = x * 5 + 4;
	var age  = age1 + " y.o. - " + age2 + " y.o.";
	if (age2 === 94) {age = "90 y.o. -";}
	return age;
}


function showInfo(x, y) {
	var year = 1980 + (y * 5);
	var flag = ""; if (year >= 2015) {flag = " (forecast)";}
	var age  = getAgeString(x);
	var popm = json[year.toString()][x]["m"];
	var popf = json[year.toString()][x]["f"];
	var pop  = popm + popf;
	
	$("#info-year").text(year + flag);
	$("#info-age").text(age);
	$("#info-popm").text(separateComma(popm));
	$("#info-popf").text(separateComma(popf));
	$("#info-pop").text(separateComma(pop));
	$("#info-box").show();
}


function separateComma(num){
    return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

 
$(function(){
  var url = "data/data.json";
  $.getJSON(url).done(function(data){
    json = data;
  	init();
  });
	
	$(function(){
		$(document).on("click", ".btn-control.play", function(){
			controls.autoRotate = true;
			$(this).removeClass("play");
			$(this).addClass("stop");
			$(this).html('<i class="fa fa-stop"></i>');
		});

		$(document).on("click", ".btn-control.stop", function(){
			controls.autoRotate = false;
			console.log(controls.autoRotate);
			$(this).removeClass("stop");
			$(this).addClass("play");
			$(this).html('<i class="fa fa-play"></i>');
		});
	});
});
