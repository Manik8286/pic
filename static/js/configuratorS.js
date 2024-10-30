//= include vendor/jquery.datepicker.js
//= include ../../node_modules/jquery-ui/ui/widgets/datepicker.js
//= include ../../node_modules/inputmask/dist/jquery.inputmask.js
//= include ../../node_modules/inputmask/dist/bindings/inputmask.binding.js

/** @license v3.5 picanova */
// new t-shirts. Multiimage
var fbCanvas = null;
var EditMode = false;
var bgId = "bestImage";
var BorderId = "BorderImage";
var ShadowId = "ShadowMapImage"
var Configurator = function() {
  var preview = null;
  var numberOne = parseInt(1);
  var numberZero = parseInt(0);
  var formatChange = false,
    formatChangeF = false;
  var calcParams = true;
  var linkImageWidth = 0,
    linkImageHeight = 0;
  var linkImage = null,
    bgImage = null;
  var offX = parseFloat(-2),
    offY = parseFloat(-2),
    offXf = parseFloat(-2),
    offYf = parseFloat(-2),
    zoomVal = numberOne;
  var defaultPreview = 350;
  var RetinaDisplay = (window.devicePixelRatio > 1);
  var c0 = null,
    c1 = null,
    c2 = null;
  var voidColor = "#ffffff";
  var materials = {
    canvas: 10,
    rolledCanvas: 44,
    phoneMatt: 26,
    phoneGloss: 34,
    pillow: 23,
    pass: 43,
    premiumPillow: 45,
    totebag: 55,
    tshirt: 51,
    blanket: 46,
    carpet: 63,
    premiumBlanket: 47,
    premiumBlanketPlus: 58,
    wallTap: 53,
    towel: 60,
    canvasPlus: 54,
    mousepad: 16,
    starmap: 62,
    forexStarmap: 71,
    forexDecor: 75,
    canvasPoster: 76
  };
  var decoFrames = {
    f27: 'black_matte',
    f28: 'black_glossy',
    f29: 'white',
    f30: 'silver',
    f31: 'gold',
    f32: 'walnuss',
    f33: 'esche',
    f34: 'eiche',
    f35: 'palisander'
  };
  var dekoFramesFix = 26;
  var premiumFrames = {
    f16: 'black_matte',
    f17: 'black_glossy',
    f18: 'white',
    f19: 'silver',
    f20: 'gold',
    f21: 'walnuss',
    f22: 'esche',
    f23: 'eiche',
    f24: 'palisander'
  };
  var colorFrames = {
    f16: '#000000',
    f17: '#1f1b1a',
    f18: '#f3ece6',
    f19: '#e9e1de',
    f20: '#dfb583',
    f21: '#824e39',
    f22: '#d89952',
    f23: '#ccac86',
    f24: '#783111',
    f27: '#000000',
    f28: '#1f1b1a',
    f29: '#f3ece6',
    f30: '#e9e1de',
    f31: '#dfb583',
    f32: '#824e39',
    f33: '#d89952',
    f34: '#ccac86',
    f35: '#783111'
  };
  var tcolors = {
    7: ["#ffffff", "white"],
    8: ["#2c2c2c", "black"],
    9: ["#fff56d", "yellow"],
    10: ["#de1f3d", "red"],
    11: ["#00203c", "navy_blue"],
    12: ["#42a0d9", "light_blue"],
    13: ["#babab9", "grey_melange"],
    14: ["#ef4d8f", "sweet_pink"]
  };
  var colorPrevious = null,
    savedRotation = numberZero;
  var scaleMode = false,
    rotateAction = false;
  var FrameLoaded = false;
  var rotationState = {};

  this.buildPreview = function() {
    scaleMode = false;
    rotateAction = false;
    var color = $('.preview').parent().css("background-color");
    if (color != undefined && color != null && (color.toLowerCase().indexOf(
        'rgb') > -1) && (color.toLowerCase().indexOf('rgba') < 0)) {
      voidColor = color;
    }
    calcParams = true;
    if (!!document.getElementById('rotateMotif')) {
      savedRotation = parseInt(document.getElementById(
        'itemConfiguratorForm:cutoutRotation').value);
    }
    if (preview != null) {
      colorPrevious = preview.coloreffect;
      linkImage = preview.img;
      savedRotation = preview.rotation;
    }
    preview = null;

    if (typeof multiimage !== 'undefined' && multiimage == true) {
      preview = new MultiImagePreview();
    } else {
      defaultPreview = previewWidth;
      var item = $("#imageData");
      var material = item.data('material');
      var beffect = item.data('border');
      if (material == materials.phoneMatt || material == materials.phoneGloss) {
        preview = new PhoneCasePreview(item);
      } else if (material == materials.canvas || material == materials.rolledCanvas ||
        material == materials.canvasPlus) {
        if ('FOLDED' == beffect) {
          preview = new CanvasFoldedPreview(item);
        } else if (beffect != null) {
          preview = new CanvasPreview(item);
        }
      } else if (material == materials.pass) {
        preview = new PaspartuPreview(item);
      } else if (material == materials.forexDecor) {
        preview = new ForexDecorPreview(item);
      } else if (material == materials.tshirt) {
        preview = new TshirtPreview(item);
      } else if (material == materials.blanket || material == materials.wallTap) {
        preview = new BlanketStandardPreview(item);
      } else if (material == materials.pillow) {
        preview = new StandardCushionPreview(item)
      } else if (material == materials.premiumPillow) {
        preview = new PremiumCushionPreview(item)
      } else if (material == materials.mousepad) {
        preview = new MousePadPreview(item)
      } else if (material == materials.starmap || material == materials.forexStarmap) {
        preview = new StarmapPreview(item)
      } else if (material == materials.canvasPoster) {
        preview = new CanvasPosterPreview(item)
      } else if (material == materials.premiumBlanket) {
        preview = new BlanketPremiumPreview(item);
      } else {
        preview = new Preview(item);
      }
    }
    preview.buildPreview();

    if ($(".canvas-container").length && $("#thepreviewBox").length) {

      var myCanvas = $("canvas");
      var myCanvasContainer = $(".canvas-container");
      var myCanvasSpace = $("#thepreviewBox");

      if (myCanvas.outerWidth() > myCanvasSpace.outerWidth()) {
        scale = myCanvasSpace.outerWidth() / myCanvas.outerWidth();
        myCanvas.width(myCanvas.outerWidth() * scale).height(myCanvas.outerHeight() *
          scale);
        myCanvasContainer.width(myCanvas.outerWidth()).height(myCanvas.outerHeight());
      }
    }
  }

  this.isFormatChange = function() {
    formatChange = true;
    formatChangeF = true;
    zoomVal = numberOne;
  }

  this.doScale = function() {
    scaleMode = true;
    zoomVal = numberOne + parseInt(document.getElementById("scaleCanvas").value) /
      100;
    if (bgImage) {
      bgImage.scale(preview.sizeFactor + (zoomVal - 1) * preview.sizeFactor);
    }
    fbCanvas.renderAll();
    preview.callMove();
    preview.readOffset();

    if ($('.previewDemo').length)
      $('.previewDemo').removeClass('active');
  }

  this.stopScale = function() {
    this.doScale();
    scaleMode = false;
    preview.callMove();
    preview.readOffset();
    updateMove();
  }

  this.rotatePreview = function() {
    rotateAction = true;
    preview.rotation = preview.rotation + 90;
    if (preview.rotation > 270) {
      preview.rotation = 0;
    }
    preview.isRotated = preview.rotation / 90 % 2 == 1;
    if (preview.isRotated) {
      linkImage = preview.imgR;
    } else {
      linkImage = preview.img;
    }
    preview.sizeFactor = [preview.sizeFactorR, preview.sizeFactorR =
      preview.sizeFactor
    ][0];
    linkImageWidth = linkImage.width * preview.sizeFactor;
    linkImageHeight = linkImage.height * preview.sizeFactor;
    calcParams = true;
    preview.imgHeight = [preview.imgWidth, preview.imgWidth = preview.imgHeight]
      [0];
    document.getElementById('itemConfiguratorForm:cutoutX').value = 'null';
    fbCanvas.clear();
    preview.completePreview(true);
  }

  this.saveRotationState = function() {
    rotationState['rotation'] = preview.rotation;
    rotationState['īsRotated'] = preview.isRotated;
    rotationState['linkImage'] = linkImage;
    rotationState['sizeFactor'] = preview.sizeFactor;
    rotationState['sizeFactorR'] = preview.sizeFactorR;
    rotationState['linkImageWidth'] = linkImageWidth;
    rotationState['linkImageHeight'] = linkImageHeight;
    rotationState['imgHeight'] = preview.imgHeight;
    rotationState['imgWidth'] = preview.imgWidth;
    rotationState['movable'] = preview.movable;
  }

  this.restoreSavedRotationState = function() {
    preview.rotation = rotationState['rotation'];
    preview.isRotated = rotationState['īsRotated'];
    linkImage = rotationState['linkImage'];
    preview.sizeFactor = rotationState['sizeFactor'];
    preview.sizeFactorR = rotationState['sizeFactorR'];
    linkImageWidth = rotationState['linkImageWidth'];
    linkImageHeight = rotationState['linkImageHeight'];
    preview.imgHeight = rotationState['imgHeight'];
    preview.imgWidth = rotationState['imgWidth'];
    preview.movable = rotationState['movable'];

    if (!!document.getElementById('rotateMotif')) {
      savedRotation = preview.rotation;
    }

    fbCanvas.remove(bgImage);

    bgImage = new fabric.Image(linkImage, {
      scaleX: preview.sizeFactor,
      scaleY: preview.sizeFactor,
      id: bgId,
      hasControls: false,
      hasBorders: false,
      selectable: preview.movable
    });

    preview.flipRotatedImage();
    bgImage.XZIndex = numberZero;
    fbCanvas.insertAt(bgImage, bgImage.XZIndex);
  }

  this.validateParams = function() {
    if (preview.material == materials.starmap || preview.material ==
      materials.forexStarmap)
      return true;
    var x = document.getElementById('itemConfiguratorForm:cutoutX').value.trim();
    var y = document.getElementById('itemConfiguratorForm:cutoutY').value.trim();
    var w = document.getElementById('itemConfiguratorForm:cutoutWidth').value
      .trim();
    var h = document.getElementById('itemConfiguratorForm:cutoutHeight').value
      .trim();

    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h) || x == "" || y == "" ||
      w == "" || h == "") {
      if (preview) {
        alert(preview.loadAlert);
      }
      return false;
    }
    if (calcParams) {
      if (preview) {
        alert(preview.loadAlert);
      }
      return false;
    }
    return true;
  }

  this.isMobile = false;

  this.resetPreview = function() {
    this.isFormatChange();
    offX = parseInt(-2);
    offY = parseInt(-2);
    offXf = parseInt(-2);
    offYf = parseInt(-2);
    resetParams();
    fbCanvas.clear();
    preview.completePreview();
  }

  this.cropPreviewBeforeCheckout = function() {
    preview.cropPreviewBeforeCheckout();
  }

  this.cropPreview = function() {
    preview.cropPreview();
  }

  var Preview = function(item) {
    if (item == null) {
      return;
    }
    this.imageid = parseInt(item.data('id'));
    this.format = item.data('format').split(':');
    this.coloreffect = item.data('effect');
    this.colorchange = this.coloreffect != colorPrevious;
    this.bordereffect = item.data('border');
    this.backId = parseInt(item.data('backid'));
    this.imgWidth = parseFloat(item.data('imgwidth'));
    this.imgHeight = parseFloat(item.data('imgheight'));
    this.material = parseInt(item.data('material'));
    this.frame = parseInt(item.data('frame'));
    this.fourcmId = parseInt(item.data('fourcmid'));
    this.sixcmid = parseInt(item.data('sixcmid'));
    this.loadAlert = item.data('loadalert');
    this.finish1 = item.data('finish1');
    this.finish2 = item.data('finish2');
    if (this.finish1 > numberZero) {
      var colorFinishing = tcolors[this.finish1] != null ? tcolors[this.finish1] :
        tcolors[this.finish2];
      this.materialcolor = colorFinishing[0];
      this.colorname = colorFinishing[1];
    }
    this.trim = (typeof item.data('trim') === 'undefined' || item.data(
      'trim') == "") ? 0 : parseFloat(item.data('trim'));
    this.tshirtType = item.data('finish3') == 23 ? "v_" : "";
    this.rotation = numberZero;
    this.border = numberZero;
    this.clipPath = (typeof item.data('clippath') === 'undefined' || item.data('clippath') == "") ? null : item.data('clippath');
  };

  function CanvasPreview(item) {
    Preview.call(this, item);
  }
  CanvasPreview.prototype = Object.create(Preview.prototype);
  CanvasPreview.prototype.constructor = CanvasPreview;

  function CanvasFoldedPreview(item) {
    CanvasPreview.call(this, item);
  }
  CanvasFoldedPreview.prototype = Object.create(CanvasPreview.prototype);
  CanvasFoldedPreview.prototype.constructor = CanvasPreview;

  function PhoneCasePreview(item) {
    Preview.call(this, item);
  }
  PhoneCasePreview.prototype = Object.create(Preview.prototype);
  PhoneCasePreview.prototype.constructor = PhoneCasePreview;

  function BorderedAsyncPreview(item) {
    Preview.call(this, item);
  }
  BorderedAsyncPreview.prototype = Object.create(Preview.prototype);
  BorderedAsyncPreview.prototype.constructor = BorderedAsyncPreview;

  function PaspartuPreview(item) {
    BorderedAsyncPreview.call(this, item);
  }
  PaspartuPreview.prototype = Object.create(BorderedAsyncPreview.prototype);
  PaspartuPreview.prototype.constructor = PaspartuPreview;

  function ForexDecorPreview(item) {
    BorderedAsyncPreview.call(this, item);
  }
  ForexDecorPreview.prototype = Object.create(BorderedAsyncPreview.prototype);
  ForexDecorPreview.prototype.constructor = ForexDecorPreview;

  function TshirtPreview(item) {
    BorderedAsyncPreview.call(this, item);
  }
  TshirtPreview.prototype = Object.create(BorderedAsyncPreview.prototype);
  TshirtPreview.prototype.constructor = TshirtPreview;

  function CanvasPosterPreview(item) {
    Preview.call(this, item);
  }
  CanvasPosterPreview.prototype = Object.create(Preview.prototype);
  CanvasPosterPreview.prototype.constructor = CanvasPosterPreview;

  function BlanketStandardPreview(item) {
    Preview.call(this, item);
  }
  BlanketStandardPreview.prototype = Object.create(Preview.prototype);
  BlanketStandardPreview.prototype.constructor = BlanketStandardPreview;

  function BlanketPremiumPreview(item) {
    Preview.call(this, item);
  }
  BlanketPremiumPreview.prototype = Object.create(Preview.prototype);
  BlanketPremiumPreview.prototype.constructor = BlanketPremiumPreview;

  function StandardCushionPreview(item) {
    BorderedAsyncPreview.call(this, item);
  }
  StandardCushionPreview.prototype = Object.create(BorderedAsyncPreview.prototype);
  StandardCushionPreview.prototype.constructor = StandardCushionPreview;

  function PremiumCushionPreview(item) {
    Preview.call(this, item);
  }
  PremiumCushionPreview.prototype = Object.create(Preview.prototype);
  PremiumCushionPreview.prototype.constructor = PremiumCushionPreview;

  function MousePadPreview(item) {
    Preview.call(this, item);
  }
  MousePadPreview.prototype = Object.create(Preview.prototype);
  MousePadPreview.prototype.constructor = MousePadPreview;

  function MultiImagePreview() { // multiimage
    Preview.call(this, null);
    var item = $("#imagePrev");
    if (typeof item.data('image') === 'undefined') {
      return;
    }
    this.imageid = item.data('imageid');
    this.areaid = item.data('areaid');
    this.imgWidth = parseFloat(item.data('image').width);
    this.imgHeight = parseFloat(item.data('image').height);
    this.rotation = (item.data('rotation') == "") ? 0 : parseInt(item.data(
      'rotation'));
    this.productid = item.data('id');
    this.format = [parseFloat(item.data('width')), parseFloat(item.data(
      'height'))];
    this.fotoBox = bilderBox;
    this.fotoBoxRetro = bilderBoxRetro;
    this.trim = (typeof item.data('trim') === 'undefined' || item.data('trim') ==
      "") ? 0 : parseFloat(item.data('trim'));
    var color = $('.large-preview').parent().css("background-color");
    if (color != undefined && color != null && (color.toLowerCase().indexOf(
        'rgb') > -1) && (color.toLowerCase().indexOf('rgba') < 0)) {
      voidColor = color;
    }
  }
  MultiImagePreview.prototype = Object.create(Preview.prototype);
  MultiImagePreview.prototype.constructor = MultiImagePreview;

  function StarmapPreview(item) { // starmap
    Preview.call(this, null);
    this.format = item.data('format').split(':');
    this.material = parseInt(item.data('material'));
    this.serviceUrl = item.data('serviceurl');
    this.frame = parseInt(item.data('frame'));
  }
  StarmapPreview.prototype = Object.create(Preview.prototype);
  StarmapPreview.prototype.constructor = StarmapPreview;

  // --------------------------------------------------------- buildPreview
  Preview.prototype.buildPreview = function() {
    if (formatChange) {
      offX = parseInt(-2);
      offY = parseInt(-2);
      resetParams();
    }

    this.formatWidth = parseFloat(this.format[0]);
    this.formatHeight = parseFloat(this.format[1]);
    this.tiles = this.format[4];
    if (isNaN(this.tiles)) {
      this.tiles = this.format[5];
    }

    if (!!document.getElementById('rotateMotif')) {
      this.rotation = savedRotation;
      if (isNaN(this.rotation) || "" == this.rotation) {
        this.rotation = numberZero;
      }
    }


    if (!!$(".canvas-container .upper-canvas")[0]) {
      fbCanvas.clear();
    } else {
      clearCanvas();
      fbCanvas = new fabric.CanvasEx('myCanvas', {
        selection: false,
        renderOnAddRemove: true,
        allowTouchScrolling: true,
        preserveObjectStacking: true,
        controls: false
      });
    }

    // Text effect Start
    /*
     * fbCanvas.on("object:selected", function(e) { var activeObject = e.target;
     * if (activeObject && activeObject.isType('text')) {
     * selectTextEffect(activeObject); } else { $(".textProps").css("display",
     * "none"); textActive = null; } }); fbCanvas.on("selection:cleared",
     * function() { $(".textProps").css("display", "none"); textActive = null;
     * });
     */
    // Text effect End
    preview.buildCanvas();
  };

  CanvasPreview.prototype.buildPreview = function() {
    this.border = parseInt(25);
    if (this.backId == this.fourcmId) { // 13 or 11
      this.border = parseInt(45);
    } else if (this.backId == this.sixcmid) { // 19
      this.border = parseInt(59);
    }

    if (this.material == materials.canvas && this.frame > 0) {
      if (this.frame >= dekoFramesFix) {
        this.border = this.border = parseInt(25); // Decor Frame
      } else {
        this.border = this.border = parseInt(27); // Premium Frame
      }
    }

    $("input[id*='BorderCanvasText']").val(this.border).change();
    Preview.prototype.buildPreview.call(this);
  }

  CanvasFoldedPreview.prototype.buildPreview = function() {
    if (formatChangeF) {
      offXf = parseInt(-2);
      offYf = parseInt(-2);
      resetParams();
    }
    CanvasPreview.prototype.buildPreview.call(this);
  }

  PaspartuPreview.prototype.buildPreview = function() {
    Preview.prototype.buildPreview.call(this);
  };

  ForexDecorPreview.prototype.buildPreview = function() {
    Preview.prototype.buildPreview.call(this);
  };

  StandardCushionPreview.prototype.buildPreview = function() {
    Preview.prototype.buildPreview.call(this);
  };

  MultiImagePreview.prototype.buildPreview = function() {
    this.isRotated = this.rotation / 90 % 2 == numberOne;
    var cropInfo = $("#imagePrev").data('image').crop;
    document.getElementById('itemConfiguratorForm:cutoutX').value =
      parseFloat(cropInfo.x);
    document.getElementById('itemConfiguratorForm:cutoutY').value =
      parseFloat(cropInfo.y);
    document.getElementById('itemConfiguratorForm:cutoutWidth').value =
      parseFloat(cropInfo.width);
    document.getElementById('itemConfiguratorForm:cutoutHeight').value =
      parseFloat(cropInfo.height);
    Preview.prototype.buildPreview.call(this);
  };

  StarmapPreview.prototype.buildPreview = function() {
    this.formatWidth = parseFloat(this.format[0]);
    this.formatHeight = parseFloat(this.format[1]);
    this.location = document.getElementById('itemConfiguratorForm:location')
      .value.trim();
    this.latitude = document.getElementById('itemConfiguratorForm:latitude')
      .value.trim();
    this.longitude = document.getElementById(
      'itemConfiguratorForm:longitude').value.trim();

    this.datetime = document.getElementById('itemConfiguratorForm:datetime')
      .value.trim(); //e.g. 2018-04-23T22:00:00%2B01:00
    this.datetimeInput = document.getElementById(
      'itemConfiguratorForm:datetimeInput').value.trim();

    var hrs = document.getElementById("itemConfiguratorForm:dateTimeHours");
    var dateTimeHours = hrs.options[hrs.selectedIndex].value;

    var min = document.getElementById(
      "itemConfiguratorForm:dateTimeMinutes");
    var dateTimeMinutes = min.options[min.selectedIndex].value;

    this.onwhite = document.getElementById('itemConfiguratorForm:onwhite').checked;
    this.constellations = document.getElementById(
      'itemConfiguratorForm:constellations').checked;
    this.graticule = document.getElementById(
      'itemConfiguratorForm:graticule').checked;
    this.title = document.getElementById('itemConfiguratorForm:title').value
      .trim();
    this.margin = document.getElementById('itemConfiguratorForm:margin').value
      .trim();

    if (this.margin == "" || isNaN(this.margin)) {
      this.margin = 0;
    }

    var radios = document.getElementsByName(
      'itemConfiguratorForm:fillColor');
    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        this.fillColor = radios[i].value;
        break;
      }
    }

    var timezone = -1 * new Date().getTimezoneOffset() / 60;
    if (timezone > -1 && timezone < 10)
      timezone = "0" + timezone + ":00";
    else if (timezone > -10 && timezone < 0)
      timezone = "-0" + (-1 * timezone) + ":00";

    if (this.datetimeInput == "" && this.datetime != "") {
      var dt = this.datetime.split("T");
      var dateParts = dt[0].split('-');
      var reformattedDate = dateParts[0] + '-' + dateParts[1] + '-' + dateParts[2]; // yyyy-mm-dd format

      // sets date and time into fields on starmap edit
      document.getElementById('itemConfiguratorForm:datetimeInput').value = reformattedDate;

      document.getElementById("itemConfiguratorForm:dateTimeHours").value =
        dateTimeHoursSet;
      document.getElementById("itemConfiguratorForm:dateTimeMinutes").value =
        dateTimeMinutesSet;

    } else if (this.datetimeInput != "") {
      var dateParts = this.datetimeInput.split('-');
      this.datetime = dateParts[0] + '-' + dateParts[1] + '-' + dateParts[2] + "T" + dateTimeHours + ":" +
        dateTimeMinutes + ":00%2B" + timezone; // yyyy-mm-dd format// let's set midday by default
    } else {
      //Set default date
      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
        today.getDate().toString().padStart(2, '0');
      this.datetimeInput = date;
      this.datetime = this.datetimeInput + "T" + dateTimeHours + ":" +
        dateTimeMinutes + ":00%2B" + timezone; // yyyy-mm-dd format
      document.getElementById('itemConfiguratorForm:datetimeInput').value = date;
      document.getElementById('itemConfiguratorForm:datetime').value = this.datetime;
    }

    // Set defaults
    if (this.longitude == "" || this.latitude == "") {
      document.getElementById('itemConfiguratorForm:latitude').value =
        "59.334591";
      document.getElementById('itemConfiguratorForm:longitude').value =
        "18.063240";
      this.latitude = "59.334591";
      this.longitude = "18.063240";
      document.getElementById('itemConfiguratorForm:location').value =
        "Stockholm";
      this.location = "Stockholm"
    }

    // Date to show on Starmap
    var previewDate = this.datetime.split("T");
    var previewDateThis = new Date(previewDate[0]);
    var translatedMonths = ['januari', 'februari', 'mars', 'april', 'maj',
      'juni', 'juli', 'augusti', 'september', 'oktober', 'november',
      'december'
    ];
    var previewDateResult = previewDateThis.getDate() + ' ' +
      translatedMonths[previewDateThis.getMonth()] + ' ' + previewDateThis.getFullYear();


    var frameSrc = "/staticimages/configurator/starmap/" + decoFrames[('f' +
      this.frame)] + ".png";

    var frameSize = 18;
    var fwSize = this.formatWidth;
    var fhSize = this.formatHeight;
    document.getElementById('itemConfiguratorForm:subtitle1').value = this.location;
    document.getElementById('itemConfiguratorForm:subtitle2').value =
      previewDateResult;
    document.getElementById('itemConfiguratorForm:datetime').value = this.datetime;

    var imageData = $("#imageData");
    var materialIs = imageData.data('material');

    if ((fwSize == 300 && fhSize == 400) || (fwSize == 272 && fhSize == 372)) {
      fwSize = 600;
      fhSize = 800;
      $("#canvas-preview").addClass("size30x40Starmap");
    }
    else {
      $("#canvas-preview").removeClass("size30x40Starmap");
    }

    // Starmap final url
    var starmapSrc = this.serviceUrl + '/api/v1/png?w=' + fwSize +
      "&h=" + fhSize + "&pxw=" + fwSize + "&lat=" + this.latitude +
      "&lng=" + this.longitude + "&date=" + this.datetime + "&fill=" +
      encodeURIComponent(this.fillColor) + "&margin=" + this.margin +
      "&onwhite=" + this.onwhite + "&constellations=" + this.constellations +
      "&graticule=" + this.graticule + "&t=" + encodeURIComponent(this.title) +
      "&t1=" + encodeURIComponent(this.location) + "&t2=" +
      encodeURIComponent(previewDateResult);

      $('.loader').show(function() {
        starmapLoader();
      });

    // Frame for Starmap
    var starmapImg = new Image();
    starmapImg.onload = function() {
      var starmapPreview = document.getElementById('canvas-preview');
      var ctx = starmapPreview.getContext("2d");

      // framed photo starmap
      if (materialIs == materials.starmap) {

        starmapPreview.width = fwSize + 2 * frameSize;
        starmapPreview.height = fhSize + 2 * frameSize;

        var frameImg = new Image();
        frameImg.onload = function() {
          ctx.drawImage(starmapImg, frameSize, frameSize);
          ctx.drawImage(frameImg, 0, 0, starmapPreview.width,
            starmapPreview.height);
            $('.loader').hide(function() {
              starmapUnLoader();
            });
          AdjusteScroll();
        }
        frameImg.src = frameSrc;
        // forex starmap
      } else if (materialIs == materials.forexStarmap) {

        var frameSizeDiffX,
          frameSizeDiffY;

        starmapPreview.width = fwSize + 2 * frameSize;
        starmapPreview.height = fhSize + 2 * frameSize;

        if (fwSize === 272) {

          frameSizeDiffX = 10;
          frameSizeDiffY = 10;

          starmapPreview.width = fwSize + 2 * frameSize - 20;
          starmapPreview.height = fhSize + 2 * frameSize - 20;

        } else if (fwSize === 300) {

          frameSizeDiffX = 8;
          frameSizeDiffY = 8;

          starmapPreview.width = fwSize + 2 * frameSize - 16;
          starmapPreview.height = fhSize + 2 * frameSize - 16;

        } else if (fwSize === 372) {

          frameSizeDiffX = 6;
          frameSizeDiffY = 6;

          starmapPreview.width = fwSize + 2 * frameSize - 12;
          starmapPreview.height = fhSize + 2 * frameSize - 12;

        } else if (fwSize === 400) {

          frameSizeDiffX = 4;
          frameSizeDiffY = 4;

          starmapPreview.width = fwSize + 2 * frameSize - 8;
          starmapPreview.height = fhSize + 2 * frameSize - 6;

        } else {

          frameSizeDiffX = 0;
          frameSizeDiffY = 0;
        }

        var frameImg = new Image();
        frameImg.onload = function() {
          ctx.drawImage(starmapImg, frameSize - frameSizeDiffX,
            frameSize - frameSizeDiffY);
          ctx.drawImage(frameImg, 0, 0, starmapPreview.width,
            starmapPreview.height);
            $('.loader').hide(function() {
              starmapUnLoader();
            });
          AdjusteScroll();
        }

        if (frameSrc !==
          '/staticimages/configurator/starmap/undefined.png') {
          frameImg.src = frameSrc;
        } else {
          starmapPreview.width = fwSize;
          starmapPreview.height = fhSize;
          ctx.drawImage(starmapImg, 0, 0);
          $('.loader').hide(function() {
            starmapUnLoader();
          });
          AdjusteScroll();
        }

      }
      $('.loader').hide(function() {
        starmapUnLoader();
      });
    }

    starmapImg.src = starmapSrc;
  };

  // -----------------------------------------------------------------------------------
  // buildCanvas
  Preview.prototype.buildCanvas = function() {
    preview.setupCanvas();
    if (this.frame >= dekoFramesFix && this.material != materials.pass &&
      this.material != materials.forexDecor &&
      this.material != materials.canvas && this.material != materials.starmap
    ) {
      this.border10mm = 10 / this.formatWidth * this.lineWidth;
    } else {
      this.border10mm = numberZero;
    }

    preview.setCanvas();

    var wratio = this.imgWidth / this.printWidth;
    var hratio = this.imgHeight / this.printHeight;

    var old_ratio = this.imgHeight / this.imgWidth;
    var newdim = [this.imgHeight, this.imgWidth];

    if (wratio > hratio) {
      newdim[0] = this.printHeight;
      newdim[1] = newdim[0] / old_ratio;
    } else {
      newdim[1] = this.printWidth;
      newdim[0] = newdim[1] * old_ratio;
    }

    var imgSize = 0;
    if ((hratio > wratio && this.formatWidth == this.formatHeight) || this.formatHeight >
      this.formatWidth) {
      imgSize = newdim[0];
    } else {
      imgSize = newdim[1];
    }

    this.isRotated = this.rotation / 90 % 2 == numberOne;

    if (linkImage == null || this.colorchange) {
      this.img = new Image();
      this.img.onload = function() {
        linkImage = preview.img;
        if ((hratio > wratio && preview.formatWidth == preview.formatHeight) ||
          preview.formatHeight > preview.formatWidth) {
          linkImageHeight = imgSize;
          linkImageWidth = linkImageHeight * linkImage.width / linkImage.height;
        } else {
          linkImageWidth = imgSize;
          linkImageHeight = linkImageWidth * linkImage.height / linkImage
            .width;
        }
        preview.sizeFactor = linkImageHeight / linkImage.height;
        preview.setupRotated(wratio, hratio);
      }
      var getSize = imgSize;
      if (getSize < 350) {
        getSize = 350;
      }
      preview.img.src = "dynamicimage/" + this.imageid + "?size=" + (
        getSize | 0) + "&effect=" + this.coloreffect;
    } else {
      if ((hratio > wratio && this.formatWidth == this.formatHeight) ||
        this.formatHeight > this.formatWidth) {
        linkImageHeight = imgSize;
        linkImageWidth = linkImageHeight * linkImage.width / linkImage.height;
      } else {
        linkImageWidth = imgSize;
        linkImageHeight = linkImageWidth * linkImage.height / linkImage.width;
      }
      this.sizeFactor = linkImageHeight / linkImage.height;
      preview.img = linkImage;
      preview.setupRotated(wratio, hratio);
    }
  }

  BlanketPremiumPreview.prototype.setupCanvas = function() {
    if (this.formatWidth > this.formatHeight) {
      this.printWidth = defaultPreview / (1 + 2 * this.border / this.formatWidth);
      this.printHeight = this.formatHeight / this.formatWidth * this.printWidth;
      this.border = (this.border / this.formatWidth * this.printWidth);
    } else {
      this.printHeight = defaultPreview / (1 + 2 * this.border / this.formatHeight);
      this.printWidth = this.formatWidth / this.formatHeight * this.printHeight;
      this.border = (this.border / this.formatHeight * this.printHeight);
    }

    this.canvasWidth = this.printWidth + 2 * this.border;
    this.canvasHeight = this.printHeight + 2 * this.border;
    this.lineWidth = this.printWidth;
    this.lineHeight = this.printHeight;
  }

  MultiImagePreview.prototype.buildCanvas = function() {
    preview.setupCanvas();
    preview.setCanvas();
    var wratio = this.imgWidth / this.printWidth;
    var hratio = this.imgHeight / this.printHeight;

    var old_ratio = this.imgHeight / this.imgWidth;
    var newdim = [this.imgHeight, this.imgWidth];

    if ((this.isLandscape && wratio > hratio) || (!this.isLandscape && this
        .printWidth > this.printHeight)) {
      newdim[0] = this.printHeight;
      newdim[1] = newdim[0] / old_ratio;
    } else {
      newdim[1] = this.printWidth;
      newdim[0] = newdim[1] * old_ratio;
    }
    var imgSize = 0;
    if (this.formatWidth > this.formatHeight) {
      imgSize = newdim[1];
    } else {
      imgSize = newdim[0];
    }

    linkImageWidth = newdim[0];
    linkImageHeight = newdim[1];
    this.sizeFactor = numberOne;
    this.sizeFactorR = numberOne;

    this.printWidth = this.canvasWidth;
    this.printHeight = this.canvasHeight;
    this.imgR = new Image();
    this.imgR.onload = function() {
      if (c0 == null) {
        c0 = document.createElement("canvas");
      } else {
        c0.getContext("2d").clearRect(0, 0, c0.width, c0.height);
      }
      var ctx = c0.getContext("2d");
      c0.width = preview.imgR.height | 0;
      c0.height = preview.imgR.width | 0;
      ctx.save();
      ctx.translate(c0.width / 2, c0.height / 2);
      ctx.rotate(270 * Math.PI / 180);
      ctx.drawImage(preview.imgR, -preview.imgR.width * 0.5, -preview.imgR
        .height * 0.5);
      ctx.restore();

      if (c1 == null) {
        c1 = document.createElement("canvas");
      } else {
        c1.getContext("2d").clearRect(0, 0, c1.width, c1.height);
      }
      if (wratio > hratio && !preview.isLandscape) {
        c1.height = preview.canvasHeight;
        c1.width = (c0.width * (preview.canvasHeight / c0.height)) | 0;
      } else {
        c1.width = preview.canvasWidth;
        c1.height = (c0.height * (preview.canvasWidth / c0.width)) | 0;
      }
      var ctx1 = c1.getContext("2d");
      ctx1.drawImage(c0, 0, 0, c0.width, c0.height, 0, 0, c1.width, c1.height);
      preview.img = new Image();
      preview.img.onload = function() {
        if (preview.isLandscape) {
          preview.imgR = [preview.img, preview.img = preview.imgR][0];
        }
        if (preview.isRotated) {
          linkImage = preview.imgR;
          if (!preview.isLandscape) {
            preview.imgHeight = [preview.imgWidth, preview.imgWidth =
              preview.imgHeight
            ][0];
          }
        } else {
          linkImage = preview.img;
          if (preview.isLandscape) {
            preview.imgHeight = [preview.imgWidth, preview.imgWidth =
              preview.imgHeight
            ][0];
          }
        }
        linkImageWidth = linkImage.width;
        linkImageHeight = linkImage.height;
        preview.completePreview();
      }
      preview.img.src = c1.toDataURL("image/png");
    }

    if (this.isLandscape) {
      this.imgR.src = "dynamicimage/" + this.imageid + "?size=" + (imgSize |
        0) + "&rotation=" + 180;
    } else {
      this.imgR.src = "dynamicimage/" + this.imageid + "?size=" + (imgSize |
        0) + "&rotation=" + 90;
    }
  }

  // -----------------------------------------------------------------------------------
  // setupRotated
  Preview.prototype.setupRotated = function(wratio, hratio) {
    this.imgR = new Image();
    if (c0 == null) {
      c0 = document.createElement("canvas");
    } else {
      c0.getContext("2d").clearRect(0, 0, c0.width, c0.height);
    }
    var ctx = c0.getContext("2d");
    c0.width = preview.img.height | 0;
    c0.height = preview.img.width | 0;
    ctx.save();
    ctx.translate(c0.width / 2, c0.height / 2);
    ctx.rotate(270 * Math.PI / 180);
    ctx.drawImage(preview.img, -preview.img.width * 0.5, -preview.img.height *
      0.5);
    ctx.restore();

    var wratioR = c0.width / this.printWidth;
    var hratioR = c0.height / this.printHeight;

    var old_ratio = c0.height / c0.width;
    var newdim = [c0.height, c0.width];

    if (wratioR > hratioR) {
      newdim[0] = this.printHeight;
      newdim[1] = newdim[0] / old_ratio;
    } else {
      newdim[1] = this.printWidth;
      newdim[0] = newdim[1] * old_ratio;
    }

    if (c1 == null) {
      c1 = document.createElement("canvas");
    } else {
      c1.getContext("2d").clearRect(0, 0, c1.width, c1.height);
    }
    if ((hratioR > wratioR && this.formatWidth == this.formatHeight) ||
      this.formatHeight > this.formatWidth) {
      c1.width = newdim[1];
      c1.height = (c0.height * (c1.width / c0.width)) | 0;
    } else {
      c1.height = newdim[0];
      c1.width = (c0.width * (c1.height / c0.height)) | 0;
    }
    var ctx1 = c1.getContext("2d");
    ctx1.drawImage(c0, 0, 0, c0.width, c0.height, 0, 0, c1.width, c1.height);
    this.imgR.onload = function() {
      preview.sizeFactorR = c1.height / preview.imgR.height;

      if (preview.isRotated && !rotateAction) {
        linkImage = preview.imgR;
        preview.imgHeight = [preview.imgWidth, preview.imgWidth = preview
          .imgHeight
        ][0];
        preview.sizeFactor = [preview.sizeFactorR, preview.sizeFactorR =
          preview.sizeFactor
        ][0];
      } else {
        linkImage = preview.img;
      }

      linkImageWidth = linkImage.width * preview.sizeFactor;
      linkImageHeight = linkImage.height * preview.sizeFactor;
      preview.completePreview();
    }
    this.imgR.src = c1.toDataURL("image/png");
  }

  // -----------------------------------------------------------------------------------
  // setupCanvas

  Preview.prototype.setupCanvas = function() {
    this.border = this.trim;
    if (this.formatWidth > this.formatHeight) {
      this.printWidth = defaultPreview;
      this.printHeight = this.formatHeight / this.formatWidth * this.printWidth;
      this.border = (this.border / this.formatWidth * this.printWidth);
    } else {
      this.printHeight = defaultPreview;
      this.printWidth = this.formatWidth / this.formatHeight * this.printHeight;
      this.border = (this.border / this.formatHeight * this.printHeight);
    }

    if (typeof isShapy != "undefined" && isShapy) {
      this.border = numberZero;
    }

    this.canvasWidth = this.printWidth;
    this.canvasHeight = this.printHeight;

    this.lineWidth = this.canvasWidth - 2 * this.border;
    this.lineHeight = this.canvasHeight - 2 * this.border;

    this.clipResizeX = (this.printWidth / this.formatWidth);
    this.clipResizeY = (this.printHeight / this.formatHeight);

    $("input[id*='BorderCanvasText']").val(this.border).change();
  }

  CanvasPreview.prototype.setupCanvas = function() {
    if (this.formatWidth > this.formatHeight) {
      this.printWidth = defaultPreview / (1 + 2 * this.border / this.formatWidth);
      this.printHeight = this.formatHeight / this.formatWidth * this.printWidth;
      this.border = (this.border / this.formatWidth * this.printWidth);
    } else {
      this.printHeight = defaultPreview / (1 + 2 * this.border / this.formatHeight);
      this.printWidth = this.formatWidth / this.formatHeight * this.printHeight;
      this.border = (this.border / this.formatHeight * this.printHeight);
    }

    this.canvasWidth = this.printWidth + 2 * this.border;
    this.canvasHeight = this.printHeight + 2 * this.border;
    this.lineWidth = this.printWidth;
    this.lineHeight = this.printHeight;

    $("input[id*='BorderCanvasText']").val(this.border).change();
  }

  CanvasFoldedPreview.prototype.setupCanvas = function() {
    CanvasPreview.prototype.setupCanvas.call(this);
    this.printWidth = this.canvasWidth;
    this.printHeight = this.canvasHeight;
  }

  PaspartuPreview.prototype.setupCanvas = function() {
    this.originalWidth = this.formatWidth | 0;
    this.originalHeight = this.formatHeight | 0;
    this.formatWidth = this.formatWidth + this.trim;
    this.formatHeight = this.formatHeight + this.trim;

    if (this.originalWidth == 140 && this.originalHeight == 140 || this.originalWidth ==
      200 && this.originalHeight == 200 || this.originalWidth ==
      112 && this.originalHeight == 112) {
      this.knownConstant = 202;
    } else if (this.originalWidth == 240 && this.originalHeight == 140 ||
      this.originalWidth == 140 && this.originalHeight == 240 || this.originalWidth ==
      300 && this.originalHeight == 200 || this.originalWidth == 200 &&
      this.originalHeight == 300 || this.originalWidth ==
      212 && this.originalHeight == 112 || this.originalWidth ==
      112 && this.originalHeight == 212) {
      this.knownConstant = 247;
    } else if (this.originalWidth == 320 && this.originalHeight == 220 ||
      this.originalWidth == 220 && this.originalHeight == 320 || this.originalWidth ==
      400 && this.originalHeight == 300 ||
      this.originalWidth == 300 && this.originalHeight == 400 || this.originalWidth ==
      302 && this.originalHeight == 202 || this.originalWidth ==
      202 && this.originalHeight == 302) {
      this.knownConstant = 254;
    } else if (this.originalWidth == 500 && this.originalHeight == 300 ||
      this.originalWidth == 300 && this.originalHeight == 500 || this.originalWidth ==
      600 && this.originalHeight == 400 ||
      this.originalWidth == 400 && this.originalHeight == 600 || this.originalWidth ==
      482 && this.originalHeight == 282 || this.originalWidth ==
      282 && this.originalHeight == 482) {
      this.knownConstant = 274;
    } else if (this.originalWidth == 320 && this.originalHeight == 320 ||
      this.originalWidth == 400 && this.originalHeight == 400 || this.originalWidth ==
      282 && this.originalHeight == 282) {
      this.knownConstant = 257;
    } else if (this.originalWidth == 680 && this.originalHeight == 480 ||
      this.originalWidth == 480 && this.originalHeight == 680 || this.originalWidth ==
      800 && this.originalHeight == 600 || this.originalWidth == 600 &&
      this.originalHeight == 800 || this.originalWidth ==
      662 && this.originalHeight == 462 || this.originalWidth ==
      462 && this.originalHeight == 662) {
      this.knownConstant = 284;
    }
    if (this.originalWidth > this.originalHeight) {
      defaultPreview = this.formatWidth / this.originalWidth * this.knownConstant;
    } else {
      defaultPreview = this.formatHeight / this.originalHeight * this.knownConstant;
    }

    Preview.prototype.setupCanvas.call(this);

    if (this.originalWidth == 140 && this.originalHeight == 140 || this.originalWidth ==
      320 && this.originalHeight == 320 ||
      this.originalWidth == 200 && this.originalHeight == 200 ||
      this.originalWidth == 400 && this.originalHeight == 400 || this.originalWidth ==
      112 && this.originalHeight == 112 || this.originalWidth ==
      282 && this.originalHeight == 282) {
      this.canvasWidth = 350;
      this.canvasHeight = 350;
    } else if (this.originalWidth == 240 && this.originalHeight == 140 ||
      this.originalWidth == 140 && this.originalHeight == 240 || this.originalWidth ==
      300 && this.originalHeight == 200 ||
      this.originalWidth == 200 && this.originalHeight == 300 || this.originalWidth ==
      212 && this.originalHeight == 112 || this.originalWidth ==
      112 && this.originalHeight == 212) {
      this.canvasWidth = 350;
      this.canvasHeight = 245;
    } else if (this.originalWidth == 320 && this.originalHeight == 220 ||
      this.originalWidth == 220 && this.originalHeight == 320 || this.originalWidth ==
      400 && this.originalHeight == 300 ||
      this.originalWidth == 300 && this.originalHeight == 400 || this.originalWidth ==
      302 && this.originalHeight == 202 || this.originalWidth ==
      202 && this.originalHeight == 302) {
      this.canvasWidth = 350;
      this.canvasHeight = 270;
    } else if (this.originalWidth == 500 && this.originalHeight == 300 ||
      this.originalWidth == 300 && this.originalHeight == 500 || this.originalWidth ==
      600 && this.originalHeight == 400 ||
      this.originalWidth == 400 && this.originalHeight == 600 || this.originalWidth ==
      482 && this.originalHeight == 282 || this.originalWidth ==
      282 && this.originalHeight == 482) {
      this.canvasWidth = 350;
      this.canvasHeight = 240;
    } else if (this.originalWidth == 680 && this.originalHeight == 480 ||
      this.originalWidth == 480 && this.originalHeight == 680 || this.originalWidth ==
      800 && this.originalHeight == 600 ||
      this.originalWidth == 600 && this.originalHeight == 800 || this.originalWidth ==
      662 && this.originalHeight == 462 || this.originalWidth ==
      462 && this.originalHeight == 662) {
      this.canvasWidth = 350;
      this.canvasHeight = 266;
    }
    this.frameSrc = "/staticimages/configurator/passepartout/frame_" + this
      .originalWidth + "x" + this.originalHeight + "mm_" + decoFrames[('f' +
        this.frame)] + ".png";
    if (this.originalWidth < this.originalHeight) {
      this.canvasHeight = [this.canvasWidth, this.canvasWidth = this.canvasHeight]
        [0];
    }

    this.leftBorder = ((this.canvasWidth - this.printWidth) / 2);
    this.topBorder = ((this.canvasHeight - this.printHeight) / 2);
    this.lineWidth = this.canvasWidth;
    this.lineHeight = this.canvasHeight;
  }

  ForexDecorPreview.prototype.setupCanvas = function() {

    this.originalWidth = this.formatWidth | 0;
    this.originalHeight = this.formatHeight | 0;
    this.formatWidth = this.formatWidth + this.trim;
    this.formatHeight = this.formatHeight + this.trim;

    if (this.formatWidth > this.formatHeight) {
      this.printWidth = defaultPreview / (1 + 2 * this.border / this.formatWidth);
      this.printHeight = this.formatHeight / this.formatWidth * this.printWidth;
      this.border = (this.border / this.formatWidth * this.printWidth);
    } else {
      this.printHeight = defaultPreview / (1 + 2 * this.border / this.formatHeight);
      this.printWidth = this.formatWidth / this.formatHeight * this.printHeight;
      this.border = (this.border / this.formatHeight * this.printHeight);
    }

    this.canvasWidth = this.printWidth + 2 * this.border;
    this.canvasHeight = this.printHeight + 2 * this.border;
    this.lineWidth = this.printWidth;
    this.lineHeight = this.printHeight;

    Preview.prototype.setupCanvas.call(this);

    if (this.originalWidth == 140 && this.originalHeight == 140 || this.originalWidth ==
      320 && this.originalHeight == 320 || this.originalWidth == 200 &&
      this.originalHeight == 200 || this.originalWidth == 400 && this.originalHeight ==
      400 || this.originalWidth == 172 && this.originalHeight == 172 ||
      this.originalWidth == 372 && this.originalHeight == 372) {
      this.canvasWidth = 350;
      this.canvasHeight = 350;
    } else if (this.originalWidth == 240 && this.originalHeight == 140 ||
      this.originalWidth == 140 && this.originalHeight == 240 || this.originalWidth ==
      300 && this.originalHeight == 200 ||
      this.originalWidth == 200 && this.originalHeight == 300 || this.originalWidth ==
      272 && this.originalHeight ==
      172 || this.originalWidth == 172 && this.originalHeight == 272) {
      this.canvasWidth = 350;
      this.canvasHeight = 245;
    } else if (this.originalWidth == 320 && this.originalHeight == 220 ||
      this.originalWidth == 220 && this.originalHeight == 320 || this.originalWidth ==
      400 && this.originalHeight == 300 ||
      this.originalWidth == 300 && this.originalHeight == 400 || this.originalWidth ==
      372 && this.originalHeight == 272 || this.originalWidth == 272 &&
      this.originalHeight == 372) {
      this.canvasWidth = 350;
      this.canvasHeight = 270;
    } else if (this.originalWidth == 500 && this.originalHeight == 300 ||
      this.originalWidth == 300 && this.originalHeight == 500 || this.originalWidth ==
      600 && this.originalHeight == 400 ||
      this.originalWidth == 400 && this.originalHeight == 600 || this.originalWidth ==
      372 && this.originalHeight == 572 || this.originalWidth == 572 &&
      this.originalHeight == 372) {
      this.canvasWidth = 350;
      this.canvasHeight = 240;
    } else if (this.originalWidth == 680 && this.originalHeight == 480 ||
      this.originalWidth == 480 && this.originalHeight == 680 || this.originalWidth ==
      800 && this.originalHeight == 600 ||
      this.originalWidth == 600 && this.originalHeight == 800 || this.originalWidth ==
      772 && this.originalHeight == 572 || this.originalWidth == 572 &&
      this.originalHeight == 772) {
      this.canvasWidth = 350;
      this.canvasHeight = 266;
    }
    this.frameSrc = "/staticimages/configurator/passepartout/frame_" + this
      .originalWidth + "x" + this.originalHeight + "mm_" + decoFrames[('f' +
        this.frame)] + ".png";
    if (this.originalWidth < this.originalHeight) {
      this.canvasHeight = [this.canvasWidth, this.canvasWidth = this.canvasHeight]
        [0];
    }

    this.leftBorder = ((this.canvasWidth - this.printWidth) / 2);
    this.topBorder = ((this.canvasHeight - this.printHeight) / 2);
    this.lineWidth = this.canvasWidth;
    this.lineHeight = this.canvasHeight;
  }

  StandardCushionPreview.prototype.setupCanvas = function() {

    this.originalWidth = this.formatWidth | 0;
    this.originalHeight = this.formatHeight | 0;
    this.formatWidth = this.formatWidth + this.trim;
    this.formatHeight = this.formatHeight + this.trim;

    if (this.originalWidth == 365 && this.originalHeight == 365) {
      this.knownConstant = 318;
    }

    if (this.originalWidth > this.originalHeight) {
      defaultPreview = this.formatWidth / this.originalWidth * this.knownConstant;
    } else {
      defaultPreview = this.formatHeight / this.originalHeight * this.knownConstant;
    }

    Preview.prototype.setupCanvas.call(this);

    if (this.originalWidth == 365 && this.originalHeight == 365) {
      this.canvasWidth = 350;
      this.canvasHeight = 350;
    }

    this.frameSrc =
      "/assets/img/checkout/cushion/standard-cushion-mask.png";

    if (this.originalWidth < this.originalHeight) {
      this.canvasHeight = [this.canvasWidth, this.canvasWidth = this.canvasHeight]
        [0];
    }

    this.leftBorder = ((this.canvasWidth - this.printWidth) / 2);
    this.topBorder = ((this.canvasHeight - this.printHeight) / 2);
    this.lineWidth = this.canvasWidth;
    this.lineHeight = this.canvasHeight;
  }

  PremiumCushionPreview.prototype.setupCanvas = function() {
    voidColor = "#ffffff";
    this.border = 0; // px
    if (this.formatWidth > this.formatHeight) {
      this.printWidth = defaultPreview - 2 * this.border;
      this.printHeight = this.formatHeight / this.formatWidth * this.printWidth;
      this.phoneMapImage =
        "/assets/img/checkout/cushion/premium-cushion-mask.png";
    } else {
      this.printHeight = defaultPreview - 2 * this.border;
      this.printWidth = this.formatWidth / this.formatHeight * this.printHeight;
      this.phoneMapImage =
        "/assets/img/checkout/cushion/premium-cushion-mask.png";
    }
    this.canvasWidth = this.printWidth + 2 * this.border;
    this.canvasHeight = this.printHeight + 2 * this.border;
    this.lineWidth = this.printWidth;
    this.lineHeight = this.printHeight;
  }

  MousePadPreview.prototype.setupCanvas = function() {
    voidColor = "#ffffff";
    this.border = 0; // px

    if (this.formatWidth > this.formatHeight) {
      this.canvasWidth = 350;
      this.canvasHeight = 291;
      this.phoneMapImage =
        "/assets/img/checkout/mousepad/mousepad-mask-landscape.png";
    } else {
      this.canvasWidth = 291;
      this.canvasHeight = 350;
      this.phoneMapImage =
        "/assets/img/checkout/mousepad/mousepad-mask-portrait.png";
    }

    this.printWidth = this.canvasWidth;
    this.printHeight = this.canvasHeight;

    this.lineWidth = numberZero;
    this.lineHeight = numberZero;
  }

  PhoneCasePreview.prototype.setupCanvas = function() {

    this.textPrintWidth = 300;
    this.textPrintHeight = 145;

    // Samsung S4
    if (this.formatWidth == 138.8 && this.formatHeight == 71.8 || this.formatWidth ==
      132 && this.formatHeight == 68) {
      this.canvasWidth = 350;
      this.canvasHeight = 204;
      this.textPrintWidth = 286;
      this.textPrintHeight = 136;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s4_topH.png";
    } else if (this.formatWidth == 71.8 && this.formatHeight == 138.8 ||
      this.formatWidth == 68 && this.formatHeight == 132) {
      this.canvasWidth = 204;
      this.canvasHeight = 350;
      this.textPrintWidth = 136;
      this.textPrintHeight = 286;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s4_top.png";

      // Samsung S5
    } else if (this.formatWidth == 144.2 && this.formatHeight == 74.4 ||
      this.formatWidth == 144 && this.formatHeight == 74) {
      this.canvasWidth = 350;
      this.canvasHeight = 202;
      this.textPrintWidth = 286;
      this.textPrintHeight = 136;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s5_topH.png";
    } else if (this.formatWidth == 74.4 && this.formatHeight == 144.2 ||
      this.formatWidth == 74 && this.formatHeight == 144) {
      this.canvasWidth = 202;
      this.canvasHeight = 350;
      this.textPrintWidth = 136;
      this.textPrintHeight = 286;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s5_top.png";

      // Samsung S6
    } else if (this.formatWidth == 143 && this.formatHeight == 70.1 || this
      .formatWidth == 141 && this.formatHeight == 68.1) {
      this.canvasWidth = 350;
      this.canvasHeight = 193;
      this.textPrintWidth = 288;
      this.textPrintHeight = 136;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s6_topH.png";
    } else if (this.formatWidth == 70.1 && this.formatHeight == 143 || this
      .formatWidth == 68.1 && this.formatHeight == 141) {
      this.canvasWidth = 193;
      this.canvasHeight = 350;
      this.textPrintWidth = 136;
      this.textPrintHeight = 288;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s6_top.png";

      // Samsung S6 Edge
    } else if (this.formatWidth == 142.1 && this.formatHeight == 70.1 ||
      this.formatWidth == 140.1 && this.formatHeight == 68.1) {
      this.canvasWidth = 350;
      this.canvasHeight = 195;
      this.textPrintWidth = 286;
      this.textPrintHeight = 136;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s6e_topH.png";
    } else if (this.formatWidth == 70.1 && this.formatHeight == 142.1 ||
      this.formatWidth == 68.1 && this.formatHeight == 140.1) {
      this.canvasWidth = 195;
      this.canvasHeight = 350;
      this.textPrintWidth = 136;
      this.textPrintHeight = 286;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s6e_top.png";

      // Samsung S7
    } else if (this.formatWidth == 144.2 && this.formatHeight == 71.4 ||
      this.formatWidth == 140.5 && this.formatHeight == 68) {
      this.canvasWidth = 350;
      this.canvasHeight = 194;
      this.textPrintWidth = 288;
      this.textPrintHeight = 140;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s7_topH.png";
    } else if (this.formatWidth == 71.4 && this.formatHeight == 144.2 ||
      this.formatWidth == 68 && this.formatHeight == 140.5) {
      this.canvasWidth = 194;
      this.canvasHeight = 350;
      this.textPrintWidth = 140;
      this.textPrintHeight = 288;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s7_top.png";

      // Samsung S7 Edge
    } else if (this.formatWidth == 152.3 && this.formatHeight == 74 || this
      .formatWidth == 149 && this.formatHeight == 70.45) {
      this.canvasWidth = 350;
      this.canvasHeight = 189;
      this.textPrintWidth = 290;
      this.textPrintHeight = 138;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s7e_topH.png";
    } else if (this.formatWidth == 74 && this.formatHeight == 152.3 || this
      .formatWidth == 70.45 && this.formatHeight == 149) {
      this.canvasWidth = 189;
      this.canvasHeight = 350;
      this.textPrintWidth = 136;
      this.textPrintHeight = 292;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s7e_top.png";

      // Samsung S8
    } else if (this.formatWidth == 150.9 && this.formatHeight == 70.1) {
      this.canvasWidth = 350;
      this.canvasHeight = 200;
      this.textPrintWidth = 286;
      this.textPrintHeight = 136;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s8_topH.png";
    } else if (this.formatWidth == 70.1 && this.formatHeight == 150.9) {
      this.canvasWidth = 200;
      this.canvasHeight = 350;
      this.textPrintWidth = 136;
      this.textPrintHeight = 286;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/samsung_s8_top.png";

      // iPhone 4
    } else if (this.formatWidth == 119.8 && this.formatHeight == 63.2 ||
      this.formatWidth == 116 && this.formatHeight == 59) {
      this.canvasWidth = 350;
      this.canvasHeight = 201;
      this.textPrintWidth = 292;
      this.textPrintHeight = 148;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone4_topH.png";
    } else if (this.formatWidth == 63.2 && this.formatHeight == 119.8 ||
      this.formatWidth == 59 && this.formatHeight == 116) {
      this.canvasWidth = 201;
      this.canvasHeight = 350;
      this.textPrintWidth = 148;
      this.textPrintHeight = 292;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone4_top.png";

      // iPhone 5
    } else if (this.formatWidth == 125 && this.formatHeight == 59.8 || this
      .formatWidth == 125 && this.formatHeight == 59) {
      this.canvasWidth = 350;
      this.canvasHeight = 193;
      this.textPrintWidth = 284;
      this.textPrintHeight = 128;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone5_topH.png";
    } else if (this.formatWidth == 59.8 && this.formatHeight == 125 || this
      .formatWidth == 59 && this.formatHeight == 125) {
      this.canvasWidth = 193;
      this.canvasHeight = 350;
      this.textPrintWidth = 128;
      this.textPrintHeight = 284;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone5_top.png";

      // iPhone 6
    } else if (this.formatWidth == 137.9 && this.formatHeight == 68.8 ||
      this.formatWidth == 136 && this.formatHeight == 65) {
      this.canvasWidth = 350;
      this.canvasHeight = 193;
      this.textPrintWidth = 288;
      this.textPrintHeight = 132;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone6_topH.png";
    } else if (this.formatWidth == 68.8 && this.formatHeight == 137.9 ||
      this.formatWidth == 65 && this.formatHeight == 136) {
      this.canvasWidth = 193;
      this.canvasHeight = 350;
      this.textPrintWidth = 132;
      this.textPrintHeight = 288;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone6_top.png";

      // iPhone 6 Plus
    } else if (this.formatWidth == 155.3 && this.formatHeight == 78 || this
      .formatWidth == 155.8 && this.formatHeight == 79.6) {
      this.canvasWidth = 350;
      this.canvasHeight = 200;
      this.textPrintWidth = 286;
      this.textPrintHeight = 136;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone6p_topH.png";
    } else if (this.formatWidth == 78 && this.formatHeight == 155.3 || this
      .formatWidth == 79.6 && this.formatHeight == 155.8) {
      this.canvasWidth = 200;
      this.canvasHeight = 350;
      this.textPrintWidth = 136;
      this.textPrintHeight = 286;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone6p_top.png";

      // iPhone 7
    } else if (this.formatWidth == 138.5 && this.formatHeight == 69.8 ||
      this.formatWidth == 136.01 && this.formatHeight == 65) {
      this.canvasWidth = 350;
      this.canvasHeight = 193;
      this.textPrintWidth = 290;
      this.textPrintHeight = 132;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone7_topH.png";
    } else if (this.formatWidth == 69.8 && this.formatHeight == 138.5 ||
      this.formatWidth == 65 && this.formatHeight == 136.01) {
      this.canvasWidth = 193;
      this.canvasHeight = 350;
      this.textPrintWidth = 132;
      this.textPrintHeight = 290;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone7_top.png";

      // iPhone 7 Plus
    } else if (this.formatWidth == 155.3 && this.formatHeight == 78.5 ||
      this.formatWidth == 156 && this.formatHeight == 80) {
      this.canvasWidth = 350;
      this.canvasHeight = 201;
      this.textPrintWidth = 300;
      this.textPrintHeight = 145;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone7p_topH.png";
    } else if (this.formatWidth == 78.5 && this.formatHeight == 155.3 ||
      this.formatWidth == 80 && this.formatHeight == 156) {
      this.canvasWidth = 201;
      this.canvasHeight = 350;
      this.textPrintWidth = 145;
      this.textPrintHeight = 300;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone7p_top.png";

      // iPhone 8
    } else if (this.formatWidth == 139 && this.formatHeight == 69.9) {
      this.canvasWidth = 350;
      this.canvasHeight = 200;
      this.textPrintWidth = 286;
      this.textPrintHeight = 136;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone8_topH.png";
    } else if (this.formatWidth == 69.9 && this.formatHeight == 139) {
      this.canvasWidth = 200;
      this.canvasHeight = 350;
      this.textPrintWidth = 136;
      this.textPrintHeight = 286;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone8_top.png";

      // iPhone 8 Plus
    } else if (this.formatWidth == 155.6 && this.formatHeight == 78.7) {
      this.canvasWidth = 350;
      this.canvasHeight = 200;
      this.textPrintWidth = 286;
      this.textPrintHeight = 136;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone8p_topH.png";
    } else if (this.formatWidth == 78.7 && this.formatHeight == 155.6) {
      this.canvasWidth = 200;
      this.canvasHeight = 350;
      this.textPrintWidth = 136;
      this.textPrintHeight = 286;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone8p_top.png";

      // iPhone X
    } else if (this.formatWidth == 145 && this.formatHeight == 72) {
      this.canvasWidth = 350;
      this.canvasHeight = 200;
      this.textPrintWidth = 286;
      this.textPrintHeight = 136;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone-x-horizontal.png";
    } else if (this.formatWidth == 72 && this.formatHeight == 145) {
      this.canvasWidth = 200;
      this.canvasHeight = 350;
      this.textPrintWidth = 136;
      this.textPrintHeight = 286;
      this.phoneMapImage =
        "/staticimages/configurator/handycase/iphone-x-vertical.png";
    }

    this.printWidth = this.canvasWidth;
    this.printHeight = this.canvasHeight;

    this.lineWidth = numberZero;
    this.lineHeight = numberZero;

    this.leftBorder = (this.canvasWidth - this.textPrintWidth) / 2;
    this.topBorder = (this.canvasHeight - this.textPrintHeight) / 2;

    this.rightBorder = this.leftBorder;
    this.bottomBorder = this.topBorder;
  }

  TshirtPreview.prototype.setupCanvas = function() {
    this.canvasWidth = 350;
    this.canvasHeight = 350;

    if (this.formatHeight == 300 || this.formatWidth == 300) { // Man tshirt
      this.printWidth = 114; // 25 cm
      this.printHeight = 137; // 30 cm
      this.leftBorder = 118;
      this.topBorder = 73;
      this.tshirtMap = "/staticimages/configurator/shirts/tshirt_male_" +
        this.tshirtType + this.colorname + ".png";
    } else { // Woman tshirt
      this.printWidth = 92; // 20 cm
      this.printHeight = 115; // 25 cm
      this.leftBorder = 129;
      this.topBorder = 84;
      this.tshirtMap = "/staticimages/configurator/shirts/tshirt_female_" +
        this.tshirtType + this.colorname + ".png";
    }
    this.rightBorder = this.leftBorder + this.printWidth;
    this.bottomBorder = this.topBorder + this.printHeight;
    this.lineWidth = numberZero;
    this.lineHeight = numberZero;
  }

  CanvasPosterPreview.prototype.setupCanvas = function() {
    CanvasPreview.prototype.setupCanvas.call(this);
    this.border = numberZero;
    this.originalWidth = this.formatWidth | 0;
    this.originalHeight = this.formatHeight | 0;

    if ((this.originalWidth == 300 && this.originalHeight == 200) ||
        (this.originalWidth == 300 && this.originalHeight == 600)) { // 30x20 cm Landscape // 30x60 cm Portrait
      this.canvasWidth = this.canvasWidth - 20;
      this.canvasHeight = this.canvasHeight - 20;
    } else if ((this.originalWidth == 400 && this.originalHeight == 200) ||
              (this.originalWidth == 400 && this.originalHeight == 300) ||
              (this.originalWidth == 400 && this.originalHeight == 800)) { // 40x20 cm Landscape // 40x30 cm Landscape // 40x80 cm Portrait
      this.canvasWidth = this.canvasWidth - 15;
      this.canvasHeight = this.canvasHeight - 15;
    } else if ((this.originalWidth == 600 && this.originalHeight == 200) ||
              (this.originalWidth == 600 && this.originalHeight == 300) ||
              (this.originalWidth == 600 && this.originalHeight == 400)) { // 60x20 cm Landscape // 60x30 cm Landscape // 60x40 cm Landscape
      this.canvasWidth = this.canvasWidth - 10;
      this.canvasHeight = this.canvasHeight - 10;
    } else if ((this.originalWidth == 300 && this.originalHeight == 400) ||
              (this.originalWidth == 600 && this.originalHeight == 600)) { // 30x40 cm Portrait // 60x60 cm Landscape
      this.canvasWidth = this.canvasWidth - 40;
      this.canvasHeight = this.canvasHeight - 40;
    } else if (this.originalWidth == 400 && this.originalHeight == 400) { // 40x40 cm Landscape
      this.canvasWidth = this.canvasWidth - 52;
      this.canvasHeight = this.canvasHeight - 52;
    } else if (this.originalWidth == 400 && this.originalHeight == 600) { // 40x60 cm Portrait
      this.canvasWidth = this.canvasWidth - 28;
      this.canvasHeight = this.canvasHeight - 28;
    } else if (this.originalWidth == 600 && this.originalHeight == 800) { // 60x80 cm Portrait
      this.canvasWidth = this.canvasWidth - 24;
      this.canvasHeight = this.canvasHeight - 24;
    }

    this.printWidth = this.canvasWidth;
    this.printHeight = this.canvasHeight;
  }

  MultiImagePreview.prototype.setupCanvas = function() {
    if (this.productid == this.fotoBox) {
      this.canvasHeight = 360;
      this.canvasWidth = (this.canvasHeight * this.formatWidth / this.formatHeight) |
        0;
    } else { // Retro Box and Magnets
      this.canvasWidth = 300;
      this.canvasHeight = (this.canvasWidth * this.formatHeight / this.formatWidth) |
        0;
    }

    if (this.imgWidth > this.imgHeight) { // landscape
      this.isLandscape = true;
      this.printHeight = this.canvasWidth;
      this.printWidth = this.canvasHeight;
      this.imgHeight = [this.imgWidth, this.imgWidth = this.imgHeight][0];
    } else { // portrait (or magnets - always square)
      this.isLandscape = false;
      // rotated:
      this.printWidth = this.canvasHeight;
      this.printHeight = this.printWidth * this.formatHeight / this.formatWidth;
    }
    this.trim = (this.trim / this.formatWidth * this.printWidth);
    this.lineWidth = numberZero;
    this.lineHeight = numberZero;
  }

  // -------------------------------------------------------------------------------
  // setCanvas
  Preview.prototype.setCanvas = function() {
    if (this.clipPath != null) {
      fbCanvas.clipTo = function (ctx) {

        ctx.strokeStyle = 'rgba(0,0,0,0.0)';
				ctx.beginPath();

				var aClipPath = preview.clipPath.split("close;");
				for (var j = 0; j < aClipPath.length; j++) {

					if (aClipPath[j] != "") {

						var itemClipPath = aClipPath[j].split(",");

						ctx.moveTo((itemClipPath[0].split(":")[0]*preview.clipResizeX),(itemClipPath[0].split(":")[1]*preview.clipResizeY));

						for (var i = 1; i < itemClipPath.length; i++) {
							if (itemClipPath[i] != null) {
								var point = itemClipPath[i].split(":");
								ctx.lineTo((point[0]*preview.clipResizeX), (point[1]*preview.clipResizeY));
							}
						}

						ctx.closePath();
					}
				}


				ctx.stroke();
      };
    } else {
      fbCanvas.clipTo = null;
    }

    fbCanvas.setHeight(this.canvasHeight);
    fbCanvas.setWidth(this.canvasWidth);
    fbCanvas.on("object:moving", function(e) {
      var activeObject = e.target;
      if (activeObject && activeObject.id === bgId) {
        preview.callMove();
        SaveCanvasPositionZoom();
      }
    });
    fbCanvas.on("object:modified", function(e) {
      var activeObject = e.target;
      if (activeObject && activeObject.id === bgId) {
        preview.readOffset();
      }
    });
  }

  // ---------------------------------------------------------------------------------
  // completePreview
  Preview.prototype.completePreview = function(doSave) {

    var ScaleUpLocal = numberOne;
    if (typeof TextEditMode != "undefined" && TextEditMode) {
      ScaleUpLocal = ScaleUp;
    }

    var offsetX = (parseInt(linkImageWidth) - this.printWidth) / 2;
    var offsetY = (parseInt(linkImageHeight) - this.printHeight) / 2;

    if (offsetX < numberZero) {
      offsetX = numberZero;
    }
    if (offsetY < numberZero) {
      offsetY = numberZero;
    }
    if (zoomVal == numberOne) {
      if (offsetX < offsetY) {
        offsetX = numberZero;
      } else {
        offsetY = numberZero;
      }
    }

    if (offsetX == numberZero && offsetY == numberZero) {
      this.movable = false;
    } else {
      this.movable = true;
    }

    preview.setupOffset(offsetX, offsetY);
    if (!!document.getElementById("scaleCanvas")) {
      document.getElementById("scaleCanvas").value = (zoomVal - 1) * 100;
    }

    FrameLoaded = false;
    preview.setupBorder();

    if (this.tiles > numberOne) {
      preview.buildTiles(this.lineWidth, this.lineHeight, this.border);
    }

    fbCanvas.renderAll();
    MakeMobileReadOnly();

    if (this.lineWidth > numberZero) {
      if (this.material == materials.pillow) {
        $('#ch').css('top', '0px').css('bottom', '0px');
        $('#cw').css('left', '0px').css('right', '0px');
      } else {
        $('#ch').css('top', (this.border + this.border10mm) + 'px').css(
          'bottom', (this.border + this.border10mm) + 'px');
        $('#cw').css('left', (this.border + this.border10mm) + 'px').css(
          'right', (this.border + this.border10mm) + 'px');
      }
    }

    preview.setupParams();
    calcParams = false;
    preview.finish(doSave);
    preview.showEditor(AutoLoad);
  }

  // ------------------------------------------------------------ movable

  Preview.prototype.setupMovable = function(isMovable) {
    if (isMovable) {
      $(".isMove").css("display", "block");
      $(".notMove").css("display", "none");
      $("#moving-tooltip > p").css("display", "block");
      $("#moving-tooltip p:last").css("display", "none");
    } else {
      $(".isMove").css("display", "none");
      $(".notMove").css("display", "block");
      $("#moving-tooltip > p").css("display", "none");
      $("#moving-tooltip p:last").css("display", "block");
    }
  }

  // ------------------------------------------------------------ finish

  Preview.prototype.showEditor = function(doShow) {
    if (doShow) {
      $(".AddTextButtonLabel").ready(function() {
        setTimeout(function() {
          $(".AddTextButton").trigger("click");
        }, 100);
      });
    }
  }

  // ------------------------------------------------------------ finish

  Preview.prototype.finish = function(doSave) {}

  MultiImagePreview.prototype.finish = function(doSave) {
    if (doSave) {
      blocker.block();
      preview.cropPreview();
    }
  }

  // ---------------------------------------------------------------------
  // setupOffset
  Preview.prototype.setupOffset = function(offsetX, offsetY) {

    var ScaleUpLocal = numberOne;
    if (typeof TextEditMode != "undefined" && TextEditMode) {
      ScaleUpLocal = ScaleUp;
    }

    if (offX < numberZero) {
      if (!formatChange) {
        if (offXf < numberZero) {
          formatChangeF = true; // reset
        }
        preview.loadCutoutParams();
      }
      formatChange = false;
      if (offX < numberZero) {
        offX = offsetX;
        offY = offsetY;
      }
    }
    if (rotateAction) {
      offX = offsetX;
      offY = offsetY;
    }
    preview.setupImage(offX, offY);
  }

  CanvasFoldedPreview.prototype.setupOffset = function(offsetX, offsetY) {
    if (offXf < numberZero) {
      if (!formatChangeF) {
        if (offX < numberZero) {
          formatChange = true; // reset
        }
        preview.loadCutoutParams();
      }
      formatChangeF = false;
      if (offXf < numberZero) {
        offXf = offsetX;
        offYf = offsetY;
      }
    }
    if (rotateAction) {
      offXf = offsetX;
      offYf = offsetY;
    }
    Preview.prototype.setupImage.call(this, offXf, offYf);
  }

  MultiImagePreview.prototype.setupOffset = function(offsetX, offsetY) {
    var cropInfoX = document.getElementById('itemConfiguratorForm:cutoutX')
      .value;
    if (cropInfoX == 'null' || cropInfoX == null || cropInfoX == 'NaN') {
      offX = offsetX;
      offY = offsetY;
    } else {
      preview.loadCutoutParams();
    }
    preview.setupImage(offX, offY);
  }

  // ------------------------------------------------------------------------
  // setupImage
  Preview.prototype.setupImage = function(ox, oy) {
    bgImage = new fabric.Image(linkImage, {
      scaleX: preview.sizeFactor,
      scaleY: preview.sizeFactor,
      left: -ox,
      top: -oy,
      id: bgId,
      hasControls: false,
      hasBorders: false,
      selectable: preview.movable
    });

    preview.setZoom();
    bgImage.XZIndex = numberZero;
    fbCanvas.insertAt(bgImage, bgImage.XZIndex);
    preview.flipRotatedImage();
    preview.callMove();
  }

  CanvasPreview.prototype.setupImage = function(ox, oy) {
    Preview.prototype.setupImage.call(this, offX - this.border, offY - this
      .border);
  }

  PaspartuPreview.prototype.setupImage = function(ox, oy) {
    Preview.prototype.setupImage.call(this, offX - this.leftBorder, offY -
      this.topBorder);
  }

  ForexDecorPreview.prototype.setupImage = function(ox, oy) {
    Preview.prototype.setupImage.call(this, offX - this.leftBorder, offY -
      this.topBorder);
  }

  StandardCushionPreview.prototype.setupImage = function(ox, oy) {
    Preview.prototype.setupImage.call(this, offX - this.leftBorder, offY -
      this.topBorder);
  }

  BlanketPremiumPreview.prototype.setupImage = function(ox, oy) {
    Preview.prototype.setupImage.call(this, offX - this.border, offY - this
      .border);
  }

  TshirtPreview.prototype.setupImage = function(ox, oy) {
    new fabric.Image.fromURL(preview.tshirtMap, function(aMap) {
      aMap.left = 0;
      aMap.top = 0;
      aMap.XZIndex = numberZero;
      fbCanvas.add(aMap);

      bgImage = new fabric.Image(linkImage, {
        scaleX: preview.sizeFactor,
        scaleY: preview.sizeFactor,
        left: preview.leftBorder - ox,
        top: preview.topBorder - oy,
        id: bgId,
        hasControls: false,
        hasBorders: false,
        selectable: preview.movable
      });

      preview.setZoom();
      bgImage.XZIndex = numberZero;
      fbCanvas.insertAt(bgImage, bgImage.XZIndex);

      preview.flipRotatedImage();
      preview.callMove();

      var colorImage = new fabric.Rect({
        fill: shadeColor(preview.materialcolor, 0.5),
        width: fbCanvas.width,
        height: fbCanvas.height,
        hasControls: false,
        hasBorders: false,
        selectable: preview.movable,
        evented: false
      });
      colorImage.XZIndex = numberZero;
      fbCanvas.insertAt(colorImage, colorImage.XZIndex);

    }, {
      hasControls: false,
      hasBorders: false,
      selectable: false,
      id: "tshirtMapImage",
      evented: false
    });
  }

  MultiImagePreview.prototype.setupImage = function(ox, oy) {
    Preview.prototype.setupImage.call(this, ox, oy);
  }
  PremiumCushionPreview.prototype.setupImage = function(ox, oy) {
    new fabric.Image.fromURL(this.phoneMapImage, function(img) {
      img.left = numberZero;
      img.top = numberZero;
      img.width = fbCanvas.width;
      img.height = fbCanvas.height;
      img.XZIndex = numberZero;
      fbCanvas.add(img);

      bgImage = new fabric.Image(linkImage, {
        scaleX: preview.sizeFactor,
        scaleY: preview.sizeFactor,
        left: -ox,
        top: -oy,
        id: bgId,
        hasControls: false,
        hasBorders: false,
        selectable: preview.movable
      });

      preview.setZoom();
      bgImage.XZIndex = numberZero;
      fbCanvas.insertAt(bgImage, bgImage.XZIndex);
      preview.flipRotatedImage();
      fbCanvas.renderAll();
      preview.callMove();
      MakeMobileReadOnly();
    }, {
      hasControls: false,
      hasBorders: false,
      id: "phoneMapImage",
      selectable: false,
      evented: false
    });
  }

  CanvasPosterPreview.prototype.setupImage = function(ox, oy) {
    Preview.prototype.setupImage.call(this, ox, oy);
  }

  MousePadPreview.prototype.setupImage = function(ox, oy) {
    new fabric.Image.fromURL(this.phoneMapImage, function(img) {
      img.left = numberZero;
      img.top = numberZero;
      img.XZIndex = numberZero;
      fbCanvas.add(img);

      bgImage = new fabric.Image(linkImage, {
        scaleX: preview.sizeFactor,
        scaleY: preview.sizeFactor,
        left: -ox,
        top: -oy,
        id: bgId,
        hasControls: false,
        hasBorders: false,
        selectable: preview.movable
      });

      preview.setZoom();
      bgImage.XZIndex = numberZero;
      fbCanvas.insertAt(bgImage, bgImage.XZIndex);
      preview.flipRotatedImage();
      fbCanvas.renderAll();
      preview.callMove();
      MakeMobileReadOnly();
    }, {
      hasControls: false,
      hasBorders: false,
      id: "phoneMapImage",
      selectable: false,
      evented: false
    });
  }

  PhoneCasePreview.prototype.setupImage = function(ox, oy) {
    new fabric.Image.fromURL(this.phoneMapImage, function(img) {
      img.left = numberZero;
      img.top = numberZero;
      img.XZIndex = numberZero;
      fbCanvas.add(img);

      bgImage = new fabric.Image(linkImage, {
        scaleX: preview.sizeFactor,
        scaleY: preview.sizeFactor,
        left: -ox,
        top: -oy,
        id: bgId,
        hasControls: false,
        hasBorders: false,
        selectable: preview.movable
      });

      preview.setZoom();
      bgImage.XZIndex = numberZero;
      fbCanvas.insertAt(bgImage, bgImage.XZIndex);
      preview.flipRotatedImage();
      fbCanvas.renderAll();
      preview.callMove();
      MakeMobileReadOnly();
    }, {
      hasControls: false,
      hasBorders: false,
      id: "phoneMapImage",
      selectable: false,
      evented: false
    });
  }

  // ------------------------------------------------------------ setZoom
  Preview.prototype.setZoom = function() {
    bgImage.scale((preview.sizeFactor + (zoomVal - 1) * preview.sizeFactor));
    updateMove();
  }

  MultiImagePreview.prototype.setZoom = function() {}

  // ------------------------------------------------------------
  // flipRotatedImage
  Preview.prototype.flipRotatedImage = function() {
    var flipR = this.rotation / 90 % 4;
    if (this.isRotated && flipR == 1) {
      bgImage.set('flipX', true);
      bgImage.set('flipY', true);
    } else if (!this.isRotated && flipR == 2) {
      bgImage.set('flipX', true);
      bgImage.set('flipY', true);
    }
  }

  MultiImagePreview.prototype.flipRotatedImage = function() {
    var flipR = this.rotation / 90 % 4;
    if (this.isRotated && flipR == 3 && !this.isLandscape) {
      bgImage.set('flipX', true);
      bgImage.set('flipY', true);
    } else if (this.isRotated && flipR == 3 && this.isLandscape) {
      bgImage.set('flipX', true);
      bgImage.set('flipY', true);
    } else if (!this.isRotated && flipR == 2 && !this.isLandscape) {
      bgImage.set('flipX', true);
      bgImage.set('flipY', true);
    } else if (!this.isRotated && flipR == parseFloat(0) && this.isLandscape) {
      bgImage.set('flipX', true);
      bgImage.set('flipY', true);
    }
  }

  // ------------------------------------------------------------ callMove
  Preview.prototype.callMove = function() {
    preview.pictureMoving(numberZero, numberZero);
  }

  CanvasPreview.prototype.callMove = function() {
    preview.pictureMoving(this.border, this.border);
  }

  CanvasFoldedPreview.prototype.callMove = function() {
    Preview.prototype.callMove.call(this);
  }

  BorderedAsyncPreview.prototype.callMove = function() {
    preview.pictureMoving(this.topBorder, this.leftBorder);
  }

  // --------------------------------------------------------------------
  // setupBorder
  Preview.prototype.setupBorder = function() {
    if (this.frame >= dekoFramesFix) {
      var decoBorder = this.border + this.border10mm;
      /*
       * makeColorBorder(fbCanvas.width, fbCanvas.height, decoBorder,
       * voidColor, false);
       */
      if (this.border > numberZero) {
        makeColorBorder(fbCanvas.width, fbCanvas.height, this.border,
          voidColor, false);
      }
    } else if (this.material != materials.canvas) {
      if (this.border > numberZero) {
        makeColorBorder(fbCanvas.width, fbCanvas.height, this.border,
          voidColor, false);
      }
    }

    insertSafeZone(this.material, this.formatWidth, this.formatHeight, this
      .canvasWidth, this.canvasHeight, this.border, this.border);
  }

  MultiImagePreview.prototype.setupBorder = function() {
    if (this.trim > numberZero) {
      makeColorBorder(fbCanvas.width, fbCanvas.height, this.trim, voidColor,
        false);
    }
  }

  BlanketStandardPreview.prototype.setupBorder = function() {
    console.log('aa')
    if (c0 == null) {
      c0 = document.createElement("canvas");
    } else {
      c0.getContext("2d").clearRect(numberZero, numberZero, c0.width, c0.height);
    }
    c0.width = this.canvasWidth;
    c0.height = this.canvasHeight + 1;
    var ctx = c0.getContext("2d");
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fillRect(0, 0, c0.width, c0.height);

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.globalCompositeOperation = "destination-out";
    var rectX = this.border;
    var rectY = this.border;
    var rectWidth = this.lineWidth;
    var rectHeight = this.lineHeight;
    var cornerRadius = this.border * 3;
    ctx.lineJoin = "round";
    ctx.lineWidth = cornerRadius;

    // Change origin and dimensions to match true size (a stroke makes the shape
    // a
    // bit larger):
    ctx.strokeRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2),
      rectWidth - cornerRadius, rectHeight - cornerRadius);
    ctx.fillRect(rectX + (cornerRadius / 2), rectY + (cornerRadius / 2),
      rectWidth - cornerRadius, rectHeight - cornerRadius);

    ctx.globalCompositeOperation = "source-over"; // restore

    var imgData = c0.toDataURL("image/png");
    new fabric.Image.fromURL(imgData, function(img) {
      img.left = 0;
      img.top = 0;
      img.XZIndex = numberZero;
      fbCanvas.add(img);
    }, {
      id: BorderId,
      hasControls: false,
      hasBorders: false,
      selectable: false,
      evented: false
    });

    insertSafeZone(this.material, this.formatWidth, this.formatHeight, this
      .canvasWidth, this.canvasHeight, this.border, this.border);
  }

  CanvasPreview.prototype.setupBorder = function() {
    if (this.frame > 0) {
      makeFrameBorder(fbCanvas.width, fbCanvas.height, this.border,
        "rgba(255, 255, 255, 0.5)", false);
    } else {
      makeColorBorder(fbCanvas.width, fbCanvas.height, this.border,
        "rgba(255, 255, 255, 0.5)", false);
      preview.drawBorders();
    }

    insertSafeZone(this.material, this.formatWidth, this.formatHeight, this
      .canvasWidth, this.canvasHeight, this.border, this.border);
  }

  CanvasFoldedPreview.prototype.setupBorder = function() {
    if (this.frame > 0) {
      makeFrameBorder(fbCanvas.width, fbCanvas.height, this.border,
        "rgba(255, 255, 255, 0.5)", false);
    } else {
      makeColorBorder(fbCanvas.width, fbCanvas.height, this.border,
        "rgba(255, 255, 255, 0.5)", false);
      this.setupBorderSub();
    }

    insertSafeZone(this.material, this.formatWidth, this.formatHeight, this
      .canvasWidth, this.canvasHeight, this.border, this.border);
  }

  CanvasPreview.prototype.setupBorderSub = function() {
    // Corner Borders
    makeBorderPart(0, 0, this.border, this.border, voidColor, fbCanvas);
    makeBorderPart(0, (fbCanvas.height - this.border), this.border, this.border,
      voidColor, fbCanvas);
    makeBorderPart((fbCanvas.width - this.border), (fbCanvas.height - this.border), (
      this.border + 1), this.border, voidColor, fbCanvas);
    makeBorderPart((fbCanvas.width - this.border), 0, (this.border + 1),
      this.border, voidColor, fbCanvas);
  }

  StandardCushionPreview.prototype.setupBorder = function() {
    var passLeft = ((this.canvasWidth - (this.originalWidth / this.formatWidth *
      this.printWidth)) / 2);
    var passTop = ((this.canvasHeight - (this.originalHeight / this.formatHeight *
      this.printHeight)) / 2);

    makeBorderPart(0, 0, passLeft, this.canvasHeight, "#ffffff", fbCanvas,
      false, false, "BorderLeft");
    makeBorderPart(0, 0, this.canvasWidth, passTop, "#ffffff", fbCanvas,
      false, false, "BorderTop");
    makeBorderPart((this.canvasWidth - passLeft), 0, passLeft, this.canvasHeight,
      "#ffffff", fbCanvas, false, false, "BorderRight");
    makeBorderPart(0, (this.canvasHeight - passTop), this.canvasWidth,
      passTop, "#ffffff", fbCanvas, false, false, "BorderBottom");

    new fabric.Image.fromURL(this.frameSrc, function(img) {
      img.left = 0;
      img.top = 0;
      img.XZIndex = numberZero;
      fbCanvas.add(img);
    }, {
      hasControls: false,
      id: "PhoneMapImage",
      hasBorders: false,
      selectable: false,
      evented: false
    });

    insertSafeZone(this.material, this.formatWidth, this.formatHeight, this
      .canvasWidth, this.canvasHeight, passLeft, passTop);
  }

  PaspartuPreview.prototype.setupBorder = function() {
    var passLeft = ((this.canvasWidth - (this.originalWidth / this.formatWidth *
      this.printWidth)) / 2);
    var passTop = ((this.canvasHeight - (this.originalHeight / this.formatHeight *
      this.printHeight)) / 2);

    makeBorderPart(0, 0, passLeft, this.canvasHeight, "#ffffff", fbCanvas,
      false, false, "BorderLeft");
    makeBorderPart(0, 0, this.canvasWidth, passTop, "#ffffff", fbCanvas,
      false, false, "BorderTop");
    makeBorderPart((this.canvasWidth - passLeft), 0, passLeft, this.canvasHeight,
      "#ffffff", fbCanvas, false, false, "BorderRight");
    makeBorderPart(0, (this.canvasHeight - passTop), this.canvasWidth,
      passTop, "#ffffff", fbCanvas, false, false, "BorderBottom");

    new fabric.Image.fromURL(this.frameSrc, function(img) {
      img.left = 0;
      img.top = 0;
      img.XZIndex = numberZero;
      fbCanvas.add(img);
    }, {
      hasControls: false,
      id: "PaspartuMapImage",
      hasBorders: false,
      selectable: false,
      evented: false
    });

    insertSafeZone(this.material, this.formatWidth, this.formatHeight, this
      .canvasWidth, this.canvasHeight, passLeft, passTop);
  }

  ForexDecorPreview.prototype.setupBorder = function() {
    var passLeft = ((this.canvasWidth - (this.originalWidth / this.formatWidth *
      this.printWidth)) / 2);
    var passTop = ((this.canvasHeight - (this.originalHeight / this.formatHeight *
      this.printHeight)) / 2);

    new fabric.Image.fromURL(this.frameSrc, function(img) {
      img.left = 0;
      img.top = 0;
      img.XZIndex = numberZero;
      fbCanvas.add(img);
    }, {
      hasControls: false,
      id: "PaspartuMapImage",
      hasBorders: false,
      selectable: false,
      evented: false
    });

    insertSafeZone(this.material, this.formatWidth, this.formatHeight, this
      .canvasWidth, this.canvasHeight, passLeft, passTop);
  }

  PhoneCasePreview.prototype.setupBorder = function() {
    insertBorderPart(0, 0, this.leftBorder, this.canvasHeight,
      "transparent", fbCanvas, "SaveBorderLeft");
    insertBorderPart(0, 0, this.canvasWidth, this.topBorder, "transparent",
      fbCanvas, "SaveBorderTop");
    insertBorderPart(this.canvasWidth - this.rightBorder, 0, this.rightBorder,
      this.canvasHeight, "transparent", fbCanvas, "SaveBorderRight");
    insertBorderPart(0, this.canvasHeight - this.bottomBorder, this.canvasWidth,
      this.bottomBorder, "transparent", fbCanvas, "SaveBorderBottom");

    insertSafeZone(this.material, this.formatWidth, this.formatHeight, this
      .canvasWidth, this.canvasHeight, this.border, this.border);
  }

  TshirtPreview.prototype.setupBorder = function() {
    insertBorderPart(0, 0, this.leftBorder, this.canvasHeight, "#ffffff",
      fbCanvas, "BorderLeft");
    insertBorderPart(0, 0, this.canvasWidth, this.topBorder, "#ffffff",
      fbCanvas, "BorderTop");
    insertBorderPart(this.rightBorder, 0, this.leftBorder, this.canvasHeight,
      "#ffffff", fbCanvas, "BorderRight");
    insertBorderPart(0, this.bottomBorder, this.canvasWidth, this.canvasHeight -
      this.bottomBorder, "#ffffff", fbCanvas, "BorderBottom");

    insertSafeZone(this.material, this.formatWidth, this.formatHeight, this
      .canvasWidth, this.canvasHeight, this.border, this.border);
  }

  CanvasPreview.prototype.drawBorders = function() {
    var img = new Image();
    img.onload = function() {
      if ('BLACK' == preview.bordereffect) {
        makeColorBorder(fbCanvas.width, fbCanvas.height, preview.border,
          "#000000", false);
      } else if ('WHITE' == preview.bordereffect) {
        makeColorBorder(fbCanvas.width, fbCanvas.height, preview.border,
          "#ffffff", true);
      } else if ('STRETCHED' == preview.bordereffect) {
        preview.drawCanvasSample(img);
        preview.makeStretched(preview.border | 0);
      } else if ('MIRRORED' == preview.bordereffect) {
        preview.drawCanvasSample(img);
        preview.makeMirrored(preview.printWidth, preview.printHeight,
          preview.border | 0);
      }
      if (preview.tiles > 1) {
        preview.buildTiles(preview.lineWidth, preview.lineHeight, preview
          .border);
      }
      preview.setupBorderSub();
      fbCanvas.renderAll();
    }
    img.src = bgImage.toDataURL();
  }

  //=======================================================================================================
  //================================== SAMPLE IMAGE (to extract borders) ==================================
  //=======================================================================================================

  CanvasPreview.prototype.drawCanvasSample = function(printImage) {

    var ScaleUpLocal = numberOne;
    if (typeof TextEditMode != "undefined" && TextEditMode) {
      ScaleUpLocal = ScaleUp;
    }

    if (c0 == null) {
      c0 = document.createElement("canvas");
    } else {
      c0.getContext("2d").clearRect(numberZero * ScaleUpLocal, numberZero *
        ScaleUpLocal, c0.width * ScaleUpLocal, c0.height * ScaleUpLocal);
    }
    var ctx = c0.getContext("2d");
    c0.width = Math.ceil(this.printWidth * ScaleUpLocal);
    c0.height = Math.ceil(this.printHeight * ScaleUpLocal);
    var sourceX = Math.ceil(offX);
    var sourceY = Math.ceil(offY);
    var sourceWidth = c0.width;
    var sourceHeight = c0.height;
    if (sourceWidth + sourceX > printImage.width)
      sourceWidth = printImage.width - sourceX;
    if (sourceHeight + sourceY > printImage.height)
      sourceHeight = printImage.height - sourceY;
    var destWidth = c0.width;
    var destHeight = c0.height;
    var destX = numberZero;
    var destY = numberZero;
    ctx.drawImage(printImage, sourceX, sourceY, sourceWidth, sourceHeight,
      destX, destY, destWidth, destHeight);
  }

  CanvasPreview.prototype.makeStretched = function(border) {
    var c = c0;
    var destW = c0.width;
    var destH = c0.height;
    var ctx = c.getContext("2d");

    if (c2 == null) {
      c2 = document.createElement("canvas");
    } else {
      c2.getContext("2d").clearRect(numberZero, numberZero, c2.width, c2.height);
    }

    //=======================================================================================================
    //======================================= TEXT EDITOR SCALE =============================================
    //=======================================================================================================

    var ScaleUpLocal = numberOne;
    if (typeof TextEditMode != "undefined" && TextEditMode) {
      ScaleUpLocal = ScaleUp;
    }

    if (ScaleUpLocal > 1) {
      destW = destW * ScaleUpLocal;
      destH = destH * ScaleUpLocal;
      border = border * ScaleUpLocal;
    }

    var sourceX = destW - 0.3;
    var sourceY = numberZero;
    var sourceWidth = 0.3;
    var sourceHeight = destH;
    if (destW > c.width)
      sourceX = c.width - 0.3;
    if (sourceHeight > c.height)
      sourceHeight = c.height;
    var destX = numberZero;
    var destY = numberZero;
    var destWidth = border;
    var destHeight = sourceHeight;
    c2.width = destWidth;
    c2.height = destHeight;
    ctx2 = c2.getContext("2d");
    ctx2.drawImage(ctx.canvas, sourceX, sourceY, sourceWidth, sourceHeight,
      destX, destY, destWidth, destHeight);

    var imgData = c2.toDataURL();
    fabric.Image.fromURL(imgData, function(img) {
      fbCanvas.remove(preview.imRight);
      preview.imRight = img;
      preview.imRight.left = fbCanvas.width - border;
      preview.imRight.top = border;
      preview.imRight.XZIndex = numberOne;
      fbCanvas.insertAt(preview.imRight, preview.imRight.XZIndex);
    }, {
      hasControls: false,
      hasBorders: false,
      selectable: false
    });

    sourceX = numberZero;
    sourceY = numberZero;
    sourceWidth = destW;
    sourceHeight = 0.3;
    if (sourceWidth > c.width)
      sourceWidth = c.width;
    destX = numberZero;
    destY = numberZero;
    destWidth = sourceWidth;
    destHeight = border;
    c2.getContext("2d").clearRect(numberZero, numberZero, c2.width, c2.height);
    c2.width = destWidth;
    c2.height = destHeight;
    ctx2 = c2.getContext("2d");
    ctx2.drawImage(ctx.canvas, sourceX, sourceY, sourceWidth, sourceHeight,
      destX, destY, destWidth, destHeight);

    imgData = c2.toDataURL();
    fabric.Image.fromURL(imgData, function(img) {
      fbCanvas.remove(preview.imTop);
      preview.imTop = img;
      preview.imTop.left = border;
      preview.imTop.top = numberZero;
      preview.imTop.XZIndex = numberOne;
      fbCanvas.insertAt(preview.imTop, preview.imTop.XZIndex);
    }, {
      hasControls: false,
      hasBorders: false,
      selectable: false
    });

    sourceX = numberZero;
    sourceY = numberZero;
    sourceWidth = 0.3;
    sourceHeight = destH;
    if (sourceHeight > c.height)
      sourceHeight = c.height;
    destX = numberZero;
    destY = numberZero;
    destWidth = border;
    destHeight = sourceHeight;
    c2.getContext("2d").clearRect(numberZero, numberZero, c2.width, c2.height);
    c2.width = destWidth;
    c2.height = destHeight;
    ctx2 = c2.getContext("2d");
    ctx2.drawImage(ctx.canvas, sourceX, sourceY, sourceWidth, sourceHeight,
      destX, destY, destWidth, destHeight);

    imgData = c2.toDataURL();
    fabric.Image.fromURL(imgData, function(img) {
      fbCanvas.remove(preview.imLeft);
      preview.imLeft = img;
      preview.imLeft.left = numberZero;
      preview.imLeft.top = border;
      preview.imLeft.XZIndex = numberOne;
      fbCanvas.insertAt(preview.imLeft, preview.imLeft.XZIndex);
    }, {
      hasControls: false,
      hasBorders: false,
      selectable: false
    });

    sourceX = numberZero;
    sourceY = destH - 0.3;
    sourceWidth = destW;
    sourceHeight = 0.3;
    if (sourceWidth > c.width)
      sourceWidth = c.width;
    if (destH > c.height)
      sourceY = c.height - 0.3;
    destX = numberZero;
    destY = numberZero;
    destWidth = sourceWidth;
    destHeight = border;
    c2.getContext("2d").clearRect(numberZero, numberZero, c2.width, c2.height);
    c2.width = destWidth;
    c2.height = destHeight;
    ctx2 = c2.getContext("2d");
    ctx2.drawImage(ctx.canvas, sourceX, sourceY, sourceWidth, sourceHeight,
      destX, destY, destWidth, destHeight);

    imgData = c2.toDataURL();
    fabric.Image.fromURL(imgData, function(img) {
      fbCanvas.remove(preview.imBottom);
      preview.imBottom = img;
      preview.imBottom.left = border;
      preview.imBottom.top = fbCanvas.height - border;
      preview.imBottom.XZIndex = numberOne;
      fbCanvas.insertAt(preview.imBottom, preview.imBottom.XZIndex);
    }, {
      hasControls: false,
      hasBorders: false,
      selectable: false
    });
  }

  CanvasPreview.prototype.makeMirrored = function(destW, destH, border) {

    //=======================================================================================================
    //======================================= TEXT EDITOR SCALE =============================================
    //=======================================================================================================

    var ScaleUpLocal = numberOne;
    if (typeof TextEditMode != "undefined" && TextEditMode) {
      ScaleUpLocal = ScaleUp;
    }

    if (ScaleUpLocal > 1) {
      destW = destW * ScaleUpLocal;
      destH = destH * ScaleUpLocal;
      border = border * ScaleUpLocal;
    }

    //=======================================================================================================
    //=======================================================================================================

    var c = c0;
    var ctx = c.getContext("2d");

    if (c2 == null) {
      c2 = document.createElement("canvas");
    } else {
      c2.getContext("2d").clearRect(numberZero, numberZero, c2.width, c2.height);
    }

    //=======================================================================================================
    //======================================= RIGHT BORDER (Mirored) ========================================
    //=======================================================================================================

    var sourceX = destW - border;
    var sourceY = numberZero;
    var sourceWidth = border;
    var sourceHeight = destH;
    if (destW > c.width)
      sourceX = c.width - border;
    if (sourceHeight > c.height)
      sourceHeight = c.height;
    var destX = numberZero;
    var destY = numberZero;
    var destWidth = border;
    var destHeight = sourceHeight;
    c2.width = destWidth;
    c2.height = destHeight;
    ctx2 = c2.getContext("2d");
    ctx2.save();
    ctx2.translate(border, 0);
    ctx2.scale(-1, 1);
    ctx2.drawImage(ctx.canvas, sourceX, sourceY, sourceWidth, sourceHeight,
      destX, destY, destWidth, destHeight);
    ctx2.restore();

    var imgData = c2.toDataURL();
    fabric.Image.fromURL(imgData, function(img) {
      fbCanvas.remove(preview.imRight);
      preview.imRight = img;
      preview.imRight.left = fbCanvas.width - border;
      preview.imRight.top = border;
      preview.imRight.XZIndex = numberOne;
      fbCanvas.insertAt(preview.imRight, preview.imRight.XZIndex);
    }, {
      hasControls: false,
      hasBorders: false,
      selectable: false
    });

    //=======================================================================================================
    //======================================= LEFT BORDER (Mirored) ========================================
    //=======================================================================================================

    sourceX = numberZero;
    sourceY = numberZero;
    sourceWidth = border;
    sourceHeight = destH;
    if (sourceHeight > c.height)
      sourceHeight = c.height;
    destX = numberZero;
    destY = numberZero;
    destWidth = border;
    destHeight = sourceHeight;
    c2.getContext("2d").clearRect(numberZero, numberZero, c2.width, c2.height);
    c2.width = destWidth;
    c2.height = destHeight;
    ctx2 = c2.getContext("2d");
    ctx2.save();
    ctx2.translate(border, 0);
    ctx2.scale(-1, 1);
    ctx2.drawImage(ctx.canvas, sourceX, sourceY, sourceWidth, sourceHeight,
      destX, destY, destWidth, destHeight);
    ctx2.restore();

    imgData = c2.toDataURL();
    fabric.Image.fromURL(imgData, function(img) {
      fbCanvas.remove(preview.imLeft);
      preview.imLeft = img;
      preview.imLeft.left = numberZero;
      preview.imLeft.top = border;
      preview.imLeft.XZIndex = numberOne;
      fbCanvas.insertAt(preview.imLeft, preview.imLeft.XZIndex);
    }, {
      hasControls: false,
      hasBorders: false,
      selectable: false
    });

    //=======================================================================================================
    //======================================= TOP BORDER (Mirored) ==========================================
    //=======================================================================================================

    sourceX = numberZero;
    sourceY = numberZero;
    sourceWidth = destW;
    sourceHeight = border;
    if (sourceWidth > c.width)
      sourceWidth = c.width;
    destX = numberZero;
    destY = numberZero;
    destWidth = sourceWidth;
    destHeight = border;
    c2.getContext("2d").clearRect(0, 0, c2.width * ScaleUpLocal, c2.height *
      ScaleUpLocal);
    c2.width = destWidth;
    c2.height = destHeight;
    ctx2 = c2.getContext("2d");
    ctx2.save();
    ctx2.translate(0, border);
    ctx2.scale(1, -1);
    ctx2.drawImage(ctx.canvas, sourceX, sourceY, sourceWidth, sourceHeight,
      destX, destY, destWidth, destHeight);
    ctx2.restore();

    imgData = c2.toDataURL();
    fabric.Image.fromURL(imgData, function(img) {
      fbCanvas.remove(preview.imTop);
      preview.imTop = img;
      preview.imTop.left = border;
      preview.imTop.top = numberZero;
      preview.imTop.XZIndex = numberOne;
      fbCanvas.insertAt(preview.imTop, preview.imTop.XZIndex);
    }, {
      hasControls: false,
      hasBorders: false,
      selectable: false
    });

    //=======================================================================================================
    //======================================= BOTTOM BORDER (Mirored) ==========================================
    //=======================================================================================================

    sourceX = numberZero;
    sourceY = destH - border;
    sourceWidth = destW;
    sourceHeight = border;
    if (sourceWidth > c.width)
      sourceWidth = c.width;
    if (destH > c.height)
      sourceY = c.height - border;
    destX = numberZero;
    destY = numberZero;
    destWidth = sourceWidth;
    destHeight = border;
    c2.getContext("2d").clearRect(numberZero, numberZero, c2.width, c2.height);
    c2.width = destWidth;
    c2.height = destHeight;
    ctx2 = c2.getContext("2d");
    ctx2.save();
    ctx2.translate(0, border);
    ctx2.scale(1, -1);
    ctx2.drawImage(ctx.canvas, sourceX, sourceY, sourceWidth, sourceHeight,
      destX, destY, destWidth, destHeight);
    ctx2.restore();

    imgData = c2.toDataURL();
    fabric.Image.fromURL(imgData, function(img) {
      fbCanvas.remove(preview.imBottom);
      preview.imBottom = img;
      preview.imBottom.left = border;
      preview.imBottom.top = fbCanvas.height - border;
      preview.imBottom.XZIndex = numberOne;
      fbCanvas.insertAt(preview.imBottom, preview.imBottom.XZIndex);
    }, {
      hasControls: false,
      hasBorders: false,
      selectable: false
    });
  }

  // ----------------------------------------------------------------
  // setupParams
  Preview.prototype.setupParams = function() {
    preview.setupParam(offX, offY);
  }
  CanvasFoldedPreview.prototype.setupParams = function() {
    preview.setupParam(offXf, offYf);
  }
  Preview.prototype.setupParam = function(offsetX, offsetY) {
    if (zoomVal == numberOne) {
      if (offsetX < offsetY) {
        offsetX = numberZero;
      } else {
        offsetY = numberZero;
      }
    }

    var ScaleUpLocal = numberOne;
    if (typeof TextEditMode != "undefined" && TextEditMode) {
      ScaleUpLocal = ScaleUp;
    }

    var eImgWidth = this.imgWidth;
    var eImgHeight = this.imgHeight;

    var bw = linkImageWidth * zoomVal;
    var bh = linkImageHeight * zoomVal;

    var cutX = offsetX * eImgWidth / bw;
    var cutY = offsetY * eImgHeight / bh;
    var cutW = this.printWidth * eImgWidth / bw;
    var cutH = this.printHeight * eImgHeight / bh;

    if (cutW > eImgWidth) {
      cutW = eImgWidth;
    }
    if (cutH > eImgHeight) {
      cutH = eImgHeight;
    }
    if ((cutX + cutW) > eImgWidth) {
      cutX = eImgWidth - cutW;
    }
    if ((cutY + cutH) > eImgHeight) {
      cutY = eImgHeight - cutH;
    }
    if (cutX < numberZero) {
      cutX = numberZero;
    }
    if (cutY < numberZero) {
      cutY = numberZero;
    }
    if (zoomVal == numberOne) {
      if (cutX < cutY) {
        cutX = numberZero;
      } else {
        cutY = numberZero;
      }
    }

    document.getElementById('itemConfiguratorForm:cutoutX').value = cutX;
    document.getElementById('itemConfiguratorForm:cutoutY').value = cutY;
    document.getElementById('itemConfiguratorForm:cutoutWidth').value =
      cutW;
    document.getElementById('itemConfiguratorForm:cutoutHeight').value =
      cutH;
    if (!!document.getElementById('rotateMotif')) {
      document.getElementById('itemConfiguratorForm:cutoutRotation').value =
        this.rotation;
    }

    if (typeof generate3Dpreview === "function" && this.material ==
      materials.canvas && this.backId == 10)
      generate3Dpreview();
  }

  // ---------------------------------------------------------------------------------
  // loadCutoutParams
  Preview.prototype.loadCutoutParams = function() {

    var ScaleUpLocal = numberOne;
    if (typeof TextEditMode != "undefined" && TextEditMode) {
      ScaleUpLocal = ScaleUp;
    }

    var mmX = document.getElementById('itemConfiguratorForm:cutoutX').value;
    var mmY = document.getElementById('itemConfiguratorForm:cutoutY').value;
    var w = document.getElementById('itemConfiguratorForm:cutoutWidth').value;
    var h = document.getElementById('itemConfiguratorForm:cutoutHeight').value;

    if (mmX == "" || isNaN(mmX)) {
      return;
    }

    var eImgWidth = this.imgWidth;
    var eImgHeight = this.imgHeight;
    var bw = this.printWidth * eImgWidth / w;
    var bh = this.printHeight * eImgHeight / h;

    zoomVal = numberOne;
    if (!!document.getElementById("scaleCanvas")) {
      zoomVal = bw * 1 / linkImageWidth;
      document.getElementById("scaleCanvas").value = (zoomVal - 1) * 100;
    }

    this.loadCutoutParamsSub((bw * mmX / eImgWidth), (bh * mmY / eImgHeight));
  }

  Preview.prototype.loadCutoutParamsSub = function(valueX, valueY) {
    offX = valueX;
    offY = valueY;
  }

  CanvasFoldedPreview.prototype.loadCutoutParamsSub = function(valueX, valueY) {
    offXf = valueX;
    offYf = valueY;
  }

  // --------------------------------------------------------------------------
  // pictureMoving
  Preview.prototype.pictureMoving = function(topBound, leftBound) {
    var top = bgImage.getTop();
    var left = bgImage.getLeft();
    var bottomBound = topBound + (this.printHeight);
    var rightBound = leftBound + (this.printWidth);

    var ScaleUpLocal = numberOne;
    if (typeof TextEditMode != "undefined" && TextEditMode) {
      ScaleUpLocal = ScaleUp;
    }

    bgImage.setLeft(Math.max(Math.min(left, leftBound * ScaleUpLocal), (
      rightBound * ScaleUpLocal) - bgImage.getWidth()));
    bgImage.setTop(Math.max(Math.min(top, topBound * ScaleUpLocal), (
      bottomBound * ScaleUpLocal) - bgImage.getHeight()));
  }

  // --------------------------------------------------------------------
  // readOffset
  Preview.prototype.readOffset = function() {
    offX = -1 * bgImage.getLeft();
    offY = -1 * bgImage.getTop();
    preview.setupParams();
  }

  StandardCushionPreview.prototype.readOffset = function() {
    offX = parseInt(-1) * (bgImage.getLeft() - this.border);
    offY = parseInt(-1) * (bgImage.getTop() - this.border);
    preview.setupParams();
  }
  StandardCushionPreview.prototype.readOffset = function() {
    offX = parseInt(-1) * (bgImage.getLeft() - this.border);
    offY = parseInt(-1) * (bgImage.getTop() - this.border);
    preview.setupParams();
  }

  CanvasPreview.prototype.readOffset = function() {

    var ScaleUpLocal = numberOne;
    if (typeof TextEditMode != "undefined" && TextEditMode) {
      ScaleUpLocal = ScaleUp;
    }

    offX = parseInt(-1) * (bgImage.getLeft() - this.border * ScaleUpLocal);
    offY = parseInt(-1) * (bgImage.getTop() - this.border * ScaleUpLocal);

    preview.setupParams();
    if ('STRETCHED' == this.bordereffect || 'MIRRORED' == this.bordereffect) {
      if (offX < numberZero) {
        offX = numberZero;
      }
      if (offY < numberZero) {
        offY = numberZero;
      }
      if (zoomVal == numberOne) {
        if (offX < offY) {
          offX = numberZero;
        } else {
          offY = numberZero;
        }
      }
      if (FrameLoaded == null || !FrameLoaded) {
        if (!scaleMode) {
          preview.drawBorders();
        }
      }
    }
  }

  CanvasFoldedPreview.prototype.readOffset = function() {
    offXf = -1 * bgImage.left;
    offYf = -1 * bgImage.top;
    preview.setupParams();
  }

  BorderedAsyncPreview.prototype.readOffset = function() {
    offX = parseInt(-1) * (bgImage.left - this.leftBorder);
    offY = parseInt(-1) * (bgImage.top - this.topBorder);
    preview.setupParams();
  }

  // --------------------------------------------------------------------
  // buildTiles
  CanvasPreview.prototype.buildTiles = function(canvasW, canvasH, border) {
    var space = 2 * border;
    var fullLength = canvasH;
    if (canvasW > canvasH) {
      fullLength = canvasW;
    }
    var tile = (fullLength - space * (this.tiles - 1)) / this.tiles;
    var i = border + tile;
    for (u = 1; u < this.tiles; u++) {
      if (canvasW > canvasH) {
        makeBorderPart(i, 0, space, fbCanvas.height, voidColor, fbCanvas,
          true);
      } else {
        makeBorderPart(0, i, fbCanvas.width, space, voidColor, fbCanvas,
          true);
      }
      i = i + tile + space;
    }
  }

  MultiImagePreview.prototype.cropPreview = function() {
    var x = parseFloat(document.getElementById(
      'itemConfiguratorForm:cutoutX').value);
    var y = parseFloat(document.getElementById(
      'itemConfiguratorForm:cutoutY').value);
    var w = parseFloat(document.getElementById(
      'itemConfiguratorForm:cutoutWidth').value);
    var h = parseFloat(document.getElementById(
      'itemConfiguratorForm:cutoutHeight').value);

    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      blocker.unblock();
      return;
    }

    if (preview.canvasWidth > preview.canvasHeight) {
      crop([{
        name: 'area',
        value: preview.areaid
      }, {
        name: 'x',
        value: y
      }, {
        name: 'y',
        value: x
      }, {
        name: 'width',
        value: h
      }, {
        name: 'height',
        value: w
      }, {
        name: 'rotation',
        value: preview.rotation
      }]);
    } else {
      crop([{
        name: 'area',
        value: preview.areaid
      }, {
        name: 'x',
        value: x
      }, {
        name: 'y',
        value: y
      }, {
        name: 'width',
        value: w
      }, {
        name: 'height',
        value: h
      }, {
        name: 'rotation',
        value: preview.rotation
      }]);
    }
  }

  MultiImagePreview.prototype.cropPreviewBeforeCheckout = function() {
    var x = parseFloat(document.getElementById(
      'itemConfiguratorForm:cutoutX').value);
    var y = parseFloat(document.getElementById(
      'itemConfiguratorForm:cutoutY').value);
    var w = parseFloat(document.getElementById(
      'itemConfiguratorForm:cutoutWidth').value);
    var h = parseFloat(document.getElementById(
      'itemConfiguratorForm:cutoutHeight').value);

    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) {
      blocker.unblock();
      return;
    }

    if (preview.canvasWidth > preview.canvasHeight) {
      cropBeforeCheckout([{
        name: 'area',
        value: preview.areaid
      }, {
        name: 'x',
        value: y
      }, {
        name: 'y',
        value: x
      }, {
        name: 'width',
        value: h
      }, {
        name: 'height',
        value: w
      }, {
        name: 'rotation',
        value: preview.rotation
      }]);
    } else {
      cropBeforeCheckout([{
        name: 'area',
        value: preview.areaid
      }, {
        name: 'x',
        value: x
      }, {
        name: 'y',
        value: y
      }, {
        name: 'width',
        value: w
      }, {
        name: 'height',
        value: h
      }, {
        name: 'rotation',
        value: preview.rotation
      }]);
    }
  }

  var GapDeko = 1.2;
  var GapPremium = 0.535;

  function makeFrameBorderPart(l, t, w, h, color, canvas, eventedOff, outline,
    PartName) {
    var shiftPos = 1;

    var hasControls = hasBorders = selectable = evented = false;

    var Overlap_Gap = (preview.frame > dekoFramesFix ? GapDeko : GapPremium);
    var Frametype = (preview.frame > dekoFramesFix ? "Decor" : "Premium");

    var side = PartName.toLowerCase().replace("border", "");

    var FrameMainFile = "/staticimages/configurator/" + (RetinaDisplay ?
      'x2/' : '') + "frame_" + (Frametype == "Decor" ? decoFrames[('f' +
      preview.frame)] : premiumFrames[('f' + preview.frame)]);

    var BorderFrame = FrameMainFile + ".jpg";
    var OverlapFrame = FrameMainFile + "_back.jpg";

    makeBorderPart(l, t, w, h, "transparent", canvas, eventedOff, outline,
      PartName); // TOP

    // Check / Load Frame Image
    fabric.util.loadImage(BorderFrame, function(imgFrame) {

      if (imgFrame != null) {

        var FrameWidth = canvas.width;
        var FrameHeight = canvas.height;
        var FrameSubBorder = preview.border;
        var FrameBorder = FrameSubBorder * Overlap_Gap;

        /***********************************************************************/
        /********** FRAME IMAGE IS AVAILABLE, Prepare the Side images **********/
        /***********************************************************************/

        FrameLoaded = true;

        var imgRotate = new Image();
        imgRotate.onload = function() {

          var WDif = Math.ceil(w * Overlap_Gap) - w;
          var HDif = Math.ceil(h * Overlap_Gap) - h;

          // Create Polygon to fill/fit the diagonals corner!
          var pol = new fabric.Polygon();

          if (side == "top" || side == "bottom") {
            pol = new fabric.Polygon([{
              x: 0,
              y: 0
            }, {
              x: FrameBorder,
              y: FrameBorder
            }, {
              x: FrameWidth - FrameBorder,
              y: FrameBorder
            }, {
              x: FrameWidth,
              y: 0
            }]);
          } else if (side == "left" || side == "right") {
            pol = new fabric.Polygon([{
              x: 0,
              y: 0
            }, {
              x: FrameBorder,
              y: FrameBorder
            }, {
              x: FrameHeight - FrameBorder,
              y: FrameBorder
            }, {
              x: FrameHeight,
              y: 0
            }]);
          }

          pol.fill = colorFrames[('f' + preview.frame)];

          /*********************************************************/
          /************ FIT IMAGE FRAME TO THE POLYGON *************/
          /*********************************************************/

          var RotCanvas = document.createElement('canvas');
          RotCanvas.width = pol.width;
          RotCanvas.height = pol.height;
          var ctx = RotCanvas.getContext("2d");

          ctx.save();
          ctx.drawImage(imgRotate, 0, 0, pol.width, pol.height);
          ctx.restore();

          /*********************************************************/
          /*********************************************************/

          pol.fill = new fabric.Pattern({
            source: RotCanvas,
            repeat: 'repeat'
          });

          // Use result as a Image
          new fabric.Image.fromURL(pol.toDataURL("image/png"), function(
            imgOut) {

            /*********************************************************/
            /************* ANGLE ROTATION FOR EACH SIDE **************/
            /*********************************************************/

            if (side == "top") {
              imgOut.left = numberZero;
              imgOut.top = -shiftPos;
            } else if (side == "left") {
              imgOut.rotate(270);
              imgOut.left = -shiftPos;
              imgOut.top = FrameHeight;
            } else if (side == "right") {
              imgOut.rotate(90);
              imgOut.left = FrameWidth + shiftPos;
              imgOut.top = numberZero;
            } else if (side == "bottom") {
              imgOut.rotate(180);
              imgOut.top = FrameHeight + shiftPos;
              imgOut.left = FrameWidth;
            }

            /*********************************************************/
            /************* SHADOW FOR PERSPECTIVE EFFECT *************/
            /*********************************************************/

            if (side == "top" || side == "bottom") {
              makeShadowPart(l - (l > 0 ? WDif : 0), t - (t > 0 ?
                  HDif : 0), w * (Overlap_Gap < 1 ? 1 :
                  Overlap_Gap), h * Overlap_Gap, canvas,
                Overlap_Gap, Frametype);
            } else if (side == "left" || side == "right") {
              makeShadowPart(l - (l > 0 ? WDif : 0), t - (t > 0 ?
                  HDif : 0), w * Overlap_Gap, h * (Overlap_Gap <
                  1 ? 1 : Overlap_Gap), canvas, Overlap_Gap,
                Frametype);
            }

            imgOut.XZIndex = 10;
            canvas.insertAt(imgOut, imgOut.XZIndex);
            canvas.bringToFront(imgOut).renderAll();
            imgRotate = null;

          }, {
            id: (PartName ? "MapImage-" + PartName + "-" +
              Frametype : ""),
            hasControls: hasControls,
            hasBorders: hasBorders,
            selectable: selectable,
            evented: evented
          });

          // Check if Gap is needed
          if (Overlap_Gap < 1) {

            var imgRotateSub = new Image();
            imgRotateSub.onload = function() {

              // Create Polygon to fill/fit the diagonals corner!
              var polSub = new fabric.Polygon();

              if (side == "top" || side == "bottom") {
                polSub = new fabric.Polygon([{
                  x: 0,
                  y: 0
                }, {
                  x: FrameSubBorder,
                  y: FrameSubBorder
                }, {
                  x: FrameWidth - FrameSubBorder,
                  y: FrameSubBorder
                }, {
                  x: FrameWidth,
                  y: 0
                }]);
              } else if (side == "left" || side == "right") {
                polSub = new fabric.Polygon([{
                  x: 0,
                  y: 0
                }, {
                  x: FrameSubBorder,
                  y: FrameSubBorder
                }, {
                  x: FrameHeight - FrameSubBorder,
                  y: FrameSubBorder
                }, {
                  x: FrameHeight,
                  y: 0
                }]);
              }

              polSub.fill = colorFrames[('f' + preview.frame)];

              /*********************************************************/
              /************ FIT IMAGE FRAME TO THE POLYGON *************/
              /*********************************************************/

              var RotCanvasSub = document.createElement('canvas');
              RotCanvasSub.width = polSub.width;
              RotCanvasSub.height = polSub.height;
              var ctx = RotCanvasSub.getContext("2d");

              ctx.save();
              ctx.drawImage(imgRotateSub, 0, 0, polSub.width, polSub.height);
              ctx.restore();

              /*********************************************************/
              /*********************************************************/

              polSub.fill = new fabric.Pattern({
                source: RotCanvasSub,
                repeat: 'repeat'
              });

              // Use result as a Image
              new fabric.Image.fromURL(polSub.toDataURL("image/png"),
                function(imgOutSub) {

                  /*********************************************************/
                  /************* ANGLE ROTATION FOR EACH SIDE **************/
                  /*********************************************************/

                  if (side == "top") {
                    imgOutSub.left = 0;
                    imgOutSub.top = 0;
                  } else if (side == "left") {
                    imgOutSub.rotate(270);
                    imgOutSub.left = 0;
                    imgOutSub.top = FrameHeight;
                  } else if (side == "right") {
                    imgOutSub.rotate(90);
                    imgOutSub.left = FrameWidth;
                    imgOutSub.top = 0;
                  } else if (side == "bottom") {
                    imgOutSub.rotate(180);
                    imgOutSub.top = FrameHeight;
                  }

                  imgOutSub.XZIndex = 3;
                  canvas.insertAt(imgOutSub, imgOutSub.XZIndex);
                  imgRotateSub = null;
                }, {
                  id: (PartName ? "MapImage-Sub-" + PartName + "-" +
                    Frametype : ""),
                  hasControls: hasControls,
                  hasBorders: hasBorders,
                  selectable: selectable,
                  evented: evented
                });
            }

            imgRotateSub.src = OverlapFrame;
          }
        };

        imgRotate.src = BorderFrame;

      } else {

        /***********************************************************************/
        /************ FRAME IMAGE NOT AVAILABLE, Add Borders Effect ************/
        /***********************************************************************/

        makeBorderPart(l, t, w, h, color, canvas, eventedOff, outline,
          PartName);

        if (FrameLoaded == null) {

          var beffect = $("#imageData").data('border');

          if (beffect == 'FOLDED') {
            preview.setupBorderSub();
          } else {
            preview.drawBorders();
          }
        }

        previewConfig.stopScale();
        FrameLoaded = false;
      }
    });
  }

  var ShadowColor = null;
  var ShadowBlur = 0;
  var ShadowOffsetY = 0;
  var ShadowOffsetX = 0;
  var ShadowPercent = 0;
  var ShadowOffset = 0;

  function makeShadowParams(l, t, w, h, canvas, Overlap_Gap, Frametype) {

    ShadowColor = "rgba(0,0,0,0.6)";
    ShadowBlur = (w > h ? h : w) / (Frametype == "Decor" ? 4 : 4);
    ShadowOffsetY = 0;
    ShadowOffsetX = 0;
    ShadowPercent = (Frametype == "Decor" ? 0.05 : 0.2);
    ShadowOffset = 20;

  }

  function makeShadowCanvas(l, t, w, h, canvas, Overlap_Gap, Frametype) {

    if (Frametype == "Premium") {

      makeShadowParams(l, t, w, h, canvas, Overlap_Gap, Frametype);

      t = Math.ceil(preview.border);
      l = Math.ceil(preview.border);
      h = canvas.height - (preview.border * 2) - 1;
      w = canvas.width - (preview.border * 2) - 1;

      var canvasShadow = document.createElement("canvas");
      var ctx = canvasShadow.getContext("2d");

      var ShadowBlurSize = 8;
      var x = ShadowBlurSize;
      var y = ShadowBlurSize;

      canvasShadow.width = w + ShadowBlurSize * 2;
      canvasShadow.height = h + ShadowBlurSize * 2;

      // draw the shadowed shape
      ctx.shadowColor = (preview.frame == 16 || preview.frame == 17 ?
        "rgba(255,255,255,0.5)" : "rgba(0,0,0,1)");
      ctx.shadowBlur = ShadowBlur;
      ctx.fillRect(x - ctx.shadowOffsetX, y, w, h);
      // always clean up! -- undo shadowing
      ctx.shadowColor = 'rgba(0,0,0,0)';

      // use compositing to remove the shape
      // (leaving just the shadow);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillRect(x, y, w, h);
      // always clean up! -- set compositing to default
      ctx.globalCompositeOperation = 'source-over';

      new fabric.Image.fromURL(canvasShadow.toDataURL("image/png"), function(
        imgShadow) {
        imgShadow.left = l - ShadowBlurSize;
        imgShadow.top = t - ShadowBlurSize;
        imgShadow.XZIndex = 5;
        canvas.insertAt(imgShadow, imgShadow.XZIndex);
        canvas.bringToFront(imgShadow).renderAll();
      }, {
        id: ShadowId + "Canvas",
        hasControls: false,
        hasBorders: false,
        selectable: false,
        evented: false
      });
    }
  }

  function makeShadowPart(l, t, w, h, canvas, Overlap_Gap, Frametype) {

    makeShadowParams(l, t, w, h, canvas, Overlap_Gap, Frametype);

    var key = false;

    var rect = new fabric.Rect({
      left: l,
      top: t,
      color: "rgba(0,0,0,0.1)",
      width: w,
      height: h,
      id: ShadowId,
      hasControls: key,
      hasBorders: key,
      selectable: key,
      evented: key,
    });

    if (w > h) {
      ShadowOffset = (h * ShadowPercent);
      if (t > 0) {
        ShadowOffsetY = ShadowOffset * -1;
      } else {
        ShadowOffsetY = ShadowOffset;
      }
    } else {
      ShadowOffset = (w * ShadowPercent);
      if (l > 0) {
        ShadowOffsetX = ShadowOffset * -1;
      } else {
        ShadowOffsetX = ShadowOffset;
      }
    }

    rect.setShadow({
      color: ShadowColor,
      blur: ShadowBlur * Overlap_Gap,
      offsetX: ShadowOffsetX,
      offsetY: ShadowOffsetY,
      fillShadow: true,
      strokeShadow: true,
    });

    rect.XZIndex = 3;
    canvas.insertAt(rect, rect.XZIndex);
    makeBorderPartSub(l, t, w, h, colorFrames[('f' + preview.frame)], canvas,
      7, "HideColorRectShadow");
  }

  function makeBorderPartSub(l, t, w, h, color, canvas, index, id) {

    var key = false;

    var rectColor = new fabric.Rect({
      left: l,
      top: t,
      color: color,
      fill: color,
      id: id,
      width: w,
      height: h,
      hasControls: key,
      hasBorders: key,
      selectable: key,
      evented: key,
    });

    rectColor.XZIndex = index;
    canvas.insertAt(rectColor, rectColor.XZIndex);
    canvas.renderAll();
  }

  function makeBorderPart(l, t, w, h, color, canvas, eventedOff, outline,
    PartName) {

    var shiftShadow = 1;

    if (!outline || color != "#ffffff") {
      outline = false;
    }

    var rect = new fabric.Rect({
      left: l - shiftShadow,
      top: t - shiftShadow,
      fill: color,
      id: (PartName ? PartName : ""),
      width: w + shiftShadow,
      height: h + shiftShadow,
      stroke: (outline ? "#dddddd" : "transparent"),
      strokWidth: (outline ? "1" : "0"),
      hasControls: false,
      hasBorders: false,
      selectable: false
    });
    if (eventedOff) {
      rect.evented = false;
    }

    rect.XZIndex = numberZero;
    canvas.add(rect);
  }

  function insertSafeZone(material, formatWidth, formatHeight, canvasWidth,
    canvasHeight, border_H, border_V) {

    var safeZoneMM = 0;
    var safeZonePX_H = 0;
    var safeZonePX_V = 0;

    var leftBorder = 0;
    var rightBorder = 0;
    var topBorder = 0;
    var bottomBorder = 0;

    if (material == materials.pillow) {
      leftBorder = rightBorder = bottomBorder = topBorder = 27;
    } else if (material == materials.premiumPillow) {
      leftBorder = rightBorder = bottomBorder = topBorder = 17;
    } else if (material == materials.totebag) {
      safeZoneMM = 30;
    } else if (material == materials.premiumBlanket || material == materials.premiumBlanketPlus) {
      safeZoneMM = 100;
    } else if (material == materials.blanket || material == materials.wallTap ||
      material == materials.towel || material == materials.carpet) {
      safeZoneMM = 70;
    } else if (material == materials.mousepad) {
      safeZoneMM = 7;
    } else {
      safeZoneMM = 5;
    }

    if (safeZoneMM > 0) {
      safeZonePX_H = Math.ceil(safeZoneMM / formatWidth * canvasWidth);
      safeZonePX_V = Math.ceil(safeZoneMM / formatHeight * canvasHeight);
      leftBorder = safeZonePX_H + border_H;
      rightBorder = safeZonePX_H + border_H;
      topBorder = safeZonePX_V + border_V;
      bottomBorder = safeZonePX_V + border_V;
    }

    if (leftBorder > numberZero) {
      insertBorderPart(0, 0, leftBorder, canvasHeight, "transparent",
        fbCanvas, "SaveBorderLeft");
    }
    if (rightBorder > numberZero) {
      insertBorderPart(canvasWidth - rightBorder, 0, rightBorder,
        canvasHeight, "transparent", fbCanvas, "SaveBorderRight");
    }
    if (topBorder > numberZero) {
      insertBorderPart(0, 0, canvasWidth, topBorder, "transparent", fbCanvas,
        "SaveBorderTop");
    }
    if (bottomBorder > numberZero) {
      insertBorderPart(0, canvasHeight - bottomBorder, canvasWidth,
        bottomBorder, "transparent", fbCanvas, "SaveBorderBottom");
    }
  }

  function insertBorderPart(l, t, w, h, color, canvas, PartName) {
    var frame = new fabric.Rect({
      fill: color,
      width: w,
      height: h,
      left: l,
      id: (PartName ? PartName : ""),
      top: t,
      hasControls: false,
      hasBorders: false,
      selectable: false,
      evented: false
    });

    frame.XZIndex = 1;
    canvas.insertAt(frame, frame.XZIndex);
  }

  function makeFrameBorder(canvaW, canvaH, border, color, cutout) {

    var GapDeko = 1.2;
    var GapPremium = 0.535;
    var Overlap_Gap = (preview.frame > dekoFramesFix ? GapDeko : GapPremium);

    makeFrameBorderOver(canvaW, canvaH, border, fbCanvas, color, cutout);
  }

  function makeFrameBorderOver(canvaW, canvaH, border, canvas, color, cutout) {
    makeFrameBorderPart(0, 0, canvaW, border, color, canvas, false, false,
      "BorderTop"); // TOP
    makeFrameBorderPart(0, canvaH - border, canvaW, border, color, canvas,
      false, false, "BorderBottom"); // BOTTOM
    makeFrameBorderPart(0, 0, border, canvaH, color, canvas, false, false,
      "BorderLeft"); // LEFT
    makeFrameBorderPart(canvaW - border, 0, border, canvaH, color, canvas,
      false, false, "BorderRight"); // RIGHT

    makeShadowCanvas(0, 0, preview.border, preview.border, canvas, 0,
      "Premium");
  }

  function makeColorBorder(canvaW, canvaH, border, color, cutout) {

    makeBorderPart(0, 0, canvaW, border, color, fbCanvas, false, false,
      "BorderTop"); // TOP
    makeBorderPart(0, canvaH - border, canvaW, border, color, fbCanvas, false,
      false, "BorderBottom"); // BOTTOM
    makeBorderPart(0, 0, border, canvaH, color, fbCanvas, false, false,
      "BorderLeft"); // LEFT
    makeBorderPart(canvaW - border, 0, border, canvaH, color, fbCanvas, false,
      false, "BorderRight"); // RIGHT

    if (cutout) {
      //l, t, w, h, color, canvas, eventedOff, outline
      makeBorderPart(border + 1, 1, canvaW - (border * 2) - 2, border - 1,
        color, fbCanvas, false, true); // TOP
      makeBorderPart(border + 1, canvaH - border, canvaW - (border * 2) - 2,
        border - 1, color, fbCanvas, false, true); // BOTTOM
      makeBorderPart(1, border + 1, border - 1, canvaH - (border * 2) - 2,
        color, fbCanvas, false, true); // LEFT
      makeBorderPart(canvaW - border, border + 1, border - 1, canvaH - (
        border * 2) - 2, color, fbCanvas, false, true); // RIGHT
    }
  }

  function clearCanvas() {
    if (fbCanvas != null && bgImage != null) {
      fbCanvas.remove(bgImage);
      bgImage = null;
    }
    fbCanvas = null;
    if (c0 == null) {
      return;
    }
    c0.getContext("2d").clearRect(0, 0, c0.width, c0.height);
    if (c1 == null) {
      return;
    }
    c1.getContext("2d").clearRect(0, 0, c1.width, c1.height);
    if (c2 == null) {
      return;
    }
    c2.getContext("2d").clearRect(0, 0, c2.width, c2.height);
  }

  function resetParams() {
    document.getElementById('itemConfiguratorForm:cutoutX').value = "";
    document.getElementById('itemConfiguratorForm:cutoutY').value = "";
    document.getElementById('itemConfiguratorForm:cutoutWidth').value = "";
    document.getElementById('itemConfiguratorForm:cutoutHeight').value = "";
    if (!!document.getElementById('itemConfiguratorForm:cutoutRotation')) {
      document.getElementById('itemConfiguratorForm:cutoutRotation').value =
        '';
    }
  }

  function updateMove() {
    if (zoomVal == numberOne) {
      preview.setupMovable(preview.movable);
      bgImage.selectable = preview.movable;
    } else {
      bgImage.selectable = true;
      preview.setupMovable(true);
    }

    var isChrome = !!window.chrome && !!window.chrome.webstore;
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;

    if (isChrome) {
      preview.hoverCursor = '-webkit-grab';
      bgImage.hoverCursor = '-webkit-grab';
      preview.moveCursor = '-webkit-grabbing';
      bgImage.moveCursor = '-webkit-grabbing';
    } else if (isIE) {
      preview.hoverCursor = "pointer";
      bgImage.hoverCursor = "pointer";
      preview.moveCursor = "move";
      bgImage.moveCursor = "move";
    } else {
      preview.hoverCursor = 'grab';
      bgImage.hoverCursor = 'grab';
      preview.moveCursor = 'grabbing';
      bgImage.moveCursor = 'grabbing';
    }
  }

  function shadeColor(color, percent) {
    if (color == "#ffffff") {
      return "#efefef";
    }
    var f = parseInt(color.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = f >> 16,
      G = f >> 8 & 0x00FF,
      B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math
      .round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(
      16).slice(1);
  }

  function shadeRGBColor(color, percent) {
    var f = color.split(","),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = parseInt(f[0].slice(4)),
      G = parseInt(f[1]),
      B = parseInt(f[2]);
    return "rgb(" + (Math.round((t - R) * p) + R) + "," + (Math.round((t - G) *
      p) + G) + "," + (Math.round((t - B) * p) + B) + ")";
  }
}

var previewConfig = new Configurator();


function MakeMobileReadOnly() {
  if (isMobile) {
    for (var m = 0; m < fbCanvas.getObjects().length; m++) {
      var ImageObj = fbCanvas.getObjects()[m];
      if (ImageObj.type === "image" && ImageObj.id === bgId) {
        fbCanvas.allowTouchScrolling = true;
        ImageObj.selectable = (EditMode && preview.movable);
      }
    }
  }
}

(function($, window) {
  $.primefacesHelper = function() {
    function radioUtility() {
      $('.ui-radiobutton').each(function() {
        if ($(this).data('pfHelper_updated') === undefined) {
          $(this).data('pfHelper_updated', true);
          var $ui = $(this);
          var id = $ui.attr('id');
          var passClasses = [];
          var $radio = $ui.find('input[type="radio"]');

          $ui.attr('id', id + ':helper');
          $ui.css('display', 'none');

          $radio.attr('id', id);
          $radio.insertAfter($ui);

          $.each($ui.attr('class').split(' '), function(key, val) {
            if (val.substring(0, 3) !== 'ui-') {
              passClasses.push(val);
            }
          });

          $( document ).ready(function() {
              $radio.attr('class', passClasses.join(' '));
              $.activeTarget();
          });
        }
      });
    }

    radioUtility();

    window.pfhelper = {};
    window.pfhelper.updateDom = function() {
      radioUtility();
    };
  };

  $.fn.zIndex = function() {
    return $(this).css('z-index');
  };
}(jQuery, window));
(function($) {
  $.activeTarget = function() {

    // Listens on change of a radio (or checkbox) and
    // when change fires, adds the class '-visible' to
    // a given target.
    // Interface:
    // - associated radios need class js-dat-group_NAMEOFYOURINPUTGROUP
    // - specify target class with class js-dat-target_class-of-your-target
    //
    // Simplet Interface
    // - Attribute "data-active-target-group='groupname'" for the associated radios
    // - Attribute "data-active-target='.target-element-selector'" for the target
    //
    // This weird class-name-syntax is for JSF-Elements, where we can't set
    // any "normal" HTML attributes. I'm looking at you, Primefaces (╯°□°）╯︵ ┻━┻

    // We listen on change of the group.
    // Why? We can't listen on change if something is unchecked.
    // Listening only works on checking.
    // As a workaround we listen on changes of the group to emulate
    // the unchecking-event.
    $('body').on('change', '*[data-active-target-group], *[class*="js-dat-group"]', function() {
      var $this = $(this);

      // We parse the correct group string.
      var groupFromClass;
      $.each($(this).attr('class').split(' '), function(key, value) {
        if (value.substring(0, 12) === 'js-dat-group') {
          groupFromClass = value.split('_')[1];
        }
      });

      var group = $(this).attr('data-active-target-group') || groupFromClass;

      // We loop through each item in the group...
      $('.js-dat-group_' + group).each(function() {
        if ($(this)[0] !== $this[0]) {
          // ... and, if the item is the correct item,
          // we call the function we call in the other
          // on('change').
          thisShouldHappenOnChangeOfItem($(this));
        }
      });

      // We loop through each item in the group...
      $('*[data-active-target-group="' + group + '"]').each(function() {
        if ($(this)[0] !== $this[0]) {
          // ... and, if the item is the correct item,
          // we call the function we call in the other
          // on('change').
          thisShouldHappenOnChangeOfItem($(this));
        }
      });
    });

    // We listen on change of a item
    $('body').on('change', '*[data-active-target], *[class*="js-dat-target"]', function() {
      thisShouldHappenOnChangeOfItem($(this));
    });

    $('*[data-active-target], *[class*="js-dat-target"]').each(function() {
      thisShouldHappenOnChangeOfItem($(this));
    });

    function thisShouldHappenOnChangeOfItem($this) {
      // We parse the target class
      var targetFromClass;
      $.each($this.attr('class').split(' '), function(key, value) {
        if (value.substring(0, 13) === 'js-dat-target') {
          targetFromClass = '.' + value.split('_')[1];
        }
      });

      // and toogle the target's visibility, depending on if it's changed or not.
      var target = $this.attr('data-active-target') || targetFromClass;
      var $target = $(target);
      $target.dequeue();
      if($this.is(':checked')) {
        $target.addClass('-visible').delay(1).queue(function() {
          $target.addClass('-active');
          $(this).dequeue();
        });
      } else {
        $target.removeClass('-active').removeClass('-visible');
      }
    }
  };
}(jQuery));
(function ($) {
  $.fn.accordion = function () {
    var opts = {
      handleSelector: '.js-accordion-title',
      groupSelector: '.js-accordion-body',
      handleToggleClass: '-active',
      groupToggleClass: '-expanded',
      groupShowingClass: '-showing',
      groupHidingClass: '-hiding'
    };

    // Handle = The clickable part
    // Group  = The sliding part

    return this.each(function () {
      var $accordion = $(this);
      var $handles = $accordion.find(opts.handleSelector);
      var isClosable = $accordion.attr('data-accordion-close') || false;

      // Calculate max-height of groups
      // and save it together with transition
      // duration for each group.
      $handles.next(opts.groupSelector).each(function() {
        var $t = $(this);
        var calcHeight = 20;
        $t.css('max-height', 'none');
        $t.children().each(function() {
          calcHeight += $(this).outerHeight(true);
        });
        $t.data('height', calcHeight);
        var transitionDuration = Modernizr.csstransitions ? $t.css('transition-duration') : "0.5s";
        $t.data('duration', transitionDuration.slice(0,-1) * 1000);
        $t.data('opened', false);
        $t.css('max-height', '');
      });

      // close all open groups except for $except
      function closeOthers($except) {
        $handles.next(opts.groupSelector).each(function () {
          if ($(this).data('opened', true) && $(this)[0] != $except[0]) close($(this));
        });
      }

      // close a group
      function close($e) {
        $e.dequeue();
        $e.prev(opts.handleSelector).removeClass(opts.handleToggleClass);
        $e.css('max-height', '')
          .delay($e.data('duration'))
          .addClass(opts.groupHidingClass)
          .removeClass(opts.groupToggleClass)
          .queue(function() {
            $e.data('opened', false)
              .removeClass(opts.groupHidingClass)
              .dequeue();
        });
      }

      // open a group
      function open($e) {
        $e.dequeue();
        $e.prev(opts.handleSelector).addClass(opts.handleToggleClass);
        $e.css('max-height', $e.data('height'))
          .removeClass(opts.groupHidingClass)
          .delay($e.data('duration'))
          .addClass(opts.groupShowingClass)
          .queue(function() {
            $e.data('opened', true)
              .addClass(opts.groupToggleClass)
              .removeClass(opts.groupShowingClass);
            $(this).dequeue();
          });
      }

      // Clickhandler
      $handles.on('click', function (e) {
        var $group = $(this).next(opts.groupSelector);

        if (isClosable && $group.data('opened')) {
          close($group);
        }

        else {
          open($group);
          closeOthers($group);
        }

      });

      $(document).ready(function() {
        // init
        $handles.each(function() {
          // Stop accordion with radio buttons to trigger twice
          $(this).children('.radio').children('input').on('click', function(e) {
            e.stopImmediatePropagation();
          });

          // Pre-set checked radio
          if ($(this).children('.radio').children('input').is(':checked')) {
            $(this).trigger('click');
          }

          if ($(this).attr('data-init-expand')) {
            $(this).trigger('click');
          }
        });
      });

    });
  };
}(jQuery));
(function($, window) {
  window.headerOffset = 0; // increases offset accuracy by adding the fixed elements heights
  window.headerOffsetHasTrusted = false;

  $.scrollTo = function() {
    $('body').on('click', 'a[href*=\\#]:not([href=\\#])', function(e) {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(
          /^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(
          1) + ']');
        var staticOffset = $(this).data('static-offset');

        if ($(
            '#tsbadgeResponsiveTop_db8d3657bdbe440c985ae127463eaad4node'
          ).length) {
          if (!headerOffsetHasTrusted) {
            var trustedheight = $(
              '#tsbadgeResponsiveTop_db8d3657bdbe440c985ae127463eaad4node'
            ).outerHeight();
            headerOffset += trustedheight;
            headerOffsetHasTrusted = true;
          }
        }

        if (staticOffset !== 'undefined' && staticOffset >= 0) {
          $('html,body').animate({
            scrollTop: staticOffset
          }, 1000);
          return false;
        } else if (target.length) {
          smoothScrollTo(target);
          return false;
        }
      }
    });
  };

  window.smoothScrollTo_bottom = function($el) {
    if ($el.length) {
      $('html,body').stop().animate({
        scrollTop: $el.offset().top - $(window).height() + $el.outerHeight() +
          12
      }, 500);
    }
  }

  window.smoothScrollTo = function($el) {
    if ($el.length) {
      $('html,body').animate({
        scrollTop: $el.offset().top + headerOffset
      }, 1000);
    }
  }
}(jQuery, window));

(function($) {
  $.formclickContainer = function() {
    $('body').on('click mouseenter mouseleave', '*[data-clickarea] input, .js-clickarea input', function(e) {
      e.stopPropagation();
    });

    $('body').on('mouseenter', '*[data-clickarea], .js-clickarea', function(e) {
      $(this).find('.radio input, .checkmark input').addClass('-hover');
    });

    $('body').on('mouseleave', '*[data-clickarea], .js-clickarea', function(e) {
      $(this).find('.radio input, .checkmark input').removeClass('-hover');
    });

    $('body').on('click', '*[data-clickarea], .js-clickarea', function() {
      var $input = $(this).find('input:first');
      $input.prop('checked', true).trigger('change');
    });
  };
}(jQuery));
(function($, window) {
  $.toast = function(window) {
    var Toast = function() {
	  if ($(".toast-message").length)
        this.$toast = $(".toast-message -opening");
	  else
        this.$toast = $('<div class="toast-message -opening"></div>');
    };

    Toast.prototype.hide = function(delay) {
      var $toast = this.$toast;

      $toast.delay(delay).queue(function() {
        $toast.addClass('-closing').stop().delay(500).queue(function() {
          $toast.addClass('-opening').remove();
          isShown = false;
          $(this).dequeue();
        });
        $(this).dequeue();
      });
    };

    Toast.prototype.show = function(message) {
      var $toast = this.$toast;

      $toast.text(message);
      $toast.appendTo($('.toast-holder'));
      isShown = true;
      $toast.removeClass('-closing').stop().delay(0).queue(function() {
        $toast.removeClass('-opening');
        $(this).dequeue();
      });
    };

    $('body').append('<div class="toast-holder"></div>');

    window.showToast = function(message) {
      try {
		if (!window.toast) {
          window.toast = new Toast();
          window.toast.show(message);
		}
      } catch(err) {
        // intentionally left blank
      }
    };

    window.hideToast = function(delay) {
      try {
        window.toast.hide(delay);
		window.toast = null;
      } catch(err) {
        // intentionally left blank
      }
    };
  };
}(jQuery, window));

/*!
* jquery.inputmask.bundle.js
* https://github.com/RobinHerbots/Inputmask
* Copyright (c) 2010 - 2017 Robin Herbots
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
* Version: 4.0.1-35
*/

!function(modules) {
  var installedModules;
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: !1,
            exports: {}
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__),
        module.l = !0, module.exports;
    }
    installedModules = {};
    __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.i = function(value) {
        return value;
    }, __webpack_require__.d = function(exports, name, getter) {
        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
            configurable: !1,
            enumerable: !0,
            get: getter
        });
    }, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module.default;
        } : function() {
            return module;
        };
        return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 9);
}([ function(module, exports, __webpack_require__) {
    "use strict";
    var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
    "function" == typeof Symbol && Symbol.iterator;
    !function(factory) {
        __WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(2) ], __WEBPACK_AMD_DEFINE_FACTORY__ = factory,
        void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
    }(function($) {
        return $;
    });
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__, _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    !function(factory) {
        __WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(0), __webpack_require__(11), __webpack_require__(10) ],
        __WEBPACK_AMD_DEFINE_FACTORY__ = factory, void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
    }(function($, window, document, undefined) {
        function Inputmask(alias, options, internal) {
            if (!(this instanceof Inputmask)) return new Inputmask(alias, options, internal);
            this.el = undefined, this.events = {}, this.maskset = undefined, this.refreshValue = !1,
            !0 !== internal && ($.isPlainObject(alias) ? options = alias : (options = options || {},
            options.alias = alias), this.opts = $.extend(!0, {}, this.defaults, options), this.noMasksCache = options && options.definitions !== undefined,
            this.userOptions = options || {}, this.isRTL = this.opts.numericInput, resolveAlias(this.opts.alias, options, this.opts));
        }
        function resolveAlias(aliasStr, options, opts) {
            var aliasDefinition = Inputmask.prototype.aliases[aliasStr];
            return aliasDefinition ? (aliasDefinition.alias && resolveAlias(aliasDefinition.alias, undefined, opts),
            $.extend(!0, opts, aliasDefinition), $.extend(!0, opts, options), !0) : (null === opts.mask && (opts.mask = aliasStr),
            !1);
        }
        function generateMaskSet(opts, nocache) {
            function generateMask(mask, metadata, opts) {
                var regexMask = !1;
                if (null !== mask && "" !== mask || (regexMask = null !== opts.regex, regexMask ? (mask = opts.regex,
                mask = mask.replace(/^(\^)(.*)(\$)$/, "$2")) : (regexMask = !0, mask = ".*")), 1 === mask.length && !1 === opts.greedy && 0 !== opts.repeat && (opts.placeholder = ""),
                opts.repeat > 0 || "*" === opts.repeat || "+" === opts.repeat) {
                    var repeatStart = "*" === opts.repeat ? 0 : "+" === opts.repeat ? 1 : opts.repeat;
                    mask = opts.groupmarker.start + mask + opts.groupmarker.end + opts.quantifiermarker.start + repeatStart + "," + opts.repeat + opts.quantifiermarker.end;
                }
                var masksetDefinition, maskdefKey = regexMask ? "regex_" + opts.regex : opts.numericInput ? mask.split("").reverse().join("") : mask;
                return Inputmask.prototype.masksCache[maskdefKey] === undefined || !0 === nocache ? (masksetDefinition = {
                    mask: mask,
                    maskToken: Inputmask.prototype.analyseMask(mask, regexMask, opts),
                    validPositions: {},
                    _buffer: undefined,
                    buffer: undefined,
                    tests: {},
                    metadata: metadata,
                    maskLength: undefined
                }, !0 !== nocache && (Inputmask.prototype.masksCache[maskdefKey] = masksetDefinition,
                masksetDefinition = $.extend(!0, {}, Inputmask.prototype.masksCache[maskdefKey]))) : masksetDefinition = $.extend(!0, {}, Inputmask.prototype.masksCache[maskdefKey]),
                masksetDefinition;
            }
            if ($.isFunction(opts.mask) && (opts.mask = opts.mask(opts)), $.isArray(opts.mask)) {
                if (opts.mask.length > 1) {
                    opts.keepStatic = null === opts.keepStatic || opts.keepStatic;
                    var altMask = opts.groupmarker.start;
                    return $.each(opts.numericInput ? opts.mask.reverse() : opts.mask, function(ndx, msk) {
                        altMask.length > 1 && (altMask += opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start),
                        msk.mask === undefined || $.isFunction(msk.mask) ? altMask += msk : altMask += msk.mask;
                    }), altMask += opts.groupmarker.end, generateMask(altMask, opts.mask, opts);
                }
                opts.mask = opts.mask.pop();
            }
            return opts.mask && opts.mask.mask !== undefined && !$.isFunction(opts.mask.mask) ? generateMask(opts.mask.mask, opts.mask, opts) : generateMask(opts.mask, opts.mask, opts);
        }
        function maskScope(actionObj, maskset, opts) {
            function getMaskTemplate(baseOnInput, minimalPos, includeMode) {
                minimalPos = minimalPos || 0;
                var ndxIntlzr, test, testPos, maskTemplate = [], pos = 0, lvp = getLastValidPosition();
                do {
                    !0 === baseOnInput && getMaskSet().validPositions[pos] ? (testPos = getMaskSet().validPositions[pos],
                    test = testPos.match, ndxIntlzr = testPos.locator.slice(), maskTemplate.push(!0 === includeMode ? testPos.input : !1 === includeMode ? test.nativeDef : getPlaceholder(pos, test))) : (testPos = getTestTemplate(pos, ndxIntlzr, pos - 1),
                    test = testPos.match, ndxIntlzr = testPos.locator.slice(), (!1 === opts.jitMasking || pos < lvp || "number" == typeof opts.jitMasking && isFinite(opts.jitMasking) && opts.jitMasking > pos) && maskTemplate.push(!1 === includeMode ? test.nativeDef : getPlaceholder(pos, test))),
                    pos++;
                } while ((null !== test.fn || "" !== test.def) || minimalPos > pos);
                return "" === maskTemplate[maskTemplate.length - 1] && maskTemplate.pop(), getMaskSet().maskLength = pos + 1,
                maskTemplate;
            }
            function getMaskSet() {
                return maskset;
            }
            function resetMaskSet(soft) {
                var maskset = getMaskSet();
                maskset.buffer = undefined, !0 !== soft && (maskset.validPositions = {}, maskset.p = 0);
            }
            function getLastValidPosition(closestTo, strict, validPositions) {
                var before = -1, after = -1, valids = validPositions || getMaskSet().validPositions;
                closestTo === undefined && (closestTo = -1);
                for (var posNdx in valids) {
                    var psNdx = parseInt(posNdx);
                    valids[psNdx] && (strict || !0 !== valids[psNdx].generatedInput) && (psNdx <= closestTo && (before = psNdx),
                    psNdx >= closestTo && (after = psNdx));
                }
                return -1 !== before && closestTo - before > 1 || after < closestTo ? before : after;
            }
            function stripValidPositions(start, end, nocheck, strict) {
                var i, startPos = start, positionsClone = $.extend(!0, {}, getMaskSet().validPositions), needsValidation = !1;
                for (getMaskSet().p = start, i = end - 1; i >= startPos; i--) getMaskSet().validPositions[i] !== undefined && (!0 !== nocheck && (!getMaskSet().validPositions[i].match.optionality && function(pos) {
                    var posMatch = getMaskSet().validPositions[pos];
                    if (posMatch !== undefined && null === posMatch.match.fn) {
                        var prevMatch = getMaskSet().validPositions[pos - 1], nextMatch = getMaskSet().validPositions[pos + 1];
                        return prevMatch !== undefined && nextMatch !== undefined;
                    }
                    return !1;
                }(i) || !1 === opts.canClearPosition(getMaskSet(), i, getLastValidPosition(undefined, !0), strict, opts)) || delete getMaskSet().validPositions[i]);
                for (resetMaskSet(!0), i = startPos + 1; i <= getLastValidPosition(); ) {
                    for (;getMaskSet().validPositions[startPos] !== undefined; ) startPos++;
                    if (i < startPos && (i = startPos + 1), getMaskSet().validPositions[i] === undefined && isMask(i)) i++; else {
                        var t = getTestTemplate(i);
                        !1 === needsValidation && positionsClone[startPos] && positionsClone[startPos].match.def === t.match.def ? (getMaskSet().validPositions[startPos] = $.extend(!0, {}, positionsClone[startPos]),
                        getMaskSet().validPositions[startPos].input = t.input, delete getMaskSet().validPositions[i],
                        i++) : positionCanMatchDefinition(startPos, t.match.def) ? !1 !== isValid(startPos, t.input || getPlaceholder(i), !0) && (delete getMaskSet().validPositions[i],
                        i++, needsValidation = !0) : isMask(i) || (i++, startPos--), startPos++;
                    }
                }
                resetMaskSet(!0);
            }
            function determineTestTemplate(tests, guessNextBest) {
                for (var testPos, testPositions = tests, lvp = getLastValidPosition(), lvTest = getMaskSet().validPositions[lvp] || getTests(0)[0], lvTestAltArr = lvTest.alternation !== undefined ? lvTest.locator[lvTest.alternation].toString().split(",") : [], ndx = 0; ndx < testPositions.length && (testPos = testPositions[ndx],
                !(testPos.match && (opts.greedy && !0 !== testPos.match.optionalQuantifier || (!1 === testPos.match.optionality || !1 === testPos.match.newBlockMarker) && !0 !== testPos.match.optionalQuantifier) && (lvTest.alternation === undefined || lvTest.alternation !== testPos.alternation || testPos.locator[lvTest.alternation] !== undefined && checkAlternationMatch(testPos.locator[lvTest.alternation].toString().split(","), lvTestAltArr))) && (null !== testPos.match.fn || /[0-9a-bA-Z]/.test(testPos.match.def))); ndx++) ;
                return testPos;
            }
            function getTestTemplate(pos, ndxIntlzr, tstPs) {
                return getMaskSet().validPositions[pos] || determineTestTemplate(getTests(pos, ndxIntlzr ? ndxIntlzr.slice() : ndxIntlzr, tstPs));
            }
            function getTest(pos) {
                return getMaskSet().validPositions[pos] ? getMaskSet().validPositions[pos] : getTests(pos)[0];
            }
            function positionCanMatchDefinition(pos, def) {
                for (var valid = !1, tests = getTests(pos), tndx = 0; tndx < tests.length; tndx++) if (tests[tndx].match && tests[tndx].match.def === def) {
                    valid = !0;
                    break;
                }
                return valid;
            }
            function getTests(pos, ndxIntlzr, tstPs) {
              var latestMatch, maskTokens = getMaskSet().maskToken, testPos = ndxIntlzr ? tstPs : 0, ndxInitializer = ndxIntlzr ? ndxIntlzr.slice() : [ 0 ], matches = [], insertStop = !1, cacheDependency = ndxIntlzr ? ndxIntlzr.join("") : "";
                function resolveTestFromToken(maskToken, ndxInitializer, loopNdx, quantifierRecurse) {
                    function handleMatch(match, loopNdx, quantifierRecurse) {
                        function isFirstMatch(latestMatch, tokenGroup) {
                            var firstMatch = 0 === $.inArray(latestMatch, tokenGroup.matches);
                            return firstMatch || $.each(tokenGroup.matches, function(ndx, match) {
                                if (!0 === match.isQuantifier && (firstMatch = isFirstMatch(latestMatch, tokenGroup.matches[ndx - 1]))) return !1;
                            }), firstMatch;
                        }
                        function resolveNdxInitializer(pos, alternateNdx, targetAlternation) {
                            var bestMatch, indexPos;
                            if (getMaskSet().validPositions[pos - 1] && targetAlternation && getMaskSet().tests[pos]) for (var vpAlternation = getMaskSet().validPositions[pos - 1].locator, tpAlternation = getMaskSet().tests[pos][0].locator, i = 0; i < targetAlternation; i++) if (vpAlternation[i] !== tpAlternation[i]) return vpAlternation.slice(targetAlternation + 1);
                            return (getMaskSet().tests[pos] || getMaskSet().validPositions[pos]) && $.each(getMaskSet().tests[pos] || [ getMaskSet().validPositions[pos] ], function(ndx, lmnt) {
                                var alternation = targetAlternation !== undefined ? targetAlternation : lmnt.alternation, ndxPos = lmnt.locator[alternation] !== undefined ? lmnt.locator[alternation].toString().indexOf(alternateNdx) : -1;
                                (indexPos === undefined || ndxPos < indexPos) && -1 !== ndxPos && (bestMatch = lmnt,
                                indexPos = ndxPos);
                            }), bestMatch ? bestMatch.locator.slice((targetAlternation !== undefined ? targetAlternation : bestMatch.alternation) + 1) : targetAlternation !== undefined ? resolveNdxInitializer(pos, alternateNdx) : undefined;
                        }
                        if (testPos > 1e4) throw "Inputmask: There is probably an error in your mask definition or in the code. Create an issue on github with an example of the mask you are using. " + getMaskSet().mask;
                        if (testPos === pos && match.matches === undefined) return matches.push({
                            match: match,
                            locator: loopNdx.reverse(),
                            cd: cacheDependency
                        }), !0;
                        if (match.matches !== undefined) {
                            if (match.isGroup && quantifierRecurse !== match) {
                                if (match = handleMatch(maskToken.matches[$.inArray(match, maskToken.matches) + 1], loopNdx)) return !0;
                            } else if (match.isOptional) {
                                var optionalToken = match;
                                var insertStop = 0;
                                if (match = resolveTestFromToken(match, ndxInitializer, loopNdx, quantifierRecurse)) {
                                    if (latestMatch = matches[matches.length - 1].match, !isFirstMatch(latestMatch, optionalToken)) return !0;
                                    insertStop = !0, testPos = pos;
                                }
                            } else if (match.isAlternator) {
                                var maltMatches, alternateToken = match, malternateMatches = [], currentMatches = matches.slice(), loopNdxCnt = loopNdx.length, altIndex = ndxInitializer.length > 0 ? ndxInitializer.shift() : -1;
                                if (-1 === altIndex || "string" == typeof altIndex) {
                                    var amndx, currentPos = testPos, ndxInitializerClone = ndxInitializer.slice(), altIndexArr = [];
                                    if ("string" == typeof altIndex) altIndexArr = altIndex.split(","); else for (amndx = 0; amndx < alternateToken.matches.length; amndx++) altIndexArr.push(amndx);
                                    for (var ndx = 0; ndx < altIndexArr.length; ndx++) {
                                        if (amndx = parseInt(altIndexArr[ndx]), matches = [], ndxInitializer = resolveNdxInitializer(testPos, amndx, loopNdxCnt) || ndxInitializerClone.slice(),
                                        !0 !== (match = handleMatch(alternateToken.matches[amndx] || maskToken.matches[amndx], [ amndx ].concat(loopNdx), quantifierRecurse) || match) && match !== undefined && altIndexArr[altIndexArr.length - 1] < alternateToken.matches.length) {
                                            var ntndx = $.inArray(match, maskToken.matches) + 1;
                                            maskToken.matches.length > ntndx && (match = handleMatch(maskToken.matches[ntndx], [ ntndx ].concat(loopNdx.slice(1, loopNdx.length)), quantifierRecurse)) && (altIndexArr.push(ntndx.toString()),
                                            $.each(matches, function(ndx, lmnt) {
                                                lmnt.alternation = loopNdx.length - 1;
                                            }));
                                        }
                                        maltMatches = matches.slice(), testPos = currentPos, matches = [];
                                        for (var ndx1 = 0; ndx1 < maltMatches.length; ndx1++) {
                                            var altMatch = maltMatches[ndx1], dropMatch = !1;
                                            altMatch.alternation = altMatch.alternation || loopNdxCnt;
                                            for (var ndx2 = 0; ndx2 < malternateMatches.length; ndx2++) {
                                                var altMatch2 = malternateMatches[ndx2];
                                                if ("string" != typeof altIndex || -1 !== $.inArray(altMatch.locator[altMatch.alternation].toString(), altIndexArr)) {
                                                    if (function(source, target) {
                                                        return source.match.nativeDef === target.match.nativeDef || source.match.def === target.match.nativeDef || source.match.nativeDef === target.match.def;
                                                    }(altMatch, altMatch2)) {
                                                        dropMatch = !0, altMatch.alternation === altMatch2.alternation && -1 === altMatch2.locator[altMatch2.alternation].toString().indexOf(altMatch.locator[altMatch.alternation]) && (altMatch2.locator[altMatch2.alternation] = altMatch2.locator[altMatch2.alternation] + "," + altMatch.locator[altMatch.alternation],
                                                        altMatch2.alternation = altMatch.alternation), altMatch.match.nativeDef === altMatch2.match.def && (altMatch.locator[altMatch.alternation] = altMatch2.locator[altMatch2.alternation],
                                                        malternateMatches.splice(malternateMatches.indexOf(altMatch2), 1, altMatch));
                                                        break;
                                                    }
                                                    if (altMatch.match.def === altMatch2.match.def) {
                                                        dropMatch = !1;
                                                        break;
                                                    }
                                                    if (function(source, target) {
                                                        return null === source.match.fn && null !== target.match.fn && target.match.fn.test(source.match.def, getMaskSet(), pos, !1, opts, !1);
                                                    }(altMatch, altMatch2) || function(source, target) {
                                                        return null !== source.match.fn && null !== target.match.fn && target.match.fn.test(source.match.def.replace(/[\[\]]/g, ""), getMaskSet(), pos, !1, opts, !1);
                                                    }(altMatch, altMatch2)) {
                                                        altMatch.alternation === altMatch2.alternation && -1 === altMatch.locator[altMatch.alternation].toString().indexOf(altMatch2.locator[altMatch2.alternation].toString().split("")[0]) && (altMatch.na = altMatch.na || altMatch.locator[altMatch.alternation].toString(),
                                                        -1 === altMatch.na.indexOf(altMatch.locator[altMatch.alternation].toString().split("")[0]) && (altMatch.na = altMatch.na + "," + altMatch.locator[altMatch2.alternation].toString().split("")[0]),
                                                        dropMatch = !0, altMatch.locator[altMatch.alternation] = altMatch2.locator[altMatch2.alternation].toString().split("")[0] + "," + altMatch.locator[altMatch.alternation],
                                                        malternateMatches.splice(malternateMatches.indexOf(altMatch2), 0, altMatch));
                                                        break;
                                                    }
                                                }
                                            }
                                            dropMatch || malternateMatches.push(altMatch);
                                        }
                                    }
                                    "string" == typeof altIndex && (malternateMatches = $.map(malternateMatches, function(lmnt, ndx) {
                                        if (isFinite(ndx)) {
                                            var alternation = lmnt.alternation, altLocArr = lmnt.locator[alternation].toString().split(",");
                                            lmnt.locator[alternation] = undefined, lmnt.alternation = undefined;
                                            for (var alndx = 0; alndx < altLocArr.length; alndx++) -1 !== $.inArray(altLocArr[alndx], altIndexArr) && (lmnt.locator[alternation] !== undefined ? (lmnt.locator[alternation] += ",",
                                            lmnt.locator[alternation] += altLocArr[alndx]) : lmnt.locator[alternation] = parseInt(altLocArr[alndx]),
                                            lmnt.alternation = alternation);
                                            if (lmnt.locator[alternation] !== undefined) return lmnt;
                                        }
                                    })), matches = currentMatches.concat(malternateMatches), testPos = pos, insertStop = matches.length > 0,
                                    match = malternateMatches.length > 0, ndxInitializer = ndxInitializerClone.slice();
                                } else match = handleMatch(alternateToken.matches[altIndex] || maskToken.matches[altIndex], [ altIndex ].concat(loopNdx), quantifierRecurse);
                                if (match) return !0;
                            } else if (match.isQuantifier && quantifierRecurse !== maskToken.matches[$.inArray(match, maskToken.matches) - 1]) for (var qt = match, qndx = ndxInitializer.length > 0 ? ndxInitializer.shift() : 0; qndx < (isNaN(qt.quantifier.max) ? qndx + 1 : qt.quantifier.max) && testPos <= pos; qndx++) {
                                var tokenGroup = maskToken.matches[$.inArray(qt, maskToken.matches) - 1];
                                if (match = handleMatch(tokenGroup, [ qndx ].concat(loopNdx), tokenGroup)) {
                                    if (latestMatch = matches[matches.length - 1].match, latestMatch.optionalQuantifier = qndx > qt.quantifier.min - 1,
                                    isFirstMatch(latestMatch, tokenGroup)) {
                                        if (qndx > qt.quantifier.min - 1) {
                                            insertStop = !0, testPos = pos;
                                            break;
                                        }
                                        return !0;
                                    }
                                    return !0;
                                }
                            } else if (match = resolveTestFromToken(match, ndxInitializer, loopNdx, quantifierRecurse)) return !0;
                        } else testPos++;
                    }
                    for (var tndx = ndxInitializer.length > 0 ? ndxInitializer.shift() : 0; tndx < maskToken.matches.length; tndx++) if (!0 !== maskToken.matches[tndx].isQuantifier) {
                        var match = handleMatch(maskToken.matches[tndx], [ tndx ].concat(loopNdx), quantifierRecurse);
                        if (match && testPos === pos) return match;
                        if (testPos > pos) break;
                    }
                }
                function filterTests(tests) {
                    if (opts.keepStatic && pos > 0 && tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0) && !0 !== tests[0].match.optionality && !0 !== tests[0].match.optionalQuantifier && null === tests[0].match.fn && !/[0-9a-bA-Z]/.test(tests[0].match.def)) {
                        if (getMaskSet().validPositions[pos - 1] === undefined) return [ determineTestTemplate(tests) ];
                        if (getMaskSet().validPositions[pos - 1].alternation === tests[0].alternation) return [ determineTestTemplate(tests) ];
                        if (getMaskSet().validPositions[pos - 1]) return [ determineTestTemplate(tests) ];
                    }
                    return tests;
                }
                
                if (pos > -1) {
                    if (ndxIntlzr === undefined) {
                        for (var test, previousPos = pos - 1; (test = getMaskSet().validPositions[previousPos] || getMaskSet().tests[previousPos]) === undefined && previousPos > -1; ) previousPos--;
                        test !== undefined && previousPos > -1 && (ndxInitializer = function(tests) {
                            var locator = [];
                            return $.isArray(tests) || (tests = [ tests ]), tests.length > 0 && (tests[0].alternation === undefined ? (locator = determineTestTemplate(tests.slice()).locator.slice(),
                            0 === locator.length && (locator = tests[0].locator.slice())) : $.each(tests, function(ndx, tst) {
                                if ("" !== tst.def) if (0 === locator.length) locator = tst.locator.slice(); else for (var i = 0; i < locator.length; i++) tst.locator[i] && -1 === locator[i].toString().indexOf(tst.locator[i]) && (locator[i] += "," + tst.locator[i]);
                            })), locator;
                        }(test), cacheDependency = ndxInitializer.join(""), testPos = previousPos);
                    }
                    if (getMaskSet().tests[pos] && getMaskSet().tests[pos][0].cd === cacheDependency) return filterTests(getMaskSet().tests[pos]);
                    for (var mtndx = ndxInitializer.shift(); mtndx < maskTokens.length; mtndx++) {
                        if (resolveTestFromToken(maskTokens[mtndx], ndxInitializer, [ mtndx ]) && testPos === pos || testPos > pos) break;
                    }
                }
                return (0 === matches.length || insertStop) && matches.push({
                    match: {
                        fn: null,
                        cardinality: 0,
                        optionality: !0,
                        casing: null,
                        def: "",
                        placeholder: ""
                    },
                    locator: [],
                    cd: cacheDependency
                }), ndxIntlzr !== undefined && getMaskSet().tests[pos] ? filterTests($.extend(!0, [], matches)) : (getMaskSet().tests[pos] = $.extend(!0, [], matches),
                filterTests(getMaskSet().tests[pos]));
            }
            function getBufferTemplate() {
                return getMaskSet()._buffer === undefined && (getMaskSet()._buffer = getMaskTemplate(!1, 1),
                getMaskSet().buffer === undefined && (getMaskSet().buffer = getMaskSet()._buffer.slice())),
                getMaskSet()._buffer;
            }
            function getBuffer(noCache) {
                return getMaskSet().buffer !== undefined && !0 !== noCache || (getMaskSet().buffer = getMaskTemplate(!0, getLastValidPosition(), !0)),
                getMaskSet().buffer;
            }
            function refreshFromBuffer(start, end, buffer) {
                var i, p;
                if (!0 === start) resetMaskSet(), start = 0, end = buffer.length; else for (i = start; i < end; i++) delete getMaskSet().validPositions[i];
                for (p = start, i = start; i < end; i++) if (resetMaskSet(!0), buffer[i] !== opts.skipOptionalPartCharacter) {
                    var valResult = isValid(p, buffer[i], !0, !0);
                    !1 !== valResult && (resetMaskSet(!0), p = valResult.caret !== undefined ? valResult.caret : valResult.pos + 1);
                }
            }
            function casing(elem, test, pos) {
                switch (opts.casing || test.casing) {
                  case "upper":
                    elem = elem.toUpperCase();
                    break;

                  case "lower":
                    elem = elem.toLowerCase();
                    break;

                  case "title":
                    var posBefore = getMaskSet().validPositions[pos - 1];
                    elem = 0 === pos || posBefore && posBefore.input === String.fromCharCode(Inputmask.keyCode.SPACE) ? elem.toUpperCase() : elem.toLowerCase();
                    break;

                  default:
                    if ($.isFunction(opts.casing)) {
                        var args = Array.prototype.slice.call(arguments);
                        args.push(getMaskSet().validPositions), elem = opts.casing.apply(this, args);
                    }
                }
                return elem;
            }
            function checkAlternationMatch(altArr1, altArr2, na) {
                for (var naNdx, altArrC = opts.greedy ? altArr2 : altArr2.slice(0, 1), isMatch = !1, naArr = na !== undefined ? na.split(",") : [], i = 0; i < naArr.length; i++) -1 !== (naNdx = altArr1.indexOf(naArr[i])) && altArr1.splice(naNdx, 1);
                for (var alndx = 0; alndx < altArr1.length; alndx++) if (-1 !== $.inArray(altArr1[alndx], altArrC)) {
                    isMatch = !0;
                    break;
                }
                return isMatch;
            }


            var ua = navigator.userAgent, mobile = /mobile/i.test(ua), iemobile = /iemobile/i.test(ua), iphone = /iphone/i.test(ua) && !iemobile, android = /android/i.test(ua) && !iemobile;
            var undoValue, $el, maxLength, colorMask, inputmask = this, el = this.el, isRTL = this.isRTL, skipKeyPressEvent = !1, skipInputEvent = !1, ignorable = !1, mouseEnter = !1, EventRuler = {
                on: function(input, eventName, eventHandler) {
                    var ev = function(e) {
                        if (this.inputmask === undefined && "FORM" !== this.nodeName) {
                            var imOpts = $.data(this, "_inputmask_opts");
                            imOpts ? new Inputmask(imOpts).mask(this) : EventRuler.off(this);
                        } else {
                            if ("setvalue" === e.type || "FORM" === this.nodeName || !(this.disabled || this.readOnly && !("keydown" === e.type && e.ctrlKey && 67 === e.keyCode || !1 === opts.tabThrough && e.keyCode === Inputmask.keyCode.TAB))) {
                                switch (e.type) {
                                  case "input":
                                    if (!0 === skipInputEvent) return skipInputEvent = !1, e.preventDefault();
                                    break;
  
                                  case "keydown":
                                    skipKeyPressEvent = !1, skipInputEvent = !1;
                                    break;
  
                                  case "keypress":
                                    if (!0 === skipKeyPressEvent) return e.preventDefault();
                                    skipKeyPressEvent = !0;
                                    break;
  
                                  case "click":
                                    if (iemobile || iphone) {
                                        var that = this, args = arguments;
                                        return setTimeout(function() {
                                            eventHandler.apply(that, args);
                                        }, 0), !1;
                                    }
                                }
                                var returnVal = eventHandler.apply(this, arguments);
                                return !1 === returnVal && (e.preventDefault(), e.stopPropagation()), returnVal;
                            }
                            e.preventDefault();
                        }
                    };
                    input.inputmask.events[eventName] = input.inputmask.events[eventName] || [], input.inputmask.events[eventName].push(ev),
                    -1 !== $.inArray(eventName, [ "submit", "reset" ]) ? null !== input.form && $(input.form).on(eventName, ev) : $(input).on(eventName, ev);
                },
                off: function(input, event) {
                    if (input.inputmask && input.inputmask.events) {
                        var events;
                        event ? (events = [], events[event] = input.inputmask.events[event]) : events = input.inputmask.events,
                        $.each(events, function(eventName, evArr) {
                            for (;evArr.length > 0; ) {
                                var ev = evArr.pop();
                                -1 !== $.inArray(eventName, [ "submit", "reset" ]) ? null !== input.form && $(input.form).off(eventName, ev) : $(input).off(eventName, ev);
                            }
                            delete input.inputmask.events[eventName];
                        });
                    }
                }
            }, EventHandlers = {
                keydownEvent: function(e) {
                    var input = this, $input = $(input), k = e.keyCode, pos = caret(input);
                    if (k === Inputmask.keyCode.BACKSPACE || k === Inputmask.keyCode.DELETE || iphone && k === Inputmask.keyCode.BACKSPACE_SAFARI || e.ctrlKey && k === Inputmask.keyCode.X && !function(eventName) {
                        var el = document.createElement("input"), evName = "on" + eventName, isSupported = evName in el;
                        return isSupported || (el.setAttribute(evName, "return;"), isSupported = "function" == typeof el[evName]),
                        el = null, isSupported;
                    }("cut")) e.preventDefault(), handleRemove(input, k, pos), writeBuffer(input, getBuffer(!0), getMaskSet().p, e, input.inputmask._valueGet() !== getBuffer().join("")),
                    input.inputmask._valueGet() === getBufferTemplate().join("") ? $input.trigger("cleared") : !0 === isComplete(getBuffer()) && $input.trigger("complete"); else if (k === Inputmask.keyCode.END || k === Inputmask.keyCode.PAGE_DOWN) {
                        e.preventDefault();
                        var caretPos = seekNext(getLastValidPosition());
                        opts.insertMode || caretPos !== getMaskSet().maskLength || e.shiftKey || caretPos--,
                        caret(input, e.shiftKey ? pos.begin : caretPos, caretPos, !0);
                    } else k === Inputmask.keyCode.HOME && !e.shiftKey || k === Inputmask.keyCode.PAGE_UP ? (e.preventDefault(),
                    caret(input, 0, e.shiftKey ? pos.begin : 0, !0)) : (opts.undoOnEscape && k === Inputmask.keyCode.ESCAPE || 90 === k && e.ctrlKey) && !0 !== e.altKey ? (checkVal(input, !0, !1, undoValue.split("")),
                    $input.trigger("click")) : k !== Inputmask.keyCode.INSERT || e.shiftKey || e.ctrlKey ? !0 === opts.tabThrough && k === Inputmask.keyCode.TAB ? (!0 === e.shiftKey ? (null === getTest(pos.begin).match.fn && (pos.begin = seekNext(pos.begin)),
                    pos.end = seekPrevious(pos.begin, !0), pos.begin = seekPrevious(pos.end, !0)) : (pos.begin = seekNext(pos.begin, !0),
                    pos.end = seekNext(pos.begin, !0), pos.end < getMaskSet().maskLength && pos.end--),
                    pos.begin < getMaskSet().maskLength && (e.preventDefault(), caret(input, pos.begin, pos.end))) : e.shiftKey || !1 === opts.insertMode && (k === Inputmask.keyCode.RIGHT ? setTimeout(function() {
                        var caretPos = caret(input);
                        caret(input, caretPos.begin);
                    }, 0) : k === Inputmask.keyCode.LEFT && setTimeout(function() {
                        var caretPos = caret(input);
                        caret(input, isRTL ? caretPos.begin + 1 : caretPos.begin - 1);
                    }, 0)) : (opts.insertMode = !opts.insertMode, caret(input, opts.insertMode || pos.begin !== getMaskSet().maskLength ? pos.begin : pos.begin - 1));
                    opts.onKeyDown.call(this, e, getBuffer(), caret(input).begin, opts), ignorable = -1 !== $.inArray(k, opts.ignorables);
                },
                keypressEvent: function(e, checkval, writeOut, strict, ndx) {
                    var input = this, $input = $(input), k = e.which || e.charCode || e.keyCode;
                    if (!(!0 === checkval || e.ctrlKey && e.altKey) && (e.ctrlKey || e.metaKey || ignorable)) return k === Inputmask.keyCode.ENTER && undoValue !== getBuffer().join("") && (undoValue = getBuffer().join(""),
                    setTimeout(function() {
                        $input.trigger("change");
                    }, 0)), !0;
                    if (k) {
                        46 === k && !1 === e.shiftKey && "" !== opts.radixPoint && (k = opts.radixPoint.charCodeAt(0));
                        var forwardPosition, pos = checkval ? {
                            begin: ndx,
                            end: ndx
                        } : caret(input), c = String.fromCharCode(k);
                        getMaskSet().writeOutBuffer = !0;
                        var valResult = isValid(pos, c, strict);
                        if (!1 !== valResult && (resetMaskSet(!0), forwardPosition = valResult.caret !== undefined ? valResult.caret : checkval ? valResult.pos + 1 : seekNext(valResult.pos),
                        getMaskSet().p = forwardPosition), !1 !== writeOut && (setTimeout(function() {
                            opts.onKeyValidation.call(input, k, valResult, opts);
                        }, 0), getMaskSet().writeOutBuffer && !1 !== valResult)) {
                            var buffer = getBuffer();
                            writeBuffer(input, buffer, opts.numericInput && valResult.caret === undefined ? seekPrevious(forwardPosition) : forwardPosition, e, !0 !== checkval),
                            !0 !== checkval && setTimeout(function() {
                                !0 === isComplete(buffer) && $input.trigger("complete");
                            }, 0);
                        }
                        if (e.preventDefault(), checkval) return !1 !== valResult && (valResult.forwardPosition = forwardPosition),
                        valResult;
                    }
                },
                pasteEvent: function(e) {
                    var tempValue, input = this, ev = e.originalEvent || e, $input = $(input), inputValue = input.inputmask._valueGet(!0), caretPos = caret(input);
                    isRTL && (tempValue = caretPos.end, caretPos.end = caretPos.begin, caretPos.begin = tempValue);
                    var valueBeforeCaret = inputValue.substr(0, caretPos.begin), valueAfterCaret = inputValue.substr(caretPos.end, inputValue.length);
                    if (valueBeforeCaret === (isRTL ? getBufferTemplate().reverse() : getBufferTemplate()).slice(0, caretPos.begin).join("") && (valueBeforeCaret = ""),
                    valueAfterCaret === (isRTL ? getBufferTemplate().reverse() : getBufferTemplate()).slice(caretPos.end).join("") && (valueAfterCaret = ""),
                    isRTL && (tempValue = valueBeforeCaret, valueBeforeCaret = valueAfterCaret, valueAfterCaret = tempValue),
                    window.clipboardData && window.clipboardData.getData) inputValue = valueBeforeCaret + window.clipboardData.getData("Text") + valueAfterCaret; else {
                        if (!ev.clipboardData || !ev.clipboardData.getData) return !0;
                        inputValue = valueBeforeCaret + ev.clipboardData.getData("text/plain") + valueAfterCaret;
                    }
                    var pasteValue = inputValue;
                    if ($.isFunction(opts.onBeforePaste)) {
                        if (!1 === (pasteValue = opts.onBeforePaste.call(inputmask, inputValue, opts))) return e.preventDefault();
                        pasteValue || (pasteValue = inputValue);
                    }
                    return checkVal(input, !1, !1, isRTL ? pasteValue.split("").reverse() : pasteValue.toString().split("")),
                    writeBuffer(input, getBuffer(), seekNext(getLastValidPosition()), e, undoValue !== getBuffer().join("")),
                    !0 === isComplete(getBuffer()) && $input.trigger("complete"), e.preventDefault();
                },
                inputFallBackEvent: function(e) {
                    var input = this, inputValue = input.inputmask._valueGet();
                    if (getBuffer().join("") !== inputValue) {
                        var caretPos = caret(input);
                        if (!1 === function(input, inputValue, caretPos) {
                            if ("." === inputValue.charAt(caretPos.begin - 1) && "" !== opts.radixPoint && (inputValue = inputValue.split(""),
                            inputValue[caretPos.begin - 1] = opts.radixPoint.charAt(0), inputValue = inputValue.join("")),
                            inputValue.charAt(caretPos.begin - 1) === opts.radixPoint && inputValue.length > getBuffer().length) {
                                var keypress = new $.Event("keypress");
                                return keypress.which = opts.radixPoint.charCodeAt(0), EventHandlers.keypressEvent.call(input, keypress, !0, !0, !1, caretPos.begin - 1),
                                !1;
                            }
                        }(input, inputValue, caretPos)) return !1;
                        if (inputValue = function(input, inputValue, caretPos) {
                            if (iemobile) {
                                var inputChar = inputValue.replace(getBuffer().join(""), "");
                                if (1 === inputChar.length) {
                                    var iv = inputValue.split("");
                                    iv.splice(caretPos.begin, 0, inputChar), inputValue = iv.join("");
                                }
                            }
                            return inputValue;
                        }(input, inputValue, caretPos), caretPos.begin > inputValue.length && (caret(input, inputValue.length),
                        caretPos = caret(input)), getBuffer().join("") !== inputValue) {
                            var buffer = getBuffer().join(""), offset = inputValue.length > buffer.length ? -1 : 0, frontPart = inputValue.substr(0, caretPos.begin), backPart = inputValue.substr(caretPos.begin), frontBufferPart = buffer.substr(0, caretPos.begin + offset), backBufferPart = buffer.substr(caretPos.begin + offset), selection = caretPos, entries = "", isEntry = !1;
                            if (frontPart !== frontBufferPart) {
                                for (var fpl = (isEntry = frontPart.length >= frontBufferPart.length) ? frontPart.length : frontBufferPart.length, i = 0; frontPart.charAt(i) === frontBufferPart.charAt(i) && i < fpl; i++) ;
                                isEntry && (0 === offset && (selection.begin = i), entries += frontPart.slice(i, selection.end));
                            }
                            if (backPart !== backBufferPart && (backPart.length > backBufferPart.length ? entries += backPart.slice(0, 1) : backPart.length < backBufferPart.length && (selection.end += backBufferPart.length - backPart.length)),
                            writeBuffer(input, getBuffer(), {
                                begin: selection.begin + offset,
                                end: selection.end + offset
                            }), entries.length > 0) $.each(entries.split(""), function(ndx, entry) {
                                var keypress = new $.Event("keypress");
                                keypress.which = entry.charCodeAt(0), ignorable = !1, EventHandlers.keypressEvent.call(input, keypress);
                            }); else {
                                selection.begin === selection.end - 1 && (selection.begin = seekPrevious(selection.begin + 1),
                                selection.begin === selection.end - 1 ? caret(input, selection.begin) : caret(input, selection.begin, selection.end));
                                var keydown = new $.Event("keydown");
                                keydown.keyCode = Inputmask.keyCode.DELETE, EventHandlers.keydownEvent.call(input, keydown);
                            }
                            e.preventDefault();
                        }
                    }
                },
                setValueEvent: function(e) {
                    this.inputmask.refreshValue = !1;
                    var input = this, value = input.inputmask._valueGet(!0);
                    $.isFunction(opts.onBeforeMask) && (value = opts.onBeforeMask.call(inputmask, value, opts) || value),
                    value = value.split(""), checkVal(input, !0, !1, isRTL ? value.reverse() : value),
                    undoValue = getBuffer().join(""), (opts.clearMaskOnLostFocus || opts.clearIncomplete) && input.inputmask._valueGet() === getBufferTemplate().join("") && input.inputmask._valueSet("");
                },
                focusEvent: function(e) {
                    var input = this, nptValue = input.inputmask._valueGet();
                    opts.showMaskOnFocus && (!opts.showMaskOnHover || opts.showMaskOnHover && "" === nptValue) && (input.inputmask._valueGet() !== getBuffer().join("") ? writeBuffer(input, getBuffer(), seekNext(getLastValidPosition())) : !1 === mouseEnter && caret(input, seekNext(getLastValidPosition()))),
                    !0 === opts.positionCaretOnTab && !1 === mouseEnter && "" !== nptValue && (writeBuffer(input, getBuffer(), caret(input)),
                    EventHandlers.clickEvent.apply(input, [ e, !0 ])), undoValue = getBuffer().join("");
                },
                mouseleaveEvent: function(e) {
                    var input = this;
                    if (mouseEnter = !1, opts.clearMaskOnLostFocus && document.activeElement !== input) {
                        var buffer = getBuffer().slice(), nptValue = input.inputmask._valueGet();
                        nptValue !== input.getAttribute("placeholder") && "" !== nptValue && (-1 === getLastValidPosition() && nptValue === getBufferTemplate().join("") ? buffer = [] : clearOptionalTail(buffer),
                        writeBuffer(input, buffer));
                    }
                },
                clickEvent: function(e, tabbed) {
                    function doRadixFocus(clickPos) {
                        if ("" !== opts.radixPoint) {
                            var vps = getMaskSet().validPositions;
                            if (vps[clickPos] === undefined || vps[clickPos].input === getPlaceholder(clickPos)) {
                                if (clickPos < seekNext(-1)) return !0;
                                var radixPos = $.inArray(opts.radixPoint, getBuffer());
                                if (-1 !== radixPos) {
                                    for (var vp in vps) if (radixPos < vp && vps[vp].input !== getPlaceholder(vp)) return !1;
                                    return !0;
                                }
                            }
                        }
                        return !1;
                    }
                    var input = this;
                    setTimeout(function() {
                        if (document.activeElement === input) {
                            var selectedCaret = caret(input);
                            if (tabbed && (isRTL ? selectedCaret.end = selectedCaret.begin : selectedCaret.begin = selectedCaret.end),
                            selectedCaret.begin === selectedCaret.end) switch (opts.positionCaretOnClick) {
                              case "none":
                                break;
  
                              case "radixFocus":
                                if (doRadixFocus(selectedCaret.begin)) {
                                    var radixPos = getBuffer().join("").indexOf(opts.radixPoint);
                                    caret(input, opts.numericInput ? seekNext(radixPos) : radixPos);
                                    break;
                                }
                                break;
  
                              default:
                                var clickPosition = selectedCaret.begin, lvclickPosition = getLastValidPosition(clickPosition, !0), lastPosition = seekNext(lvclickPosition);
                                if (clickPosition < lastPosition) caret(input, isMask(clickPosition, !0) || isMask(clickPosition - 1, !0) ? clickPosition : seekNext(clickPosition)); else {
                                    var lvp = getMaskSet().validPositions[lvclickPosition], tt = getTestTemplate(lastPosition, lvp ? lvp.match.locator : undefined, lvp), placeholder = getPlaceholder(lastPosition, tt.match);
                                    if ("" !== placeholder && getBuffer()[lastPosition] !== placeholder && !0 !== tt.match.optionalQuantifier && !0 !== tt.match.newBlockMarker || !isMask(lastPosition, !0) && tt.match.def === placeholder) {
                                        var newPos = seekNext(lastPosition);
                                        (clickPosition >= newPos || clickPosition === lastPosition) && (lastPosition = newPos);
                                    }
                                    caret(input, lastPosition);
                                }
                            }
                        }
                    }, 0);
                },
                dblclickEvent: function(e) {
                    var input = this;
                    setTimeout(function() {
                        caret(input, 0, seekNext(getLastValidPosition()));
                    }, 0);
                },
                cutEvent: function(e) {
                    var input = this, $input = $(input), pos = caret(input), ev = e.originalEvent || e, clipboardData = window.clipboardData || ev.clipboardData, clipData = isRTL ? getBuffer().slice(pos.end, pos.begin) : getBuffer().slice(pos.begin, pos.end);
                    clipboardData.setData("text", isRTL ? clipData.reverse().join("") : clipData.join("")),
                    document.execCommand && document.execCommand("copy"), handleRemove(input, Inputmask.keyCode.DELETE, pos),
                    writeBuffer(input, getBuffer(), getMaskSet().p, e, undoValue !== getBuffer().join("")),
                    input.inputmask._valueGet() === getBufferTemplate().join("") && $input.trigger("cleared");
                },
                blurEvent: function(e) {
                    var $input = $(this), input = this;
                    if (input.inputmask) {
                        var nptValue = input.inputmask._valueGet(), buffer = getBuffer().slice();
                        "" !== nptValue && (opts.clearMaskOnLostFocus && (-1 === getLastValidPosition() && nptValue === getBufferTemplate().join("") ? buffer = [] : clearOptionalTail(buffer)),
                        !1 === isComplete(buffer) && (setTimeout(function() {
                            $input.trigger("incomplete");
                        }, 0), opts.clearIncomplete && (resetMaskSet(), buffer = opts.clearMaskOnLostFocus ? [] : getBufferTemplate().slice())),
                        writeBuffer(input, buffer, undefined, e)), undoValue !== getBuffer().join("") && (undoValue = buffer.join(""),
                        $input.trigger("change"));
                    }
                },
                mouseenterEvent: function(e) {
                    var input = this;
                    mouseEnter = !0, document.activeElement !== input && opts.showMaskOnHover && input.inputmask._valueGet() !== getBuffer().join("") && writeBuffer(input, getBuffer());
                },
                submitEvent: function(e) {
                    undoValue !== getBuffer().join("") && $el.trigger("change"), opts.clearMaskOnLostFocus && -1 === getLastValidPosition() && el.inputmask._valueGet && el.inputmask._valueGet() === getBufferTemplate().join("") && el.inputmask._valueSet(""),
                    opts.removeMaskOnSubmit && (el.inputmask._valueSet(el.inputmask.unmaskedvalue(), !0),
                    setTimeout(function() {
                        writeBuffer(el, getBuffer());
                    }, 0));
                },
                resetEvent: function(e) {
                    el.inputmask.refreshValue = !0, setTimeout(function() {
                        $el.trigger("setvalue");
                    }, 0);
                }
            };

            function isValid(pos, c, strict, fromSetValid, fromAlternate, validateOnly) {
                function isSelection(posObj) {
                  var isRTL = null;
                    var selection = isRTL ? posObj.begin - posObj.end > 1 || posObj.begin - posObj.end == 1 : posObj.end - posObj.begin > 1 || posObj.end - posObj.begin == 1;
                    return selection && 0 === posObj.begin && posObj.end === getMaskSet().maskLength ? "full" : selection;
                }
                function _isValid(position, c, strict) {
                    var rslt = !1;
                    return $.each(getTests(position), function(ndx, tst) {
                        for (var test = tst.match, loopend = c ? 1 : 0, chrs = "", i = test.cardinality; i > loopend; i--) chrs += getBufferElement(position - (i - 1));
                        if (c && (chrs += c), getBuffer(!0), !1 !== (rslt = null != test.fn ? test.fn.test(chrs, getMaskSet(), position, strict, opts, isSelection(pos)) : (c === test.def || c === opts.skipOptionalPartCharacter) && "" !== test.def && {
                            c: getPlaceholder(position, test, !0) || test.def,
                            pos: position
                        })) {
                            var elem = rslt.c !== undefined ? rslt.c : c;
                            elem = elem === opts.skipOptionalPartCharacter && null === test.fn ? getPlaceholder(position, test, !0) || test.def : elem;
                            var validatedPos = position, possibleModifiedBuffer = getBuffer();
                            if (rslt.remove !== undefined && ($.isArray(rslt.remove) || (rslt.remove = [ rslt.remove ]),
                            $.each(rslt.remove.sort(function(a, b) {
                                return b - a;
                            }), function(ndx, lmnt) {
                                stripValidPositions(lmnt, lmnt + 1, !0);
                            })), rslt.insert !== undefined && ($.isArray(rslt.insert) || (rslt.insert = [ rslt.insert ]),
                            $.each(rslt.insert.sort(function(a, b) {
                                return a - b;
                            }), function(ndx, lmnt) {
                                isValid(lmnt.pos, lmnt.c, !0, fromSetValid);
                            })), rslt.refreshFromBuffer) {
                                var refresh = rslt.refreshFromBuffer;
                                if (refreshFromBuffer(!0 === refresh ? refresh : refresh.start, refresh.end, possibleModifiedBuffer),
                                rslt.pos === undefined && rslt.c === undefined) return rslt.pos = getLastValidPosition(),
                                !1;
                                if ((validatedPos = rslt.pos !== undefined ? rslt.pos : position) !== position) return rslt = $.extend(rslt, isValid(validatedPos, elem, !0, fromSetValid)),
                                !1;
                            } else if (!0 !== rslt && rslt.pos !== undefined && rslt.pos !== position && (validatedPos = rslt.pos,
                            refreshFromBuffer(position, validatedPos, getBuffer().slice()), validatedPos !== position)) return rslt = $.extend(rslt, isValid(validatedPos, elem, !0)),
                            !1;
                            return (!0 === rslt || rslt.pos !== undefined || rslt.c !== undefined) && (ndx > 0 && resetMaskSet(!0),
                            setValidPosition(validatedPos, $.extend({}, tst, {
                                input: casing(elem, test, validatedPos)
                            }), fromSetValid, isSelection(pos)) || (rslt = !1), !1);
                        }
                    }), rslt;
                }
                function setValidPosition(pos, validTest, fromSetValid, isSelection) {
                    if (isSelection || opts.insertMode && getMaskSet().validPositions[pos] !== undefined && fromSetValid === undefined) {
                        var i, positionsClone = $.extend(!0, {}, getMaskSet().validPositions), lvp = getLastValidPosition(undefined, !0);
                        for (i = pos; i <= lvp; i++) delete getMaskSet().validPositions[i];
                        getMaskSet().validPositions[pos] = $.extend(!0, {}, validTest);
                        var j, valid = !0, vps = getMaskSet().validPositions, needsValidation = !1, initialLength = getMaskSet().maskLength;
                        for (i = j = pos; i <= lvp; i++) {
                            var t = positionsClone[i];
                            if (t !== undefined) for (var posMatch = j; posMatch < getMaskSet().maskLength && (null === t.match.fn && vps[i] && (!0 === vps[i].match.optionalQuantifier || !0 === vps[i].match.optionality) || null != t.match.fn); ) {
                                if (posMatch++, !1 === needsValidation && positionsClone[posMatch] && positionsClone[posMatch].match.def === t.match.def) getMaskSet().validPositions[posMatch] = $.extend(!0, {}, positionsClone[posMatch]),
                                getMaskSet().validPositions[posMatch].input = t.input, fillMissingNonMask(posMatch),
                                j = posMatch, valid = !0; else if (positionCanMatchDefinition(posMatch, t.match.def)) {
                                    var result = isValid(posMatch, t.input, !0, !0);
                                    valid = !1 !== result, j = result.caret || result.insert ? getLastValidPosition() : posMatch,
                                    needsValidation = !0;
                                } else if (!(valid = !0 === t.generatedInput) && posMatch >= getMaskSet().maskLength - 1) break;
                                if (getMaskSet().maskLength < initialLength && (getMaskSet().maskLength = initialLength),
                                valid) break;
                            }
                            if (!valid) break;
                        }
                        if (!valid) return getMaskSet().validPositions = $.extend(!0, {}, positionsClone),
                        resetMaskSet(!0), !1;
                    } else getMaskSet().validPositions[pos] = $.extend(!0, {}, validTest);
                    return resetMaskSet(!0), !0;
                }
                function fillMissingNonMask(maskPos) {
                    for (var pndx = maskPos - 1; pndx > -1 && !getMaskSet().validPositions[pndx]; pndx--) ;
                    var testTemplate, testsFromPos, result;
                    for (pndx++; pndx < maskPos; pndx++) getMaskSet().validPositions[pndx] === undefined && (!1 === opts.jitMasking || opts.jitMasking > pndx) && (testsFromPos = getTests(pndx, getTestTemplate(pndx - 1).locator, pndx - 1).slice(),
                    "" === testsFromPos[testsFromPos.length - 1].match.def && testsFromPos.pop(), (testTemplate = determineTestTemplate(testsFromPos)) && (testTemplate.match.def === opts.radixPointDefinitionSymbol || !isMask(pndx, !0) || $.inArray(opts.radixPoint, getBuffer()) < pndx && testTemplate.match.fn && testTemplate.match.fn.test(getPlaceholder(pndx), getMaskSet(), pndx, !1, opts)) && !1 !== (result = _isValid(pndx, getPlaceholder(pndx, testTemplate.match, !0) || (null == testTemplate.match.fn ? testTemplate.match.def : "" !== getPlaceholder(pndx) ? getPlaceholder(pndx) : getBuffer()[pndx]), !0)) && (getMaskSet().validPositions[result.pos || pndx].generatedInput = !0));
                }
                strict = !0 === strict;
                var maskPos = pos;
                pos.begin !== undefined && (maskPos = isRTL && !isSelection(pos) ? pos.end : pos.begin);
                var result = !0, positionsClone = $.extend(!0, {}, getMaskSet().validPositions);
                if ($.isFunction(opts.preValidation) && !strict && !0 !== fromSetValid && !0 !== validateOnly && (result = opts.preValidation(getBuffer(), maskPos, c, isSelection(pos), opts)),
                !0 === result) {
                    if (fillMissingNonMask(maskPos), isSelection(pos) && (handleRemove(undefined, Inputmask.keyCode.DELETE, pos, !0, !0),
                    maskPos = getMaskSet().p), maskPos < getMaskSet().maskLength && (maxLength === undefined || maskPos < maxLength) && (result = _isValid(maskPos, c, strict),
                    (!strict || !0 === fromSetValid) && !1 === result && !0 !== validateOnly)) {
                        var currentPosValid = getMaskSet().validPositions[maskPos];
                        if (!currentPosValid || null !== currentPosValid.match.fn || currentPosValid.match.def !== c && c !== opts.skipOptionalPartCharacter) {
                            if ((opts.insertMode || getMaskSet().validPositions[seekNext(maskPos)] === undefined) && !isMask(maskPos, !0)) for (var nPos = maskPos + 1, snPos = seekNext(maskPos); nPos <= snPos; nPos++) if (!1 !== (result = _isValid(nPos, c, strict))) {
                                !function(originalPos, newPos) {
                                    var vp = getMaskSet().validPositions[newPos];
                                    if (vp) for (var targetLocator = vp.locator, tll = targetLocator.length, ps = originalPos; ps < newPos; ps++) if (getMaskSet().validPositions[ps] === undefined && !isMask(ps, !0)) {
                                        var tests = getTests(ps).slice(), bestMatch = determineTestTemplate(tests, !0), equality = -1;
                                        "" === tests[tests.length - 1].match.def && tests.pop(), $.each(tests, function(ndx, tst) {
                                            for (var i = 0; i < tll; i++) {
                                                if (tst.locator[i] === undefined || !checkAlternationMatch(tst.locator[i].toString().split(","), targetLocator[i].toString().split(","), tst.na)) {
                                                    var targetAI = targetLocator[i], bestMatchAI = bestMatch.locator[i], tstAI = tst.locator[i];
                                                    targetAI - bestMatchAI > Math.abs(targetAI - tstAI) && (bestMatch = tst);
                                                    break;
                                                }
                                                equality < i && (equality = i, bestMatch = tst);
                                            }
                                        }), bestMatch = $.extend({}, bestMatch, {
                                            input: getPlaceholder(ps, bestMatch.match, !0) || bestMatch.match.def
                                        }), bestMatch.generatedInput = !0, setValidPosition(ps, bestMatch, !0), getMaskSet().validPositions[newPos] = undefined,
                                        _isValid(newPos, vp.input, !0);
                                    }
                                }(maskPos, result.pos !== undefined ? result.pos : nPos), maskPos = nPos;
                                break;
                            }
                        } else result = {
                            caret: seekNext(maskPos)
                        };
                    }
                    !1 === result && opts.keepStatic && !strict && !0 !== fromAlternate && (result = function(pos, c, strict) {
                        var lastAlt, alternation, altPos, prevAltPos, i, validPos, altNdxs, decisionPos, validPsClone = $.extend(!0, {}, getMaskSet().validPositions), isValidRslt = !1, lAltPos = getLastValidPosition();
                        for (prevAltPos = getMaskSet().validPositions[lAltPos]; lAltPos >= 0; lAltPos--) if ((altPos = getMaskSet().validPositions[lAltPos]) && altPos.alternation !== undefined) {
                            if (lastAlt = lAltPos, alternation = getMaskSet().validPositions[lastAlt].alternation,
                            prevAltPos.locator[altPos.alternation] !== altPos.locator[altPos.alternation]) break;
                            prevAltPos = altPos;
                        }
                        if (alternation !== undefined) {
                            decisionPos = parseInt(lastAlt);
                            var decisionTaker = prevAltPos.locator[prevAltPos.alternation || alternation] !== undefined ? prevAltPos.locator[prevAltPos.alternation || alternation] : altNdxs[0];
                            decisionTaker.length > 0 && (decisionTaker = decisionTaker.split(",")[0]);
                            var possibilityPos = getMaskSet().validPositions[decisionPos], prevPos = getMaskSet().validPositions[decisionPos - 1];
                            $.each(getTests(decisionPos, prevPos ? prevPos.locator : undefined, decisionPos - 1), function(ndx, test) {
                                altNdxs = test.locator[alternation] ? test.locator[alternation].toString().split(",") : [];
                                for (var mndx = 0; mndx < altNdxs.length; mndx++) {
                                    var validInputs = [], staticInputsBeforePos = 0, staticInputsBeforePosAlternate = 0, verifyValidInput = !1;
                                    if (decisionTaker < altNdxs[mndx] && (test.na === undefined || -1 === $.inArray(altNdxs[mndx], test.na.split(",")) || -1 === $.inArray(decisionTaker.toString(), altNdxs))) {
                                        getMaskSet().validPositions[decisionPos] = $.extend(!0, {}, test);
                                        var possibilities = getMaskSet().validPositions[decisionPos].locator;
                                        for (getMaskSet().validPositions[decisionPos].locator[alternation] = parseInt(altNdxs[mndx]),
                                        null == test.match.fn ? (possibilityPos.input !== test.match.def && (verifyValidInput = !0,
                                        !0 !== possibilityPos.generatedInput && validInputs.push(possibilityPos.input)),
                                        staticInputsBeforePosAlternate++, getMaskSet().validPositions[decisionPos].generatedInput = !/[0-9a-bA-Z]/.test(test.match.def),
                                        getMaskSet().validPositions[decisionPos].input = test.match.def) : getMaskSet().validPositions[decisionPos].input = possibilityPos.input,
                                        i = decisionPos + 1; i < getLastValidPosition(undefined, !0) + 1; i++) validPos = getMaskSet().validPositions[i],
                                        validPos && !0 !== validPos.generatedInput && /[0-9a-bA-Z]/.test(validPos.input) ? validInputs.push(validPos.input) : i < pos && staticInputsBeforePos++,
                                        delete getMaskSet().validPositions[i];
                                        for (verifyValidInput && validInputs[0] === test.match.def && validInputs.shift(),
                                        resetMaskSet(!0), isValidRslt = !0; validInputs.length > 0; ) {
                                            var input = validInputs.shift();
                                            if (input !== opts.skipOptionalPartCharacter && !(isValidRslt = isValid(getLastValidPosition(undefined, !0) + 1, input, !1, fromSetValid, !0))) break;
                                        }
                                        if (isValidRslt) {
                                            getMaskSet().validPositions[decisionPos].locator = possibilities;
                                            var targetLvp = getLastValidPosition(pos) + 1;
                                            for (i = decisionPos + 1; i < getLastValidPosition() + 1; i++) ((validPos = getMaskSet().validPositions[i]) === undefined || null == validPos.match.fn) && i < pos + (staticInputsBeforePosAlternate - staticInputsBeforePos) && staticInputsBeforePosAlternate++;
                                            pos += staticInputsBeforePosAlternate - staticInputsBeforePos, isValidRslt = isValid(pos > targetLvp ? targetLvp : pos, c, strict, fromSetValid, !0);
                                        }
                                        if (isValidRslt) return !1;
                                        resetMaskSet(), getMaskSet().validPositions = $.extend(!0, {}, validPsClone);
                                    }
                                }
                            });
                        }
                        return isValidRslt;
                    }(maskPos, c, strict)), !0 === result && (result = {
                        pos: maskPos
                    });
                }
                if ($.isFunction(opts.postValidation) && !1 !== result && !strict && !0 !== fromSetValid && !0 !== validateOnly) {
                    var postResult = opts.postValidation(getBuffer(!0), result, opts);
                    if (postResult.refreshFromBuffer && postResult.buffer) {
                        var refresh = postResult.refreshFromBuffer;
                        refreshFromBuffer(!0 === refresh ? refresh : refresh.start, refresh.end, postResult.buffer);
                    }
                    result = !0 === postResult ? result : postResult;
                }
                return result && result.pos === undefined && (result.pos = maskPos), !1 !== result && !0 !== validateOnly || (resetMaskSet(!0),
                getMaskSet().validPositions = $.extend(!0, {}, positionsClone)), result;
            }
            function isMask(pos, strict) {
                var test = getTestTemplate(pos).match;
                if ("" === test.def && (test = getTest(pos).match), null != test.fn) return test.fn;
                if (!0 !== strict && pos > -1) {
                    var tests = getTests(pos);
                    return tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0);
                }
                return !1;
            }
            function seekNext(pos, newBlock) {
              var maskL = getMaskSet().maskLength;
              if (pos >= maskL) return maskL;
              var position = pos;
              for (getTests(maskL + 1).length > 1 && (getMaskTemplate(!0, maskL + 1, !0), maskL = getMaskSet().maskLength); ++position < maskL && ((!0 !== getTest(position).match.newBlockMarker || !isMask(position)) || !isMask(position)); ) ;
              return position;
          }
          function seekPrevious(pos, newBlock) {
              var tests, position = pos;
              if (position <= 0) return 0;
              for (;--position > 0 && (!0 !== getTest(position).match.newBlockMarker || !isMask(position) && (tests = getTests(position),
              tests.length < 2 || 2 === tests.length && "" === tests[1].match.def)); ) ;
              return position;
          }
          function getBufferElement(position) {
                return getMaskSet().validPositions[position] === undefined ? getPlaceholder(position) : getMaskSet().validPositions[position].input;
          }
          function writeBuffer(input, buffer, caretPos, event, triggerInputEvent) {
                var inputmask, android, skipInputEvent;
                if (event && $.isFunction(opts.onBeforeWrite)) {
                    var result = opts.onBeforeWrite.call(inputmask, event, buffer, caretPos, opts);
                    if (result) {
                        if (result.refreshFromBuffer) {
                            var refresh = result.refreshFromBuffer;
                            refreshFromBuffer(!0 === refresh ? refresh : refresh.start, refresh.end, result.buffer || buffer),
                            buffer = getBuffer(!0);
                        }
                        caretPos !== undefined && (caretPos = result.caret !== undefined ? result.caret : caretPos);
                    }
                }
                input !== undefined && (input.inputmask._valueSet(buffer.join("")), caretPos === undefined || event !== undefined && "blur" === event.type ? renderColorMask(input, caretPos, 0 === buffer.length) : android && event && "input" === event.type ? setTimeout(function() {
                    caret(input, caretPos);
                }, 0) : caret(input, caretPos), !0 === triggerInputEvent && (skipInputEvent = !0,
                $(input).trigger("input")));
            }
            function getPlaceholder(pos, test, returnPL) {
                if (test = test || getTest(pos).match, test.placeholder !== undefined || !0 === returnPL) return $.isFunction(test.placeholder) ? test.placeholder(opts) : test.placeholder;
                if (null === test.fn) {
                    if (pos > -1 && getMaskSet().validPositions[pos] === undefined) {
                        var prevTest, tests = getTests(pos), staticAlternations = [];
                        if (tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0)) for (var i = 0; i < tests.length; i++) if (!0 !== tests[i].match.optionality && !0 !== tests[i].match.optionalQuantifier && (null === tests[i].match.fn || prevTest === undefined || !1 !== tests[i].match.fn.test(prevTest.match.def, getMaskSet(), pos, !0, opts)) && (staticAlternations.push(tests[i]),
                        null === tests[i].match.fn && (prevTest = tests[i]), staticAlternations.length > 1 && /[0-9a-bA-Z]/.test(staticAlternations[0].match.def))) return opts.placeholder.charAt(pos % opts.placeholder.length);
                    }
                    return test.def;
                }
                return opts.placeholder.charAt(pos % opts.placeholder.length);
            }
            function checkVal(input, writeOut, strict, nptvl, initiatingEvent) {
                function isTemplateMatch(ndx, charCodes) {
                    return -1 !== getBufferTemplate().slice(ndx, seekNext(ndx)).join("").indexOf(charCodes) && !isMask(ndx) && getTest(ndx).match.nativeDef === charCodes.charAt(charCodes.length - 1);
                }
                var inputValue = nptvl.slice(), charCodes = "", initialNdx = -1, result = undefined;
                if (resetMaskSet(), strict || !0 === opts.autoUnmask) initialNdx = seekNext(initialNdx); else {
                    var staticInput = getBufferTemplate().slice(0, seekNext(-1)).join(""), matches = inputValue.join("").match(new RegExp("^" + Inputmask.escapeRegex(staticInput), "g"));
                    matches && matches.length > 0 && (inputValue.splice(0, matches.length * staticInput.length),
                    initialNdx = seekNext(initialNdx));
                }
                if (-1 === initialNdx ? (getMaskSet().p = seekNext(initialNdx), initialNdx = 0) : getMaskSet().p = initialNdx,
                $.each(inputValue, function(ndx, charCode) {
                    if (charCode !== undefined) if (getMaskSet().validPositions[ndx] === undefined && inputValue[ndx] === getPlaceholder(ndx) && isMask(ndx, !0) && !1 === isValid(ndx, inputValue[ndx], !0, undefined, undefined, !0)) getMaskSet().p++; else {
                        var keypress = new $.Event("_checkval");
                        keypress.which = charCode.charCodeAt(0), charCodes += charCode;
                        var lvp = getLastValidPosition(undefined, !0), lvTest = getMaskSet().validPositions[lvp], nextTest = getTestTemplate(lvp + 1, lvTest ? lvTest.locator.slice() : undefined, lvp);
                        if (!isTemplateMatch(initialNdx, charCodes) || strict || opts.autoUnmask) {
                            var pos = strict ? ndx : null == nextTest.match.fn && nextTest.match.optionality && lvp + 1 < getMaskSet().p ? lvp + 1 : getMaskSet().p;
                            result = EventHandlers.keypressEvent.call(input, keypress, !0, !1, strict, pos),
                            initialNdx = pos + 1, charCodes = "";
                        } else result = EventHandlers.keypressEvent.call(input, keypress, !0, !1, !0, lvp + 1);
                        if (!1 !== result && !strict && $.isFunction(opts.onBeforeWrite)) {
                            var origResult = result;
                            if (result = opts.onBeforeWrite.call(inputmask, keypress, getBuffer(), result.forwardPosition, opts),
                            (result = $.extend(origResult, result)) && result.refreshFromBuffer) {
                                var refresh = result.refreshFromBuffer;
                                refreshFromBuffer(!0 === refresh ? refresh : refresh.start, refresh.end, result.buffer),
                                resetMaskSet(!0), result.caret && (getMaskSet().p = result.caret, result.forwardPosition = result.caret);
                            }
                        }
                    }
                }), writeOut) {
                    var caretPos = undefined;
                    document.activeElement === input && result && (caretPos = opts.numericInput ? seekPrevious(result.forwardPosition) : result.forwardPosition),
                    writeBuffer(input, getBuffer(), caretPos, initiatingEvent || new $.Event("checkval"), initiatingEvent && "input" === initiatingEvent.type);
                }
            }
            function unmaskedvalue(input) {
                if (input) {
                    if (input.inputmask === undefined) return input.value;
                    input.inputmask && input.inputmask.refreshValue && EventHandlers.setValueEvent.call(input);
                }
                var umValue = [], vps = getMaskSet().validPositions;
                for (var pndx in vps) vps[pndx].match && null != vps[pndx].match.fn && umValue.push(vps[pndx].input);
                var unmaskedValue = 0 === umValue.length ? "" : (isRTL ? umValue.reverse() : umValue).join("");
                if ($.isFunction(opts.onUnMask)) {
                    var bufferValue = (isRTL ? getBuffer().slice().reverse() : getBuffer()).join("");
                    unmaskedValue = opts.onUnMask.call(inputmask, bufferValue, unmaskedValue, opts);
                }
                return unmaskedValue;
            }
            function caret(input, begin, end, notranslate) {
                function translatePosition(pos) {
                    if (!0 !== notranslate && isRTL && "number" == typeof pos && (!opts.greedy || "" !== opts.placeholder)) {
                        pos = getBuffer().join("").length - pos;
                    }
                    return pos;
                }
                var range;
                if (begin === undefined) return input.setSelectionRange ? (begin = input.selectionStart,
                end = input.selectionEnd) : window.getSelection ? (range = window.getSelection().getRangeAt(0),
                range.commonAncestorContainer.parentNode !== input && range.commonAncestorContainer !== input || (begin = range.startOffset,
                end = range.endOffset)) : document.selection && document.selection.createRange && (range = document.selection.createRange(),
                begin = 0 - range.duplicate().moveStart("character", -input.inputmask._valueGet().length),
                end = begin + range.text.length), {
                    begin: translatePosition(begin),
                    end: translatePosition(end)
                };
                if (begin.begin !== undefined && (end = begin.end, begin = begin.begin), "number" == typeof begin) {
                    begin = translatePosition(begin), end = translatePosition(end), end = "number" == typeof end ? end : begin;
                    var scrollCalc = parseInt(((input.ownerDocument.defaultView || window).getComputedStyle ? (input.ownerDocument.defaultView || window).getComputedStyle(input, null) : input.currentStyle).fontSize) * end;
                    var mobile = /mobile/i.test(ua);
                    if (input.scrollLeft = scrollCalc > input.scrollWidth ? scrollCalc : 0, mobile || !1 !== opts.insertMode || begin !== end || end++,
                    input.setSelectionRange) input.selectionStart = begin, input.selectionEnd = end; else if (window.getSelection) {
                        if (range = document.createRange(), input.firstChild === undefined || null === input.firstChild) {
                            var textNode = document.createTextNode("");
                            input.appendChild(textNode);
                        }
                        range.setStart(input.firstChild, begin < input.inputmask._valueGet().length ? begin : input.inputmask._valueGet().length),
                        range.setEnd(input.firstChild, end < input.inputmask._valueGet().length ? end : input.inputmask._valueGet().length),
                        range.collapse(!0);
                        var sel = window.getSelection();
                        sel.removeAllRanges(), sel.addRange(range);
                    } else input.createTextRange && (range = input.createTextRange(), range.collapse(!0),
                    range.moveEnd("character", end), range.moveStart("character", begin), range.select());
                    renderColorMask(input, {
                        begin: begin,
                        end: end
                    });
                }
            }
            function determineLastRequiredPosition(returnDefinition) {
                var pos, testPos, buffer = getBuffer(), bl = buffer.length, lvp = getLastValidPosition(), positions = {}, lvTest = getMaskSet().validPositions[lvp], ndxIntlzr = lvTest !== undefined ? lvTest.locator.slice() : undefined;
                for (pos = lvp + 1; pos < buffer.length; pos++) testPos = getTestTemplate(pos, ndxIntlzr, pos - 1),
                ndxIntlzr = testPos.locator.slice(), positions[pos] = $.extend(!0, {}, testPos);
                lvTest.alternation !== undefined ? lvTest.locator[lvTest.alternation] : undefined;
                for (pos = bl - 1; pos > lvp && (testPos = positions[pos], (testPos.match.optionality || testPos.match.optionalQuantifier && testPos.match.newBlockMarker && (lvTest !== positions[pos].locator[lvTest.alternation] && null != testPos.match.fn || null === testPos.match.fn && testPos.locator[lvTest.alternation] && checkAlternationMatch(testPos.locator[lvTest.alternation].toString().split(","), lvTest.toString().split(",")) && "" !== getTests(pos)[0].def)) && buffer[pos] === getPlaceholder(pos, testPos.match)); pos--) bl--;
                return returnDefinition ? {
                    l: bl,
                    def: positions[bl] ? positions[bl].match : undefined
                } : bl;
            }
            function clearOptionalTail(buffer) {
                for (var validPos, rl = determineLastRequiredPosition(), bl = buffer.length, lv = getMaskSet().validPositions[getLastValidPosition()]; rl < bl && !isMask(rl, !0) && (validPos = lv !== undefined ? getTestTemplate(rl, lv.locator.slice(""), lv) : getTest(rl)) && !0 !== validPos.match.optionality && (!0 !== validPos.match.optionalQuantifier && !0 !== validPos.match.newBlockMarker || rl + 1 === bl && "" === (lv !== undefined ? getTestTemplate(rl + 1, lv.locator.slice(""), lv) : getTest(rl + 1)).match.def); ) rl++;
                for (;(validPos = getMaskSet().validPositions[rl - 1]) && validPos && validPos.match.optionality && validPos.input === opts.skipOptionalPartCharacter; ) rl--;
                return buffer.splice(rl), buffer;
            }
            function isComplete(buffer) {
                if ($.isFunction(opts.isComplete)) return opts.isComplete(buffer, opts);
                if ("*" === opts.repeat) return undefined;
                var complete = !1, lrp = determineLastRequiredPosition(!0), aml = seekPrevious(lrp.l);
                if (lrp.def === undefined || lrp.def.newBlockMarker || lrp.def.optionality || lrp.def.optionalQuantifier) {
                    complete = !0;
                    for (var i = 0; i <= aml; i++) {
                        var test = getTestTemplate(i).match;
                        if (null !== test.fn && getMaskSet().validPositions[i] === undefined && !0 !== test.optionality && !0 !== test.optionalQuantifier || null === test.fn && buffer[i] !== getPlaceholder(i, test)) {
                            complete = !1;
                            break;
                        }
                    }
                }
                return complete;
            }
            function handleRemove(input, k, pos, strict, fromIsValid) {
                if ((opts.numericInput || isRTL) && (k === Inputmask.keyCode.BACKSPACE ? k = Inputmask.keyCode.DELETE : k === Inputmask.keyCode.DELETE && (k = Inputmask.keyCode.BACKSPACE),
                isRTL)) {
                    var pend = pos.end;
                    pos.end = pos.begin, pos.begin = pend;
                }
                k === Inputmask.keyCode.BACKSPACE && (pos.end - pos.begin < 1 || !1 === opts.insertMode) ? (pos.begin = seekPrevious(pos.begin),
                getMaskSet().validPositions[pos.begin] !== undefined && getMaskSet().validPositions[pos.begin].input === opts.groupSeparator && pos.begin--) : k === Inputmask.keyCode.DELETE && pos.begin === pos.end && (pos.end = isMask(pos.end, !0) && getMaskSet().validPositions[pos.end] && getMaskSet().validPositions[pos.end].input !== opts.radixPoint ? pos.end + 1 : seekNext(pos.end) + 1,
                getMaskSet().validPositions[pos.begin] !== undefined && getMaskSet().validPositions[pos.begin].input === opts.groupSeparator && pos.end++),
                stripValidPositions(pos.begin, pos.end, !1, strict), !0 !== strict && function() {
                    if (opts.keepStatic) {
                        for (var validInputs = [], lastAlt = getLastValidPosition(-1, !0), positionsClone = $.extend(!0, {}, getMaskSet().validPositions), prevAltPos = getMaskSet().validPositions[lastAlt]; lastAlt >= 0; lastAlt--) {
                            var altPos = getMaskSet().validPositions[lastAlt];
                            if (altPos) {
                                if (!0 !== altPos.generatedInput && /[0-9a-bA-Z]/.test(altPos.input) && validInputs.push(altPos.input),
                                delete getMaskSet().validPositions[lastAlt], altPos.alternation !== undefined && altPos.locator[altPos.alternation] !== prevAltPos.locator[altPos.alternation]) break;
                                prevAltPos = altPos;
                            }
                        }
                        if (lastAlt > -1) for (getMaskSet().p = seekNext(getLastValidPosition(-1, !0)); validInputs.length > 0; ) {
                            var keypress = new $.Event("keypress");
                            keypress.which = validInputs.pop().charCodeAt(0), EventHandlers.keypressEvent.call(input, keypress, !0, !1, !1, getMaskSet().p);
                        } else getMaskSet().validPositions = $.extend(!0, {}, positionsClone);
                    }
                }();
                var lvp = getLastValidPosition(pos.begin, !0);
                if (lvp < pos.begin) getMaskSet().p = seekNext(lvp); else if (!0 !== strict && (getMaskSet().p = pos.begin,
                !0 !== fromIsValid)) for (;getMaskSet().p < lvp && getMaskSet().validPositions[getMaskSet().p] === undefined; ) getMaskSet().p++;
            }
            function initializeColorMask(input) {
                var computedStyle = (input.ownerDocument.defaultView || window).getComputedStyle(input, null), template = document.createElement("div");
                var colorMask;
                function findCaretPos(clientx) {
                    var caretPos, e = document.createElement("span");
                    for (var style in computedStyle) isNaN(style) && -1 !== style.indexOf("font") && (e.style[style] = computedStyle[style]);
                    e.style.textTransform = computedStyle.textTransform, e.style.letterSpacing = computedStyle.letterSpacing,
                    e.style.position = "absolute", e.style.height = "auto", e.style.width = "auto",
                    e.style.visibility = "hidden", e.style.whiteSpace = "nowrap", document.body.appendChild(e);
                    var itl, inputText = input.inputmask._valueGet(), previousWidth = 0;
                    for (caretPos = 0, itl = inputText.length; caretPos <= itl; caretPos++) {
                        if (e.innerHTML += inputText.charAt(caretPos) || "_", e.offsetWidth >= clientx) {
                            var offset1 = clientx - previousWidth, offset2 = e.offsetWidth - clientx;
                            e.innerHTML = inputText.charAt(caretPos), offset1 -= e.offsetWidth / 3, caretPos = offset1 < offset2 ? caretPos - 1 : caretPos;
                            break;
                        }
                        previousWidth = e.offsetWidth;
                    }
                    return document.body.removeChild(e), caretPos;
                }
                template.style.width = computedStyle.width, template.style.textAlign = computedStyle.textAlign,
                colorMask = document.createElement("div"), colorMask.className = "im-colormask",
                input.parentNode.insertBefore(colorMask, input), input.parentNode.removeChild(input),
                colorMask.appendChild(template), colorMask.appendChild(input), input.style.left = template.offsetLeft + "px",
                $(input).on("click", function(e) {
                    return caret(input, findCaretPos(e.clientX)), EventHandlers.clickEvent.call(input, [ e ]);
                }), $(input).on("keydown", function(e) {
                    e.shiftKey || !1 === opts.insertMode || setTimeout(function() {
                        renderColorMask(input);
                    }, 0);
                });
            }
            function renderColorMask(input, caretPos, clear) {
              var test, testPos, ndxIntlzr, maskTemplate = "", isStatic = !1, pos = 0;
                function handleStatic() {
                    isStatic || null !== test.fn && testPos.input !== undefined ? isStatic && (null !== test.fn && testPos.input !== undefined || "" === test.def) && (isStatic = !1,
                    maskTemplate += "</span>") : (isStatic = !0, maskTemplate += "<span class='im-static'>");
                }
                function handleCaret(force) {
                    !0 !== force && pos !== caretPos.begin || document.activeElement !== input || (maskTemplate += "<span class='im-caret' style='border-right-width: 1px;border-right-style: solid;'></span>");
                }
                if (colorMask !== undefined) {
                    var buffer = getBuffer();
                    if (caretPos === undefined ? caretPos = caret(input) : caretPos.begin === undefined && (caretPos = {
                        begin: caretPos,
                        end: caretPos
                    }), !0 !== clear) {
                        var lvp = getLastValidPosition();
                        do {
                            handleCaret(), getMaskSet().validPositions[pos] ? (testPos = getMaskSet().validPositions[pos],
                            test = testPos.match, ndxIntlzr = testPos.locator.slice(), handleStatic(), maskTemplate += buffer[pos]) : (testPos = getTestTemplate(pos, ndxIntlzr, pos - 1),
                            test = testPos.match, ndxIntlzr = testPos.locator.slice(), (!1 === opts.jitMasking || pos < lvp || "number" == typeof opts.jitMasking && isFinite(opts.jitMasking) && opts.jitMasking > pos) && (handleStatic(),
                            maskTemplate += getPlaceholder(pos, test))), pos++;
                        } while (pos < maxLength && (null !== test.fn || "" !== test.def) || lvp > pos || isStatic);
                        -1 === maskTemplate.indexOf("im-caret") && handleCaret(!0), isStatic && handleStatic();
                    }
                    var template = colorMask.getElementsByTagName("div")[0];
                    template.innerHTML = maskTemplate, input.inputmask.positionColorMask(input, template);
                }
            }
            maskset = maskset || this.maskset, opts = opts || this.opts;

            Inputmask.prototype.positionColorMask = function(input, template) {
                input.style.left = template.offsetLeft + "px";
            };
            var valueBuffer;
            if (actionObj !== undefined) switch (actionObj.action) {
              case "isComplete":
                return el = actionObj.el, isComplete(getBuffer());

              case "unmaskedvalue":
                return el !== undefined && actionObj.value === undefined || (valueBuffer = actionObj.value,
                valueBuffer = ($.isFunction(opts.onBeforeMask) ? opts.onBeforeMask.call(inputmask, valueBuffer, opts) || valueBuffer : valueBuffer).split(""),
                checkVal(undefined, !1, !1, isRTL ? valueBuffer.reverse() : valueBuffer), $.isFunction(opts.onBeforeWrite) && opts.onBeforeWrite.call(inputmask, undefined, getBuffer(), 0, opts)),
                unmaskedvalue(el);

              case "mask":
                !function(elem) {
                    EventRuler.off(elem);
                    var isSupported = function(input, opts) {
                        var elementType = input.getAttribute("type"), isSupported = "INPUT" === input.tagName && -1 !== $.inArray(elementType, opts.supportsInputType) || input.isContentEditable || "TEXTAREA" === input.tagName;
                        if (!isSupported) if ("INPUT" === input.tagName) {
                            var el = document.createElement("input");
                            el.setAttribute("type", elementType), isSupported = "text" === el.type, el = null;
                        } else isSupported = "partial";
                        return !1 !== isSupported ? function(npt) {
                          var valueGet, valueSet;
                            function getter() {
                                return this.inputmask ? this.inputmask.opts.autoUnmask ? this.inputmask.unmaskedvalue() : -1 !== getLastValidPosition() || !0 !== opts.nullable ? document.activeElement === this && opts.clearMaskOnLostFocus ? (isRTL ? clearOptionalTail(getBuffer().slice()).reverse() : clearOptionalTail(getBuffer().slice())).join("") : valueGet.call(this) : "" : valueGet.call(this);
                            }
                            function setter(value) {
                                valueSet.call(this, value), this.inputmask && $(this).trigger("setvalue");
                            }
                            if (!npt.inputmask.__valueGet) {
                                if (!0 !== opts.noValuePatching) {
                                    if (Object.getOwnPropertyDescriptor) {
                                        "function" != typeof Object.getPrototypeOf && (Object.getPrototypeOf = "object" === _typeof("test".__proto__) ? function(object) {
                                            return object.__proto__;
                                        } : function(object) {
                                            return object.constructor.prototype;
                                        });
                                        var valueProperty = Object.getPrototypeOf ? Object.getOwnPropertyDescriptor(Object.getPrototypeOf(npt), "value") : undefined;
                                        valueProperty && valueProperty.get && valueProperty.set ? (valueGet = valueProperty.get,
                                        valueSet = valueProperty.set, Object.defineProperty(npt, "value", {
                                            get: getter,
                                            set: setter,
                                            configurable: !0
                                        })) : "INPUT" !== npt.tagName && (valueGet = function() {
                                            return this.textContent;
                                        }, valueSet = function(value) {
                                            this.textContent = value;
                                        }, Object.defineProperty(npt, "value", {
                                            get: getter,
                                            set: setter,
                                            configurable: !0
                                        }));
                                    } else document.__lookupGetter__ && npt.__lookupGetter__("value") && (valueGet = npt.__lookupGetter__("value"),
                                    valueSet = npt.__lookupSetter__("value"), npt.__defineGetter__("value", getter),
                                    npt.__defineSetter__("value", setter));
                                    npt.inputmask.__valueGet = valueGet, npt.inputmask.__valueSet = valueSet;
                                }
                                npt.inputmask._valueGet = function(overruleRTL) {
                                    return isRTL && !0 !== overruleRTL ? valueGet.call(this.el).split("").reverse().join("") : valueGet.call(this.el);
                                }, npt.inputmask._valueSet = function(value, overruleRTL) {
                                    valueSet.call(this.el, null === value || value === undefined ? "" : !0 !== overruleRTL && isRTL ? value.split("").reverse().join("") : value);
                                }, valueGet === undefined && (valueGet = function() {
                                    return this.value;
                                }, valueSet = function(value) {
                                    this.value = value;
                                }, function(type) {
                                    if ($.valHooks && ($.valHooks[type] === undefined || !0 !== $.valHooks[type].inputmaskpatch)) {
                                        var valhookGet = $.valHooks[type] && $.valHooks[type].get ? $.valHooks[type].get : function(elem) {
                                            return elem.value;
                                        }, valhookSet = $.valHooks[type] && $.valHooks[type].set ? $.valHooks[type].set : function(elem, value) {
                                            return elem.value = value, elem;
                                        };
                                        $.valHooks[type] = {
                                            get: function(elem) {
                                                if (elem.inputmask) {
                                                    if (elem.inputmask.opts.autoUnmask) return elem.inputmask.unmaskedvalue();
                                                    var result = valhookGet(elem);
                                                    return -1 !== getLastValidPosition(undefined, undefined, elem.inputmask.maskset.validPositions) || !0 !== opts.nullable ? result : "";
                                                }
                                                return valhookGet(elem);
                                            },
                                            set: function(elem, value) {
                                                var result, $elem = $(elem);
                                                return result = valhookSet(elem, value), elem.inputmask && $elem.trigger("setvalue"),
                                                result;
                                            },
                                            inputmaskpatch: !0
                                        };
                                    }
                                }(npt.type), function(npt) {
                                    EventRuler.on(npt, "mouseenter", function(event) {
                                        var $input = $(this);
                                        this.inputmask._valueGet() !== getBuffer().join("") && $input.trigger("setvalue");
                                    });
                                }(npt));
                            }
                        }(input) : input.inputmask = undefined, isSupported;
                    }(elem, opts);
                    if (!1 !== isSupported && (el = elem, $el = $(el), maxLength = el !== undefined ? el.maxLength : undefined,
                    -1 === maxLength && (maxLength = undefined), !0 === opts.colorMask && initializeColorMask(el),
                    android && (el.hasOwnProperty("inputmode") && (el.inputmode = opts.inputmode, el.setAttribute("inputmode", opts.inputmode)),
                    "rtfm" === opts.androidHack && (!0 !== opts.colorMask && initializeColorMask(el),
                    el.type = "password")), !0 === isSupported && (EventRuler.on(el, "submit", EventHandlers.submitEvent),
                    EventRuler.on(el, "reset", EventHandlers.resetEvent), EventRuler.on(el, "mouseenter", EventHandlers.mouseenterEvent),
                    EventRuler.on(el, "blur", EventHandlers.blurEvent), EventRuler.on(el, "focus", EventHandlers.focusEvent),
                    EventRuler.on(el, "mouseleave", EventHandlers.mouseleaveEvent), !0 !== opts.colorMask && EventRuler.on(el, "click", EventHandlers.clickEvent),
                    EventRuler.on(el, "dblclick", EventHandlers.dblclickEvent), EventRuler.on(el, "paste", EventHandlers.pasteEvent),
                    EventRuler.on(el, "dragdrop", EventHandlers.pasteEvent), EventRuler.on(el, "drop", EventHandlers.pasteEvent),
                    EventRuler.on(el, "cut", EventHandlers.cutEvent), EventRuler.on(el, "complete", opts.oncomplete),
                    EventRuler.on(el, "incomplete", opts.onincomplete), EventRuler.on(el, "cleared", opts.oncleared),
                    android || !0 === opts.inputEventOnly ? el.removeAttribute("maxLength") : (EventRuler.on(el, "keydown", EventHandlers.keydownEvent),
                    EventRuler.on(el, "keypress", EventHandlers.keypressEvent)), EventRuler.on(el, "compositionstart", $.noop),
                    EventRuler.on(el, "compositionupdate", $.noop), EventRuler.on(el, "compositionend", $.noop),
                    EventRuler.on(el, "keyup", $.noop), EventRuler.on(el, "input", EventHandlers.inputFallBackEvent),
                    EventRuler.on(el, "beforeinput", $.noop)), EventRuler.on(el, "setvalue", EventHandlers.setValueEvent),
                    undoValue = getBufferTemplate().join(""), "" !== el.inputmask._valueGet(!0) || !1 === opts.clearMaskOnLostFocus || document.activeElement === el)) {
                        var initialValue = $.isFunction(opts.onBeforeMask) ? opts.onBeforeMask.call(inputmask, el.inputmask._valueGet(!0), opts) || el.inputmask._valueGet(!0) : el.inputmask._valueGet(!0);
                        "" !== initialValue && checkVal(el, !0, !1, isRTL ? initialValue.split("").reverse() : initialValue.split(""));
                        var buffer = getBuffer().slice();
                        undoValue = buffer.join(""), !1 === isComplete(buffer) && opts.clearIncomplete && resetMaskSet(),
                        opts.clearMaskOnLostFocus && document.activeElement !== el && (-1 === getLastValidPosition() ? buffer = [] : clearOptionalTail(buffer)),
                        writeBuffer(el, buffer), document.activeElement === el && caret(el, seekNext(getLastValidPosition()));
                    }
                }(el);
                break;

              case "format":
                return valueBuffer = ($.isFunction(opts.onBeforeMask) ? opts.onBeforeMask.call(inputmask, actionObj.value, opts) || actionObj.value : actionObj.value).split(""),
                checkVal(undefined, !0, !1, isRTL ? valueBuffer.reverse() : valueBuffer), actionObj.metadata ? {
                    value: isRTL ? getBuffer().slice().reverse().join("") : getBuffer().join(""),
                    metadata: maskScope.call(this, {
                        action: "getmetadata"
                    }, maskset, opts)
                } : isRTL ? getBuffer().slice().reverse().join("") : getBuffer().join("");

              case "isValid":
                actionObj.value ? (valueBuffer = actionObj.value.split(""), checkVal(undefined, !0, !0, isRTL ? valueBuffer.reverse() : valueBuffer)) : actionObj.value = getBuffer().join("");
                for (var buffer = getBuffer(), rl = determineLastRequiredPosition(), lmib = buffer.length - 1; lmib > rl && !isMask(lmib); lmib--) ;
                return buffer.splice(rl, lmib + 1 - rl), isComplete(buffer) && actionObj.value === getBuffer().join("");

              case "getemptymask":
                return getBufferTemplate().join("");

              case "remove":
                if (el && el.inputmask) {
                    $el = $(el), el.inputmask._valueSet(opts.autoUnmask ? unmaskedvalue(el) : el.inputmask._valueGet(!0)),
                    EventRuler.off(el);
                    Object.getOwnPropertyDescriptor && Object.getPrototypeOf ? Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value") && el.inputmask.__valueGet && Object.defineProperty(el, "value", {
                        get: el.inputmask.__valueGet,
                        set: el.inputmask.__valueSet,
                        configurable: !0
                    }) : document.__lookupGetter__ && el.__lookupGetter__("value") && el.inputmask.__valueGet && (el.__defineGetter__("value", el.inputmask.__valueGet),
                    el.__defineSetter__("value", el.inputmask.__valueSet)), el.inputmask = undefined;
                }
                return el;

              case "getmetadata":
                if ($.isArray(maskset.metadata)) {
                    var maskTarget = getMaskTemplate(!0, 0, !1).join("");
                    return $.each(maskset.metadata, function(ndx, mtdt) {
                        if (mtdt.mask === maskTarget) return maskTarget = mtdt, !1;
                    }), maskTarget;
                }
                return maskset.metadata;
            }
        }
        var ua = navigator.userAgent, mobile = /mobile/i.test(ua), iemobile = /iemobile/i.test(ua), iphone = /iphone/i.test(ua) && !iemobile, android = /android/i.test(ua) && !iemobile;
        return Inputmask.prototype = {
            dataAttribute: "data-inputmask",
            defaults: {
                placeholder: "_",
                optionalmarker: {
                    start: "[",
                    end: "]"
                },
                quantifiermarker: {
                    start: "{",
                    end: "}"
                },
                groupmarker: {
                    start: "(",
                    end: ")"
                },
                alternatormarker: "|",
                escapeChar: "\\",
                mask: null,
                regex: null,
                oncomplete: $.noop,
                onincomplete: $.noop,
                oncleared: $.noop,
                repeat: 0,
                greedy: !0,
                autoUnmask: !1,
                removeMaskOnSubmit: !1,
                clearMaskOnLostFocus: !0,
                insertMode: !0,
                clearIncomplete: !1,
                alias: null,
                onKeyDown: $.noop,
                onBeforeMask: null,
                onBeforePaste: function(pastedValue, opts) {
                    return $.isFunction(opts.onBeforeMask) ? opts.onBeforeMask.call(this, pastedValue, opts) : pastedValue;
                },
                onBeforeWrite: null,
                onUnMask: null,
                showMaskOnFocus: !0,
                showMaskOnHover: !0,
                onKeyValidation: $.noop,
                skipOptionalPartCharacter: " ",
                numericInput: !1,
                rightAlign: !1,
                undoOnEscape: !0,
                radixPoint: "",
                radixPointDefinitionSymbol: undefined,
                groupSeparator: "",
                keepStatic: null,
                positionCaretOnTab: !0,
                tabThrough: !1,
                supportsInputType: [ "text", "tel", "password" ],
                ignorables: [ 8, 9, 13, 19, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 0, 229 ],
                isComplete: null,
                canClearPosition: $.noop,
                preValidation: null,
                postValidation: null,
                staticDefinitionSymbol: undefined,
                jitMasking: !1,
                nullable: !0,
                inputEventOnly: !1,
                noValuePatching: !1,
                positionCaretOnClick: "lvp",
                casing: null,
                inputmode: "verbatim",
                colorMask: !1,
                androidHack: !1,
                importDataAttributes: !0
            },
            definitions: {
                "9": {
                    validator: "[0-9\uff11-\uff19]",
                    cardinality: 1,
                    definitionSymbol: "*"
                },
                a: {
                    validator: "[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
                    cardinality: 1,
                    definitionSymbol: "*"
                },
                "*": {
                    validator: "[0-9\uff11-\uff19A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
                    cardinality: 1
                }
            },
            aliases: {},
            masksCache: {},
            mask: function(elems) {
                function importAttributeOptions(npt, opts, userOptions, dataAttribute) {
                    if (!0 === opts.importDataAttributes) {
                        var option, dataoptions, optionData, p, importOption = function(option, optionData) {
                            null !== (optionData = optionData !== undefined ? optionData : npt.getAttribute(dataAttribute + "-" + option)) && ("string" == typeof optionData && (0 === option.indexOf("on") ? optionData = window[optionData] : "false" === optionData ? optionData = !1 : "true" === optionData && (optionData = !0)),
                            userOptions[option] = optionData);
                        }, attrOptions = npt.getAttribute(dataAttribute);
                        if (attrOptions && "" !== attrOptions && (attrOptions = attrOptions.replace(new RegExp("'", "g"), '"'),
                        dataoptions = JSON.parse("{" + attrOptions + "}")), dataoptions) {
                            optionData = undefined;
                            for (p in dataoptions) if ("alias" === p.toLowerCase()) {
                                optionData = dataoptions[p];
                                break;
                            }
                        }
                        importOption("alias", optionData), userOptions.alias && resolveAlias(userOptions.alias, userOptions, opts);
                        for (option in opts) {
                            if (dataoptions) {
                                optionData = undefined;
                                for (p in dataoptions) if (p.toLowerCase() === option.toLowerCase()) {
                                    optionData = dataoptions[p];
                                    break;
                                }
                            }
                            importOption(option, optionData);
                        }
                    }
                    return $.extend(!0, opts, userOptions), ("rtl" === npt.dir || opts.rightAlign) && (npt.style.textAlign = "right"),
                    ("rtl" === npt.dir || opts.numericInput) && (npt.dir = "ltr", npt.removeAttribute("dir"),
                    opts.isRTL = !0), opts;
                }
                var that = this;
                return "string" == typeof elems && (elems = document.getElementById(elems) || document.querySelectorAll(elems)),
                elems = elems.nodeName ? [ elems ] : elems, $.each(elems, function(ndx, el) {
                    var scopedOpts = $.extend(!0, {}, that.opts);
                    importAttributeOptions(el, scopedOpts, $.extend(!0, {}, that.userOptions), that.dataAttribute);
                    var maskset = generateMaskSet(scopedOpts, that.noMasksCache);
                    maskset !== undefined && (el.inputmask !== undefined && (el.inputmask.opts.autoUnmask = !0,
                    el.inputmask.remove()), el.inputmask = new Inputmask(undefined, undefined, !0),
                    el.inputmask.opts = scopedOpts, el.inputmask.noMasksCache = that.noMasksCache, el.inputmask.userOptions = $.extend(!0, {}, that.userOptions),
                    el.inputmask.isRTL = scopedOpts.isRTL || scopedOpts.numericInput, el.inputmask.el = el,
                    el.inputmask.maskset = maskset, $.data(el, "_inputmask_opts", scopedOpts), maskScope.call(el.inputmask, {
                        action: "mask"
                    }));
                }), elems && elems[0] ? elems[0].inputmask || this : this;
            },
            option: function(options, noremask) {
                return "string" == typeof options ? this.opts[options] : "object" === (void 0 === options ? "undefined" : _typeof(options)) ? ($.extend(this.userOptions, options),
                this.el && !0 !== noremask && this.mask(this.el), this) : void 0;
            },
            unmaskedvalue: function(value) {
                return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
                maskScope.call(this, {
                    action: "unmaskedvalue",
                    value: value
                });
            },
            remove: function() {
                return maskScope.call(this, {
                    action: "remove"
                });
            },
            getemptymask: function() {
                return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
                maskScope.call(this, {
                    action: "getemptymask"
                });
            },
            hasMaskedValue: function() {
                return !this.opts.autoUnmask;
            },
            isComplete: function() {
                return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
                maskScope.call(this, {
                    action: "isComplete"
                });
            },
            getmetadata: function() {
                return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
                maskScope.call(this, {
                    action: "getmetadata"
                });
            },
            isValid: function(value) {
                return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
                maskScope.call(this, {
                    action: "isValid",
                    value: value
                });
            },
            format: function(value, metadata) {
                return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache),
                maskScope.call(this, {
                    action: "format",
                    value: value,
                    metadata: metadata
                });
            },
            analyseMask: function(mask, regexMask, opts) {
                function MaskToken(isGroup, isOptional, isQuantifier, isAlternator) {
                    this.matches = [], this.openGroup = isGroup || !1, this.alternatorGroup = !1, this.isGroup = isGroup || !1,
                    this.isOptional = isOptional || !1, this.isQuantifier = isQuantifier || !1, this.isAlternator = isAlternator || !1,
                    this.quantifier = {
                        min: 1,
                        max: 1
                    };
                }
                function insertTestDefinition(mtoken, element, position) {
                    position = position !== undefined ? position : mtoken.matches.length;
                    var prevMatch = mtoken.matches[position - 1];
                    var escaped;
                    if (regexMask) 0 === element.indexOf("[") || escaped && /\\d|\\s|\\w]/i.test(element) || "." === element ? mtoken.matches.splice(position++, 0, {
                        fn: new RegExp(element, opts.casing ? "i" : ""),
                        cardinality: 1,
                        optionality: mtoken.isOptional,
                        newBlockMarker: prevMatch === undefined || prevMatch.def !== element,
                        casing: null,
                        def: element,
                        placeholder: undefined,
                        nativeDef: element
                    }) : (escaped && (element = element[element.length - 1]), $.each(element.split(""), function(ndx, lmnt) {
                        prevMatch = mtoken.matches[position - 1], mtoken.matches.splice(position++, 0, {
                            fn: null,
                            cardinality: 0,
                            optionality: mtoken.isOptional,
                            newBlockMarker: prevMatch === undefined || prevMatch.def !== lmnt && null !== prevMatch.fn,
                            casing: null,
                            def: opts.staticDefinitionSymbol || lmnt,
                            placeholder: opts.staticDefinitionSymbol !== undefined ? lmnt : undefined,
                            nativeDef: lmnt
                        });
                    })), escaped = !1; else {
                        var maskdef = (opts.definitions ? opts.definitions[element] : undefined) || Inputmask.prototype.definitions[element];
                        if (maskdef && !escaped) {
                            for (var prevalidators = maskdef.prevalidator, prevalidatorsL = prevalidators ? prevalidators.length : 0, i = 1; i < maskdef.cardinality; i++) {
                                var prevalidator = prevalidatorsL >= i ? prevalidators[i - 1] : [], validator = prevalidator.validator, cardinality = prevalidator.cardinality;
                                mtoken.matches.splice(position++, 0, {
                                    fn: validator ? "string" == typeof validator ? new RegExp(validator, opts.casing ? "i" : "") : new function() {
                                        this.test = validator;
                                    }() : new RegExp("."),
                                    cardinality: cardinality || 1,
                                    optionality: mtoken.isOptional,
                                    newBlockMarker: prevMatch === undefined || prevMatch.def !== (maskdef.definitionSymbol || element),
                                    casing: maskdef.casing,
                                    def: maskdef.definitionSymbol || element,
                                    placeholder: maskdef.placeholder,
                                    nativeDef: element
                                }), prevMatch = mtoken.matches[position - 1];
                            }
                            mtoken.matches.splice(position++, 0, {
                                fn: maskdef.validator ? "string" == typeof maskdef.validator ? new RegExp(maskdef.validator, opts.casing ? "i" : "") : new function() {
                                    this.test = maskdef.validator;
                                }() : new RegExp("."),
                                cardinality: maskdef.cardinality,
                                optionality: mtoken.isOptional,
                                newBlockMarker: prevMatch === undefined || prevMatch.def !== (maskdef.definitionSymbol || element),
                                casing: maskdef.casing,
                                def: maskdef.definitionSymbol || element,
                                placeholder: maskdef.placeholder,
                                nativeDef: element
                            });
                        } else mtoken.matches.splice(position++, 0, {
                            fn: null,
                            cardinality: 0,
                            optionality: mtoken.isOptional,
                            newBlockMarker: prevMatch === undefined || prevMatch.def !== element && null !== prevMatch.fn,
                            casing: null,
                            def: opts.staticDefinitionSymbol || element,
                            placeholder: opts.staticDefinitionSymbol !== undefined ? element : undefined,
                            nativeDef: element
                        }), escaped = !1;
                    }
                }
                function verifyGroupMarker(maskToken) {
                    maskToken && maskToken.matches && $.each(maskToken.matches, function(ndx, token) {
                        var nextToken = maskToken.matches[ndx + 1];
                        (nextToken === undefined || nextToken.matches === undefined || !1 === nextToken.isQuantifier) && token && token.isGroup && (token.isGroup = !1,
                        regexMask || (insertTestDefinition(token, opts.groupmarker.start, 0), !0 !== token.openGroup && insertTestDefinition(token, opts.groupmarker.end))),
                        verifyGroupMarker(token);
                    });
                }
                var match, m, openingToken, currentOpeningToken, alternator, lastMatch, groupToken, tokenizer = /(?:[?*+]|\{[0-9\+\*]+(?:,[0-9\+\*]*)?\})|[^.?*+^${[]()|\\]+|./g, regexTokenizer = /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g, escaped = !1, currentToken = new MaskToken(), openenings = [], maskTokens = [];
                for (regexMask && (opts.optionalmarker.start = undefined, opts.optionalmarker.end = undefined); match = regexMask ? regexTokenizer.exec(mask) : tokenizer.exec(mask); ) {
                    if (m = match[0], regexMask) switch (m.charAt(0)) {
                      case "?":
                        m = "{0,1}";
                        break;

                      case "+":
                      case "*":
                        m = "{" + m + "}";
                    }
                    if (escaped) defaultCase(); else switch (m.charAt(0)) {
                      case opts.escapeChar:
                        escaped = !0, regexMask && defaultCase();
                        break;

                      case opts.optionalmarker.end:
                      case opts.groupmarker.end:
                        if (openingToken = openenings.pop(), openingToken.openGroup = !1, openingToken !== undefined) if (openenings.length > 0) {
                            if (currentOpeningToken = openenings[openenings.length - 1], currentOpeningToken.matches.push(openingToken),
                            currentOpeningToken.isAlternator) {
                                alternator = openenings.pop();
                                for (var mndx = 0; mndx < alternator.matches.length; mndx++) alternator.matches[mndx].isGroup = !1,
                                alternator.matches[mndx].alternatorGroup = !1;
                                openenings.length > 0 ? (currentOpeningToken = openenings[openenings.length - 1],
                                currentOpeningToken.matches.push(alternator)) : currentToken.matches.push(alternator);
                            }
                        } else currentToken.matches.push(openingToken); else defaultCase();
                        break;

                      case opts.optionalmarker.start:
                        openenings.push(new MaskToken(!1, !0));
                        break;

                      case opts.groupmarker.start:
                        openenings.push(new MaskToken(!0));
                        break;

                      case opts.quantifiermarker.start:
                        var quantifier = new MaskToken(!1, !1, !0);
                        m = m.replace(/[{}]/g, "");
                        var mq = m.split(","), mq0 = isNaN(mq[0]) ? mq[0] : parseInt(mq[0]), mq1 = 1 === mq.length ? mq0 : isNaN(mq[1]) ? mq[1] : parseInt(mq[1]);
                        if ("*" !== mq1 && "+" !== mq1 || (mq0 = "*" === mq1 ? 0 : 1), quantifier.quantifier = {
                            min: mq0,
                            max: mq1
                        }, openenings.length > 0) {
                            var matches = openenings[openenings.length - 1].matches;
                            match = matches.pop(), match.isGroup || (groupToken = new MaskToken(!0), groupToken.matches.push(match),
                            match = groupToken), matches.push(match), matches.push(quantifier);
                        } else match = currentToken.matches.pop(), match.isGroup || (regexMask && null === match.fn && "." === match.def && (match.fn = new RegExp(match.def, opts.casing ? "i" : "")),
                        groupToken = new MaskToken(!0), groupToken.matches.push(match), match = groupToken),
                        currentToken.matches.push(match), currentToken.matches.push(quantifier);
                        break;

                      case opts.alternatormarker:
                        if (openenings.length > 0) {
                            currentOpeningToken = openenings[openenings.length - 1];
                            var subToken = currentOpeningToken.matches[currentOpeningToken.matches.length - 1];
                            lastMatch = currentOpeningToken.openGroup && (subToken.matches === undefined || !1 === subToken.isGroup && !1 === subToken.isAlternator) ? openenings.pop() : currentOpeningToken.matches.pop();
                        } else lastMatch = currentToken.matches.pop();
                        if (lastMatch.isAlternator) openenings.push(lastMatch); else if (lastMatch.alternatorGroup ? (alternator = openenings.pop(),
                        lastMatch.alternatorGroup = !1) : alternator = new MaskToken(!1, !1, !1, !0), alternator.matches.push(lastMatch),
                        openenings.push(alternator), lastMatch.openGroup) {
                            lastMatch.openGroup = !1;
                            var alternatorGroup = new MaskToken(!0);
                            alternatorGroup.alternatorGroup = !0, openenings.push(alternatorGroup);
                        }
                        break;

                      default:
                        defaultCase();
                    }
                }
                function defaultCase() {
                  if (openenings.length > 0) {
                      if (currentOpeningToken = openenings[openenings.length - 1], insertTestDefinition(currentOpeningToken, m),
                      currentOpeningToken.isAlternator) {
                          alternator = openenings.pop();
                          for (var mndx = 0; mndx < alternator.matches.length; mndx++) alternator.matches[mndx].isGroup = !1;
                          openenings.length > 0 ? (currentOpeningToken = openenings[openenings.length - 1],
                          currentOpeningToken.matches.push(alternator)) : currentToken.matches.push(alternator);
                      }
                  } else insertTestDefinition(currentToken, m);
              }
              function reverseTokens(maskToken) {
                  maskToken.matches = maskToken.matches.reverse();
                  for (var match in maskToken.matches) if (maskToken.matches.hasOwnProperty(match)) {
                      var intMatch = parseInt(match);
                      if (maskToken.matches[match].isQuantifier && maskToken.matches[intMatch + 1] && maskToken.matches[intMatch + 1].isGroup) {
                          var qt = maskToken.matches[match];
                          maskToken.matches.splice(match, 1), maskToken.matches.splice(intMatch + 1, 0, qt);
                      }
                      maskToken.matches[match].matches !== undefined ? maskToken.matches[match] = reverseTokens(maskToken.matches[match]) : maskToken.matches[match] = function(st) {
                          return st === opts.optionalmarker.start ? st = opts.optionalmarker.end : st === opts.optionalmarker.end ? st = opts.optionalmarker.start : st === opts.groupmarker.start ? st = opts.groupmarker.end : st === opts.groupmarker.end && (st = opts.groupmarker.start),
                          st;
                      }(maskToken.matches[match]);
                  }
                  return maskToken;
              }

                for (;openenings.length > 0; ) openingToken = openenings.pop(), currentToken.matches.push(openingToken);
                return currentToken.matches.length > 0 && (verifyGroupMarker(currentToken), maskTokens.push(currentToken)),
                (opts.numericInput || opts.isRTL) && reverseTokens(maskTokens[0]), maskTokens;
            }
        }, Inputmask.extendDefaults = function(options) {
            $.extend(!0, Inputmask.prototype.defaults, options);
        }, Inputmask.extendDefinitions = function(definition) {
            $.extend(!0, Inputmask.prototype.definitions, definition);
        }, Inputmask.extendAliases = function(alias) {
            $.extend(!0, Inputmask.prototype.aliases, alias);
        }, Inputmask.format = function(value, options, metadata) {
            return Inputmask(options).format(value, metadata);
        }, Inputmask.unmask = function(value, options) {
            return Inputmask(options).unmaskedvalue(value);
        }, Inputmask.isValid = function(value, options) {
            return Inputmask(options).isValid(value);
        }, Inputmask.remove = function(elems) {
            $.each(elems, function(ndx, el) {
                el.inputmask && el.inputmask.remove();
            });
        }, Inputmask.escapeRegex = function(str) {
            var specials = [ "/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\", "$", "^" ];
            return str.replace(new RegExp("(\\" + specials.join("|\\") + ")", "gim"), "\\$1");
        }, Inputmask.keyCode = {
            ALT: 18,
            BACKSPACE: 8,
            BACKSPACE_SAFARI: 127,
            CAPS_LOCK: 20,
            COMMA: 188,
            COMMAND: 91,
            COMMAND_LEFT: 91,
            COMMAND_RIGHT: 93,
            CONTROL: 17,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            INSERT: 45,
            LEFT: 37,
            MENU: 93,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SHIFT: 16,
            SPACE: 32,
            TAB: 9,
            UP: 38,
            WINDOWS: 91,
            X: 88
        }, Inputmask;
    });
}, function(module, exports) {
    module.exports = jQuery;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
    "function" == typeof Symbol && Symbol.iterator;
    !function(factory) {
        __WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(0), __webpack_require__(1) ],
        __WEBPACK_AMD_DEFINE_FACTORY__ = factory, void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
    }(function($, Inputmask) {
        function isLeapYear(year) {
            return isNaN(year) || 29 === new Date(year, 2, 0).getDate();
        }
        return Inputmask.extendAliases({
            "dd/mm/yyyy": {
                mask: "1/2/y",
                placeholder: "dd/mm/yyyy",
                regex: {
                    val1pre: new RegExp("[0-3]"),
                    val1: new RegExp("0[1-9]|[12][0-9]|3[01]"),
                    val2pre: function(separator) {
                        var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
                        return new RegExp("((0[1-9]|[12][0-9]|3[01])" + escapedSeparator + "[01])");
                    },
                    val2: function(separator) {
                        var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
                        return new RegExp("((0[1-9]|[12][0-9])" + escapedSeparator + "(0[1-9]|1[012]))|(30" + escapedSeparator + "(0[13-9]|1[012]))|(31" + escapedSeparator + "(0[13578]|1[02]))");
                    }
                },
                leapday: "29/02/",
                separator: "/",
                yearrange: {
                    minyear: 1900,
                    maxyear: 2099
                },
                isInYearRange: function(chrs, minyear, maxyear) {
                    if (isNaN(chrs)) return !1;
                    var enteredyear = parseInt(chrs.concat(minyear.toString().slice(chrs.length))), enteredyear2 = parseInt(chrs.concat(maxyear.toString().slice(chrs.length)));
                    return !isNaN(enteredyear) && (minyear <= enteredyear && enteredyear <= maxyear) || !isNaN(enteredyear2) && (minyear <= enteredyear2 && enteredyear2 <= maxyear);
                },
                determinebaseyear: function(minyear, maxyear, hint) {
                    var currentyear = new Date().getFullYear();
                    if (minyear > currentyear) return minyear;
                    if (maxyear < currentyear) {
                        for (var maxYearPrefix = maxyear.toString().slice(0, 2), maxYearPostfix = maxyear.toString().slice(2, 4); maxyear < maxYearPrefix + hint; ) maxYearPrefix--;
                        var maxxYear = maxYearPrefix + maxYearPostfix;
                        return minyear > maxxYear ? minyear : maxxYear;
                    }
                    if (minyear <= currentyear && currentyear <= maxyear) {
                        for (var currentYearPrefix = currentyear.toString().slice(0, 2); maxyear < currentYearPrefix + hint; ) currentYearPrefix--;
                        var currentYearAndHint = currentYearPrefix + hint;
                        return currentYearAndHint < minyear ? minyear : currentYearAndHint;
                    }
                    return currentyear;
                },
                onKeyDown: function(e, buffer, caretPos, opts) {
                    var $input = $(this);
                    if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
                        var today = new Date();
                        $input.val(today.getDate().toString() + (today.getMonth() + 1).toString() + today.getFullYear().toString()),
                        $input.trigger("setvalue");
                    }
                },
                getFrontValue: function(mask, buffer, opts) {
                    for (var start = 0, length = 0, i = 0; i < mask.length && "2" !== mask.charAt(i); i++) {
                        var definition = opts.definitions[mask.charAt(i)];
                        definition ? (start += length, length = definition.cardinality) : length++;
                    }
                    return buffer.join("").substr(start, length);
                },
                postValidation: function(buffer, currentResult, opts) {
                    var dayMonthValue, year, bufferStr = buffer.join("");
                    return 0 === opts.mask.indexOf("y") ? (year = bufferStr.substr(0, 4), dayMonthValue = bufferStr.substring(4, 10)) : (year = bufferStr.substring(6, 10),
                    dayMonthValue = bufferStr.substr(0, 6)), currentResult && (dayMonthValue !== opts.leapday || isLeapYear(year));
                },
                definitions: {
                    "1": {
                        validator: function(chrs, maskset, pos, strict, opts) {
                            if ("3" == chrs.charAt(0)) {
                                if (new RegExp("[2-9]").test(chrs.charAt(1))) return chrs = "30", maskset.buffer[pos] = "0",
                                pos++, {
                                    pos: pos
                                };
                            }
                            var isValid = opts.regex.val1.test(chrs);
                            return strict || isValid || chrs.charAt(1) !== opts.separator && -1 === "-./".indexOf(chrs.charAt(1)) || !(isValid = opts.regex.val1.test("0" + chrs.charAt(0))) ? isValid : (maskset.buffer[pos - 1] = "0",
                            {
                                refreshFromBuffer: {
                                    start: pos - 1,
                                    end: pos
                                },
                                pos: pos,
                                c: chrs.charAt(0)
                            });
                        },
                        cardinality: 2,
                        prevalidator: [ {
                            validator: function(chrs, maskset, pos, strict, opts) {
                                var pchrs = chrs;
                                isNaN(maskset.buffer[pos + 1]) || (pchrs += maskset.buffer[pos + 1]);
                                var isValid = 1 === pchrs.length ? opts.regex.val1pre.test(pchrs) : opts.regex.val1.test(pchrs);
                                if (!strict && !isValid) {
                                    if (isValid = opts.regex.val1.test(chrs + "0")) return maskset.buffer[pos] = chrs,
                                    maskset.buffer[++pos] = "0", {
                                        pos: pos,
                                        c: "0"
                                    };
                                    if (isValid = opts.regex.val1.test("0" + chrs)) return maskset.buffer[pos] = "0",
                                    pos++, {
                                        pos: pos
                                    };
                                }
                                return isValid;
                            },
                            cardinality: 1
                        } ]
                    },
                    "2": {
                        validator: function(chrs, maskset, pos, strict, opts) {
                            var frontValue = opts.getFrontValue(maskset.mask, maskset.buffer, opts);
                            if (-1 !== frontValue.indexOf(opts.placeholder[0]) && (frontValue = "01" + opts.separator),
                            "1" == chrs.charAt(0)) {
                                if (new RegExp("[3-9]").test(chrs.charAt(1))) return chrs = "10", maskset.buffer[pos] = "0",
                                pos++, {
                                    pos: pos
                                };
                            }
                            var isValid = opts.regex.val2(opts.separator).test(frontValue + chrs);
                            return strict || isValid || chrs.charAt(1) !== opts.separator && -1 === "-./".indexOf(chrs.charAt(1)) || !(isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs.charAt(0))) ? isValid : (maskset.buffer[pos - 1] = "0",
                            {
                                refreshFromBuffer: {
                                    start: pos - 1,
                                    end: pos
                                },
                                pos: pos,
                                c: chrs.charAt(0)
                            });
                        },
                        cardinality: 2,
                        prevalidator: [ {
                            validator: function(chrs, maskset, pos, strict, opts) {
                                isNaN(maskset.buffer[pos + 1]) || (chrs += maskset.buffer[pos + 1]);
                                var frontValue = opts.getFrontValue(maskset.mask, maskset.buffer, opts);
                                -1 !== frontValue.indexOf(opts.placeholder[0]) && (frontValue = "01" + opts.separator);
                                var isValid = 1 === chrs.length ? opts.regex.val2pre(opts.separator).test(frontValue + chrs) : opts.regex.val2(opts.separator).test(frontValue + chrs);
                                return strict || isValid || !(isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs)) ? isValid : (maskset.buffer[pos] = "0",
                                pos++, {
                                    pos: pos
                                });
                            },
                            cardinality: 1
                        } ]
                    },
                    y: {
                        validator: function(chrs, maskset, pos, strict, opts) {
                            return opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                        },
                        cardinality: 4,
                        prevalidator: [ {
                            validator: function(chrs, maskset, pos, strict, opts) {
                                var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                                if (!strict && !isValid) {
                                    var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 1);
                                    if (isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(0),
                                    {
                                        pos: pos
                                    };
                                    if (yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 2),
                                    isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(0),
                                    maskset.buffer[pos++] = yearPrefix.charAt(1), {
                                        pos: pos
                                    };
                                }
                                return isValid;
                            },
                            cardinality: 1
                        }, {
                            validator: function(chrs, maskset, pos, strict, opts) {
                                var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                                if (!strict && !isValid) {
                                    var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2);
                                    if (isValid = opts.isInYearRange(chrs[0] + yearPrefix[1] + chrs[1], opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(1),
                                    {
                                        pos: pos
                                    };
                                    if (yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2),
                                    isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos - 1] = yearPrefix.charAt(0),
                                    maskset.buffer[pos++] = yearPrefix.charAt(1), maskset.buffer[pos++] = chrs.charAt(0),
                                    {
                                        refreshFromBuffer: {
                                            start: pos - 3,
                                            end: pos
                                        },
                                        pos: pos
                                    };
                                }
                                return isValid;
                            },
                            cardinality: 2
                        }, {
                            validator: function(chrs, maskset, pos, strict, opts) {
                                return opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
                            },
                            cardinality: 3
                        } ]
                    }
                },
                insertMode: !1,
                autoUnmask: !1
            },
            "mm/dd/yyyy": {
                placeholder: "mm/dd/yyyy",
                alias: "dd/mm/yyyy",
                regex: {
                    val2pre: function(separator) {
                        var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
                        return new RegExp("((0[13-9]|1[012])" + escapedSeparator + "[0-3])|(02" + escapedSeparator + "[0-2])");
                    },
                    val2: function(separator) {
                        var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
                        return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[13-9]|1[012])" + escapedSeparator + "30)|((0[13578]|1[02])" + escapedSeparator + "31)");
                    },
                    val1pre: new RegExp("[01]"),
                    val1: new RegExp("0[1-9]|1[012]")
                },
                leapday: "02/29/",
                onKeyDown: function(e, buffer, caretPos, opts) {
                    var $input = $(this);
                    if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
                        var today = new Date();
                        $input.val((today.getMonth() + 1).toString() + today.getDate().toString() + today.getFullYear().toString()),
                        $input.trigger("setvalue");
                    }
                }
            },
            "yyyy/mm/dd": {
                mask: "y/1/2",
                placeholder: "yyyy/mm/dd",
                alias: "mm/dd/yyyy",
                leapday: "/02/29",
                onKeyDown: function(e, buffer, caretPos, opts) {
                    var $input = $(this);
                    if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
                        var today = new Date();
                        $input.val(today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString()),
                        $input.trigger("setvalue");
                    }
                }
            },
            "dd.mm.yyyy": {
                mask: "1.2.y",
                placeholder: "dd.mm.yyyy",
                leapday: "29.02.",
                separator: ".",
                alias: "dd/mm/yyyy"
            },
            "dd-mm-yyyy": {
                mask: "1-2-y",
                placeholder: "dd-mm-yyyy",
                leapday: "29-02-",
                separator: "-",
                alias: "dd/mm/yyyy"
            },
            "mm.dd.yyyy": {
                mask: "1.2.y",
                placeholder: "mm.dd.yyyy",
                leapday: "02.29.",
                separator: ".",
                alias: "mm/dd/yyyy"
            },
            "mm-dd-yyyy": {
                mask: "1-2-y",
                placeholder: "mm-dd-yyyy",
                leapday: "02-29-",
                separator: "-",
                alias: "mm/dd/yyyy"
            },
            "yyyy.mm.dd": {
                mask: "y.1.2",
                placeholder: "yyyy.mm.dd",
                leapday: ".02.29",
                separator: ".",
                alias: "yyyy/mm/dd"
            },
            "yyyy-mm-dd": {
                mask: "y-1-2",
                placeholder: "yyyy-mm-dd",
                leapday: "-02-29",
                separator: "-",
                alias: "yyyy/mm/dd"
            },
            datetime: {
                mask: "1/2/y h:s",
                placeholder: "dd/mm/yyyy hh:mm",
                alias: "dd/mm/yyyy",
                regex: {
                    hrspre: new RegExp("[012]"),
                    hrs24: new RegExp("2[0-4]|1[3-9]"),
                    hrs: new RegExp("[01][0-9]|2[0-4]"),
                    ampm: new RegExp("^[a|p|A|P][m|M]"),
                    mspre: new RegExp("[0-5]"),
                    ms: new RegExp("[0-5][0-9]")
                },
                timeseparator: ":",
                hourFormat: "24",
                definitions: {
                    h: {
                        validator: function(chrs, maskset, pos, strict, opts) {
                            if ("24" === opts.hourFormat && 24 === parseInt(chrs, 10)) return maskset.buffer[pos - 1] = "0",
                            maskset.buffer[pos] = "0", {
                                refreshFromBuffer: {
                                    start: pos - 1,
                                    end: pos
                                },
                                c: "0"
                            };
                            var isValid = opts.regex.hrs.test(chrs);
                            if (!strict && !isValid && (chrs.charAt(1) === opts.timeseparator || -1 !== "-.:".indexOf(chrs.charAt(1))) && (isValid = opts.regex.hrs.test("0" + chrs.charAt(0)))) return maskset.buffer[pos - 1] = "0",
                            maskset.buffer[pos] = chrs.charAt(0), pos++, {
                                refreshFromBuffer: {
                                    start: pos - 2,
                                    end: pos
                                },
                                pos: pos,
                                c: opts.timeseparator
                            };
                            if (isValid && "24" !== opts.hourFormat && opts.regex.hrs24.test(chrs)) {
                                var tmp = parseInt(chrs, 10);
                                return 24 === tmp ? (maskset.buffer[pos + 5] = "a", maskset.buffer[pos + 6] = "m") : (maskset.buffer[pos + 5] = "p",
                                maskset.buffer[pos + 6] = "m"), tmp -= 12, tmp < 10 ? (maskset.buffer[pos] = tmp.toString(),
                                maskset.buffer[pos - 1] = "0") : (maskset.buffer[pos] = tmp.toString().charAt(1),
                                maskset.buffer[pos - 1] = tmp.toString().charAt(0)), {
                                    refreshFromBuffer: {
                                        start: pos - 1,
                                        end: pos + 6
                                    },
                                    c: maskset.buffer[pos]
                                };
                            }
                            return isValid;
                        },
                        cardinality: 2,
                        prevalidator: [ {
                            validator: function(chrs, maskset, pos, strict, opts) {
                                var isValid = opts.regex.hrspre.test(chrs);
                                return strict || isValid || !(isValid = opts.regex.hrs.test("0" + chrs)) ? isValid : (maskset.buffer[pos] = "0",
                                pos++, {
                                    pos: pos
                                });
                            },
                            cardinality: 1
                        } ]
                    },
                    s: {
                        validator: "[0-5][0-9]",
                        cardinality: 2,
                        prevalidator: [ {
                            validator: function(chrs, maskset, pos, strict, opts) {
                                var isValid = opts.regex.mspre.test(chrs);
                                return strict || isValid || !(isValid = opts.regex.ms.test("0" + chrs)) ? isValid : (maskset.buffer[pos] = "0",
                                pos++, {
                                    pos: pos
                                });
                            },
                            cardinality: 1
                        } ]
                    },
                    t: {
                        validator: function(chrs, maskset, pos, strict, opts) {
                            return opts.regex.ampm.test(chrs + "m");
                        },
                        casing: "lower",
                        cardinality: 1
                    }
                },
                insertMode: !1,
                autoUnmask: !1
            },
            datetime12: {
                mask: "1/2/y h:s t\\m",
                placeholder: "dd/mm/yyyy hh:mm xm",
                alias: "datetime",
                hourFormat: "12"
            },
            "mm/dd/yyyy hh:mm xm": {
                mask: "1/2/y h:s t\\m",
                placeholder: "mm/dd/yyyy hh:mm xm",
                alias: "datetime12",
                regex: {
                    val2pre: function(separator) {
                        var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
                        return new RegExp("((0[13-9]|1[012])" + escapedSeparator + "[0-3])|(02" + escapedSeparator + "[0-2])");
                    },
                    val2: function(separator) {
                        var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
                        return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[13-9]|1[012])" + escapedSeparator + "30)|((0[13578]|1[02])" + escapedSeparator + "31)");
                    },
                    val1pre: new RegExp("[01]"),
                    val1: new RegExp("0[1-9]|1[012]")
                },
                leapday: "02/29/",
                onKeyDown: function(e, buffer, caretPos, opts) {
                    var $input = $(this);
                    if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
                        var today = new Date();
                        $input.val((today.getMonth() + 1).toString() + today.getDate().toString() + today.getFullYear().toString()),
                        $input.trigger("setvalue");
                    }
                }
            },
            "hh:mm t": {
                mask: "h:s t\\m",
                placeholder: "hh:mm xm",
                alias: "datetime",
                hourFormat: "12"
            },
            "h:s t": {
                mask: "h:s t\\m",
                placeholder: "hh:mm xm",
                alias: "datetime",
                hourFormat: "12"
            },
            "hh:mm:ss": {
                mask: "h:s:s",
                placeholder: "hh:mm:ss",
                alias: "datetime",
                autoUnmask: !1
            },
            "hh:mm": {
                mask: "h:s",
                placeholder: "hh:mm",
                alias: "datetime",
                autoUnmask: !1
            },
            date: {
                alias: "dd/mm/yyyy"
            },
            "mm/yyyy": {
                mask: "1/y",
                placeholder: "mm/yyyy",
                leapday: "donotuse",
                separator: "/",
                alias: "mm/dd/yyyy"
            },
            shamsi: {
                regex: {
                    val2pre: function(separator) {
                        var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
                        return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "[0-3])");
                    },
                    val2: function(separator) {
                        var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
                        return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[1-9]|1[012])" + escapedSeparator + "30)|((0[1-6])" + escapedSeparator + "31)");
                    },
                    val1pre: new RegExp("[01]"),
                    val1: new RegExp("0[1-9]|1[012]")
                },
                yearrange: {
                    minyear: 1300,
                    maxyear: 1499
                },
                mask: "y/1/2",
                leapday: "/12/30",
                placeholder: "yyyy/mm/dd",
                alias: "mm/dd/yyyy",
                clearIncomplete: !0
            },
            "yyyy-mm-dd hh:mm:ss": {
                mask: "y-1-2 h:s:s",
                placeholder: "yyyy-mm-dd hh:mm:ss",
                alias: "datetime",
                separator: "-",
                leapday: "-02-29",
                regex: {
                    val2pre: function(separator) {
                        var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
                        return new RegExp("((0[13-9]|1[012])" + escapedSeparator + "[0-3])|(02" + escapedSeparator + "[0-2])");
                    },
                    val2: function(separator) {
                        var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
                        return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[13-9]|1[012])" + escapedSeparator + "30)|((0[13578]|1[02])" + escapedSeparator + "31)");
                    },
                    val1pre: new RegExp("[01]"),
                    val1: new RegExp("0[1-9]|1[012]")
                },
                onKeyDown: function(e, buffer, caretPos, opts) {}
            }
        }), Inputmask;
    });
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
    "function" == typeof Symbol && Symbol.iterator;
    !function(factory) {
        __WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(0), __webpack_require__(1) ],
        __WEBPACK_AMD_DEFINE_FACTORY__ = factory, void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
    }(function($, Inputmask) {
        return Inputmask.extendDefinitions({
            A: {
                validator: "[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
                cardinality: 1,
                casing: "upper"
            },
            "&": {
                validator: "[0-9A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
                cardinality: 1,
                casing: "upper"
            },
            "#": {
                validator: "[0-9A-Fa-f]",
                cardinality: 1,
                casing: "upper"
            }
        }), Inputmask.extendAliases({
            url: {
                definitions: {
                    i: {
                        validator: ".",
                        cardinality: 1
                    }
                },
                mask: "(\\http://)|(\\http\\s://)|(ftp://)|(ftp\\s://)i{+}",
                insertMode: !1,
                autoUnmask: !1,
                inputmode: "url"
            },
            ip: {
                mask: "i[i[i]].i[i[i]].i[i[i]].i[i[i]]",
                definitions: {
                    i: {
                        validator: function(chrs, maskset, pos, strict, opts) {
                            return pos - 1 > -1 && "." !== maskset.buffer[pos - 1] ? (chrs = maskset.buffer[pos - 1] + chrs,
                            chrs = pos - 2 > -1 && "." !== maskset.buffer[pos - 2] ? maskset.buffer[pos - 2] + chrs : "0" + chrs) : chrs = "00" + chrs,
                            new RegExp("25[0-5]|2[0-4][0-9]|[01][0-9][0-9]").test(chrs);
                        },
                        cardinality: 1
                    }
                },
                onUnMask: function(maskedValue, unmaskedValue, opts) {
                    return maskedValue;
                },
                inputmode: "numeric"
            },
            email: {
                mask: "*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]@-{1,63}.-{1,63}[.-{1,63}][.-{1,63}]",
                greedy: !1,
                onBeforePaste: function(pastedValue, opts) {
                    return pastedValue = pastedValue.toLowerCase(), pastedValue.replace("mailto:", "");
                },
                definitions: {
                    "*": {
                        validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
                        cardinality: 1,
                        casing: "lower"
                    },
                    "-": {
                        validator: "[0-9A-Za-z-]",
                        cardinality: 1,
                        casing: "lower"
                    }
                },
                onUnMask: function(maskedValue, unmaskedValue, opts) {
                    return maskedValue;
                },
                inputmode: "email"
            },
            mac: {
                mask: "##:##:##:##:##:##"
            },
            vin: {
                mask: "V{13}9{4}",
                definitions: {
                    V: {
                        validator: "[A-HJ-NPR-Za-hj-npr-z\\d]",
                        cardinality: 1,
                        casing: "upper"
                    }
                },
                clearIncomplete: !0,
                autoUnmask: !0
            }
        }), Inputmask;
    });
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
    "function" == typeof Symbol && Symbol.iterator;
    !function(factory) {
        __WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(0), __webpack_require__(1) ],
        __WEBPACK_AMD_DEFINE_FACTORY__ = factory, void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
    }(function($, Inputmask, undefined) {
        function autoEscape(txt, opts) {
            for (var escapedTxt = "", i = 0; i < txt.length; i++) Inputmask.prototype.definitions[txt.charAt(i)] || opts.definitions[txt.charAt(i)] || opts.optionalmarker.start === txt.charAt(i) || opts.optionalmarker.end === txt.charAt(i) || opts.quantifiermarker.start === txt.charAt(i) || opts.quantifiermarker.end === txt.charAt(i) || opts.groupmarker.start === txt.charAt(i) || opts.groupmarker.end === txt.charAt(i) || opts.alternatormarker === txt.charAt(i) ? escapedTxt += "\\" + txt.charAt(i) : escapedTxt += txt.charAt(i);
            return escapedTxt;
        }
        return Inputmask.extendAliases({
            numeric: {
                mask: function(opts) {
                    if (0 !== opts.repeat && isNaN(opts.integerDigits) && (opts.integerDigits = opts.repeat),
                    opts.repeat = 0, opts.groupSeparator === opts.radixPoint && opts.digits && "0" !== opts.digits && ("." === opts.radixPoint ? opts.groupSeparator = "," : "," === opts.radixPoint ? opts.groupSeparator = "." : opts.groupSeparator = ""),
                    " " === opts.groupSeparator && (opts.skipOptionalPartCharacter = undefined), opts.autoGroup = opts.autoGroup && "" !== opts.groupSeparator,
                    opts.autoGroup && ("string" == typeof opts.groupSize && isFinite(opts.groupSize) && (opts.groupSize = parseInt(opts.groupSize)),
                    isFinite(opts.integerDigits))) {
                        var seps = Math.floor(opts.integerDigits / opts.groupSize), mod = opts.integerDigits % opts.groupSize;
                        opts.integerDigits = parseInt(opts.integerDigits) + (0 === mod ? seps - 1 : seps),
                        opts.integerDigits < 1 && (opts.integerDigits = "*");
                    }
                    opts.placeholder.length > 1 && (opts.placeholder = opts.placeholder.charAt(0)),
                    "radixFocus" === opts.positionCaretOnClick && "" === opts.placeholder && !1 === opts.integerOptional && (opts.positionCaretOnClick = "lvp"),
                    opts.definitions[";"] = opts.definitions["~"], opts.definitions[";"].definitionSymbol = "~",
                    !0 === opts.numericInput && (opts.positionCaretOnClick = "radixFocus" === opts.positionCaretOnClick ? "lvp" : opts.positionCaretOnClick,
                    opts.digitsOptional = !1, isNaN(opts.digits) && (opts.digits = 2), opts.decimalProtect = !1);
                    var mask = "[+]";
                    if (mask += autoEscape(opts.prefix, opts), !0 === opts.integerOptional ? mask += "~{1," + opts.integerDigits + "}" : mask += "~{" + opts.integerDigits + "}",
                    opts.digits !== undefined) {
                        opts.radixPointDefinitionSymbol = opts.decimalProtect ? ":" : opts.radixPoint;
                        var dq = opts.digits.toString().split(",");
                        isFinite(dq[0] && dq[1] && isFinite(dq[1])) ? mask += opts.radixPointDefinitionSymbol + ";{" + opts.digits + "}" : (isNaN(opts.digits) || parseInt(opts.digits) > 0) && (opts.digitsOptional ? mask += "[" + opts.radixPointDefinitionSymbol + ";{1," + opts.digits + "}]" : mask += opts.radixPointDefinitionSymbol + ";{" + opts.digits + "}");
                    }
                    return mask += autoEscape(opts.suffix, opts), mask += "[-]", opts.greedy = !1, mask;
                },
                placeholder: "",
                greedy: !1,
                digits: "*",
                digitsOptional: !0,
                enforceDigitsOnBlur: !1,
                radixPoint: ".",
                positionCaretOnClick: "radixFocus",
                groupSize: 3,
                groupSeparator: "",
                autoGroup: !1,
                allowMinus: !0,
                negationSymbol: {
                    front: "-",
                    back: ""
                },
                integerDigits: "+",
                integerOptional: !0,
                prefix: "",
                suffix: "",
                rightAlign: !0,
                decimalProtect: !0,
                min: null,
                max: null,
                step: 1,
                insertMode: !0,
                autoUnmask: !1,
                unmaskAsNumber: !1,
                inputmode: "numeric",
                preValidation: function(buffer, pos, c, isSelection, opts) {
                    if ("-" === c || c === opts.negationSymbol.front) return !0 === opts.allowMinus && (opts.isNegative = opts.isNegative === undefined || !opts.isNegative,
                    "" === buffer.join("") || {
                        caret: pos,
                        dopost: !0
                    });
                    if (!1 === isSelection && c === opts.radixPoint && opts.digits !== undefined && (isNaN(opts.digits) || parseInt(opts.digits) > 0)) {
                        var radixPos = $.inArray(opts.radixPoint, buffer);
                        if (-1 !== radixPos) return !0 === opts.numericInput ? pos === radixPos : {
                            caret: radixPos + 1
                        };
                    }
                    return !0;
                },
                postValidation: function(buffer, currentResult, opts) {
                    var suffix = opts.suffix.split(""), prefix = opts.prefix.split("");
                    if (currentResult.pos === undefined && currentResult.caret !== undefined && !0 !== currentResult.dopost) return currentResult;
                    var caretPos = currentResult.caret !== undefined ? currentResult.caret : currentResult.pos, maskedValue = buffer.slice();
                    opts.numericInput && (caretPos = maskedValue.length - caretPos - 1, maskedValue = maskedValue.reverse());
                    var charAtPos = maskedValue[caretPos];
                    if (charAtPos === opts.groupSeparator && (caretPos += 1, charAtPos = maskedValue[caretPos]),
                    caretPos === maskedValue.length - opts.suffix.length - 1 && charAtPos === opts.radixPoint) return currentResult;
                    charAtPos !== undefined && charAtPos !== opts.radixPoint && charAtPos !== opts.negationSymbol.front && charAtPos !== opts.negationSymbol.back && (maskedValue[caretPos] = "?",
                    opts.prefix.length > 0 && caretPos >= (!1 === opts.isNegative ? 1 : 0) && caretPos < opts.prefix.length - 1 + (!1 === opts.isNegative ? 1 : 0) ? prefix[caretPos - (!1 === opts.isNegative ? 1 : 0)] = "?" : opts.suffix.length > 0 && caretPos >= maskedValue.length - opts.suffix.length - (!1 === opts.isNegative ? 1 : 0) && (suffix[caretPos - (maskedValue.length - opts.suffix.length - (!1 === opts.isNegative ? 1 : 0))] = "?")),
                    prefix = prefix.join(""), suffix = suffix.join("");
                    var processValue = maskedValue.join("").replace(prefix, "");
                    if (processValue = processValue.replace(suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
                    processValue = processValue.replace(new RegExp("[-" + Inputmask.escapeRegex(opts.negationSymbol.front) + "]", "g"), ""),
                    processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.negationSymbol.back) + "$"), ""),
                    isNaN(opts.placeholder) && (processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.placeholder), "g"), "")),
                    processValue.length > 1 && 1 !== processValue.indexOf(opts.radixPoint) && ("0" === charAtPos && (processValue = processValue.replace(/^\?/g, "")),
                    processValue = processValue.replace(/^0/g, "")), processValue.charAt(0) === opts.radixPoint && "" !== opts.radixPoint && !0 !== opts.numericInput && (processValue = "0" + processValue),
                    "" !== processValue) {
                        if (processValue = processValue.split(""), (!opts.digitsOptional || opts.enforceDigitsOnBlur && "blur" === currentResult.event) && isFinite(opts.digits)) {
                            var radixPosition = $.inArray(opts.radixPoint, processValue), rpb = $.inArray(opts.radixPoint, maskedValue);
                            -1 === radixPosition && (processValue.push(opts.radixPoint), radixPosition = processValue.length - 1);
                            for (var i = 1; i <= opts.digits; i++) opts.digitsOptional && (!opts.enforceDigitsOnBlur || "blur" !== currentResult.event) || processValue[radixPosition + i] !== undefined && processValue[radixPosition + i] !== opts.placeholder.charAt(0) ? -1 !== rpb && maskedValue[rpb + i] !== undefined && (processValue[radixPosition + i] = processValue[radixPosition + i] || maskedValue[rpb + i]) : processValue[radixPosition + i] = currentResult.placeholder || opts.placeholder.charAt(0);
                        }
                        if (!0 !== opts.autoGroup || "" === opts.groupSeparator || charAtPos === opts.radixPoint && currentResult.pos === undefined && !currentResult.dopost) processValue = processValue.join(""); else {
                            var addRadix = processValue[processValue.length - 1] === opts.radixPoint && currentResult.c === opts.radixPoint;
                            processValue = Inputmask(function(buffer, opts) {
                                var postMask = "";
                                if (postMask += "(" + opts.groupSeparator + "*{" + opts.groupSize + "}){*}", "" !== opts.radixPoint) {
                                    var radixSplit = buffer.join("").split(opts.radixPoint);
                                    radixSplit[1] && (postMask += opts.radixPoint + "*{" + radixSplit[1].match(/^\d*\??\d*/)[0].length + "}");
                                }
                                return postMask;
                            }(processValue, opts), {
                                numericInput: !0,
                                jitMasking: !0,
                                definitions: {
                                    "*": {
                                        validator: "[0-9?]",
                                        cardinality: 1
                                    }
                                }
                            }).format(processValue.join("")), addRadix && (processValue += opts.radixPoint),
                            processValue.charAt(0) === opts.groupSeparator && processValue.substr(1);
                        }
                    }
                    if (opts.isNegative && "blur" === currentResult.event && (opts.isNegative = "0" !== processValue),
                    processValue = prefix + processValue, processValue += suffix, opts.isNegative && (processValue = opts.negationSymbol.front + processValue,
                    processValue += opts.negationSymbol.back), processValue = processValue.split(""),
                    charAtPos !== undefined) if (charAtPos !== opts.radixPoint && charAtPos !== opts.negationSymbol.front && charAtPos !== opts.negationSymbol.back) caretPos = $.inArray("?", processValue),
                    caretPos > -1 ? processValue[caretPos] = charAtPos : caretPos = currentResult.caret || 0; else if (charAtPos === opts.radixPoint || charAtPos === opts.negationSymbol.front || charAtPos === opts.negationSymbol.back) {
                        var newCaretPos = $.inArray(charAtPos, processValue);
                        -1 !== newCaretPos && (caretPos = newCaretPos);
                    }
                    opts.numericInput && (caretPos = processValue.length - caretPos - 1, processValue = processValue.reverse());
                    var rslt = {
                        caret: charAtPos === undefined || currentResult.pos !== undefined ? caretPos + (opts.numericInput ? -1 : 1) : caretPos,
                        buffer: processValue,
                        refreshFromBuffer: currentResult.dopost || buffer.join("") !== processValue.join("")
                    };
                    return rslt.refreshFromBuffer ? rslt : currentResult;
                },
                onBeforeWrite: function(e, buffer, caretPos, opts) {
                    if (e) switch (e.type) {
                      case "keydown":
                        return opts.postValidation(buffer, {
                            caret: caretPos,
                            dopost: !0
                        }, opts);

                      case "blur":
                      case "checkval":
                        var unmasked;
                        if (function(opts) {
                            opts.parseMinMaxOptions === undefined && (null !== opts.min && (opts.min = opts.min.toString().replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
                            "," === opts.radixPoint && (opts.min = opts.min.replace(opts.radixPoint, ".")),
                            opts.min = isFinite(opts.min) ? parseFloat(opts.min) : NaN, isNaN(opts.min) && (opts.min = Number.MIN_VALUE)),
                            null !== opts.max && (opts.max = opts.max.toString().replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
                            "," === opts.radixPoint && (opts.max = opts.max.replace(opts.radixPoint, ".")),
                            opts.max = isFinite(opts.max) ? parseFloat(opts.max) : NaN, isNaN(opts.max) && (opts.max = Number.MAX_VALUE)),
                            opts.parseMinMaxOptions = "done");
                        }(opts), null !== opts.min || null !== opts.max) {
                            if (unmasked = opts.onUnMask(buffer.join(""), undefined, $.extend({}, opts, {
                                unmaskAsNumber: !0
                            })), null !== opts.min && unmasked < opts.min) return opts.isNegative = opts.min < 0,
                            opts.postValidation(opts.min.toString().replace(".", opts.radixPoint).split(""), {
                                caret: caretPos,
                                dopost: !0,
                                placeholder: "0"
                            }, opts);
                            if (null !== opts.max && unmasked > opts.max) return opts.isNegative = opts.max < 0,
                            opts.postValidation(opts.max.toString().replace(".", opts.radixPoint).split(""), {
                                caret: caretPos,
                                dopost: !0,
                                placeholder: "0"
                            }, opts);
                        }
                        return opts.postValidation(buffer, {
                            caret: caretPos,
                            placeholder: "0",
                            event: "blur"
                        }, opts);

                      case "_checkval":
                        return {
                            caret: caretPos
                        };
                    }
                },
                regex: {
                    integerPart: function(opts, emptyCheck) {
                        return emptyCheck ? new RegExp("[" + Inputmask.escapeRegex(opts.negationSymbol.front) + "+]?") : new RegExp("[" + Inputmask.escapeRegex(opts.negationSymbol.front) + "+]?\\d+");
                    },
                    integerNPart: function(opts) {
                        return new RegExp("[\\d" + Inputmask.escapeRegex(opts.groupSeparator) + Inputmask.escapeRegex(opts.placeholder.charAt(0)) + "]+");
                    }
                },
                definitions: {
                    "~": {
                        validator: function(chrs, maskset, pos, strict, opts, isSelection) {
                            var isValid = strict ? new RegExp("[0-9" + Inputmask.escapeRegex(opts.groupSeparator) + "]").test(chrs) : new RegExp("[0-9]").test(chrs);
                            if (!0 === isValid) {
                                if (!0 !== opts.numericInput && maskset.validPositions[pos] !== undefined && "~" === maskset.validPositions[pos].match.def && !isSelection) {
                                    var processValue = maskset.buffer.join("");
                                    processValue = processValue.replace(new RegExp("[-" + Inputmask.escapeRegex(opts.negationSymbol.front) + "]", "g"), ""),
                                    processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.negationSymbol.back) + "$"), "");
                                    var pvRadixSplit = processValue.split(opts.radixPoint);
                                    pvRadixSplit.length > 1 && (pvRadixSplit[1] = pvRadixSplit[1].replace(/0/g, opts.placeholder.charAt(0))),
                                    "0" === pvRadixSplit[0] && (pvRadixSplit[0] = pvRadixSplit[0].replace(/0/g, opts.placeholder.charAt(0))),
                                    processValue = pvRadixSplit[0] + opts.radixPoint + pvRadixSplit[1] || "";
                                    var bufferTemplate = maskset._buffer.join("");
                                    for (processValue === opts.radixPoint && (processValue = bufferTemplate); null === processValue.match(Inputmask.escapeRegex(bufferTemplate) + "$"); ) bufferTemplate = bufferTemplate.slice(1);
                                    processValue = processValue.replace(bufferTemplate, ""), processValue = processValue.split(""),
                                    isValid = processValue[pos] === undefined ? {
                                        pos: pos,
                                        remove: pos
                                    } : {
                                        pos: pos
                                    };
                                }
                            } else strict || chrs !== opts.radixPoint || maskset.validPositions[pos - 1] !== undefined || (maskset.buffer[pos] = "0",
                            isValid = {
                                pos: pos + 1
                            });
                            return isValid;
                        },
                        cardinality: 1
                    },
                    "+": {
                        validator: function(chrs, maskset, pos, strict, opts) {
                            return opts.allowMinus && ("-" === chrs || chrs === opts.negationSymbol.front);
                        },
                        cardinality: 1,
                        placeholder: ""
                    },
                    "-": {
                        validator: function(chrs, maskset, pos, strict, opts) {
                            return opts.allowMinus && chrs === opts.negationSymbol.back;
                        },
                        cardinality: 1,
                        placeholder: ""
                    },
                    ":": {
                        validator: function(chrs, maskset, pos, strict, opts) {
                            var radix = "[" + Inputmask.escapeRegex(opts.radixPoint) + "]", isValid = new RegExp(radix).test(chrs);
                            return isValid && maskset.validPositions[pos] && maskset.validPositions[pos].match.placeholder === opts.radixPoint && (isValid = {
                                caret: pos + 1
                            }), isValid;
                        },
                        cardinality: 1,
                        placeholder: function(opts) {
                            return opts.radixPoint;
                        }
                    }
                },
                onUnMask: function(maskedValue, unmaskedValue, opts) {
                    if ("" === unmaskedValue && !0 === opts.nullable) return unmaskedValue;
                    var processValue = maskedValue.replace(opts.prefix, "");
                    return processValue = processValue.replace(opts.suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
                    "" !== opts.placeholder.charAt(0) && (processValue = processValue.replace(new RegExp(opts.placeholder.charAt(0), "g"), "0")),
                    opts.unmaskAsNumber ? ("" !== opts.radixPoint && -1 !== processValue.indexOf(opts.radixPoint) && (processValue = processValue.replace(Inputmask.escapeRegex.call(this, opts.radixPoint), ".")),
                    processValue = processValue.replace(new RegExp("^" + Inputmask.escapeRegex(opts.negationSymbol.front)), "-"),
                    processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.negationSymbol.back) + "$"), ""),
                    Number(processValue)) : processValue;
                },
                isComplete: function(buffer, opts) {
                    var maskedValue = buffer.join("");
                    if (buffer.slice().join("") !== maskedValue) return !1;
                    var processValue = maskedValue.replace(opts.prefix, "");
                    return processValue = processValue.replace(opts.suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
                    "," === opts.radixPoint && (processValue = processValue.replace(Inputmask.escapeRegex(opts.radixPoint), ".")),
                    isFinite(processValue);
                },
                onBeforeMask: function(initialValue, opts) {
                    if (opts.isNegative = undefined, initialValue = initialValue.toString().charAt(initialValue.length - 1) === opts.radixPoint ? initialValue.toString().substr(0, initialValue.length - 1) : initialValue.toString(),
                    "" !== opts.radixPoint && isFinite(initialValue)) {
                        var vs = initialValue.split("."), groupSize = "" !== opts.groupSeparator ? parseInt(opts.groupSize) : 0;
                        2 === vs.length && (vs[0].length > groupSize || vs[1].length > groupSize || vs[0].length <= groupSize && vs[1].length < groupSize) && (initialValue = initialValue.replace(".", opts.radixPoint));
                    }
                    var kommaMatches = initialValue.match(/,/g), dotMatches = initialValue.match(/\./g);
                    if (dotMatches && kommaMatches ? dotMatches.length > kommaMatches.length ? (initialValue = initialValue.replace(/\./g, ""),
                    initialValue = initialValue.replace(",", opts.radixPoint)) : kommaMatches.length > dotMatches.length ? (initialValue = initialValue.replace(/,/g, ""),
                    initialValue = initialValue.replace(".", opts.radixPoint)) : initialValue = initialValue.indexOf(".") < initialValue.indexOf(",") ? initialValue.replace(/\./g, "") : initialValue.replace(/,/g, "") : initialValue = initialValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""),
                    0 === opts.digits && (-1 !== initialValue.indexOf(".") ? initialValue = initialValue.substring(0, initialValue.indexOf(".")) : -1 !== initialValue.indexOf(",") && (initialValue = initialValue.substring(0, initialValue.indexOf(",")))),
                    "" !== opts.radixPoint && isFinite(opts.digits) && -1 !== initialValue.indexOf(opts.radixPoint)) {
                        var valueParts = initialValue.split(opts.radixPoint), decPart = valueParts[1].match(new RegExp("\\d*"))[0];
                        if (parseInt(opts.digits) < decPart.toString().length) {
                            var digitsFactor = Math.pow(10, parseInt(opts.digits));
                            initialValue = initialValue.replace(Inputmask.escapeRegex(opts.radixPoint), "."),
                            initialValue = Math.round(parseFloat(initialValue) * digitsFactor) / digitsFactor,
                            initialValue = initialValue.toString().replace(".", opts.radixPoint);
                        }
                    }
                    return initialValue;
                },
                canClearPosition: function(maskset, position, lvp, strict, opts) {
                    var vp = maskset.validPositions[position], canClear = vp.input !== opts.radixPoint || null !== maskset.validPositions[position].match.fn && !1 === opts.decimalProtect || vp.input === opts.radixPoint && maskset.validPositions[position + 1] && null === maskset.validPositions[position + 1].match.fn || isFinite(vp.input) || position === lvp || vp.input === opts.groupSeparator || vp.input === opts.negationSymbol.front || vp.input === opts.negationSymbol.back;
                    return !canClear || "+" !== vp.match.nativeDef && "-" !== vp.match.nativeDef || (opts.isNegative = !1),
                    canClear;
                },
                onKeyDown: function(e, buffer, caretPos, opts) {
                    var $input = $(this);
                    if (e.ctrlKey) switch (e.keyCode) {
                      case Inputmask.keyCode.UP:
                        $input.val(parseFloat(this.inputmask.unmaskedvalue()) + parseInt(opts.step)), $input.trigger("setvalue");
                        break;

                      case Inputmask.keyCode.DOWN:
                        $input.val(parseFloat(this.inputmask.unmaskedvalue()) - parseInt(opts.step)), $input.trigger("setvalue");
                    }
                }
            },
            currency: {
                prefix: "$ ",
                groupSeparator: ",",
                alias: "numeric",
                placeholder: "0",
                autoGroup: !0,
                digits: 2,
                digitsOptional: !1,
                clearMaskOnLostFocus: !1
            },
            decimal: {
                alias: "numeric"
            },
            integer: {
                alias: "numeric",
                digits: 0,
                radixPoint: ""
            },
            percentage: {
                alias: "numeric",
                digits: 2,
                digitsOptional: !0,
                radixPoint: ".",
                placeholder: "0",
                autoGroup: !1,
                min: 0,
                max: 100,
                suffix: " %",
                allowMinus: !1
            }
        }), Inputmask;
    });
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
    "function" == typeof Symbol && Symbol.iterator;
    !function(factory) {
        __WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(0), __webpack_require__(1) ],
        __WEBPACK_AMD_DEFINE_FACTORY__ = factory, void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
    }(function($, Inputmask) {
        function maskSort(a, b) {
            var maska = (a.mask || a).replace(/#/g, "9").replace(/\)/, "9").replace(/[+()#-]/g, ""), maskb = (b.mask || b).replace(/#/g, "9").replace(/\)/, "9").replace(/[+()#-]/g, ""), maskas = (a.mask || a).split("#")[0], maskbs = (b.mask || b).split("#")[0];
            return 0 === maskbs.indexOf(maskas) ? -1 : 0 === maskas.indexOf(maskbs) ? 1 : maska.localeCompare(maskb);
        }
        var analyseMaskBase = Inputmask.prototype.analyseMask;
        return Inputmask.prototype.analyseMask = function(mask, regexMask, opts) {
            var maskGroups = {};
            function reduceVariations(masks, previousVariation, previousmaskGroup) {
                previousVariation = previousVariation || "", previousmaskGroup = previousmaskGroup || maskGroups,
                "" !== previousVariation && (previousmaskGroup[previousVariation] = {});
                for (var variation = "", maskGroup = previousmaskGroup[previousVariation] || previousmaskGroup, i = masks.length - 1; i >= 0; i--) mask = masks[i].mask || masks[i],
                variation = mask.substr(0, 1), maskGroup[variation] = maskGroup[variation] || [],
                maskGroup[variation].unshift(mask.substr(1)), masks.splice(i, 1);
                for (var ndx in maskGroup) maskGroup[ndx].length > 500 && reduceVariations(maskGroup[ndx].slice(), ndx, maskGroup);
            }
            function rebuild(maskGroup) {
                var mask = "", submasks = [];
                for (var ndx in maskGroup) $.isArray(maskGroup[ndx]) ? 1 === maskGroup[ndx].length ? submasks.push(ndx + maskGroup[ndx]) : submasks.push(ndx + opts.groupmarker.start + maskGroup[ndx].join(opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start) + opts.groupmarker.end) : submasks.push(ndx + rebuild(maskGroup[ndx]));
                return 1 === submasks.length ? mask += submasks[0] : mask += opts.groupmarker.start + submasks.join(opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start) + opts.groupmarker.end,
                mask;
            }
            return opts.phoneCodes && (opts.phoneCodes && opts.phoneCodes.length > 1e3 && (mask = mask.substr(1, mask.length - 2),
            reduceVariations(mask.split(opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start)),
            mask = rebuild(maskGroups)), mask = mask.replace(/9/g, "\\9")), analyseMaskBase.call(this, mask, regexMask, opts);
        }, Inputmask.extendAliases({
            abstractphone: {
                groupmarker: {
                    start: "<",
                    end: ">"
                },
                countrycode: "",
                phoneCodes: [],
                mask: function(opts) {
                    return opts.definitions = {
                        "#": Inputmask.prototype.definitions[9]
                    }, opts.phoneCodes.sort(maskSort);
                },
                keepStatic: !0,
                onBeforeMask: function(value, opts) {
                    var processedValue = value.replace(/^0{1,2}/, "").replace(/[\s]/g, "");
                    return (processedValue.indexOf(opts.countrycode) > 1 || -1 === processedValue.indexOf(opts.countrycode)) && (processedValue = "+" + opts.countrycode + processedValue),
                    processedValue;
                },
                onUnMask: function(maskedValue, unmaskedValue, opts) {
                    return maskedValue.replace(/[()#-]/g, "");
                },
                inputmode: "tel"
            }
        }), Inputmask;
    });
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__, _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    !function(factory) {
        __WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(2), __webpack_require__(1) ],
        __WEBPACK_AMD_DEFINE_FACTORY__ = factory, void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
    }(function($, Inputmask) {
        return void 0 === $.fn.inputmask && ($.fn.inputmask = function(fn, options) {
            var nptmask, input = this[0];
            if (void 0 === options && (options = {}), "string" == typeof fn) switch (fn) {
              case "unmaskedvalue":
                return input && input.inputmask ? input.inputmask.unmaskedvalue() : $(input).val();

              case "remove":
                return this.each(function() {
                    this.inputmask && this.inputmask.remove();
                });

              case "getemptymask":
                return input && input.inputmask ? input.inputmask.getemptymask() : "";

              case "hasMaskedValue":
                return !(!input || !input.inputmask) && input.inputmask.hasMaskedValue();

              case "isComplete":
                return !input || !input.inputmask || input.inputmask.isComplete();

              case "getmetadata":
                return input && input.inputmask ? input.inputmask.getmetadata() : void 0;

              case "setvalue":
                $(input).val(options), input && void 0 === input.inputmask && $(input).triggerHandler("setvalue");
                break;

              case "option":
                if ("string" != typeof options) return this.each(function() {
                    if (void 0 !== this.inputmask) return this.inputmask.option(options);
                });
                if (input && void 0 !== input.inputmask) return input.inputmask.option(options);
                break;

              default:
                return options.alias = fn, nptmask = new Inputmask(options), this.each(function() {
                    nptmask.mask(this);
                });
            } else {
                if ("object" == (void 0 === fn ? "undefined" : _typeof(fn))) return nptmask = new Inputmask(fn),
                void 0 === fn.mask && void 0 === fn.alias ? this.each(function() {
                    if (void 0 !== this.inputmask) return this.inputmask.option(fn);
                    nptmask.mask(this);
                }) : this.each(function() {
                    nptmask.mask(this);
                });
                if (void 0 === fn) return this.each(function() {
                    nptmask = new Inputmask(options), nptmask.mask(this);
                });
            }
        }), $.fn.inputmask;
    });
}, function(module, exports, __webpack_require__) {
    var content = __webpack_require__(12);
    "string" == typeof content && (content = [ [ module.i, content, "" ] ]);
    __webpack_require__(14)(content, {});
    content.locals && (module.exports = content.locals);
}, function(module, exports, __webpack_require__) {
    "use strict";
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }
    __webpack_require__(8), __webpack_require__(3), __webpack_require__(4), __webpack_require__(5),
    __webpack_require__(6);
    var _inputmask = __webpack_require__(1), _inputmask2 = _interopRequireDefault(_inputmask), _inputmask3 = __webpack_require__(0), _inputmask4 = _interopRequireDefault(_inputmask3), _jquery = __webpack_require__(2), _jquery2 = _interopRequireDefault(_jquery);
    _inputmask4.default === _jquery2.default && __webpack_require__(7), window.Inputmask = _inputmask2.default;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __WEBPACK_AMD_DEFINE_RESULT__;
    "function" == typeof Symbol && Symbol.iterator;
    void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = function() {
        return document;
    }.call(exports, __webpack_require__, exports, module)) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __WEBPACK_AMD_DEFINE_RESULT__;
    "function" == typeof Symbol && Symbol.iterator;
    void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = function() {
        return window;
    }.call(exports, __webpack_require__, exports, module)) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
}, function(module, exports, __webpack_require__) {
    exports = module.exports = __webpack_require__(13)(void 0), exports.push([ module.i, "span.im-caret {\r\n    -webkit-animation: 1s blink step-end infinite;\r\n    animation: 1s blink step-end infinite;\r\n}\r\n\r\n@keyframes blink {\r\n    from, to {\r\n        border-right-color: black;\r\n    }\r\n    50% {\r\n        border-right-color: transparent;\r\n    }\r\n}\r\n\r\n@-webkit-keyframes blink {\r\n    from, to {\r\n        border-right-color: black;\r\n    }\r\n    50% {\r\n        border-right-color: transparent;\r\n    }\r\n}\r\n\r\nspan.im-static {\r\n    color: grey;\r\n}\r\n\r\ndiv.im-colormask {\r\n    display: inline-block;\r\n    border-style: inset;\r\n    border-width: 2px;\r\n    -webkit-appearance: textfield;\r\n    -moz-appearance: textfield;\r\n    appearance: textfield;\r\n}\r\n\r\ndiv.im-colormask > input {\r\n    position: absolute;\r\n    display: inline-block;\r\n    background-color: transparent;\r\n    color: transparent;\r\n    -webkit-appearance: caret;\r\n    -moz-appearance: caret;\r\n    appearance: caret;\r\n    border-style: none;\r\n    left: 0; /*calculated*/\r\n}\r\n\r\ndiv.im-colormask > input:focus {\r\n    outline: none;\r\n}\r\n\r\ndiv.im-colormask > div {\r\n    color: black;\r\n    display: inline-block;\r\n    width: 100px; /*calculated*/\r\n}", "" ]);
}, function(module, exports) {
    function cssWithMappingToString(item, useSourceMap) {
        var content = item[1] || "", cssMapping = item[3];
        if (!cssMapping) return content;
        if (useSourceMap && "function" == typeof btoa) {
            var sourceMapping = toComment(cssMapping);
            return [ content ].concat(cssMapping.sources.map(function(source) {
                return "/*# sourceURL=" + cssMapping.sourceRoot + source + " */";
            })).concat([ sourceMapping ]).join("\n");
        }
        return [ content ].join("\n");
    }
    function toComment(sourceMap) {
        return "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
    }
    module.exports = function(useSourceMap) {
        var list = [];
        return list.toString = function() {
            return this.map(function(item) {
                var content = cssWithMappingToString(item, useSourceMap);
                return item[2] ? "@media " + item[2] + "{" + content + "}" : content;
            }).join("");
        }, list.i = function(modules, mediaQuery) {
            "string" == typeof modules && (modules = [ [ null, modules, "" ] ]);
            for (var alreadyImportedModules = {}, i = 0; i < this.length; i++) {
                var id = this[i][0];
                "number" == typeof id && (alreadyImportedModules[id] = !0);
            }
            for (i = 0; i < modules.length; i++) {
                var item = modules[i];
                "number" == typeof item[0] && alreadyImportedModules[item[0]] || (mediaQuery && !item[2] ? item[2] = mediaQuery : mediaQuery && (item[2] = "(" + item[2] + ") and (" + mediaQuery + ")"),
                list.push(item));
            }
        }, list;
    };
}, function(module, exports, __webpack_require__) {
    function addStylesToDom(styles, options) {
      var stylesInDom = {};
        for (var i = 0; i < styles.length; i++) {
            var item = styles[i], domStyle = stylesInDom[item.id];
            if (domStyle) {
                domStyle.refs++;
                for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j](item.parts[j]);
                for (;j < item.parts.length; j++) domStyle.parts.push(addStyle(item.parts[j], options));
            } else {
                for (var parts = [], j = 0; j < item.parts.length; j++) parts.push(addStyle(item.parts[j], options));
                stylesInDom[item.id] = {
                    id: item.id,
                    refs: 1,
                    parts: parts
                };
            }
        }
    }
    function listToStyles(list) {
        for (var styles = [], newStyles = {}, i = 0; i < list.length; i++) {
            var item = list[i], id = item[0], css = item[1], media = item[2], sourceMap = item[3], part = {
                css: css,
                media: media,
                sourceMap: sourceMap
            };
            newStyles[id] ? newStyles[id].parts.push(part) : styles.push(newStyles[id] = {
                id: id,
                parts: [ part ]
            });
        }
        return styles;
    }
    var getElement = function(fn) {
      var memo = {};
      return function(selector) {
          return void 0 === memo[selector] && (memo[selector] = fn.call(this, selector)),
          memo[selector];
      };
      }(function(styleTarget) {
          return document.querySelector(styleTarget);
    });
    var singletonElement = null, singletonCounter = 0, styleElementsInsertedAtTop = [], fixUrls = __webpack_require__(15);
    function insertStyleElement(options, styleElement) {
        var styleTarget = getElement(options.insertInto);
        if (!styleTarget) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
        var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
        if ("top" === options.insertAt) lastStyleElementInsertedAtTop ? lastStyleElementInsertedAtTop.nextSibling ? styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling) : styleTarget.appendChild(styleElement) : styleTarget.insertBefore(styleElement, styleTarget.firstChild),
        styleElementsInsertedAtTop.push(styleElement); else {
            if ("bottom" !== options.insertAt) throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
            styleTarget.appendChild(styleElement);
        }
    }
    function removeStyleElement(styleElement) {
        styleElement.parentNode.removeChild(styleElement);
        var idx = styleElementsInsertedAtTop.indexOf(styleElement);
        idx >= 0 && styleElementsInsertedAtTop.splice(idx, 1);
    }
    function createStyleElement(options) {
        var styleElement = document.createElement("style");
        return options.attrs.type = "text/css", attachTagAttrs(styleElement, options.attrs),
        insertStyleElement(options, styleElement), styleElement;
    }
    function createLinkElement(options) {
        var linkElement = document.createElement("link");
        return options.attrs.type = "text/css", options.attrs.rel = "stylesheet", attachTagAttrs(linkElement, options.attrs),
        insertStyleElement(options, linkElement), linkElement;
    }
    function attachTagAttrs(element, attrs) {
        Object.keys(attrs).forEach(function(key) {
            element.setAttribute(key, attrs[key]);
        });
    }
    function addStyle(obj, options) {
      var replaceText = function() {
        var textStore = [];
        return function(index, replacement) {
            return textStore[index] = replacement, textStore.filter(Boolean).join("\n");
        };
      }();
        var styleElement, update, remove;
        if (options.singleton) {
            var styleIndex = singletonCounter++;
            styleElement = singletonElement || (singletonElement = createStyleElement(options)),
            update = applyToSingletonTag.bind(null, styleElement, styleIndex, !1), remove = applyToSingletonTag.bind(null, styleElement, styleIndex, !0);
        } else obj.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (styleElement = createLinkElement(options),
        update = updateLink.bind(null, styleElement, options), remove = function() {
            removeStyleElement(styleElement), styleElement.href && URL.revokeObjectURL(styleElement.href);
        }) : (styleElement = createStyleElement(options), update = applyToTag.bind(null, styleElement),
        remove = function() {
            removeStyleElement(styleElement);
        });
        return update(obj), function(newObj) {
            if (newObj) {
                if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                update(obj = newObj);
            } else remove();
        };
    }
    function applyToSingletonTag(styleElement, index, remove, obj) {
        var css = remove ? "" : obj.css;
        if (styleElement.styleSheet) styleElement.styleSheet.cssText = replaceText(index, css); else {
            var cssNode = document.createTextNode(css), childNodes = styleElement.childNodes;
            childNodes[index] && styleElement.removeChild(childNodes[index]), childNodes.length ? styleElement.insertBefore(cssNode, childNodes[index]) : styleElement.appendChild(cssNode);
        }
    }
    function applyToTag(styleElement, obj) {
        var css = obj.css, media = obj.media;
        if (media && styleElement.setAttribute("media", media), styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
            for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
            styleElement.appendChild(document.createTextNode(css));
        }
    }
    function updateLink(linkElement, options, obj) {
        var css = obj.css, sourceMap = obj.sourceMap, autoFixUrls = void 0 === options.convertToAbsoluteUrls && sourceMap;
        (options.convertToAbsoluteUrls || autoFixUrls) && (css = fixUrls(css)), sourceMap && (css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */");
        var blob = new Blob([ css ], {
            type: "text/css"
        }), oldSrc = linkElement.href;
        linkElement.href = URL.createObjectURL(blob), oldSrc && URL.revokeObjectURL(oldSrc);
    }
    var isOldIE = function(fn) {
        var memo;
        return function() {
            return void 0 === memo && (memo = fn.apply(this, arguments)), memo;
        };
    }(function() {
        return window && document && document.all && !window.atob;
    });
    module.exports = function(list, options) {
        if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
        options = options || {}, options.attrs = "object" == typeof options.attrs ? options.attrs : {},
        void 0 === options.singleton && (options.singleton = isOldIE()), void 0 === options.insertInto && (options.insertInto = "head"),
        void 0 === options.insertAt && (options.insertAt = "bottom");
        var styles = listToStyles(list);
        return addStylesToDom(styles, options), function(newList) {
            for (var mayRemove = [], i = 0; i < styles.length; i++) {
                var item = styles[i], domStyle = stylesInDom[item.id];
                domStyle.refs--, mayRemove.push(domStyle);
            }
            if (newList) {
                addStylesToDom(listToStyles(newList), options);
            }
            for (var i = 0; i < mayRemove.length; i++) {
                var domStyle = mayRemove[i];
                if (0 === domStyle.refs) {
                    for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();
                    delete stylesInDom[domStyle.id];
                }
            }
        };
    };
}, function(module, exports) {
    module.exports = function(css) {
        var location = "undefined" != typeof window && window.location;
        if (!location) throw new Error("fixUrls requires window.location");
        if (!css || "string" != typeof css) return css;
        var baseUrl = location.protocol + "//" + location.host, currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");
        return css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
            var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function(o, $1) {
                return $1;
            }).replace(/^'(.*)'$/, function(o, $1) {
                return $1;
            });
            if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) return fullMatch;
            var newUrl;
            return newUrl = 0 === unquotedOrigUrl.indexOf("//") ? unquotedOrigUrl : 0 === unquotedOrigUrl.indexOf("/") ? baseUrl + unquotedOrigUrl : currentDir + unquotedOrigUrl.replace(/^\.\//, ""),
            "url(" + JSON.stringify(newUrl) + ")";
        });
    };
} ]);

$.primefacesHelper();
$.activeTarget();
$.formclickContainer();
$.toast(window);

var windw = $(window);
var previewWidth = 500;

// Preview Auto Resize
var resize = function() {
  var windowWidth = $(window).width() / 2;
  var windowHeight = $(window).height() - 180;

  if ($("body form.StarMap")[0]){
      $("#canvas-preview").css({"height": "auto"});
  } else {
      $("#canvas-preview").css({"height": windowHeight + "px"});
  }
}

var checkLocatonDateFields = function(proceed) {
  if ($('#itemConfiguratorForm\\:location').val() == '') {
    $('#error-location').show();
    smoothScrollTo($('#error-location'));
    return false; // Prevent proceeding
  } else if ($('#dateValidation').is(":visible")) {
    smoothScrollTo($('#dateValidation'));
    return false; // Prevent proceeding
  } else {
    $('#error-location').hide();
    $('#dateValidation').hide();
    if (proceed) {
      showToast('Uppdaterar vy...');
      block($('body'));
    }
    return true; // Allow proceeding
  }
}

window.block = function($el) {
  var i = 0;
  window.blockIntervals = [];
  $el.each(function() {
    var $this = $(this);
  var $blocker = $('<div class="blocker"></div>');
    var top = $this.position().top;
    var left = $this.position().left;
    var height = $this.outerHeight();
    var width = $this.outerWidth();
    $blocker
      .css('left', left + 'px')
      .css('top', top + 'px')
      .css('height', height + 'px')
      .css('width', width + 'px');
    $this.before($blocker);
    window.blockIntervals[i] = setInterval(function() {
      height = $this.outerHeight();
      width = $this.outerWidth();
      $blocker
        .css('height', height + 'px')
        .css('width', width + 'px');
    }, 16);

    i++;
  });

};

window.unblock = function($el) {
  window.blockIntervals = window.blockIntervals || [];
  $.each(window.blockIntervals, function(key) {
    clearInterval(window.blockIntervals[key]);
  });
  window.blockIntervals = [];
  $el.each(function() {
    var $this = $(this);
    $this.prev('.blocker').remove();
  });
};


// Google Maps API for location
function initAutocomplete() {

  autocomplete = new google.maps.places.Autocomplete((document.getElementById(
    'itemConfiguratorForm:location')), {
    types: ['geocode'],
    selectFirst: true
  });
  //setFields - to limit the data fetched by the API
  autocomplete.setFields(['address_components', 'adr_address',
    'formatted_address',
    'geometry',
    'name', 'place_id'
  ]);
  autocomplete.addListener('place_changed', fillInAddress);

  previewConfig.buildPreview();

}

function fillInAddress() {
  var place = this.getPlace();

  var componentForm = {
    /* CITY */
    locality: ['long_name', 'itemConfiguratorForm:location'],
  };

  /* Continue only if match presents */
  if (!place.address_components) return;

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];

    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType][0]];
      if (!!document.getElementById(componentForm[addressType][1])) {
        document.getElementById(componentForm[addressType][1]).value = val;
      }

    } // end if
  } // end for

  document.getElementById('itemConfiguratorForm:latitude').value = place.geometry
    .location.lat();
  document.getElementById('itemConfiguratorForm:longitude').value = place.geometry
    .location.lng();


  previewConfig.buildPreview();
}

initAutocomplete();

function AdjusteScroll() {
  $('#preview-wrapper').followTo('#stoppreview');
}

function starmapLoader() {
  showToast('Vänta! Uppdaterar urvalet...');
  $('.toast-message').css({'opacity' : '1', 'transform' : 'none'});
}

function starmapUnLoader() {
  $('.toast-message').css('opacity', '0');
  hideToast(300);
}

// TEXT (Text hinzufügen) AREA LIMITING //
function limitTextarea(textarea, maxLines, maxChar) {
  var lines = textarea.value.replace(/\r/g, '').split('\n'),
    lines_removed, char_removed, i;

  if (maxLines && lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines_removed = 1
  }
  if (maxChar) {
    i = lines.length;
    while (i-- > 0)
      if (lines[i].length > maxChar) {
        //lines[i] = lines[i].slice(0, maxChar);
        char_removed = 1
      }
    if (lines_removed) {
      textarea.value = lines.join('\n')
    }

    if (char_removed) {
      $(".-attention.-text").show();
    } else {
      $(".-attention.-text").hide();
    }
  }
  $(".textLines").empty();
  $(".textLines").append(lines.length);
}

// On Enter keypress choose first option from dropdown
$("#itemConfiguratorForm\\:location").on('focusin', function() {
  $(document).keypress(function(e) {
    if (e.which == 13) {
      updateMap();
    }
  });
});

$(".phone #itemConfiguratorForm\\:location").on('focusout', function() {
  updateMap();
});

function updateMap() {
  var firstResult = $(".pac-container .pac-item:first").text();

  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    "address": firstResult
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var lat = results[0].geometry.location.lat(),
        lng = results[0].geometry.location.lng(),
        placeName = results[0].address_components[0].long_name,
        latlng = new google.maps.LatLng(lat, lng);

      $("#itemConfiguratorForm\\:location").val(placeName);
      $('.loader').show();
      document.getElementById('itemConfiguratorForm:latitude').value =
        lat;
      document.getElementById('itemConfiguratorForm:longitude')
        .value = lng;
      previewConfig.buildPreview();
    }
  });
}

$.fn.followTo = function (elem) {
  if (document.body.parentElement.classList.contains('desktop')) {
    var $this = this, $window = $(windw), $bumper = $(elem), bumperPos = $bumper.offset().top, thisHeight = $this.outerHeight(), notificationHeight = 0, $shift = 0, navbarHeight = 0;
    var startingPos = $('.formats').offset().top - $shift - notificationHeight;

    //for mobile configurator ITPT-791
    if (navbarHeight == null ){
      navbarHeight = $('.top-header-bar').outerHeight();
    }

    setPosition = function(offset) {
      if ($window.scrollTop() > (bumperPos - thisHeight - $shift - notificationHeight)) {
        $this.removeClass('fixed');
        $this.addClass('absolute');
        $this.css({ top: (bumperPos - thisHeight - startingPos - $shift - notificationHeight) });
      } else {
        $this.removeClass('absolute');
        // start from formats position
        if ($window.scrollTop() > startingPos) {
          $this.addClass('fixed');
          $this.css({ top: 0 + notificationHeight + navbarHeight +'px' });
        } else {
          $this.removeClass('fixed');
          $this.removeAttr('style');
        }
      }
    };

    $window.resize(function(){
      bumperPos = $bumper.offset().top;
      thisHeight = $this.outerHeight();
      setPosition();
    });

    $window.scroll(setPosition);
    setPosition();
  }
};

$(window).scroll(function() {
  if (document.body.parentElement.classList.contains('desktop')) {
    AdjusteScroll();
  }
});

$(document).ready(resize);
$(window).on("load resize", resize);

$(function() {
  // Date Picker Settings
  $('#itemConfiguratorForm\\:datetimeInput').datepicker({
    dateFormat: 'yy-mm-dd',
    navigator: true,
    changeDate: true,
    changeMonth: true,
    showOn: false, // call manually
    changeYear: true,
    yearRange: '1900:2100',
    locale: 'sv'
  }).inputmask('9999-99-99');

  // Date Picker Validation
  $("#itemConfiguratorForm\\:datetimeInput").change(function() {
    var inputParts = $(this).val().replace(/\-/g, '-').split('-');
    var day = parseInt(inputParts[2]), month = parseInt(inputParts[1]) - 1, year = parseInt(inputParts[0]);
    var parsedDate = new Date(year, month, day);
    var isValidDate = parsedDate && parsedDate.getFullYear() === year && parsedDate.getMonth() === month && parsedDate.getDate() === day;

    if (!isValidDate) {
        $(this).addClass('invalid-date').focus();
        $('#dateValidation').show(200);
    } else {
        $(this).removeClass('invalid-date');
        $('#dateValidation').hide(200);
        previewConfig.buildPreview();
    }
  });

  previewConfig.buildPreview();


  // datapicker localization
  $.datepicker.regional.sv = {
    prevText: '&#xAB;Förra',
    nextText: 'Nästa&#xBB;',
    currentText: 'Idag',
    monthNames: ['Januari', 'Februari', 'Mars', 'April', 'Maj',
      'Juni',
      'Juli', 'Augusti', 'September', 'Oktober', 'November',
      'December'
    ],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun',
      'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'
    ],
    dayNamesShort: ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'],
    dayNames: ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag',
      'Fredag', 'Lördag'
    ],
    dayNamesMin: ['Sö', 'Må', 'Ti', 'On', 'To', 'Fr', 'Lö'],
    weekHeader: 'Ve',
    dateFormat: "yy-mm-dd",
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: true,
    yearSuffix: ""
  };

  $.datepicker.setDefaults($.datepicker.regional.sv);

});
