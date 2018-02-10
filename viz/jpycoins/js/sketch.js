var canvasW = $("#canvas").width();
var canvasH = $("#canvas").height();
var data;
var COINS = ["1","5","10","50","100","500"];

var MIN_YEAR = 1948;
var MAX_YEAR = 2016;
var MIN_VALUE = 0;
var MAX_VALUE = 3000000;
var COLORS = {
  "background":"#102040"
, "blue":"#369"
, "paleBlue":"rgba(160,240,250,200)"
, "yellow":"#ec4"
, "white":"#fefefe"
, "coins":[
    "rgba(239,160,153,1)"
  , "rgba(244,202,129,1)"
  , "rgba(202,234,58,1)"
  , "rgba(36,215,124,1)"
  , "rgba(158,171,255,1)"
  , "rgba(209,128,229,1)"
  ]
};

var isClicking = false;
var isPlaying = false;

//var objBackground;
var objYearText;
var objButton;
var objSlider;
var objCoins = new Array(6);
var objLines = new Array(6);


function map(value, low1, high1, low2, high2) {
	var ret = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	return ret;
}


function addCommas(num){
  return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}


// Returns minimum value in the array
function min(array){
	var ret;

	for (var i = 0; i < array.length; i++) {
		if (!ret || ret > array[i]) ret = array[i];
	}
	
	return ret;
}

// Returns maximum value in the array
function max(array){
	var ret;

	for (var i = 0; i < array.length; i++) {
		if (!ret || ret < array[i]) ret = array[i];
	}
	
	return ret;
}



function setup() {

  var canvas = createCanvas(canvasW, canvasH);
  canvas.parent('canvas');
  frameRate(0);

  $.getJSON("json/data.json", function(d, status) {
    data = d;
    
    //objBackground = new kBackground(0, 0, canvasW, canvasH);
    objYearText = new yearText(canvasW - 10, 0);
    objSlider   = new slider(0, canvasH * 0.65, canvasW, canvasH * 0.35);

    for (var i = 0; i < COINS.length; i++) {
      objCoins[i] = new coin(i, i * (canvasW / 6), 0, canvasW / 6, canvasH * 0.6);
      objLines[i] = new kLine(i, objSlider.x, objSlider.y, objSlider.w, objSlider.h);
    }

    frameRate(20);
  });
}


function draw(){

  // Clear canvas
  clear();
  
  // Display
  //objBackground.display();
  
  for (var i = 0; i < COINS.length; i++) {
    objCoins[i].display();
    objLines[i].display();
  }

  objYearText.display();
  objSlider.display();
    
  // prevent flickering
  isClicking = false;

  if (isPlaying) {
    objSlider.value += 1;
    if (objSlider.value > objSlider.maxValue) {
      objSlider.value = objSlider.maxValue;
      isPlaying = false;
    }
  }
}


/*------------------------------------------------------------
 Class: Background
------------------------------------------------------------*/
/*
function kBackground(tx, ty, tw, th) {
  this.x = tx;
  this.y = ty;
  this.w = tw;
  this.h = th;
  
  this.b = 10;
  this.color = "rgba(100,220,250,0.1)";
  
  this.display = function(){
    
    stroke(this.color);
    strokeWeight(1);
    noFill();
    
    for (var i = 0; i * this.b <= this.x + this.w; i++) {
      line(i * this.b, this.y, i * this.b, this.y + this.h);
    }
    
    for (var i = 0; i * this.b <= this.y + this.h; i++) {
      line(this.x, i * this.b, this.x + this.w, i * this.b);
    }
  };
}
*/

/*------------------------------------------------------------
 Class: Year text
------------------------------------------------------------*/
function yearText(tx, ty) {
  this.x = tx;
  this.y = ty;
  
  this.display = function(){
    
    noStroke();
    textSize(32);
    fill(255,150);
    textAlign(RIGHT, TOP);
    
    text(objSlider.value, this.x, this.y);
  };
}


