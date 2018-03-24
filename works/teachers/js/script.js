var vMax = {
	"total": 70000		// maximum number of teachers in a prefecture (fulltime + parttime)
,	"row": 19				// maximum index of row
,	"ratio": 16.26	// maximum ratio of parttime teachers (Kagawa, 2017)
}

var vMin = {
	"ratio": 0.11	// minimum ratio of parttime teachers (Hyogo, 1998)
}


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


// Based on: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
function pRound(num, precision){
	var factor = Math.pow(10, precision);
	return Math.round(num * factor) / factor;
}


function getValueColor(v){
	//var r = map(v, vMin.ratio, vMax.ratio, 0, 100);
	var quartiles = [2.64, 4.51, 7.33];
	
	var ret = ["#cccccc",0];
	if (v < quartiles[0])						 					 ret = ["#80A0ED",1];
	if (quartiles[0] <= v && v < quartiles[1]) ret = ["#8CEAAA",2];
	if (quartiles[1] <= v && v < quartiles[2]) ret = ["#F9E886",3];
	if (quartiles[2] <= v)										 ret = ["#F29393",4];
	
	return ret;
}


function showDescription($v, type){
	$desc = $("#description");
	
	if (type === "ptv" || type === "ggcol") {
		
		//
		if (type === "ggcol") {
			console.log($v.attr("name"));
			$v = $("ptv[name='" + $v.attr("name") + "'][year='2017']");
		}
		
		
		$desc.html(
				'<h4 class="name"></h4>'
		+		'<table>'
		+			'<thead>'
		+				'<tr>'
		+					'<th></th>'
		+					'<th>Female</th>'
		+					'<th>Male</th>'
		+					'<th>Total</th>'
		+				'</tr>'
		+			'</thead>'
		+			'<tbody>'
		+				'<tr>'
		+					'<th>Full-time (A)</th>'
		+					'<td class="ff"></td>'
		+					'<td class="fm"></td>'
		+					'<td class="ft"></td>'
		+				'</tr>'
		+				'<tr>'
		+					'<th>Part-time (B)</th>'
		+					'<td class="pf"></td>'
		+					'<td class="pm"></td>'
		+					'<td class="pt"></td>'
		+				'</tr>'
		+				'<tr>'
		+					'<th>Ratio (B / (A + B))</th>'
		+					'<td class="rf"></td>'
		+					'<td class="rm"></td>'
		+					'<td class="rt"></td>'
		+				'</tr>'
		+			'</tbody>'
		+		'</table>'
		);
		
		var ft = parseInt($v.attr("ff")) + parseInt($v.attr("fm"));
		var pt = parseInt($v.attr("pf")) + parseInt($v.attr("pm"));
		var rf = pRound(parseFloat($v.attr("pf")) / (parseFloat($v.attr("ff")) + parseFloat($v.attr("pf"))) * 100,1);
		var rm = pRound(parseFloat($v.attr("pm")) / (parseFloat($v.attr("fm")) + parseFloat($v.attr("pm"))) * 100,1);
		var rt = pRound(parseFloat(pt) / parseFloat(ft + pt) * 100,1);
		
		$desc.find(".ff").text(addCommas($v.attr("ff")));
		$desc.find(".fm").text(addCommas($v.attr("fm")));
		$desc.find(".ft").text(addCommas(ft));
		$desc.find(".pf").text(addCommas($v.attr("pf")));
		$desc.find(".pm").text(addCommas($v.attr("pm")));
		$desc.find(".pt").text(addCommas(pt));
		$desc.find(".rf").text(rf + "%");
		$desc.find(".rm").text(rm + "%");
		$desc.find(".rt").text(rt + "%");
		$desc.find(".name").text($v.attr("name") + " - " + $v.attr("year"));

	} else if (type === "rscol") {
		$desc.html(
				'<h4 class="name">' + $v.attr("year") + '</h4>'
		+		'<table>'
		+			'<tbody>'
		+				'<tr>'
		+					'<th class="hasmark"><div class="ge"></div>Government expenditure:</th>'
		+					'<td>' + addCommas($v.attr("ge")) + '<span class="gray">bn JPY</span></td>'
		+				'</tr>'
		+				'<tr>'
		+					'<th class="hasmark"><div class="tr"></div>Teachers remuneration:</th>'
		+					'<td>' + addCommas($v.attr("lc")) + '<span class="gray">bn JPY</span></td>'
		+				'</tr>'
		+			'</tbody>'
		+		'</table>'
		);
	}
	
	
	$desc.addClass("show");
}


