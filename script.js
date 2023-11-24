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
    
    return {getBoard, markCell}
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
    let count = 0
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
                
                return true
            }
        }
//checking if diag win
        if (getCurrentPlayer().sign === actualBoard[0][0].getValue() && getCurrentPlayer().sign === actualBoard[1][1].getValue() && getCurrentPlayer().sign === actualBoard[2][2].getValue()) {
            
            return true
        }
        if (getCurrentPlayer().sign === actualBoard[2][0].getValue() && getCurrentPlayer().sign === actualBoard[1][1].getValue() && getCurrentPlayer().sign === actualBoard[0][2].getValue()) {
            
            return true
        }
    }
    const getCurrentPlayer = () => currentPlayer
    
    const playRound = (row, column) => {
        
        if(!board.markCell(row, column, getCurrentPlayer().sign)) {
            
            return true
        };
        count++;
        
        if(checkWinner()) {
            const playerTurnDiv = document.querySelector('.turn');
            playerTurnDiv.textContent = `${currentPlayer.name} has won!`
            return false;
        }
        if (count === 9) {
            const playerTurnDiv = document.querySelector('.turn');
            playerTurnDiv.textContent = `It's a tie nobody won!`
            return false
        }
        switchPlayer();
        return true
        
        
    };
    
    return {playRound, getCurrentPlayer, getBoard: board.getBoard};
}

function ScreenController() {
    let game = GameController();
    let result = true
    const playerTurnDiv = document.querySelector('.turn');
    const nameForm = document.querySelector("#players-name")
    const playerOneDiv = document.querySelector('.player-one');
    const playerTwoDiv = document.querySelector('.player-two');
    const boardDiv = document.querySelector('.board');
    const formDiv = document.querySelector(".form")
    const restartDiv = document.querySelector(".restart")
    
    nameForm.addEventListener("submit", (e) => {
        e.preventDefault()
        playerTurnDiv.style.visibility = "visible";
        const playerOneName = e.target.player1.value ? e.target.player1.value : "Player One"
        const playerTwoName = e.target.player2.value ? e.target.player2.value : "Player Two"
        game = GameController(playerOneName, playerTwoName);
        updateScreen();

        boardDiv.addEventListener("click", clickHandlerBoard);
        
        formDiv.textContent = `${playerOneName} VS ${playerTwoName}`
        const restartGame = document.createElement("button")
        restartGame.textContent = "Restart"

        restartGame.addEventListener("click", () => {
            game = GameController(playerOneName, playerTwoName);
            result = true
            updateScreen();
        })
        restartDiv.appendChild(restartGame)
        playerOneDiv.textContent = playerOneName + " : X"
        playerTwoDiv.textContent = playerTwoName + " : O"
    })
    const updateScreen = () => {
      // clear the board
      boardDiv.textContent = "";
  
      // get the newest version of the board and player turn
      const board = game.getBoard();
      const currentPlayer = game.getCurrentPlayer();
  
      // Display player's turn
      const playerTurnDiv = document.querySelector('.turn');
      if (playerTurnDiv && result) {
        playerTurnDiv.textContent = `${currentPlayer.name}'s turn...`
      }
      
  
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
      if (result) {
        result = game.playRound(selectedRow, selectedColumn)
        updateScreen();
      }
      
    }
    
    
  
    // Initial render
    updateScreen();
  
    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
  }
  
  ScreenController();