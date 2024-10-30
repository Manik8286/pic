//= include vendor/fakeUpload.js

var isShapy = true;
var windowPosition = 0;
var showCartInfoFlag = false;
var addUpload = false;
var animSpeed = 200;
var AddBasket = false;
var CartUpdated = false;

var CallUpload = function(productId) {
	var  productIdDefault = 492; // Canvas default
	try {
		if(typeof productId !== "undefined") {
			productIdDefault = productId; 
		} 				
	}
	catch(err) {
	}
	$("#MultiUpload .js-du-productid").val(productIdDefault).change(); 
	CallUploadButtonEvents();
	$("#MultiUpload input[type=file]").trigger("click");
};

function SetAddBasket() {
	AddBasket = true;
}

function CheckPreviousOptions() {

	var newChange = false

	if (Cookies.get('shape-id')) {

		var shapeId = Cookies.get('shape-id');

		if (shapeId != $(".clipart-preview.-active").data("shape-id")) {

			if ($(".clipart-preview[data-shape-id='" + shapeId + "']").length) {
				$(".clipart-preview[data-shape-id='" + shapeId + "']").trigger("click");
				newChange = true;
			} else if (!$(".clipart-preview.-active").length) {
				$(".clipart-preview").eq(0).trigger("click");
				newChange = true;
			}
		}
	}

	if (!newChange) {
		ShowShapyActive();
	}

	if ($(".tab-options li[data-tab='Upload']").hasClass("-active")) {
		ChangeBacktoUploadImage();
	} else if ($(".tab-options li[data-tab='Motiv']").hasClass("-active")) {
		ChangeBacktoMotivImage();
	} else if ($(".tab-options li[data-tab='Farbe']").hasClass("-active")) {
		ChangeBacktoFarbeImage();
	}
}

function RemoveSavedOptions() {
	RemoveSavedShape();
	RemoveSavedUpload();
	RemoveSavedMotiv();
  RemoveSavedFarbe();
}

function RemoveSavedUploadAddBasket() {
	if ($(".tab-options li[data-tab='Upload']").hasClass("-active")) {
		RemoveSavedUpload();
	} else if ($(".tab-options li[data-tab='Motiv']").hasClass("-active")) {
		RemoveSavedMotiv();
	} else if ($(".tab-options li[data-tab='Farbe']").hasClass("-active")) {
		RemoveSavedFarbe();
	}
}

function RemoveSavedShape() {
	Cookies.remove('shape-id');
}

function RemoveSavedUpload() {
	Cookies.remove('upload-id');
}

function RemoveSavedMotiv() {
	//Cookies.remove('motiv-id');
}

function RemoveSavedFarbe() {
	//Cookies.remove('farbe-id');
}

function ShowShapyActive() {

	$(".clipart-preview.-nomark").removeClass("-nomark");
	$(".-noVisible").removeClass("-noVisible");

	HideFakePreview();
}

function SaveUploadIdAfterUpload() {
	if ($(".upload-preview.-active").length) {
		Cookies.set('upload-id', $(".upload-preview.-active").data("upload-id"));
	}	
}

function SaveSelectedShapy() {
	$(".clipart-preview").on('click', function() {
		Cookies.set('shape-id', $(this).data("shape-id"));
	});	
}

function SaveSelectedUpload() {
	$(".upload-preview").on('click', function(event) {
		if (event.target != this) {
			return false;
		}
		Cookies.set('upload-id', $(this).data("upload-id"));
	});	
}

function SaveSelectedMotiv() {
	$(".motiv-preview").on('click', function() {
		Cookies.set('motiv-id', $(this).data("motiv-id"));
	});    
}

function SaveSelectedFarbe() {
	$(".farbe-preview").on('click', function() {
		Cookies.set('farbe-id', $(this).data("farbe-id"));
	});    
}

function TileTitle() {
	var formTitle = ": " + $(".clipart-preview.-active").find("label").text();
	$(".option-block-title[data-group-tab='Formats'] .close").text(formTitle);				
}

function ShowCartInfo() {

	smoothScrollTo($('body'));

	UpdateCartInfo();
	$(".itemAdded").slideDown({
    done: function () {
      setTimeout(function(){
        $(".itemAdded").stop().slideUp();
        showCartInfoFlag = false;
      }, 5000);
    },
  });
}

