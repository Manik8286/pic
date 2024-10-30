(function($, window) {
  $.toast = function(window) {
    var Toast = function() {
      this.$toast = $('<div class="toast-message -opening"></div>');
    };

    Toast.prototype.hide = function(delay) {
      var $toast = this.$toast;

      $toast.delay(delay).queue(function() {
        $toast.addClass('-closing').delay(500).queue(function() {
          $toast.addClass('-opening').remove();
          isShown = false;
          $(this).dequeue();
        });
        $(this).dequeue();
      });
    };

    Toast.prototype.show = function(message) {
      var $toast = this.$toast;

      $toast.text(message);
      $toast.appendTo($('.toast-holder'));
      isShown = true;
      $toast.removeClass('-closing').delay(0).queue(function() {
        $toast.removeClass('-opening');
        $(this).dequeue();
      });
    };

    $('body').append('<div class="toast-holder"></div>');

    window.showToast = function(message) {
      try {
        window.toast = new Toast();
        window.toast.show(message);
      } catch(err) {
        // intentionally left blank
      }
    };

    window.hideToast = function(delay) {
      try {
        window.toast.hide(delay);
      } catch(err) {
        // intentionally left blank
      }
    };
  };
}(jQuery, window));