$(window).load(function(){
  // Hide cover
  if ($("#cover").is(":visible") && !$("title.hascover")[0]) {
    $("#cover").fadeOut("slow");
  }

  $.ajax({
    type: "GET",
    url: "../../assets/html/header.html",
    cache: false,
    success: function(data) {
      $("body").prepend(data);
      $("body").addClass("hasheader");
      $("#header").addClass("visible");

      // Set social icons URL
			$("#social-icons").find("a").each(function(){
				var loc = location.href;
				loc = encodeURIComponent(loc);
				$(this).attr("href", $(this).attr("href") + loc);
			});
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert("Connection failed: " + textStatus + " - " + errorThrown);
    }
  });


});