function MobileBasketInfoFocus() {
	$(".itemAdded").find("button").focus();
	smoothScrollTo($('body'));
}

function EnableGroupsSwitcher() {

	var blockFormat = $(".option-block-title[data-group-tab='Formats']");

	blockFormat.on('click', function() {
		if (!$(this).hasClass("-active")) {
			ExpandFormat();
		}
	});	
}

function ColapseFormat() {

	var blockFormat = $(".option-block-title[data-group-tab='Formats']");

	if (blockFormat.hasClass("-active")) {

		blockFormat.removeClass("-active")

		blockFormat.parent().find(".option-block-content").slideUp(animSpeed, function() {
			$(this).removeClass("-active");
		});					

	}

	CurrentGroupTabDesigns();
}

function ExpandFormat() {

	var blockFormat = $(".option-block-title[data-group-tab='Formats']");

	if (!blockFormat.hasClass("-active")) {

		blockFormat.addClass("-active");
	
		blockFormat.parent().find(".option-block-content").slideDown({
			duration: animSpeed,
			start: function () {
				$(this).addClass("-active");
			},
			always: function () {
				smoothScrollToTop($(this).parent().find(".option-block-title"));
			}
		});
	}

	CurrentGroupTabFormats();
}

function EnableMotiv() {
	$(".motiv-preview").each(function(i, obj) {
		$(this).on('click', function() {
			if (isMobile) {
				ColapseFormat();
			}						
			var motivid = $(this).data("motiv-id");
			changeMotivItem([{name: 'galleryItemId', value: motivid}])
		});
	});					
}

function EnableFarbe() {
	$(".farbe-preview").each(function(i, obj) {
		$(this).on('click', function() {
			if (isMobile) {
				ColapseFormat();
			}						
			var farbeid = $(this).data("farbe-id");
			changeFarbeItem([{name: 'galleryItemId', value: farbeid}])
		});
	});					
}

function EnableUpload() {
	$(".upload-preview").each(function(i, obj) {
		$(this).on('click', function(event) {

			if ($(this).hasClass("-active") || event.target != this) {
				return false;
			}
			if (isMobile) {
				FakePreview();
				smoothScrollToTop($('.preview'));
				ColapseFormat();
			}

			var uploadid = $(this).data("upload-id");
			changeInboxItemSameConfig([{name: 'inboxItemId', value: uploadid}])
		});
	});					
}

function ChangeBacktoUploadImage() {
	$(".upload-preview.-active").removeClass("-active");
	if (Cookies.get('upload-id')) {
		var uploadId = Cookies.get('upload-id');
		$(".upload-preview[data-upload-id='" + uploadId + "']").trigger("click");
	} else {
		if ($(".upload-preview").not(".-isInCart").length) {
			$(".upload-preview").not(".-isInCart").eq(0).trigger("click");
		} else {
			$(".upload-preview").eq(0).trigger("click");
		}		
	}
}

function ChangeBacktoMotivImage() {
  ForceUploadTabFalse();
	if (uploadedImage || !$(".motiv-preview.-active").length) {
		$(".motiv-preview.-active").removeClass("-active");
		if (Cookies.get('motiv-id')) {
			var motivId = Cookies.get('motiv-id');
			$(".motiv-preview[data-motiv-id='" + motivId + "']").trigger("click");
		} else {
			$(".motiv-preview").eq(0).trigger("click");
		}
	}
}

function ChangeBacktoFarbeImage() {
  ForceUploadTabFalse();
	if (uploadedImage || !$(".farbe-preview.-active").length) {
		$(".farbe-preview.-active").removeClass("-active");
		if (Cookies.get('farbe-id')) {
			var farbeId = Cookies.get('farbe-id');
			$(".farbe-preview[data-farbe-id='" + farbeId + "']").trigger("click");
		} else {
			$(".farbe-preview").eq(0).trigger("click");
		}
	}
}

function EnableControls() {
	$(".tab-options li").each(function(i, obj) {
		$(this).on('click', function() {
			if (!$(this).hasClass("-active")) {
				$(".tab-options li").removeClass("-active")
				$(this).addClass("-active")
				$(".tab").slideUp(animSpeed);
				$("." + $(this).data("tab")).slideDown(animSpeed);

				if ($(this).data("tab") == "Upload") {
					ChangeBacktoUploadImage();
				} else if ($(this).data("tab") == "Motiv") {
					ChangeBacktoMotivImage();
				} else if ($(this).data("tab") == "Farbe") {
					ChangeBacktoFarbeImage();
				}
			}
		});
	});
}

