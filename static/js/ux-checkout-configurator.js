var CurrentZoom = null;
var CurrentLeft = null;
var CurrentWidth = null;
var CurrentHeight = null;
var CurrentscaleY = null;
var CurrentTop = null;
var canvasId = 505;
var blanketId = 1611;
var blanketPremId = 2000;
var magicMugId = 1617;

var CanvasOriginalWidth = 0;
var CanvasOriginalHeight = 0;

function viewFunc() {
  var productId = $('#imageData').data('productid')
  mugSummary(productId);
  formatSummary(productId);
  selectBorder();
  SumTotalPrice();
  selectedFrame();
  grabText();
  updateBoxesLoop();
  aluPrintPreview();
  fadedPreview();
}


function updateBoxesLoop(time) {

  var timeLocal = time || 0;

  equalheight('.mountings .selectable');
  equalheight('.backMaterials .selectable');
  equalheight('.mountingBox .selectable');
  equalheight('.borderEffects .selectable');
  equalheight('.frames .selectable');
  equalheight('.colorFinishings .selectable');
  equalheight('.imageEffects .selectable');

  timeLocal++;

  if (timeLocal < 5) {
    setTimeout(function() {
      updateBoxesLoop(timeLocal);
    }, (timeLocal < 3 ? 50 : 1000));
  }
}

// Alternative format label
function formatSummary(productId) {
  var $label;
  var $target = $('#formatLabel');

  $label = $('.format-table input:checked').closest('tr').find('.format-label')
    .eq(0).text();

  if (productId === blanketId || productId === blanketPremId) {
    $target.text($label.replace('Photo Blanket ', ''));
  } else {
    $target.text($label.replace('Case', ''));
  }

  if (productId === canvasId) {
    $(".canvas-container").addClass("canvas_shadow");
  } else {
    $(".canvas-container").removeClass("canvas_shadow");
  }

}

function grabText() {
  if ($(".AddBasketButton").length) {
    $("a[id*='UploadFileDesktop']").prepend($(".AddBasketButton").text());
  }
}

// Innenfarbe wählen
function mugSummary(productId) {
  if (productId === magicMugId) {
    $('#mugColorLabel').text($('.colorFinishings input:checked').parent().next(
      '.details').text().trim());
  }
}

function selectBorder() {
  $('.options input:checked').closest('.selectable').addClass('active');
  $('.options .selectable').on('click', function() {
    var $target = $(this);
    $target.parent().find('.active').removeClass('active');
    $target.addClass('active');
  })
}

// Total Price show item times quantity + fix price format
function SumTotalPrice() {

  var price, qnty, total, totalPrice;
  // gets item value (e.g 123,45 kr , 1,234,56 kr) and set new valueonly with number symbols (e.g 12345, 123456)
  price = $('#itemConfiguratorForm\\:price_left').eq(0).text().replace("kr", "")
    .replace(" ", "").replace(".", "").replace(",", "");
  // gets defined quantity
  qnty = $('#itemConfiguratorForm\\:quantity').val();
  // multiply
  total = (price * qnty / 100);
  // set back to correct price format (e.g 123,45 kr , 1,234,56 kr) with fixed last 2 digits
  totalPrice = total.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ' kr'
  ;

  $('#total_right').text(totalPrice);
  $('#total_left').text(totalPrice);
}

function aluPrintPreview() {
  var item = $("#imageData");
  var material = item.data('material');
  // Alu Glossy Material
  if (material == 72) {
    $(".canvas-container").append('<div class="reflection"></div>');
    $(".lower-canvas").addClass("glossy");
    // Alu Matte Material
  } else if (material == 73) {
    $(".lower-canvas").addClass("matte");
  }
}

function fadedPreview() {
  var item = $("#imageData");
  var material = item.data('material');
  if (material == 78) {
    $(".upper-canvas").addClass("faded");    
  } else if (material == 69) {    
    
    var pixelWidth =  $(".upper-canvas").width();
    var formatWidth = item.data('format').split(':')[0];
    formatWidth = parseFloat(formatWidth) / 10; // size in centimeter
    if (isNaN(formatWidth) || isNaN(pixelWidth)) {
      return;
    }
    

    var oneCmInPixels = pixelWidth / formatWidth;
    var styleString =  "0 0 13px " + oneCmInPixels + "px #fff inset";
    console.log('format: ', pixelWidth, formatWidth, styleString);
    $(".upper-canvas").css('box-shadow', styleString);

  } else {
    $(".upper-canvas").removeClass("faded");
  }
}

