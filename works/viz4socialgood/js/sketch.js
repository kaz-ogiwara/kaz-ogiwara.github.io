var kCanvas = {
  "w": $("#canvas").width(),
  "h": $("#canvas").height()
};

var kBlocks = [];
var kCurves = [];
var kCover;
var kInfo;
var isStarted = false;  // true when set up completed
var COUNTRIES = [];

var COLORS = {
  "white": "#fefefe",
  "background": "rgb(10,30,60)",
  "curve": {
    "diff": "#fafafa",
    "same": "#fafafa"
  }
};


function addCommas(num){
  return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}


// The same function as map in Processing
function map(value, low1, high1, low2, high2) {
  var ret = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  return ret;
}


// 値をY軸の座標または高さに変更する
function mapValueY(value){
  var TOTAL_VALUE = 46896;
  var ret = map(value, 0, TOTAL_VALUE, 0, kCanvas.h / 2);
  return ret;
}


function setup() {
  var canvas = createCanvas(kCanvas.w, kCanvas.h);
  canvas.parent('canvas');

  background(COLORS.background);
  pixelDensity(1.0);
  frameRate(0);


  $.getJSON("data/data.json", function(data){

    COUNTRIES = data.countries;

    kBlocks.froms = [];
    kBlocks.tos = [];

    var i = 0;

    $.each(data.froms, function(key, value){
      kBlocks.froms[i] = new block(i, "from", key, value);
      i++;
    });

    i = 0;

    $.each(data.tos, function(key, value){
      kBlocks.tos[i] = new block(i, "to", key, value);
      i++;
    });


    for (var i = 0; i < data.curves.length; i++) {
      kCurves[i] = new kCurve(i, data.curves[i]);
    }

    kCover = new kCover();
    kInfo  = new kInfo();

    isStarted = true;
    frameRate(60);
  });
}


function draw() {

  if (isStarted) {

    clear();

    kBlocks.froms.forEach(function(block) {
      block.display();
    });

    kBlocks.tos.forEach(function(block) {
      block.display();
    });

    kCurves.forEach(function(curve) {
      curve.display();
    });

    kCover.display();
    kInfo.display();
  }
}


/*------------------------------------------------------------
 class: block
------------------------------------------------------------*/
function block(i, type, code, value) {
  this.i     = i;
  this.type  = type;
  this.code  = code;              // ex. "DK"
  this.name  = COUNTRIES[code];   // ex. "Denmark"
  this.value = value;
  this.blank = 0;       // 左右の余白
  this.cur   = 0;       // カーブの設定時に使う

  if (!this.name) this.name = "";

  this.hovered = false;  // True if hovered. False if another block was hovered
  this.x = this.blank;
  this.y = 0;
  this.w = 40;
  this.h = mapValueY(this.value.total);

  var prev = kBlocks[this.type + "s"][i - 1];
  if (prev) this.y = prev.y + prev.h;

  if (this.type === "to") this.x = kCanvas.w - this.blank - this.w;

  // Fill color
  this.cr = 100 + (this.i * 15);
  this.cg = 200 + (this.i * 15);
  this.cb = 200 + (this.i * 15);

  if (this.type === "to") {
    this.cr = 200 + (this.i * 15);
    this.cg = 200 + (this.i * 15);
    this.cb = 100 + (this.i * 15);
  }

  // parameters for text
  this.tm = 4;        // margin between block and text
  this.tx = this.x + this.w + this.tm;
  this.ty = this.y + (this.h / 2);
  if (this.type === "to") this.tx = this.x - this.tm;


  this.display = function(){

    // text
    textSize(13);
    noStroke();
    fill(120);
    textAlign(LEFT, CENTER);  if (this.type === "to") textAlign(RIGHT, CENTER);
    //text(this.name, this.tx, this.ty);


    fill(this.cr, this.cg, this.cb);

    strokeWeight(1);
    stroke(COLORS.background);
    strokeCap(SQUARE);
    rectMode(CORNER);

    // When hovered
    if ( this.x <= mouseX && mouseX <= this.x + this.w
      && this.y <= mouseY && mouseY <= this.y + this.h) {

      // Change show flag
      for (var i = 0; i < kCurves.length; i++) {
        if (this.type === "from" && this.code === kCurves[i].from) {
          kCurves[i].show = true;
        } else if (this.type === "to" && this.code === kCurves[i].to) {
          kCurves[i].show = true;
        } else {
          kCurves[i].show = false;
        }
      }

      if (!kCover.isMoving) kCover.isMoving = true;

      // When a new bloc kwas hovered
      if (this !== kCover.hoveredBlock) {
        kCover.millis = millis();
        kCover.hoveredBlock = this;

        drawMapWithData(this.code);
        updateInfo(this.type, this.code, this.value, this.name);
      }
    }

    if (this === kCover.hoveredBlock) fill(200,100,100);
    rect(this.x, this.y, this.w, this.h);
  }
}





