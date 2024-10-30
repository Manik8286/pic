//= include vendor/jquery.inputmask.bundle.js
//= include vendor/jquery.validate.js

$(document).ready(function() {
  checkInputs();
  validateInputs();
});

// helper function for validator
function stripHtml(value) {
  // remove html tags and space chars
  return value.replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ')
    // remove punctuation
    .replace(/[.(),;:!?%#$'"_+=\/\-]*/g, '');
}

// checks if there are 2 characters (non-space) and 1 digit
$.validator.addMethod("addresschecker", function (value, element, params) {
  return this.optional(element) || /[a-z]{2,}/i.test(value) && /\d/i.test(value);
}, ": <strong>Ange en fullständig adress med gata och husnummer.</strong>");

// checks zip and shows custom msg
$.validator.addMethod("zipCheck", function (value, element, params) {
  var matcher = new RegExp("^\\d{" + params[$(params.select)[0].innerText].min + ",}$");

  if ($(params.select)[0].innerText == 4) {
    // Niederlande address check Format: • 1234 • 1234AB • 1234 AB
    return this.optional(element) || /^([0-9]{4} ?(?!sa|sd|ss)[a-zA-Z]{2})$|^([0-9]{4})$/i.test(value);
  } else if ($(params.select)[0].innerText == 5) {
    // Luxembourg address Format: • 1234 • L-1234 • L 1234 • L1234
    return this.optional(element) || /^((L|\s*)\s*(-|—|–|\s?|\s*))\s*?[\d]{4}$/i.test(value);
  } else if ($(params.select)[0].innerText == 14) {
    // Danmark address Format: NNNN
    return this.optional(element) || /^[0-9]{3,4}$/.test(value);
  } else if ($(params.select)[0].innerText == 15) {
    // Sweden address Format: NNNNN (NNN NN)
    return this.optional(element) || /^(s-|S-){0,1}[0-9]{3}\s?[0-9]{2}$/.test(value);
  } else if ($(params.select)[0].innerText == 19) {
    // Norway address Format: NNNN
    return this.optional(element) || /^\d{4}$/.test(value);
  } else if ($(params.select)[0].innerText == 12) {
    // Finland address Format: NNNNN
    return this.optional(element) || /^\d{5}$/.test(value);
  } else {
    return this.optional(element) || matcher.test(value) && value.length <= params[$(params.select)[0].innerText].max;
  }

}, function (params, element) {
  return params[$(params.select)[0].innerText].msg;
});


var validator = $('#addressForm').validate({
  ignore: [],
  rules: {
    'addressForm\:shippingStreet': {
      required: true,
      normalizer: function(value) {
        return $.trim(value);
      },
      addresschecker: true,
      maxlength: 30
    },
    'addressForm\:shippingZipCode': {
      required: true,
      normalizer: function(value) {
        return $.trim(value);
      },
      zipCheck: {
        1: {
          msg: "<strong>Felaktigt postnummer (Deutschland)</strong>",
          min: 5,
          max: 5
        },
        2: {
          msg: "<strong>Felaktigt postnummer (Schweiz)</strong>",
          min: 4,
          max: 4
        },
        3: {
          msg: "<strong>Felaktigt postnummer (Österreich)</strong>",
          min: 4,
          max: 4
        },
        4: {
          msg: "<strong>Felaktigt postnummer (Niederlande)</strong>",
          min: 4,
          max: 4
        },
        5: {
          msg: "<strong>Felaktigt postnummer (Luxemburg)</strong>",
          min: 4,
          max: 6
        },
        6: {
          msg: "<strong>Felaktigt postnummer (Belgien)</strong>",
          min: 4,
          max: 4
        },
        7: {
          msg: "<strong>Felaktigt postnummer (Frankreich)</strong>",
          min: 5,
          max: 5
        },
        8 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        9 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        11 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        12 : {
          msg: "<strong>Felaktigt postnummer (Finland)</strong>",
          min: 1,
          max: 10
        },
        13 : {
          msg: "<strong>Felaktigt postnummer (Portugal)</strong>",
          min: 1,
          max: 10
        },
        14 : {
          msg: "<strong>Felaktigt postnummer (Danmark)</strong>",
          min: 1,
          max: 4
        },
        15 : {
          msg: "<strong>Felaktigt postnummer (Sweden)</strong>",
          min: 1,
          max: 10
        },
        16 : {
          msg: "<strong>Felaktigt postnummer (Poland)</strong>",
          min: 1,
          max: 10
        },
        19 : {
          msg: "<strong>Felaktigt postnummer (Norway)</strong>",
          min: 1,
          max: 10
        },
        25 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        27 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        29 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        36 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        37 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        38 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        40 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        45 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        48 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        49 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        55 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        57 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        69 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        70 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        71 : {
          msg: "<strong>Felaktigt postnummer</strong>",
          min: 1,
          max: 10
        },
        select: '#addressForm\\:countryFieldId'
      },
    },
    'addressForm\:shippingCity': {
      required: true,
      normalizer: function(value) {
        return $.trim(value);
      },
      maxlength: 30
    },
  },
  messages: {
    'addressForm\:shippingStreet': {
      required: ": <strong>Krävs</strong>",
      maxlength: "Maximal 30 Zeichen.",
    },
    'addressForm\:shippingZipCode': {
      required: ": <strong>Krävs</strong>",
    },
    'addressForm\:shippingCity': {
      required: ": <strong>Krävs</strong>",
      maxlength: "Maximal 30 Zeichen.",
    }
  },
  errorPlacement: function (error, element) {
    error.appendTo(element.prev());
  },
  highlight: function (element, errorClass, validClass) {
    if (element.classList.contains('inputValidator')) {
      if (element.type === "radio") {
        this.findByName(element.name).addClass(errorClass).removeClass(validClass);
      } else if (element.parentElement.classList.contains('form-dropdown')) {
        $(element).next().addClass("error-soft").removeClass(validClass);
        $(element).parent().next().remove();
        $("<div class='errorCheck'></div>").insertAfter(element.parentElement);
      } else {
        $(element).addClass(errorClass).removeClass(validClass);
        $(element).next().remove();
        $("<div class='errorCheck'></div>").insertAfter(element);
      }
    }
  },
  unhighlight: function (element, errorClass, validClass) {
    if (element.classList.contains('inputValidator')) {
      if (element.type === "radio") {
        this.findByName(element.name).removeClass(errorClass).addClass(validClass);
      } else if (element.parentElement.classList.contains('form-dropdown')) {
        $(element).next().removeClass("error-soft").addClass(validClass);
        $(element).parent().next().remove();
        $("<div class='validCheck'></div>").insertAfter(element.parentElement);
      } else {
        $(element).removeClass(errorClass).addClass(validClass);
        $(element).next().remove();
        $("<div class='validCheck'></div>").insertAfter(element);
      }
      if (element.value === '') {
        $(element).next().remove();
      }

    }
  }
});

$('body').on('change', '.invoiceRegion, .shippingRegion', function () {
  $('#addressForm').validate().element(this);
});

function validateInputs() {
  $("#addressForm input[type=text], #addressForm input[type=tel]").each(function () {
    if (this.value) {
      $('#addressForm').validate().element(this);
    }
  });
}


function checkInputs() {
  // Allow to paste only numbers in tel input
  $("[type=tel]").each(function () {
    $(this).bind("paste", function (event) {
      if (event.originalEvent.clipboardData.getData('Text').match(/[^\d]/)) {
        event.preventDefault();
      }
    });
  });

  $("#addressForm\\:invoiceZipCode").on({
    keypress: function (e) {
      if (e.which === 32) {
        return false;
      }
      return true;
    },
    change: function () {
      this.value = this.value.replace(/\s/g, "");
    }
  });

  $("#addressForm\\:shippingZipCode").on({
    keypress: function (e) {
      if (e.which === 32) {
        return false;
      }
      return true;
    },
    change: function () {
      this.value = this.value.replace(/\s/g, "");
    }
  });

  $(".floating-label").each(function () {
    var errorSpan = $(this)
    if (errorSpan.find('.error').length) {
      $(this).removeClass('hidden');
    }
  });
}
