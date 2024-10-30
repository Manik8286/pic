//= include vendor/jquery.inputmask.bundle.js
//= include vendor/jquery.validate.js
$(document).ready(function() {
  var showCompanyBlock = '.showCompanyBlock';

  // Init
  // Gender text change
  $('.gender .choices li').eq(0).text('bitte wählen');
  // shows company field if checkbox is checked
  $('.showCompany:checked').closest('.group').siblings(showCompanyBlock).removeClass('hidden');

  // init changeCountyOrder
  //

  // Event listeners
  // checkbox for company
  $( "body" ).on( "click", ".showCompany", function() {
    var target = $(this).closest('.group').siblings(showCompanyBlock);
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
    $(this).closest('.gender').next(showCompanyBlock).find('input').removeClass('error').next('label').remove();
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

  // checks the address contain "Packstation"  or "pack station" (case insentive)
  jQuery.validator.addMethod("packstationchecker", function(value, element, params) {
    return this.optional(element) || (!(value.indexOf('packstation') > -1 ||
        value.indexOf('pack station') > -1 ||
        value.indexOf('pack-station') > -1 ||
        value.indexOf('pakstation') > -1 ||
        value.indexOf('pacstation') > -1 ||
        value.indexOf('pac station') > -1 ||
        value.indexOf('pak station') > -1 ||
        value.indexOf('Packstation') > -1 ||
        value.indexOf('Pack station') > -1 ||
        value.indexOf('Pack Station') > -1 ||
        value.indexOf('Pack-Station') > -1 ||
        value.indexOf('Pakstation') > -1 ||
        value.indexOf('Pacstation') > -1 ||
        value.indexOf('Pak station') > -1 ||
        value.indexOf('Pac station') > -1));
  }, "<strong>Vänligen välj alternativet packstation.</strong>");

  // checks the address contain "Packstation"  or "pack station" (case insentive)
  // jQuery.validator.addMethod("packstationchecker", function(value, element, params) {
  //   return this.optional(element) || (!(value.toLowerCase().indexOf('packstation') > -1 || value.toLowerCase().indexOf('pack station') > -1 || value.toLowerCase().indexOf('pack-station') > -1 || value.toLowerCase().indexOf('pakstation') > -1 || value.toLowerCase().indexOf('pacstation') > -1 || value.toLowerCase().indexOf('pak station') > -1 || value.indexOf('Packstation') > -1 || value.indexOf('Pack Station') > -1 || value.indexOf('Pakstation') > -1 || value.indexOf('Pacstation') > -1 || value.indexOf('Pak station') > -1 || value.indexOf('Pac station') > -1));
  // }, "DHL Packstation auswählen");

  // checks if there are 2 characters (non-space) and 1 digit
  jQuery.validator.addMethod("addresschecker", function(value, element, params) {

    return this.optional(element) || /[a-z]{2,}/i.test(value) && /\d/i.test(value);
  }, 'Ange en fullständig adress med gata och husnummer.');

  // checks zip and shows custom msg
  jQuery.validator.addMethod("zipCheck", function(value, element, params) {
    var matcher = new RegExp("^\\d{" + params[$(params.select).val()].min + ",}$");

    if ($(params.select).val() == 4) {
      // Niederlande address check Format: • 1234 • 1234AB • 1234 AB
      return this.optional(element) ||  /^([0-9]{4} ?(?!sa|sd|ss)[a-zA-Z]{2})$|^([0-9]{4})$/i.test(value);
    } else if ($(params.select).val() == 5) {
      // Luxembourg address Format: • 1234 • L-1234 • L 1234 • L1234
      return this.optional(element) ||  /^((L|\s*)\s*(-|—|–|\s?|\s*))\s*?[\d]{4}$/i.test(value);
    } else if ($(params.select).val() == 14) {
      // Danmark address Format: NNNN
      return this.optional( element ) || /^[0-9]{3,4}$/.test( value );
    } else if ($(params.select).val() == 15) {
      // Sweden address Format: NNNNN (NNN NN)
      return this.optional(element) || /^(s-|S-){0,1}[0-9]{3}\s?[0-9]{2}$/.test(value);
    } else if ($(params.select).val() == 19) {
      // Norway address Format: NNNN
      return this.optional(element) || /^\d{4}$/.test(value);
    } else if ($(params.select).val() == 12) {
      // Finland address Format: NNNNN
      return this.optional(element) || /^\d{5}$/.test(value);
    } else {
      return this.optional(element) ||  matcher.test(value) && value.length <= params[$(params.select).val()].max;
    }

  }, function(params, element) {
    return params[$(params.select).val()].msg;
  });

  jQuery.validator.addMethod("passwordCheck", function (value, element, params) {
    var pattern = /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/;
    var matcher = new RegExp(pattern);
    return matcher.test(value) || !$(element).is(":visible");
  });

var addressesForm = '#addressesForm';
var requiredMessage = 'Krävs.';

var validator = $(addressesForm).validate({
  ignore: [],
  rules: {
    'addressesForm\:invoiceGender': {
      required: true
    },
    'addressesForm\:invoiceStreet': {
      required: true,
      addresschecker: true,
      maxlength: 30
    },
    'addressesForm\:invoiceForename': {
      required: true,
      maxlength: 30
    },
    'addressesForm\:invoiceSurname': {
      required: true,
      maxlength: 30
    },
    'addressesForm\:invoiceEmail': {
      required: true,
      email: true
    },
    'addressesForm\:invoiceEmailConfirmation': {
      required: true,
      email: true
    },
    'addressesForm\:invoiceZipCode': {
      required: true,
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
        select: '#addressesForm\\:invoiceCountry'
      }
    },
    'addressesForm\:invoiceCity': {
      required: true,
      maxlength: 30
    },
    'addressesForm\:shippingGender': {
      required: true
    },
    'addressesForm\:shippingStreet': {
      required: true,
      addresschecker: true,
      packstationchecker: true,
      maxlength: 30
    },
    'addressesForm\:shippingForename': {
      required: true,
      packstationchecker: true,
      maxlength: 30
    },
    'addressesForm\:shippingSurname': {
      required: true,
      packstationchecker: true,
      maxlength: 30
    },
    'addressesForm\:shippingEmail': {
      required: true,
      email: true
    },
    'addressesForm\:shippingEmailConfirmation': {
      required: true,
      email: true
    },
    'addressesForm\:shippingZipCode': {
      required: true,
      packstationchecker: true,
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
        select: '#addressesForm\\:shippingCountry'
      }
    },
    'addressesForm\:shippingCity': {
      required: true,
      packstationchecker: true,
      maxlength: 30
    },
    'addressesForm\:invoicepasswordSe': {
      required: true,
      normalizer: function (value) {
        return $.trim(value);
      },
      passwordCheck: true,
    },
    'addressesForm\:invoicerepeatedPasswordSe': {
      required: true,
      normalizer: function (value) {
        return $.trim(value);
      },
      equalTo: "#addressesForm\\:invoicepasswordSe",
    },
  },

  messages: {
    'addressesForm\:invoiceGender': requiredMessage,
    'addressesForm\:invoiceForename': {
      required: requiredMessage,
      maxlength: "Maximal 30 Zeichen.",
    },
    'addressesForm\:invoiceSurname': {
      required: requiredMessage,
      maxlength: "Maximal 30 Zeichen.",
    },
    'addressesForm\:invoiceEmail': requiredMessage,
    'addressesForm\:invoiceEmailConfirmation': requiredMessage,
    'addressesForm\:invoiceStreet': {
      required: requiredMessage,
      maxlength: "Maximal 30 Zeichen.",
    },
    'addressesForm\:invoiceZipCode': {
      required: requiredMessage
    },
    'addressesForm\:invoiceCity': {
      required: requiredMessage,
      maxlength: "Maximal 30 Zeichen.",
    },
    'addressesForm\:shippingGender': requiredMessage,
    'addressesForm\:shippingForename': {
      required: requiredMessage,
      maxlength: "Maximal 30 Zeichen.",
    },
    'addressesForm\:shippingSurname': {
      required: requiredMessage,
      maxlength: "Maximal 30 Zeichen.",
    },
    'addressesForm\:shippingEmail': requiredMessage,
    'addressesForm\:shippingEmailConfirmation': requiredMessage,
    'addressesForm\:shippingStreet': {
      required: requiredMessage,
      maxlength: "Maximal 30 Zeichen.",
    },
    'addressesForm\:shippingZipCode': {
      required: requiredMessage
    },
    'addressesForm\:shippingCity': {
      required: requiredMessage,
      maxlength: "Maximal 30 Zeichen.",
    },
    'addressesForm\:invoicepasswordSe': {
      required: "<strong>Krävs</strong>",
      passwordCheck: "<strong>Lösenordet är inte tillräckligt starkt.</strong>",
    },
    'addressesForm\:invoicerepeatedPasswordSe': {
      required: "<strong>Krävs</strong>",
      equalTo: "<strong>Lösenorden stämmer inte överens.</strong>",
    },
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

  var password = $('#addressesForm\\:invoicepassword').val();

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

function passFunction() {
  $(".-passwordVerify").hide();
  $('#addressesForm\\:invoicepassword').on('keyup', ValidatePassword);
  $('#addressesForm\\:invoicepassword').focus(function() {
      $(".-passwordVerify").show();
  });
  $('#addressesForm\\:invoicepassword').focusout(function() {
    $(".-passwordVerify").hide();
  });
}

$(document).ready(function () {
  passFunction();
  if ($('.outmsg > .-error:contains("De wachtwoorden komen niet overeen.")').length > 0) {
    $('.outmsg > .-error').hide();
    $('#addressesForm\\:invoicerepeatedPassword').addClass('-invalid');
    $('.-repeatPass').append('<span class="validation -error -bottom">De wachtwoorden komen niet overeen.</span>');
  }
  if ($('.-pass > .validation:contains("Wachtwoord niet sterk genoeg.")').length < 1 && $('.-repeatPass > .validation:contains("Wachtwoord niet sterk genoeg.")').length > 0) {
    $('.-repeatPass > .validation').hide();
    $('.-repeatPass').append('<span class="validation -error -bottom">De wachtwoorden komen niet overeen.</span>');
  }
  $('.showLogin:checked').closest('.group').siblings('.showLoginBlock').removeClass('hidden');
});


$(".invoiceCountry").change(function(){
  $(addressesForm).validate().element('#addressesForm\\:invoiceZipCode');
  if (this.value > 7) {
    $("#addressesForm\\:packstationRB\\:1").trigger("click");
    $('#addressesForm\\:invoiceCountry').trigger('click');
  } else {
     $(addressesForm).validate().element('#addressesForm\\:invoiceZipCode');
  }
});

$(".shippingCountry").change(function(){
  $(addressesForm).validate().element('#addressesForm\\:shippingZipCode');
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

function validateInputs() {
  $("#addressesForm\\:shippingAddress input[type=text]").each(function () {
    if (this.value) {
      $('#addressesForm\\:shippingAddress').validate().element(this);
    }
  });
}
