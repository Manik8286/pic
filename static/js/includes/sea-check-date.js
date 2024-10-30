function GetDateWeek() {
  var d = new Date();
  var n = d.getDay();
  if (n == 6)
    d.setDate(d.getDate() - 1);
  else if (n == 0)
    d.setDate(d.getDate() - 2);
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}
$(document).ready(function() {
  $("#NewDate").text(GetDateWeek())
});