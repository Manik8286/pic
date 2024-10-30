(function($) {

  var pluginName = 'numberspinner';

  function NumberSpinner(el, opts) {
    this.opts = opts || { min: 1, max: 99 };
    this.spinner = el;
    this.$spinner = $(el);
    this.$less = $(el).find('.js-less');
    this.$more = $(el).find('.js-more');
    this.$field = $(el).find('.js-field');
    this.value = parseInt(this.$field.val(), 10);

    this.init();
  }

  NumberSpinner.prototype = {
    init: function() {
      this.checkSpinnerVisibility();
      this.initListeners();
    },

    initListeners: function() {
      this.$more.on('click', function() {
        this.addOne();
        this.$field.trigger('blur');
      }.bind(this));

      this.$less.on('click', function() {
        this.subOne();
        this.$field.trigger('blur');
      }.bind(this));
    },

    checkSpinnerVisibility: function() {
      if (this.value <= this.opts.min) {
        this.$less.css('visibility', 'hidden');
      } else {
        this.$less.css('visibility', 'visible');
      }

      if (this.value >= this.opts.max) {
        this.$more.css('visibility', 'hidden');
      } else {
        this.$more.css('visibility', 'visible');
      }
    },

    addOne: function() {
      if (this.value >= this.opts.max) {
        return;
      }
      this.setValue(this.value +1);
    },

    subOne: function() {
      if (this.value <= this.opts.min) {
        return;
      }
      this.setValue(this.value -1);
    },

    setValue: function(number) {
      this.value = number;
      this.refresh();
    },

    refresh: function() {
      // Recover from mistakes
      if (this.value < this.opts.min) {
        this.value = this.opts.min;
      }
      if (this.value > this.opts.max) {
        this.value = this.opts.max;
      }

      this.$field.handleValidationMessage();
      this.$field.val(this.value);
      this.$field.change();
      this.checkSpinnerVisibility();
    }
  };

  $.numberSpinner = function(opts) {
    function init() {
      $('.js-number-spinner').each(function() {
        if (!$.data( this, 'plugin_' + pluginName ) ) {
          $.data( this, 'plugin_' + pluginName, new NumberSpinner( this, opts ) );
        }
      });
    }

    init();

    window.numberspinner = {};
    window.numberspinner.updateDom = init;

  };
}(jQuery, window));