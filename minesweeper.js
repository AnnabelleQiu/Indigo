class Board {
    constructor(sizeX, sizeY) {
        this.mineBoard = [];
        this.sizeX = sizeX;
        this.sizeY = sizeY;
    }
    setBoards() {
        for (let y = 0; y < this.sizeY; y++) {
            this.mineBoard.push([]);
            for (let x = 0; x < this.sizeX; x++) {
                this.mineBoard[y].push("");
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
            let x = Math.floor(Math.random() * this.mineBoard[0].length);
            let y = Math.floor(Math.random() * this.mineBoard.length);
            if (this.mineBoard[y][x] != "X" && !(x == firstX && y == firstY)) {
                this.mineBoard[y][x] = "X";
                m--;
            }
        }
    }
    placeNums() {
        for (let x = 0; x < this.mineBoard[0].length; x++) {
            for (let y = 0; y < this.mineBoard.length; y++) {
                if (this.mineBoard[y][x] != "X") {
                    let mines = 0;

                    for (let xMod = 1; xMod >= -1; xMod--) {
                        for (let yMod = 1; yMod >= -1; yMod--) {
                            if (!(x + xMod >= this.mineBoard[0].length || x + xMod < 0 || y + yMod >= this.mineBoard.length || y + yMod < 0)) {
                                if (this.mineBoard[y + yMod][x + xMod] == "X") {
                                    mines++;
                                }
                            }
                        }
                    }

                    this.mineBoard[y][x] = mines;
                }
            }
        }
    }
    createCells() {
        

        for (let y = 0; y < this.mineBoard.length; y++) {
            let row = [];
            for (let x = 0; x < this.mineBoard[0].length; x++) {
                let cell = document.createElement("div");
                cell.className = "cell";
                cell.x = x;
                cell.y = y;
                cell.addEventListener("click", firstClick, false);
                cell.addEventListener("click", click, false);
                cell.addEventListener("contextmenu", flag, false);
                row.push(cell);
                grid.appendChild(cell);
            }
            cells.push(row);
        }
    }
    getCell(x, y) {
        return this.mineBoard[y][x];
    }
    reveal() {
        let cells = document.getElementsByClassName("cell");
        for (let cell of cells) {
            if (this.mineBoard[cell.y][cell.x] != 0) { 
                cell.textContent = this.mineBoard[cell.y][cell.x];
            }
        }
    }
}

let submit = document.getElementById("submit");
let mines = 0;
submit.addEventListener("click", start, false);
let board;
let grid;
let firstClicked = false;
let done = false;
let numberClicked = 0;
let outcome = document.createElement("div");
outcome.style.display = "block";
let cells = [];

function start() {
    let sizeX = Number(document.getElementById("sizeX").value);
    let sizeY = Number(document.getElementById("sizeY").value);
    mines = Number(document.getElementById("mines").value);
    let reject = document.getElementById("reject");

    if (sizeX <= 0 || sizeY <= 0) {
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

    document.body.appendChild(outcome);
}
function firstClick() {
    if (!firstClicked) {
        x = this.x;
        y = this.y;
        board.setMineBoard(x, y, mines);
        this.removeEventListener("click", firstClick, false);
        firstClicked = true;
    }
}
function click() {
    if (!done && !this.clicked && !this.flagged) {
        let result = board.getCell(this.x, this.y);
        this.textContent = result;
        if (!this.clicked) {
            numberClicked++;
        }
        this.clicked = true;
        this.style.backgroundColor = "white"

        if (result == "X") { //lose
            done = true;
            outcome.textContent = "You lose, dumbass";

            board.reveal();
        } else if (numberClicked == (board.sizeX * board.sizeY) - mines) { //win
            done = true;
            outcome.textContent = "You win, smartass";
        }

        if (result == 0) {
            this.textContent = "";

            if (!(this.x == 0) && !cells[this.y][this.x - 1].clicked) {   //left
                cells[this.y][this.x - 1].click();
            }
            if (!(this.x == cells[0].length - 1) && !cells[this.y][this.x + 1].clicked) {   //right
                cells[this.y][this.x + 1].click();
            }
            if (!(this.y == 0) && !cells[this.y - 1][this.x].clicked) {   //up
                cells[this.y - 1][this.x].click();
            }
            if (!(this.y == cells.length - 1) && !cells[this.y + 1][this.x].clicked) {   //down
                cells[this.y + 1][this.x].click();
            }
            if (!(this.y == 0) && !(this.x == 0) && !cells[this.y - 1][this.x - 1].clicked) {   //up left
                cells[this.y - 1][this.x - 1].click();
            }
            if (!(this.y == 0) && !(this.x == cells[0].length - 1) && !cells[this.y - 1][this.x + 1].clicked) {   //up right
                cells[this.y - 1][this.x + 1].click();
            }
            if (!(this.y == cells.length - 1) && !(this.x == cells[0].length - 1) && !cells[this.y + 1][this.x + 1].clicked) {   //down right
                cells[this.y + 1][this.x + 1].click();
            }
            if (!(this.y == cells.length - 1) && !(this.x == 0) && !cells[this.y + 1][this.x - 1].clicked) {   //down left
                cells[this.y + 1][this.x - 1].click();
            }
        }
    }
}
function flag(event) {
    if (!done && !this.clicked) {
        event.preventDefault();

        if (!this.flagged) {
            this.flagged = true;
            let flag = document.createElement("img");
            flag.className = "flag";
            flag.src = "images/flag.png";
            this.textContent = "";
            this.appendChild(flag);
        } else {
            this.textContent = "";
            this.flagged = false;
        }
    }
}
function getDiv(num) {
    let cells = document.getElementsByClassName("cell");
    return cells[num];
}