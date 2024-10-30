(function($) {

  //
  // This is a helper for server-rendered validation messages on inputs
  // (not rendered via JS and jquery.validation)
  // It will check if an input is followed by a validation element and if
  // this validation element is server-rendered (has no ID). Then it will
  // listen on a change of the input and remove the validation message
  // once the input has changed. Also it will remove the invalid state
  // of the input.
  //

  $.validationUsability = function() {
    $('body').on('keydown change', 'input', function(e) {
      var $this = $(this);
      if ($this.css('display') !== 'none') {
        var $validation = $this.next('.validation');
      } else {
        var $validation = $this.parent().next('.validation');
      }

      if ($validation.length > 0 && $validation.attr('id') === undefined) {
        $validation.remove();
        $this.removeClass('-invalid');
      }
    });
  };

  $.fn.handleValidationMessage = function() {
    var $this = $(this);
    if ($this.css('display') !== 'none') {
      var $validation = $this.next('.validation');
    } else {
      var $validation = $this.parent().next('.validation');
    }
    if ($validation.length > 0 && $validation.attr('id') === undefined) {
      $validation.remove();
      $this.removeClass('-invalid');
    }
  };

}(jQuery));