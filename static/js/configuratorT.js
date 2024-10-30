//= include TextV7/bootstrap_modal.js
//= include TextV7/fabric.prot.js
//= include TextV7/fabric.canvasex.js
//= include TextV7/configuratorA.js

//================================ Globals =======================================

var mountingSize = 0;
var TextEditMode = false;
var myCanvasModal = null;
var bgId = "bestImage";
var BorderId = "BorderImage";
var PasseId = "PaspartuMapImage";
var myCanvasDiv = null;
var currentEdit = null;
var TextDefault = "Din text";
var TextLayerId = "TextLayer";
var TextLayerIndex = 11;
var opacity_mid = "1";
var leftAddMove = 20;
var ScaleUp = 0;
var ScaleDown = 0;
var TextFreezed = false;
var ImageColor = true;
var barPosition = null;
var FormatChanged = false;
var OriginalFormat = null;
var FormatChangedBasket = false;
var ScaleRestore = 0;
var BorderCanvasGlobal = 0;
var OriginalImageUrl = null;
var OriginalFertigButton = null;
var OriginalFertigTitle = null;
var SaveChanges = false;
var NewChanges = false;
var CheckElementColision = false;
var ImageSizeLimite = 2048;
var ShowHorizontal = false;
var TextCanvasHeight = 0;
var TextCanvasWidth = 0;
var topAddMove = 0;
var cm_pixel = 37.795276;
var offSetHeight = 280;
var offSetWidth = 60;
var DPItoSave = 150;
var DPItoSaveSmallerSizes = 300;
var SmallerSizes = 410;
var BorderTop = 0;
var BorderBottom = 0;
var BorderRight = 0;
var BorderLeft = 0;
var SaveBorderTop = 0;
var SaveBorderBottom = 0;
var SaveBorderRight = 0;
var SaveBorderLeft = 0;
var AnotherUpload = false;
var attempted = 0;

var fontSizeList = [];
var arrayTextRemoved = [];
var arrayTextChanged = [];

var PreviewOriginalWidth = 0;
var PreviewOriginalHeight = 0;

var ProductsTextOff = [1190];

//====================================================================================
//================================ TEXT CANVAS =======================================
//====================================================================================

function RefreshControls() {

	myCanvasDiv = $(".preview");

	ModalTextRemoveConfirm = $("#ModalTextRemoveConfirm"); //Text Delete Confirm
	ModalTextRemoveConfirm.modal({show: false, backdrop: false, keyboard: false});

	ModalSaveCanges = $("#ModalSaveCanges"); //Save Changes Confirm
	ModalSaveCanges.modal({show: false, backdrop: false, keyboard: false});

	myCanvasModal = $("#myCanvasModal"); //Main Modal Editor
	myCanvasModal.modal({show: false, backdrop: 'static', keyboard: true});

	$("label[id*='AddTextButton']").unbind();
	$("label[id*='AddTextButton']").on('click', function() {
		if (!TextEditMode) {
			FormatChangedBasket = false;
			ShowEditor(function() {
				SetTools("text");
			});
		}
	});

	$("label[id*='AddImageButton']").unbind();
	$("label[id*='AddImageButton']").on('click', function() {
		if (!TextEditMode) {
			FormatChangedBasket = false;
			ShowEditor(function() {
				SetTools("image");
			});
		}
	});

	LoadControls();
}

function SetTools(mode) {

	if (isMobile) {

		if (mode == "image") {
			$("#TitleTypeLock").removeClass("TypeActive");
			$("#TitleTypeImage").addClass("TypeActive");
			$("#TitleTypeText").removeClass("TypeActive");
			$("#ImageTools").removeClass("hidden");
			$("#TextTools").addClass("hidden");
			$("#LockTools").addClass("hidden");
		}
		else if (mode == "text") {
			$("#TitleTypeLock").removeClass("TypeActive");
			$("#TitleTypeImage").removeClass("TypeActive");
			$("#TitleTypeText").addClass("TypeActive");
			$("#ImageTools").addClass("hidden");
			$("#TextTools").removeClass("hidden");
			$("#LockTools").addClass("hidden");
		}
		else if (mode == "lock") {
			$("#TitleTypeLock").addClass("TypeActive");
			$("#TitleTypeImage").removeClass("TypeActive");
			$("#TitleTypeText").removeClass("TypeActive");
			$("#ImageTools").addClass("hidden");
			$("#TextTools").addClass("hidden");
			$("#LockTools").removeClass("hidden");
		}

		if (CheckProductTextOff()) {
			$("#TitleTypeText").removeClass("TypeTitleDisabled");
		}
		else {
			$("#TitleTypeText").removeClass("TypeActive");
			$("#TitleTypeText").prop({disabled: true});
			$("#TitleTypeText").addClass("TypeTitleDisabled");
		}

		for (i = 0; i < fbCanvas.getObjects().length; i++) {

			CurrentObj = fbCanvas.getObjects()[i];

			if (CurrentObj.type === "image" && CurrentObj.id === bgId) {
				CurrentObj.selectable = (mode == "image");
				CurrentObj.evented = (mode == "image");
				CurrentObj.opacity = (mode == "text" ? 0.5 : 1);
			}
			else if (CurrentObj.type === "textbox") {
				CurrentObj.selectable = (mode == "text");
				CurrentObj.evented = (mode == "text");
				CurrentObj.opacity = (mode == "image" ? 0.35 : 1);
			}
		}

		fbCanvas.allowTouchScrolling = (mode != "image");
		fbCanvas.deactivateAll().renderAll();
	}
}

function MoveCanvasScale(callback) {

	$(".canvas-container").detach().appendTo('#thepreviewBox');
	$("#scaleCanvas").detach().appendTo('#scaleCanvasPage');

	if (callback && typeof(callback) === "function") {
		callback();
	}
}

function SaveFinalProcess() {
	SetCanvasProportion("Down", function () {
		RenderCanvas(100, function () {
			MoveCanvasScale(function() {
				myCanvasDiv.stop().slideDown("slow", function () {
					myCanvasDiv.fadeTo(300, 1, function () {
						AdjusteScroll();
						ShowScrollBody();
					});
				})
			});
		});
	});
}

function ShowScrollBody() {
	var isFirefox = typeof InstallTrigger !== 'undefined';

	if (isFirefox) {
		HideFakeBackdrop();
	}

	setTimeout(function(){
		$("body").removeClass("modal-open-fake");
		$("#thepreviewBox").height($(".canvas-container").height());
	}, 100);
}

function RefreshControlsModal() {

	$("#font-size option").each(function(){
		fontSizeList.push($(this).val());
	});

	$(document.body).on('show.bs.modal', function () {
		$('body').css('padding-right','0').addClass("modal-open-fake");
	});
	$(document.body).on('shown.bs.modal', function () {
		$('body').css('padding-right','0').addClass("modal-open-fake");
	});
	$(document.body).on('hide.bs.modal', function () {
		$('body').css('padding-right','0').addClass("modal-open-fake");
	});
	$(document.body).on('hidden.bs.modal', function () {
		$('body').css('padding-right','0').addClass("modal-open-fake");
	});

	$("#ModalSaveCanges").on('show.bs.modal', function () {
		$("#modal-dialog-save").show();
	});

	$("#myCanvasModal").on("show.bs.modal", function (e) {
		$("#modal-dialog-canvas").show();
	});

	$("#ModalSaveCanges").on('hidden.bs.modal', function () {
		$("#modal-dialog-save").show();
	});

	$("#ModalTextRemoveConfirm").on('hidden.bs.modal', function () {
	});

	$("#myCanvasModal").on("shown.bs.modal", function (e) {

		var AddTextDefault = false;

		if (AnotherUpload) {
			$(".modal-backdrop").addClass("hidden");
		}

		if (!FormatChangedBasket) {

			var TotalText = 0;

			fbCanvas.forEachObject(function(CheckObj) {
				if (CheckObj.type == "textbox") {
					TotalText++;
				}
			});


			if (isMobile) {
				if ($("#TitleTypeText").hasClass("TypeActive")) {
					AddTextDefault = true;
				}
			}
			else{
				AddTextDefault = true;
			}

			if (TotalText == 0 && AddTextDefault) {
				setTimeout(function(){
					$("#add-text").trigger("click");
				}, 500);
			}
		}
	});


	$("#myCanvasModal").on("hidden.bs.modal", function (e) {

		NewChanges = false;

		if (SaveChanges) {

			if (FormatChanged) {

				arrayTextChanged = [];

				// Mark all Text elements to generate the Image Overlay (because of Format Changed without Preview/Save)

				fbCanvas.forEachObject(function(CheckObj) {
					if (CheckObj.type == "textbox") {
						if (CheckObj.get('ImageId') > 0) {
							ImageId = CheckObj.get('ImageId');
							arrayTextChanged.push(ImageId);
						}
					}
				});

				FormatChanged = false;
				AlignCurrentChanges();
			}

			SaveCurrentElementsList(function () {

				if (FormatChangedBasket) {
					FormatChangedBasket = false;

					if (AnotherUpload) {
						HideFakeBackdrop();
						UploadAnother();
						AnotherUpload = false;
					}
					else {
						SubmitOriginalForm();
					}
				}
				else {
					SaveFinalProcess();
				}
			});
		}
		else {
			RestoreCurrentElements(function () {
				SaveFinalProcess();
			});
		}
	})

	//============ Make the FormatBar Draggable (Initial Functions) ============

	$("#controls-complete").draggable({cursor: "move", containment: "#myCanvas", scroll: false});

	$('#TopMoveBar').draggable({
		containment: "#myCanvas",
		scroll: false,
		start: function() {
			StartDragBar();
		},
		drag: function(){
			DraggingBar($(this).offset(), "top");
		},
		stop: function() {
			StopDragBar();
		}
	});

	$('#LeftMoveBar').draggable({
		containment: "#myCanvas",
		scroll: false,
		start: function() {
			StartDragBar();
		},
		drag: function(){
			DraggingBar($(this).offset(), "left");
		},
		stop: function() {
			StopDragBar();
		}
	});

	$('#RightMoveBar').draggable({
		containment: "#myCanvas",
		scroll: false,
		start: function() {
			StartDragBar();
		},
		drag: function(){
			DraggingBar($(this).offset(), "right");
		},
		stop: function() {
			StopDragBar();
		}
	});

	$('#BottomMoveBar').draggable({
		containment: "#myCanvas",
		scroll: false,
		start: function() {
			StartDragBar();
		},
		drag: function(){
			DraggingBar($(this).offset(), "bottom");
		},
		stop: function() {
			StopDragBar();
		}
	});

	selectedFrame();
}

function ShowModalTextButton() {
	if (!TextEditMode) {
		FormatChangedBasket = false;
		ShowEditor();
	}
}

function ShowEditor(callback) {
	if ((CheckProductTextOff() && !isMobile) || isMobile) {
		NewChanges = false;
		TextEditMode = true;
		EnableTextActions();
		ShowModalText(function(){
			BorderCanvasGlobal = GetBorder();
			if (FormatChangedBasket) {
				SaveAndClose();
			}
		});

		if (callback && typeof(callback) === "function") {
			callback();
		}
	}
}

function ShowFakeBackdrop() {
	$("#FakeBackdrop").removeClass("hidden");
}

function HideFakeBackdrop() {
	$("#FakeBackdrop").addClass("hidden");
}

function ShowModalText(callback) {

	myCanvasDiv.stop().fadeTo(300, 0, function () {

		myCanvasDiv.slideUp("fast", function () {

			$(".canvas-container").detach().appendTo('#myCanvasEdit');
			$("#scaleCanvas").detach().appendTo('#scaleCanvasModal');

			SetCanvasProportion("Up", function () {
				previewConfig.doScale();
				fbCanvas.deactivateAll().renderAll();
				currentEdit = null;

				if (FormatChangedBasket) {
					$("#myCanvasModal").css({opacity: 0});
					if (AnotherUpload) {
						myCanvasModal.modal({show: true, backdrop: false, keyboard: false});
					}
					else {
						myCanvasModal.modal({show: true, backdrop: 'static', keyboard: false});
						ShowFakeBackdrop();
					}
				}
				else {
					myCanvasModal.modal("show");
				}

				RenderCanvas(1500);

				if (AfterEditCanvasElements.length == 0) {
					SaveChanges = false;
					SaveCurrentElementsList();
				}

				if (FormatChanged) {
					CanvasModified();
				}
			});

			if (callback && typeof(callback) === "function") {
				callback();
			}
		});
	})
}

