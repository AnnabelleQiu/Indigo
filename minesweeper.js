class Board {
    constructor(sizeX, sizeY) {
        this.mineBoard = [];
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }
    setBoards() {
        for (let x = 0; x < this.sizeX; x++) {
            this.mineBoard.push([]);
            for (let y = 0; y < this.sizeY; y++) {
                this.mineBoard[x].push("");
            }
        }
    }
    setMineBoard(firstX, firstY, mines) {
        this.placeMines(firstX, firstY, mines);
        this.placeNums();
    }
    placeMines(firstX, firstY, mines) {
        let m = mines;

        while (m > 0) {
            let x = Math.floor(Math.random() * this.mineBoard.length);
            let y = Math.floor(Math.random() * this.mineBoard[0].length);
            if (this.mineBoard[x][y] != "X" && !(x == firstX && y == firstY)) {
                this.mineBoard[x][y] = "X";
                m--;
            }
        }
    }
    placeNums() {
        for (let x = 0; x < this.mineBoard.length; x++) {
            for (let y = 0; y < this.mineBoard[0].length; y++) {
                if (this.mineBoard[x][y] != "X") {
                    let mines = 0;

                    for (let xMod = 1; xMod >= -1; xMod--) {
                        for (let yMod = 1; yMod >= -1; yMod--) {
                            if (!(x + xMod >= this.mineBoard.length || x + xMod < 0 || y + yMod >= this.mineBoard[0].length || y + yMod < 0)) {
                                if (this.mineBoard[x + xMod][y + yMod] == "X") {
                                    mines++;
                                }
                            }
                        }
                    }

                    this.mineBoard[x][y] = mines;
                }
            }
        }
    }
    createCells() {
        for (let x = 0; x < this.mineBoard.length; x++) {
            for (let y = 0; y < this.mineBoard[0].length; y++) {
                let cell = document.createElement("div");
                cell.className = "cell";
                cell.x = x;
                cell.y = y;
                cell.addEventListener("click", firstClick, false);
                cell.addEventListener("click", click, false)
                grid.appendChild(cell);
            }
        }
    }
}

let submit = document.getElementById("submit");
let mines = 0;
submit.addEventListener("click", start, false);
let board;
let grid;

function start() {
    let sizeX = Number(document.getElementById("sizeX").value);
    let sizeY = Number(document.getElementById("sizeY").value);
    mines = Number(document.getElementById("mines").value);
    let reject = document.getElementById("reject");

    if (sizeX == 0 || sizeY == 0) {
        reject.textContent = "Error. There must be at least 1 row and 1 column.";
        return;
    }
    if (mines < 1 || mines >= sizeX * sizeY) {
        reject.textContent = "Error. There must be at least 1 mine and 1 free space.";
        return;
    }

    board = new Board(sizeX, sizeY)
    board.setBoards();
    document.body.removeChild(document.getElementById("input"));
    grid = document.createElement("div");
    grid.id = "grid";
    document.body.appendChild(grid);
    grid.style.setProperty("grid-template-columns", "repeat(" + board.sizeX + ", 30px)")
    board.createCells();
}
function firstClick() {
    x = this.x;
    y = this.y;
    board.setMineBoard(x, y, mines);
    this.removeEventListener("click", firstClick, false);
}
function click() {
    
}