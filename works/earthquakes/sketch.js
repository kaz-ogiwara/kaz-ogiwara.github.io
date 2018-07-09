var winW = $("#canvas").width();
var wBase = winW / 720;
var winH = wBase * 410;
var mapH = wBase * 360;
var btnW = wBase *  80;

var json;
var isSetup = false;
var isPlaying = false;
var isClicking = false;
var duration = 0;
var objWorldmap;
var objSlider;
var objButton;
var objQuakes;
var imgWorldmap;
var hoveredQuakeIndex = -1;


var COLORS = {
  "background": [10,  20,  30],
  "blue": [130, 206, 238],
  "yellow": [239, 169,  41],
  "white": [250, 250, 250],
  "red": [240, 100, 100],
  "grey": [150, 150, 150]
};



// The same function as map in Processing
function map(value, low1, high1, low2, high2) {
  var ret = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  return ret;
}


function preload() {
  imgWorldmap = loadImage("img/worldmap.jpg");
}


function setup() {

  var canvas = createCanvas(winW, winH);
  canvas.parent('canvas-block');
  pixelDensity(1.0);
  frameRate(0);

  kSetup();
}


function kSetup(){
  frameRate(0);

  $("#canvas-cover").fadeIn("fast");

  var time = $("#select-time").val();
  var mag  = $("#select-mag").val();
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/" + mag + "_" + time + ".geojson";

  $.getJSON(url).done(function(data){
    json = data;

    switch($("#select-time").val()) {
      case "hour":  duration = 1000 * 3600;           break;
      case "day":   duration = 1000 * 3600 * 24;      break;
      case "week":  duration = 1000 * 3600 * 24 * 7;  break;
      case "month": duration = 1000 * 3600 * 24 * 30; break;
      default:      duration = 0;
    }

    objWorldmap = new worldmap(0, 0, winW, winW / 2);
    objButton = new button(0, mapH, btnW, winH - mapH);
    objSlider = new slider(btnW, mapH, winW - btnW, winH - mapH);
    objQuakes = new Array(json.features.length);

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

    frameRate(60);
    $("#canvas-cover").fadeOut("fast");
  });
}


function draw() {

  background(color(COLORS.background));
  
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
  this.b = wBase * 10;
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
    stroke(color(COLORS.blue));

    rect(this.x, this.y, this.w, this.h, wBase * 5);
    
    // when playing
    if (isPlaying) {
      
      objSlider.cx += 1;
      if (objSlider.cx > objSlider.max) {
        objSlider.cx = objSlider.max;
        isPlaying = false;
      }

      // draw stop icon
      rectMode(RADIUS);
      fill(color(COLORS.blue));
      noStroke();
      this.wh = wBase * 6;
      rect(this.x + (this.w / 2), this.y + (this.h / 2), this.wh, this.wh);
      rectMode(CORNER);

    // when stopping
    } else {

      // draw play icon
      fill(color(COLORS.blue));
      noStroke();
      this.bx = wBase * 24;
      this.by = wBase *  8;
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
  
  this.min = this.x + (wBase * 20);
  this.max = this.x + this.w - (wBase * 20);
  this.cx = this.min;
  this.cy = this.y + (this.h / 2);
  this.cr = wBase * 30;
  
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
    stroke(color(COLORS.yellow));
    strokeWeight(3);
    fill(color(COLORS.white));
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
  this.r =  map(this.mag, 0, 9, 3, 30)    // radius of circle
  this.wr = this.r * 3;                   // radius of wave

  
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
  this.w = wBase * 200;
  this.h = wBase *  25;

  noStroke();
  fill(0, 0, 0, 180);
  rect(this.x - (this.w / 2), this.y - this.h + (wBase * 4), this.w, this.h, this.h / 2);

  fill(color(COLORS.white));
  textAlign(CENTER, BOTTOM);
  text(getDateStr(msec), objWorldmap.x + (objWorldmap.w / 2), objWorldmap.y + objWorldmap.h - (wBase * 10));
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


$(function(){
  $("select").on("change", function(){
    kSetup();
  });
});





