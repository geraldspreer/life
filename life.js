$( document ).ready( function() {

	var BOARD_SIZE = 20;

	 var drawTimer =	setInterval( function() { cycle(); }, 50);
		
 	//
	// controls 
	//
	$("#stop").click( function(){ clearInterval( drawTimer ); });
	$("#cycle").click( function(){ cycle(); });

	//
	// seed
	//
	var creation = new Array(BOARD_SIZE * BOARD_SIZE);
	var nextStep = new Array(BOARD_SIZE * BOARD_SIZE);

		for (var i = 0; i < creation.length; i++) {

			creation[i] = Math.round(Math.random());
		};
	

	function cycle() {
	
		var liveCount = 0;

		for (var i = 0; i < creation.length; i++) {

			liveCount = 0;	
			
			// clipping
			if ( i < BOARD_SIZE) {
				nextStep[i] = 0;	
			} else if ( i > 380 ) {
				nextStep[i] = 0;	
			} else {

				liveCount = creation[i-1] ; 
				liveCount += creation[i-BOARD_SIZE] ;
				liveCount += creation[  i- ( BOARD_SIZE  - 1 )] ;
				liveCount += creation[  i- ( BOARD_SIZE  + 1 )] ; 
				liveCount += creation[i + 1] ; 
				liveCount += creation[  i + BOARD_SIZE ] ; 
				liveCount += creation[  i + ( BOARD_SIZE  - 1 )] ; 
				liveCount += creation[  i + ( BOARD_SIZE  + 1) ];
			}

			if ( creation[i] == 1 ) {
				if ( liveCount < 2 || liveCount > 3) {
						nextStep[i] = 0;
					}
				else if ( liveCount == 2 || liveCount == 3 ) {
						nextStep[i] = 1;
					}
			} else { 
				if ( liveCount == 3 ) {
					nextStep[i] = 1;
				}  else { 
					nextStep[i] = 0; 
					}
				}
		} 

		drawBoard(nextStep);
		
		// copy current state of array 
		creation = nextStep.slice();

	}

	function drawBoard(cells) {
	
		// clear board
		$("#container").children().remove();
	
		// draw all cells from array
		var x = 0;
	   	for	(var index = 0; index < cells.length; index++) {
			if (cells[index]) {
				var p =	cells[index].toString();
			} else { var p = "0" }

			$("#container").append("<div class='cell _" + p + "'></div>");	
			
			x += 1;
			if ( x == BOARD_SIZE ) {
				$("#container").append("<br />");	
				x = 0;
			}
		} 	
	}

});
