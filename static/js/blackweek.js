var deals = [
  {
    title: "Ju mer du handlar för, desto billigare blir det!",
    productId: 254,
    product: "/assets/img/blackfriday/product1.png",
    teaser: "/assets/img/blackfriday/background-wallart.jpg",
    coupon: "BFBC1",
    start: "2018/11/14 00:00",
    ends: "2018/11/16 23:59:59"
  },
  {
    title: "25% rabatt på filtar!",
    productId: 2000,
    product: "/assets/img/blackfriday/product2.png",
    teaser: "/assets/img/blackfriday/background-photogifts.jpg",
    coupon: "BFBC2",
    start: "2018/11/17 00:00",
    ends: "2018/11/19 23:59:59"
  },
  {
    title: "30% rabatt på format större än 80x60!",
    productId: 254,
    product: "/assets/img/blackfriday/product3.png",
    teaser: "/assets/img/blackfriday/background-wallart.jpg",
    coupon: "BFBC3",
    start: "2018/11/20 00:00",
    ends: "2018/11/22 23:59:59"
  },
  {
    title: "Black Friday är här! Ta del av våra erbjudanden!",
    productId: 254,
    product: "/assets/img/blackfriday/product4.png",
    teaser: "/assets/img/blackfriday/background-photogifts.jpg",
    coupon: "BFBC3",
    start: "2018/11/23 00:00",
    ends: "2018/11/26 23:59:59"
  },
  {
    title: "20% rabatt på 2 eller fler produkter!",
    productId: 1176,
    product: "/assets/img/blackfriday/product5.png",
    teaser: "/assets/img/blackfriday/background-photogifts.jpg",
    coupon: "BFBC4",
    start: "2018/11/27 00:00",
    ends: "2018/11/29 23:59:59"
  },
  {
    title: "2 för 1 efter 540 kr!",
    productId: 254,
    product: "/assets/img/blackfriday/product6.png",
    teaser: "/assets/img/blackfriday/background-wallart.jpg",
    coupon: "BFBC5",
    start: "2018/11/30 00:00",
    ends: "2018/12/2 23:59:59"
  }
];




var i, startDate, endDate, startMs, endMs, currentMs, notification, teaser, otherDeals = "", otherDealsTemplate, commingDeals;


