//= include vendor/jquery.inputmask.bundle.js
//= include vendor/jquery.validate.js

function passFunction() {
  $(".-passwordVerify").hide();
  $('#addressesForm\\:invoicepasswordSe').on('keyup', ValidatePassword);
  $('#addressesForm\\:invoicepasswordSe').focus(function () {
    $(".-passwordVerify").show();
  });
  $('#addressesForm\\:invoicepasswordSe').focusout(function () {
    $(".-passwordVerify").hide();
  });
}

jQuery.validator.addMethod("passwordCheck", function (value, element, params) {
  var pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/;
  var matcher = new RegExp(pattern);
  return matcher.test(value) || !$(element).is(":visible");
});


var validator = $('#addressesForm').validate({
  ignore: [],
  rules: {
    'addressesForm\:invoicepasswordSe': {
      required: "#addressesForm\\:invoicecreateAccount:checked",
      normalizer: function(value) {
        return $.trim(value);
      },
      passwordCheck: true
    },
    'addressesForm\:invoicerepeatedPasswordSe': {
      required: "#addressesForm\\:invoicecreateAccount:checked",
      normalizer: function(value) {
        return $.trim(value);
      },
      equalTo: "#addressesForm\\:invoicepasswordSe"
    }
  },
  messages: {
    'addressesForm\:invoicepasswordSe': {
      required: "Krävs",
      passwordCheck: "Lösenordet är inte tillräckligt starkt.",
    },
    'addressesForm\:invoicerepeatedPasswordSe': {
      required: "Krävs",
      equalTo: "Lösenorden stämmer inte överens.</strong>",
    }
  },
  errorPlacement: function(error, element) {
    error.appendTo( element.parent("div"));
  },
  highlight: function( element, errorClass, validClass ) {
    if (element.classList.contains('inputValidator')) {
      if (element.type === "radio") {
        this.findByName(element.name).addClass(errorClass).removeClass(validClass);
      } else if (element.parentElement.classList.contains('form-dropdown')) {
        $(element).next().addClass("error-soft").removeClass( validClass );
        $(element).parent().next().remove();
        $( "<div class='errorCheck'></div>" ).insertAfter(element.parentElement);
      } else {
        $( element ).addClass( errorClass ).removeClass( validClass );
        $(element).next().remove();
        $( "<div class='errorCheck'></div>" ).insertAfter(element);
      }
    }
  },
  unhighlight: function( element, errorClass, validClass ) {
    if (element.classList.contains('inputValidator')) {
      if (element.type === "radio") {
        this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
      } else if (element.parentElement.classList.contains('form-dropdown')) {
        $(element).next().removeClass("error-soft").addClass( validClass );
        $(element).parent().next().remove();
        $( "<div class='validCheck'></div>" ).insertAfter(element.parentElement);
      } else {
        $( element ).removeClass( errorClass ).addClass( validClass );
        $(element).next().remove();
        $( "<div class='validCheck'></div>" ).insertAfter(element);
      }
      if (element.value === '') {
        $(element).next().remove();
      }

      if (element.value.indexOf('packstation') > -1 ||
        element.value.indexOf('pack station') > -1 ||
        element.value.indexOf('pack-station') > -1 ||
        element.value.indexOf('pakstation') > -1 ||
        element.value.indexOf('pacstation') > -1 ||
        element.value.indexOf('pac station') > -1 ||
        element.value.indexOf('pak station') > -1 ||
        element.value.indexOf('Packstation') > -1 ||
        element.value.indexOf('Pack station') > -1 ||
        element.value.indexOf('Pack Station') > -1 ||
        element.value.indexOf('Pack-Station') > -1 ||
        element.value.indexOf('Pakstation') > -1 ||
        element.value.indexOf('Pacstation') > -1 ||
        element.value.indexOf('Pak station') > -1 ||
        element.value.indexOf('Pac station') > -1) {
        $(element).next().remove();
        $( "<div class='errorCheck'></div>" ).insertAfter(element);
      }
    }
  }
});

var validPass = false;

