// define the game grid dimensions and the number of mines as regular variables
let WIDTH = 8;
let HEIGHT = 8;
let NUM_MINES = 10;
let userLost = false;

/* add the gameOver variable here */
let gameOver = false;
let gameOverElement = document.getElementById('game-over');

/* add the minesLeft variable here and initialize it to the total number of mines */
let minesLeft = NUM_MINES;
/* add the minesLeftElement variable here and initialize it to null */
let minesLeftElement = null;
let firstMove = true;
let timer = 0;
let timePass = 0;
let timerElement = null;
let timerID = null;
let intervalDuration = 1000;
/* add the score variable here */
let score = 0;
let scoreElement = document.getElementById('score');
let isRunning = false;
// define a function to reveal a cell
function continuetimerCallBack(){
    timePass += intervalDuration/1000;
    timerElement.textContent = timePass;
}

function startTimer(){
    if(!isRunning){
        intervalID = setInterval(continuetimerCallBack, intervalDuration);

        isRunning = true;
    }
}

function resetTimer(){
    clearInterval(intervalID)
    timepass = 0;
    isRunning = false;
}

function resumeTimer(){
    if(!isRunning){
        intervalID = setInterval(continuetimerCallBack, intervalDuration);
        isRunning = true;
    }
}

function stopTimer(){
    if(isRunning){
        clearInterval(intervalID);
        isRunning = false;
    }
}
function reveal(x, y) {
    // Start the timer
    if(!isRunning) {
        startTimer();
    }
    if (grid[x][y].isFlagged || grid[x][y].isRevealed || gameOver) {
        return;
    }

    grid[x][y].isRevealed = true;

    if (firstMove && !gameOver) {
        firstMove = false;

        if (grid[x][y].isMine) {
            let freeCells = [];
            for (let i = 0; i < WIDTH; i++) {
                for (let j = 0; j < HEIGHT; j++) {
                    if (!grid[i][j].isMine) {
                        freeCells.push({ x: i, y: j });
                    }
                }
            }

            let newLocation = freeCells[Math.floor(Math.random() * freeCells.length)];
            grid[x][y].isMine = false;
            grid[newLocation.x][newLocation.y].isMine = true;

            // Recalculate surrounding mine counts
            for (let i = 0; i < WIDTH; i++) {
                for (let j = 0; j < HEIGHT; j++) {
                    grid[i][j].surroundingMines = 0;
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dy = -1; dy <= 1; dy++) {
                            if (i + dx >= 0 && i + dx < WIDTH && j + dy >= 0 && j + dy < HEIGHT) {
                                if (grid[i + dx][j + dy].isMine) {
                                    grid[i][j].surroundingMines++;
                                }
                            }
                        }
                    }
                }
            }
        }

        
    }

    if (grid[x][y].isMine) {
        gameOver = true;

        /* create and display the "Game Over" message */
        setTimeout(displayGameOverMessage, 2000);

        // Clear the timer interval
        clearInterval(timerID);

        return;
    }

    if (!grid[x][y].isMine) {
        score += 10; // Increase score by 10 for each revealed cell
        scoreElement.textContent = score;
    }

    let remaining = 0;
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (!grid[x][y].isRevealed && !grid[x][y].isFlagged) {
                remaining++;
            }
        }
    }

    if (remaining === 0 && !gameOver) {
        gameOver = true;

        /* create and display the "All clear!" message */
        displayAllClearMessage();

        // Clear the timer interval
        clearInterval(timerID);
        return;
    }

    if (grid[x][y].surroundingMines === 0) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (x + dx >= 0 && x + dx < WIDTH && y + dy >= 0 && y + dy < HEIGHT) {
                    reveal(x + dx, y + dy);
                }
            }
        }
    }
}

