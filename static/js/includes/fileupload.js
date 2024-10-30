var multiUploadEnabled = true;
var DebugInfo = false;

var SetSingleUploadButtonEvents = function() {
  multiUploadEnabled = false;
  CallUploadButtonEvents();
}

var CallUploadButtonEvents = function() {

  if(!$('.js-du').length) return;

  var $file = $('.js-du-file'),
      $button = $('.js-du-button'),
      $cover = $('.js-up'),
      $abort = $('.js-up-abort'),
      $size = $('.js-up-file-size'),
      $indicator = $('.js-up-indicator'),
      $icon = $('.js-up-indicator-icon'),
      $msgOngoing = $('.js-up-ongoing'),
      $msgRedirect = $('.js-up-redirect'),
      $msgPrepare = $('.js-up-prepare'),
      $percentage = $('.js-up-percentage'),
      $perc = $('.js-up-percentage-value');

  var redirectURL = "",
      inboxItem = "",
      mainUrl = '/externalAPI?' +
                'action=uploadImage' +
                '&json=true';

  var jqXHR = null,
      isAborted = false,
      filesCount = 0,
      uploadSucess = 0,
      errorTooBig = 0,
      errorTooMany = 0,
      errorWrongFile = 0,
      errorTooSmall = 0,
      errorOther = 0,
      errorResolution = 0,
      uploadData = [];

  if ($cover.is(":visible")) {
    hideUploader();
  }

  // Internet Explorer lower than 9 will fail.
  // They are able to upload a file, but can't
  // retreive the JSON data properly and are a
  // pain in the butt on other functions. Before
  // we write more and more code to wrap our head
  // around this we simply use simpleupload.jsf
  // for older browsers.

  if (window.ie <= 9) {
    $file.css('display', 'none');
    $button.on('click', function(e) {
      window.location = '/simpleupload.jsf';
    });
  }

  // For each multibutton add click event that pushes data to array
  $($file).each(function () {

    var multiUploadEnabledItem = multiUploadEnabled;

    if ($(this).parents('.js-du').find(".js-up-single").length) {
      multiUploadEnabledItem = false;
    } else if ($(this).parents('.js-du').find(".js-up-ar").length) {
      multiUploadEnabledItem = false;
    }

    if (multiUploadEnabledItem) {
      $(this).prop("multiple", true);
    } else {
      $(this).removeAttr('multiple');
    }

    // Variables
    var $fileClick = $(this),
        $form = $fileClick.parents('.js-du'),
        $ar = $form.find('.js-up-ar').val(),
        $formInput = $form.find('.js-du-file'),
        $itemsGallery = $form.find('.js-rm-item').val() || 0,
        productId = $form.find('.js-du-productid').val(),
        discountParam = $form.find('.js-du-discountParam').val(),
        textFunktion = $form.find('.js-du-textFunktion').val(),
        externalData = $form.find('input[name=externalData]').val(),
        filesStart = 0,
        filesCurrent = 1,
        file,
        isCorrectType,
        maxFileSize,
        maxFileCount,
        percValueUnit = 0,
        percValueAll = 0;

    // Event listener for product update
    $($form).find('.js-du-productid').change(function() {
      productId = $(this).val();
    });

    $( $form ).find('.js-du-file').change(function() {
      $formInput = $form.find('.js-du-file');
      isAborted = false;
      percValueAll = 0;
      percValueUnit = 0;

      uploadSucess = 0;
      filesCurrent = 1;

      errorTooBig = 0;
      errorTooMany = 0;
      errorWrongFile = 0;
      errorTooSmall = 0;
      errorOther = 0;
      errorResolution = 0;
    });

    uploadData.push($fileClick.fileupload({
      url: mainUrl + '&addToInbox=' + multiUploadEnabledItem + '&product=' + productId,
      type: 'POST',
      dataType: 'json',
      paramName: 'imageData',
      change: function(e, data) {
        if (DebugInfo) console.log("0 - CHANGE");

        maxFileCount = 100;
        filesCount = data.files.length;

        if (filesCount > maxFileCount) {
          errorTooMany++;
          file = null;
          isAborted = true;

          CheckErrorOrRedirect(redirectURL, $itemsGallery, $ar, multiUploadEnabledItem);
          return;
        }
      },
      start: function(e, data) {
        if (DebugInfo) console.log("1 - START");
        percValueAll = 0;
        $msgOngoing.removeClass('-hidden');
        $msgPrepare.addClass('-hidden');
        $percentage.removeClass('-hidden');
        $msgRedirect.addClass('-hidden');
        $indicator.removeClass('-indeterminate');
        $indicator.css('height', '');
        $icon.css('top', '');
      },
      add: function(e, data) {
        if (DebugInfo) console.log("2 - ADD");

        // Check if discountCode exist
        if (discountParam !== undefined) {
          data.url = mainUrl + '&discountCode=' + discountParam;
        } else if (externalData !== undefined) {
          data.url = mainUrl + '&externalData=' + externalData;
        }

        // We grab the current file and validate some
        // properties, if the File API is available.
        try {

          maxFileSize = 62914560;
          file = data.files[0];
          isCorrectType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/webp';
          isCorrectSize = (maxFileSize >= file.size);
        } catch (e) {
          console.warn(e);
        } finally {
          // We secretly clone the file-input with itself,
          // reset it and reference it again on the .fileinput()
          // plugin. If we wouldn't do this, the add-event
          // won't be triggered if the user cancels the upload
          // and tries to re-upload something.

          //$formInput.replaceWith($formInput.clone().val(null));
          data.fileInput = $formInput;
          $size.removeClass("-hidden");
        }

        // Now we can show the uploader and
        // submit the file.

        if (!isAborted) {
          if (isCorrectType && isCorrectSize) {
            showUploader();
            jqXHR = data.submit();
          } else {
            if (!isCorrectType) {
              errorWrongFile++;
            }
            if (!isCorrectSize) {
              errorTooBig++;
            }
            jqXHR = data.abort();
          }
        }
      },
      always: function(e, data) {
        if (DebugInfo) console.log("3 - ALWAYS");
        filesCurrent++;
      },
      progress: function(e, data) {
        if (DebugInfo) console.log("4 - PROGRESS");
        file = data.files[0];
        percValueUnit = parseInt(data.loaded / data.total * 100, 10);
        if (filesCount > 1) {
          $size.find("small").text(filesCurrent + " / " + filesCount + " - " + formatFileSize(data.loaded) + ' | ' + formatFileSize(data.total) + " (" + percValueUnit + "%)");
        } else {
          $size.find("small").text(formatFileSize(data.loaded) + ' | ' + formatFileSize(data.total));
        }
      },
      progressall: function(e, data) {
        if (DebugInfo) console.log("5 - PROGRESSALL");
        percValueAll = parseInt(data.loaded / data.total * 100, 10);
        $indicator.css('height', (data.loaded / data.total * 150) + 'px');
        $icon.css('top', -150 + (data.loaded / data.total * 150) + 'px');
        $perc.text(percValueAll);

        // If the file is uploaded, the redirect will be
        // prepared, so we show the message.
        if (percValueAll === 100) {
          $size.addClass("-hidden");
          $percentage.addClass('-hidden');
          $msgOngoing.addClass('-hidden');
          $msgPrepare.removeClass('-hidden');
          $msgRedirect.addClass('-hidden');
          $indicator.addClass('-indeterminate');
        }
      },
      done: function(e, data) {
        if (DebugInfo) console.log("6 - DONE");
        // If we are done, something could've gone wrong.
        if (data.result.status === 'failure') {
          errorOther++;
        } else {
          uploadSucess++;
        }

        // Don't redirect, when something set
        // isAborted to true!
        if (!isAborted) {
          //window.location = data.result.redirect;
          if (!redirectURL) {
            redirectURL = data.result.redirect;

            try {
              inboxItem = parseInt(data.result.inboxItem);
            }
            catch(err) {
            }


            if ($form.find('.js-up-url-params').length) {
              redirectURL = updateRedirect(redirectURL, $form)
            }
            if($form.find('.js-up-other-page-redirect').length) {
              redirectURL = otherPageRedirect(redirectURL, $form);
            }

            console.log("URL: " + data.result.redirect);
            console.log("inboxItem: " + data.result.inboxItem);
            console.log("");
          }
        }
      },
      fail: function(e, data) {
        if (DebugInfo) console.log("7 - FAIL");
        if (data.errorThrown !== 'abort') {

          var errorMessage = "";

          try {
            errorMessage = data.jqXHR.responseJSON.message;
            errorDetails = data.jqXHR.responseJSON.details[0];
          } catch (err) {}

          if (errorMessage.toLowerCase().indexOf("error") > -1 && errorDetails.toLowerCase().indexOf("bitmap") > -1) {
            errorResolution++;
          } else if (errorMessage.toLowerCase().indexOf("error") > -1 && errorDetails.toLowerCase().indexOf("bitmap") < 0) {
            errorOther++;
          } else {
            errorTooSmall++;
          }
        } else {
          if (filesCount == 1) {
            ShowErrorModal();
          }
        }
        return;
      },
      stop: function(e) {
        if (DebugInfo) console.log("8 - STOP");
        // If everything is a-o-kay, we will get redirected
        // and the correct message will show up.
        $size.addClass("-hidden");
        $msgOngoing.addClass('-hidden');
        $msgPrepare.addClass('-hidden');
        $percentage.addClass('-hidden');
        $msgRedirect.removeClass('-hidden');

        CheckErrorOrRedirect(redirectURL, $itemsGallery, $ar, multiUploadEnabledItem);
      }
    }));
  });

  var ShowErrorModal = function() {
    if (errorTooBig) {
      Modal.open('#fileTooBig');
    } else if (errorWrongFile) {
      Modal.open('#fileWrongType');
    } else if (errorOther) {
      Modal.open('#fileUploadError');
    } else if (errorResolution) {
      Modal.open('#fileUploadErrorResolution');
    } else if (errorTooSmall) {
      Modal.open('#fileTooSmall');
    }
  };

  var CheckErrorOrRedirect = function(redirectURL, itemsGallery, $ar, multiUploadEnabledItem) {

    if (errorTooMany) {
      Modal.open('#fileTooMany');
      hideUploader();
      return;
    }

    if (!uploadSucess) {
      ShowErrorModal();
      hideUploader();
      return;
    }

		if (!isAborted) {

			if (redirectURL != "") {

				var totalImgRemain = parseInt(filesCount) + parseInt(itemsGallery);

				var url = redirectURL;

				if (multiUploadEnabledItem) {

					if (filesCount != 1 && totalImgRemain > 1) {

            if (errorTooBig) {
              url = url.newParamURL("errorTooBig", errorTooBig);
            }
            if (errorWrongFile) {
              url = url.newParamURL("errorWrongFile", errorWrongFile);
            }
            if (errorTooSmall) {
              url = url.newParamURL("errorTooSmall", errorTooSmall);
            }
            if (errorOther) {
              url = url.newParamURL("errorOther", errorOther);
            }
            if (errorResolution) {
              url = url.newParamURL("errorResolution", errorResolution);
            }

						location.href = url.replace(/configurator/ig, 'gallery');
						return;

					} else {

						url = url.newParamURL("action", "rm-inbox-item");
						url = url.newParamURL("inboxItem", inboxItem);

						location.href = url;
						return;
					}

				} else {

          if ($ar) {
            AR.onCompleteUploadAr(url);
          } else {
            location.href = url;
            return;
          }
				}
			}
		}
  };

	String.prototype.newParamURL = function(paramName, paramValue) {

		var newParam = "";

		if (this.indexOf("?") < 0) {
			newParam = "?";
		} else {
			newParam = "&";
		}

		newParam = newParam + paramName + "=" + paramValue;

		return this + newParam;

	};

  var formatFileSize = function(bytes) {
    if (typeof bytes !== 'number') {
      return '';
    }
    if (bytes >= 1000000000) {
      return (bytes / 1000000000).toFixed(2) + ' GB';
    }
    if (bytes >= 1000000) {
      return (bytes / 1000000).toFixed(2) + ' MB';
    }
    return (bytes / 1000).toFixed(2) + ' KB';
  };

  function showUploader() {
    $button.prop('disabled', true);
    $file.prop('disabled', true);

    $cover.detach().appendTo('body');

    $("body").addClass("sp-no-js");

    $cover.addClass('-visible').delay(1).queue(function() {
      $(this).addClass('-fade-in');
      $(this).dequeue();
    });
  }

  function hideUploader() {
    $button.prop('disabled', false);
    $file.prop('disabled', false);

    $("body").removeClass("sp-no-js");

    $cover.removeClass('-fade-in').delay(200).queue(function() {
      $(this).removeClass('-visible');
      $msgOngoing.removeClass('-hidden');
      $msgPrepare.addClass('-hidden');
      $percentage.removeClass('-hidden');
      $msgRedirect.addClass('-hidden');
      $indicator.removeClass('-indeterminate');
      $indicator.css('height', '');
      $icon.css('top', '');
      $(this).dequeue();
    });
  }

  function updateRedirect(redirectUrl, element){
    var params = element.find('.js-up-url-params').val().split('x'),
        width = params[0],
        height = params[1];
    return redirectUrl + "&formatWidth=" + width + "&formatHeight=" + height;
  }

  function otherPageRedirect(oldRedirectURL, element) {
    var newUrl = element.find('.js-up-other-page-redirect').val();
    var oldUrl = new URL(oldRedirectURL);
    var imageId = oldUrl.searchParams.get('image');

    if (newUrl[0] != '/') {
      newUrl = '/' + newUrl;
    }

    return oldUrl.origin + newUrl + '&image=' + imageId;
  }

  $abort.on('click', function() {
    // if we're currently redirecting,
    // we'll stop it.
    window.stop();

    // set notify variables to prevent other
    // functions doing stuff we don't want
    // them now to do.
    isAborted = true;

    // finish everything
    hideUploader();
    jqXHR.abort();
  });

  // The input[type=file] is on top of the button and
  // won't let hover events through. So we emulate them.
  $file.on('mouseenter mouseleave', function(e) {
    if (e.type === 'mouseenter')
      $( this ).next("button").addClass('-hover');
    else
      $( this ).next("button").removeClass('-hover');
  });
};

