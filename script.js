$(document).ready(function() {
    const ROWS = 6;
    const COLS = 7;
    let currentPlayer = "red";
    let board = [];
    let moveHistory = [];

    // Initialise le tableau de jeu
    for (let i = 0; i < ROWS; i++) {
      board[i] = [];
      for (let j = 0; j < COLS; j++) {
        board[i][j] = null;
      }
    }

    // Crée le plateau de jeu dans le DOM
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        let cell = $("<div>").addClass("cell").data("row", i).data("col", j);
        $("#board").append(cell);
      }
    }

    $(".cell").on("click", function() {
      let row = $(this).data("row");
      let col = $(this).data("col");

      if (board[row][col] === null) {
        let emptyRow = findEmptyRow(col);

        if (emptyRow !== -1) {
          board[emptyRow][col] = currentPlayer;
          let cell = $(".cell").filter(function() {
            return $(this).data("row") == emptyRow && $(this).data("col") == col;
          });
          cell.css("background-color", currentPlayer);

          moveHistory.push({ row: emptyRow, col: col });

          // Remplacez la section setTimeout avec ce code
            if (checkWin(emptyRow, col, currentPlayer)) {
            $("#winner-message").html(`${currentPlayer.toUpperCase()} a gagné !`)
            $("#winner-image").attr("src", currentPlayer === "red" ? "19j64q.jpg" : "4138819.jpg");
            $("#modal").css("display", "block");
              } else {
            currentPlayer = currentPlayer === "red" ? "yellow" : "red";
              }
              $("#close-modal").on("click", function() {
                $("#modal").css("display", "none");
                location.reload();
              });

        }
      }
      updateStatus();
    });

    function updateStatus() {
      $("#current-player").text(currentPlayer);
      $("#player-indicator").css("background-color", currentPlayer);
    }

    updateStatus();

    function findEmptyRow(col) {
      for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === null) {
          return row;
        }
      }
      return -1;
    }

    function checkWin(row, col, player) {
      return (
        checkDirection(row, col, player, 1, 0) ||  // horizontal
        checkDirection(row, col, player, 0, 1) ||  // vertical
        checkDirection(row, col, player, 1, 1) || // diagonale bas-droite
        checkDirection(row, col, player, 1, -1)   // diagonale haut-droite
      );
    }

    function checkDirection(row, col, player, dirRow, dirCol) {
      let count = 1;

      // Vérifie les jetons dans une direction
      for (let i = 1; i < 4; i++) {
        let newRow = row + dirRow * i;
        let newCol = col + dirCol * i;

        if (
          newRow >= 0 &&
          newRow < ROWS &&
          newCol >= 0 &&
          newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          count++;
        } else {
          break;
        }
      }
      // Vérifie les jetons dans la direction opposée
      for (let i = 1; i < 4; i++) {
        let newRow = row - dirRow * i;
        let newCol = col - dirCol * i;

        if (
          newRow >= 0 &&
          newRow < ROWS &&
          newCol >= 0 &&
          newCol < COLS &&
          board[newRow][newCol] === player
        ) {
          count++;
        } else {
          break;
        }
      }

      return count >= 4;
    }

    // Fonction pour gérer le bouton "Rejouer"
    $("#replay").on("click", function() {
      location.reload();
    });

    // Fonction pour gérer le bouton "Annuler"
    $("#undo").on("click", function() {
      if (moveHistory.length > 0) {
        let lastMove = moveHistory.pop();
        let row = lastMove.row;
        let col = lastMove.col;

        board[row][col] = null;
        let cell = $(cell).filter(function() {
          return $(this).data("row") == row && $(this).data("col") == col;
        });
        cell.css("background-color", "white");

        currentPlayer = currentPlayer === "red" ? "yellow" : "red";
        updateStatus();
      }
    });
  });