// define a function to flag a cell
function flag(x, y) {
    if (grid[x][y].isRevealed) {
        return;
    }
    if (grid[x][y].isFlagged) {
        minesLeft++;
        grid[x][y].isFlagged = false;
    } else {
        if (minesLeft > 0) { // 防止负数
            minesLeft--;
            grid[x][y].isFlagged = true;
        }
    }

    let flags = 0;
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (grid[x][y].isFlagged) {
                flags++;
            }
        }
    }

    if (flags === NUM_MINES) {
        let remaining = 0;
        for (let x = 0; x < WIDTH; x++) {
            for (let y = 0; y < HEIGHT; y++) {
                if (!grid[x][y].isRevealed && !grid[x][y].isFlagged) {
                    remaining++;
                }
            }
        }

        if (remaining === 0 && !gameOver) {
            gameOver = true;
            displayAllClearMessage();
        }
    }

    // 更新 minesLeft 显示
    minesLeftElement = document.getElementById('minesLeft');
    minesLeftElement.textContent = minesLeft.toString();
    if (minesLeft <= 3) {
        minesLeftElement.classList.add('pink');
        minesLeftElement.classList.add('blink');
    } else {
        minesLeftElement.classList.remove('pink');
        minesLeftElement.classList.remove('blink')
    }

    if (minesLeft === 0) {
        alert("No Flags Left!");
    }
}

function rightClick(x, y) {
    if (grid[x][y].isRevealed && !grid[x][y].isFlagged && !gameOver) {
        let flagged = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (x + dx >= 0 && x + dx < WIDTH && y + dy >= 0 && y + dy < HEIGHT) {
                    if (grid[x + dx][y + dy].isFlagged) {
                        flagged++;
                    }
                }
            }
        }

        if (flagged === grid[x][y].surroundingMines) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    if (x + dx >= 0 && x + dx < WIDTH && y + dy >= 0 && y + dy < HEIGHT) {
                        if (!grid[x + dx][y + dy].isFlagged && !grid[x + dx][y + dy].isRevealed) {
                            reveal(x + dx, y + dy);
                        }
                    }
                }
            }
        }
    }
}

function init(width, height) {
    // Get the grid element
    const gridElement = document.querySelector('.grid');

    // Set the initial grid dimensions
    gridElement.style.width = `${width * 30}px`;
    gridElement.style.height = `${height * 30}px`;

    // create the game grid
    grid = new Array(WIDTH);
    for (let i = 0; i < WIDTH; i++) {
        grid[i] = new Array(HEIGHT);
    }

    // initialize the game grid
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            grid[x][y] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                surroundingMines: 0
            };
        }
    }


    // place the mines in random locations
    for (let i = 0; i < NUM_MINES; i++) {
        let x = Math.floor(Math.random() * WIDTH);
        let y = Math.floor(Math.random() * HEIGHT);
        if (grid[x][y].isMine) {
            i--;
        } else {
            grid[x][y].isMine = true;
        }
    }

    // calculate the number of surrounding mines for each cell
    for (let x = 0; x < WIDTH; x++) {
        for (let y = 0; y < HEIGHT; y++) {
            if (!grid[x][y].isMine) {
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (x + dx >= 0 && x + dx < WIDTH && y + dy >= 0 && y + dy < HEIGHT) {
                            if (grid[x + dx][y + dy].isMine) {
                                grid[x][y].surroundingMines++;
                            }
                        }
                    }
                }
            }
        }
    }

    // create the game grid
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const cellElement = document.createElement('div');
                       cellElement.classList.add('cell');
            cellElement.classList.add('hidden');
            cellElement.addEventListener('click', () => {
                /* check the gameOver variable here and return immediately if it is true */
                if (gameOver) {
                    return;
                }
                reveal(x, y);
                render(gridElement);
            });
            cellElement.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                /* check the gameOver variable here and return immediately if it is true */
                if (gameOver) {
                    return;
                }
                flag(x, y);
                rightClick(x, y);
                render(gridElement);
            });
            gridElement.appendChild(cellElement);
        }
    }

    firstMove = true;
    timerElement = document.getElementById('timer');
    scoreElement = document.getElementById('score'); // Initialize score element

    // Set the gameOverElement and allClearElement variables
    gameOverElement = document.querySelector('.game-over');
    allClearElement = document.querySelector('.all-clear');
}