function HideEditor() {

	TextFreezed = false;
	TextEditMode = false;
	DisableTextActions();

	HideModal();
}

function HideModal(callback) {
	$("#ControlFixed").hide(0);
	myCanvasModal.modal("hide");
	SetTools("lock");

	if (callback && typeof(callback) === "function") {
		callback();
	}
}

//=================== text:changed ===================
function CanvasModified() {
	NewChanges = true;
}

function SaveCurrentElementsList(callback) {

	var imageId = 0;

	if (SaveChanges) {
		    removeAllOverlays();
	 	}

	var ObjectRemove = false;
	var BorderCanvasText = GetBorder();

	var canvasWidth = fbCanvas.width - (BorderRight + BorderLeft); //px
	var canvasHeight = fbCanvas.height - (BorderTop + BorderBottom); //px

	AfterEditCanvasElements = [];
	FormatChangeCanvasElements = [];

	fbCanvas.deactivateAll().renderAll();

	for (i = 0; i < fbCanvas.getObjects().length; i++) {

		var SaveObj = fbCanvas.getObjects()[i];

		if ((getStyle(SaveObj, 'showplaceholder')) != true) {

			imageId = 0;
			ObjectRemove = true;

			if (SaveObj.type == "image") {

				if (SaveObj.id === bgId || SaveObj.id === BorderId) {

					SaveObj.selectable = (SaveObj.id === bgId);

					SaveObj.set('Curr_top', SaveObj.top);
					SaveObj.set('Curr_left', SaveObj.left);
					SaveObj.set('Curr_scaleY', SaveObj.scaleY);
					SaveObj.set('Curr_width', SaveObj.width);
					SaveObj.set('Curr_height', SaveObj.height);
					SaveObj.set('Curr_scaleCanvas', $("#scaleCanvas").val());
					SaveObj.set('Curr_ColorType', $("#imageEffect").text());

					ObjectRemove = false;
				}
				else {
					if (SaveObj.id) {
						if (SaveObj.id.indexOf("MapImage") >= 0) {
							SaveObj.set('Curr_top', SaveObj.top);
							SaveObj.set('Curr_left', SaveObj.left);
							SaveObj.set('Curr_width', SaveObj.width);
							SaveObj.set('Curr_height', SaveObj.height);

							ObjectRemove = false;
						}
					}
				}
			}
			else if (SaveObj.type == "textbox" || SaveObj.type == "rect") {

				if (SaveObj.type == "textbox") {

					if (SaveChanges) {

				if (CheckProductTextOff()) {

					if (SaveObj.get('ImageId') > 0) {

						imageId = SaveObj.get('ImageId');
					}

					imageId = SaveLayerTextImage(SaveObj, imageId);
					SaveObj.set('ImageId', imageId);

					if (imageId > 0 && SaveObj)
					{
						SaveLayerTextDetails(imageId, SaveObj);
					}
				}
			}

					SaveObj.set('Curr_text', SaveObj.text);
					SaveObj._initDimensions();
					SaveObj.setCoords();
				}

				SaveObj.set('Curr_fontFamily', SaveObj.fontFamily);
				SaveObj.set('Curr_fontSize', SaveObj.get('Big_fontSize'));
				SaveObj.set('Curr_ScaleUp', GetScale("Up1"));
				SaveObj.set('Curr_ScaleDown', GetScale("Down"));
				SaveObj.set('Curr_fill', SaveObj.fill);
				SaveObj.set('Curr_backgroundColor', SaveObj.backgroundColor);
				SaveObj.set('Curr_fontWeight', SaveObj.fontWeight);
				SaveObj.set('Curr_fontStyle', SaveObj.fontStyle);
				SaveObj.set('Curr_textDecoration', SaveObj.textDecoration);
				SaveObj.set('Curr_top', SaveObj.top);
				SaveObj.set('Curr_left', SaveObj.left);
				SaveObj.set('Curr_scaleY', SaveObj.scaleY);
				SaveObj.set('Curr_scaleX', SaveObj.scaleX);
				SaveObj.set('Curr_width', SaveObj.width);
				SaveObj.set('Curr_height', SaveObj.height);
				SaveObj.set('Curr_topPerc', ((SaveObj.top - (SaveBorderTop > 0 ? SaveBorderTop : BorderTop)) / canvasHeight * 100));
				SaveObj.set('Curr_leftPerc', ((SaveObj.left - (SaveBorderLeft > 0 ? SaveBorderLeft : BorderLeft)) / canvasWidth * 100));

				if (SaveObj.getShadow()) {
					SaveObj.set('Curr_ShadowColor', SaveObj.getShadow().color);
					SaveObj.set('Curr_ShadowBlur', SaveObj.getShadow().blur);
					SaveObj.set('Curr_ShadowOffsetX', SaveObj.getShadow().offsetX);
					SaveObj.set('Curr_ShadowOffsetY', SaveObj.getShadow().offsetY);
				}

				ObjectRemove = false;
			}

			if (!ObjectRemove)
			{
				AfterEditCanvasElements.push(SaveObj);
			}
		}
	}

	arrayTextChanged = [];
	arrayTextRemoved = [];

	currentEdit = null;

	if (callback && typeof(callback) === "function") {
		callback();
	}
}

function RenderCanvas(WaitTime, callback) {

	var WaitTimeLocal = WaitTime || 1000;
	fbCanvas.deactivateAll().renderAll();

	setTimeout(function(){
		previewConfig.stopScale();
	}, WaitTimeLocal);

	if (callback && typeof(callback) === "function") {
		callback();
	}
}


function SetCanvasProportion(Sense, callback) {

	scale = GetScale(Sense);

	myCanvasWidth = fbCanvas.width;
	myCanvasHeight = fbCanvas.height;

	if (Sense == "Up") {

		fbCanvas.setHeight((myCanvasHeight * scale).toFixed());
		fbCanvas.setWidth((myCanvasWidth * scale).toFixed());

		fbCanvas.height = ((myCanvasHeight * scale).toFixed());
		fbCanvas.width = ((myCanvasWidth * scale).toFixed());
	}
	else {

		fbCanvas.setHeight(PreviewOriginalHeight);
		fbCanvas.setWidth(PreviewOriginalWidth);

		fbCanvas.height = PreviewOriginalHeight;
		fbCanvas.width = PreviewOriginalWidth;
	}

	fbCanvas.calcOffset();

	SetElementsProportion(Sense, scale, function() {

		if (Sense == "Up")
		{
			LoadCurrentElementsList();
		}

		fbCanvas.setZoom(1.0);

		if (callback && typeof(callback) === "function") {
			callback();
		}

	});
}

//====================================================================================
//================================ TEXT CANVAS =======================================
//====================================================================================

function EnableTextActions() {

	fbCanvas.deactivateAll().renderAll();
	currentEdit = null;

	fbCanvas.on({
		'mouse:dblclick' : MouseDoubleMouseClick,
		'mouse:up' : MouseUp,
		'mouse:down': MouseSingleClick,
		'mouse:out': MouseOut,
		'object:moving' : MovingElement,
		'object:modified' : clearFieldsChange,
		'text:changed' : textChanged,
		'after:render' : MoveBars,
		'text:selection:changed' : MoveBars,
		'object:added' : CheckColision
	});
}

function DisableTextActions() {

	fbCanvas.deactivateAll().renderAll();
	currentEdit = null;

	fbCanvas.off({
		'mouse:dblclick' : MouseDoubleMouseClick,
		'mouse:up' : MouseUp,
		'mouse:down': MouseSingleClick,
		'mouse:out': MouseOut,
		'object:moving' : MovingElement,
		'object:modified' : clearFieldsChange,
		'text:changed' : textChanged,
		'after:render' : MoveBars,
		'text:selection:changed' : MoveBars,
		'object:added' : CheckColision
	});
}

//=================== text:editing:entered ===================
function clearText(e) {

	if (TextEditMode && fbCanvas) {

		MoveBarsElements = $(".MoveBar");
		MoveBarsElements.show();
		MoveBarsElements.stop().animate({opacity: opacity_mid}, 150);
	}
}

function clearFieldsExit(e) {

	if (TextEditMode && fbCanvas) {

		obj = fbCanvas.getActiveObject();

		if (obj.get('showplaceholder') == true) {
			fbCanvas.remove(this);
			fbCanvas.renderAll();
		}

		MoveBarsElements = $(".MoveBar");
		MoveBarsElements.hide();
		MoveBarsElements.css({top: 0, left: 0});
	}
}

function CheckColision(options) {
	CheckColision(options, true)
}

function CheckColision(options, next) {

	if (CheckElementColision) {

		//reset line width and character's widths
		fabric.charWidthsCache[options.fontFamily]={};
		options.__lineWidths=[];
		options._charWidthsCache={};

		var BorderCanvasText = GetBorder();
		var SecureSpace = 10;

		options.target.setCoords();

		fbCanvas.forEachObject(function(objAdded) {

			if (objAdded != options.target && options.target.intersectsWithObject(objAdded) && options.target.type === "textbox" && objAdded.type === "textbox") {

				if ((objAdded.getBoundingRect().top + objAdded.getBoundingRectHeight() + SecureSpace) < (fbCanvas.height - BorderTop - options.target.height - SecureSpace)) {

					options.target.top = objAdded.getBoundingRect().top + objAdded.getBoundingRectHeight() + SecureSpace;
					options.target.setCoords();
					CheckColision(options, true);
				}
				else {

					if ((objAdded.getBoundingRect().left + objAdded.getBoundingRectWidth() + SecureSpace) < (fbCanvas.width - BorderLeft - options.target.width - SecureSpace)) {

						options.target.top = BorderTop + 50;
						options.target.left = objAdded.getBoundingRect().left + objAdded.getBoundingRectWidth() + SecureSpace;
						options.target.setCoords();
						CheckColision(options, true);
					}
					else {

						var maxTop = fbCanvas.height - 200;
						var maxLeft = (fbCanvas.width/2) - 300;

						options.target.top = (Math.floor((Math.random() * maxTop) + 100));
						options.target.left = (Math.floor((Math.random() * maxLeft) + 50));
						options.target.setCoords();
					}
				}
			}
		});
	}
}

function MoveBars(e) {

	topPos = $("#myCanvas").offset().top;
	leftPos = $("#myCanvas").offset().left;

	TopMoveBar = $("#TopMoveBar");
	BottomMoveBar = $("#BottomMoveBar");
	LeftMoveBar = $("#LeftMoveBar");
	RightMoveBar = $("#RightMoveBar");

	var lineStroke = 6;
	var padding = lineStroke - 2;

	if (fbCanvas.getActiveObject()) {

		obj = fbCanvas.getActiveObject();

		if (obj.type == "textbox") {

			TopMoveBar.css({
				left: obj.getBoundingRect().left + leftPos + lineStroke - 4,
				top: obj.getBoundingRect().top + topPos - padding,
				width: obj.getBoundingRectWidth(),
				height: lineStroke
			});

			RightMoveBar.css({
				left: (obj.getBoundingRect().left + obj.getBoundingRectWidth()) - lineStroke + leftPos + padding,
				top: obj.getBoundingRect().top + topPos - padding,
				width: lineStroke,
				height: obj.getBoundingRectHeight() + (lineStroke * 2) - 3
			});

			LeftMoveBar.css({
				left: obj.getBoundingRect().left + leftPos - padding,
				top: obj.getBoundingRect().top + topPos - padding,
				width: lineStroke,
				height: obj.getBoundingRectHeight() + (lineStroke * 2) - 3
			});

			BottomMoveBar.css({
				left: obj.getBoundingRect().left + leftPos + lineStroke - 4,
				top: (obj.getBoundingRect().top + obj.getBoundingRectHeight()) + topPos - 1,
				width: obj.getBoundingRectWidth(),
				height: lineStroke
			});
		}
	}
}

