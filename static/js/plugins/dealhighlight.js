function fillMissingDeal() {
  console.log("Function is working" + " ");
  if (Cookies.get('dealHighlight')) {
    var exception = Cookies.getJSON('dealHighlight');

    var dealText = "Newsletter-Deal";
    if (exception.discountcode == Cookies.get('discountcode')){
      var currentProduct = document.getElementById('itemConfiguratorForm:product').value; 
      var exceptionArray = exception.products.split(',');

      for (var i = 0; i < exceptionArray.length; i++) {
        var dealProduct = exceptionArray[i].split(':')[0];
        var dealFormat = exceptionArray[i].split(':')[1];
        console.log(currentProduct + ' ');
        console.log(dealProduct + ' ');
        if (currentProduct === dealProduct) {
          if (/(iPad|iPhone|iPod|Android|IEMobile)/g.test( navigator.userAgent )) {
            $(".format-table .item label:contains(" + dealFormat + ")").parent().find('.-highlight').addClass('-discounted').prev().prev().append('<small class="-discounted dBlock">' + dealText + '</small>');
            console.log("Mobile");
          } else {
            $(".format-table td label:contains(" + dealFormat + ")").parent().siblings('.-highlighted').addClass('-discounted').prev().prev().append('<div class="ribbon-label red -longer -fix"><strong class="ribbon-content">' + dealText + '</strong></div>');
            console.log("Desktop");
          }
        }
      }
    }
  }
}