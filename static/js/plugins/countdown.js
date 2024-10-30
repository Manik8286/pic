(function($) {

  $.fn.countdownText = function() {
    return this.each(function() {
      var $this = $(this);
      var until = $this.attr('data-until');
      until = (until == "midnight" || countdownExpired(until)) ? getMidnightCountDown() : until;

      $this.countdown(until, function(event) {
        $(this).html(event.strftime($this.attr('data-format')));
      });
    });
  }

  $.fn.countdownClock = function () {
      return this.each(function() {
        var $this = $(this);

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if ($this.attr('data-until') == "midnight") {
          until = yyyy+'/'+mm+'/'+dd+' 23:59:59'
        } else {
          until = $this.attr('data-until');
        }

        $this.countdown(until, function(event) {
          $(this).html(event.strftime($this.attr('data-format')));
        });
      });
    }

  $.fn.countdownText15 = function() {
    return this.each(function() {
      var $this = $(this);
      $this.countdown(new Date(new Date().getTime() + (15 * 60 * 1000)), function(event) {
        $(this).html(event.strftime($this.attr('data-format')));
      });
    });
  }

  $.fn.countdownTextValentines2018 = function() {
    return this.each(function() {
      var $this = $(this);
      var until = $this.attr('data-until');
      var untilNext = $this.attr('data-until-next');
      /* 5 secs */
      var negativeUntil = new Date().getTime() - 5000;
      /* If countdown is expired than jus set to current midnight */
      var nextCountdown = $this.hasClass('js-countdown-next') && !countdownExpired(untilNext) ? untilNext : getMidnightCountDown();
      /* If till current midnight, than use hours formatting */
      var format = countdownExpired(untilNext) && !!$this.attr('data-format-hours') ? $this.attr('data-format-hours') : $this.attr('data-format');

      $('.-countdownWithLink').css({'display': 'inline-block','padding-top': '7px'});

      console.log("Format: ", format);

      /* In case until time is already in the past. */
      if (countdownExpired(until)) {

        /* Hide link with delivery info */
        /* Remove link only if next countdown is not specified. */
        if (nextCountdown != untilNext) {
          // console.log("Hiding link from countdown element");
          $this.siblings('.shippingBannerLink').attr('style', 'display:none !important;');
          $this.removeClass('-countdownWithLink').css({
            'display': 'inline-block',
            'padding-top': '7px'
          });
        }

        // First remove last countdown correct HTML inside countdown.
        $this.countdown('remove').countdown(nextCountdown, function(event) {
          $this.html(event.strftime(format));
        });
        console.log("Countdown expired for: ", until, countdownExpired(until));
        console.log("Countdown expired for: ", untilNext, countdownExpired(untilNext));
      } else {
        // First remove last countdown correct HTML inside countdown.
        $this.countdown('remove').countdown(until, function(event) {
          $this.html(event.strftime(format));
        });
      }
    });
  }

  function countdownExpired(timestamp) {
    return new Date(timestamp).getTime() < new Date().getTime();
  }

  function getMidnightCountDown() {
    var today = new Date(),
      dd = today.getDate(),
      /* Jan = 0 */
      mm = today.getMonth() + 1,
      yyyy = today.getFullYear();

      // remove shipping guarantee link after countdown deadline
      $("." + $(".-stable").attr('datamsgelement')).hide();
      $(".-stable").css('margin-top', '0');

    return yyyy + '/' + mm + '/' + dd + ' 23:59:59';
  }

}(jQuery));
