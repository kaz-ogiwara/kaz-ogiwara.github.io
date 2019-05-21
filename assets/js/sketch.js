var canvasW = $(window).width();
var canvasH = $(window).height();;

var t = 0;
var angle =0;
var NUM_LINES = 380;
var v1 = 0.4;
var v2;
var increment = false;
var fator = 0.00001;
var c = 200;
var c2 = 20;


function setup() {
  var canvas = createCanvas(canvasW, canvasH);
  canvas.parent('p5canvas-block');
  pixelDensity(1);
  frameRate(20);
  v1 = random(0.4) + 0.2;
  smooth(2);

  if (width <= height) c = width  * 0.3;
  if (width >= height) c = height * 0.3;
}


function draw(){
  clear();

  angle += 0.0015;
  stroke(30,100,120,10);

  translate(canvasW / 2, canvasH / 2);
  rotate(sin(angle));

  for(var i = 1; i < NUM_LINES; i++){
    strokeWeight(4);
    point(x(t + i),  y(t + i));
    point(x2(t + i), y2(t + i));
    strokeWeight(1.2);
    line(x(t + i), y(t + i), x2(t + i), y2(t + i));
  }

  t += 0.001;
  if (increment) v1 += fator;
}

function mousePressed() {
  v1 = random(0.4) + 0.2;
}


function keyReleased(){
  increment = false;
}


function keyPressed() {
  if (key == ' ') v1 = random(0.4) + 0.2;

  if (keyCode == 37) {  // 37: LEFT
    increment = true;
    fator = -0.00001;
  } else if (keyCode == 39) {  // 39: RIGHT
    increment = true;
    fator = 0.00001;
  }

  if (keyCode == 38) {  // 38: UP
    NUM_LINES += 1;
  } else if (keyCode == 40) { // 40: DOWN
    NUM_LINES -= 1;
  }
}


function x(t){
  return sin(t / 10) * c + cos(t / v1) * c;
}

function y(t){
  return cos(t / 10) * c + sin(t / v1) * c;
}

function x2(t){
  return sin(t / 10) * c2 + cos(t / v1) * c;
}

function y2(t){
  return cos(t / 10) * c2 + sin(t / v1) * c;
}
