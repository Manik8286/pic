//= include plugins/equalheight.js
//= include vendor/jquery.countdown.min.js
//= include plugins/number-spinner.js
//= include vendor/jquery.ui.widget.js
//= include vendor/jquery.iframe-transport.js
//= include vendor/jquery.fileupload.js
//= include plugins/dropdown.js
//= include plugins/formclick-container.js
//= include plugins/active-target.js
//= include plugins/primefaces-helper.js
//= include plugins/toast.js
//= include plugins/smooth-scroll-to.js
//= include plugins/modal.js
//= include plugins/bootstrap_modal.js
//= include plugins/countdown.js

(function($, window) {
  $.numberSpinner();
  $.primefacesHelper();
  $.formclickContainer();
  $.activeTarget();
  $.toast(window);
  $.scrollTo();
  $.modal();

  $("*[data-dropdown], .js-dropdown").dropdown();

  $(".js-countdown").countdownText();


  window.updater = [window.pfhelper.updateDom, window.dropdown.updateDom];
  window.updateDom = function() {
    $.each(window.updater, function(key, fn) {
      fn();
    });
  };

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
        .css("left", left + "px")
        .css("top", top + "px")
        .css("height", height + "px")
        .css("width", width + "px");
      $this.before($blocker);
      window.blockIntervals[i] = setInterval(function() {
        height = $this.outerHeight();
        width = $this.outerWidth();
        $blocker.css("height", height + "px").css("width", width + "px");
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
      $this.prev(".blocker").remove();
    });
  };
})(jQuery, window);