for (var i = deals.length - 1; i >= 0; i--) {
  startDate = deals[i]["start"];
  endDate = deals[i]["ends"];

  otherDealsTemplate = '<div class="product active">'+
                       '  <div class="product-box" data-mh="product">'+
                       '    <h3 class="title">'+ deals[i]["title"] +'</h3>'+
                       '    <img src="'+ deals[i]["product"] +'" alt="'+ deals[i]["title"] +'"/>'+
                       '    <div class="info">'+
                       '      <div class="price">'+
                       '        <div class="countdown-clock dInlineBlock" data-countdown="'+ deals[3]["start"] +'"></div>'+
                       '      </div>'+
                       '      <div class="coupon-block"><form data-clip-translation="kopieras"><input type="text" value="'+ deals[i]["coupon"] +'" class="coupon clip" data-clipboard-text="'+ deals[i]['coupon'] +'" readonly="true"></form></div>' +
                       '      <div style="display: none;" class="copy-bubble">Saved to clipboard!</div>' +
                       '      <button class="button action filebutton uploadButton" data-product-id="'+ deals[i]['productId'] +'">Skapa</button>'+
                       '    </div>'+
                       '  </div>'+
                       '</div>';

  // put dates in milliseconds for easy comparisons
  startMs = Date.parse(startDate);
  endMs = Date.parse(endDate);
  currentMs = Date.parse(new Date());

  // if current date is between start and end dates, display clock
  if ( endMs > currentMs && currentMs >= startMs ){

   notification = '<div class="header-bar blackweek-notification">'+
                  '  <div class="row text-center">'+
                  '    Black Week Deals - Kampanjkod aktiv för – <div class="countdown-clock dInlineBlock" data-countdown="'+ deals[i]["ends"] +'"></div>'+
                  '  </div>'+
                  '</div>';

        teaser = '<div class="info">'+
                 '  <div class="countdown-block">'+
                 '    <h3>DEAL COUNTDOWN</h3>'+
                 '    <div class="countdown-clock dInlineBlock" data-countdown="'+ deals[i]["ends"] +'"></div>'+
                 '  </div>';

        if (deals[i]["title"] != 'Black Friday är här! Ta del av våra erbjudanden!') {

          teaser +='<div class="coupon-block">'+
                 '    <h3>Din kupong för kundvagnen:</h3>'+
                 '    <form data-clip-translation="kopieras"><input type="text" value="'+ deals[i]['coupon'] +'" class="coupon clip" data-clipboard-text="'+ deals[i]['coupon'] +'" readonly="true" /></form>'+
                 '  </div>' ;

        } else {

          teaser +='<div class="coupon-block">'+
                 '    <h3>För fler kuponger var vänlig bläddra ner</h3>'+
                 '  </div>' ;

        }

          teaser +='  <button class="button action filebutton uploadButton" data-product-id="'+ deals[i]['productId'] +'">Skapa</button>'+
                 '</div>';

    otherDeals += '<div class="product active">'+
                  '  <div class="product-box" data-mh="product">'+
                  '    <h3 class="title">'+ deals[i]["title"] +'</h3>'+
                  '    <img src="'+ deals[i]["product"] +'" alt="'+ deals[i]["title"] +'"/>'+
                  '    <div class="info">'+
                  '      <div class="price">'+
                  '        <div class="countdown-clock" data-countdown="'+ deals[i]["ends"] +'"></div>'+
                  '      </div>';
    if (deals[i]["title"] != 'Black Friday är här! Ta del av våra erbjudanden!') {
      otherDeals += '  <div class="coupon-block"><form data-clip-translation="kopieras"><input type="text" value="'+ deals[i]["coupon"] +'" class="coupon clip" data-clipboard-text="'+ deals[i]['coupon'] +'" readonly="true"></form></div>';
    }

    otherDeals +='      <button class="button action filebutton uploadButton" data-product-id="'+ deals[i]['productId'] +'">Skapa</button>'+
                  '    </div>'+
                  '  </div>'+
                  '</div>';

    $('body').addClass('-has-header-bar');
    $('.header-bar.-red').hide();
    $('.teaser-blackweek .info').hide();
    $('.teaser-blackweek .product img').attr('src', deals[i]['product']);
    $('.teaser-blackweek.showcase').css('background-image', 'url(' + deals[i]['teaser'] + ')');
    $('.teaser-blackweek h2').html(deals[i]['title']);
    $('.teaser-blackweek .product').after(teaser);

  } else if (endMs > currentMs && currentMs <= startMs) {

    if (currentMs >= Date.parse(deals[3]["start"]) && currentMs <= Date.parse(deals[3]["ends"]) ) {
      otherDeals += otherDealsTemplate;
    } else {
      otherDeals += '<div class="product">'+
                    '  <div class="product-box" data-mh="product">'+
                    '    <h3 class="title">'+ deals[i]["title"] +'</h3>'+
                    '    <img src="'+ deals[i]["product"] +'" alt="'+ deals[i]["title"] +'"/>'+
                    '    <div class="info">'+
                    '      <div class="special-time">'+
                    '        <div class="countdown-clock " data-countdown="'+ deals[i]["start"] +'"></div>'+
                    '      </div>'+
                    '      <a class="action disabled" href="javascript:void(0)">Snart Aktiv!</a>'+
                    '    </div>'+
                    '  </div>'+
                    '</div>';
    }

  } else {
    // expire

    if (currentMs >= Date.parse(deals[3]["start"]) && currentMs <= Date.parse(deals[3]["ends"]) ) {
      otherDeals += otherDealsTemplate;
    } else {
      otherDeals += '<div class="product">'+
                    '  <div class="product-box" data-mh="product">'+
                    '    <h3 class="title">'+ deals[i]["title"] +'</h3>'+
                    '    <img src="'+ deals[i]["product"] +'" alt="'+ deals[i]["title"] +'"/>'+
                    '    <div class="info">'+
                    '      <a class="action disabled" href="javascript:void(0)">Utgånget</a>'+
                    '    </div>'+
                    '  </div>'+
                    '</div>';
    }
  }
}

$('body').prepend(notification);

$( document ).ready(function() {

  // $('.header-bar').not('.blackweek-notification').remove();

  // copy function
  var clipboard = new Clipboard('.clip');

  $('.deal-section').html('<div class="product-list">'+ otherDeals +'</div>');

  $('.product-box').matchHeight();

  $('.uploadButton').on('click', function(e){
    var productId = this.dataset.productId;
    $('.js-du-productid').val(productId).trigger('change');
    $('#upload-btn .fileinput').trigger('click');
  });

  $('.clip').on('click', function(){
    var $target = $(this).parent();
    $target.addClass('-copy');
    setTimeout(function () {
        $target.removeClass('-copy');
    }, 2000);

  })

  $('[data-countdown]').each(function() {
    var $this = $(this), finalDate = $(this).data('countdown');
    $this.countdown(finalDate, function(event) {
      var format = '%H:%M:%S';

      if (event.offset.totalDays % 7 == 1) {
        format = '%-d dag ' + format;
      } else {
        if (event.offset.totalDays % 7 != 0) {
          format = '%-d dagar ' + format;
        }
      }

      if (event.offset.weeks <= 1) {
        if (event.offset.weeks != 0) {
          format = '%-w vecka ' + format;
        }
      } else {
        format = '%-w veckor ' + format;
      }

      $this.html(event.strftime(format));
    });
  }).on('finish.countdown', function(event) {
    $(this).html('utgånget');
    $(this).parent().parent().addClass('disabled');
    $(this).parent().parent().find('.button-style').attr("href", "javascript:void(0)").text('Utgånget');
  });
});