function getProductInformation(printMaterial, articleNumber, printMaterialCategory, description, formatDisplayName) {
  var itemInfo = {};
  if (printMaterial.indexOf('Product Set') !== -1) {
    articleNumber = description;
  }
  if (printMaterial == '') {
    if (description.indexOf('Hanger') !== -1) {
      itemInfo = {
        'name': 'Hanger Kit',
        'articleNumber': articleNumber,
        'category': 'Accessory',
        'variant': description,
        'description': description
      };
    } else if (description.indexOf('Gift_Certificate') !== -1) {
      itemInfo = {
        'name': 'Gift Certificate',
        'articleNumber': articleNumber,
        'category': 'Certificate',
        'variant': description,
        'description': description
      };
    } else {
      itemInfo = {
        'name': description,
        'articleNumber': articleNumber,
        'category': printMaterialCategory,
        'variant': description,
        'description': description
      };
    }
  } else {
    itemInfo = {
      'name': printMaterial,
      'articleNumber': articleNumber,
      'category': printMaterialCategory,
      'variant': formatDisplayName,
      'description': description
    };
  }
  return itemInfo;
}

function fixMixPixPrice(inputArray) {
  console.log('-- Started function');
  for (var i = 0; i < inputArray.length; i++) {
    console.log('-- iteration ' + i);
    if(inputArray[i].id.indexOf('MIXPIX‌') !== -1) {
      console.log('-- MixPix found')
      inputArray[i].price = Number(inputArray[i].price);
      inputArray[i].quantity = Number(inputArray[i].quantity);
      console.log('-- MixPix price: ' + inputArray[i].price + ' type: '+ typeof(inputArray[i].price));
      console.log('-- MixPix quantity: ' + inputArray[i].quantity + 'type: ' + typeof(inputArray[i].quantity));
      inputArray[i].price = inputArray[i].price / inputArray[i].quantity;
      inputArray[i].price = inputArray[i].price.toFixed(2);
      console.log('-- Finished with price: ' + inputArray[i].price)
    }
  }
  return inputArray;
}

function createProductTrackingArray(inputProductArray) {

  var outputProductArray = [];
  outputProductArray[0] = inputProductArray[0];
  outputProductArray[0].quantity = Number(outputProductArray[0].quantity);

  if (inputProductArray.length > 0) {
    for (var i = 1; i < inputProductArray.length; i++) {
      inputProductArray[i].quantity = Number(inputProductArray[i].quantity);
      var similarityFound = false;
      /*console.log('Search for input[' + i + ']: ' + 
        inputProductArray[i].name + ' | ' +
        inputProductArray[i].variant + ' | ' +
        inputProductArray[i].dimension5 + ' | ' +
        inputProductArray[i].dimension9 + ' | ' +
        inputProductArray[i].dimension11);*/
      for (var j = 0; j < outputProductArray.length; j++) {
        /*console.log('in output[' + j + '] ' + 
          outputProductArray[j].name + ' | ' +
          outputProductArray[j].variant + ' | ' +
          outputProductArray[j].dimension5 + ' | ' +
          outputProductArray[j].dimension9 + ' | ' +
          outputProductArray[j].dimension11);*/
        if (inputProductArray[i].name == outputProductArray[j].name &&
          inputProductArray[i].variant == outputProductArray[j].variant &&
          inputProductArray[i].dimension5 == outputProductArray[j].dimension5 &&
          inputProductArray[i].dimension9 == outputProductArray[j].dimension9 &&
          inputProductArray[i].dimension11 == outputProductArray[j].dimension11) {
          //console.log('Similar found');
          outputProductArray[j].quantity += inputProductArray[i].quantity;
          similarityFound = true;
          break;
        } //else { console.log('Not similar'); } 
      }
      if(similarityFound == false) {
        /*console.log('Add to output[' + outputProductArray.length + '] ' + 
          inputProductArray[i].name + ' | ' +
          inputProductArray[i].variant + ' | ' +
          inputProductArray[i].dimension5 + ' | ' +
          inputProductArray[i].dimension9 + ' | ' +
          inputProductArray[i].dimension11);*/
        outputProductArray.push(inputProductArray[i]);
      }
    }
  }
  return fixMixPixPrice(outputProductArray);
}