function getDate()
{
    var today = new Date();
var dd = today.getDate()+1;
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
    dd='0'+dd ;
} 

if(mm<10) {
    mm='0'+mm;
} 

$(".timer").attr("data-until" , yyyy+'/'+mm+'/'+dd ) ;

}