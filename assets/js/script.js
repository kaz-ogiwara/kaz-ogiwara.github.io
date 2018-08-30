function hideCover(){
  if ($("#cover").is(":visible")) {
    $("#cover").fadeOut("slow");
  }
}


$(function(){
  var ROOT = "https://kaz-ogiwara.github.io/";
  if (location.hostname === "localhost") ROOT = "http://localhost:8888/kaz-ogiwara.github.io/";

  var eClick = (function() {
    if ('ontouchstart' in document.documentElement === true)
      return 'touchstart';
    else
      return 'click';
  })();

  hideCover();

  // When pjax pagenation was ended
  $(document).on('pjax:end', function() {
    hideCover();
  });

  // When link with pjax was clicked
  $(document).on(eClick, "a.pjax", function(e){
    e.preventDefault();
    var href = $(this).attr("href");

    $.when(
      $("#cover").fadeIn("fast"),
    ).done(function() {
      $.pjax({
        url: href,
        container: "#pjax-content",
        fragment: "#pjax-content",
        timeout: 5000
      });
    });
  });
});
