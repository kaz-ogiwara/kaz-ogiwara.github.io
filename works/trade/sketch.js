var linesnum = data.lines.import.length + data.lines.export.length;
var objLines = new Array(linesnum);
var rightnum = {
  import: $("#import-products").find(".box").length,
  export: $("#export-countries").find(".box").length
};
var stocks_y1 = {
  import: $("#import-countries").offset().top - $("#canvas").offset().top,
  export: $("#export-products").offset().top - $("#canvas").offset().top
};

var stocks_y2 = {
  import: [0,0,0,0,0,0,0,0,0,0,0],
  export: [0,0,0,0,0,0,0,0]
};

function setup() {
  var canvas = createCanvas(canvasW, canvasH);
  canvas.parent("canvas");
  pixelDensity(6.0);

  // lines
  for(var i = 0; i < objLines.length; i++){

    var ttype = "import";
    var idx   = i;
    var parent_left = $("#import-products");
    
    if (i + 1 > data.lines.import.length) {
      ttype = "export";
      idx   = i - data.lines.import.length;
      parent_left = $("#export-countries");
    }
    
    var tx1 = $("#" + ttype + "-lines").offset().left + 5;
    var tx2 = parent_left.offset().left - 5;
    
    var mod = idx % rightnum[ttype];
    var ty1 = stocks_y1[ttype];
    var ty2 = stocks_y2[ttype][mod];
    var y2d = ty2 + parent_left.find('.box').eq(mod).offset().top - $("#canvas").offset().top;
    var th  = map(data.lines[ttype][idx], 0, total, 0, $("#" + ttype).height());
    
    var left_idx = parseInt(idx / rightnum[ttype]);
    var right_idx = mod;
    
    objLines[i] = new objLine(ttype, left_idx, right_idx, tx1, ty1, tx2, y2d, th);
    
    stocks_y1[ttype] += th;
    stocks_y2[ttype][mod] += th;
  }
}


//function showLines(type, position, high, low, cover){
function showLines(type, position, index, cover) {
  
  var rectX = $("#" + type).find(".lines-cover").offset().left;
  var rectY = $("#" + type).find(".lines-cover").offset().top - $("#canvas").offset().top;
  var rectW = $("#" + type).find(".lines-cover").width();
  var rectH = $("#" + type).find(".lines-cover").height();

  noStroke();
  fill(30,60,90);
  rect(rectX, rectY, rectW, rectH);

  for(var i = 0; i < objLines.length; i++){
    if (objLines[i].type === type) {
      if (  (position === "left"  && index === objLines[i].li)
        ||  (position === "right" && index === objLines[i].ri)) {
        objLines[i].display();
      }
    }

/*
    var y = objLines[i].y1;
    if (position === "right") {y = objLines[i].y2;}
    
    if (low < y && y < high && objLines[i].type === type) {
      objLines[i].display();
    }
*/
  }

  cover.animate({width: 0}, 1500);
}


/*------------------------------------------------------------
 class: objLine
------------------------------------------------------------*/
function objLine(ttype, tli, tri, tx1, ty1, tx2, ty2, th) {
  this.type = ttype;
  this.li = tli;
  this.ri = tri;
  this.h  = th;
  this.x1 = tx1;
  this.y1 = ty1 + (th / 2);
  this.x2 = tx2;
  this.y2 = ty2 + (th / 2);
  //this.cr = map(this.y1, 0, $("#canvas").offset().top + $("#canvas").height(), 200, 255);
  this.color = color(200, 200, 200);
  if (this.type === "import") {
    if (this.ri === 0 || this.ri === 5 || this.ri === 6) {
      this.color = color(255, 200, 220);
    }
  } else {
    if (this.li === 0 || this.li === 1 || this.li === 2) {
      this.color = color(255, 200, 220);
    }
  }

  this.mx   = (abs(tx2 - tx1) / 2) + tx1;

  this.display = function(){
    if (this.h >= 1) {
      strokeWeight(this.h);
      strokeCap(SQUARE);
      stroke(this.color);
      //stroke(250, this.cr, this.cr);
      noFill();
      bezier(this.x1, this.y1, this.mx, this.y1, this.mx, this.y2, this.x2, this.y2);
    }
  };
}









