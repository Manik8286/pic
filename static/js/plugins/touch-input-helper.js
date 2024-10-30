(function($) {
  $.touchInputHelper = function() {
    $('body').on('change', 'input[type="radio"]', function() {
      var $this = $(this);
      var $pseudo = $this.parent();
      var group = $this.attr('name');

      $('input[type="radio"][name="' + group + '"]').each(function() {
        if ($(this)[0] !== $this[0]) {
          var $otherpseudo = $(this).parent();
          $otherpseudo.removeClass('-active');
        }
      });

      if($this.is(':checked')) {
        $pseudo.addClass('-active');
      } else {
        $pseudo.removeClass('-active');
      }
    });

    function init() {
      $('input[type="radio"]').each(function() {
        var $this = $(this);
        var $pseudo = $this.parent();
        if ($this.is(':checked')) {
          $pseudo.addClass('-active');
        }
      });
    }

    init();

    window.tihelper = {};
    window.tihelper.updateDom = init;
  };
}(jQuery));