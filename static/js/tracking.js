function findPageytpe(myDataLayer){
	var i;
	for(i=0;i<myDataLayer.length;i++){
		if(myDataLayer[i].hasOwnProperty('pagetype') == true){
			return true;
		}
	}
}
