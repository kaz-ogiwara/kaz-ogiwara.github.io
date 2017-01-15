var cols;
var rows;
var scl = 10;
var w = 1200;
var h = 900;
var flying = 0;

var rtx = 0;
var rty = 0;
var rtz = 0;
  
var terrain = [];


function setup() {
  createCanvas(1200, 600, WEBGL);

  cols = w / scl;
  rows = h / scl;
  for(var i = 0; i < cols; i++) {
    terrain[i] = [];
  }

  var yoff = flying;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -100, 10);
      xoff += 0.2;
    }
    yoff += 0.2;
  }
  
  background(0);
}


function mouseDragged() {
  rtx -= (mouseY - pmouseY) / 1000;
  rtz -= (mouseX - pmouseX) / 1000;
}


function draw() {
  
  rotateX(rtx);
  rotateY(rty);
  rotateZ(rtz);
  
  translate(-w/2,-h/2);

  stroke(255);
  strokeWeight(1);
  noFill();

  for (var y = 0; y < rows - 1; y++) {
    beginShape();
    for (var x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y+1]);
    }
    endShape();
  }
}