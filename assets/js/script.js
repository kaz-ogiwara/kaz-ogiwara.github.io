

const showContainer = () => {
  if (!$("#pjax-container").hasClass("show")) {
    $("#pjax-container").addClass("show");
  }
}


const hideContainer = () => {
  if ($("#pjax-container").hasClass("show")) {
    $("#pjax-container").removeClass("show");
  }
}


const init = () => {
  $('.lazy').Lazy({
    effect: 'fadeIn',
    effectspeed: 4000,
    threshold: 0
  });

  showContainer();
}



$(function(){

  $(document).on('pjax:end', function() {
    init();
    ga('send','pageview',location.pathname);
  });

  $(document).on("click", "a.pjax", function(e){
    e.preventDefault();

    if (!$(this).hasClass("disabled")) {
      let container = "#pjax-container";
      let href = $(this).attr("href");

      hideContainer();

      $(container).on('transitionend', function() {
        $.pjax({
          url: href,
          cache: false,
          container: container,
          fragment: container,
          timeout: 5000
        });

        $(container).off('transitionend');
      });
    }
  });

  init();
});
