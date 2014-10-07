$( document ).ready( function() {

	var BOARD_SIZE = 40;

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

		var lifeCount = 0;

		for (var i = 0; i < creation.length; i++) {

			lifeCount = 0;
			//
			// clipping
			//
			if ( i < BOARD_SIZE) {

				var p = BOARD_SIZE * BOARD_SIZE - i;

				lifeCount = creation[p-1] ;
				lifeCount += creation[p-BOARD_SIZE] ;
				lifeCount += creation[  p- ( BOARD_SIZE  - 1 )] ;
				lifeCount += creation[  p- ( BOARD_SIZE  + 1 )] ;
				lifeCount += creation[i + 1] ;
				lifeCount += creation[  i + BOARD_SIZE ] ;
				lifeCount += creation[  i + ( BOARD_SIZE  - 1 )] ;
				lifeCount += creation[  i + ( BOARD_SIZE  + 1) ];
			
			} else if ( i > BOARD_SIZE * BOARD_SIZE - BOARD_SIZE ) {

				var p = i - BOARD_SIZE * BOARD_SIZE + BOARD_SIZE;

				lifeCount = creation[i-1] ; 
				lifeCount += creation[i-BOARD_SIZE] ;
				lifeCount += creation[  i- ( BOARD_SIZE  - 1 )] ;
				lifeCount += creation[  i- ( BOARD_SIZE  + 1 )] ;
				lifeCount += creation[i + 1] ;
				lifeCount += creation[  p + BOARD_SIZE ] ;
				lifeCount += creation[  p + ( BOARD_SIZE  - 1 )] ;
				lifeCount += creation[  p + ( BOARD_SIZE  + 1) ];
      } else {
				lifeCount = creation[i-1] ;
				lifeCount += creation[i-BOARD_SIZE] ;
				lifeCount += creation[  i- ( BOARD_SIZE  - 1 )] ;
				lifeCount += creation[  i- ( BOARD_SIZE  + 1 )] ;
				lifeCount += creation[i + 1] ;
				lifeCount += creation[  i + BOARD_SIZE ] ;
				lifeCount += creation[  i + ( BOARD_SIZE  - 1 )] ;
				lifeCount += creation[  i + ( BOARD_SIZE  + 1) ];

			}

			if ( creation[i] == 1 ) {
				if ( lifeCount < 2 || lifeCount > 3) {
						nextStep[i] = 0;
					}
				else if ( lifeCount == 2 || lifeCount == 3 ) {
						nextStep[i] = 1;
					}
			} else {
				if ( lifeCount == 3 ) {
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
