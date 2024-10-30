(function($) {
  $.activeTarget = function() {

    // Listens on change of a radio (or checkbox) and
    // when change fires, adds the class '-visible' to
    // a given target.
    // Interface:
    // - associated radios need class js-dat-group_NAMEOFYOURINPUTGROUP
    // - specify target class with class js-dat-target_class-of-your-target
    //
    // Simplet Interface
    // - Attribute "data-active-target-group='groupname'" for the associated radios
    // - Attribute "data-active-target='.target-element-selector'" for the target
    //
    // This weird class-name-syntax is for JSF-Elements, where we can't set
    // any "normal" HTML attributes. I'm looking at you, Primefaces (╯°□°）╯︵ ┻━┻

    // We listen on change of the group.
    // Why? We can't listen on change if something is unchecked.
    // Listening only works on checking.
    // As a workaround we listen on changes of the group to emulate
    // the unchecking-event.
    $('body').on('change', '*[data-active-target-group], *[class*="js-dat-group"]', function() {
      var $this = $(this);

      // We parse the correct group string.
      var groupFromClass;
      $.each($(this).attr('class').split(' '), function(key, value) {
        if (value.substring(0, 12) === 'js-dat-group') {
          groupFromClass = value.split('_')[1];
        }
      });

      var group = $(this).attr('data-active-target-group') || groupFromClass;

      // We loop through each item in the group...
      $('.js-dat-group_' + group).each(function() {
        if ($(this)[0] !== $this[0]) {
          // ... and, if the item is the correct item,
          // we call the function we call in the other
          // on('change').
          thisShouldHappenOnChangeOfItem($(this));
        }
      });

      // We loop through each item in the group...
      $('*[data-active-target-group="' + group + '"]').each(function() {
        if ($(this)[0] !== $this[0]) {
          // ... and, if the item is the correct item,
          // we call the function we call in the other
          // on('change').
          thisShouldHappenOnChangeOfItem($(this));
        }
      });
    });

    // We listen on change of a item
    $('body').on('change', '*[data-active-target], *[class*="js-dat-target"]', function() {
      thisShouldHappenOnChangeOfItem($(this));
    });

    $('*[data-active-target], *[class*="js-dat-target"]').each(function() {
      thisShouldHappenOnChangeOfItem($(this));
    });

    function thisShouldHappenOnChangeOfItem($this) {
      // We parse the target class
      var targetFromClass;
      $.each($this.attr('class').split(' '), function(key, value) {
        if (value.substring(0, 13) === 'js-dat-target') {
          targetFromClass = '.' + value.split('_')[1];
        }
      });

      // and toogle the target's visibility, depending on if it's changed or not.
      var target = $this.attr('data-active-target') || targetFromClass;
      var $target = $(target);
      $target.dequeue();
      if($this.is(':checked')) {
        $target.addClass('-visible').delay(1).queue(function() {
          $target.addClass('-active');
          $(this).dequeue();
        });
      } else {
        $target.removeClass('-active').removeClass('-visible');
      }
    }
  };
}(jQuery));