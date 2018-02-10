/*
function map(value, low1, high1, low2, high2) {
	var ret = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	return ret;
}

// Returns minimum value in the array
function min(array){
	var ret;

	for (var i = 0; i < array.length; i++) {
		if (!ret || ret > array[i]) ret = array[i];
	}
	
	return ret;
}

// Returns maximum value in the array
function max(array){
	var ret;

	for (var i = 0; i < array.length; i++) {
		if (!ret || ret < array[i]) ret = array[i];
	}
	
	return ret;
}
*/
/*
https://commons.wikimedia.org/wiki/File:1JPY.JPG
https://commons.wikimedia.org/wiki/File:5yen-S24.jpg
https://commons.wikimedia.org/wiki/File:10JPY.JPG
https://upload.wikimedia.org/wikipedia/commons/4/43/50yen-S42.jpg
https://commons.wikimedia.org/wiki/File:100JPY.JPG
https://commons.wikimedia.org/wiki/File:500JPY.JPG
https://upload.wikimedia.org/wikipedia/commons/f/f1/JPY_coin3.png
*/


$(function(){
	$(document).on("click", "#button-play", function(){
		if (isPlaying) {
			isPlaying = false;
			$(this).html('<i class="material-icons">play_arrow</i>');
		} else {
			isPlaying = true;
			$(this).html('<i class="material-icons">stop</i>');
		}
	});
});