//=================== text:changed ===================
function textChanged(e)	{

	var obj = e.target;
	var ImageId = 0;

	if (TextEditMode && fbCanvas) {

		// Text now empty, show placeholder:
		if(ClearRichText(obj.getText()) === '') {

			obj.setText(TextDefault);
			obj.set('opacity', opacity_mid);
			obj.set('showplaceholder', true); // Set flag on IText object
			obj.setSelectionStart(0);
			obj.setSelectionEnd(0);
			obj.setCoords();
			fbCanvas.renderAll();
		}
		// Placeholder currently active:
		else if(obj.get('showplaceholder') === true) {

			// The text in the IText should now be the placeholder plus the character that  was pressed, so text and placeholder should be different, so remove the placeholder (unless the pressed key was backspace in which case do nothing):
			if(ClearRichText(e.target.text) != TextDefault && ClearRichText(e.target.text) != "")
			{
				// New char should be at position 0, so remove placeholder from rest of text:
				obj.setText(obj.getText().substr(0,1));
				obj.setSelectionStart(1);
				obj.setSelectionEnd(1);
				obj._updateTextarea();
				obj.set('opacity', 1);
				obj.set('showplaceholder', false); // Remove flag on IText object
				obj.setCoords();
				fbCanvas.renderAll();
			}
		}
		else {

			ReviewTextContent(obj);
			MovingElement();
		}

		fbCanvas.renderAll();
		CanvasModified();
		UpdateOverlay();
		GripFormatBar();
		MoveBars(e);
		MakeControlsVisible(false);
	}
}

//=================== object:modified ===================
function clearFieldsChange(e) {

	if (TextEditMode && fbCanvas) {

		if (e.target.type == "textbox" && !e.target.isEditing)
		{
			if (ClearRichText(e.target.text) === "") {
				removeSelected(false);
			}
		}

		UpdateOverlay();
		CanvasModified();
		fbCanvas.renderAll();
		MovingElement(e);
	}
}

//=================== object:moving ===================
function MovingElement(e) {

	if (fbCanvas) {

		if (fbCanvas.getActiveObject()){

			var objMove = fbCanvas.getActiveObject();

			if (objMove.type == "textbox") {

				var sizeAdjustWidth = false;
				var sizeAdjustHeight = false;
				var BorderCanvasText = GetBorder();

				var ObjPadding = objMove.padding;
				var MaxWidth = fbCanvas.width - (SaveBorderRight + SaveBorderLeft + 2) - (ObjPadding * 2);
				var MaxHeight = fbCanvas.height - (SaveBorderTop + SaveBorderBottom + 2) - (ObjPadding * 2);

				if(objMove.height > MaxHeight || objMove.width > MaxWidth) {

					if(objMove.getBoundingRectHeight() > MaxHeight) {

						objMove.setHeight(MaxHeight);
						objMove.top = SaveBorderTop;
						sizeAdjustHeight = true;
					}

					if(objMove.getBoundingRectWidth() > MaxWidth) {

						if (objMove.text.indexOf(" ") > -1) {
							objMove.setText(wrapText(objMove.text, MaxWidth, objMove.fontSize, objMove.fontFamily, ((getStyle(objMove, 'fontWeight') || '') == "bold"), ((getStyle(objMove, 'fontStyle') || '') == "italic")));
							objMove._initDimensions();
							objMove.setWidth(MaxWidth);
							objMove.left = SaveBorderLeft + ObjPadding;
							objMove.setCoords();
						}
						else
						{
							objMove.setWidth(MaxWidth);
							objMove.left = SaveBorderLeft + ObjPadding;
							objMove.setCoords();
						}

						try {
							fbCanvas.getActiveObject().hiddenTextarea.focus();
						}
						catch(err) {
						}

						sizeAdjustWidth = true;
					}

					if (sizeAdjustWidth || sizeAdjustHeight) {
						fbCanvas.renderAll();
						CanvasModified();
					}
				}

				objMove.setCoords();

				// top-left  corner
				if(objMove.getBoundingRect().top < SaveBorderTop || objMove.getBoundingRect().left < SaveBorderLeft){
					objMove.top = Math.max(objMove.top, (objMove.top - objMove.getBoundingRect().top) + SaveBorderTop);
					objMove.left = Math.max(objMove.left, (objMove.left - objMove.getBoundingRect().left) + SaveBorderLeft);
					CanvasModified();
				}

				// bot-right corner
                if(objMove.getBoundingRect().top + objMove.getBoundingRectHeight() >= fbCanvas.height - SaveBorderBottom || objMove.getBoundingRect().left + objMove.getBoundingRectWidth() >= fbCanvas.width - SaveBorderRight){
                    objMove.top = (sizeAdjustHeight ? SaveBorderBottom : Math.min(objMove.top, fbCanvas.height - SaveBorderBottom - objMove.getBoundingRect().height + (objMove.top - objMove.getBoundingRect().top)));
                    objMove.left = (sizeAdjustWidth ? SaveBorderRight : Math.min(objMove.left, fbCanvas.width - SaveBorderRight - objMove.getBoundingRect().width + (objMove.left - objMove.getBoundingRect().left)));
					CanvasModified();
				}

				fbCanvas.renderAll();

				GripFormatBar();
				MakeControlsVisible(false);
				objMove.setCoords();
			}

			if (objMove.type === 'image' && objMove.id === bgId) {
				SaveCanvasPositionZoom();
			}
		}
	}
}

//=============================== Arrays Globals =====================================

var FormatChangeCanvasElements = [];
var RestoreItemCanvasElements = [];
var AfterEditCanvasElements = [];

//=================== mouse:out ===================
function MouseOut(e) {
	//console.log("Mouse Out!");
}

//=================== mouse:down ===================
function MouseSingleClick(e) {

	if (!TextFreezed) {

		if (TextEditMode && fbCanvas) {

			if (fbCanvas.getActiveObject()) {

				obj = fbCanvas.getActiveObject();

				if (obj.type == "textbox") {

					if (fbCanvas.getActiveObject()) {

						if (currentEdit == null || currentEdit != obj)	{
							ShowFormatBar(e.offsetY, e.offsetX);
							fbCanvas.bringToFront(obj);
							currentEdit = obj;
							MovingElement();
						}
					}
					else if (fbCanvas.getActiveGroup()) {
						obj = fbCanvas.getActiveGroup();
						HideFormatBar();
						currentEdit = null;
					}
					else {
						currentEdit = null;
						HideFormatBar();
					}
				}
				else {
					currentEdit = null;
					HideFormatBar();
				}
			}
			else {
				currentEdit = null;
				HideFormatBar();
			}
		}
	}
}

//=================== mouse:dblclick ===================
function MouseUp(e) {

	if (TextEditMode && fbCanvas && fbCanvas.getActiveObject()) {

		obj = fbCanvas.getActiveObject();

		// If the placeholder is active, move the cursor to position 0 so we
		// can trim the string correctly when typing starts:

		if (obj.get('showplaceholder') == true && obj.isEditing)
		{
			// Move cursor to beginning of line:
			obj.setSelectionStart(0);
			obj.setSelectionEnd(0);
			fbCanvas.renderAll();
		}
	}
	try {
		fbCanvas.getActiveObject().hiddenTextarea.focus();
	}
	catch(err) {
	}
}

//=================== mouse:dblclick ===================
function MouseDoubleMouseClick(e) {

	if (!TextFreezed) {

		obj = e.e;

		if (TextEditMode && fbCanvas && obj) {

			if (obj.offsetX && obj.offsetY && (!fbCanvas.getActiveObject() || fbCanvas.getActiveObject().type != "textbox")) {

				addText(obj.offsetY - 18, obj.offsetX);
				HiddenPallettes();
				currentEdit = fbCanvas.getActiveObject();
			}
			else if (fbCanvas.getActiveObject() || fbCanvas.getActiveObject().type == "textbox")
			{
				if (!fbCanvas.getActiveObject().isEditing) {
					fbCanvas.getActiveObject().enterEditing();
				}

				fbCanvas.getActiveObject().hiddenTextarea.focus();
			}
		}
	}
}

function GetScale(Sense) {

	var scale = 1;

	Sense = Sense || "Up";

	TextCanvasHeight = ($(window).height() - offSetHeight);
	TextCanvasWidth = ($(window).width() - offSetWidth);

	var ShowHorizontal = TextCanvasWidth < TextCanvasHeight;

	if ($("#myCanvas").length && fbCanvas)
	{
		myCanvasHeight = fbCanvas.height;
		myCanvasWidth = fbCanvas.width;

		if (Sense == "Up")
		{
			PreviewOriginalWidth = fbCanvas.width;
			PreviewOriginalHeight = fbCanvas.height;

			scale = (ShowHorizontal ? TextCanvasWidth/myCanvasWidth : TextCanvasHeight/myCanvasHeight);
			ScaleUp = scale;
		}
		else if (Sense == "Down")
		{
			scale = (ShowHorizontal ? PreviewOriginalWidth/myCanvasWidth : PreviewOriginalHeight/myCanvasHeight);
			ScaleDown = scale;
		}
		else if (Sense == "Restore")
		{
			scale = (ShowHorizontal ? myCanvasWidth/TextCanvasWidth : myCanvasHeight/TextCanvasHeight);
			ScaleRestore = scale;
		}
	}

	return scale;
}

function SetElementsProportionRestoreTexts() {

	var BorderCanvasText = GetBorder();

	var canvasWidth = fbCanvas.width - (BorderRight + BorderLeft); //px
	var canvasHeight = fbCanvas.height - (BorderTop + BorderBottom); //px

	for (p = 0; p < fbCanvas.getObjects().length; p++) {

		var RestNewObj = fbCanvas.getObjects()[p];

		if (RestNewObj.type == "textbox") {

			scaleLoad = RestNewObj.get('Curr_ScaleDown');

			RestNewObj.fontSize = RestNewObj.get('Curr_fontSize') * scaleLoad;
			RestNewObj.left = RestNewObj.get('Curr_left') * scaleLoad;
			RestNewObj.top = RestNewObj.get('Curr_top') * scaleLoad;
			RestNewObj.width = RestNewObj.get('Curr_width') * scaleLoad;
			RestNewObj.height = RestNewObj.get('Curr_height') * scaleLoad;

			RestNewObj.set('Curr_topPerc', ((RestNewObj.top - (SaveBorderTop > 0 ? SaveBorderTop : BorderTop)) / canvasHeight * 100));
			RestNewObj.set('Curr_leftPerc', ((RestNewObj.left - (SaveBorderLeft > 0 ? SaveBorderLeft : BorderLeft)) / canvasWidth * 100));

			RestNewObj.perPixelTargetFind = true;
			RestNewObj.selectable = false;

			fbCanvas.setActiveObject(RestNewObj);
		}
	}

	fbCanvas.deactivateAll().renderAll();
	currentEdit = null;
}

