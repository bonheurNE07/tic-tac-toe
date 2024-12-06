const Gameboard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setCell = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false
    }; 

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return {getBoard, setCell, resetBoard};
})();

const Player = (name, marker) => ({name, marker});


const GameController = (function() {
    let player1;
    let player2;
    let currentPlayer;
    let isGameOver = false;

    const initPlayers = (name1, name2) => {
        player1 = Player(name1 || "Player 1", "X");
        player2 = Player(name2 || "Player 2", "O");
        currentPlayer = player1;
        isGameOver = false;
    };

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWin = (board) => {
        const winPatterns = [
            [0, 1, 2],[3, 4, 5],[6, 7, 8],
            [0, 3, 6],[1, 4, 7],[2, 5, 8],
            [0, 4, 8],[2, 4, 6]
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]){
                return currentPlayer.name;
            }
        }
        return board.includes("") ? null : "Ties";
    };

    const playTurn = (index) => {
        if (!isGameOver && Gameboard.setCell(index, currentPlayer.marker)) {
            const result = checkWin(Gameboard.getBoard());
            if (result) {
                isGameOver = true;
                return result;
            }
            switchTurn();
        } 
        return null;
    };

    const getCurrentPlayer = () => currentPlayer;

    return { initPlayers, playTurn, getCurrentPlayer };
})();

const DisplayController = (function() {
    const gameContainer = document.getElementById("game-container");
    const statusDisplay = document.getElementById("game-status");
    const restartBtn = document.getElementById("restart-btn");
    const startBtn = document.getElementById("start-btn");
    const playerInputs = document.getElementById("player-inputs");
    const gameSection = document.getElementById("game-section");

    const renderBoard = () => {
        gameContainer.innerHTML = "";
        Gameboard.getBoard().forEach((cell, index) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.textContent = cell;
            cellDiv.addEventListener("click", () => handleCellClick(index));
            gameContainer.appendChild(cellDiv);
        });
    };

    const handleCellClick = (index) => {
        const result = GameController.playTurn(index);
        renderBoard();
        updateStatus(result);
    };

    const updateStatus = (result) => {
        if (result) {
            if (result === "Tie") {
                statusDisplay.textContent = "It's a tie!";
            } else {
                statusDisplay.textContent = `${result} wins!`;
            }
        } else {
            const currentPlayer = GameController.getCurrentPlayer();
            statusDisplay.textContent = `Current Player: ${currentPlayer.name} (${currentPlayer.marker})`;
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        renderBoard();
        updateStatus();
    };

    const startGame = () => {
        const name1 = document.getElementById("player1").value;
        const name2 = document.getElementById("player2").value;
        GameController.initPlayers(name1, name2);
        playerInputs.style.display = "none";
        gameSection.style.display = "block";
        resetGame();
    };

    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", resetGame);

    return { renderBoard, updateStatus };
})();

DisplayController.renderBoard();
DisplayController.updateSatus();