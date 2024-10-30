//= include includes/md5.js
//= include includes/utf8_encode.js
//= include vendor/jquery.waterwheelCarousel.min.js
//= include includes/jquery.timer.js
//= include includes/countdown-ordersuccess.js
//= include orderaddresscheck.js

function getBase64Image(imgElem) {
  var canvas = document.createElement("canvas");
  canvas.width = imgElem.naturalWidth;
  canvas.height = imgElem.naturalHeight;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(imgElem, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function emailb(){

  var image = document.getElementById('img'),
      session = {
        'order' : document.getElementById('post').dataset.orderId,
        'shopid' : 12,
        'promotion' : true,
        'story' : document.getElementById('msg').value,
        'img' : getBase64Image(image),
        'imgid' : $('.side .active img').data('img-id').toString()
      };
  if (session.story) {
    doPost(JSON.stringify(session));
  } else {
    alert('Sorry, but we did not receive your message');
  }
}

function doPost(jsonstr){
  // on click create popup
  var newWindow = window.open('','facebook-share-dialog','width=626,height=436');
  var posting = $.post( "https://services.cdn-shop.com/service/UserStories", jsonstr, "json");
  posting.always(function(data) {
    if (data.fbpost) {
      // Populate popup with href
      newWindow.location = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.facebook.com%2Fmywallcom%2Fphotos%2Fp.'+data.fbpost+'%2F'+data.fbpost+'%2F%3Ftype%3D3&amp;display=popup&amp;ref=plugin&amp;src=post';
    } else {
      console.error("Parameters are wrong");
    }
  });
}

new Clipboard('.clip');

function showbubble() {
  $('.copy-bubble').slideDown()
  setTimeout("$('.copy-bubble').slideUp()", 3000);
}



$(document).ready(function () {

  window.fbAsyncInit = function () {
    FB.init({
      appId: '1038521746952157',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v3.2'
    });
  };

  // close fb popup window
  if (this.location.hash == "#_=_") {
    window.close();
  }

  $(".facebook-share").on('click', function () {

    FB.ui({
      method: 'share',
      href: 'https://www.bestcanvas.se/friend/?utm_source=facebook&utm_campaign=3fc&utm_medium=link'
    }, function (response) { });

  });

  // Carousel
  $("#waterwheel-carousel").waterwheelCarousel({
    horizon: 268,
    horizonOffset: 0,
    horizonOffsetMultiplier: 0.7,
    separation: 240,
    edgeFadeEnabled: true
  });

  // If slider img > 1 show sidebar
  if ($('.side ul li').size() > 1) {
    $('.side').show();
    $('.controls').show();
  }

  $('.post-img .prev').on('click', function(e){
    e.preventDefault();
    var $active = $('.side .active'),
        $slide = $(this);
    if ($('.side .active').prev().size()) {
      $active.removeClass('active');
      $active.prev().addClass('active');
      $('.post-img img').fadeOut('fast', function(){
        $(this).attr('src', $active.prev().find('img').attr('src'));
        $(this).fadeIn('fast');
      });
    }
  })

  $('.post-img .next').on('click', function(e){
    e.preventDefault();
    var $active = $('.side .active');
    if ($('.side .active').next().size()) {
      $active.removeClass('active');
      $active.next().addClass('active');
      $('.post-img img').fadeOut('fast', function(){
        $(this).attr('src', $active.next().find('img').attr('src'));
        $(this).fadeIn('fast');
      });
    }
  })

  $('#shareit').on('click', function(e){
    e.preventDefault();
    emailb();
  })

  // Set slider image active
  $('.side img').eq(0).parent().addClass('active');

  var imageInspector = function () {
    var element = document.getElementById("img"),
        imageType,
        width = element.naturalWidth,
        height = element.naturalHeight;

    if (width < height) {
      imageType = 'portrait';
    } else if (width == height) {
      imageType = 'square';
    } else {
      imageType = 'landscape';
    }
    return element.className = imageType;
  };

  $('.post-img img').on('load', function(){
    imageInspector();
  });

  $('.side li').on('click', function(){
    var $slide = $(this);
    if ($slide.attr('class') != 'active') {
      $('.side .active').removeClass('active');
      $(this).addClass('active');
      $('.post-img img').fadeOut('fast', function(){
        $(this).attr('src', $slide.find('img').attr('src'));
        $(this).fadeIn('fast');
      });
    }
  })

});

(function () {
  window.dataLayer = window.dataLayer || [];

  var fb_button = document.getElementById("fb-share");
  fb_button.addEventListener("click", function () {
    dataLayer.push({
      "event": "share",
      "elementClick": "facebook"
    });
  });

  var email_button = document.getElementById("email-share");
  email_button.addEventListener("click", function () {
    dataLayer.push({
      "event": "share",
      "elementClick": "email"
    });
  });

  var link_button = document.getElementById("link-share");
  link_button.addEventListener("click", function () {
    dataLayer.push({
      "event": "share",
      "elementClick": "link"
    });
  });

  var wa_button = document.getElementById("wa-share");
  wa_button.addEventListener("click", function () {
    dataLayer.push({
      "event": "share",
      "elementClick": "whatsapp"
    });
  });
})();
