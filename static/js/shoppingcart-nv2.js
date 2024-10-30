function calcFreeShip(shippingProvider) {
  var $id, totalvalueStr, totalvalue, shippingCostStr, shippingCost, diff, currency, discountFrom, shippingCountry;
  if (shippingProvider == 18 || shippingProvider == 28 || shippingProvider == 29) {
    $('.shipping.info').addClass('hidden');
    return;
  }
  // get values
  currency = 'kr';
  $id = $('#save-more');
  //subtotalStr = $id.attr('data-subtotal');
  //subtotal = (subtotalStr.replace(' ', '').replace(currency, '').replace(',', '.') * 100).toFixed();
  totalvalueStr = $id.attr('data-totalvalue');
  totalvalue = (totalvalueStr.replace(' ', '').replace(currency, '').replace(',', '.') * 100).toFixed();
  shippingCostStr = $id.attr('data-shippingcost');
  shippingCost = (shippingCostStr.replace(' ', '').replace(currency, '').replace(',', '.') * 100).toFixed();
  //shop = $id.data('shop');
  shippingCountry = $id.attr('data-country');
  currency = 'kr';
  discountFrom = 800;
  // set spending amount
  $('#spend-more').text(discountFrom);
  $('.currency').text(currency);
  // preserve precision
  diff = discountFrom - ((totalvalue-shippingCost) / 100);
  if (shippingCost > 0 && diff <= 200 && shippingCountry === 'Sverige') {
    $('.shipping.info').removeClass('hidden');
  }
  $id.text(diff.toFixed(2).replace('.',',')+' '+currency);
}
