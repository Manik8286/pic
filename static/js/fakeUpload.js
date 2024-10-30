var Localfade = 1;

function showUploaderFake() {
  //console.log("Loading Fake Cover...");
  var $button = $('.js-du-button'), $cover = $('.js-up'), $percentage = $('.js-up-percentage'), $ongoing = $('.js-up-ongoing'), $close = $('.js-up-abort');
  $close.hide();
  $percentage.hide();
  $ongoing.html('Ge oss en sekund <br/> Vi förbereder allt...');
  $button.prop('disabled', true);
  $cover.detach().appendTo('body');
  $cover.addClass('-visible').delay(1).queue(function() {
    $(this).addClass('-fade-in');
    $(this).dequeue();
    Pulse(Localfade);
  });
}

function Pulse(fade) {
  $icon = $(".icon");
  Localfade = (fade == 1 ? 0.2 : 1);
  $icon.fadeTo(1500, fade, function() {
    Pulse(Localfade);
  });
}

function hideUploaderFake() {
  //console.log("Hidding Fake Cover...");
  var $cover = $('.js-up');
  $cover.removeClass('-visible');
}

if (document.getElementById("uploadClose") != null) {
  document.getElementById("uploadClose").onclick = function () {
	  location.reload();
  }
};
