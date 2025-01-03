const gameboard = (function Gameboard() {
  const rows = 3;
  const columns = rows;
  const board = [];

  // 2D array represents the state of the game board
  // Row 0 represents the top row and
  // Column 0 represents the left-most column.

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const makeAmove = (row, column, player) => {
    // Check if the cell is already occupied.
    if (board[row][column].getValue() !== 0) return false;

    board[row][column].addToken(player);
  };

  const boardIsFull = () => {
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (board[row][column].getValue() === 0) {
          return false;
        }
      }
    }
    return true;
  };

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j].addToken(0);
      }
    }
  };

  // Provide an interface for the rest of our
  // application to interact with the board
  return { getBoard, makeAmove, boardIsFull, resetBoard };
})();

function Cell() {
  let value = 0;

  // Accept a player's token to change the value of the cell
  const addToken = (player) => {
    value = player;
  };

  // Retrieve the current value of the cell through closure
  const getValue = () => value;

  return {
    addToken,
    getValue,
  };
}

const game = (function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const players = [
    {
      name: playerOneName,
      token: "1",
    },
    {
      name: playerTwoName,
      token: "2",
    },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const checkForWinner = () => {
    const board = gameboard.getBoard();

    for (let i = 0; i < 3; i++) {
      if (
        board[i][0].getValue() === activePlayer.token &&
        board[i][1].getValue() === activePlayer.token &&
        board[i][2].getValue() === activePlayer.token
      ) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (
        board[0][i].getValue() === activePlayer.token &&
        board[1][i].getValue() === activePlayer.token &&
        board[2][i].getValue() === activePlayer.token
      ) {
        return true;
      }
    }

    if (
      board[0][0].getValue() === activePlayer.token &&
      board[1][1].getValue() === activePlayer.token &&
      board[2][2].getValue() === activePlayer.token
    ) {
      return true;
    }

    if (
      board[0][2].getValue() === activePlayer.token &&
      board[1][1].getValue() === activePlayer.token &&
      board[2][0].getValue() === activePlayer.token
    ) {
      return true;
    }

    return false;
  };

  // CONSOLE LOGS MUST GO. THEY SERVED THEIR PURPOSE

  const playRound = (row, column) => {
    const result = gameboard.makeAmove(row, column, getActivePlayer().token);

    if (result === false) {
      interface.showPopup("Invalid move. Please choose an empty cell.");
      return;
    }

    if (gameboard.boardIsFull()) {
      interface.showPopup("It's a draw!");
      gameboard.resetBoard();
      return;
    } else if (checkForWinner()) {
      interface.showPopup(`${getActivePlayer().name} wins!`);
      gameboard.resetBoard();
      return;
    } else {
      switchPlayerTurn();
      interface.printNewRound();
    }
  };

  return {
    playRound,
    getActivePlayer,
  };
})();

const interface = (function ScreenController() {
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = gameboard.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    // Render board squares
    board.forEach((row) => {
      row.forEach((cell, index) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the row & column
        // This makes it easier to pass into our `playRound` function
        cellButton.dataset.row = board.indexOf(row);
        cellButton.dataset.column = index;
        cellButton.dataset.player = cell.getValue();
        if (cellButton.dataset.player === "1") {
          cellButton.textContent = "x";
        } else if (cellButton.dataset.player === "2") {
          cellButton.textContent = "o";
        }
        boardDiv.appendChild(cellButton);
      });
    });
  };

  const showPopup = (message) => {
    const container = document.getElementById("popup-container");
    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.textContent = message;

    container.appendChild(popup);

    // Fade out after 3 seconds
    setTimeout(() => {
      popup.style.opacity = "0";
      setTimeout(() => {
        popup.remove();
      }, 1000); // Wait for fade out to complete before removing
    }, 3000);
  };

  const printNewRound = () => {
    showPopup(`${game.getActivePlayer().name}'s turn.`);
  };

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    // Make sure I've clicked a cell and not the gaps in between
    if (!selectedRow && !selectedColumn) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();
  showPopup("Let the game begin! Player One, go!");
  return { showPopup, printNewRound };
})();
