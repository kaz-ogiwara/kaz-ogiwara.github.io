var MAX_DATE = 26571;	// 2017/10/01
var LANG = $("html").attr("lang");
var REASONS = {
  "expiration": {
    "jp": "任期満了に伴う総選挙",
    "en": "Due to expiration"
  },
  "dissolution": {
    "jp": "解散に伴う総選挙",
    "en": "Due to dissolution"
  },
  "censure": {
    "jp": "不信任案の可決等に伴う解散",
    "en": "Due to non-confidence"
  },
  "expire": {
    "jp": "任期満了に伴う自動解散",
    "en": "Automatic dissolution"
  }
};


function map(value, low1, high1, low2, high2) {
  var ret = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  return ret;
}


function addYear(date, string){
  var y = map(date, 0, MAX_DATE, 0, 98);
  var html =
    '<div class="year" style="top:' + y + '%">'
    + '<div class="string">' + string + '</div>'
    + '<div class="line"></div>'
  +	'</div>'
  ;
  
  $("#years").append(html);
}


function translatePeriod(period){
  if (LANG === "en") {
    period = period.replace("年", " years<br>");
    period = period.replace("ヶ月", " months");
  }

  return period;
}


function translateCountry(name){
  if (LANG === "jp") {
    name = name.replace("US",       "アメリカ");
    name = name.replace("Germany",  "ドイツ");
    name = name.replace("France",   "フランス");
    name = name.replace("Italy",    "イタリア");
    name = name.replace("UK",       "イギリス");
    name = name.replace("Canada",   "カナダ");
    name = name.replace("Japan",    "日本");
  }

  return name;
}


function translateDisnumber(disnum){
  if (LANG === "jp") {
    return '<div class="disnumber">解散回数: <br><span class="disnumber-inner">' + disnum + '</span> 回</div>'
  } else {
    return '<div class="disnumber">Dissolution: <br><span class="disnumber-inner">' + disnum + '</span> times</div>'
  }
}


$(function(){

  if ($("#cover").is(":visible")) {
    $("#cover").fadeOut();
  }

  $(document).on("click touchend", ".more", function(e) {
    e.preventDefault();
    $(this).hide("fast");
    $("#description-block").find(".detail").show("fast");
  });

  $(document).on("click touchend", ".less", function(e) {
    e.preventDefault();
    $("#description-block").find(".detail").hide("fast");
    $(".more").show("fast");
  });

  $(document).on("click touchend", function(e) {
    if (!$(e.target).closest(".election").length) {
      $(".hovered").removeClass("hovered");
      $(".tooltip").remove();
    }
  });

  $(document).on("mouseover touchend", ".election", function(){
    $(".hovered").removeClass("hovered");
    $(this).addClass("hovered");
    
    $(".tooltip").remove();
    
    var explanation = REASONS["expiration"][LANG];
    if ($(this).hasClass("dissolution")){
      explanation = REASONS["dissolution"][LANG];
      
      if ($(this).hasClass("censure")){
        explanation = REASONS["censure"][LANG];
      }
    } else if ($(this).hasClass("expire")) {
      explanation = REASONS["expire"][LANG];
    }

    var tooltip =
      '<div class="tooltip">'
      +	$(this).attr("date") + '<br>' + explanation
    +	'</div>'
    ;
    
    $(this).append(tooltip);
  });

  $.getJSON("data.json", function(json){
    for (var i = 0; i < json.length; i++) {
      var country = json[i];
      var name   = country["name"];
      var disnum = country["num"];
      var period = translatePeriod(country["period"]);
      var data   = country["data"];
      
      var html =
        '<div class="country country' + i + '">'
        +	'<div class="cname">' + translateCountry(name) + '</div>'
        +	'<div class="flag" style="background-image:url(img/flag_' + name + '.png)"></div>'
        +	translateDisnumber(disnum)
        +	'<div class="avgperiod">' + period + '</div>'
        +	'<div class="timeline">'
          +	'<div class="bone"></div>'
        +	'</div>'
      +	'</div>'
      ;

      $("#countries").append(html);

      for (var j = 0; j < data.length; j++) {
        var value = data[j];
        var y = map(value[0], 0, MAX_DATE, 0, 100);
        
        var dclass = "";
        if (value[1] === 1)   {dclass += " dissolution";}
        if (value[3] === "C") {dclass += " censure";}
        if (value[3] === "E") {dclass += " expire";}
        
        var e =
          '<div class="election' + dclass + '" date="' + value[2] + '" style="top:' + y + '%;">'
          +	'<div class="inner">'
          +	'</div>'
        +	'</div>'
        ;
        
        $(".timeline:last").append(e);
      }
    }
  });
  
  addYear(1826,  "1950");
  addYear(5478,  "1960");
  addYear(9131,  "1970");
  addYear(12783, "1980");
  addYear(16436, "1990");
  addYear(20088, "2000");
  addYear(23741, "2010");
});
