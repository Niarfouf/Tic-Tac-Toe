function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;
    const markCell = (row, column, player) => {
        const targetedCell = board[row][column].getValue()
        if (targetedCell) return false;
        board[row][column].addPlayerSign(player)
        return true
    }
    const printBoard = () => {
        const boardWithMarkedCell = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithMarkedCell)
    }
    return {getBoard, markCell, printBoard}
}

function Cell() {
    let value = "";

    const addPlayerSign = (player) => {
        value = player;
    }
    const getValue = () => value;

    return {addPlayerSign, getValue}
}

function GameController(playerOne = "Player One", playerTwo = "Player Two") {
    const board = Gameboard()
    const players = [{name: playerOne, sign: "x"}, {name: playerTwo, sign: "o"}]
    let currentPlayer = players[0]
    const switchPlayer = () => {
        if (currentPlayer === players[0]) {
            currentPlayer = players[1]
        } else {
            currentPlayer = players[0]
        }
    }
    const checkWinner = () => {
 //checking if row win
    let actualBoard = board.getBoard()
        for (let i = 0; i < 3; i++) {
            let score = 0;
            for (let j = 0; j < 3; j++) {
                if (actualBoard[i][j].getValue() === getCurrentPlayer().sign) {
                    score++
                }
            }
            if (score === 3) {
                console.log(`${getCurrentPlayer().name} has won!`)
                return true
            }
        }
//checking if column win
        for (let j = 0; j < 3; j++) {
            let score = 0;
            for (let i = 0; i < 3; i++) {
                if (actualBoard[i][j].getValue() === getCurrentPlayer().sign) {
                    score++
                }
            }
            if (score === 3) {
                console.log(`${getCurrentPlayer().name} has won!`)
                return true
            }
        }
//checking if diag win
        if (getCurrentPlayer().sign === actualBoard[0][0].getValue() && getCurrentPlayer().sign === actualBoard[1][1].getValue() && getCurrentPlayer().sign === actualBoard[2][2].getValue()) {
            console.log(`${getCurrentPlayer().name} has won!`)
            return true
        }
        if (getCurrentPlayer().sign === actualBoard[2][0].getValue() && getCurrentPlayer().sign === actualBoard[1][1].getValue() && getCurrentPlayer().sign === actualBoard[0][2].getValue()) {
            console.log(`${getCurrentPlayer().name} has won!`)
            return true
        }
    }
    const getCurrentPlayer = () => currentPlayer
    const printNewRound = () => {
        board.printBoard();
        console.log(`${getCurrentPlayer().name}'s turn.`);
      };
    const playRound = (row, column) => {
        let count = 0
        console.log(
            `Marking ${getCurrentPlayer().name}'s sign into row/column ${row}/${column}...`
        );
        if(!board.markCell(row, column, getCurrentPlayer().sign)) {
            console.log("invalid move")
            printNewRound();
            return
        };
        count++;
        
        if(checkWinner()) {
            return;}
        if (count === 9) {
            console.log(`It's a tie...`);
            return
        }
        switchPlayer();
        printNewRound();
        
    };
    printNewRound();
    return {playRound, getCurrentPlayer, getBoard: board.getBoard};
}

function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
  
    const updateScreen = () => {
      // clear the board
      boardDiv.textContent = "";
  
      // get the newest version of the board and player turn
      const board = game.getBoard();
      const currentPlayer = game.getCurrentPlayer();
  
      // Display player's turn
      playerTurnDiv.textContent = `${currentPlayer.name}'s turn...`
  
      // Render board squares
      board.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          // Anything clickable should be a button!!
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          // Create a data attribute to identify the column
          // This makes it easier to pass into our `playRound` function 
          cellButton.dataset.row = rowIndex
          cellButton.dataset.column = columnIndex
          cellButton.textContent = cell.getValue();
          boardDiv.appendChild(cellButton);
        })
      })
    }
  
    // Add event listener for the board
    function clickHandlerBoard(e) {
      const selectedColumn = e.target.dataset.column;
      const selectedRow = e.target.dataset.row;

      // Make sure I've clicked a column and not the gaps in between
      if (!selectedColumn || !selectedRow) return;
      
      game.playRound(selectedRow, selectedColumn);
      updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
  
    // Initial render
    updateScreen();
  
    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
  }
  
  ScreenController();