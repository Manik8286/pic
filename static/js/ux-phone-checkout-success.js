(function($, window) {

  function findElementDeferred($el, method) {
    if ($el.find('a').length)
      method();
    else
      setTimeout(function() { findElementDeferred($el, method) }, 50);
  }

  // grab and insert link from sovendus
  findElementDeferred($('.js-gc-container'), function() {
    var gcLink = $('.js-gc-container').find('a').attr('href');
    $('.js-gc-insertlink').attr('href', gcLink);
  });
}(jQuery, window));