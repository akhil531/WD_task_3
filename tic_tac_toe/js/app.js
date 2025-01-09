document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const modeSelector = document.getElementById('mode');
    const turnElement = document.getElementById('turn');
    const statusElement = document.getElementById('status');
    const playerXScoreElement = document.getElementById('playerXScore');
    const playerOScoreElement = document.getElementById('playerOScore');
    const modalElement = document.getElementById('modal');
    const modalMessageElement = document.getElementById('modal-message');
    const playAgainButton = document.getElementById('play-again');

    let board, currentPlayer, gameActive, playerMode, playerXScore = 0, playerOScore = 0;

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const resetGame = () => {
        board = Array(9).fill('');
        currentPlayer = 'X';
        gameActive = true;
        statusElement.textContent = '';
        renderBoard();
        if (playerMode === 'pva' && currentPlayer === 'O') makeAIMove();
    };

    const renderBoard = () => {
        boardElement.innerHTML = '';
        board.forEach((cell, index) => {
            const div = document.createElement('div');
            div.className = 'cell';
            div.textContent = cell;
            div.addEventListener('click', () => handleMove(index));
            boardElement.appendChild(div);
        });
        turnElement.textContent = `Turn: Player ${currentPlayer}`;
    };

    const handleMove = (index) => {
        if (!gameActive || board[index]) return;
        board[index] = currentPlayer;
        renderBoard();
        const winner = checkWinner();
        if (winner) return endGame(`${winner} Wins!`);
        if (board.every(cell => cell)) return endGame('Draw!');
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (playerMode === 'pva' && currentPlayer === 'O') makeAIMove();
    };

    const checkWinner = () => {
        return winPatterns.find(pattern => 
            board[pattern[0]] && board[pattern[0]] === board[pattern[1]] && board[pattern[1]] === board[pattern[2]]
        ) ? currentPlayer : null;
    };

    const endGame = (message) => {
        gameActive = false;
        statusElement.textContent = message;
        modalMessageElement.textContent = message;
        modalElement.style.display = 'flex';
        if (message.includes('Wins')) currentPlayer === 'X' ? playerXScore++ : playerOScore++;
        updateScores();
    };

    const updateScores = () => {
        playerXScoreElement.textContent = `Player X: ${playerXScore}`;
        playerOScoreElement.textContent = `Player O: ${playerOScore}`;
    };

    const makeAIMove = () => {
        const emptyCells = board.map((cell, idx) => cell === '' ? idx : null).filter(idx => idx !== null);
        const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        handleMove(randomMove);
    };

    modeSelector.addEventListener('change', () => {
        playerMode = modeSelector.value;
        playerXScore = playerOScore = 0;
        updateScores();
        resetGame();
    });

    playAgainButton.addEventListener('click', () => {
        modalElement.style.display = 'none';
        resetGame();
    });

    resetGame();
});
