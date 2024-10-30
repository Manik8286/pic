(function($, window) {
  var videoembed = '<ifr' +
    'ame width="560" height="315" style="max-width: 100%" src="' +
    'https://www.youtube.com/embed/cSowBM_8rYw?rel=0&amp;showinfo=0&amp;enablejsapi=1' +
    '" frameborder="0" allowfullscreen></ifr' +
    'ame>';

  window.loadTVSpotPlayer = function() {
    if (!$('.js-tv-spot-insert').has('iframe').length) {
      $('.js-tv-spot-insert').html(videoembed);
      Modal.recalc('#tvSpot');
    }

    $('#tvSpot').on('modal:close', function() {
      var player = $('.js-tv-spot-insert iframe')[0].contentWindow;
      player.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    });
  }
}(jQuery, window));