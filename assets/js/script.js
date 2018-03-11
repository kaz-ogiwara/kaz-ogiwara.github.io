$(function(){
  var eClick = (function() {
    if ('ontouchstart' in document.documentElement === true)
      return 'touchstart';
    else
      return 'click';
  })();

  
  if ($("body").hasClass("home") || $("body").hasClass("works")) {
    $.getJSON("/kaz-ogiwara.github.io/assets/json/works.json", function(works){
      $.each(works, function(i, work) {
        if ($("body").hasClass("works") || i <= 2) {
          var html =  '<div class="work">'
                      + '<div class="image" style="background-image:url(/kaz-ogiwara.github.io/assets/img/eyecatch_' + work.id + '.png)">'
                        + '<a href="/kaz-ogiwara.github.io/works/' + work.id + '/description-en.html"></a>'
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
