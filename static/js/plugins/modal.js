(function($, window) {

  function Modal(modal) {
    this.modal = modal;
    this.$modal = $(modal);
    this.$wrap = null;
    this.$head = null;
    this.$body = null;
    this.$close = $('<span class="close"></span>');
    this.$scroll = $('<div class="scroll"></div>');
    this.closeClass = '-close';
    this.closedClass = '-closed';
    this.openClass = '-open';
    this.openedClass = '-opened';
    this.spacing = 20;
    this.visibilityDuration = 200;

    this._init();
    this._initListeners();
  }

  Modal.prototype = {
    _init: function() {
      if (!this.$modal.has('.head').length) {
        $('<div class="head -nothing"></div>').prependTo(this.$modal);
      }
      if (!this.$modal.has('.body').length) {
        $('<div class="body -nothing"></div>').appendTo(this.$modal);
      }
      if (!this.$modal.has('.foot').length) {
        $('<div class="foot -nothing"></div>').appendTo(this.$modal);
      }

      this.$modal.wrap('<div class="modal-wrap"></div>');
      this.$head = this.$modal.children('.head');
      this.$body = this.$modal.children('.body');
      this.$foot = this.$modal.children('.foot');

      $('<div class="scroll"></div>').insertAfter(this.$head);
      this.$scroll = this.$modal.children('.scroll');
      this.$wrap = this.$modal.parent();

      this.$body.detach().appendTo(this.$scroll);
      this.$foot.detach().appendTo(this.$scroll);
      this.$close.appendTo(this.$head);

      this.$wrap.detach().appendTo('body');
      this.$modal.addClass('modal-window');

      this._calcDimensions();

      this.$modal.addClass('-initialized');
    },

    _calcDimensions: function() {
      var windowHeight = $(window).innerHeight();
      var windowWidth = $(window).innerWidth();
      this.$wrap.css('display', 'block');
      this.$modal.css('display', 'table');
      var modalWidth = this.$modal.outerWidth();
      var bodyWidth = this.$body.innerWidth();
      if (modalWidth > windowWidth - this.spacing*2) {
        modalWidth = windowWidth - this.spacing*2;
        bodyWidth = modalWidth;
        this.$modal.css('width', modalWidth + 'px');
      }
      var modalHeight = this.$modal.outerHeight();
      var headHeight = this.$head.outerHeight();
      this.$wrap.css('display', '');
      this.$modal.css('display', '');

      this.$modal.css('margin-left', -modalWidth/2 + 'px');

      if (windowHeight - this.spacing*2 < modalHeight) {
        this.$modal.css('display', 'block');
        this.$modal.css('width', modalWidth);
        this.$modal.css('height', windowHeight - this.spacing*2 + 'px');
        this.$modal.css('top', this.spacing + 'px');
        this.$scroll.css('top', headHeight + 'px');
        this.$scroll.css('position', 'absolute');
        this.$scroll.css('width', bodyWidth + 'px');
        this.$body.css('width', bodyWidth + 'px');
      } else {
        this.$modal.css('margin-top', -modalHeight/2 + 'px');
      }

      this.$modal.css('display', 'block');
    },

    _initListeners: function() {
      this.$close.on('click', function() {
        this.close();
      }.bind(this));

      this.$wrap.on('click', function(e) {
        var modalL = this.$modal.offset().left;
        var modalR = modalL + this.$modal.outerWidth();
        var modalT = this.$modal.offset().top;
        var modalB = modalT + this.$modal.outerHeight();
        if ((e.pageX >= modalL && e.pageX <= modalR) &&
            (e.pageY >= modalT && e.pageY <= modalB)) {
          return
        }
        this.close();
      }.bind(this));
    },

    close: function() {
      this.$modal.trigger('modal:close');
      $('body').css('overflow', '');
      // Stop yotubue video from playing on modal close
      $('.youtube-video').each(function(){
        this.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*')
      });
      var self = this;
      this.$wrap
        .addClass(this.closeClass)
        .delay(this.visibilityDuration)
        .queue(function() {
          self.$wrap.removeClass(self.openedClass);
          self.$wrap.removeClass(self.closeClass);
          self.$wrap.addClass(self.closedClass);
          $(this).dequeue();
        });
    },

    open: function() {
      $('body').css('overflow', 'hidden');
      // Start yotubue video on modal open
      $('.youtube-video').each(function(){
        this.src += "&autoplay=1";
      });
      var self = this;
      this.$wrap
        .removeClass(this.closedClass)
        .addClass(this.openClass)
        .delay(1)
        .queue(function() {
          self.$wrap.addClass(self.openedClass);
          self.$wrap.removeClass(self.openClass);
          self.$modal.trigger('modal:open');
          $(this).dequeue();
        });
    }
  };

  $.modal = function() {
    function init() {
      $('.js-modal').each(function() {
        if ($(this).data('plugin_modal') == undefined) {
          var plugin = new Modal(this);
          $(this).data('plugin_modal', plugin);
        }
      });
    }

    init();

    window.Modal = {
      open: function(selector) {
        $(selector).data('plugin_modal').open();
      },
      close: function(selector) {
        $(selector).data('plugin_modal').close();
      },
      recalc: function(selector) {
        $(selector).data('plugin_modal')._calcDimensions();
      },
      updateDom: init
    };
  };




}(jQuery, window));