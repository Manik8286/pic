var calcFreeShip = function(shippingProvider) {
  var shop, $id, subtotalStr, subtotal, diff, currency, discountFrom, shippingCostText, shippingCostValue;
  if (shippingProvider == 18 || shippingProvider == 28 || shippingProvider == 29) {
    $('.shipping.info').addClass('hidden');
    return;
  }
  // get values
  $id = $('#save-more');
  subtotalStr = $id.attr('data-subtotal');
  shippingCountry = $id.attr('data-country');
  shop = $id.data('shop');
  //shippingCountry = $(".country button").html();
  shippingCostText = $id.attr('data-shippingcost');
  currency = 'kr';
  discountFrom = 800;
  // set spending amount
  $('#spend-more').text(discountFrom);
  $('.currency').text(currency);
  // preserve precision
  subtotal = (subtotalStr.replace(' ', '').replace(currency, '').replace(',', '.') * 100).toFixed();
  // shippingCostValue = (shippingCostText.replace(' ', '').replace(currency, '').replace(',', '.') * 100).toFixed();
  diff = discountFrom - (subtotal / 100);
  /*if (subtotal < discountFrom * 100 && shippingCountry == 'Sverige') {
    $('.shipping.info').removeClass('hidden');
  }*/
  $id.text(diff.toFixed(2)+' '+currency);
};

function xmasGuarantee(thisCartProducts, shippingCountry){
  var thisCountryIndex = 0;
  for(j=0;j<deliveryCountries.length;j++){
    if(deliveryCountries[j].countryName.indexOf(shippingCountry) !== -1)
      var thisCountryIndex = j;
  }
  var finalDate = addDays(deliveryDeadlines[0].orderDate, deliveryCountries[thisCountryIndex].deliveryDelay);
  var isCanvas = false;
  var infoAvailable = false;
  for(i=0;i<thisCartProducts.length;i++){
    if(thisCartProducts[i].name == 'Canvas'){
      isCanvas = true;
    }
  }
  if (typeof showShoppingCartInfo !== 'undefined') {
    var infoAvailable = true;
  }
  if(isCanvas == true && addDays(finalDate,1)>=today && infoAvailable == true) {
    $('.delivery-guarantee').removeClass('hidden');
  }
}