/*------------------------------------------------------------
 Class: Slider
------------------------------------------------------------*/
function slider(tx, ty, tw, th) {
  this.x = tx;
  this.y = ty;
  this.w = tw;
  this.h = th;
  
  this.minX = this.x + 5;
  this.maxX = this.x + this.w - 5;
  this.minValue = MIN_YEAR;
  this.maxValue = MAX_YEAR;
  this.value = this.minValue;
  this.rx = this.minX;
  this.ry = this.y + 12;
  this.rw = 4;
  this.rh = this.h - 24;
  
  this.year = MIN_YEAR;

  this.hover = false;
  
  this.display = function(){
    this.hover = false;
    
    // Measures
    for (var i = 0; i <= 120; i++) {
      this.mx = map(i, 0, 120, this.minX, this.maxX);
      this.ml = 5;
      if (i % 10 === 0) this.ml =  9;
      if (i % 20 === 0) this.ml = 13;
      strokeWeight(1);
      stroke(color(COLORS.paleBlue));
      line(this.mx, this.y,          this.mx, this.y + this.ml);
      line(this.mx, this.y + this.h, this.mx, this.y + this.h - this.ml);
    }
    
    // When background is hovered (not only button, in order to realize smoothe touch)
    if (  this.x <= mouseX && mouseX <= this.x + this.w
      &&  this.y <= mouseY && mouseY <= this.y + this.h) {
        this.hover = true;
    }

    // When clicked
    if (this.hover && mouseIsPressed) {
      this.tmpx = max(min(mouseX, this.maxX), this.minX);
      this.value = parseInt(map(this.tmpx, this.minX, this.maxX, this.minValue, this.maxValue));
    }

    // Draw bar
    this.rx = map(this.value, this.minValue, this.maxValue, this.minX, this.maxX);
    noStroke();
    fill(COLORS["white"]);
    rect(this.rx - (this.rw / 2), this.ry, this.rw, this.rh, 2);
  }
}


/*------------------------------------------------------------
 Class: Coin (Bar + value + coin title)
------------------------------------------------------------*/
function coin(ti, tx, ty, tw, th) {
  this.i = ti;
  this.x = tx;
  this.y = ty;
  this.w = tw;
  this.h = th;
  this.label = COINS[this.i];
  
  this.blank = this.w * 0.1;
  this.barX = this.x + this.blank;
  this.barW = this.w - (this.blank * 2);
  this.barY = this.y + this.h - 40; // Bottom line

  this.display = function(){
    
    // Text
    textAlign(CENTER, CENTER);
    textSize(15);
    noStroke();
    fill(COLORS.paleBlue);
    text("¥" + this.label, this.x + (this.w / 2), this.y + this.h);
    
    // Bar
    this.barV = data["years"][objSlider.value][this.label];
    this.barH = map(this.barV, MIN_VALUE, MAX_VALUE, 0, this.h);

    if (this.barV) {
      
      // Block
      this.blockH = 3;
      this.blockN = parseInt(this.barH / this.blockH) + 1;
      
      // Draw blocks
      stroke(color(COLORS.background));
      strokeWeight(1);
      for (var i = 0; i < this.blockN; i++) {
        fill(COLORS.coins[this.i]);
        rect(this.barX, this.barY - (i * this.blockH), this.barW, this.blockH, this.blockH / 2);
      }
      
      // Value
      textAlign(CENTER, BOTTOM);
      textSize(11);
      text(addCommas(this.barV), this.x + (this.w / 2), this.y + this.h - 20);
    }
  }
}


/*------------------------------------------------------------
 Class: Line
------------------------------------------------------------*/
function kLine(ti, tx, ty, tw, th) {
  this.i = ti;
  this.x = tx + 5;
  this.y = ty + 18;
  this.w = tw - 10;
  this.h = th - 36;

  this.color  = COLORS.coins[this.i];
  this.min    = data.coins[this.i].min;
  this.values = data.coins[this.i].values;

  // sw: １点あたりの幅、sx: スタート時点のx座標
  this.sw = this.w / (MAX_YEAR - MIN_YEAR);
  this.sx = (this.min - MIN_YEAR) * this.sw + this.x;

  this.display = function(){
    
    stroke(this.color);
    strokeWeight(2);
    noFill();

    beginShape();
      for (var i = 0; i < this.values.length; i++) {
        var tx = this.sx + (this.sw * i);
        var ty = map(this.values[i], MIN_VALUE, MAX_VALUE, this.y + this.h, this.y);
        vertex(tx,  ty);
      }
    endShape();
  }
}


function mousePressed() {
  isClicking = true;
}

















