function hideCover(){
  if ($("#cover").is(":visible")) {
    $("#cover").fadeOut("slow");
  }
}


$(function(){
  hideCover();

  $(document).on('pjax:end', function() {
    hideCover();
    ga('send','pageview', location.pathname);
  });

  $(document).on("click", "a.pjax", function(e){
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
