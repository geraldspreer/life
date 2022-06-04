$( document ).ready( function() {

  // Force hack canvas object
  //

  var innerHeight = window.innerHeight;

  $("#c").attr("width",  window.innerWidth);
  $("#c").attr("height", innerHeight);

  var generations = 0;

  // global (a)live count to determine of evolution has ended
  var alive = 0;
  var no_change = 0;
  // evo_gap : after how many generations has the evolution 
  // obviously stopped
  const evo_gap = 40;

  const cell_size = 6;
  var BOARD_SIZE = Math.floor( $("#c").width() / cell_size );
  var BOARD_HEIGHT = Math.floor( ($("#c").height()) / cell_size );

  var drawTimer;
  startTimer();

  function startTimer() {
    drawTimer =	setInterval( function() { cycle(); }, 1);
  }

  //
  // controls
  //
  $("#stop").click( function(){ 

    clearInterval( drawTimer );
    console.log(alive);
  });
  $("#step").click( function(){ cycle(); });
  $("#resume").click( function(){ startTimer(); });
  $("#reset").click( function(){ location.reload(); });


  //
  // seed
  //
  var creation = new Array(BOARD_SIZE * BOARD_HEIGHT);
  var nextStep = new Array(BOARD_SIZE * BOARD_HEIGHT);


  for (var i = 0; i < creation.length; i++) {

    creation[i] = Math.round(Math.random());
  };


  function cycle() {

    var lifeCount = 0;

    // statistics
    var deaths = 0;
    var living = 0;
    var births = 0;

    for (var i = 0; i < creation.length; i++) {

      lifeCount = 0;
      //
      // count live and make world without
      // borders
      //
      if ( i < BOARD_SIZE) {

        var p = BOARD_SIZE * BOARD_HEIGHT - i;

        lifeCount = creation[p-1] ;
        lifeCount += creation[p-BOARD_SIZE] ;
        lifeCount += creation[  p- ( BOARD_SIZE  - 1 )] ;
        lifeCount += creation[  p- ( BOARD_SIZE  + 1 )] ;
        lifeCount += creation[i + 1] ;
        lifeCount += creation[  i + BOARD_SIZE ] ;
        lifeCount += creation[  i + ( BOARD_SIZE  - 1 )] ;
        lifeCount += creation[  i + ( BOARD_SIZE  + 1) ];

      } else if ( i > BOARD_SIZE * BOARD_HEIGHT - BOARD_SIZE ) {

        var p = i - BOARD_SIZE * BOARD_HEIGHT + BOARD_SIZE;

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
          deaths += 1;
        }
        else if ( lifeCount == 2 || lifeCount == 3 ) {
          nextStep[i] = 1;
          living += 1;
        }
      } else {
        if ( lifeCount == 3 ) {
          nextStep[i] = 1;
          births += 1;
        }  else {
          // by default dead cells stay dead	
          // basically copy this to the next 
          // genration
          nextStep[i] = 0;
        }
      }
    }

    drawBoard(nextStep);

    // copy current state of array
    generations += 1;
    creation = nextStep.slice();

    $("#generations").text(generations);
    $("#births").text(births);
    $("#living").text(living);
    $("#deaths").text(deaths);

    if ( alive == living ) {

      no_change += 1;

      $("#living").addClass("almost");
      if ( no_change >= evo_gap ) {

        clearInterval( drawTimer );

        $("#generations").text(generations - evo_gap);
        $("#living").removeClass("almost");
        $("#living, #generations").addClass("green");

      }

    } else {
      // set global live count to current
      alive = living;
      // reset
      no_change = 0;		
      $("#living").removeClass("almost");
    }
  }


  function drawBoard(cells) {
    var canvas = document.getElementById("c");
    var context = canvas.getContext("2d");
    var x = 0;
    var y = 0;
    var p = 0; // piece count
    var c = 0;
    for	(var index = 0; index < cells.length; index++) {

      if (cells[index] == 1) {
        context.fillStyle = "#ffffff";
        context.fillRect(x, y, cell_size,cell_size);


      } else { 
        if ( y > BOARD_HEIGHT * cell_size - 400 ) {
          context.fillStyle = "rgb(0, 0, " + c + ")";
        } else {
          context.fillStyle = "rgb(0, 0, 0)";

        }

        context.fillRect(x, y, cell_size,cell_size); 
      }
      x += cell_size;
      p += 1; // next piece
      if (p == BOARD_SIZE) {
        // start next line
        y += cell_size;
        x = 0;
        p = 0;
        if ( c <= 255 && y > BOARD_HEIGHT * cell_size - 400  ) {
          c += 1;
        }
      } 
    }
  }

});
