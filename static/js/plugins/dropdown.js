(function($) {
  var Dropdown = function($el) {
    this.$dropdown = $el;
    this.$label = $el.children('.label');
    this.$labelInner = $el.children('.label').find('span');
    this.$choices = $el.find('.choices > li');
    this.$value = $el.children('.js-field');
    this.name = $el.attr('data-dropdown');
    this.value = '';
    this.index = -1;
    this.isPreselected = false;
    this.calcWidth = $el.attr('data-calc-width') === "false" ? false : true;
    this.init();
    this.initEvents();
  };

  Dropdown.prototype = {
    init: function() {
      // resize to max value width
      var obj = this;
      var width = 0;
      var spacing = 2 + parseInt(obj.$label.css('padding-left'), 10) + parseInt(obj.$label.css('padding-right'), 10);
                 // 2 for border width. I don't think the border will every be larger than 1px

      this.preselect();

      if(this.calcWidth) {
        obj.$choices.each(function() {
          $(this).css('display', 'table');
          $(this).css('width', 'auto');
          var ewidth = $(this).innerWidth();
          $(this).css('width', '');
          $(this).css('display', '');
          width = ewidth > width ? ewidth : width;
        });

        // If dropdown is not preselected and a "choose type" text
        // is shown, include this in the calculation of the width
        if (!this.isPreselected) {
          this.$labelInner.css('display', 'block');
          var ewidth = this.$labelInner.width();
          this.$labelInner.css('display', '');
          width = ewidth > width ? ewidth : width;
        }

        obj.$dropdown.width(width + spacing);
      }
    },

    initEvents: function() {
      var obj = this;

      obj.$dropdown.on('click', function(e) {
        $(this).toggleClass('-active');
        return false;
      });

      obj.$choices.on('click', function(e) {
        var opt = $(this);
        obj.setOption(opt.index(), true);

        // URL redirect
        var url = $(obj.$choices[opt.index()]).attr('data-url');
        if (url)
          window.location.href = url;
      });

      $('body').on('click', function(e) {
        obj.$dropdown.removeClass('-active');
      });

      $('*[data-dropdown]').on('click', function(e) {
        if ($(this)[0] != obj.$dropdown[0]) {
          obj.$dropdown.removeClass('-active');
        }
      })
    },

    preselect: function() {
      var obj = this;
      var pre = obj.$value.val();
      if (pre) {
        this.isPreselected = true;
        var i = obj.$choices.filter('[data-value="' + pre + '"]').index();
        obj.setOption(i, false);
      }
    },

    setOption: function(index, trigger) {
      var opt = this.$choices.eq(index);
      this.name = opt.text();
      this.index = index;
      this.value = opt.attr('data-value');
      this.$label.text(this.name);
      this.$value.attr('value', this.value);
      if (trigger) this.$value.change();
    },

    getValue: function() {
      return this.value;
    },

    getName: function() {
      return this.name;
    },

    getIndex: function() {
      return this.index;
    }
  };

  window.dropdown = {};
  window.dropdown.updateDom = function() {
    $('*[data-dropdown], .js-dropdown').dropdown();
  };

  $.fn.dropdown = function() {
    return this.each(function() {
      if (!$.data( this, 'plugin_dropdown')) {
        $.data( this, 'plugin_dropdown', new Dropdown( $(this) ) );
      }
    });
  };
}(jQuery));