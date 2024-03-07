
class Mark {
    private _symb : string
    private _color : string

    constructor(symb : string, color : string) {
        this._symb = symb
        this._color = color
    }

    get symb(): string {
        return this._symb;
    }

    get color(): string {
        return this._color;
    }
}

const X_MARK = new Mark("X", "rgba(205, 92, 92, 0.6)")
const O_MARK = new Mark("O", "rgba(48,182,18,0.6)")
const FIELD_LENGTH= 3;

class TicTacToe {
    private gameField : Field
    private isFinished : boolean = false

    public startGame() {
        this.gameField = new Field(FIELD_LENGTH)
        this.isFinished = false
        let stepCounter = 0;
        let gameContext = this

        this.gameField.cells.forEach(cell =>
            cell.addEventListener("click", function() {
                if (this.childNodes.length !== 0 || gameContext.isFinished) {
                    return
                }

                if (stepCounter % 2 === 0) {
                    gameContext.gameField.changeColor(O_MARK.color) //next step
                    this.style.background = X_MARK.color
                    this.textContent = X_MARK.symb
                } else {
                    gameContext.gameField.changeColor(X_MARK.color) //next step
                    this.style.background = O_MARK.color
                    this.textContent = O_MARK.symb
                }
                stepCounter++

                if (TicTacToe.isWin(gameContext.gameField.cells)) {
                    gameContext.finishAndRestart(this.textContent + " wins!!!")
                    return;
                } else if (stepCounter === FIELD_LENGTH * FIELD_LENGTH) {
                    gameContext.finishAndRestart("It's a draw...")
                    return;
                }
            })
        )
    }

    public finishAndRestart(message : string) {
        this.isFinished = true

        let finishMessage = this.createFinishMessage(message)

        let restartButton = document.createElement("button")
        restartButton.textContent = "Restart"
        document.body.appendChild(restartButton)
        let gameContext = this
        restartButton.addEventListener("click", function () {
            gameContext.gameField.remove()
            gameContext.startGame()
            document.body.removeChild(restartButton)
            document.body.removeChild(finishMessage)
        })
    }

    private createFinishMessage(message : string) : HTMLHeadElement {
        let resultMessage = document.createElement("h1")
        resultMessage.textContent = message
        resultMessage.className = "finishMessage"
        document.body.appendChild(resultMessage)
        return resultMessage
    }

    private static isWin(cells : Array<HTMLTableCellElement>): boolean {
        for (let i = 0; i < FIELD_LENGTH; ++i) {
            if (TicTacToe.isFullRow(cells, i)) {
                return true
            }
            if (TicTacToe.isFullColumn(cells, i)) {
                return true
            }
        }
        return TicTacToe.isDiagonal(cells);
    }


    private static isDiagonal(cells: Array<HTMLTableCellElement>) {
        let isDiag : boolean = false
        for (let i = 0; i < FIELD_LENGTH - 1; ++i) {
            isDiag = cells[i + (FIELD_LENGTH * i)].textContent != '' &&
                cells[i + (FIELD_LENGTH * i)].textContent === cells[(i + 1) + (FIELD_LENGTH  * (i + 1))].textContent
            if (isDiag == false) break
        }

        if (isDiag === true) {
            return true
        }

        for (let i = FIELD_LENGTH - 1; i >= 1; --i) {
            isDiag = cells[i + (FIELD_LENGTH * (FIELD_LENGTH - (i + 1)))].textContent != '' &&
                cells[i + (FIELD_LENGTH * (FIELD_LENGTH - (i + 1)))].textContent == cells[(FIELD_LENGTH * (FIELD_LENGTH - i) + (i - 1))].textContent
            if (isDiag == false) break
        }
        return isDiag
    }

    private static isFullColumn(cells: Array<HTMLTableCellElement>, col : number) {
        let fullCol : boolean = true
        let j = 0
        while (fullCol && j < FIELD_LENGTH - 1) {
            fullCol = cells[col + FIELD_LENGTH * j].textContent != '' &&
                cells[col + FIELD_LENGTH * j].textContent == cells[col + FIELD_LENGTH * (j + 1)].textContent
            ++j
            if (!fullCol) break
        }
        return fullCol
    }

    private static isFullRow(cells : Array<HTMLTableCellElement>, row : number) : boolean {
        let fullRow : boolean = true;
        let j = 0;
        while (fullRow && j < FIELD_LENGTH - 1) {
            console.log(cells[j + row * FIELD_LENGTH].textContent)
            fullRow = cells[j + row * FIELD_LENGTH].textContent != '' &&
                cells[j + row * FIELD_LENGTH].textContent == cells[j + 1 + row*FIELD_LENGTH].textContent
            ++j
            if (!fullRow) break
        }
        return fullRow
    }
}

class Field {
    field : HTMLTableElement
    fieldLength : number
    cells : Array<HTMLTableCellElement> = new Array<HTMLTableCellElement>()

    constructor(fieldLength : number) {
        this.fieldLength = fieldLength
        this.field = document.createElement("table")
        this.field.id = "field"
        for (let i = 0 ; i < fieldLength; i++) {
            let row = this.field.insertRow(i)
            for (let j = 0; j < fieldLength; j++) {
                let cell = row.insertCell(j)
                this.cells.push(cell)
            }
        }
        document.body.appendChild(this.field)
    }

    public changeColor(color : string) {
        this.field.style.border = "3px solid " + color
    }

    public remove() {
        if (this.field !== null) {
            document.body.removeChild(this.field)
        }
    }
}


const game = new TicTacToe()

game.startGame()