//= include vendor/primefaces-fileupload.js
//= include vendor/fakeUpload.js

var cropCompleted = false;
var lockScreen = false;

function proceedToCart() {
  if (!cropCompleted) {
    previewConfig.cropPreviewBeforeCheckout();
    cropCompleted = true;
    return false;
  }
  return true;
}

function uploadMsg() {
  $('.multiimage .ui-fileupload-buttonbar>.ui-button').after('<p class="">Ett ögonblick tack, uppladdning pågår...</p>');
}

var multiimage = true;
var bilderBox = 1317;
var bilderBoxRetro = 1334;
function previewDefault() {
  var item = $("#imagePrev");
  if (typeof item.data('image') === 'undefined') {
    return;
  }
  previewConfig.buildPreview();
}


var BlockerLocal = function() {
}
BlockerLocal.prototype.block = function() {
  block($('body'));
}
BlockerLocal.prototype.unblock = function() {
  unblock($('body'));
}
var blocker = new BlockerLocal();