function ValidatePassword() {
  var rules = [{
    Pattern: "[A-Z]",
    Target: "UpperCase"
  },
  {
    Pattern: "[a-z]",
    Target: "LowerCase"
  },
  {
    Pattern: "[0-9]",
    Target: "Numbers"
  }
  ];

  var password = $('#addressesForm\\:invoicepasswordSe').val();

  $(".-passwordVerify li:first").addClass(password.length > 7 ? "-correct" : "");
  $(".-passwordVerify li:first").removeClass(password.length > 7 ? "" : "-correct");
  $(".-passwordVerify li:nth-child(2)").addClass(new RegExp(rules[0].Pattern).test(password) && new RegExp(rules[1].Pattern).test(password) ? "-correct" : "");
  $(".-passwordVerify li:nth-child(2)").removeClass(new RegExp(rules[0].Pattern).test(password) && new RegExp(rules[1].Pattern).test(password) ? "" : "-correct");
  $(".-passwordVerify li:nth-child(3)").addClass(new RegExp(rules[2].Pattern).test(password) ? "-correct" : "");
  $(".-passwordVerify li:nth-child(3)").removeClass(new RegExp(rules[2].Pattern).test(password) ? "" : "-correct");

  if (password.length > 7 && new RegExp(rules[0].Pattern).test(password) && new RegExp(rules[1].Pattern).test(password) && new RegExp(rules[2].Pattern).test(password)) {
    $(".-passwordVerify").hide();
    validPass = true;
  } else if ((!password.length > 7) || (new RegExp(rules[0].Pattern).test(password) === false) || (new RegExp(rules[1].Pattern).test(password) === false) || (new RegExp(rules[2].Pattern).test(password) === false)) {
    if (password.length > 0) {
      $(".-passwordVerify").show();
      validPass = false;
    } else {
      $(".-passwordVerify").hide();
      validPass = true;
    }

  }
}



