var w = 960;
var h = $(window).height();
var countries   = new Array(json["countries"].length);
var prefectures = new Array(json["prefectures"].length);
var numbers     = new Array(countries.length);
  for(var i = 0; i < countries.length; i++) {
    numbers[i] = new Array(prefectures.length);
  }
var objCover;

var total = 48914146; // total number of tourists
var maxNum = 3451918; // the largest number of tourists from a country to a prefecture (China - Tokyo)

var curValueC = 0;
var curValueP = 0;
var curValueNC = 0;
var curValueNP = new Array(47); for(var i = 0; i < 47; i++) {curValueNP[i] = 0;}

var isMoving = false;
var startMillis = 0;
var prevHoverType = "";
var prevHoverIndex = -1; // index of country or prefecture which is previously hovered

var clrWhite;
var clrBackground;

var start;

function setup() {
  start = millis();
  
  clrWhite = color(250, 250, 250, 250);
  clrBackground = color(10,20,30);

  createCanvas(w, h);
  background(clrBackground);
  pixelDensity(6.0);
  frameRate(20);

  // countries
  for(var i = 0; i < countries.length; i++){
    var name  = json["countries"][i]["n"];
    var value = json["countries"][i]["v"];
    countries[i] = new country(i, name, value);
  }

  // prefectures 
  for(var i = 0; i < prefectures.length; i++){
    var name  = json["prefectures"][i]["n"];
    var value = json["prefectures"][i]["v"];
    prefectures[i] = new prefecture(i, name, value);
  }
  
  // numbers
  for(var i = 0; i < countries.length; i++){
    for(var j = 0; j < prefectures.length; j++){
      var vl = json["numbers"][i * 47 + j];
      numbers[i][j] = new number(i, j, vl);
    }
  }
  
  objCover = new cover();
}


function draw() {
  
//  consoleTime("000");

  background(10,20,30);
  
//  consoleTime("010");

  for(var i = 0; i < countries.length; i++){
    countries[i].display();
  }

//  consoleTime("020");

  for(var i = 0; i < prefectures.length; i++){
    prefectures[i].display();
  }

//  consoleTime("030");

  for(var i = 0; i < countries.length; i++){
    for(var j = 0; j < prefectures.length; j++){
      numbers[i][j].display();
    }
  }
  
//  consoleTime("040");

  objCover.display();
  
//  consoleTime("050");
}


function consoleTime(station) {
  var end = millis();
  var elapsed = end - start;
  start = end;
  
  console.log(station + ": " + elapsed + "ms.");
}

/*------------------------------------------------------------
 class: country
------------------------------------------------------------*/
function country(tcode, tname, tvalue) {
  this.code  = tcode;
  this.name  = tname;
  this.value = tvalue;
  
  this.x = 100;
  this.w = 50;
  this.min = 50;
  this.max = h - 50;
  
  this.selected = false;
  this.numShow = false;
  this.num = 0;

  this.y = map(curValueC,  0, total, this.min, this.max);
  this.h = map(this.value, 0, total, this.min, this.max) - this.min;
  curValueC += this.value;
  
  this.color = map(curValueC, 0, total, 0, 240);
  
  this.display = function(){

    // when hovered
    if ( this.x <= mouseX && mouseX <= this.x + this.w
      && this.y <= mouseY && mouseY <= this.y + this.h) {

      if (prevHoverType != "C" || prevHoverIndex != this.code){
        isMoving = true;
        startMillis = millis();
        prevHoverType = "C";
        prevHoverIndex = this.code;
      }
      
      for(var i = 0; i < countries.length; i++){
        for(var j = 0; j < prefectures.length; j++){
          numbers[i][j].show = false;
        }
      }

      for(var i = 0; i < countries.length; i++){
        countries[i].selected = false;
        countries[i].numShow = false;
      }
      
      for(var i = 0; i < prefectures.length; i++){
        prefectures[i].selected = false;
        numbers[this.code][i].show = true;
        prefectures[i].numShow = true;
      }
      
      this.selected = true;
      this.numShow = true;
    }
    
    if (prevHoverType == "C" && prevHoverIndex == this.code) {
      this.num = floor(this.value * (1 - objCover.r));
      for(var i = 0; i < prefectures.length; i++){
        prefectures[i].num = floor(numbers[this.code][i].vl * (1 - objCover.r));
      }
    }

    fill(this.color,200,200);
    if (this.selected) {fill(240,240,220);}

    strokeWeight(1);
    stroke(clrBackground);
    strokeCap(SQUARE);
    
    rectMode(CORNER);
    rect(this.x, this.y, this.w, this.h);
    
    textAlign(RIGHT, CENTER);
    text(this.name, this.x - 10, this.y + this.h/2);
    
    if (this.numShow) {
      noStroke();
      fill(200,200,150);
      text(this.num, this.x - 10, this.y + this.h/2 + 13);
    }
  }
}




