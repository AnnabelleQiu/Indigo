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
        let num = 0;

        for (let x = 0; x < this.mineBoard.length; x++) {
            for (let y = 0; y < this.mineBoard[0].length; y++) {
                let cell = document.createElement("div");
                cell.className = "cell";
                cell.num = num;
                cell.x = x;
                cell.y = y;
                cell.addEventListener("click", firstClick, false);
                cell.addEventListener("click", click, false);
                cell.addEventListener("contextmenu", flag, false);
                grid.appendChild(cell);
                num++;
            }
        }
    }
    getCell(x, y) {
        return this.mineBoard[x][y];
    }
    reveal() {
        let cells = document.getElementsByClassName("cell");
        for (let cell of cells) {
            cell.textContent = this.mineBoard[cell.x][cell.y];
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
    if (!done && !this.clicked) {
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
            let cells = document.getElementsByClassName("cell");
            let toClick = [];

            if ((this.num + 1) % board.sizeY != 0) {    //right
                //getDiv(this.num + 1).click();
                toClick.push(this.num + 1);
            }
            if ((this.num) % board.sizeY != 0) {    //left
                // getDiv(this.num - 1).click();
                toClick.push(this.num - 1);
            }
            if (this.num <= cells.length - board.sizeX) {   //down
                // getDiv(this.num + board.sizeX).click(); 
                toClick.push(this.num + board.sizeX);
            }
            if (this.num >= board.sizeX) {  //up
                // getDiv(this.num - board.sizeX).click();
                toClick.push(this.num - board.sizeX);
            }
            if (this.num >= board.sizeX && (this.num + 1) % board.sizeY != 0) { //up right
                // getDiv(this.num + 1 - board.sizeX).click();
                toClick.push(this.num + 1 - board.sizeX);
            }
            if (this.num >= board.sizeX && (this.num) % board.sizeY != 0) { //up left
                // getDiv(this.num - 1 - board.sizeX).click();
                toClick.push(this.num - 1 - board.sizeX);
            }
            if (this.num <= cells.length - board.sizeX && (this.num + 1) % board.sizeY != 0) {  //down right
                // getDiv(this.num + 1 + board.sizeX).click();
                toClick.push(this.num + 1 + board.sizeX);
            }
            if (this.num <= cells.length - board.sizeX && (this.num) % board.sizeY != 0) {  //down left
                // getDiv(this.num - 1 + board.sizeX).click();
                toClick.push(this.num - 1 + board.sizeX);
            }

            for (let num of toClick) {
                getDiv(num).click();
            }
        }
    }
}
function flag(event) {
    if (!done) {
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