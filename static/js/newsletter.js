function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

(function( $, undefined ) {
$(window).on("load", function (e) {

    $( "#newsletter-form" ).submit(function( event ) {
      event.preventDefault();

      // Get some values from elements on the page:
      var $form = $( this ),
          shop = $form.find( "input[name='shop']" ).val(),
          campaing = $form.find( "input[name='event']" ).val(),
          email = $form.find( "input[name='email']" ).val(),
          subscribevia = $form.find( "input[name='subscribevia']" ).val(),
          url = $form.attr( "action" );

      if (!validateEmail(email)) {
        $form.find( "input[name='email']" ).css("color", "red");
      } else {
        // Send the data using get
        var posting = $.get( url, { shop: shop, event: campaing, email: email, subscribevia:subscribevia} );

        // Show success message
        posting.done(function( data ) {
          $form.find('.success').fadeIn();
        });
      }

    });

    $("#newsletter-form input[name='email").on('focus', function(){
      $(this).css("color", "initial");
    });

        $( "#newsletter-form-eurowings" ).submit(function( event ) {
      event.preventDefault();

      // Get some values from elements on the page:
      var $form = $( this ),
          shop = $form.find( "input[name='shop']" ).val(),
          campaing = $form.find( "input[name='event']" ).val(),
          email = $form.find( "input[name='email']" ).val(),
          subscribevia = $form.find( "input[name='subscribevia']" ).val(),
          channel = $form.find("input[name='channel']").val();
          url = $form.attr( "action" );

      // Send the data using get
      var posting = $.get( url, { shop: shop, event: campaing, email: email, subscribevia:subscribevia, channel: channel } );

      // Show success message
      posting.done(function( data ) {
        $form.find('.success').fadeIn();
      });
    });
 $('#newsletter-form-eurowings .close').click(function(){
      $(this).parent().fadeOut();
    });

    $('#newsletter-form .close').click(function(){
      $(this).parent().fadeOut();
    });

    $( "#unsubscribe-form" ).submit(function( event ) {
      event.preventDefault();

      // Get some values from elements on the page:
      var $form = $( this ),
          frequency = $form.find( "input:radio[name='frequency']:checked" ).val(),
          campaing = $form.find( "input[name='event']" ).val(),
          contact_uid = $form.find( "input[name='contact_uid']" ).val(),
          email_txt = $form.find( "input[name='email_txt']" ).val(),
          email_id = $form.find( "input[name='email_id']" ).val(),
          launch_list_id = $form.find( "input[name='launch_list_id']" ).val(),
          url = $form.attr( "action" );

      // Send the data using get
      var posting = $.get( url, { event: campaing, frequency: frequency, contact_uid:contact_uid, email_id:email_id, email_txt:email_txt, launch_list_id:launch_list_id } );
      //Show success message
      posting.done(function( data ) {
        $('.success').fadeOut();
        if (data.result === false) {
          $('.success.error').fadeIn();
        } else {
          $('.success'+frequency).fadeIn();
        };
      });
    });

    $('#unsubscribe-form .close').click(function(){
      $(this).parent().fadeOut();
    });


    $( "#newsletter-header" ).submit(function( event ) {
      event.preventDefault();

      // Get some values from elements on the page:
      var $form = $( this ),
          shop = $form.find( "input[name='shop']" ).val(),
          campaing = $form.find( "input[name='event']" ).val(),
          email = $form.find( "input[name='email']" ).val(),
          subscribevia = $form.find( "input[name='subscribevia']" ).val(),
          url = $form.attr( "action" );

      // Send the data using get
      var posting = $.get( url, { shop: shop, event: campaing, email: email, subscribevia:subscribevia } );

      // Show success message
      posting.done(function( data ) {
        $form.find('.success').fadeIn();
      });
    });

    $('#newsletter-header .close').click(function(){
      $(this).parent().fadeOut();
    });

    $( "#newsletter-header2" ).submit(function( event ) {
      event.preventDefault();

      // Get some values from elements on the page:
      var $form = $( this ),
          shop = $form.find( "input[name='shop']" ).val(),
          campaing = $form.find( "input[name='event']" ).val(),
          email = $form.find( "input[name='email']" ).val(),
          subscribevia = $form.find( "input[name='subscribevia']" ).val(),
          url = $form.attr( "action" );

      // Send the data using get
      var posting = $.get( url, { shop: shop, event: campaing, email: email, subscribevia:subscribevia } );

      // Show success message
      posting.done(function( data ) {
        $form.find('.success').fadeIn();
      });
    });

    $('#newsletter-header2 .close').click(function(){
      $(this).parent().fadeOut();
    });

    $('a[data-popup="true"]').click(function(e){
      e.preventDefault();
        popWindow(this.href, this.title)
    });

    $( "#newsletter-body" ).submit(function( event ) {
      event.preventDefault();

      // Get some values from elements on the page:
      var $form = $( this ),
          shop = $form.find( "input[name='shop']" ).val(),
          campaing = $form.find( "input[name='event']" ).val(),
          salutation = $form.find( "input:radio[name='salutation']:checked" ).val(),
          firstname = $form.find( "input[name='firstname']" ).val(),
          lastname = $form.find( "input[name='lastname']" ).val(),
          email = $form.find( "input[name='email']" ).val(),
          subscribevia = $form.find( "input[name='subscribevia']" ).val(),
          url = $form.attr( "action" );

      // Send the data using get
      var posting = $.get( url, { shop: shop, event: campaing, email: email, salutation: salutation, firstname: firstname, lastname: lastname, subscribevia: subscribevia } );

      // Show success message
      posting.done(function( data ) {
        $form.find('.success').fadeIn();
      });
    });

    $('#newsletter-body .close').click(function(){
      $(this).parent().fadeOut();
    });

    $( "#newsletter-body-form" ).submit(function( event ) {
      event.preventDefault();

      // Get some values from elements on the page:
      var $form = $( this ),
          shop = $form.find( "input[name='shop']" ).val(),
          campaing = $form.find( "input[name='event']" ).val(),
          email = $form.find( "input[name='email']" ).val(),
          subscribevia = $form.find( "input[name='subscribevia']" ).val(),
          url = $form.attr( "action" );

      // Send the data using get
      var posting = $.get( url, { shop: shop, event: campaing, email: email, subscribevia: subscribevia } );

      // Show success message
      posting.done(function( data ) {
        $form.find('.success').fadeIn();
      });
    });

    $('#newsletter-body-form .close').click(function(){
      $(this).parent().fadeOut();
    });
  
  });
})( jQuery );

