function hideCover(){
  if ($("#cover").is(":visible")) {
    $("#cover").fadeOut("slow");
  }
}


$(function(){
  hideCover();

  // When pjax pagenation was ended
  $(document).on('pjax:end', function() {
    hideCover();
  });

  // When link with pjax was clicked
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