/*------------------------------------------------------------
 class: curve
------------------------------------------------------------*/
function kCurve(i, data) {
  this.i      = i;
  this.from   = data[0];
  this.to     = data[1];
  this.value  = data[2];
  this.show   = false;

  // Get indexes of blocks where the curve is from and to
  var toBlock, fromBlock;
  kBlocks.froms.forEach(function(block) {
    if (block.code === data[0]) {
      fromBlock = block;
    }
  });

  kBlocks.tos.forEach(function(block) {
    if (block.code === data[1]) {
      toBlock = block;
    }
  });

  this.xb = 4;    // 横方向のブランク＝blockからどのくらい離すか
  this.h  = mapValueY(this.value);

  if (fromBlock && toBlock) {

    this.x1 = kBlocks.froms[0].w + kBlocks.froms[0].blank + this.xb;
    this.y1 = fromBlock.y + fromBlock.cur + (this.h / 2);
    this.x2 = map(5, 0, 10, this.x1, kCanvas.w - kBlocks.froms[0].w - kBlocks.froms[0].blank - 4);
    this.y2 = this.y1;
    this.x3 = this.x2;
    this.y3 = toBlock.y + toBlock.cur + (this.h / 2);
    this.x4 = kBlocks.tos[0].x - this.xb;
    this.y4 = this.y3;

    fromBlock.cur += this.h;
    toBlock.cur += this.h;
  }

  this.display = function(){
    if (fromBlock && toBlock && this.show) {
      strokeWeight(this.h);
      stroke(200,100,100,230);
      noFill();
      bezier(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
    }
  }
}


/*------------------------------------------------------------
 class: cover
------------------------------------------------------------*/
function kCover() {
  this.x = kBlocks.froms[0].w + kBlocks.froms[0].blank + 1;
  this.y = 0;
  this.w = kCanvas.w - (this.x * 2);
  this.h = kCanvas.h;

  this.isMoving = false;  // true when bezier curves are moving
  this.millis = 0;        // millis when moving animation started
  this.duration = 800;    // duration of animation (milli sec)
  this.hoveredBlock;      // the block hovered right now or previously

  this.display = function(){
    if (this.isMoving) {

      this.r = map(millis() - this.millis, 0, this.duration, 1, 0);

      if (0 <= this.r && this.r <= 1) {

        this.tw = this.r * this.w;
        this.tx = this.x + this.w - this.tw;

        noStroke();
        fill(COLORS.background);
        rect(this.tx, this.y, this.tw, this.h);
      } else {
        this.isMoving = false;
        this.millis = 0;
      }
    }
  }
}


/*------------------------------------------------------------
 class: info
------------------------------------------------------------*/

function kInfo() {
  this.type = "";
  this.code = "";
  this.name = "";
  this.data = {};

  this.x = 0;
  this.y = 560;

  // Define X & Y coordinates
  this.title = {
    "x": this.x, "y": this.y + 8
  }

  this.total = {
    "x": this.x, "y": this.y + 16
  }

  this.gender = {
    "x": this.x, "y": this.y + 100
  }

  this.age = {
    "x": this.x, "y": this.y + 240
  }

  this.labour = {
    "x": this.x + (kCanvas.w * 0.2), "y": this.y + 16
  }

  this.control = {
    "x": this.x + (kCanvas.w * 0.4), "y": this.y + 16
  }

  this.recruiter = {
    "x": this.x + (kCanvas.w * 0.6), "y": this.y + 16
  }

  this.exploitation = {
    "x": this.x + (kCanvas.w * 0.8), "y": this.y + 16
  }

  this.citizenship = {
    "x": this.x + (kCanvas.w * 0.8), "y": this.y + 16
  }


  this.display = function(){

    // Line
    stroke(120);
    strokeWeight(2);
    line(this.x, this.y, this.x + kCanvas.w, this.y);

    // Country name (ex. "to Russian Federation")
    fill(240);
    noStroke();
    textSize(54);
    textAlign(LEFT, BOTTOM);
    text(this.type + " " + this.name, this.title.x, this.title.y);

    // Titles
    showCategory("total",     "Total Number");
    showCategory("gender",    "Gender");
    showCategory("age",       "Age");

    showCategory("control",   "Means of Control");
    showCategory("labour",    "Type of Labour");
    showCategory("recruiter", "Recruiter");

    // Total Number
    let totalNum = this.data.total;
    if (kCover.isMoving) {
      totalNum = Math.floor((1 - kCover.r) * totalNum);
    }

    fill(240);
    noStroke();
    textSize(24);
    textAlign(RIGHT, TOP);
    text(addCommas(totalNum), this.total.x + 110, this.total.y + 20);

    if (this.type === "to") {
      showCategory("citizenship",   "Citizenship");
    } else {
      showCategory("exploitation",  "Country of Exploitation");
    }
  }
}


function getCountryName(code){
  var ret = "Unknown";

  if (COUNTRIES[code]) {
    ret = COUNTRIES[code].toString();
  }

  return ret;
}


function showCategory(code, name){

  fill(240);
  textSize(16);
  noStroke();
  textAlign(LEFT, TOP);
  text(name, kInfo[code].x, kInfo[code].y);

  if (kInfo.data[code]) {

    var i = 0;
    for(key in kInfo.data[code]){
      //console.log(code, kInfo[code]);
      showValue(i, kInfo[code].x, kInfo[code].y, code, key);
      i++;
    }
  }
}



function showValue(i, x, y, code, name){

  let kData = kInfo.data[code];
  let value = kData[name];
  let denom = 0;

  for (var key in kData) {
    if (denom < kData[key]) denom = kData[key];
  }

  if (code === "exploitation" || code === "citizenship") {
    name = getCountryName(name);
  }

  if (kCover.isMoving) {
    value = (1 - kCover.r) * value;
  }
  
  let boxw = map(value, 0, denom, 0, 120);
  value = Math.floor(value);

  noStroke();
  textAlign(LEFT, TOP);
  fill(255, 0,7);

  // Label
  fill(200, 230, 240);
  textSize(13);
  text(name, x, y + (i * 54) + 30);

  // Number
  fill(240, 240, 200);
  textSize(14);
  textAlign(RIGHT, TOP);
  text(addCommas(value), x + 42, y + (i * 54) + 20 + 30);

  // Box
  noStroke();
  fill(120, 140, 180);
  rect(x + 46, y + (i * 54) + 54, boxw, 8, 4);
}


function updateInfo(kType, kCode, kValue, kName){
  kInfo.type = kType;
  kInfo.code = kCode;
  kInfo.data = kValue;
  kInfo.name = kName;
}