function hideDescription(){
	$("#description").removeClass("show");
}


function drawParttimeRatio(){
	var $bc = $("#bubble-chart");

	$.getJSON("json/parttimeRatio.json",function(data){		
		$.each(data, function(i, pref){
			var html =	'<div class="row">'
									+	'<div class="name">' + pref.name + '</div>'
									+	'<div class="values"></div>'
								+	'</div>';

			$bc.append(html);

			$.each(pref.full.f, function(i, t){
				var total		= pref.full.f[i] + pref.full.m[i] + pref.part.f[i] + pref.part.m[i];
				var ratio		= pRound(parseFloat((pref.part.f[i] + pref.part.m[i]) / total) * 100,2);
				var vColor  = getValueColor(ratio);
				var vRadius = pRound(map(total, 0, vMax.total, 6, 48),2) + 'px';
				var vLeft   = 'calc(' + pRound(map(i,   0, vMax.row, 2, 95),2) + '% - (' + vRadius + ' / 2))';
				var vTop    = 'calc(50% - (' + vRadius + ' / 2))';
				var vZindex = pRound(vRadius.replace("px",""),0);	// vColor[1]
				var v =	'<ptv '
								+	'name="' + pref.name + '" '
								+	'year="' + (i + 1998).toString() + '" '
								+	'ff="' + pref.full.f[i] + '" '
								+	'fm="' + pref.full.m[i] + '" '
								+	'pf="' + pref.part.f[i] + '" '
								+	'pm="' + pref.part.m[i] + '" '
								+	'z="' + vZindex + '" '
								+	'style="'
									+	'background-color:' + vColor[0] + ';'
									+	'width:' + vRadius + ';'
									+	'height:' + vRadius + ';'
									+	'left:' + vLeft + ';'
									+	'top:' + vTop + ';'
								+	'">'
							+	'</ptv>';
				$bc.find(".values:last").append(v);
				//console.log(i);
			});
		});

		$("ptv").each(function(){
			$(this).css("z-index",$(this).attr("z"));
		});

	}).done(function(){
		$bc.addClass("show");
	});
}


function drawGendergap(){
	var $gg = $("#gendergap");

	$.getJSON("json/gendergap.json",function(data){
		var minRatio = 0;
		var maxRatio = 20;
		
		$.each(data, function(i, pref){
			
			var ym = map(pref[1], minRatio, maxRatio, 100, 0);
			var yf = map(pref[2], minRatio, maxRatio, 100, 0);
			
			var yl = ym;	if (ym > yf) yl = yf;
			var sl = Math.abs(ym - yf);
			
			var html =	'<div class="ggcol" name="' + pref[0] + '">'
									+	'<div class="m" style="top: ' + ym + '%;"></div>'
									+	'<div class="l" style="top: ' + yl + '%; height: ' + sl + '%;"></div>'
									+	'<div class="f" style="top: ' + yf + '%;"></div>'
								+	'</div>';

			$gg.append(html);
		});

	}).done(function(){
		$gg.addClass("show");
	});
}


function drawResources(){
	var $rs = $("#resources");

	$.getJSON("json/resources.json",function(data){
		var n = {
			"min": 0,
			"max": 4000000000
		}
		
		$.each(data, function(i, col){
			
			var th = map(col[1], n.min, n.max, 0, 100);
			var ge = parseInt(parseFloat(col[1]) / 1000000);
			var lc = parseInt(parseFloat(col[2]) / 1000000);
			
			var html =	'<div class="rscol" year="' + col[0] + '" ge="' + ge + '" lc="' + lc + '">'
									+	'<div class="bar" style="height: ' + th + '%;"></div>'
								+	'</div>';

			$rs.append(html);
		});

	}).done(function(){
		$rs.addClass("show");
	});
}


$(function(){
	drawParttimeRatio();
	drawGendergap();
	drawResources();


	$(document).on("mouseover", function(e){

		if($(e.target).closest('ptv').length) {
			showDescription($(e.target).closest("ptv"), "ptv");
		} else if($(e.target).closest('.ggcol').length) {
			showDescription($(e.target).closest(".ggcol"), "ggcol");
		} else if($(e.target).closest('.rscol').length) {
			showDescription($(e.target).closest(".rscol"), "rscol");
		} else {
			hideDescription();
		}
	});
});


