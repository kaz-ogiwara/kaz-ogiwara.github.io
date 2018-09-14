function showContent(){
  if (!$("#pjax-content").hasClass("show")) {
    $("#pjax-content").addClass("show");
  }
}


function hideContent(){
  if ($("#pjax-content").hasClass("show")) {
    $("#pjax-content").removeClass("show");
  }
}


$(function(){

  showContent();

  $(document).on('pjax:end', function() {
    showContent();
    ga('send','pageview',location.pathname);
  });

  $(document).on("click", "a.pjax", function(e){
    e.preventDefault();
    var href = $(this).attr("href");
    var i = 0;

    hideContent();

    $("#pjax-content").on('transitionend', function() {
      if (i === 0) {
        $.pjax({
          url: href,
          container: "#pjax-content",
          fragment: "#pjax-content",
          timeout: 5000
        });
        i++;
      }
    });
  });
});
