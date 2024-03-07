var Mark = /** @class */ (function () {
    function Mark(symb, color) {
        this._symb = symb;
        this._color = color;
    }
    Object.defineProperty(Mark.prototype, "symb", {
        get: function () {
            return this._symb;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Mark.prototype, "color", {
        get: function () {
            return this._color;
        },
        enumerable: false,
        configurable: true
    });
    return Mark;
}());
var X_MARK = new Mark("X", "rgba(205, 92, 92, 0.6)");
var O_MARK = new Mark("O", "rgba(48,182,18,0.6)");
var TicTacToe = /** @class */ (function () {
    function TicTacToe() {
        this.stepCounter = 0;
        this.fieldStartLen = 3;
        this.isFinished = false;
    }
    TicTacToe.prototype.startGame = function (len) {
        this.fieldStartLen = len;
        this.initField();
        this.isFinished = false;
        this.stepCounter = 0;
        var gameContext = this;
        this.gameField.cells.forEach(function (cell) {
            return cell.addEventListener("click", function () {
                if (this.childNodes.length !== 0 || gameContext.isFinished) {
                    return;
                }
                gameContext.doStepOnCell(this);
                if (gameContext.isWin(gameContext.gameField.cells)) {
                    gameContext.finishAndRestart(this.textContent + " wins!!!");
                    return;
                }
                else if (gameContext.stepCounter === gameContext.fieldStartLen * gameContext.fieldStartLen) {
                    gameContext.finishAndRestart("It's a draw...");
                    return;
                }
            });
        });
    };
    TicTacToe.prototype.initField = function () {
        if (typeof this.gameField !== 'undefined' && this.gameField !== null) {
            this.gameField.remove();
        }
        this.gameField = new Field(this.fieldStartLen);
    };
    TicTacToe.prototype.doStepOnCell = function (cell) {
        if (this.stepCounter % 2 === 0) {
            this.gameField.changeColor(O_MARK.color); //next step
            cell.style.background = X_MARK.color;
            cell.textContent = X_MARK.symb;
        }
        else {
            this.gameField.changeColor(X_MARK.color); //next step
            cell.style.background = O_MARK.color;
            cell.textContent = O_MARK.symb;
        }
        this.stepCounter++;
    };
    TicTacToe.prototype.finishAndRestart = function (message) {
        this.isFinished = true;
        var finishMessage = this.createFinishMessage(message);
        var restartButton = document.createElement("button");
        restartButton.textContent = "Restart";
        document.body.appendChild(restartButton);
        var gameContext = this;
        restartButton.addEventListener("click", function () {
            gameContext.initField();
            document.body.removeChild(restartButton);
            document.body.removeChild(finishMessage);
            gameContext.startGame(gameContext.fieldStartLen);
        });
    };
    TicTacToe.prototype.createFinishMessage = function (message) {
        var resultMessage = document.createElement("h1");
        resultMessage.textContent = message;
        resultMessage.className = "finishMessage";
        document.body.appendChild(resultMessage);
        return resultMessage;
    };
    TicTacToe.prototype.isWin = function (cells) {
        for (var i = 0; i < this.fieldStartLen; ++i) {
            if (this.isFullRow(cells, i)) {
                return true;
            }
            if (this.isFullColumn(cells, i)) {
                return true;
            }
        }
        return this.isDiagonal(cells);
    };
    TicTacToe.prototype.isDiagonal = function (cells) {
        var isDiag = false;
        for (var i = 0; i < this.fieldStartLen - 1; ++i) {
            isDiag = cells[i + (this.fieldStartLen * i)].textContent != '' &&
                cells[i + (this.fieldStartLen * i)].textContent === cells[(i + 1) + (this.fieldStartLen * (i + 1))].textContent;
            if (isDiag == false)
                break;
        }
        if (isDiag === true) {
            return true;
        }
        for (var i = this.fieldStartLen - 1; i >= 1; --i) {
            isDiag = cells[i + (this.fieldStartLen * (this.fieldStartLen - (i + 1)))].textContent != '' &&
                cells[i + (this.fieldStartLen * (this.fieldStartLen - (i + 1)))].textContent == cells[(this.fieldStartLen * (this.fieldStartLen - i) + (i - 1))].textContent;
            if (isDiag == false)
                break;
        }
        return isDiag;
    };
    TicTacToe.prototype.isFullColumn = function (cells, col) {
        var fullCol = true;
        var j = 0;
        while (fullCol && j < this.fieldStartLen - 1) {
            fullCol = cells[col + this.fieldStartLen * j].textContent != '' &&
                cells[col + this.fieldStartLen * j].textContent == cells[col + this.fieldStartLen * (j + 1)].textContent;
            ++j;
            if (!fullCol)
                break;
        }
        return fullCol;
    };
    TicTacToe.prototype.isFullRow = function (cells, row) {
        var fullRow = true;
        var j = 0;
        while (fullRow && j < this.fieldStartLen - 1) {
            console.log(cells[j + row * this.fieldStartLen].textContent);
            fullRow = cells[j + row * this.fieldStartLen].textContent != '' &&
                cells[j + row * this.fieldStartLen].textContent == cells[j + 1 + row * this.fieldStartLen].textContent;
            ++j;
            if (!fullRow)
                break;
        }
        return fullRow;
    };
    return TicTacToe;
}());
var Field = /** @class */ (function () {
    function Field(fieldLength) {
        this.cells = new Array();
        this.fieldLength = fieldLength;
        this.field = document.createElement("table");
        this.field.id = "field";
        for (var i = 0; i < fieldLength; i++) {
            var row = this.field.insertRow(i);
            for (var j = 0; j < fieldLength; j++) {
                var cell = row.insertCell(j);
                this.cells.push(cell);
            }
        }
        document.body.appendChild(this.field);
    }
    Field.prototype.changeColor = function (color) {
        this.field.style.border = "3px solid " + color;
    };
    Field.prototype.remove = function () {
        if (this.field !== null) {
            document.body.removeChild(this.field);
        }
    };
    return Field;
}());
var game = new TicTacToe();
var lenInput = document.querySelector("#sizeInput");
lenInput.addEventListener("keydown", function (ev) {
    if (ev.code == "Enter") {
        game.startGame(Number(lenInput.value));
    }
});