function SetElementsProportion(Sense, scale, callback) {

	if (Sense == "Up") {

		fbCanvas.deactivateAll().renderAll();

		for (i = 0; i < fbCanvas.getObjects().length; i++) {

			var newObj = fbCanvas.getObjects()[i];

			newObj.top = (newObj.top * scale);
			newObj.left = (newObj.left * scale);
			newObj.fontSize = closest(newObj.get('Curr_fontSize'), fontSizeList);
			newObj.width = (newObj.width * scale);
			newObj.height = (newObj.height * scale);
			newObj.selectable = false;

			if (newObj.type == "image") {

				if (newObj.id === bgId) {

					newObj.selectable = true;

					if (newObj._originalElement.currentSrc || newObj._originalElement.src) {

						var currentImg = newObj._originalElement.currentSrc || newObj._originalElement.src;

						if (currentImg != "") {

							OriginalImageUrl = currentImg;

							var currentSize = getParameterByName("size",currentImg);
							var ObjWidth = newObj.width;
							var ObjHeight = newObj.height;

							var NewImg = currentImg.replace(currentSize, Math.min(ImageSizeLimite, (currentSize * scale).toFixed()));

							if ((currentSize * scale).toFixed() > ImageSizeLimite) {

								var imgLoad = new Image();
								imgLoad.newObj = newObj;
								imgLoad.src = NewImg;

								getWdrp(imgLoad);

								function getWdrp (imgLoad) {
									imgLoad.onload = function(imgObj) {

										var canvas = document.createElement('canvas');
										var context = canvas.getContext("2d");

										canvas.width = ObjWidth;
										canvas.height = ObjHeight;

										context.drawImage(imgLoad,0,0,ObjWidth,ObjHeight);

										this.newObj.setSrc(canvas.toDataURL(), function(){
											fbCanvas.renderAll();
										});
									}
								}
							}
							else {
								newObj.setSrc(NewImg, function(){
									fbCanvas.renderAll();
								});
							}
						}
					}

					if (typeof newObj.get('Curr_SmallMoved') != "undefined" && newObj.get('Curr_SmallMoved') == true) {

						newObj.set('Curr_top', newObj.get('Curr_top') * scale);
						newObj.set('Curr_left', newObj.get('Curr_left') * scale);
						newObj.set('Curr_SmallMoved', false);
						newObj.setCoords();
					}
				}
			}
			else if (newObj.type == "rect") {

				if (newObj.getShadow() && !newObj.get('Curr_ShadowColor')) {
					newObj.set('Curr_ShadowColor', newObj.getShadow().color);
					newObj.set('Curr_ShadowBlur', newObj.getShadow().blur);
					newObj.set('Curr_ShadowOffsetX', newObj.getShadow().offsetX);
					newObj.set('Curr_ShadowOffsetY', newObj.getShadow().offsetY);
				}

				if (newObj.get('Curr_ShadowColor')) {
					newObj.setShadow({
						color: newObj.get('Curr_ShadowColor'),
						blur: newObj.get('Curr_ShadowBlur') * scale,
						offsetX: newObj.get('Curr_ShadowOffsetX') * scale,
						offsetY: newObj.get('Curr_ShadowOffsetY') * scale,
					});
				}

			}
			else if (newObj.type == "textbox") {

				newObj._initDimensions();
				newObj.setCoords();
				newObj.perPixelTargetFind = false;
				newObj.selectable = true;
			}
		}
	}
	else if (Sense == "Down") {

		fbCanvas.deactivateAll().renderAll();

		for (i = 0; i < fbCanvas.getObjects().length; i++) {

			var newObj = fbCanvas.getObjects()[i];

			newObj.top = (newObj.top * scale);
			newObj.left = (newObj.left * scale);
			newObj.fontSize = (newObj.fontSize * scale);
			newObj.width = (newObj.width * scale);
			newObj.height = (newObj.height * scale);
			newObj.selectable = false;

			if (newObj.type == "image") {

				if (newObj.id === bgId) {

					newObj.selectable = true;

					if (OriginalImageUrl != "") {

						var NewImg = OriginalImageUrl;
						newObj.setSrc(NewImg, function(){
							fbCanvas.renderAll();
						});
					}

					if (newObj.get('Curr_ColorType') == "BLACK_AND_WHITE") {
						$('.BlackWhite-Button').trigger('click');
					} else {
						$('.Color-Button').trigger('click');
					}
				}
			}
			else if (newObj.type == "rect") {

				if (newObj.get('Curr_ShadowColor')) {
					newObj.setShadow({
						color: newObj.get('Curr_ShadowColor'),
						blur: newObj.get('Curr_ShadowBlur') * scale,
						offsetX: newObj.get('Curr_ShadowOffsetX') * scale,
						offsetY: newObj.get('Curr_ShadowOffsetY') * scale,
					});
				}

			}
			else if (newObj.type == "textbox") {

				newObj._initDimensions();
				newObj.setCoords();
				newObj.perPixelTargetFind = true;
			}
		}
	}

	currentEdit = null;

	if (callback && typeof(callback) === "function") {
		callback();
	}
}

// ********************************************************************************************
// ********************************************************************************************
// ****************************************              **************************************
// ****************************************    REVIEW    **************************************
// ****************************************              **************************************
// ********************************************************************************************
// ********************************************************************************************

String.prototype.replaceAll = String.prototype.replaceAll || function(needle, replacement) {
    return this.split(needle).join(replacement);
};

String.prototype.replaceLast = String.prototype.replaceLast || function(find, replace) {
	var index = this.lastIndexOf(find);

	if (index >= 0) {
		return this.substring(0, index) + replace + this.substring(index + find.length);
	}

	return this.toString();
};

function wrapText(text, maxWidth, fontSize, fontFace, bold, italic) {

	text = text.replaceAll(" ", " ");

	var FontStyle = "";

	var LineComplete = "";
	var c0 = document.createElement("canvas");
	var ctx = c0.getContext("2d");

	if (bold) {
		FontStyle = "bold " + FontStyle;
	}

	if (italic) {
		FontStyle = "italic " + FontStyle;
	}

	ctx.font = FontStyle + fontSize + "px " + fontFace;

    var line = '';
    var paragraphs = text.split('\n');
    for (var i = 0; i < paragraphs.length; i++)
    {
        var words = paragraphs[i].split(' ');
        for (var n = 0; n < words.length; n++)
        {
			var testLine = line + words[n] + ' ';
			var metrics = ctx.measureText(testLine);
			var testWidth = metrics.width;

			if (testWidth > maxWidth && n > 0) {
				LineComplete = LineComplete + line.trim() + "\n";
				line = words[n].trim() + ' ';
			}
			else
			{
				line = testLine;
			}
        }
		LineComplete = LineComplete + line.trim() + "\n";
        line = '';
    }

	if (LineComplete.slice(-2) == "\n") {
		LineComplete = LineComplete.substring(0, LineComplete.length - 1);
	}
	if (LineComplete.slice(-1) == "\n") {
		LineComplete = LineComplete.substring(0, LineComplete.length - 1);
	}
	else if (LineComplete.slice(-1) == " ") {
		LineComplete = LineComplete.substring(0, LineComplete.length - 1);
	}
	else if (LineComplete.slice(-1) == " ") {
		LineComplete = LineComplete.substring(0, LineComplete.length - 1);
	}

	return LineComplete;
}

function closest(num, arr) {
	var curr = arr[0];
	var diff = Math.abs (num - curr);
	for (var val = 0; val < arr.length; val++) {
		var newdiff = Math.abs (num - arr[val]);
		if (newdiff < diff) {
			diff = newdiff;
			curr = arr[val];
		}
	}
	return curr;
}

//=================== Clear Rich text ===================
function ClearRichText(Richtext)
{
	Richtext = Richtext.replace(/(\r?\n)/g, '')
	return Richtext;
}

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function LoadCurrentElementsList() {

	fbCanvas.deactivateAll().renderAll();
	if (AfterEditCanvasElements.length > 0)
	{
		fbCanvas.clear();
		fbCanvas.renderAll();

    for (k = 0; k <= TextLayerIndex; k++) {

      for (i = 0; i < AfterEditCanvasElements.length; i++) {

        RestoreObj = AfterEditCanvasElements[i];
        RestoreObj.selectable = false;

        if (RestoreObj.XZIndex === k) {

          if (RestoreObj.type == "textbox") {

            RestoreObj.set({
              text: RestoreObj.get('Curr_text'),
              fontFamily: RestoreObj.get('Curr_fontFamily'),
              fontSize: RestoreObj.get('Curr_fontSize'),
              fill: RestoreObj.get('Curr_fill'),
              fontWeight: RestoreObj.get('Curr_fontWeight'),
              fontStyle: RestoreObj.get('Curr_fontStyle'),
              textDecoration: RestoreObj.get('Curr_textDecoration'),
              top: RestoreObj.get('Curr_top'),
              left: RestoreObj.get('Curr_left'),
              width: RestoreObj.get('Curr_width'),
              height: RestoreObj.get('Curr_height')
            });

            RestoreObj.selectable = true;
            RestoreObj.setCoords();
            fbCanvas.insertAt(RestoreObj, 1);
          }
          else if (RestoreObj.type == "rect") {

            RestoreObj.set({
              text: RestoreObj.get('Curr_text'),
              fontFamily: RestoreObj.get('Curr_fontFamily'),
              fontSize: RestoreObj.get('Curr_fontSize'),
              fill: RestoreObj.get('Curr_fill'),
              fontWeight: RestoreObj.get('Curr_fontWeight'),
              fontStyle: RestoreObj.get('Curr_fontStyle'),
              textDecoration: RestoreObj.get('Curr_textDecoration'),
              top: RestoreObj.get('Curr_top'),
              left: RestoreObj.get('Curr_left'),
              width: RestoreObj.get('Curr_width'),
              height: RestoreObj.get('Curr_height')
            });

            if (RestoreObj.get('Curr_ShadowColor')) {
              RestoreObj.setShadow({
                color: RestoreObj.get('Curr_ShadowColor'),
                blur: RestoreObj.get('Curr_ShadowBlur'),
                offsetX: RestoreObj.get('Curr_ShadowOffsetX'),
                offsetY: RestoreObj.get('Curr_ShadowOffsetY'),
              });
            }

            RestoreObj.setCoords();
            fbCanvas.insertAt(RestoreObj, 2);
          }
          else if (RestoreObj.type == "image") {

            if (RestoreObj.id === bgId) {

              RestoreObj.selectable = true;

              $("#scaleCanvas").val(RestoreObj.get('Curr_scaleCanvas'));

              RestoreObj.set({
                top: RestoreObj.get('Curr_top'),
                width: RestoreObj.get('Curr_width'),
                height: RestoreObj.get('Curr_height'),
                left: RestoreObj.get('Curr_left'),
                scaleY: RestoreObj.get('Curr_scaleY')
              });

              RestoreObj.setCoords();
              fbCanvas.insertAt(RestoreObj, 0);

            }else  {
              if (RestoreObj.id) {
                if (RestoreObj.id.indexOf("MapImage") >= 0) {
                  RestoreObj.set({
                    top: RestoreObj.get('Curr_top'),
                    width: RestoreObj.get('Curr_width'),
                    height: RestoreObj.get('Curr_height'),
                    left: RestoreObj.get('Curr_left'),
                  });
                }
              }

              RestoreObj.setCoords();
              fbCanvas.insertAt(RestoreObj, 3);
            }
          }

          fbCanvas.bringToFront(RestoreObj);
        }
      }
    }

		fbCanvas.forEachObject(function(objLoad) {
			if (objLoad.type === 'image' && objLoad.id === PasseId) {
				fbCanvas.bringToFront(objLoad);
			}
		});
	}

	fbCanvas.deactivateAll().renderAll();
	currentEdit = null;
}

function GetBorder() {

	var Border = 0;
	var maxAttempt = 10;

	if (fbCanvas.getObjects().length > 0) {

		BorderTop = 0;
		BorderBottom = 0;
		BorderLeft = 0;
		BorderRight = 0;
		SaveBorderTop = 0;
		SaveBorderBottom = 0;
		SaveBorderLeft = 0;
		SaveBorderRight = 0;
		Border = 0;

		for (var n = 0; n < fbCanvas.getObjects().length; n++) {

			var RectObj = fbCanvas.getObjects()[n];

			if (RectObj.type === "rect") {

				if (RectObj.id === "BorderTop") {
					if (RectObj.height > BorderTop) {
						BorderTop = RectObj.height;
					}
				}
				else if (RectObj.id == "BorderBottom") {
					if (RectObj.height > BorderBottom) {
						BorderBottom = RectObj.height;
					}
				}
				else if (RectObj.id == "BorderLeft") {
					if (RectObj.width > BorderLeft) {
						BorderLeft = RectObj.width;
					}
				}
				else if (RectObj.id == "BorderRight") {
					if (RectObj.width > BorderRight) {
						BorderRight = RectObj.width;
					}
				}
				else if (RectObj.id === "SaveBorderTop") {
					if (RectObj.height > SaveBorderTop) {
						SaveBorderTop = RectObj.height;
					}
				}
				else if (RectObj.id == "SaveBorderBottom") {
					if (RectObj.height > SaveBorderBottom) {
						SaveBorderBottom = RectObj.height;
					}
				}
				else if (RectObj.id == "SaveBorderLeft") {
					if (RectObj.width > SaveBorderLeft) {
						SaveBorderLeft = RectObj.width;
					}
				}
				else if (RectObj.id == "SaveBorderRight") {
					if (RectObj.width > SaveBorderRight) {
						SaveBorderRight = RectObj.width;
					}
				}

				if (Border == 0) {
					if (RectObj.width == RectObj.height && RectObj.width > 0) {
						if (RectObj.width > Border) {
							Border = RectObj.width;
						}
					}
				}
			}
		}
	}

	if (SaveBorderTop == 0) {
		SaveBorderTop = BorderTop;
	}
	if (SaveBorderLeft == 0) {
		SaveBorderLeft = BorderLeft;
	}
	if (SaveBorderRight == 0) {
		SaveBorderRight = BorderRight;
	}
	if (SaveBorderBottom == 0) {
		SaveBorderBottom = BorderBottom;
	}

	if (Border == 0) {
		Border = $("input[id*='BorderCanvasText']").val();
	}

	attempted++;
	
	if (SaveBorderTop == 0 && BorderTop == 0 && SaveBorderLeft == 0 && BorderLeft == 0 && SaveBorderRight == 0 && BorderRight == 0 && SaveBorderBottom == 0 && BorderBottom == 0 && attempted < maxAttempt) {
		setTimeout(function(){
		  GetBorder()
		}, 500);
	}
	else {
		attempted = 0;
		return Border;
	}
}

