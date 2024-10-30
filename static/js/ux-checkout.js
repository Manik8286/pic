//= include plugins/equalheight.js
//= include vendor/jquery.matchHeight.js
//= include plugins/number-spinner.js
//= include plugins/bootstrap_modal.js
//= include includes/uploadAnotherBasket.js

(function($, window) {
  $.numberSpinner();

  window.updater = window.updater || [];
  window.updater.push(window.numberspinner.updateDom);
  window.updater.push(window.Modal.updateDom);

  window.block = function($el) {
    var i = 0;
    window.blockIntervals = [];
    $el.each(function() {
      var $this = $(this);
      var $blocker = $('<div class="blocker"></div>');
      var top = $this.position().top;
      var left = $this.position().left;
      var height = $this.outerHeight();
      var width = $this.outerWidth();
      $blocker
        .css('left', left + 'px')
        .css('top', top + 'px')
        .css('height', height + 'px')
        .css('width', width + 'px');
      $this.before($blocker);
      window.blockIntervals[i] = setInterval(function() {
        height = $this.outerHeight();
        width = $this.outerWidth();
        $blocker
          .css('height', height + 'px')
          .css('width', width + 'px');
      }, 16);

      i++;
    });

  };

  window.unblock = function($el) {
    window.blockIntervals = window.blockIntervals || [];
    $.each(window.blockIntervals, function(key) {
      clearInterval(window.blockIntervals[key]);
    });
    window.blockIntervals = [];
    $el.each(function() {
      var $this = $(this);
      $this.prev('.blocker').remove();
    });
  };
}(jQuery, window));