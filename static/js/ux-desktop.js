//= include vendor/modernizr.min.js
//= include vendor/jquery.matchHeight.js
//= include ../../node_modules/jquery-validation/dist/jquery.validate.js
//= include vendor/jquery.ui.widget.js
//= include vendor/jquery.iframe-transport.js
//= include vendor/jquery.fileupload.js
//= include vendor/jquery.countdown.min.js
//= include vendor/jquery.showtime.js
//= include vendor/fabric.js
//= include vendor/fakeUpload.js
//= include vendor/clipboard.js
//
//= include plugins/toggle-button-list.js
//= include plugins/image-switcher.js
//= include plugins/accordion.js
//= include plugins/carousel.js
//= include plugins/dropdown.js
//= include plugins/formclick-container.js
//= include plugins/active-target.js
//= include plugins/validation-usability.js
//= include plugins/primefaces-helper.js
//= include plugins/toast.js
//= include plugins/smooth-scroll-to.js
//= include plugins/modal.js
//= include plugins/countdown.js
//= include plugins/countdownfrom.js
//= include plugins/easyPaginate.js
//= include plugins/sliderPro.js
//
//= include plugins/desktop-nav.js
//
//= include includes/tvspotloader.js
//= include includes/newsletter.js
//= include includes/sea-check-date.js


jQuery(function($, window) {

  $.primefacesHelper();
  $.validationUsability();
  $.formclickContainer();
  $.activeTarget();
  $.toast(window);
  $.scrollTo();
  $.modal();
  $('.js-expandable-nav').desktopNav();

  $('.js-accordion').accordion();
  $('.js-carousel').carousel();
  $('.js-image-switcher').imageSwitcher();
  $('.js-punctual').showNotificationFrom();

  $('*[data-dropdown], .js-dropdown').dropdown();
  $('*[data-form-validate], .js-form-validate').validate({
    onfocusout: function(element, event) {
      $(element).valid();
    },
    errorPlacement: function(error, element) {
      var position = $(element).attr('data-validate-pos');
      error.addClass('-'+position).appendTo(element.parent());
    },
    highlight: function(element, errorClass) {
      $(element).addClass('-invalid');
    },
    success: function(label, element) {
      label.remove();
      $(element).removeClass('-invalid');
    },
    focusCleanup: true,
    errorElement: 'div',
    errorClass: 'validation -error'
  });

  window.updater = [window.pfhelper.updateDom, window.dropdown.updateDom];
  window.updateDom = function() {
    $.each(window.updater, function(key, fn) {
      fn();
    });
  };

  $(window).on('load', function() {
    $('.js-countdown').countdownText();
  });

}(jQuery, window));


$(window).on("load", function (e) {
    $('[id^="ia-bnc"] , [id^="google-hm"]').each(function(){
      $(this).css("display", "none");
    });

    var vidDefer = document.getElementsByTagName('iframe');
for (var i=0; i<vidDefer.length; i++) {
if(vidDefer[i].getAttribute('data-src')) {
vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
} }

});

// check if browser IE use different svg icon for instagram in footer
function isIE() {
  ua = navigator.userAgent;
  var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1 || ("ActiveXObject" in window);
  return is_ie; 
}

if (isIE()){
  $('.-browserAll').addClass('dNone');
  $('.-browserIE').removeClass('dNone');
}

function scrolltoPrices() {
    $('html, body').animate({
        scrollTop: $("#prices").offset().top
    }, 1000);
}