/*------------------------------------------------------------
 class: prefecture
------------------------------------------------------------*/
function prefecture(tcode, tname, tvalue) {
  this.code  = tcode;
  this.name  = tname;
  this.value = tvalue;
  
  this.x = w - 150;
  this.w = 50;
  this.min = 50;
  this.max = h - 50;
  
  this.selected = false;
  this.numShow = false;
  this.num = 0;

  this.y = map(curValueP,  0, total, this.min, this.max);
  this.h = map(this.value, 0, total, this.min, this.max) - this.min;
  curValueP += this.value;
  
  this.color = map(curValueP, 0, total, 0, 240);
  
  this.display = function(){

    // when hovered
    if ( this.x <= mouseX && mouseX <= this.x + this.w
      && this.y <= mouseY && mouseY <= this.y + this.h) {

      if (prevHoverType != "P" || prevHoverIndex != this.code) {
        isMoving = true;
        startMillis = millis();
        prevHoverType = "P";
        prevHoverIndex = this.code;
      }

      for(var i = 0; i < countries.length; i++){
        for(var j = 0; j < prefectures.length; j++){
          numbers[i][j].show = false;
        }
      }
      
      for(var i = 0; i < countries.length; i++){
        countries[i].selected = false;;
        numbers[i][this.code].show = true;
        countries[i].numShow = true;
      }
      
      for(var i = 0; i < prefectures.length; i++){
        prefectures[i].selected = false;
        prefectures[i].numShow = false;
      }
      
      this.selected = true;
      this.numShow = true;
    }

    if (prevHoverType == "P" && prevHoverIndex == this.code) {
      this.num = floor(this.value * (1 - objCover.r));
      for(var i = 0; i < countries.length; i++){
        countries[i].num = floor(numbers[i][this.code].vl * (1 - objCover.r));
      }
    }

    fill(200,200,this.color);
    if (this.selected) {fill(240,240,220);}
    
    stroke(clrBackground);
    strokeWeight(1);
    strokeCap(SQUARE);
    
    rectMode(CORNER);
    rect(this.x, this.y, this.w, this.h);
    
    textAlign(LEFT, CENTER);
    text(this.name, this.x + this.w + 10, this.y + this.h/2);

    if (this.numShow) {
      noStroke();
      fill(150,200,200);
      text(this.num, this.x + this.w + 10, this.y + this.h/2 + 13);
    }
  }
}



/*------------------------------------------------------------
 class: number
------------------------------------------------------------*/
function number(tci, tpi, tvl) {
  this.ci = tci;
  this.pi = tpi;
  this.vl = tvl;
  this.show = false;

  if (this.vl >= 1) {
    this.min = 50;
    this.max = h - 50;
    
    this.h  = map(this.vl, 0, total, 0, this.max - this.min);
    this.cx = countries[this.ci].x + countries[this.ci].w + 10;
    this.cy = map(curValueNC,  0, total, this.min, this.max) + (this.h / 2);
    this.px = prefectures[this.pi].x - 10;
    this.py = map(curValueNP[this.pi],  0, prefectures[this.pi].value, prefectures[this.pi].y, prefectures[this.pi].y + prefectures[this.pi].h) + (this.h / 2);
    this.cc = map(this.vl, 0, maxNum, 200, 130);
  
    curValueNC += this.vl;
    curValueNP[this.pi] += this.vl;
  }

  this.display = function(){    
    
    if (this.vl >= 1 && this.show) {

      strokeWeight(this.h * 0.9);
      stroke(200,this.cc,this.cc,230);
      noFill();
      
      this.md = (this.cx + this.px) / 2;
      
      bezier(this.cx, this.cy, this.md, this.cy, this.md, this.py, this.px, this.py);
    }
  }
}


/*------------------------------------------------------------
 class: cover
------------------------------------------------------------*/
function cover() {
  this.x = countries[0].x + countries[0].w + 1;
  this.y = countries[0].y;
  this.w = prefectures[0].x - (countries[0].x + countries[0].w) - 2;
  this.h = h - 100;
  this.r = 0;

  this.display = function(){
    if (isMoving) {

      var m = millis() - startMillis;
      var max = 1000;
      
      if (m <= max) {
        this.r = map(m, 0, max, 1, 0);
        
        this.px = this.x;
        this.pw = this.w * this.r;
        
        if (prevHoverType == "C") {
          this.px = this.px + this.w - this.pw;
        }

        noStroke();
        fill(10,20,30);
        rect(this.px, this.y, this.pw, this.h);
      } else {
        this.r = 0;
        isMoving = false;
      }
    }
  }
}








