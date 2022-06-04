$(document).ready(function() {
  makeFullScreen();

  var timer;
  var generations = 0;
  var howManyAlive = 0;
  var cyclesWithoutChanges = 0;

  // evolutionThreshold : After how many generations has the evolution
  // obviously stopped
  const evolutionThreshold = 40;

  const CELL_SIZE = 6;
  const BOARD_SIZE = Math.floor($("#c").width() / CELL_SIZE);
  const BOARD_HEIGHT = Math.floor($("#c").height() / CELL_SIZE);

  setupControls();
  startMainLoop();

  //
  // Seed
  //
  var world = new Array(BOARD_SIZE * BOARD_HEIGHT);
  var current = new Array(BOARD_SIZE * BOARD_HEIGHT);

  spreadLivingCellsAtRandom();

  function nextEvolutionCycle() {
    var aliveInCycle = 0;
    var births = 0;
    var deaths = 0;
    var lifeCount = 0;

    for (var i = 0; i < world.length; i++) {
      const cellIsAlive = world[i];
      lifeCount = 0;
      // Count live and make world without
      // borders
      if (i < BOARD_SIZE) {
        var pointer = BOARD_SIZE * BOARD_HEIGHT - i;

        lifeCount = world[pointer - 1];
        lifeCount += world[pointer - BOARD_SIZE];
        lifeCount += world[pointer - (BOARD_SIZE - 1)];
        lifeCount += world[pointer - (BOARD_SIZE + 1)];
        lifeCount += world[i + 1];
        lifeCount += world[i + BOARD_SIZE];
        lifeCount += world[i + (BOARD_SIZE - 1)];
        lifeCount += world[i + (BOARD_SIZE + 1)];
      } else if (i > BOARD_SIZE * BOARD_HEIGHT - BOARD_SIZE) {
        var pointer = i - BOARD_SIZE * BOARD_HEIGHT + BOARD_SIZE;

        lifeCount = world[i - 1];
        lifeCount += world[i - BOARD_SIZE];
        lifeCount += world[i - (BOARD_SIZE - 1)];
        lifeCount += world[i - (BOARD_SIZE + 1)];
        lifeCount += world[i + 1];
        lifeCount += world[pointer + BOARD_SIZE];
        lifeCount += world[pointer + (BOARD_SIZE - 1)];
        lifeCount += world[pointer + (BOARD_SIZE + 1)];
      } else {
        lifeCount = world[i - 1];
        lifeCount += world[i - BOARD_SIZE];
        lifeCount += world[i - (BOARD_SIZE - 1)];
        lifeCount += world[i - (BOARD_SIZE + 1)];
        lifeCount += world[i + 1];
        lifeCount += world[i + BOARD_SIZE];
        lifeCount += world[i + (BOARD_SIZE - 1)];
        lifeCount += world[i + (BOARD_SIZE + 1)];
      }

      if (cellIsAlive) {
        if (lifeCount < 2 || lifeCount > 3) {
          killCell(i);
        } else if (lifeCount == 2 || lifeCount == 3) {
          current[i] = 1;
          aliveInCycle += 1;
        }
      } else {
        if (lifeCount == 3) {
          current[i] = 1;
          births += 1;
        } else {
          // by default dead cells stay dead
          // basically copy this to the next
          // genration
          current[i] = 0;
        }
      }
    }

    drawBoard(current);
    updateWorld();

    if (howManyAlive === aliveInCycle) {
      recordCycleWithoutChanges();
      if (cyclesWithoutChanges >= evolutionThreshold) {
        evolutionHasStopped();
      }
    } else {
      // set global live count to current
      howManyAlive = aliveInCycle;
      // reset
      cyclesWithoutChanges = 0;
      $("#living").removeClass("almost");
    }

    updateStats(births, aliveInCycle, deaths);
  }

  function updateWorld() {
    generations += 1;
    world = current.slice();
  }

  function killCell(cellNumber) {
    current[cellNumber] = 0;
    deaths += 1;
  }

  function evolutionHasStopped() {
    clearInterval(timer);
    $("#generations").text(generations - evolutionThreshold);
    $("#living").removeClass("almost");
    $("#living, #generations").addClass("green");
  }

  function recordCycleWithoutChanges() {
    cyclesWithoutChanges += 1;
    $("#living").addClass("almost");
  }

  function updateStats(births, aliveInCycle, deaths) {
    $("#generations").text(generations);
    $("#births").text(births);
    $("#living").text(aliveInCycle);
    $("#deaths").text(deaths);
  }

  function setupControls() {
    $("#stop").click(function() {
      clearInterval(timer);
    });
    $("#step").click(function() {
      nextEvolutionCycle();
    });
    $("#resume").click(function() {
      startMainLoop();
    });
    $("#reset").click(function() {
      location.reload();
    });
  }

  function spreadLivingCellsAtRandom() {
    for (var i = 0; i < world.length; i++) {
      world[i] = Math.round(Math.random());
    }
  }

  function startMainLoop() {
    timer = setInterval(function() {
      nextEvolutionCycle();
    }, 1);
  }

  function makeFullScreen() {
    var innerHeight = window.innerHeight;

    $("#c").attr("width", window.innerWidth);
    $("#c").attr("height", innerHeight);
  }

  function drawBoard(cells) {
    var canvas = document.getElementById("c");
    var context = canvas.getContext("2d");
    var x = 0;
    var y = 0;
    var p = 0; // piece count
    var c = 0;
    for (var index = 0; index < cells.length; index++) {
      if (cells[index] == 1) {
        context.fillStyle = "#ffffff";
        context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      } else {
        if (y > BOARD_HEIGHT * CELL_SIZE - 400) {
          context.fillStyle = "rgb(0, 0, " + c + ")";
        } else {
          context.fillStyle = "rgb(0, 0, 0)";
        }

        context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      }
      x += CELL_SIZE;
      p += 1; // next piece
      if (p == BOARD_SIZE) {
        // start next line
        y += CELL_SIZE;
        x = 0;
        p = 0;
        if (c <= 255 && y > BOARD_HEIGHT * CELL_SIZE - 400) {
          c += 1;
        }
      }
    }
  }
});
