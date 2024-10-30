(function($) {
  $.fn.toggleButtonList = function() {
    var opts = {
      buttonSelector: 'button',
      activeButtonClass: '-highlight'
    }

    return this.each(function() {
      var $list = $(this);
      var $buttons = $list.find(opts.buttonSelector);

      $buttons.on('click', function() {
        var $button = $(this);
        $buttons.removeClass(opts.activeButtonClass);
        $button.addClass(opts.activeButtonClass);
        $list.trigger('togglebutton:click', [ $button ]);
      });

    });

  }
}(jQuery));
