// define the game grid dimensions and the number of mines as regular variables
let WIDTH = 8;
let HEIGHT = 8;
let NUM_MINES = 10;

/* add the gameOver variable here */
let gameOver = false;
let gameOverElement = document.getElementById('game-over');

/* add the minesLeft variable here and initialize it to the total number of mines */
let minesLeft = NUM_MINES;
/* add the minesLeftElement variable here and initialize it to null */
let minesLeftElement = null;
let firstMove = true;
let timer = 0;
let timerElement = null;
let timerID = null;

/* add the score variable here */
let score = 0;
let scoreElement = document.getElementById('score');

// define a function to reveal a cell
function reveal(x, y) {
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
    
    // Start the timer
    timerID = setInterval(() => {
      timer++;
      render(gridElement);
    }, 1000);       
  }

  if (grid[x][y].isMine) {
    gameOver = true;

    /* create and display the "Game Over" message */
    displayGameOverMessage();

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
  
      if (remaining === 0) {
        gameOver = true;
        displayAllClearMessage();
      }
    }
  
    // 更新 minesLeft 显示
    const minesLeftElement = document.getElementById('minesLeft');
    minesLeftElement.textContent = minesLeft;
    if (minesLeft <= 3) {
      minesLeftElement.classList.add('red');
    } else {
      minesLeftElement.classList.remove('red');
    }
  
    if (minesLeft === 0) {
      alert("You have no more mines left! Be careful!");
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
          } else {
            cellElement.innerText = grid[x][y].surroundingMines;
          }            
        }
      } else if (grid[x][y].isFlagged) {
        cellElement.classList.add('flagged');
      } else {
        cellElement.classList.add('hidden');
      }
    }
  }

  if (!minesLeftElement) {
    minesLeftElement = document.createElement('div');
    document.body.appendChild(minesLeftElement);
  }
  minesLeftElement.innerText = `Mines left: ${minesLeft}`;
  minesLeftElement.style.textAlign = 'center';
  minesLeftElement.style.fontFamily = 'Times New Roman';
  minesLeftElement.style.fontSize = '30px';
  minesLeftElement.style.color = '#8662b4';
  minesLeftElement.style.textShadow = '0 0 10px #ffffff, 0 0 20px rgb(255, 255, 255), 0 0 30px rgb(255, 255, 255), 0 0 40px purple';

  if (minesLeft <= 3) {
    minesLeftElement.classList.add('red');
  } else {
    minesLeftElement.classList.remove('red');
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

    if (flags === NUM_MINES) {
      displayAllClearMessage();
    } else {
      displayGameOverMessage();
    }
  } else {
    const timerElement = document.getElementById('timer');
    timerElement.textContent = timer;
  }
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

  const gameOverElement = document.getElementById('game-over');
  if (gameOverElement) {
    gameOverElement.parentNode.removeChild(gameOverElement);
  }

  const allClearElement = document.getElementById('all-clear');
  if (allClearElement) {
    allClearElement.parentNode.removeChild(allClearElement);
  }

  init(width, height);
}

const beginnerButton = document.getElementById('beginner');
const intermediateButton = document.getElementById('intermediate');

document.getElementById('beginner').addEventListener('click', () => {
  changeLevel(8, 8, 10);
});
document.getElementById('intermediate').addEventListener('click', () => {
  changeLevel(16, 16, 40);
});
document.getElementById('expert').addEventListener('click', () => {
  changeLevel(30, 16, 99);
});
// Add this event listener to handle the restart button click
document.getElementById('restart').addEventListener('click', () => {
    clearInterval(timerID);
    timer = 0;
    firstMove = true;
    gameOver = false;
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
  
    const gameOverElement = document.getElementById('game-over');
    if (gameOverElement) {
      gameOverElement.parentNode.removeChild(gameOverElement);
    }
  
    const gameOverGif = document.querySelector('img[src="gameover.gif"]');
    if (gameOverGif) {
      gameOverGif.parentNode.removeChild(gameOverGif);
    }
  
    const allClearElement = document.getElementById('all-clear');
    if (allClearElement) {
      allClearElement.parentNode.removeChild(allClearElement);
    }
  
    const restartButton = document.getElementById('restart');
    restartButton.style.display = 'none'; // Hide the restart button
    restartButton.style.opacity = '0';
    restartButton.style.animation = 'none';
  
    init(WIDTH, HEIGHT);
    render(gridElement);
  });
  
  function displayGameOverMessage() {
    let gameOverElement = document.getElementById('game-over');
    let restartButton = document.getElementById('restart');
  
    if (!gameOverElement) {
      gameOverElement = document.createElement('div');
      gameOverElement.id = 'game-over';
      gameOverElement.style.fontFamily = 'Times New Roman';
      gameOverElement.style.fontSize = '30px';
      gameOverElement.style.color = 'purple';
      gameOverElement.style.position = 'absolute';
      gameOverElement.style.left = '50%';
      gameOverElement.style.top = '50%';
      gameOverElement.style.transform = 'translate(-50%, -50%)';
      gameOverElement.style.backgroundColor = 'white';
      gameOverElement.style.borderRadius = '10px';
      gameOverElement.style.padding = '10px';
      gameOverElement.style.boxShadow = '0 0 70px #8662b4';
      document.body.appendChild(gameOverElement);
  
      // Add GIF element
      let gameOverGif = document.createElement('img');
      gameOverGif.src = 'gameover.gif';
      gameOverGif.style.position = 'absolute';
      gameOverGif.style.left = '50%';
      gameOverGif.style.top = '60%';
      gameOverGif.style.transform = 'translate(-50%, -50%)';
      gameOverGif.style.opacity = '0';
      gameOverGif.style.transition = 'opacity 2s ease-in-out';
  
      document.body.appendChild(gameOverGif);
  
      // Set GIF opacity
      setTimeout(() => {
        gameOverGif.style.opacity = '1';
      }, 0);
  
      // Show restart button
      setTimeout(() => {
        restartButton.style.display = 'inline-block';
        restartButton.style.opacity = '1';
        restartButton.style.animation = 'glowing 1.5s infinite alternate';
      }, 2000);
    }
  
    if (gameOver) {
      gameOverElement.innerText = 'OOPS:( GAME OVER!!!';
    } else {
      gameOverElement.innerText = '';
    }
  }
  

function displayAllClearMessage() {
  let allClearElement = document.getElementById('all-clear');
  if (allClearElement === null) {
    allClearElement = document.createElement('div');
    allClearElement.id = 'all-clear';
    allClearElement.style.fontSize = '40px';
    allClearElement.style.color = 'green';
    allClearElement.style.position = 'absolute';
    allClearElement.style.left = '50%';
    allClearElement.style.top = '50%';
    allClearElement.style.transform = 'translate(-50%, -50%)';
    allClearElement.style.padding = '10px';
    allClearElement.style.backgroundColor = 'white';
    allClearElement.style.border = '5px solid green';    
    document.body.appendChild(allClearElement);
  }
  allClearElement.innerText = 'All Clear!';
  
}
