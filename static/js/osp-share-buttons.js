//<![CDATA[
$( document ).ready(function() {
  var clipboard = new Clipboard('.clip');

  window.fbAsyncInit = function() {
    window.FB.init({
      appId            : '1038521746952157',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v3.2'
    });
  };

  // close fb popup window
  if (this.location.hash == "#_=_"){
    window.close();
  }

  $(".facebook-share").on('click', function(){
    window.FB.ui({
      method: 'share',
      href: 'https://www.bestcanvas.se/friend-osp/?utm_source=facebook&utm_campaign=friend-OSP&utm_medium=link'
    }, function(response){});
  });
});

function showbubble() {
  $('.copy-bubble').slideDown()
  setTimeout("$('.copy-bubble').slideUp()", 3000);
}
//]]>