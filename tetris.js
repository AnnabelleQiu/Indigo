let board = [];
const rows = 16;
const cols = 30;
const minesCount = 99;
let mineLocations = [];
let revealedCount = 0;
let flagCount = 0;
let gameOver = false;
let timerInterval;
let time = 0;

function init() {
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = '000';
    time = 0;
    gameOver = false;
    revealedCount = 0;
    flagCount = 0;
    mineLocations = [];
    board = Array.from({ length: rows }, () => Array(cols).fill({ revealed: false, mine: false, flag: false, adjacent: 0 }));
    document.getElementById('board').innerHTML = '';
    document.getElementById('reset-btn').textContent = '😊';
    document.getElementById('mines-count').textContent = '099';
    generateMines();
    calculateAdjacents();
    createBoard();
}

function generateMines() {
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            mineLocations.push({ row, col });
            minesPlaced++;
        }
    }
}

function calculateAdjacents() {
    for (const { row, col } of mineLocations) {
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < rows && c >= 0 && c < cols && !board[r][c].mine) {
                    board[r][c].adjacent++;
                }
            }
        }
    }
}

function createBoard() {
    const boardElement = document.getElementById('board');
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => revealCell(row, col));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagCell(row, col);
            });
            boardElement.appendChild(cell);
        }
    }
}

function revealCell(row, col) {
    if (gameOver || board[row][col].flag || board[row][col].revealed) return;
    if (!timerInterval) startTimer();
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    if (board[row][col].mine) {
        cell.classList.add('bomb');
        endGame(false);
        return;
    }
    board[row][col].revealed = true;
    revealedCount++;
    cell.classList.add('revealed');
    if (board[row][col].adjacent > 0) {
        cell.textContent = board[row][col].adjacent;
    } else {
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < rows && c >= 0 && c < cols) {
                    revealCell(r, c);
                }
            }
        }
    }
    if (revealedCount + minesCount === rows * cols) endGame(true);
}

function flagCell(row, col) {
    if (gameOver || board[row][col].revealed) return;
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    if (board[row][col].flag) {
        cell.classList.remove('flagged');
        board[row][col].flag = false;
        flagCount--;
    } else {
        cell.classList.add('flagged');
        board[row][col].flag = true;
        flagCount++;
    }
    document.getElementById('mines-count').textContent = String(minesCount - flagCount).padStart(3, '0');
}

function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        document.getElementById('timer').textContent = String(time).padStart(3, '0');
    }, 1000);
}

function endGame(won) {
    gameOver = true;
    clearInterval(timerInterval);
    document.getElementById('reset-btn').textContent = won ? '😎' : '😵';
    if (!won) {
        for (const { row, col } of mineLocations) {
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            if (!cell.classList.contains('flagged')) cell.classList.add('bomb');
        }
    }
}

init();
