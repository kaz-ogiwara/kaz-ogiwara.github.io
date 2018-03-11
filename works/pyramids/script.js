var canW = $(window).width();
var canH = $(window).height();
var scene, camera, renderer,controls;
var json;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
	mouse.x = -1000;
	mouse.y = -1000;

var meshes = [];

var prevIntersectObject1, prevIntersectColor1,prevIntersectObject2, prevIntersectColor2;


// The same function as map in Processing
function map(value, low1, high1, low2, high2) {
	var ret = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	return ret;
}

// Convert color object into color string (ex. #ffffff)
function convertColor(c){
	var r = ("0" + (c.r * 255).toString(16)).slice(-2);
	var g = ("0" + (c.g * 255).toString(16)).slice(-2);
	var b = ("0" + (c.b * 255).toString(16)).slice(-2);
	return "#" + r + g + b;
}


function showInfo(i){
	var name = json[i].N;
	$("#detail-box").find(".name").text(name);
	
	var k = 20;
	$.each($("#detail-box").find(".age"), function(){
		var f = map(json[i]["F"][k][1], 0, 20, 0, 100);
		var m = map(json[i]["M"][k][1], 0, 20, 0, 100);
		$(this).find(".bar.f").css("width", f + "%");
		$(this).find(".bar.m").css("width", m + "%");
		k--;
	});
}


function init(){
	var container = $("#canvas-area")[0];
	if(!Detector.webgl)Detector.addGetWebGLMessage({parent: container});
 
	scene = new THREE.Scene();
 
	// Camera
	camera = new THREE.PerspectiveCamera( 60, canW/canH, 1, 1000);
	scene.add(camera);
	camera.position.set(-100, 100, -100);

	// Light
	var ambientLight = new THREE.AmbientLight(0x888888);
	var pointLights = [];
	pointLights[0] = new THREE.PointLight(0xffffff, 0.8, 0);
	pointLights[1] = new THREE.PointLight(0xffffff, 0.8, 0);
	pointLights[2] = new THREE.PointLight(0xffffff, 0.8, 0);
	pointLights[0].position.set(   0,  200,    0);
	pointLights[1].position.set( 100,  200,  800);
	pointLights[2].position.set(-100, -200, -800);
	scene.add(ambientLight, pointLights[0],pointLights[1],pointLights[2]);

	// Renderer
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(canW,canH);
	container.appendChild(renderer.domElement);

	// Font
	var loader = new THREE.FontLoader();
	loader.load("helvetiker_regular.typeface.json", function(font) {

		for(var i = json.length - 1; i >= 0; i--){
			var name = json[i]["N"];
			var mesh = getTextMesh(font, name, 0xffffff);
			mesh.rotation.z = Math.PI / 4;
			mesh.position.set(-57 + (i * 0.05), 0, i * 5 - 503);
			scene.add(mesh);
		}
		
		if ($("#cover").is(":visible")) {
	    $("#cover").fadeOut();
		}
	});

 
	// Geometry
	var h = 3;		// Height of each age
	var l = 5;		// space between pyramids
	//var u = 3;
	
	for(var i = 0; i < json.length; i++) {

		var z = (i * l) - ((json.length / 2) * l);

		for (var g = 0; g <= 1; g++) {

			var ages = json[i].F;
			var coef = 1;
			var colr = "#162";

			if (g === 1) {
				ages = json[i].M;
				coef = -1;
				colr = "#861";
			}

			// Draw pyramid with shape
			var shape = new THREE.Shape();
			shape.moveTo(0, 0);
			
			for (var k = 0; k < 21; k++) {
				var w = map(ages[k][1], 0, 30, 0, 80);
				shape.lineTo(0, k * h + k);
				shape.lineTo(w * coef, k * h + k);
				shape.lineTo(w * coef, (k + 1) * h + k);
				shape.lineTo(0, (k + 1) * h + k);
			}

			var geometry = new THREE.ShapeGeometry(shape);
			var material = new THREE.MeshPhongMaterial({color: colr, wireframe:true, side: THREE.DoubleSide});
			
			var idx = (i * 2) + g;
			meshes[idx] = new THREE.Mesh(geometry, material);
			meshes[idx].position.set(coef, 0, z);
			meshes[idx].idx = idx;
			scene.add(meshes[idx]);
		}
	}

  // Controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 10;
	controls.maxDistance = 800;
	controls.maxPolarAngle = (Math.PI * 0.48);

	// Rotation
	controls.autoRotate = true;
	controls.autoRotateSpeed = 2.0;

 	document.addEventListener('mousemove', onDocumentMouseMove, false);

	rendering();
}


 
function rendering(){
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(meshes);
	
	if (intersects.length >= 1) {
		if (intersects[0].object != prevIntersectObject1 && intersects[0].object != prevIntersectObject2) {
			
			if (prevIntersectObject1) {
				prevIntersectObject1.material.color.set(prevIntersectColor1);
				prevIntersectObject2.material.color.set(prevIntersectColor2);
			}
			
			var idx1 = intersects[0].object.idx;
			var idx2 = idx1 - 1; if (idx1 % 2 === 0) {idx2 = idx1 + 1;}
			var i    = (idx1 + idx2 - 1) / 4;	// index of country
			
			showInfo(i);
			
			var color1 = convertColor(meshes[idx1].material.color);
			var color2 = convertColor(meshes[idx2].material.color);

			prevIntersectObject1 = meshes[idx1];
			prevIntersectObject2 = meshes[idx2];
			prevIntersectColor1  = color1;
			prevIntersectColor2  = color2;
			meshes[idx1].material.color.set("#ff0000");
			meshes[idx2].material.color.set("#ff0000");
		}
	} else {
		$("#detail-box").removeClass("visible");
	}

	requestAnimationFrame(rendering, renderer.domElement);
	controls.update();
	renderer.render(scene, camera);
}



function onDocumentMouseMove(e) {
	e.preventDefault();
	mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
}


function getTextMesh(font, text, color) {
	var textGeometry = new THREE.TextGeometry(text, {
		font: font,
		size: 2,
		height: 0,
		curveSegments: 0,
		bevelThickness: 0,
		bevelEnabled: false
	});

	var textMaterial = new THREE.MeshPhongMaterial({color: color, specular: 0xffffff});
	var textMesh = new THREE.Mesh(textGeometry, textMaterial);
	textMesh.rotation.y = Math.PI;
	textMesh.rotation.x = Math.PI / 2;
	
	return textMesh;
}



 
$(function(){
  var url = "data.json";
  $.getJSON(url).done(function(data){
    json = data;
  	init();
  });
	
	$(function(){
		$(document).on("click", ".btn-control.play", function(){
			controls.autoRotate = true;
			$(this).removeClass("play");
			$(this).addClass("stop");
		});

		$(document).on("click", ".btn-control.stop", function(){
			controls.autoRotate = false;
			$(this).removeClass("stop");
			$(this).addClass("play");
		});
	});
});
