$( document ).ready( function() {

	var BOARD_SIZE = 180;
	var cell_size = 3;
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
	$("#zoom_in").click( function(){ cell_size += 1 });
	$("#zoom_out").click( function(){ 
		
		if ( cell_size > 1 ) {
			cell_size -= 1; 
		}
	});


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





	function drawBoard(cells) {
		var canvas = document.getElementById("c");
		var context = canvas.getContext("2d");
		var x = 0;
		var y = 0;
		var p = 0; // piece count
	   	for	(var index = 0; index < cells.length; index++) {

			if (cells[index] == 1) {
				context.fillStyle = "#000000";
				context.fillRect(x, y, cell_size,cell_size);

				
			} else { 
				context.fillStyle = "#ffffff";
				context.fillRect(x, y, cell_size,cell_size); 
				}
			x += cell_size;
			p += 1; // next piece
			if (p == BOARD_SIZE) {
				y += cell_size;
				x = 0;
				p = 0;
			} 
		}
	}


});