function processDefault() {
  if (!showPreview) {
    buildPreview();
  }
}

function FakePreview() {

  var LoadWidth = $("#thepreviewBox").width();
  var LoadHeight = $("#thepreviewBox").height();

  $('.imgLoading').width(LoadWidth).height(LoadHeight);
  $('.imgLoading').show();
}

function HideFakePreview() {
  $('.imgLoading').hide(100);
}

$.fn.followTo = function(elem) {

  var $this = this,
    $window = $(windw),
    $bumper = $(elem),
    bumperPos = $bumper.offset().top,
    thisHeight = $this.outerHeight(),
    notificationHeight = 10,
    navbarHeight = 0,
    $shift = 0;

/*  if ($('.header-bar').length) {
    notificationHeight = $('.header-bar').outerHeight();
  }

  if ($('.page-head').length) {
    navbarHeight = $('.page-head').outerHeight();
  }
*/
  //for mobile configurator ITPT-791
  if (navbarHeight == null) {
    navbarHeight = $('.top-header-bar').outerHeight();
  }

  var startingPos = $('.options').offset().top - $shift - notificationHeight;

  setPosition = function(offset) {
    if ($window.scrollTop() > (bumperPos - thisHeight - $shift -
        notificationHeight)) {
      $this.removeClass('fixed');
      $this.addClass('absolute');
      $this.css({
        top: (bumperPos - thisHeight - startingPos - $shift -
          notificationHeight)
      });
    } else {
      $this.removeClass('absolute');
      // start from formats position
      if ($window.scrollTop() > startingPos) {
        $this.addClass('fixed');
        $this.css({
          top: 0 + notificationHeight + navbarHeight + 'px'
        });
      } else {
        $this.removeClass('fixed');
        $this.removeAttr('style');
      }
    }
  };

  $window.resize(function() {
    bumperPos = $bumper.offset().top;
    thisHeight = $this.outerHeight();
    setPosition();
  });

  $window.scroll(setPosition);
  setPosition();
};

function ResetZoom() {

  var reset = false;

  if (CurrentZoom != null) {
    $("#scaleCanvas").val(CurrentZoom);
    reset = true;
  }

  if (CurrentTop != null) {
    for (i = 0; i < fbCanvas.getObjects().length; i++) {
      ImageObj = fbCanvas.getObjects()[i];
      if (ImageObj.type === "image" && ImageObj.id === bgId) {
        ImageObj.set({
          top: CurrentTop,
          width: CurrentWidth,
          height: CurrentHeight,
          left: CurrentLeft,
          scaleY: CurrentscaleY,
          selectable: false
        });
        reset = true;
      }
    }
  }

  if (reset) {
    previewConfig.stopScale();
  }
}

function SaveZoom() {

  for (i = 0; i < fbCanvas.getObjects().length; i++) {
    ImageObj = fbCanvas.getObjects()[i];
    if (ImageObj.type === "image" && ImageObj.id === bgId) {
      CurrentLeft = ImageObj.left;
      CurrentTop = ImageObj.top;
      CurrentWidth = ImageObj.width;
      CurrentHeight = ImageObj.height;
      CurrentscaleY = ImageObj.scaleY;
    }
  }

  if ($("#scaleCanvas").length) {
    CurrentZoom = $("#scaleCanvas").val();
  }
}

function CloseModalResize() {
  var myCanvas = $("#myCanvas");
  var myCanvasContainer = $(".canvas-container");
  var myUpperCanvas = $(".upper-canvas");

  myCanvas.width(CanvasOriginalWidth).height(CanvasOriginalHeight);
  myUpperCanvas.width(CanvasOriginalWidth).height(CanvasOriginalHeight);
  myCanvasContainer.width(CanvasOriginalWidth).height(CanvasOriginalHeight);
}

