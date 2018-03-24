var canvasW = $("#canvas").width();
var canvasH = $("#canvas").height();


function setup() {

  var canvas = createCanvas(canvasW, canvasH);
  canvas.parent('canvas');
  frameRate(0);

  $.getJSON("json/resources.json", function(data) {
    drawLine(data, true);
    drawLine(data, false);
  });
}


function drawLine(data, isShadow){

  var min = 2000000000;
  var max = 6000000000;
  var cur = [];
  var lgt = data.length;

  $.each(data, function(i, col){
    
    var x = map(i + 0.5, 0, lgt, 0, canvasW);
    var y = map(col[2], min, max, canvasH, 0);
    
    strokeWeight(4);
    stroke("#EF9643");
    noFill();
    
    if (isShadow) stroke("rgba(0,0,0,0.4)");
    
    if (cur[0]) {
      if (isShadow) {
        line(x + 1, y + 1, cur[0] + 1, cur[1] + 1);
      } else {
        line(x, y, cur[0], cur[1]);
        
        strokeWeight(2);
        fill("#fefefe");
        ellipse(x, y, 6);
      }
    }
    
    cur = [x, y];
  });

  if (!isShadow) {
    $.each(data, function(i, col){
      var x = map(i + 0.5, 0, lgt, 0, canvasW);
      var y = map(col[2], min, max, canvasH, 0);
      strokeWeight(2);
      fill("#fefefe");
      ellipse(x, y, 6);
    });
  }
}




