function playButton(){
	isPlaying = true;
	$("#button-play").html('<i class="material-icons">stop</i>');
}


function stopButton(){
	isPlaying = false;
	$("#button-play").html('<i class="material-icons">play_arrow</i>');
}


$(function(){
	$(document).on("click", "#button-play", function(){
		if (isPlaying) {
			stopButton();
		} else {
			playButton();
		}
	});
});