// define a function to render the game grid
function render(gridElement) {
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const cellElement = gridElement.children[y * WIDTH + x];
            cellElement.classList.remove('hidden');
            cellElement.classList.remove('revealed');
            cellElement.classList.remove('mine');
            cellElement.classList.remove('flagged');
            cellElement.classList.remove('revealed-mine');
            cellElement.classList.remove('empty');

            if (grid[x][y].isRevealed) {
                cellElement.classList.add('revealed');
                if (grid[x][y].isMine) {
                    cellElement.classList.add('revealed-mine');
                } else {
                    if (grid[x][y].surroundingMines === 0) {
                        cellElement.classList.add('empty');
                        cellElement.innerText = '';
                    } else {
                        cellElement.classList.add('revealed-number');
                        cellElement.innerText = grid[x][y].surroundingMines;
                    }
                }
            } else if (grid[x][y].isFlagged) {
                cellElement.classList.add('flagged');
            } else {
                cellElement.classList.add('hidden');
                cellElement.innerText = ''; // Clear the text for hidden cells
            }
        }
    }

    if (!minesLeftElement) {
        minesLeftElement = document.createElement('div');
        minesLeftElement.id = "minesLeft";
        document.body.appendChild(minesLeftElement);
    }
    minesLeftElement.innerText = `Flags left: ${minesLeft}`;
    minesLeftElement.style.textAlign = 'center';
    minesLeftElement.style.fontFamily = 'Times New Roman';
    minesLeftElement.style.fontSize = '30px';

    if (minesLeft <= 3 && minesLeft > 0) {
        minesLeftElement.classList.add('red');
        minesLeftElement.classList.add('blink');
    } else {
        minesLeftElement.classList.remove('red');
        minesLeftElement.classList.remove('blink');
    }

    if (minesLeft === 0) {
        minesLeftElement.classList.remove('red');
        minesLeftElement.classList.remove('blink');
    }

    if (gameOver) {
        let flags = 0;
        for (let x = 0; x < WIDTH; x++) {
            for (let y = 0; y < HEIGHT; y++) {
                if (grid[x][y].isFlagged) {
                    flags++;
                }
            }
        }
        if(userLost) {
            setTimeout(displayGameOverMessage, 2000);
        }

    } else {
        timerElement = document.getElementById('timer');
        timerElement.textContent = timer;
    }
}

document.getElementById('loseRestart').addEventListener('click',reset, false);
document.getElementById('winRestart').addEventListener('click',reset, false);

function reset() {
    clearInterval(timerID);
    timer = 0;
    firstMove = true;
    gameOver = false;
    userLost = false;
    score = 0;
    scoreElement.textContent = score;
    minesLeft = NUM_MINES;
    minesLeftElement.textContent = `Mines left: ${minesLeft}`;
    timerElement.textContent = '0';

    while (gridElement.firstChild) {
        gridElement.removeChild(gridElement.firstChild);
    }

    gridElement.style.gridTemplateColumns = `repeat(${WIDTH}, 1fr)`;
    gridElement.style.gridTemplateRows = `repeat(${HEIGHT}, 1fr)`;
    gridElement.style.width = `${WIDTH * 30}px`;
    gridElement.style.height = `${HEIGHT * 30}px`;

    // Hide game-over and all-clear containers
    const gameOverContainer = document.getElementById('game-over-container');
    if (gameOverContainer) {
        gameOverContainer.style.display = 'none';
    }

    const allClearContainer = document.getElementById('all-clear-container');
    if (allClearContainer) {
        allClearContainer.style.display = 'none';
    }

    init(WIDTH, HEIGHT);
    render(gridElement);
}
const gridElement = document.getElementById('grid');
init(WIDTH, HEIGHT);
render(gridElement);

const tipButton = document.getElementById('tip');
const tipModal = document.getElementById('tipModal');
const closeButton = document.querySelector('.close');

tipButton.onclick = function() {
    tipModal.style.display = 'block';
}

closeButton.onclick = function() {
    tipModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == tipModal) {
        tipModal.style.display = 'none';
    }
}