function SaveCanvasPositionZoom() {

	fbCanvas.forEachObject(function(objMove) {

		if (objMove.type === 'image' && objMove.id === bgId) {

			if (!TextEditMode) {

				objMove.set('Curr_scaleCanvas', $("#scaleCanvas").val());
				objMove.set('Curr_scaleY', objMove.scaleY);
				objMove.set('Curr_top', objMove.top);
				objMove.set('Curr_left', objMove.left);
				objMove.set('Curr_SmallMoved', true);
			}
		}
	});
}

//=================== Canvas Text Style (Get) ===================
function getStyle(object, styleName) {
	if (TextEditMode && fbCanvas) {
		return (object.getSelectionStyles && object.isEditing && true == false) ? object.getSelectionStyles()[styleName] : object[styleName];
	}
}


//=================== Format Bar Functions (Hidden) ===================
function HideFormatBar() {
	if (TextEditMode && fbCanvas) {
		$("#controls-complete").hide();
		$("#controls-complete").css({top: 0, left: 0});
		fbCanvas.deactivateAll().renderAll();
		GripFormatBar();
	}
	HiddenPallettes();
}

//=================== Format Bar Functions (Show) ===================
function ShowFormatBar() {

	if (TextEditMode && fbCanvas) {

		if ($("#myCanvas").length) {

			topPos = $("#myCanvas").offset().top;
			leftPos = $("#myCanvas").offset().left;

			if (fbCanvas.getActiveObject() && fbCanvas.getActiveObject().type == "textbox") {

				obj = fbCanvas.getActiveObject();

				$("#ControlFixed").show(0);
				LoadCurrentStyles();
				HiddenPallettes();
				GripFormatBar();
				MakeControlsVisible(true);
			}
		}
	}
}

function GripFormatBar() {

	if (TextEditMode && fbCanvas) {

		var padding = 6;
		var NewPosition = false;
		barPosition = barPosition || "top";

		if ($("#myCanvas").length) {

			topPos = $("#myCanvas").offset().top;
			leftPos = $("#myCanvas").offset().left;
			controlHeight = $("#controls-complete").outerHeight();
			controlWidth = $("#controls-complete").outerWidth();

			if (fbCanvas.getActiveObject()) {

				obj = fbCanvas.getActiveObject();

				if (barPosition == "top") {

					if (obj.top > controlHeight + padding) {

						topPos += obj.top - (controlHeight + padding + 6);

						if (fbCanvas.width - (obj.left) > controlWidth + padding) {
							leftPos += obj.left - 6;
						}
						else {
							leftPos += fbCanvas.width - (controlWidth + padding);
						}

						NewPosition = true;
					}
					else {
						barPosition = "bottom";
					}
				}

				if (barPosition == "bottom") {

					if (fbCanvas.height - (obj.top + obj.height + padding) > controlHeight) {

						topPos += (obj.top + obj.height + padding - 1);

						if (fbCanvas.width - (obj.left) > controlWidth + padding) {
							leftPos += obj.left - 6;
						}
						else {
							leftPos += fbCanvas.width - (controlWidth + padding);
						}

						NewPosition = true;
					}
					else {
						barPosition = "top";
					}
				}

				if (NewPosition) {
					$("#controls-complete").stop().css({top: topPos, left: leftPos});
				}
			}
		}
	}
}

function HiddenPallettes() {
	$("#ColorTextPallete").hide();
	$("#ColorBackgroundPallete").hide();
	$("#TextAlignOption").hide();
}

//=================== text:changed ===================
function UpdateOverlay() {

	if (TextEditMode && fbCanvas) {

		if (fbCanvas.getActiveObject()) {

			obj = fbCanvas.getActiveObject();

			if (obj.type == "textbox") {

				if (obj.get('ImageId') > 0) {
					ImageId = obj.get('ImageId');
					arrayTextChanged.push(ImageId);
				}
			}
		}
	}
}

//=================== Add Texts on Canvas ===================
function addText(top, left, fontSize, fontName, content, color) {

	AlreadyExist = false;

	if (TextEditMode && fbCanvas && !TextFreezed) {

		var maxTop = fbCanvas.height - 200;
		var maxLeft = (fbCanvas.width/2) - 300;

		//LoadDefaultStyles();
		var BorderCanvasText = GetBorder();

		var Localtop = top || BorderTop + 100; //(Math.floor((Math.random() * maxTop) + 100));
		var Localleft = left || BorderLeft + 100; //(Math.floor((Math.random() * maxLeft) + 50));

		var LocalfontSize = fontSize || $("#font-size").val();
		var LocalfontName = fontName || $("#font-family").val();
		var Localcontent = content || TextDefault;
		var Localcolor = color || $('#font-color').val();

		var oText = new fabric.Textbox(Localcontent, {
			id: TextLayerId,
			XZIndex: TextLayerIndex,
			left: Localleft,
			top: Localtop,
			opacity: 0.7,
			editable: true,
			cursorWidth: 4,
			cornerStrokeColor: "#ffffff",
			hasControls: true,
			borderColor: "#000000",
			borderScaleFactor: 2,
			cursorColor: "#ffffff",
			cornerColor: "#000000",
			editingBorderColor: "#000000",
			cornerSize: 8,
			cornerStyle: "rect",
			transparentCorners: false,
			lockRotation: true,
			lockScalingY: true,
			vAlign: "middle",
			textAlign: "left",
			padding: 2,
			borderDashArray:[7,4],
			hasRotatingPoint: false,
			fill: Localcolor,
			backgroundColor: $("#background-Color").val(),
			fontFamily: LocalfontName,
			fontSize: LocalfontSize,
			cache: false,
			caching: false,
			centeredScaling: false,
			breakWords: false,
			lineHeight: 1,
			width: 211,
		}).on({
			'editing:entered' : clearText,
			'editing:exited' : clearFieldsExit
		});

		oText.set('Big_fontSize', LocalfontSize);

		//=================== Texts PlaceHolder ===================

		oText.set('showplaceholder', true); // Initially empty, so show placeholder

		CheckElementColision = true;
		fbCanvas.insertAt(oText, 1);
		CheckElementColision = false;

		oText.setCoords();

		if (top < 0 && left < 0)
		{
			fbCanvas.centerObject(oText);
		}

		fbCanvas.setActiveObject(oText);

		oText.enterEditing();
		oText.bringToFront();
		AdjustPadding(oText);

		fbCanvas.renderAll();

		currentEdit = fbCanvas.getActiveObject();
		ShowFormatBar();
	}
}

function AdjustPadding(obj) {

	var lines = 1;

	if (obj.text.indexOf('\n') >= 0) {
		lines = obj.text.split('\n').length;
	}

	var ObjHeightLine = obj.height/lines;

	obj.padding = ((ObjHeightLine/100) * PercFontIncrease(obj.fontFamily));
	obj.setSelectionEnd(obj.selectionStart);
	obj._initDimensions();
	obj.setCoords();
	MovingElement();
}

function PercFontIncrease(fontName) {

	var Perc = 0;

	if (fontName == "Gloria Hallelujah") {
		Perc = 30;
	} else if (fontName == "Loved by the king") {
		Perc = 25;
	} else if (fontName == "Yellowtail") {
		Perc = 10;
	} else if (fontName == "Satisfy") {
		Perc = 22;
	} else if (fontName == "Bangers") {
		Perc = 20;
	} else if (fontName == "Tahoma") {
		Perc = 10;
	} else if (fontName == "VT323") {
		Perc = 1;
	} else {
		Perc = 5;
	}

	return Perc;
}

function MakeControlsVisible(blink) {

	if ($("#controls-complete").length)
	{
		if (blink)
		{
			$("#controls-complete").css({opacity: 0});
		}
		$("#controls-complete").show();
		$("#controls-complete").stop().animate({opacity: opacity_mid}, 150);
	}
}

//=================== text:editing:exited ===================
function ReviewTextContent(obj) {

	if (obj) {

		var textOK = obj.get("text");

		textOK = textOK.replaceAll(" ", " ");
		textOK = textOK.replaceAll(String.fromCharCode(32), " ");

		//Removing Emojis
		textOK = textOK.replaceAll(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, '');

		obj.set("text", textOK);
		obj._initDimensions();
		obj.setCoords();
	}
}

//=================== Load Current/Selected Styles (Texts on Canvas) ===================
function LoadCurrentStyles() {

	if (TextEditMode && fbCanvas) {

		if (fbCanvas.getActiveObject()) {

			obj = fbCanvas.getActiveObject();
			currentEdit = obj;

			if ((getStyle(obj, 'fontFamily') || '') != "") {
				$("#font-family").val(getStyle(obj, 'fontFamily'));
			}

			if ((getStyle(obj, 'fontSize') || '') != "") {
				$("#font-size").val(closest(getStyle(obj, 'fontSize'), fontSizeList));
			}

			if ((getStyle(obj, 'fill') || '') != "") {
				$("#font-color").val(getStyle(obj, 'fill'));
				$("#TextColorIcon img").css("background-color", $("#font-color").val());
			}

			$("#background-Color").val(getStyle(obj, 'backgroundColor'));
			$("#BackgroundColorIcon img").css("background-color", $("#background-Color").val());

			if ((getStyle(obj, 'fontWeight') || '') == "bold")
				$("#bold").addClass("btn-active");
			else
				$("#bold").removeClass("btn-active");

			if ((getStyle(obj, 'fontStyle') || '') == "italic")
				$("#italic").addClass("btn-active");
			else
				$("#italic").removeClass("btn-active");

			if ((getStyle(obj, 'textDecoration') || '').indexOf('underline') > -1)
				$("#underline").addClass("btn-active");
			else
				$("#underline").removeClass("btn-active");

			if ((getStyle(obj, 'textAlign') || '') == "left") {
				$("#TextLeftIcon").addClass("btn-active");
				setAsSelected($("#TextLeftIcon"));
			} else {
				$("#TextLeftIcon").removeClass("btn-active");
			}

			if ((getStyle(obj, 'textAlign') || '') == "center") {
				$("#TextCenterIcon").addClass("btn-active");
				setAsSelected($("#TextCenterIcon"));
			} else {
				$("#TextCenterIcon").removeClass("btn-active");
			}

			if ((getStyle(obj, 'textAlign') || '') == "right") {
				$("#TextRightIcon").addClass("btn-active");
				setAsSelected($("#TextRightIcon"));
			} else {
				$("#TextRightIcon").removeClass("btn-active");
			}

		}
	}
}

function setAsSelected(NewSelection) {
	if ($("#TextPos1").find("img").attr("id") != NewSelection.attr("id")) {
		$("#TextPos1").find("img").detach().appendTo(NewSelection.parent());
		NewSelection.detach().appendTo($("#TextPos1"));
	}
}

function SaveAndClose() {
	HideFakeModal(function () {
		SaveChanges = true;
		HideEditor();
	});
}

function CloseWithoutSave() {
	$("#NotsafeDialogCanvas").trigger("click");
}

function ConfirmSaveonClose(callback) {
	if (NewChanges) {
		HideFormatBar();
		currentEdit = null;
		ModalSaveCanges = $("#ModalSaveCanges");
		ModalSaveCanges.modal("show");
	}
	else {
		SaveChanges = true;
		HideEditor();
	}

	if (callback && typeof(callback) === "function") {
		callback();
		hideToast(500);
	}
}

function NoConfirmClose() {
		SaveChanges = false;
		HideEditor();
}


//=================== Format Bar Buttons Handlers Functions ===================

function HideFakeModal(callback) {

	if (!AnotherUpload) {
		showToast('Uppdaterar vy...');
	}

	$("#modal-dialog-save").hide("fast", function() {
		$("#modal-dialog-canvas").hide("fast", function() {

			var isFirefox = typeof InstallTrigger !== 'undefined';

			if (isFirefox) {
				ShowFakeBackdrop();
			}

			if (callback && typeof(callback) === "function") {
				callback();
				hideToast(500);
			}
		})
	})
}