$(document).ready(function () {
  CallUploadButtonEvents();
});

var CallPreUploadImg = function(productId) {
  var  productIdDefault = 533; // Canvas default
  try {
    if(typeof productId !== "undefined") {
      productIdDefault = productId;
    }
  }
  catch(err) {
  }

  CallPreUpload("init_gray.jpg",productIdDefault);
};

var CallPreUploadImgMulti = function(productId, galleryItem, image) {
  location.href = "/configurator.jsf?product=" + productId + "&galleryItem=" + galleryItem + "&image="+ image;
};

var CallPreUpload = function(ImageName, productId) {
  showUploaderFake();
  $.ajax ({
    url: "/externalAPI?image=" + window.location.origin.toLowerCase().replace("testing", "www") + "/assets/img/checkout/configurator/shapy/" + ImageName + "&action=uploadImage&product=" + productId + "&shared=true&json",
    dataType: "json",
    contentType: "application/json",
    success: function (jsonSuccess) {
      var url = jsonSuccess.redirect;
      url = url + "&init=true";
      location.href = url;
    },
    error: function(jsonError) {
      console.log(jsonError);
      hideUploaderFake();
    }
  });
};

var onUploadCompleteShapy = function(component) {
  var multiple = false; //(component.uploadedFileCount > 1)
  var missedFiles = component.files.length;
  if (missedFiles == 0) {
    redirectOrError();
  }
};

var onUploadCompleteMaskLP = function(component) {
  var multiple = false; //(component.uploadedFileCount > 1)
  var missedFiles = component.files.length;
  if (missedFiles == 0) {
    redirectOrError();
  }
};

var onUploadCompleteMaskConfigurator = function(component) {
  var multiple = false; //(component.uploadedFileCount > 1)
  var missedFiles = component.files.length;
  if (missedFiles == 0) {
    ForceUploadTabTrue();
    changeToUnusedInboxItem();
  }
};

var onUploadCompleteShapix = function(component) {
  var multiple = false; //(component.uploadedFileCount > 1)
  var missedFiles = component.files.length;
  if (missedFiles == 0) {
    changeToUnusedInboxItem();
  }
};

window.onpageshow = function(event) {
  if (event.persisted) {
    CallUploadButtonEvents();
  }
};
