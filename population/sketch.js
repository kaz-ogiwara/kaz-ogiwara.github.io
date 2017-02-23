var w = $(window).width();
var h = $(window).height();

var boxSize = 15;
var distance = 10;

var boxNum = 13 * 19;  // years: 13, classes: 19

var rtx = -0.5;
var rty = 0;
var rtz = 0;

var clrWhite;
var clrBackground;

function setup() {
  clrWhite = color(250, 250, 250, 250);
  clrBackground = color(10,20,30);

  createCanvas(w, h, WEBGL);
  background(clrBackground);
  frameRate(20);
  
  colorMode(RGB, 255,255,255);
//  colorMode(HSB, 255,255,255);
  
  // add colors to legend
  for(var y = 0; y < 13; y ++){
    $(".year").eq(y).find(".age").css("background-color", getColor(y));
  }
}


function draw() {

  push();

    rotateX(radians(rtx));
    rotateY(radians(rty));
    rotateZ(radians(rtz));
    
    drawBoxes();
  pop();
  
  rtx = Math.round(rtx * 1000) / 1000;
  rtz = Math.round(rtz * 1000) / 1000;
  
  $("#rtx").text(rtx);
  $("#rtz").text(rtz);
  
  rtz = rtz;

  // rotate legend
  $("#legend").css("transform",         "rotate(" + (rtz * -1) + "deg)");
  $("#legend").css("-ms-transform",     "rotate(" + (rtz * -1) + "deg)");
  $("#legend").css("-webkit-transform", "rotate(" + (rtz * -1) + "deg)");
}


function mouseDragged() {
  rtx += (mouseY - pmouseY) / 5;
  rtz += (mouseX - pmouseX) / 5;
}


function drawBoxes() {
  
  var maxX = 19 * (boxSize + distance);
  var maxY = 13 * (boxSize + distance);
 
  for(var y = 0; y < 13; y ++){
    for(var x = 0; x < 19; x ++){
      push();
        this.yr = 1980 + (y * 5);
        this.vl = json[this.yr.toString()][x]["m"] + json[this.yr.toString()][x]["f"];
        this.cv = map(this.vl, 0, 10000000, 0, 300);

        stroke(255,0,0);
        strokeWeight(1);
        fill(getColor(y));
        translate(x * (boxSize + distance) - (maxX / 2), y * (boxSize + distance) - (maxY / 2), this.cv / 2 - 150);

        box(12, 12, this.cv);
      pop();
    }
  }
}


function getColor(y) {
  switch (y) {
    case  0: return color( 30,  0,230); break;
    case  1: return color( 96,  0,255); break;
    case  2: return color(141,  0,255); break;
    case  3: return color(184,  0,255); break;
    case  4: return color(227,  0,255); break;
    case  5: return color(238,  0,231); break;
    case  6: return color(255, 20,254); break;
    case  7: return color(255,127,255); break;
    case  8: return color(255,237,252); break;
    case  9: return color(195,255,201); break;
    case 10: return color(122,255,108); break;
    case 11: return color(  0,249, 51); break;
    case 12: return color(  0,206, 25); break;
  }


/*
  switch (y) {
    case  0: return color( 23, 41,252); break;
    case  1: return color( 61, 42,253); break;
    case  2: return color(106, 45,253); break;
    case  3: return color(151, 48,254); break;
    case  4: return color(199, 53,255); break;
    case  5: return color(247,  0,254); break;
    case  6: return color(232, 60,255); break;
    case  7: return color(237,122,255); break;
    case  8: return color(252,234,251); break;
    case  9: return color(195,251,188); break;
    case 10: return color(122,255,108); break;
    case 11: return color( 89,238, 31); break;
    case 12: return color( 70,188, 10); break;
  }
*/

/*
  switch (y) {
    case  0: return color( 10, 50,150); break;
    case  1: return color( 50,100,200); break;
    case  2: return color( 90,100,190); break;
    case  3: return color(150,100,190); break;
    case  4: return color(190, 50,210); break;
    case  5: return color(220, 50,230); break;
    case  6: return color(250, 50,250); break;
    case  7: return color(250,150,250); break;
    case  8: return color(250,250,250); break;
    case  9: return color(200,250,200); break;
    case 10: return color(150,250,150); break;
    case 11: return color(100,200, 50); break;
    case 12: return color( 50,150, 10); break;
  }
*/
/*
  001: Neon color between white
  switch (y) {
    case  0: return color( 10, 50,150); break;
    case  1: return color( 50,100,200); break;
    case  2: return color(150,200,250); break;
    case  3: return color(250,250,250); break;
    case  4: return color(250,150,250); break;
    case  5: return color(250, 50,250); break;
    case  6: return color(250, 50,150); break;
    case  7: return color(250,150,250); break;
    case  8: return color(250,250,250); break;
    case  9: return color(200,250,200); break;
    case 10: return color(150,250,150); break;
    case 11: return color(100,200, 50); break;
    case 12: return color( 50,150, 10); break;
  }
*/

/*
  switch (y) {
    case  0: return color( 10, 30,150); break;
    case  1: return color( 10,100,200); break;
    case  2: return color(100,150,250); break;
    case  3: return color(100,250,150); break;
    case  4: return color( 30,200,100); break;
    case  5: return color( 30,150, 10); break;
    case  6: return color(100,200, 50); break;
    case  7: return color(150,30,200); break;
    case  8: return color(10,30,200); break;
    case  9: return color(10,30,200); break;
    case 10: return color(10,30,200); break;
    case 11: return color( 10,200,100); break;
    case 12: return color( 10,150, 30); break;
  }
*/


}







