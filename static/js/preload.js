//= include vendor/modernizr.min.js
//= include vendor/svg4everybody.min.js
//= include plugins/cookie.js
var altMsg = 0;

window.ie = (function(){

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );

    return v > 4 ? v : undef;

}());