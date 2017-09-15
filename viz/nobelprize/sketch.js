var canvasW = $("#laureates").width();
var canvasH = $("#laureates").height();;

var boxX = 0;
var boxY = 0;
var boxW = canvasW;
var boxH = canvasH;

function setup() {
  var canvas = createCanvas(canvasW, canvasH);
  canvas.parent("laureates");
  frameRate(2);
}


function draw() {
  clear();
  var main = $("#select-prize").val();
  var sub  = $("#select-prize2").val();
  
  if (sub) {
    drawLine(sub, 80);
  }
  drawLine(main, 200);
}

// Convert year to X axis
function getYearX(year) {
  return map(year, 1901, 2016, boxX, boxX + boxW);
}

function getValueY(value) {
  return map(value, 0, 100, boxY + boxH, boxY);
}

function drawLine(type, alpha) {
  this.data = json["line"][type];

  var color = colors[type];
  
  strokeWeight(5);
  noFill();

  var prev = 0;
  
  stroke(0, 0, 0, 50);
  beginShape();
    for (i = 1901; i <= 2016; i++) {
      var v1 = this.data[i];
      if (!v1) {v1 = prev;}
      if (v1) {
        curveVertex(getYearX(i),  getValueY(v1) + 3);
        prev = v1;
      }
    }
  endShape();

  prev = 0;
  stroke(color[0], color[1], color[2], alpha);
  beginShape();
    for (i = 1901; i <= 2016; i++) {
      var v1 = this.data[i];
      if (!v1) {v1 = prev;}
      if (v1) {
        curveVertex(getYearX(i),  getValueY(v1));
        prev = v1;
      }
    }
  endShape();
}


