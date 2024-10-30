(function($) {
  $.fn.imageSwitcher = function() {
    var opts = {
      buttonTargetAttr: 'data-target',
      imageNameAttr: 'data-image-name',
      otherSwitherId: 'data-target-id',
      visibleImageClass: '-visible',
      placeholderChar: '%'
    }

    return this.each(function() {
      var $this = $(this);

      // init calc height
      // async wait up loading
      function calcDimensions() {
        var maxHeight = 0;
        var number = $this.children('.images').find('img').length;
        var i = 0;
        $this.children('.images').find('img').each(function() {
          $(this).on("load", function (e) {
              $(this).parent().css('display', 'block');
              var height = $(this).outerHeight();
              $(this).parent().css('display', '');
              if (height > maxHeight) {
                maxHeight = height;
              }
              i++;
              if (i === number) {
                $this.children('.images').css('height', maxHeight + 'px');
                $this.addClass('-initialized');
              }
            })
            .on('error', function(){
              i++;
              if (i === number) {
                $this.children('.images').css('height', maxHeight + 'px');
                $this.addClass('-initialized');
              }
            })
        });
      }
      calcDimensions();

      $( window ).on( "orientationchange", function( event ) {
  calcDimensions();
});

      // Target switcher can be set as an other switcher
      var $target = $this;
      if ($this.attr(opts.otherSwitherId))
        $target = $('#' + $this.attr(opts.otherSwitherId));

      // Images in switcher
      var $images = $target.find('*[' + opts.imageNameAttr + ']');

      // Toggle Button functionality
      $this.toggleButtonList();

      // Toggle Buttons have predefined events which return the
      // pressed button, so we can check which image to show
      $this.on('togglebutton:click', function (e, $button) {

        var name = $button.attr(opts.buttonTargetAttr);

        // Check for placeholder (%) in name. This is needed for
        // two buttons which build up to one image reference.
        if (name.indexOf(opts.placeholderChar) > -1) {
          var current = $images.filter('.' + opts.visibleImageClass).attr(opts.imageNameAttr);
          var pos = getPlaceholderPos(name);
          var placeholderReplacement = getStringAtPosition(current, pos);
          name = replacePlaceholder(name, placeholderReplacement);
        }

        // That's the image we want to show
        var $image = $images.filter('*[' + opts.imageNameAttr + '="' + name + '"]');
        if ($image.length > 0) {
          $images.removeClass(opts.visibleImageClass);
          $image.addClass(opts.visibleImageClass);
        }
      });

    });

    function getPlaceholderPos(string) {
      var split = string.split(':');
      return $.inArray(opts.placeholderChar, split);
    }

    function getStringAtPosition(string, pos) {
      var split = string.split(':');
      return split[pos];
    }

    function replacePlaceholder(string, replace) {
      return string.replace(opts.placeholderChar, replace);
    }

  }
}(jQuery));
