var finished = false;
var totalFiles = 0;
var parcelPercent = 0;
var totalPercent = 0;
var semiTotalPercent = 0;
var currentFile = 0;
var currentLine = 0;
var currentFileCount = 0;
var started = false;
var updating = 0;
var percent = 0;
var percentNum = 0;
var fileSize = 0;
var currentFileLine = 0;
var totalFileLine = null;
var percentElement = null;

var $cover = $('.js-up'),
		$abort = $('.js-up-abort'),
		$size = $('.js-up-file-size'),
		$indicator = $('.js-up-indicator'),
		$icon = $('.js-up-indicator-icon'),
		$msgOngoing = $('.js-up-ongoing'),
		$msgRedirect = $('.js-up-redirect'),
		$msgPrepare = $('.js-up-prepare'),
		$percentage = $('.js-up-percentage'),
		$perc = $('.js-up-percentage-value');

var showUploader = function() {

	$cover.detach().appendTo('body');
	$cover.addClass('-visible').delay(1).queue(function() {
		$(this).addClass('-fade-in');
		$(this).dequeue();
	});
};

var hideUploader = function() {
	
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
};

var followUploadProcess = function() {

	var uploadWidget = PF('uploader');

	if (!started) {

		finished = false;
		totalFiles = 0;
		parcelPercent = 0;
		totalPercent = 0;
		semiTotalPercent = 0;
		currentFile = 0;
		currentLine = 0;
		currentFileCount = 0;
		updating = 0;
		percent = 0;
		percentNum = 0;
		fileSize = 0;
		totalFileLine = 0;
		currentFileLine = null;
		percentElement = null;

		showUploader();

		$indicator.removeClass('-indeterminate');
		$indicator.css('height', '');

		started = true;
	}

	if (!uploadWidget.files.length) {
		finished = true;
		started = false;
	}

	if (!finished) {

		setTimeout(function() {
			
			if (totalFiles == 0) {
				totalFiles = uploadWidget.files.length;
			}

			if (totalFiles > 1) {
				$size.removeClass("-hidden");
			}

			totalFileLine = $(".ui-fileupload-row").length;

			if (totalFileLine) {

				currentFile = (totalFiles - uploadWidget.files.length);
				currentFileCount = currentFile + 1;
				currentLine = totalFiles - currentFile;

				currentFileLine = $(".ui-fileupload-row").slice(-currentLine).first();

				if (currentFileLine.length) {

					percentElement = currentFileLine.find(".ui-fileupload-progress");
					percent = percentElement.find(".ui-progressbar-value").prop('style')['width'];
					percentNum = parseInt(percent.replace('%', ''));
					fileSize = percentElement.prev().text();
					$size.find("small").text(currentFileCount + " / " + totalFiles + " - " + fileSize + " (" + percent + ")");

					parcelPercent = (1 / totalFiles);
					semiTotalPercent = ((currentFileCount - 1 ) / totalFiles);
					totalPercent = Math.ceil((semiTotalPercent + (parcelPercent / 100 * percentNum)) * 100);

					$perc.text(totalPercent);

					$indicator.css('height', (totalPercent / 100 * 150) + 'px');
					$icon.css('top', -150 + (totalPercent / 100 * 150) + 'px');
				}

				if (!uploadWidget.files.length) {
					$msgOngoing.addClass('-hidden');
					$msgPrepare.addClass('-hidden');
					$percentage.addClass('-hidden');
					$msgRedirect.removeClass('-hidden');
					$indicator.addClass('-indeterminate');
					$size.addClass("-hidden");
				}
			}

			followUploadProcess();
			updating++
		}, 100);

	} else {

		$msgRedirect.addClass('-hidden');
		$indicator.addClass('-indeterminate');
		$size.addClass("-hidden");
		$msgPrepare.removeClass('-hidden');
		$msgOngoing.addClass('-hidden');
		$percentage.addClass('-hidden');
	}
};