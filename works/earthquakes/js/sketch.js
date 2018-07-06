var winW = 720;
var winH = 410;
var mapH = 360;
var btnW =  80;
var isPlaying = false;
var isClicking = false;

var duration = 0;
switch($("#select-time").val()) {
  case "hour":  duration = 1000 * 3600;           break;
  case "day":   duration = 1000 * 3600 * 24;      break;
  case "week":  duration = 1000 * 3600 * 24 * 7;  break;
  case "month": duration = 1000 * 3600 * 24 * 30; break;
  default:      duration = 0;
}

var objWorldmap;
var objSlider;
var objButton;
var objQuakes = new Array(json["features"].length);

var clrBackground;
var clrBlue;
var clrWhite;
var clrYellow;
var clrRed;
var clrGrey;

var imgWorldmap;
var hoveredQuakeIndex = -1;

function preload() {
  imgWorldmap = loadImage("img/worldmap.jpg");
}


function setup() {
  clrBackground = color( 10,  20,  30);
  clrBlue       = color(130, 206, 238);
  clrYellow     = color(239, 169,  41);
  clrWhite      = color(250, 250, 250);
  clrRed        = color(240, 100, 100);
  clrGrey       = color(150, 150, 150);
  
  createCanvas(winW, winH + 100);
  background(clrBackground);
  textSize(15);
  pixelDensity(1.0);

  objWorldmap = new worldmap(0, 0, winW, winW / 2);
  objButton = new button(0, mapH, btnW, winH - mapH);
  objSlider = new slider(btnW, mapH, winW - btnW, winH - mapH);
  
  for(var i = 0; i < objQuakes.length; i++){
    var feature = json["features"][i];
    
    var msc = feature["properties"]["time"];
    var lat = feature["geometry"]["coordinates"][1];
    var lng = feature["geometry"]["coordinates"][0];
    var mag = feature["properties"]["mag"];
    var dep = feature["geometry"]["coordinates"][2];
    var url = feature["properties"]["url"];
    var place = feature["properties"]["place"];
    var status = feature["properties"]["status"];
    
    objQuakes[i] = new quake(i, msc, lat, lng, mag, dep, url, place, status);
  }
}


function draw() {
  
  background(clrBackground);
  
  objWorldmap.display();
  objButton.display();
  objSlider.display();

  for(var i = 0; i < objQuakes.length; i++){
    objQuakes[i].display();
  }

  // prevent flickering
  isClicking = false;
}


/*------------------------------------------------------------
 class: worldmap
------------------------------------------------------------*/
function worldmap(tx, ty, tw, th) {
  this.x = tx;
  this.y = ty;
  this.w = tw;
  this.h = th;
  
  this.display = function(){
    tint(100,120,140);
    image(imgWorldmap, this.x, this.y, this.w, this.h);
  }
}


/*------------------------------------------------------------
 class: button
------------------------------------------------------------*/
function button(tx, ty, tw, th) {
  this.b = 10;
  this.x = tx + this.b;
  this.y = ty + this.b;
  this.w = tw - (2 * this.b);
  this.h = th - (2 * this.b);
  
  this.display = function(){

    this.hover = false;
    noFill();

    // when play button is pushed
    if (  this.x <= mouseX && mouseX <= this.x + this.w
      &&  this.y <= mouseY && mouseY <= this.y + this.h){
      this.hover = true;
      fill(250,250,250,20);
    }
    
    if (this.hover && isClicking) {
      isPlaying = !isPlaying;
    }

    // draw button
    strokeWeight(2);
    stroke(clrBlue);
    rect(this.x, this.y, this.w, this.h, 5);
    
    // when playing
    if (isPlaying) {
      
      objSlider.cx += 2;
      if (objSlider.cx > objSlider.max) {
        objSlider.cx = objSlider.max;
        isPlaying = false;
      }

      // draw stop icon
      rectMode(RADIUS);
      fill(clrBlue);
      noStroke();
      this.wh = 6;
      rect(this.x + (this.w / 2), this.y + (this.h / 2), this.wh, this.wh);
      rectMode(CORNER);

    // when stopping
    } else {

      // draw play icon
      fill(clrBlue);
      noStroke();
      this.bx = 24;
      this.by =  8;
      triangle(this.x + this.bx, this.y + this.by, this.x + this.bx, this.y + this.h - this.by, this.x + this.w - this.bx, this.y + (this.h / 2));
    }
    
  }
}


/*------------------------------------------------------------
 class: slider
------------------------------------------------------------*/
function slider(tx, ty, tw, th) {
  this.x = tx;
  this.y = ty;
  this.w = tw;
  this.h = th;
  
  this.min = this.x + 20;
  this.max = this.x + this.w - 20;
  this.cx = this.min;
  this.cy = this.y + (this.h / 2);
  this.cr = 30;
  
  this.maxTime = json["metadata"]["generated"]; // msec of generated date & time
  this.minTime = this.maxTime - duration;
  this.value = this.minTime;

  this.hover = false;
  
  this.display = function(){
    this.hover = false;
    
    // when background is hovered (not only button, in order to realize smoothe touch)
    if (  this.x <= mouseX && mouseX <= this.x + this.w
      &&  this.y <= mouseY && mouseY <= this.y + this.h) {
        this.hover = true;
    }

    // when clicked
    if (this.hover && mouseIsPressed) {
      this.cx = max(min(mouseX, this.max), this.min);
    }

    // draw slide bar
    stroke(150,150,150);
    strokeWeight(6);
    line(this.min, this.y + (this.h / 2), this.max, this.y + (this.h / 2));
    
    // draw played part
    stroke(200,100,100);
    line(this.min, this.y + (this.h / 2), this.cx, this.y + (this.h / 2));

    // draw circle
    stroke(clrYellow);
    strokeWeight(3);
    fill(clrWhite);
    ellipse(this.cx, this.cy, this.cr, this.cr);

    // v: adjust cx into a number from 0 to difSecond
    this.value = map(this.cx, this.min, this.max, this.minTime, this.maxTime);

    showDatetime(this.value);
  }
}


