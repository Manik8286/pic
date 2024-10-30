var unsubscribe = function( form ) {

  // Get some values from elements on the page:
  var $form = $( form ),
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
    if (data.result) {
      Modal.open( '#success' + frequency );
    } else {
      Modal.open( '#errorUnsubscribe' );
    }
  });
};

var NlCookie = function(){
  var date = new Date(),
      minutes = 30;
  date.setTime(date.getTime() + (minutes * 60 * 1000));
  document.cookie = 'newsletter=1; expires=' + date + ' UTC; path=/';
}