function LoadControls() {
	//=================== Font Checks ===================
	$("#font-family option").each(function(){
		$(this).css("font-family",$(this).val());
	});

	$("body").mousedown(function(event){
		var hasParent = false;
		var CanvasOrBar = false;
		if (TextEditMode) {
			try {
				for(var node = event.target; node != document.body; node = node.parentNode) {
					if (node) {
						if(node.id == 'modal-dialog-canvas' || node.id == 'ControlFixed') {
							hasParent = true;
							break;
						}
					}
				}
				if(!hasParent && TextEditMode && $("#modal-dialog-canvas").is(":visible") && !$("#modal-dialog-save").is(":visible") && !$("#modal-dialog-text").is(":visible")) {
					if (fbCanvas.getActiveObject()) {
						currObj = fbCanvas.getActiveObject();
						if (currObj.isEditing) {
							currObj.exitEditing();
						}
					}

					ConfirmSaveonClose();
				}
			}
			catch(err) {
			}

			try {
				for(var node = event.target; node != document.body; node = node.parentNode) {
					if (node) {
						if(node.id == 'myCanvasEdit' || node.id == 'ControlFixed') {
							CanvasOrBar = true;
							break;
						}
					}
				}
				if(!CanvasOrBar) {
					if (!$("#modal-dialog-text").is(":visible")) {
						if (fbCanvas.getActiveObject()) {
							fbCanvas.deactivateAll().renderAll();
							currentEdit = null;
							HideFormatBar();
						}
					}
				}
			}
			catch(err) {
			}
		}
	});

	$("#BackgroundColorIcon").unbind();
	$("#BackgroundColorIcon").on('click', function() {
		if ($("#ColorBackgroundPallete").is(":visible")) {
			$("#ColorBackgroundPallete").hide();
		}
		else {
			if ($("#ColorTextPallete").is(":visible")) {
				$("#ColorTextPallete").hide();
			}
			$("#ColorBackgroundPallete").effect("slide", 100, function () {
				GripFormatBar();
			});
		}
	});

	$("#TextColorIcon").unbind();
	$("#TextColorIcon").on('click', function() {
		if ($("#ColorTextPallete").is(":visible")) {
			$("#ColorTextPallete").hide();
		}
		else {
			if ($("#ColorBackgroundPallete").is(":visible")) {
				$("#ColorBackgroundPallete").hide();
			}
			$("#ColorTextPallete").effect("slide", 100, function () {
				GripFormatBar();
			});
		}
	});

	$("#CancelDialogText").unbind();
	$("#CancelDialogText").on('click', function() {
		ModalTextRemoveConfirm = $("#ModalTextRemoveConfirm");
		ModalTextRemoveConfirm.modal("hide");
	});

	$("#SaveDialogText").unbind();
	$("#SaveDialogText").on('click', function() {
		removeSelectedConfirmed();
		ModalTextRemoveConfirm = $("#ModalTextRemoveConfirm");
		ModalTextRemoveConfirm.modal("hide");
	});


	$("#CloseCanvasChange").unbind();
	$("#CloseCanvasChange").on('click', function() {
		ConfirmSaveonClose();
	});

	$("#NotsafeDialogCanvas_Modal").unbind();
	$("#NotsafeDialogCanvas_Modal").on('click', function() {
		$("#NotsafeDialogCanvas").trigger("click");
	});

	$("#CancelDialogCanvas").unbind();
	$("#CancelDialogCanvas").on('click', function() {
		ModalSaveCanges = $("#ModalSaveCanges");
		ModalSaveCanges.modal("hide");
	});

	$("#NotsafeDialogCanvas").unbind();
	$("#NotsafeDialogCanvas").on('click', function() {
		HideFakeModal(function () {
			SaveChanges = false;
			HideEditor();
			ModalSaveCanges = $("#ModalSaveCanges");
			ModalSaveCanges.modal("hide");
		});
	});

	$("#SaveCanvasChange").unbind();
	$("#SaveCanvasChange").on('click', function() {
		SaveChanges = true;
		HideEditor();
	});

	$("#SaveDialogCanvas_Modal").unbind();
	$("#SaveDialogCanvas_Modal").on('click', function() {
		$("#SaveDialogCanvas").trigger("click");
	});

	$("#SaveDialogCanvas").unbind();
	$("#SaveDialogCanvas").on('click', function() {
		HideFakeModal(function () {
			SaveChanges = true;
			HideEditor();
			ModalSaveCanges = $("#ModalSaveCanges");
			ModalSaveCanges.modal("hide");
		});
	});

	$("#TitleTypeText").unbind();
	$("#TitleTypeText").on('click', function() {
		if (!$(this).hasClass("TypeActive")) {
			if (CheckProductTextOff()) {
				SetTools("text");
			}
		}
	});

	$("#TitleTypeImage").unbind();
	$("#TitleTypeImage").on('click', function() {
		if (!$(this).hasClass("TypeActive")) {
			SetTools("image");
		}
	});

	$("#TitleTypeLock").unbind();
	$("#TitleTypeLock").on('click', function() {
		if (!$(this).hasClass("TypeActive")) {
			SetTools("lock");
		}
	});

	addHandler('underline', function(obj) {
	  var isUnderline = (getStyle(obj, 'textDecoration') || '').indexOf('underline') > -1;
	  setStyle('textDecoration', isUnderline ? '' : 'underline');
	});

	addHandler('bold', function(obj) {
		var isBold = getStyle(obj, 'fontWeight') === 'bold';
		setStyle('fontWeight', isBold ? '' : 'bold');
	});

	addHandler('italic', function(obj) {
		var isItalic = getStyle(obj, 'fontStyle') === 'italic';
		setStyle('fontStyle', isItalic ? '' : 'italic');
	});

	addHandler('underline', function(obj) {
		var isUnderline = (getStyle(obj, 'textDecoration') || '').indexOf('underline') > -1;
		setStyle('textDecoration', isUnderline ? '' : 'underline');
	});

	addHandler('TextLeftIcon', function(obj) {
		alignOption = $("#TextAlignOption");
		if (alignOption.is(":visible")) {
			setAsSelected($("#TextLeftIcon"));
			setStyle('textAlign', 'left');
			alignOption.hide();
		}
		else {
			alignOption.show();
		}
	});

	addHandler('TextCenterIcon', function(obj) {
		alignOption = $("#TextAlignOption");
		if (alignOption.is(":visible")) {
			setAsSelected($("#TextCenterIcon"));
			setStyle('textAlign', 'center');
			alignOption.hide();
		}
		else {
			alignOption.show();
		}
	});

	addHandler('TextRightIcon', function(obj) {
		alignOption = $("#TextAlignOption");
		if (alignOption.is(":visible")) {
			setAsSelected($("#TextRightIcon"));
			setStyle('textAlign', 'right');
			alignOption.hide();
		}
		else {
			alignOption.show();
		}
	});

	addHandler('remove-text', function(obj) {
		removeSelected(true);
	});

	addHandler('add-text', function(obj) {
		addText();
	});

	addHandler('add-text-label', function(obj) {
		addText();
	});

	addHandler('background-Color', function(obj) {
		setStyle('backgroundColor', this.value);
	}, 'onchange');

	addHandler('font-family', function(obj) {
		setStyle('fontFamily', this.value);
	}, 'onchange');

	addHandler('font-size', function(obj) {
		setStyle('fontSize', this.value);
		setStyle('Big_fontSize', this.value);
		obj.setWidth(obj.dynamicMinWidth);
	}, 'onchange');

	addHandler('font-color', function(obj) {
		setStyle('fill', this.value);
	}, 'onchange');
}

$(document).ready(function () {

	RefreshControlsModal();
	LoadControls();

});

//=================== Format Bar Buttons Handlers ===================
function addHandler(id, fn, eventName) {
	try {
		document.getElementById(id)[eventName || 'onclick'] = function() {
			var el = this;
			if (id == "add-text" || id == "add-text-label") {
				fn.call(el);
			}
			else {
				if (obj = fbCanvas.getActiveObject()) {
					fn.call(el, obj);
					fbCanvas.renderAll();
				}
			}
		};
	}
	catch(err) {
		console.log(err + " - element: " + id)
	}
}


function SaveLayerTextImage(obj, imageId) {

	LocalDPItoSave = DPItoSave;

	var formatWidth_MM = parseInt($("#CanvasFormatWidth").text()); //px
	var formatHeight_MM = parseInt($("#CanvasFormatHeight").text()); //px

	if (Math.max(formatWidth_MM, formatHeight_MM) < SmallerSizes) {
		LocalDPItoSave = DPItoSaveSmallerSizes;
	}

	var BorderCanvasText = GetBorder();
	var formatWidth = mm2pxDPI(formatWidth_MM, LocalDPItoSave); //px
	var canvasWidth = fbCanvas.width - (BorderLeft + BorderRight); //px
	var scale = formatWidth/canvasWidth;

    var ObjOriginalWidth = obj.width;
    var ObjOriginalHeight = obj.height;
    var ObjOriginalFontsize = obj.fontSize;
	var ObjOriginalPadding = obj.padding;

    obj.set({
        width: obj.width * scale,
        height: obj.height * scale,
        fontSize: obj.fontSize * scale,
		padding: obj.padding * scale
    });

	obj._initDimensions();
	obj.setCoords();
    fbCanvas.renderAll();

	var imageIdLocal = imageId || 0;
	var UrlToSave = obj.toDataURL({format: 'png'});
	var blobBin = atob(UrlToSave.split(',')[1]);
	var array = [];

	for (var i = 0; i < blobBin.length; i++) {
		array.push(blobBin.charCodeAt(i));
	}

	var afile = new Blob([new Uint8Array(array)], {
		type : 'image/png'
	});

	afile.lastModifiedDate = new Date();
	afile.name = "overlay_" + imageId + ".png";

	var formData = new FormData();
	// Main magic with files here
	formData.append('imageData', afile);
	formData.append('imageId', imageIdLocal);

	$.ajax({
		url: 'externalAPI?action=uploadOverlayImage&json',
		data: formData,
		async: false,
		type: 'POST',

		// THIS MUST BE DONE FOR FILE UPLOADING
		contentType : false,
		processData : false,
		success : function(data) {
			imageId = JSON.parse(data).imageId;
		},
		error : function(data) {
			console.log(data);
		},
		complete: function(data) {

			obj.set({
                fontSize: ObjOriginalFontsize,
                width: ObjOriginalWidth,
                height: ObjOriginalHeight,
				padding: ObjOriginalPadding,
            });

            obj._initDimensions();
            obj.setCoords();
            fbCanvas.renderAll();
		}
	})



	return imageId;
}

function px2mm(px) {

	var mm = 0;
	mm = px / cm_pixel;
	mm = mm * 10;
	return mm;

}

function mm2px(mm) {

	var px = 0;
	px = mm * cm_pixel;
	px = px / 10;
	return px;

}

function px2mmDPI(px, dpi) {

	var localDPI = dpi || 72;
	var localPX = px || 0;

	var mm = localPX;
	mm = mm / localDPI;
	mm = mm * 2.5;
	return mm;

}

function mm2pxDPI(mm, dpi) {

	var localDPI = dpi || 72;
	var localMM = mm || 0;

	var px = localMM;
	px = px / 10;
	px = px * localDPI;
	px = px / 2.5;
	return px;

}

function SaveLayerTextDetails(imageId, obj) {

	if (imageId > 0) {

		var BorderCanvasText = GetBorder();

		var formatWidth = mm2px(parseInt($("#CanvasFormatWidth").text())); //px
		var canvasWidth = fbCanvas.width - (BorderLeft + BorderRight); //px
		var scale = formatWidth/canvasWidth;

		var ObjWidth = obj.width;
		ObjWidth = ObjWidth * scale;
		ObjWidth = px2mm(ObjWidth);

		var ObjLeft = obj.left;
		ObjLeft = ObjLeft - BorderLeft;
		ObjLeft = ObjLeft * scale;
		ObjLeft = px2mm(ObjLeft);

		var ObjTop = obj.top;
		ObjTop = ObjTop - BorderTop;
		ObjTop = ObjTop * scale;
		ObjTop = px2mm(ObjTop);

		saveOverlay([
			{name: 'imageId', value: imageId},
			{name: 'x', value: ObjLeft > 0 ? ObjLeft : 0},
			{name: 'y', value: ObjTop > 0 ? ObjTop : 0},
			{name: 'width', value: ObjWidth},
			{name: 'content', value: obj.text},
			{name: 'fontName', value: obj.fontFamily},
			{name: 'fontSize', value: obj.fontSize},
			{name: 'backgroundColor', value: obj.backgroundColor},
			{name: 'textAlign', value: obj.textAlign},
			{name: 'fontWeight', value: obj.fontWeight},
			{name: 'fontStyle', value: obj.fontStyle},
			{name: 'textDecoration', value: obj.textDecoration},
			{name: 'color', value: obj.fill}
		]);
	}
}

