const gameboard = (function Gameboard() {
  const rows = 3;
  const columns = rows;
  const board = [];

  // 2d array represents the state of the game board
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
    return console.log(`Token ${player} added to row ${row}, column ${column}`);
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

  // Print board to console. Not needed in UI version. TBRemoved
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  // Provide an interface for the rest of our
  // application to interact with the board
  return { getBoard, makeAmove, printBoard, boardIsFull };
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

  const printNewRound = () => {
    gameboard.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

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

  const playRound = (row, column) => {
    console.log(
      `Dropping ${
        getActivePlayer().name
      }'s token into row ${row}, column ${column}...`
    );
    const result = gameboard.makeAmove(row, column, getActivePlayer().token);

    if (result === false) {
      console.log("Invalid move. Please choose an empty cell.");
      return;
    }

    if (gameboard.boardIsFull()) {
      console.log("It's a draw!");
      return;
    } else if (checkForWinner()) {
      console.log(`${getActivePlayer().name} wins!`);
      return;
    } else {
      switchPlayerTurn();
      printNewRound();
    }
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
  };
})();