function EnableCartInfo() {
	showCartInfoFlag = true;
}

function ResetCanvasPreview() {
	if (isMobile) {
		FakePreview();
	}
	previewConfig = new Configurator();
}

function ResetQnty() {
  $(".quantity").ready(function () {
    $(".quantity").val(1).change();
  });
}



function RestartCanvasPreview() {
	defer(function() {
		setTimeout(function(){
			previewConfig.buildPreview();
			hideUploaderFake();
      if (isMobile && windowPosition) {
        $(window).scrollTop(windowPosition);
      }
		}, 100);
	});
	
	SaveUploadIdAfterUpload();
}

function ShowActive() {
  $(".-nomark").removeClass("-nomark");
}

function CheckInit() {
  if (!uploadedImage) {
    initialFormUpdate();
  }  
}

function UpdateUloadGallery(uploadId) {
	setTimeout(function(){
		$(".upload-preview[data-upload-id='" + uploadId + "']").remove();
		$('.ui-dialog-mask').remove();

		if ($(".upload-preview.-active").length) {
			// Do nothing      
		} else if ($(".upload-preview").length) {
			$(".upload-preview").first().trigger("click");
		} else {
			var motivid = $(".motiv-preview").first().data("motiv-id");
			ForceUploadTabTrue();
			Cookies.set('motiv-id', motivid);
			changeMotivItem([{name: 'galleryItemId', value: motivid}])
		}
	}, 500);
}

function AdjusteScroll() {
	$('#preview-wrapper').followTo('#stoppreview');
}

function OnComplete() {
	OnCompleteFormat();
	ShowShapyActive();
  ShowActive();
}

$(document).ready(function () {
	CheckInit();
	OnCompleteFormat();
	CheckPreviousOptions();

	if (isMobile) {

		viewFunc();
		updateDom();

		if (!CartUpdated) {
			setTimeout(function(){
				CartUpdated = true;
				UpdateCartInfo();
			}, 100);
		}
	}
});

$(window).scroll(function() {
	if (!isMobile) {
		AdjusteScroll();
	}
});

function OnCompleteFormat() {
	EnableControls();
	SumTotalPrice();
	EnableMotiv();
  EnableFarbe();
	EnableUpload();
	SaveSelectedShapy();
	SaveSelectedUpload();
	SaveSelectedMotiv();
  SaveSelectedFarbe();

	if (isMobile) {
		TileTitle();
		EnableGroupsSwitcher();
	} else {
		AdjusteScroll();
	}
}

function defer(method) {
  if (typeof(previewConfig) != 'undefined' && typeof(method) == 'function'){
    if (showPreview){
      method();
    }
  } else {
    setTimeout(function() {defer(method)}, 50);
  }
}

function smoothScrollToTop(el) {
  if (!showCartInfoFlag) {
    if (el.length) {
      if ($(window).scrollTop() >= (el.offset().top - 14)) {
        smoothScrollTo(el);
      }
    }
  }
}

function smoothScrollTo(el) {
  setTimeout(function(){
    $('html, body').stop().animate({
      scrollTop: el.offset().top - 14
    }, 500, function() {
      windowPosition = $(window).scrollTop();
    });  
  }, 100);
};

$.fn.followTo = function(elem) {
  var $this = this,
    $window = $(windw),
    $bumper = $(elem),
    bumperPos = $bumper.offset().top,
    thisHeight = $this.outerHeight(),
    notificationHeight = 0,
    $shift = 0,
    navbarHeight = 0;
  
  var startingPos = $('.formats').offset().top - $shift - notificationHeight;
  
  //for mobile configurator ITPT-791
  if (navbarHeight == null) {
    navbarHeight = $('.top-header-bar').outerHeight();
  }
  
  setPosition = function(offset) {
    if ($this.outerHeight() < $('.formats').outerHeight()) {
      if ($window.scrollTop() > (bumperPos - thisHeight - $shift - notificationHeight)) {
        $this.removeClass('fixed');
        $this.addClass('absolute');
        $this.css({
          top: (bumperPos - thisHeight - startingPos - $shift - notificationHeight)
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
    } else {
      $this.removeClass('fixed');
      $this.removeAttr('style');      
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