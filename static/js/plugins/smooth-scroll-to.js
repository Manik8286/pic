(function ($, window) {
  window.headerOffset = 0; // increases offset accuracy by adding the fixed elements heights

  headerOffset += ($('.header-bar').outerHeight() > 0)     ? $('.header-bar').outerHeight() : 0;
  headerOffset += ($('._p_t-page-head').outerHeight() > 0) ? $('._p_t-page-head').outerHeight() : 0;
  headerOffset += ($('.page-head').outerHeight() > 0)      ? $('.page-head').outerHeight() : 0;
  window.headerOffsetHasTrusted = false;

  $.scrollTo = function() {
    $('body').on('click', 'a[href*=\\#]:not([href=\\#])', function(e) {
       if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        var staticOffset = $(this).data('static-offset');

        if ($('#tsbadgeResponsiveTop_db8d3657bdbe440c985ae127463eaad4node').length) {
          if (!headerOffsetHasTrusted) {
            var trustedheight = $('#tsbadgeResponsiveTop_db8d3657bdbe440c985ae127463eaad4node').outerHeight();
            headerOffset += trustedheight;
            headerOffsetHasTrusted = true;
          }
        }

        if(staticOffset !== 'undefined' && staticOffset >= 0) {
          $('html,body').animate({
            scrollTop: staticOffset
          }, 1000);
          return false;
        }

        else if (target.length) {
          smoothScrollTo(target);
          return false;
        }
      }
    });
  };

  window.smoothScrollTo = function($el) {
    if ($el.length) {
      $('html,body').animate({
        scrollTop: $el.offset().top - headerOffset
      }, 1000);
    }
  }
}(jQuery, window));