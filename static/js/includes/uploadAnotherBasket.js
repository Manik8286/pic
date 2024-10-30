var UploadAnotherBasket = function(productId) {
	var varproductId = productId || 0;
	var formAnother = $(".js-du").last();
	var fileInput = formAnother.find("input[type=file]");
	if (varproductId > 0) formAnother.find(".js-du-productid").val(varproductId).change();	
	fileInput.trigger('click');
};