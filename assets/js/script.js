$(function(){
  var ROOT = "https://kaz-ogiwara.github.io/";
  if (location.hostname === "localhost") ROOT = "http://localhost:8888/kaz-ogiwara.github.io/";

  var eClick = (function() {
    if ('ontouchstart' in document.documentElement === true)
      return 'touchstart';
    else
      return 'click';
  })();


  if ($("body").hasClass("home") || $("body").hasClass("works")) {
    $.getJSON(ROOT + "assets/json/works.json", function(works){
      $.each(works, function(i, work) {
        if ($("body").hasClass("works") || i <= 2) {
          var html =  '<div class="work">'
                      + '<div class="image" style="background-image:url(' + ROOT + 'assets/img/eyecatch_' + work.id + '.png)">'
                        + '<a href="' + ROOT + 'works/' + work.id + '/description-en.html"></a>'
                      + '</div>'
                      + '<div class="title">' + work.title + '</div>'
                    + '</div>';

          $("#works-block").append(html);
        }
      });
    });
  }

  $("#icon-menu").on(eClick, function(){
    //$("#menu-cover").fadeIn("fast");
    $("#menu").addClass("show");
  });

  //$("#icon-close,#menu-cover").on("click touchstart", function(){
  $("#icon-close,#menu-cover").on(eClick, function(){
    //$("#menu-cover").fadeOut("fast");
    $("#menu").removeClass("show");
  });

});
