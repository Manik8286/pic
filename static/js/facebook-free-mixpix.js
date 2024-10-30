//= include vendor/clipboard.js

  $( document ).ready(function() {

  var clipboard = new Clipboard('.clip');

  window.fbAsyncInit = function() {
    FB.init({
      appId            : '151233131553992',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v3.2'
    });
  };

  // close fb popup window
  if (this.location.hash == "#_=_"){
    window.close();
  }

  var url_string = window.location.href
  var url = new URL(url_string);
  
  $(".fb-share").on('click', function(){
    FB.ui({
      method: 'share',
      href: 'https://www.bestcanvas.se/friend?utm_source=facebook&amp;utm_campaign=3fc&amp;utm_medium=link'
    }, function(response){});
  });

});

function showbubble() {
  $('.copy-bubble').slideDown()
  setTimeout("$('.copy-bubble').slideUp()", 3000);
}