$(document).ready(function() {
  passFunction();
  if ($('.outmsg > .-error:contains("Lösenorden stämmer inte överens.")').length > 0) {
    $('.outmsg > .-error').hide();
    $('#addressesForm\\:invoicerepeatedPasswordSe').addClass('-invalid');
    $('.-repeatPass').append('<span class="validation -error -bottom">Lösenorden stämmer inte överens.</span>');
  }
  if ($('.-pass > .validation:contains("Password not strong enough")').length < 1 && $('.-repeatPass > .validation:contains("Lösenordet är inte tillräckligt starkt.")').length > 0) {
    $('.-repeatPass > .validation').hide();
    $('.-repeatPass').append('<span class="validation -error -bottom">Lösenorden stämmer inte överens.</span>');
  }

  $('.showLogin:checked').closest('.group').siblings('.showLoginBlock').removeClass('hidden');


  // Init
  // Gender text change
  $('.gender .choices li').eq(0).text('bitte wählen');
  // shows company field if checkbox is checked
  $('.showCompany:checked').closest('.group').siblings('.showCompanyBlock').removeClass('hidden');

  // init changeCountyOrder
  // 

  // Event listeners
  // checkbox for company
  $( "body" ).on( "click", ".showCompany", function() {
    var target = $(this).closest('.group').siblings('.showCompanyBlock');
    if ($(this).is(':checked')) {
      target.removeClass('hidden')
    } else {
      target.addClass('hidden')
    }
  });

  // mask for birthday
  if($('.birthdayMask').length){
    $('.birthdayMask').inputmask("dd.mm.yyyy", { "placeholder": "tt.mm.jjjj", "clearIncomplete": true});
  }

  // inits radion buttons
  selectRadio();

  // removes error after gender is clicked
  $('body').on('change', '#addressesForm\\:invoiceGender, #addressesForm\\:shippingGender', function(){
    $(this).removeClass('error').next('label').remove();
  });

  // removes error after company is clicked
  $('body').on('change', '#invoiceshowCompany, #shippingshowCompany', function(){
    $(this).closest('.gender').next('.showCompanyBlock').find('input').removeClass('error').next('label').remove();
  });

  // simulate radio button click
  $('body').on('click', '.js-address-switch', function(){
    triggerDifferntAddress();
  });


});

  // helper function for validator
  function stripHtml(value) {
    // remove html tags and space chars
    return value.replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ')
    // remove punctuation
    .replace(/[.(),;:!?%#$'"_+=\/\-]*/g,'');
  }

  // checks if there are 3 characters (non-space) and 1 digit
  jQuery.validator.addMethod("addresschecker", function(value, element, params) {
    return this.optional(element) || /[a-z]{3,}/i.test(value) && /\d/i.test(value);
  }, "Bitte gib eine vollständige Adresse mit Straße und Hausnummer an.");

  // checks zip and shows custom msg
  jQuery.validator.addMethod("zipCheck", function(value, element, params) {
    var matcher = new RegExp("^\\d{" + params[$(params.select).val()].min + ",}$");

  if ($(params.select).val() == 4) {
      // Niederlande address check Format: • 1234 • 1234AB • 1234 AB
      return this.optional(element) ||  /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{0,2}$/i.test(value);  
    } else if ($(params.select).val() == 5) {
      // Luxembourg address Format: • 1234 • L-1234 • L 1234 • L1234 
      return this.optional(element) ||  /^((L|\s*)\s*(-|—|–|\s?|\s*))\s*?[\d]{4}$/i.test(value);   
    } else {
      return this.optional(element) ||  matcher.test(value) && value.length <= params[$(params.select).val()].max; 
    }
    
  }, function(params, element) {
    return params[$(params.select).val()].msg;
  });



var validator = $('#addressesForm').validate({
  ignore: [],
  rules: {
    'addressesForm\:invoiceGender': {
      required: true
    },
    'addressesForm\:invoiceStreet': {
      required: true,
      maxlength: 30,
      addresschecker: true
    },
    'addressesForm\:invoiceForename': {
      required: true          
    },
    'addressesForm\:invoiceSurname': {
      required: true
    },
    'addressesForm\:invoiceEmail': {
      required: true,
      email: true
    },
    'addressesForm\:invoiceZipCode': {
      required: true,
      zipCheck: {
        1: {
          msg: "<strong>Ungültige Postleitzahl (Deutschland)</strong>",
          min: 5,
          max: 5
        },
        2: {
          msg: "<strong>Ungültige Postleitzahl (Schweiz)</strong>",
          min: 4,
          max: 4
        },
        3: {
          msg: "<strong>Ungültige Postleitzahl (Österreich)</strong>",
          min: 4,
          max: 4
        },
        4: {
          msg: "<strong>Ungültige Postleitzahl (Niederlande)</strong>",
          min: 4,
          max: 4
        },
        5: {
          msg: "<strong>Ungültige Postleitzahl (Luxemburg)</strong>",
          min: 4,
          max: 6
        },
        6: {
          msg: "<strong>Ungültige Postleitzahl (Belgien)</strong>",
          min: 4,
          max: 4
        },
        7: {
          msg: "<strong>Ungültige Postleitzahl (Frankreich)</strong>",
          min: 5,
          max: 5
        },
        8 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        9 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        11 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        12 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        13 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        14 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        15 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        16 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        25 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        27 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        29 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        36 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        37 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        38 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        40 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        45 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        48 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        49 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        55 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        57 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        69 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        70 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        71 : {
          msg: "<strong>Ungültige Postleitzahl</strong>",
          min: 1,
          max: 10
        },
        select: '#addressesForm\\:invoiceCountry'
      }
    },
    'addressesForm\:invoiceCity': {
      required: true
    },
    'addressesForm\:shippingGender': {
      required: true
    },
    'addressesForm\:shippingStreet': {
      required: true,
      maxlength: 30,
      addresschecker: true
    },
    'addressesForm\:shippingForename': {
      required: true
    },
    'addressesForm\:shippingSurname': {
      required: true
    },
    'addressesForm\:shippingEmail': {
      required: true,
      email: true
    },

    'addressesForm\:shippingZipCode': {
      required: true,
    },
    'addressesForm\:shippingCity': {
      required: true
    }
  },
  messages: {
    'addressesForm\:invoiceGender': "<span class='validation -error -bottom'>Krävs</span>",
    'addressesForm\:invoiceForename': "<span class='validation -error -bottom'>Krävs</span>",
    'addressesForm\:invoiceSurname': "<span class='validation -error -bottom'>Krävs</span>",
    'addressesForm\:invoiceEmail': "<span class='validation -error -bottom'>Krävs</span>",
    'addressesForm\:invoiceEmailConfirmation': "<span class='validation -error -bottom'>Krävs</span>",
    'addressesForm\:invoiceStreet': {
      required: "<span class='validation -error -bottom'>Krävs</span>",
      minlength: "",
      maxlength: "<span class='validation -error -bottom'>Ange maximalt 30 tecken.</span>"
    },
    'addressesForm\:invoiceZipCode': {
      required: "<span class='validation -error -bottom'>Krävs</span>"
    },
    'addressesForm\:invoiceCity': "<span class='validation -error -bottom'>Krävs</span>",
    'addressesForm\:shippingGender': "<span class='validation -error -bottom'>Krävs</span>",
    'addressesForm\:shippingForename': "<span class='validation -error -bottom'>Krävs</span>",
    'addressesForm\:shippingSurname': "<span class='validation -error -bottom'>Krävs</span>",
    'addressesForm\:shippingEmail': "<span class='validation -error -bottom'>Krävs</span>",
    'addressesForm\:shippingEmailConfirmation': "<span class='validation -error -bottom'>Krävs</span>",
    'addressesForm\:shippingStreet': {
      required: "<span class='validation -error -bottom'>Krävs</span>",
      minlength: "",
      maxlength: "<span class='validation -error -bottom'>Ange maximalt 30 tecken.</span>"
    },
    'addressesForm\:shippingZipCode': {
      required: "<span class='validation -error -bottom'>Krävs</span>"
    },
    'addressesForm\:shippingCity': "<span class='validation -error -bottom'>Krävs</span>",
  }
});
  
// triggers primeface checkbox
function triggerDifferntAddress(){
  $('#addressesForm\\:differentshippingaddress_input').click();  
}

// simulates radio button effect
function selectRadio(){
  $('.js-address-switch').prev('input').removeAttr('checked');
  $('#addressesForm\\:shipping .-active input').attr('checked', 'checked');
}