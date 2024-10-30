(function($) {
  $.formclickContainer = function() {
    $('body').on('click mouseenter mouseleave', '*[data-clickarea] input, .js-clickarea input', function(e) {
      e.stopPropagation();
    });

    $('body').on('mouseenter', '*[data-clickarea], .js-clickarea', function(e) {
      $(this).find('.radio input, .checkmark input').addClass('-hover');
    });

    $('body').on('mouseleave', '*[data-clickarea], .js-clickarea', function(e) {
      $(this).find('.radio input, .checkmark input').removeClass('-hover');
    });

    $('body').on('click', '*[data-clickarea], .js-clickarea', function() {
      var $input = $(this).find('input:first');
      $input.prop('checked', true).trigger('change');
    });
  };
}(jQuery));