function changeLevel(width, height, mines) {
    WIDTH = width;
    HEIGHT = height;
    MINES = mines;
    NUM_MINES = mines;
    minesLeft = MINES;

    clearInterval(timerID);
    timer = 0;
    firstMove = true;
    gameOver = false;
    score = 0; // Reset score
    scoreElement.textContent = score; // Update score display

    timerElement.textContent = "0";
    minesLeftElement.textContent = '';
    while (gridElement.firstChild) {
        gridElement.removeChild(gridElement.firstChild);
    }

    gridElement.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
    gridElement.style.gridTemplateRows = `repeat(${height}, 1fr)`;
    gridElement.style.width = `${WIDTH * 30}px`;
    gridElement.style.height = `${HEIGHT * 30}px`;

    // Hide game-over and all-clear elements
    const gameOverContainer = document.getElementById('game-over-container');
    if (gameOverContainer) {
        gameOverContainer.style.display = 'none';
    }

    const allClearContainer = document.getElementById('all-clear-container');
    if (allClearContainer) {
        allClearContainer.style.display = 'none';
    }

    init(width, height);
}

document.getElementById('beginner').addEventListener('click', () => {
    changeLevel(8, 8, 1);
});
document.getElementById('intermediate').addEventListener('click', () => {
    changeLevel(16, 16, 40);
});
document.getElementById('expert').addEventListener('click', () => {
    changeLevel(30, 16, 99);
});

// Update displayGameOverMessage and displayAllClearMessage functions to use the new container elements
function displayGameOverMessage() {
    let gameOverContainer = document.getElementById('game-over-container');
    let restartButton = document.getElementById('loseRestart');

    // 移除happy.gif
    const happyGif = document.querySelector('img[src="happy.gif"]');
    if (happyGif) {
        happyGif.parentNode.removeChild(happyGif);
    }

    if (gameOverContainer) {
        gameOverContainer.style.display = 'flex';
    }

    const gameOverElement = document.getElementById('game-over');
    if (gameOver) {
        gameOverElement.innerText = 'OOPS:( GAME OVER!!!';
    } else {
        gameOverElement.innerText = '';
    }

    // Set gameover.gif opacity
    const gameOverGif = document.querySelector('#game-over-container img');
    gameOverGif.style.opacity = '0';
    gameOverGif.style.transition = 'opacity 2s ease-in-out';
    setTimeout(() => {
        gameOverGif.style.opacity = '1';
    }, 0);

    // Show restart button
    setTimeout(() => {
        restartButton.style.display = 'inline-block';
        restartButton.style.opacity = '1';
        // restartButton.style.animation = 'glowing 1.5s infinite alternate';
    }, 2000);
}

function displayAllClearMessage() {
    let allClearContainer = document.getElementById('all-clear-container');
    let restartButton = document.getElementById('winRestart');

    // 移除gameover.gif
    const gameOverGif = document.querySelector('img[src="gameover.gif"]');
    if (gameOverGif) {
        gameOverGif.parentNode.removeChild(gameOverGif);
    }

    if (allClearContainer) {
        allClearContainer.style.display = 'flex';
    }

    const allClearElement = document.getElementById('all-clear');
    allClearElement.innerText = 'All Clear!';

    // Set happy.gif opacity
    const allClearGif = document.querySelector('#all-clear-container img');
    allClearGif.style.opacity = '0';
    allClearGif.style.transition = 'opacity 2s ease-in-out';
    setTimeout(() => {
        allClearGif.style.opacity = '1';
    }, 0);

    // Show restart button
    setTimeout    (() => {
        restartButton.style.display = 'inline-block';
        restartButton.style.opacity = '1';
    }, 2000);
}

document.getElementById('stop').addEventListener('click', () => {
    // 显示 Continue 按钮
    document.getElementById('continueModal').style.display = 'block';

    // 停止计时器
    stopTimer();
});

// Continue 按钮功能
document.getElementById('continue').addEventListener('click', () => {
    // 关闭 Continue 按钮
    document.getElementById('continueModal').style.display = 'none';

    // 重新启动计时器
    resumeTimer();
});