function ShowModalResize() {

  var offSetWidth = 62;
  var myCanvas = $("#myCanvas");
  var myCanvasContainer = $(".canvas-container");
  var myUpperCanvas = $(".upper-canvas");

  if ($(window).width() < 330) {
    offSetWidth = 70;
  }

  myCanvasPreview = ($(window).width() - offSetWidth);

  CanvasOriginalWidth = myCanvas.outerWidth();
  CanvasOriginalHeight = myCanvas.outerHeight();

  if (CanvasOriginalWidth > myCanvasPreview) {
    scale = myCanvasPreview / CanvasOriginalWidth;
    myCanvas.width(CanvasOriginalWidth * scale).height(CanvasOriginalHeight *
      scale);
    myUpperCanvas.width(CanvasOriginalWidth * scale).height(
      CanvasOriginalHeight * scale);
    myCanvasContainer.width(CanvasOriginalWidth * scale).height(
      CanvasOriginalHeight * scale);
  }
}

function ErrorHandler(data) {
  hideToast(500);
  unblock($('.js-next-button,.format-table,.block-table,.clearfix'));
  viewFunc();
  HideFakePreview();
}

function LockEdition() {
  for (i = 0; i < fbCanvas.getObjects().length; i++) {
    ImageObj = fbCanvas.getObjects()[i];
    if (ImageObj.type === "image" && ImageObj.id === bgId) {
      fbCanvas.allowTouchScrolling = true;
      ImageObj.selectable = false;
      EditMode = false;
    }
  }
}

function UnlockEdition() {
  for (i = 0; i < fbCanvas.getObjects().length; i++) {
    ImageObj = fbCanvas.getObjects()[i];
    if (ImageObj.type === "image" && ImageObj.id === bgId) {
      fbCanvas.allowTouchScrolling = false;
      previewConfig.stopScale();
      EditMode = true;
    }
  }
}

function ShowModal() {
  $(".preview").stop().slideUp("fast", function() {
    $(".canvas-container").detach().appendTo('#myCanvasEdit')

    ShowModalResize();
    UnlockEdition();

    $('#myCanvasModal').modal("show");
  });
}

function CloseModal(reset) {
  $(".preview").stop().slideDown("fast", function() {
    $(".canvas-container").detach().appendTo('#thepreviewBox')

    CloseModalResize();

    if (reset) {
      ResetZoom();
    }

    LockEdition();

    $('#myCanvasModal').modal("hide");
  });
}

$('#myCanvasModal').closest('.modal-wrap').unbind('click');

$('body').on('click', '.format-table td', function() {
  $(this).closest('tr').addClass('-active');
});

$('.ui-commandlink').on('click', function() {
  $('.toast-holder').addClass('hidden');
});

$('body').on('change', '.frame-switch .selectable', function() {
  var $group = $(this);
  $('.frames-panel .selectable').addClass('hidden');
  if ($group.hasClass('active')) {
    var frame = $group.data('frame');
    if (frame) {
      $('.frames-panel .' + frame).eq(0).trigger('click');
      $('.frames-panel .' + frame).removeClass('hidden');
    } else {
      $('.frames-panel .noframe').trigger('click');
    }
  }
});

function selectedFrame() {
  if ($('.frames-panel .selectable').hasClass('active')) {
    var $group = $('.frames-panel .selectable.active');
    if ($group.hasClass('premium')) {
      $('.frames-panel .premium').removeClass('hidden');
    } else if ($group.hasClass('decor')) {
      $('.frames-panel .decor').removeClass('hidden');
    } else {
      return;
    }
  }
}

function smoothScrollTo(el) {

  var HeaderBar_height = 0;
  var PageHead_height = 0;


  if ($(".header-bar").length) {
    HeaderBar_height = $(".header-bar").outerHeight()
  }

  if ($("._p_t-page-head").length) {
    PageHead_height = $("._p_t-page-head").outerHeight()
  }

  $('html, body').stop().animate({
    scrollTop: el.offset().top - (isPhone ? 30 : (HeaderBar_height +
      PageHead_height) - 14)
  }, 500);
};