function BackRestoreTexts(imageId, left, top, fontSize, fontName, text, color, width, backgroundColor, textAlign, fontWeight, fontStyle, textDecoration) {

	var ScaleUp = GetScale("Up");
	var BorderCanvasText = GetBorder();
	var ScaleLocal = (ScaleUp || 1);
	var ProductNoBorder = false;

	var BorderTopLocal = BorderTop * ScaleLocal;
	var BorderBottomLocal = BorderBottom * ScaleLocal;
	var BorderLeftLocal = BorderLeft * ScaleLocal;
	var BorderRightLocal = BorderRight * ScaleLocal;

	var formatWidth = mm2px(parseInt($("#CanvasFormatWidth").text())); //px
	var formatHeight = mm2px(parseInt($("#CanvasFormatHeight").text())); //px

	var scale = GetScale("Restore");

	var TextCanvasHeight = ($(window).height() - offSetHeight);
	var TextCanvasWidth = ($(window).width() - offSetWidth);

	var canvasWidth = TextCanvasWidth - (BorderLeftLocal + BorderRightLocal); //px
	var canvasHeight = TextCanvasHeight - (BorderTopLocal + BorderBottomLocal); //px

	var ShowHorizontal = TextCanvasWidth < TextCanvasHeight;
	var scaleLoad = (ShowHorizontal ? canvasWidth/formatWidth : canvasHeight/formatHeight); //decimal

	var ObjLeft = mm2px(left * scaleLoad) + BorderLeftLocal;
	var ObjTop = mm2px(top * scaleLoad) + BorderTopLocal;

	var ObjWidth = mm2px(width * scaleLoad);

	ObjLeft = (ObjLeft < Math.ceil(BorderLeftLocal) ? Math.ceil(BorderLeftLocal) : ObjLeft);
	ObjTop = (ObjTop < Math.ceil(BorderTopLocal) ? Math.ceil(BorderTopLocal) : ObjTop);

	var oText = new fabric.Textbox(text, {
		id: TextLayerId,
		XZIndex: TextLayerIndex,
		left: ObjLeft,
		top: ObjTop,
		width: ObjWidth,
		opacity: 0.7,
		editable: true,
		cursorWidth: 4,
		cornerStrokeColor: "#ffffff",
		hasControls: true,
		borderColor: "#000000",
		borderScaleFactor: 2,
		cursorColor: "#ffffff",
		cornerColor: "#000000",
		editingBorderColor: "#000000",
		cornerSize: 8,
		cornerStyle: "rect",
		transparentCorners: false,
		lockRotation: true,
		lockScalingY: true,
		textDecoration: textDecoration,
		vAlign: "middle",
		textAlign: textAlign,
		fontWeight: fontWeight,
		fontStyle: fontStyle,
		padding: 2,
		borderDashArray:[7,4],
		hasRotatingPoint: false,
		fill: color,
		backgroundColor: backgroundColor,
		fontFamily: fontName,
		fontSize: fontSize,
		cache: false,
		caching: false,
		centeredScaling: false,
		breakWords: false,
		lineHeight: 1,
	}).on({
		'editing:entered' : clearText,
		'editing:exited' : clearFieldsExit
	});

	oText.set('Big_fontSize', fontSize);
	oText.set('ImageId', imageId); // Initially ImageId
	oText.set('showplaceholder', false); // Initially empty, so show placeholder
	oText.set('opacity', 1);

	oText.set('Curr_text', oText.text);
	oText.set('Curr_fontFamily', oText.fontFamily);
	oText.set('Curr_fontSize', fontSize);
	oText.set('Curr_fill', oText.fill);
	oText.set('Curr_fontWeight', oText.fontWeight);
	oText.set('Curr_fontStyle', oText.fontStyle);
	oText.set('Curr_textDecoration', oText.textDecoration);
	oText.set('Curr_width', oText.width);
	oText.set('Curr_height', oText.height);
	oText.set('Curr_top', oText.top);
	oText.set('Curr_left', oText.left);
	oText.set('Curr_ScaleDown', scale);
	oText.set('Curr_topPerc', ((oText.top - (SaveBorderTop > 0 ? SaveBorderTop : BorderTopLocal)) / canvasHeight * 100));
	oText.set('Curr_leftPerc', ((oText.left - (SaveBorderLeft > 0 ? SaveBorderLeft : BorderLeftLocal)) / canvasWidth * 100));

	AdjustPadding(oText);

	oText._updateTextarea();
	oText.setCoords();

	RestoreItemCanvasElements.push(oText);
}

function LoadCurrentRestoreTexts(callback) {

	var BorderCanvasText = GetBorder();

	if (FormatChangeCanvasElements.length == 0) {

		FormatChangeCanvasElements = AfterEditCanvasElements;

		if (FormatChangeCanvasElements == 0)
		{
			FormatChangeCanvasElements = RestoreItemCanvasElements;
		}
	}

	if (FormatChangeCanvasElements.length > 0) {

		for (c = 0; c < FormatChangeCanvasElements.length; c++) {

			var RestoreObj = FormatChangeCanvasElements[c];

			if (RestoreObj.type == "textbox") {

				RestoreObj.set({
					text: RestoreObj.get('Curr_text'),
					fontFamily: RestoreObj.get('Curr_fontFamily'),
					fontSize: RestoreObj.get('Curr_fontSize'),
					fill: RestoreObj.get('Curr_fill'),
					fontWeight: RestoreObj.get('Curr_fontWeight'),
					fontStyle: RestoreObj.get('Curr_fontStyle'),
					width: RestoreObj.get('Curr_width'),
					height: RestoreObj.get('Curr_height'),
					textDecoration: RestoreObj.get('Curr_textDecoration'),
					top: (parseInt(((fbCanvas.height - (BorderTop + BorderBottom)) / 100 * RestoreObj.get('Curr_topPerc')) + BorderTop)),
					left: (parseInt(((fbCanvas.width - (BorderLeft + BorderRight)) / 100 * RestoreObj.get('Curr_leftPerc')) + BorderLeft)),
				});

				RestoreObj.set('Curr_ScaleDown', GetScale("Restore"));
				RestoreObj.selectable = false;

				fbCanvas.insertAt(RestoreObj, 1);
			}
		}
	}

	fbCanvas.deactivateAll().renderAll();
	AfterEditCanvasElements = [];
	currentEdit = null;

	if (callback && typeof(callback) === "function") {
		callback();
	}
}

function RestoreCurrentElements(callback) {

	arrayTextChanged = [];
	arrayTextRemoved = [];

	LoadCurrentElementsList();

	if (callback && typeof(callback) === "function") {
		callback();
	}
}


//============ Make the Move Icon Draggable (Initial Functions) ============

function StartDragBar() {

	if (fbCanvas.getActiveObject()) {

		obj = fbCanvas.getActiveObject();

		if (obj.isEditing) {
			obj.set('cursorWidth', 0);
			obj.setSelectionEnd(obj.selectionStart);
			fbCanvas.renderAll();
		}
	}
}

function DraggingBar(offset, position) {

	if ($("#myCanvas").length) {

		topPos = $("#myCanvas").offset().top;
		leftPos = $("#myCanvas").offset().left;

		var xPos = offset.left;
		var yPos = offset.top;
		var paddingTop = 6;
		var paddingLeft = 6;

		if (fbCanvas.getActiveObject()) {

			obj = fbCanvas.getActiveObject();

			xPos = xPos + obj.padding;
			yPos = yPos + obj.padding;

			if (position == "top") {
				obj.setLeft(xPos-leftPos-2);
				obj.setTop(yPos-topPos+paddingTop-2);
			}
			else if (position == "left") {
				obj.setLeft(xPos-leftPos+paddingLeft-2);
				obj.setTop(yPos-topPos+paddingTop-2);
			}
			else if (position == "right") {
				obj.setLeft(xPos-leftPos-obj.getBoundingRectWidth()+paddingLeft-4);
				obj.setTop(yPos-topPos+paddingTop-2);
			}
			else if (position == "bottom") {
				obj.setLeft(xPos-leftPos-2);
				obj.setTop(yPos-topPos-obj.getBoundingRectHeight()+paddingTop-5);
			}

			fbCanvas.renderAll();
			GripFormatBar();
			MovingElement();
		}
	}
}

function StopDragBar() {

	if (fbCanvas.getActiveObject()) {

		obj = fbCanvas.getActiveObject();

		if (obj.isEditing) {

			fbCanvas.setActiveObject(obj);
			obj.set('cursorWidth', 4);
			obj.hiddenTextarea.focus();
			fbCanvas.renderAll();
		}

		MoveBars();
	}
}

function SetTextColor(color) {
	$("#font-color").val(color).change();
}

function SetBackgroundColor(color) {
	$("#background-Color").val(color).change();
}


function CheckProductTextOff() {

	var Check = true;
	var ProductId = 0;

	if ($("input[id*='product']").length) {

		ProductId = parseInt($("input[id*='product']").val());

		if (ProductId > 0) {
			Check = (ProductsTextOff.indexOf(ProductId) < 0);
		}
	}

	return Check;
}

function RefreshFormatChangeFrame() {
	var ProductId = 0;

	if ($("input[id*='product']").length) {
		ProductId = parseInt($("input[id*='product']").val());
	}

	if (ProductId == 496) {
		RefreshFormatChange();
	}
}

function RefreshFormatChange() {

	if (CheckProductTextOff()) {

		if ($("#ProductIdLabelInitial").text() == $("#ProductIdLabel").text() && $("#CanvasFormatWidthInitial").text() == $("#CanvasFormatWidth").text() && $("#CanvasFormatHeightInitial").text() == $("#CanvasFormatHeight").text() && $("#CanvasbackMaterialIdInitial").text() == $("#CanvasbackMaterialId").text() && ReturnTypeEffect($("#CanvasborderEffectInitial").text()) == ReturnTypeEffect($("#CanvasborderEffect").text())) {
			FormatChanged = false;
		}
		else
		{
			if (FormatChangeCanvasElements.length > 0) {
				for (i = 0; i < FormatChangeCanvasElements.length && !FormatChanged; i++) {
					RestoreObj = FormatChangeCanvasElements[i];
					if (RestoreObj.type == "textbox") {
						FormatChanged = true;
					}
				}
			}

			if (AfterEditCanvasElements.length > 0) {
				for (k = 0; k < AfterEditCanvasElements.length && !FormatChanged; k++) {
					RestoreObj = AfterEditCanvasElements[k];
					if (RestoreObj.type == "textbox") {
						FormatChanged = true;
					}
				}
			}
		}

		if (!FormatChanged) {
			AlignCurrentChanges();
		}

		setTimeout(function(){
			LoadCurrentFormatChange(function () {
				SetElementsProportionFormatChange();
			});
		}, 200);
	}
}

//=================== Mouse Leave (Canvas) ===================
$("#controls-complete").mouseleave(function() {
	if (TextEditMode && fbCanvas) {
		setTimeout(function(){
			$("#controls-complete").stop().animate({opacity: opacity_mid}, 200);
		}, 300);
	}
});

//=================== Mouse Enter (Canvas) ===================
$("#controls-complete").mouseenter(function() {
	if (TextEditMode && fbCanvas) {
		if ($("#controls-complete").is(":visible")) {
			$(this).stop().animate({opacity: 1}, 100);
		}
	}
});

//=================== Mouse Over (Canvas) ===================
$("#controls-complete").mouseover(function() {
	if (TextEditMode && fbCanvas) {
		if ($("#controls-complete").is(":visible")) {
			$(this).stop().animate({opacity: 1}, 100);
		}
	}
});

//=================== Load Default Styles (Texts on Canvas) ===================
function LoadDefaultStyles() {

	if (TextEditMode && fbCanvas) {

		var TextColor = "#ffffff";
		var BgColor = "";

		$("#font-family").val("Arial");
		$("#font-size").val("36");
		$('#ColorSelector-Fill div').css('backgroundColor', TextColor);
		$('#Fill-Color').val(TextColor);
		$('#font-color').val(TextColor);

		$('#Background-Color').val(BgColor);

		$("#bold").removeClass("btn-active");
		$("#italic").removeClass("btn-active");
		$("#underline").removeClass("btn-active");
	}
}

