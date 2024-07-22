class Board {
    constructor(size) {
        this.displayBoard = [];
        this.mineBoard = [];
        this.size = size;
    }
    setBoards() {
        for (let x = 0; x < this.size; x++) {
            this.displayBoard.push([]);
            this.mineBoard.push([]);
            for (let y = 0; y < this.size; y++) {
                this.displayBoard[x].push(" ");
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
}

let board = new Board(5);
board.setBoards();
board.setMineBoard(0, 0, 5);