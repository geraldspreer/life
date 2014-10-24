$( document ).ready( function() {

	var BOARD_SIZE = 20;
	var drawTimer;
	startTimer();

	function startTimer() {
		 drawTimer =	setInterval( function() { cycle(); }, 100);
	}

 	//
	// controls
	//
	$("#stop").click( function(){ clearInterval( drawTimer ); });
	$("#step").click( function(){ cycle(); });
	$("#resume").click( function(){ startTimer(); });
	$("#reset").click( function(){ location.reload(); });


	//
	// seed
	//
	var creation = new Array(BOARD_SIZE * BOARD_SIZE);
	var nextStep = new Array(BOARD_SIZE * BOARD_SIZE);

	createBoard(creation);

		for (var i = 0; i < creation.length; i++) {

			creation[i] = Math.round(Math.random());
		};


	function cycle() {

		var lifeCount = 0;

		for (var i = 0; i < creation.length; i++) {

			lifeCount = 0;
			//
			// clipping and life count
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
				// 1 == true 
			if ( creation[i] ) {
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



	function createBoard(cells) {
		// clear board
		$("#container").children().remove();
		// draw all cells from array
		// but dead ( empty ) ones 
		var x = 0;
	   	for	(var index = 0; index < cells.length; index++) {
			// create some divs, they each get their own ids
			$("#container").append("<div id=a" + index.toString() + " class='cell'></div>");
			x += 1;
			if ( x == BOARD_SIZE ) {
				$("#container").append("<br />");
				x = 0;
			}
		}
	}


	function drawBoard(cells) {

		// draw all cells from array
	   	for	(var index = 0; index < cells.length; index++) {
			var id = index.toString();
			var thing = $("#container #a" + id);

			if (cells[index] == 1) {
				
		 			thing.addClass("_1");
				
			} else { 
				if ( thing.hasClass("_1") ) {
		 			thing.removeClass("_1");
				}
			}
		}
	}

});
