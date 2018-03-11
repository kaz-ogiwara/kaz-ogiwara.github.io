$(function(){
  
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

  $(document).on("click", "#link-menu", function(e){
    e.preventDefault();
    $("#menu").addClass("show");
  });
  
  $(document).on("click", "#icon-close,#menu-cover", function(){
    $("#menu").removeClass("show");
  });
});