//=================== Canvas Text Style (Set) ===================
function setStyle(styleName, value) {
	if (TextEditMode && fbCanvas) {
		var activeObject = fbCanvas.getActiveObject(), activeGroup = fbCanvas.getActiveGroup();
		if (activeGroup) {
			var objectsInGroup = activeGroup.getObjects();
			fbCanvas.discardActiveGroup();
			objectsInGroup.forEach(function(object) {
				setStyleApply(object, styleName, value);
			});
		}
		else if (activeObject) {
			setStyleApply(activeObject, styleName, value);
		}
	}
}

//=================== Canvas Text Style (Apply) ===================
function setStyleApply(ObjectApply, styleName, value) {

	if (TextEditMode && fbCanvas) {

		if (ObjectApply.setSelectionStyles && ObjectApply.isEditing && false == true) {
			var style = { };
			style[styleName] = value;
			ObjectApply.setSelectionStyles(style);
		}
		else {

			if (styleName == "fill") {
				ObjectApply.setFill(value);
			}
			else if (styleName == "backgroundColor") {

				ObjectApply.set({
					cursorColor: invertColor(value),
				});

				ObjectApply.setBackgroundColor(value);
			}
			else if (styleName == "textDecoration") {
				ObjectApply.setTextDecoration(value);
			}
			else {
				ObjectApply[styleName] = value;
			}

			fbCanvas.setActiveObject(ObjectApply);
		}

		AdjustPadding(ObjectApply);
		MovingElement();

		fbCanvas.renderAll();
		LoadCurrentStyles();
		CanvasModified();
		UpdateOverlay();

		if (ObjectApply.isEditing) {
			ObjectApply.hiddenTextarea.focus();
			ObjectApply.setSelectionEnd(ObjectApply.selectionStart);
			ObjectApply._initDimensions();
			ObjectApply.setCoords();
		}

		setTimeout(function(){
			fbCanvas.renderAll();
		}, 100);
	}
}

function invertColor(hexTripletColor) {
    var color = hexTripletColor;
    color = color.substring(1);           // remove #
    color = parseInt(color, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    color = color.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color;                  // prepend #
    return color;
}

//=================== Delete KeyDown Handler ===================
function MoveText(sense, shiftKey) {

	if (fbCanvas.getActiveObject() && !fbCanvas.getActiveObject().isEditing) {

		obj = fbCanvas.getActiveObject();

		if (obj.type == "textbox") {

			padding = (shiftKey ? 10 : 1)

			if (sense == "up") {
				obj.top = obj.top - padding;
			}
			else if (sense == "down") {
				obj.top = obj.top + padding;
			}
			else if (sense == "left") {
				obj.left = obj.left - padding;
			}
			else if (sense == "right") {
				obj.left = obj.left + padding;
			}
		}

		MovingElement();
	}
}

$(document).keydown(function(e) {
	if (KeyPressValidate()) {
		switch (e.keyCode) {
			case 46: // delete
				if (!fbCanvas.getActiveObject().isEditing) {
					removeSelected(true);
					break;
				}
			case 38:  // Up arrow was pressed
				MoveText("up", e.shiftKey);
				break;
			case 40:  // Down arrow was pressed
				MoveText("down", e.shiftKey);
				break;
			case 37:  // Left arrow was pressed
				MoveText("left", e.shiftKey);
				break;
			case 39:  // Right arrow was pressed
				MoveText("right", e.shiftKey);
				break;
			case 13:  // ENTER was pressed
				if (TextEditMode) {
					if ($("#ModalTextRemoveConfirm").is(":visible"))
						$("#SaveDialogText").trigger("click");
					else if ($("#ModalSaveCanges").is(":visible"))
						$("#SaveDialogCanvas").trigger("click");
				}
				break;
			case 27:  // ESC was pressed
				if (TextEditMode) {
					if ($("#ModalTextRemoveConfirm").is(":visible"))
						$("#CancelDialogText").trigger("click");
					else if ($("#ModalSaveCanges").is(":visible"))
						$("#CancelDialogCanvas").trigger("click");
					else if ($("#myCanvasModal").is(":visible"))
						ConfirmSaveonClose();
				}
				break;
		}
		return; //using "return" other attached events will execute
	}
	else {
		return; //using "return" other attached events will execute
	}
});

function KeyPressValidate() {
	return $(document.activeElement)[0].id != "font-family" && $(document.activeElement)[0].id != "font-size" && $(document.activeElement)[0].id != "bold" && $(document.activeElement)[0].id != "italic" && $(document.activeElement)[0].id != "underline" && $(document.activeElement)[0].id != "remove-text" && $(document.activeElement)[0].id != "body";
}

//=================== Remove Selected Texts ===================
function removeSelected(question) {
	if (TextEditMode && fbCanvas) {
		if (question && (fbCanvas.getActiveObject() || fbCanvas.getActiveGroup())) {
			if (fbCanvas.getActiveObject() && fbCanvas.getActiveObject().type == "textbox") {
				ModalTextRemoveConfirm = $("#ModalTextRemoveConfirm");
				ModalTextRemoveConfirm.modal("show");
			}
		}
		else {
			removeSelectedConfirmed();
		}
	}
};

//=================== Remove Selected Texts (with Confirm) ===================
function removeSelectedConfirmed() {
	if (TextEditMode && fbCanvas) {
		var activeObject = fbCanvas.getActiveObject(), activeGroup = fbCanvas.getActiveGroup();
		if (activeGroup) {
			var objectsInGroup = activeGroup.getObjects();
			fbCanvas.discardActiveGroup();
			objectsInGroup.forEach(function(object) {
				if (!object.isEditing) {
					if (object.get('ImageId') > 0) {
						arrayTextRemoved.push(object.get('ImageId'));
					}
					fbCanvas.remove(object);
				}
			});
		}
		else if (activeObject) {
			if (!activeObject.isEditing) {
				if (activeObject.get('ImageId') > 0) {
					arrayTextRemoved.push(activeObject.get('ImageId'));
				}
				fbCanvas.remove(activeObject);
			}
		}
		else if (currentEdit) {
			fbCanvas.remove(currentEdit);
		}

		HideFormatBar();
	}
}

function ChangeColorBW(option) {

	var OptionLocal = option;
	ImageColor = (OptionLocal != 'BW');
	AdjustMotivColor(ImageColor);

}

function AdjustMotivColor(ImageColor) {
	fbCanvas.forEachObject(function(newObj) {
		if (newObj.type === 'image' && newObj.id === bgId) {
			newObj.filters = (!ImageColor ? [new fabric.Image.filters.Grayscale()] : []);
			newObj.applyFilters(function() {
				fbCanvas.renderAll();
				previewConfig.stopScale();
			});
		}
	});
}

function AlignCurrentChanges() {
	$("#ProductIdLabelInitial").text($("#ProductIdLabel").text());
	$("#CanvasFormatWidthInitial").text($("#CanvasFormatWidth").text());
	$("#CanvasFormatHeightInitial").text($("#CanvasFormatHeight").text());
	$("#CanvasbackMaterialIdInitial").text($("#CanvasbackMaterialId").text());
	$("#CanvasborderEffectInitial").text($("#CanvasborderEffect").text());
	$("#CanvasframeIdInitial").text($("#CanvasframeId").text());
}

function ReturnTypeEffect(source) {

	if (source == "FOLDED") {
		typeReturn = 1;
	}
	else{
		typeReturn = 2;
	}

	return typeReturn;
}

function SubmitOriginalForm() {
	$(".AddBasketButton").trigger("onclick");
}

function CheckNextStep(AnotherUploadLocal) {

	AnotherUpload = AnotherUploadLocal;

	if (FormatChanged) {

		$("label[id*='AddTextButton']").trigger("click");

		if (AnotherUploadLocal) {
			$('.modal-backdrop.in').css({opacity: 0});
		}

		FormatChangedBasket = true;

		if (AnotherUpload) {
			setTimeout(function(){
				ResetInterface(function () {
					UploadAnother();
					AnotherUpload = false;
				})
			}, 1000);
		}
	}
	else {

		if (AnotherUpload) {
			AnotherUpload = false;
			UploadAnother();
		}
		else {
			SubmitOriginalForm();
		}
	}
}

function ResetInterface(callback) {

	myCanvasModal.modal({show: true, backdrop: false, keyboard: true});
	$('.modal-backdrop.in').css({opacity: 0});

	setTimeout(function(){
		ConfirmSaveonClose(function() {
			$("#myCanvasModal").css({opacity: 1});

		});
	}, 1000);

	if (callback && typeof(callback) === "function") {
		callback();
	}
}

function AspectSizePreview(callback) {

	var minSize = 350;
	var NewSize = 0;
	var split_space = 0;
	var viewportFit = window.innerWidth - 30;
	var NewScale = viewportFit / minSize;
	var canvas = $('.canvas-container');

	if (isMobile) {

		if (NewScale < 1) {

			var NewWidth = NewScale * canvas.width();
			var NewHeight = NewScale * canvas.height();

			NewSize = (NewWidth > NewHeight ? NewWidth : NewHeight);

			$('.lower-canvas').width(NewWidth).height(NewHeight);
			$('.upper-canvas').width(NewWidth).height(NewHeight);
		}
		else {

			NewSize = (canvas.width() > canvas.height() ? canvas.width() : canvas.height());
		}
	}

	$(".TablePreview").removeClass("desktop");

	if (callback && typeof(callback) === "function") {
		callback();
	}
}

function LoadCurrentFormatChange(callback) {

	var BorderCanvasText = GetBorder();

	if (FormatChangeCanvasElements.length == 0) {

		FormatChangeCanvasElements = AfterEditCanvasElements;

		if (FormatChangeCanvasElements == 0)
		{
			FormatChangeCanvasElements = RestoreItemCanvasElements;
		}
	}

	if (FormatChangeCanvasElements.length > 0) {

		for (i = 0; i < FormatChangeCanvasElements.length; i++) {

			RestoreObj = FormatChangeCanvasElements[i];

			if (RestoreObj.type == "textbox") {

				RestoreObj.set({
					text: RestoreObj.get('Curr_text'),
					fontFamily: RestoreObj.get('Curr_fontFamily'),
					fontSize: RestoreObj.get('Curr_fontSize'),
					fill: RestoreObj.get('Curr_fill'),
					fontWeight: RestoreObj.get('Curr_fontWeight'),
					fontStyle: RestoreObj.get('Curr_fontStyle'),
					width: RestoreObj.get('Curr_width'),
					height: RestoreObj.get('Curr_height'),
					textDecoration: RestoreObj.get('Curr_textDecoration'),
					top: (parseInt(((fbCanvas.height - (SaveBorderTop + SaveBorderBottom)) / 100 * RestoreObj.get('Curr_topPerc')) + SaveBorderTop)),
					left: (parseInt(((fbCanvas.width - (SaveBorderLeft + SaveBorderRight)) / 100 * RestoreObj.get('Curr_leftPerc')) + SaveBorderLeft)),
				});

				RestoreObj.set('Curr_ScaleDown', GetScale("Restore"));

				RestoreObj.setCoords();
				RestoreObj.selectable = false;
				RestoreObj._initDimensions();

				fbCanvas.insertAt(RestoreObj, 1);
			}
		}
	}

	fbCanvas.deactivateAll().renderAll();
	AfterEditCanvasElements = [];
	currentEdit = null;

	if (callback && typeof(callback) === "function") {
		callback();
	}
}

function SetElementsProportionFormatChange() {

	for (z = 0; z < fbCanvas.getObjects().length; z++) {

		var newObj = fbCanvas.getObjects()[z];

		if (newObj.type == "textbox") {

			scaleLoad = newObj.get('Curr_ScaleDown');

			newObj.fontSize = newObj.get('Curr_fontSize') * scaleLoad;
			newObj.width = newObj.get('Curr_width') * scaleLoad;
			newObj.height = newObj.get('Curr_height') * scaleLoad;

			newObj._initDimensions();
			newObj.setCoords();
			newObj.perPixelTargetFind = true;
			newObj.selectable = false;
		}
	}

	fbCanvas.deactivateAll().renderAll();
	currentEdit = null;
}
