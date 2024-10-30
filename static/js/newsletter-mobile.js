$( document ).ready(function() {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $('#congrats').hide();
    $('.mobile-only').removeClass('hidden');
    if($.cookie('newsletter')){
      $('#email-deal').hide();
       $('#congrats').show();
    }
  }

  var d1 = new Date (),
      d2 = new Date ( d1 );
  d2.setMinutes ( d1.getMinutes() + 15 );

  $('#clock-newsletter').countdown(d2).on('update.countdown', function(event) {
    var $this = $(this).html(event.strftime('<span>%M</span> Min. ' + '<span>%S</span> Sec.'));
  });

  var date = new Date(), minutes = 30;
   date.setTime(date.getTime() + (minutes * 60 * 1000));

  $('.btn-close').click(function(e){
    e.preventDefault();
    document.getElementById('email-deal').remove();
    document.cookie = 'newsletter=1; expires=' + date + ' UTC; path=/';
    $('#congrats').show();
  });
  $('#newsletter-header-mobile').submit(function(e){
    e.preventDefault();
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
    setTimeout(function(){ document.getElementById('email-deal').remove();  $('#congrats').show(); }, 6000);
    document.cookie = 'newsletter=1; expires=Fri, 3 Aug 2016 20:47:11 UTC; path=/';
  });
});