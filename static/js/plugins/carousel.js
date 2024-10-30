(function ($) {
  $.fn.carousel = function () {
    var opts = {
      slideSelector: 'li',
      initializedClass: '-initialized',
      visibleClass: '-visible',
      visibleDuration: 2000
    };

    return this.each(function () {
      opts.visibleDuration =  $(this).attr('data-duration') || opts.visibleDuration;
      var $carousel = $(this);
      var carousel = new Carousel(opts, $carousel);
      carousel.initialize(function() {
        carousel.start();
      });

      // resize/orientationchange stop the carousel, initialize
      // it and continue the show to assure that the height is
      // properly set
      $(window).on('resize orientationchange', function() {
        carousel.stop();
        carousel.initialize(function() {
          carousel.scontinue();
        });
      });

      /* Stop the timer on hover

      $carousel.on('mouseover', function() {
        carousel.stop();
      });

      $carousel.on('mouseout', function() {
        carousel.continue();
      });

      */
    });
  };


  var Carousel = function (opts, $this) {
    this.opts = opts;
    this.$carousel = $this;
    this.$slides = $this.children(opts.slideSelector);
    this.slideCount = this.$slides.length;
    this.activeSlide = -1;
    this.timer;
  };

  Carousel.prototype.initialize = function(cb) {
    var $carousel = this.$carousel;
    var opts = this.opts;

    $carousel.removeClass(opts.initializedClass);
    var height = 0;

    // calculate height of carousel
    $carousel.children(opts.slideSelector).each(function() {
      var $t = $(this);
      $t.css('display', 'block');
      var h = $t.height();
      if (h > height) height = h;
      $t.css('display', '');
    });
    $carousel.height(height);

    $carousel.addClass('-initialized');
    cb();
  };

  Carousel.prototype.start = function() {
    this.showNext();
    this.scontinue();
  };

  // I named this scontinue for "special continue" because
  // in some browsers (i think just in IE) continue() is a
  // reserved word. Bummer.
  Carousel.prototype.scontinue = function() {
    var self = this;
    this.timer = window.setInterval(function() {
      self.showNext();
    }, this.opts.visibleDuration);
  };

  Carousel.prototype.showNext = function() {
    this.$slides.eq(this.activeSlide).removeClass(this.opts.visibleClass);
    this.incrementActiveSlideCount();
    this.$slides.eq(this.activeSlide).addClass(this.opts.visibleClass);
  };

  Carousel.prototype.stop = function() {
    clearInterval(this.timer);
  };

  Carousel.prototype.incrementActiveSlideCount = function() {
    if (this.activeSlide + 1 === this.slideCount) {
      this.activeSlide = 0;
    } else {
      this.activeSlide++;
    }
  };

}(jQuery));