(function ($) {
  $.fn.accordion = function () {
    var opts = {
      handleSelector: '.js-accordion-title',
      groupSelector: '.js-accordion-body',
      handleToggleClass: '-active',
      groupToggleClass: '-expanded',
      groupShowingClass: '-showing',
      groupHidingClass: '-hiding'
    };

    // Handle = The clickable part
    // Group  = The sliding part

    return this.each(function () {
      var $accordion = $(this);
      var $handles = $accordion.find(opts.handleSelector);
      var isClosable = $accordion.attr('data-accordion-close') || false;

      // Calculate max-height of groups
      // and save it together with transition
      // duration for each group.
      $handles.next(opts.groupSelector).each(function() {
        var $t = $(this);
        var calcHeight = 0;
        $t.css('max-height', 'none');
        $t.children().each(function() {
          calcHeight += $(this).outerHeight(true);
        });
        $t.data('height', calcHeight);
        var transitionDuration = Modernizr.csstransitions ? $t.css('transition-duration') : "0.5s";
        $t.data('duration', transitionDuration.slice(0,-1) * 1000);
        $t.data('opened', false);
        $t.css('max-height', '');
      });

      // close all open groups except for $except
      function closeOthers($except) {
        $handles.next(opts.groupSelector).each(function () {
          if ($(this).data('opened', true) && $(this)[0] != $except[0]) close($(this));
        });
      }

      // close a group
      function close($e) {
        $e.dequeue();
        $e.prev(opts.handleSelector).removeClass(opts.handleToggleClass);
        $e.css('max-height', '')
          .delay($e.data('duration'))
          .addClass(opts.groupHidingClass)
          .removeClass(opts.groupToggleClass)
          .queue(function() {
            $e.data('opened', false)
              .removeClass(opts.groupHidingClass)
              .dequeue();
        });
      }

      // open a group
      function open($e) {
        $e.dequeue();
        $e.prev(opts.handleSelector).addClass(opts.handleToggleClass);
        $e.css('max-height', $e.data('height') + 20)
          .removeClass(opts.groupHidingClass)
          .delay($e.data('duration'))
          .addClass(opts.groupShowingClass)
          .queue(function() {
            $e.data('opened', true)
              .addClass(opts.groupToggleClass)
              .removeClass(opts.groupShowingClass);
            $(this).dequeue();
          });
      }

      // Clickhandler
      $handles.on('click', function (e) {
        var $group = $(this).next(opts.groupSelector);

        if ($('.js-accordion-title').hasClass('-open')) {
          isClosable = true;
        }

        if (isClosable && $group.data('opened')) {
          close($group);
        }

        else {
          open($group);
          closeOthers($group);
        }

      });

      $(document).ready(function() {
        // init
        $handles.each(function() {
          // Stop accordion with radio buttons to trigger twice
          $(this).children('.radio').children('input').on('click', function(e) {
            e.stopImmediatePropagation();
          });

          // Pre-set checked radio
          if ($(this).children('.radio').children('input').is(':checked')) {
            $(this).trigger('click');
          }

          if ($(this).attr('data-init-expand')) {
            $(this).trigger('click');
          }
        }); 
      });

    });
  };
}(jQuery));