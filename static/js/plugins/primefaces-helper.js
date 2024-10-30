(function($, window) {
  $.primefacesHelper = function() {
    function radioUtility() {
      $('.ui-radiobutton').each(function() {
        if ($(this).data('pfHelper_updated') === undefined) {
          $(this).data('pfHelper_updated', true);
          var $ui = $(this);
          var id = $ui.attr('id');
          var passClasses = [];
          var $radio = $ui.find('input[type="radio"]');

          $ui.attr('id', id + ':helper');
          $ui.css('display', 'none');
          
          $radio.attr('id', id);
          $radio.insertAfter($ui);

          $.each($ui.attr('class').split(' '), function(key, val) {
            if (val.substring(0, 3) !== 'ui-') {
              passClasses.push(val);
            }
          });    

          $( document ).ready(function() {
              $radio.attr('class', passClasses.join(' '));
              $.activeTarget();
          });
        }
      });
    }

    radioUtility();

    window.pfhelper = {};
    window.pfhelper.updateDom = function() {
      radioUtility();
    };
  };

  $.fn.zIndex = function() {
    return $(this).css('z-index');
  };
}(jQuery, window));