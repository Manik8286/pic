(function ($) {
  $.fn.mobileNav = function () {
    return this.each(function() {
      var $menu = $(this);
      var $button = $($menu.attr('data-toggle'));
      var $buttontext = $button.children('.text');
      var spacingBottom = 10;
      var spacingTop = parseInt($('body').css('padding-top'), 10) - $button.position().top;
      var buttonText = $buttontext.text();
      var buttonAlternateText = $buttontext.attr('data-alternate-text');
      $buttontext.css('width', $buttontext.width());
      var clicked = false;

      // Calculate the max height the Nav can be.
      // (This is: screen-height - top position - some padding)
      function maxHeight() {
        var windowHeight = $(window).height();
        $menu.css('max-height', (windowHeight - spacingTop - spacingBottom) + "px");
      }

      // Change the text of the button
      function setText(text) {
        $buttontext.text(text);
      }

      // Change state of Nav to open or closed
      function setState(action) {
        if (action === 'open') {
          $button.addClass('-active');
          $menu.addClass('-expanded');
          $buttontext.text() === buttonText ? setText(buttonAlternateText) : setText(buttonText);
        }
        else if (action === 'close') {
          $menu.removeClass('-expanded');
          $button.removeClass('-active').addClass('-go-out').delay(900).queue(function () {
            $button.removeClass('-go-out').dequeue();
          });
          setText(buttonText);
        }
      }

      $button.on('click', function (e) {
        e.stopPropagation();
        if ($button.hasClass('-active'))
          setState('close');
        else
          setState('open');
      });

      // Don't bubble up when clicking in the menu.
      // Otherwise html.on(click) will be called.
      $menu.on('click', function (e) {
        e.stopPropagation();
      });

      // Prevent body from scrolling while
      // menu is scrolling
      $menu.on('touchstart', function (e) {

        if ($(this).parent().attr("id") == "header-v1") return;

        // if class nav open goes out of screen use overflow auto
        // to see hidden elements out of viewport
        if ($('.nav').height() > $(window).height()){
          $('body').css('overflow-y', 'auto');
        // if fits in screen lock body
        } else {
          $('body').css('overflow-y', 'hidden');
        }
      });
      $menu.on('touchend', function (e) {

        if ($(this).parent().attr("id") == "header-v1") return;

        $('body').css('overflow-y', 'auto');
      })



      // Close the menu when clicking somewhere in the document
      $('html').on('click', function () {
        if ($menu.hasClass('-expanded'))
          setState('close');
      });

      // Calculate max-height
      maxHeight();

      // Re-calculate max-height on resize/orientationchange
      $(window).on('resize orientationchange', function() {
        maxHeight();
      });
    });
  }
}(jQuery));

  function GetDateWeekSupport() {
    var d = new Date();
    var n = d.getDay();
    var h = hours = d.getHours();

    if (n != 6 && n != 0 && (h >= 10 && h < 16) )
    {
      $("#callUs").css( "display", "block" );
      $("#noCallUs").css( "display", "none" );
    }
    else {
      $("#callUs").css( "display", "none" );
      $("#noCallUs").css( "display", "block" );
    }
  }

  jQuery(document).ready(function($) {
    GetDateWeekSupport();
  });

function hideFeedback() {
  if ($("#mobileMenu").hasClass("-expanded")) {
    $(".usabilla_live_button_container").css("z-index", "999");
    $(".embeddedServiceHelpButton").css("z-index", "999");
  } else {
    $(".usabilla_live_button_container").css("z-index", "-1");
    $(".embeddedServiceHelpButton").css("z-index", "-1");
  }
}
