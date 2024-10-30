(function ($) {
  $.fn.showNotificationFrom = function () {
    return this.each(function() {
      var $this = $(this), until;

      var today = new Date();
      var dd = today.getDate()+1;
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      $this.closest('.header-bar').addClass('hidden');

      $this.showtime($this.attr('data-from'), function(event) {
        $this.html(event.strftime($this.attr('data-format')));
      })

      if ($this.attr('data-up-to') == "midnight") {
        until = yyyy+'/'+mm+'/'+dd+' 23:59:59'
      } else {
        until = $this.attr('data-up-to');
      }

      $this.countdown(until, function(event) {
        $this.html(event.strftime($this.attr('data-format')));
      }).on('finish.countdown', function(){
        $this.closest('.header-bar').hide();
      });
    });
  }
}(jQuery));