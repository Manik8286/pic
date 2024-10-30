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
  var defaultPreview = 350,
    defaultHeight = 350;
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
    premiumBlanket: 47,
    premiumBlanketPlus: 58,
    wallTap: 53,
    canvasPlus: 54,
    mousepad: 16,
    faceMask: 101,
    towel: 60
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
  FrameLoaded = false;
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
      } else if (material == materials.premiumBlanket) {
        preview = new BlanketPremiumPreview(item);
      } else if (material == materials.faceMask) {
        preview = new faceMaskPreview(item)
      } else if (material == materials.towel) {
        preview = new TowelPreview(item);
      } else {
        console.warn(material);
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

  function TshirtPreview(item) {
    BorderedAsyncPreview.call(this, item);
  }
  TshirtPreview.prototype = Object.create(BorderedAsyncPreview.prototype);
  TshirtPreview.prototype.constructor = TshirtPreview;

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

  function TowelPreview(item) {
    Preview.call(this, item);
  }
  TowelPreview.prototype = Object.create(Preview.prototype);
  TowelPreview.prototype.constructor = TowelPreview;

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

  function faceMaskPreview(item) {
    BorderedAsyncPreview.call(this, item);
  }
  faceMaskPreview.prototype = Object.create(BorderedAsyncPreview.prototype);
  faceMaskPreview.prototype.constructor = faceMaskPreview;

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
      fbCanvas = new fabric.Canvas('myCanvas', {
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

  StandardCushionPreview.prototype.buildPreview = function() {
    Preview.prototype.buildPreview.call(this);
  };

  TowelPreview.prototype.setupCanvas = function() {
    voidColor = "#ffffff";
    this.border = 0; // px
    if (this.formatWidth > this.formatHeight) {
      this.printWidth = defaultPreview - 2 * this.border;
      this.printHeight = this.formatHeight / this.formatWidth * this.printWidth;
      this.towelMapImage = "/staticimages/mask/configurator-towel-" + this.formatWidth + "x" + this.formatHeight + ".png";
    } else {
      this.printHeight = defaultPreview - 2 * this.border;
      this.printWidth = this.formatWidth / this.formatHeight * this.printHeight;
      this.towelMapImage = "/staticimages/mask/configurator-towel-" + this.formatWidth + "x" + this.formatHeight + "-vertical.png";
    }

    this.canvasWidth = this.printWidth + 2 * this.border;
    this.canvasHeight = this.printHeight + 2 * this.border;
    this.lineWidth = this.printWidth;
    this.lineHeight = this.printHeight;
  }

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

  faceMaskPreview.prototype.buildPreview = function() {
    this.trim = parseInt(8);
    Preview.prototype.buildPreview.call(this);
  };

  // -----------------------------------------------------------------------------------
  // buildCanvas
  Preview.prototype.buildCanvas = function() {
    preview.setupCanvas();
    if (this.frame >= dekoFramesFix && this.material != materials.pass &&
      this.material != materials.canvas) {
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
    this.canvasWidth = this.printWidth;
    this.canvasHeight = this.printHeight;
    this.lineWidth = this.canvasWidth - 2 * this.border;
    this.lineHeight = this.canvasHeight - 2 * this.border;
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
  }

  CanvasFoldedPreview.prototype.setupCanvas = function() {
    CanvasPreview.prototype.setupCanvas.call(this);
    this.printWidth = this.canvasWidth;
    this.printHeight = this.canvasHeight;
  }

  BlanketPremiumPreview.prototype.setupCanvas = function() {
    voidColor = "#ffffff";
    this.border = 0; // px
    if (this.formatWidth > this.formatHeight) {
      this.printWidth = defaultPreview - 2 * this.border;
      this.printHeight = this.formatHeight / this.formatWidth * this.printWidth;
    } else {
      this.printHeight = defaultPreview - 2 * this.border;
      this.printWidth = this.formatWidth / this.formatHeight * this.printHeight;
    }

    this.blanketMapImage = "/staticimages/mask/blanket-" + this.formatWidth + "x" + this.formatHeight + ".png";
    this.canvasWidth = this.printWidth + 2 * this.border;
    this.canvasHeight = this.printHeight + 2 * this.border;
    this.lineWidth = this.printWidth;
    this.lineHeight = this.printHeight;
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

  StandardCushionPreview.prototype.setupCanvas = function() {
    this.originalWidth = this.formatWidth | 0;
    this.originalHeight = this.formatHeight | 0;
    this.formatWidth = this.formatWidth + this.trim;
    this.formatHeight = this.formatHeight + this.trim;
    if (this.originalWidth == 365 && this.originalHeight == 365) {
      this.printWidth = 333;
      this.printHeight = 333;
    }
    this.border = (this.originalWidth - this.printWidth) / 2;
    if (this.formatWidth > this.formatHeight) {
      this.printWidth = defaultPreview - 2 * this.border;
      this.printHeight = this.formatHeight / this.formatWidth * this.printWidth;
    } else {
      this.printHeight = defaultPreview - 2 * this.border;
      this.printWidth = this.formatWidth / this.formatHeight * this.printHeight;
    }
    this.canvasWidth = this.printWidth + 2 * this.border;
    this.canvasHeight = this.printHeight + 2 * this.border;
    this.lineWidth = this.printWidth;
    this.lineHeight = this.printHeight;
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

  faceMaskPreview.prototype.setupCanvas = function() {
    this.originalWidth = this.formatWidth | 0;
    this.originalHeight = this.formatHeight | 0;
    this.formatWidth = this.formatWidth + this.trim;
    this.formatHeight = this.formatHeight + this.trim;
    this.printWidth = 354;
    this.printHeight = 285;
    this.canvasWidth = 450;
    this.canvasHeight = 285;
    this.faceMaskSrc =
      "/assets/img/checkout/facemask/configurator-mask-premium-guidelines.png";
    this.lineWidth = numberZero;
    this.lineHeight = numberZero;
    this.leftBorder = (this.canvasWidth - this.printWidth) / 2;
    this.topBorder = (this.canvasHeight - this.printHeight) / 2;
    this.rightBorder = this.leftBorder;
    this.bottomBorder = this.topBorder;
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

    if (this.canvasWidth > this.canvasHeight) {
      this.leftBorder = (this.canvasWidth - this.textPrintWidth) / 2;
      this.topBorder = (this.canvasHeight - this.textPrintHeight) / 2;
    } else {
      this.leftBorder = (this.canvasWidth - this.textPrintWidth) / 2;
      this.topBorder = (this.canvasHeight - this.textPrintHeight) / 2;
    }

    this.rightBorder = this.leftBorder;
    this.bottomBorder = this.topBorder;
  }

  TowelPreview.prototype.setupImage = function(ox, oy) {
    new fabric.Image.fromURL(this.towelMapImage, function(img) {
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
      id: "towelMapImage",
      selectable: false,
      evented: false
    });
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
    fbCanvas.setHeight(this.canvasHeight);
    fbCanvas.setWidth(this.canvasWidth);
    fbCanvas.on("object:moving", function(e) {
      var activeObject = e.target;
      if (activeObject && activeObject.id === bgId) {
        preview.callMove();
        if ($('.previewDemo').length)
          $('.previewDemo').removeClass('active');
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

  StandardCushionPreview.prototype.setupImage = function(ox, oy) {
    Preview.prototype.setupImage.call(this, offX - this.leftBorder, offY -
      this.topBorder);
  }

  BlanketPremiumPreview.prototype.setupImage = function(ox, oy) {
    new fabric.Image.fromURL(this.blanketMapImage, function(img) {
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
      id: "blanketMapImage",
      selectable: false,
      evented: false
    });
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

  faceMaskPreview.prototype.setupImage = function(ox, oy) {
    var left = this.leftBorder-ox;
    new fabric.Image.fromURL(this.faceMaskSrc, function(img) {
      img.left = numberZero;
      img.top = numberZero;
      img.width = fbCanvas.width;
      img.height = fbCanvas.height;
      img.XZIndex = numberZero;
      fbCanvas.add(img);

      bgImage = new fabric.Image(linkImage, {
        scaleX: preview.sizeFactor,
        scaleY: preview.sizeFactor,
        left: left,
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
      fbCanvas.renderAll();
      MakeMobileReadOnly();
    }, {
      hasControls: false,
      hasBorders: false,
      id: "faceMaskMapImage",
      selectable: false,
      evented: false
    });
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

    makePassShadowPart(0, 0, passLeft, this.canvasHeight, fbCanvas);
    makePassShadowPart(0, 0, this.canvasWidth, passTop, fbCanvas);
    makePassShadowPart((this.canvasWidth - passLeft), 0, passLeft, this.canvasHeight, fbCanvas);
    makePassShadowPart(0, (this.canvasHeight - passTop), this.canvasWidth, passTop, fbCanvas);

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

    if (c0 == null) {
      c0 = document.createElement("canvas");
    } else {
      c0.getContext("2d").clearRect(numberZero, numberZero, c0.width, c0.height);
    }
    var ctx = c0.getContext("2d");
    c0.width = Math.ceil(this.printWidth);
    c0.height = Math.ceil(this.printHeight);
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

    var sourceX = destW - 1.6;
    var sourceY = numberZero;
    var sourceWidth = 0.6;
    var sourceHeight = destH;
    if (destW > c.width)
      sourceX = c.width - 1.6;
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

    faceMaskPreview.prototype.setupBorder = function() {
    }

    sourceX = numberZero;
    sourceY = numberZero;
    sourceWidth = destW;
    sourceHeight = 0.6;
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
    sourceWidth = 0.6;
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
    sourceY = destH - 1.6;
    sourceWidth = destW;
    sourceHeight = 0.6;
    if (sourceWidth > c.width)
      sourceWidth = c.width;
    if (destH > c.height)
      sourceY = c.height - 1.6;
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
    c2.getContext("2d").clearRect(0, 0, c2.width, c2.height);
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
  }

  // ---------------------------------------------------------------------------------
  // loadCutoutParams
  Preview.prototype.loadCutoutParams = function() {

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

    bgImage.setLeft(Math.max(Math.min(left, leftBound), (rightBound) -
      bgImage.getWidth()));
    bgImage.setTop(Math.max(Math.min(top, topBound), (bottomBound) -
      bgImage.getHeight()));
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

    offX = parseInt(-1) * (bgImage.getLeft() - this.border);
    offY = parseInt(-1) * (bgImage.getTop() - this.border);

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

    var shiftSize = 1;
    var shiftPos = 1;

    var hasControls = hasBorders = selectable = evented = false;

    var Overlap_Gap = (preview.frame > dekoFramesFix ? GapDeko : GapPremium);
    var Frametype = (preview.frame > dekoFramesFix ? "Decor" : "Premium");

    var side = PartName.toLowerCase().replace("border", "");

    var FrameMainFile = "/staticimages/configurator/mf/" + (RetinaDisplay ?
      'x2/' : '') + "frame_" + (Frametype == "Decor" ? decoFrames[('f' +
      preview.frame)] : premiumFrames[('f' + preview.frame)]);

    var BorderFrame = FrameMainFile + ".jpg";
    var OverlapFrame = FrameMainFile + "_back.jpg";

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


          /*********************************************************/
          /******* GRADIENT TO CREATE ROUNDED FRAME EFFECT *********/
          /*********************************************************/

          /*
          var gradient = ctx.createLinearGradient(0,0,0,pol.height);
          gradient.addColorStop(0,"rgba(255,255,255,0.1)");
          gradient.addColorStop(0.05,"rgba(0,0,0,0.05)");
          gradient.addColorStop(0.5,"rgba(0,0,0,0.1)");
          gradient.addColorStop(0.95,"rgba(0,0,0,0.05)");
          gradient.addColorStop(1,"rgba(255,255,255,0.1)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0,0,pol.width,pol.height);
          */

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

    ShadowColor = (Frametype == "Decor" ? "rgba(0,0,0,0.6)" :
      "rgba(0,0,0,0.6)");
    ShadowBlur = (w > h ? h : w) / (Frametype == "Decor" || Frametype == "Premium" ? 4 : 6);
    ShadowOffsetY = 0;
    ShadowOffsetX = 0;
    ShadowPercent = (Frametype == "Decor" ? 0.05 : 0.2);
    ShadowOffset = (Frametype == "Decor" ? 20 : 20);

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

    rect.XZIndex = (Frametype == "Passepartout" ? 1 : 3);
    canvas.insertAt(rect, rect.XZIndex);

    if (Frametype != "Passepartout") {
      makeBorderPartSub(l, t, w, h, colorFrames[('f' + preview.frame)], canvas, 7, "HideColorRectShadow");
    }
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

  function makePassShadowPart(l, t, w, h, canvas) {

    var Overlap_Gap = 0.8;
    var WDif = Math.ceil(w * Overlap_Gap) - w;
    var HDif = Math.ceil(h * Overlap_Gap) - h;
    var Frametype = "Passepartout";

    if (w > h) { //top & bottom
      makeShadowPart(l - (l > 0 ? WDif : 0), t - (t > 0 ? HDif : 0), w * (Overlap_Gap < 1 ? 1 : Overlap_Gap), h * Overlap_Gap, canvas, Overlap_Gap, Frametype);
    } else { // left & right
      makeShadowPart(l - (l > 0 ? WDif : 0), t - (t > 0 ? HDif : 0), w * Overlap_Gap, h * (Overlap_Gap < 1 ? 1 : Overlap_Gap), canvas, Overlap_Gap, Frametype);
    }
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

    rect.XZIndex = (preview.material == materials.pass ? 2 : numberZero);
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
    } else if (material == materials.blanket || material == materials.wallTap) {
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

    // Check if Gap is needed
    if (Overlap_Gap < 1) {

      var subBorderIndex = "1";
      var subBorderColor = "rgba(0,0,0,1)";

      //    makeBorderPartSub(0, 0, canvaW, border, subBorderColor, fbCanvas, subBorderIndex, "HideColorRectFlat"); // TOP
      //    makeBorderPartSub(0, canvaH - border, canvaW, border, subBorderColor, fbCanvas, subBorderIndex, "HideColorRectFlat"); // BOTTOM
      //    makeBorderPartSub(0, 0, border, canvaH, subBorderColor, fbCanvas, subBorderIndex, "HideColorRectFlat"); // LEFT
      //    makeBorderPartSub(canvaW - border, 0, border, canvaH, subBorderColor, fbCanvas, subBorderIndex, "HideColorRectFlat"); // RIGHT
    }

    makeFrameBorderOver(canvaW, canvaH, border, fbCanvas, color, cutout)
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
    for (m = 0; m < fbCanvas.getObjects().length; m++) {
      ImageObj = fbCanvas.getObjects()[m];
      if (ImageObj.type === "image" && ImageObj.id === bgId) {
        fbCanvas.allowTouchScrolling = true;
        ImageObj.selectable = (EditMode && preview.movable);
      }
    }
  }
}
