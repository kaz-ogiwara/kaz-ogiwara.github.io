$(window).load(function(){
  // Hide cover
  if ($("#cover").is(":visible") && !$("title.hascover")[0]) {
    $("#cover").fadeOut("slow");
  }
});