/*------------------------------------------------------------
 class: quake
------------------------------------------------------------*/
function quake(ti, tmsc, tlat, tlng, tmag, tdep, turl, tplace, tstatus) {
  this.i   = ti;
  this.msc = tmsc;
  this.lat = tlat;
  this.lng = tlng;
  this.mag = tmag;
  this.dep = tdep;
  this.url = turl;
  this.place = tplace;
  this.status = tstatus;

  this.x = map(this.lng, -180, 180, objWorldmap.x, objWorldmap.x + objWorldmap.w);
  this.y = map(this.lat,   90, -90, objWorldmap.y, objWorldmap.y + objWorldmap.h);
  this.r =  map(this.mag,0,9,3,30)   // radius of circle: between 5 and 20
  this.wr = this.r * 3;  // radius of wave

  
  this.display = function(){
    
    this.hover = false;
    this.dif = this.msc - objSlider.value;
    this.max = duration * 0.02;
    
    if (-1 * this.max <= this.dif && this.dif <= 0) {

      // calculate size and alpha of ellipse
      // would like to show each earthquake spreads, then fades away
      this.ewr = map(this.dif, -1 * this.max, 0, this.wr, 0);
      this.alp = 255;
      
      if (this.dif <= -0.5 * this.max) {
        this.alp = map(this.dif, -1 * this.max, -0.5 * this.max, 100, 255);
      }
      
      // show wave (to show wave under circle, show wave at first)
      noFill();
      stroke(255,100,100, this.alp);
      strokeWeight(1);
      ellipse(this.x, this.y, this.ewr, this.ewr);

      // when hovered
      if (dist(mouseX, mouseY, this.x, this.y) <= this.r) this.hover = true;
      
      if (this.hover) {
        fill(255,255,100, this.alp);
        showTooltip(this.x, this.y, this.msc, this.lat, this.lng, this.mag, this.dep, this.url, this.place, this.status);
        hoveredQuakeIndex = this.i;
      } else {
        fill(230, this.alp);
        if (hoveredQuakeIndex == this.i) {
          hideTooltip();
        }
      }
      
      // show circle
      stroke(255,100,100, this.alp);
      strokeWeight(1);
      ellipse(this.x, this.y, this.r, this.r);
    }
  }
}


/*------------------------------------------------------------
 other functions
------------------------------------------------------------*/
function getDateStr(msec) {
  var date = new Date();
  date.setTime(msec);

  var str = date.getFullYear()
        +	"-" + ("0" + (date.getMonth() + 1)).slice(-2)
        + "-" + ("0" + date.getDate()).slice(-2)
        + " " + ("0" + date.getHours()).slice(-2)
        + ":" + ("0" + date.getMinutes()).slice(-2)
        + ":" + ("0" + date.getSeconds()).slice(-2)
        ;
  return str;
}


function showDatetime(msec) {

  this.x = objWorldmap.x + (objWorldmap.w / 2);
  this.y = objWorldmap.y + objWorldmap.h - 10;
  this.w = 200;
  this.h = 25;

  noStroke();
  fill(0, 0, 0, 180);
  rect(this.x - (this.w / 2), this.y - this.h + 4, this.w, this.h, this.h / 2);

  fill(clrWhite);
  textAlign(CENTER, BOTTOM);
  text(getDateStr(msec), objWorldmap.x + (objWorldmap.w / 2), objWorldmap.y + objWorldmap.h - 10);
}


function mousePressed() {
  isClicking = true;
}


/*------------------------------------------------------------
 Tooltip
------------------------------------------------------------*/
function showTooltip(x, y, msc, lat, lng, mag, dep, url, place, status) {

  $("#tooltip-inner").html(
    "<div class='title'>" + place + "</div>"
  + "<div>Date & time: " + getDateStr(msc) + "</div>"
  + "<div>Magnitude: " + mag + "</div>"
  + "<div>Latitude: " + lat + "</div>"
  + "<div>Longitude: " + lng + "</div>"
  + "<div>Depth: " + dep + "km</div>"
  + "<div>Status: " + status + "</div>"
  );

  var left = x + $("canvas").offset().left - ($("#tooltip").width() / 2) - 12;
  var top  = y + $("canvas").offset().top - $(window).scrollTop() + 20;
  
  $("#tooltip").css("left", left + "px");
  $("#tooltip").css("top", top + "px");
  $("#tooltip").show();
}


function hideTooltip() {
  $("#tooltip").hide();
}







