;(function ( $, window, undefined ) {

  var pluginName = 'progressbar',
  document = window.document;

  function Progressbar(el) {
    this.el = el;
    this.$el = $(el);
    this.$bar = $(el).find('.js-bar');
    this.$value = $(el).find('.js-percentage');
    this.progress = 0;
    this._name = pluginName;
  }

  Progressbar.prototype = {
    setProgress: function(value) {
      this.progess = value;
      this.$bar.css('width', value + '%');
      this.$value.text(Math.floor(value));
    }

  };

  $.fn[pluginName] = function () {
    return this.each(function () {
      if (!$.data( this, 'plugin_' + pluginName ) ) {
        $.data( this, 'plugin_' + pluginName, new Progressbar( this ) );
      }
    });
  };

  // Usage:
  // $('.progress-bar').data('plugin_progressbar').setProgress(47.1);

}(jQuery, window));