function popWindow(url, title){
  window.open(url, title, 'height=620, width=580, left=100, top=100, resizable=yes, scrollbars=yes, toolbar=no, menubar=no');
}

// Facebook Login *********************************** start //
(function(d, s, id) {
	var d = document;
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s);
	js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function() {
	FB.init({
	  appId      : '1025165854172566',
	  xfbml      : false,
	  version    : 'v2.6'
	});
};

function fetchUserDetail() {
	FB.api('/me?fields=email', function(response) {
		console.log(response.email);
		$("#newsletter-formFB").find( "input[name='email']" ).val(response.email);
		finishSubmit();
	});
}

function checkFacebookLogin() {
	FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			fetchUserDetail();
		} else {
			// not authorized
		}
	});
}

function initiateFBLogin() {
	FB.login(function(response) {checkFacebookLogin();}, {scope: 'email'}, {return_scopes: true});
}

function finishSubmit() {
	// Get some values from elements on the page:
  var $form = $("#newsletter-formFB"),
	  shop = $form.find( "input[name='shop']" ).val(),
	  campaing = $form.find( "input[name='event']" ).val(),
	  email = $form.find( "input[name='email']" ).val(),
	  subscribevia = $form.find( "input[name='subscribevia']" ).val(),
	  url = $form.attr( "action" );
	
  if (!validateEmail(email)) {
	console.log("valid done");
	$form.find( "input[name='email']" ).css("color", "red");
  } else {
	// Send the data using get
	var posting = $.get( url, { shop: shop, event: campaing, email: email, subscribevia:subscribevia} );

	// Show success message
	posting.done(function( data ) {
	  console.log("success done");
	  $form.find('.success').fadeIn();
	});
  }
}
// Facebook Login *********************************** end //