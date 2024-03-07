
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

class TicTacToe {
    private gameField : Field
    private stepCounter = 0
    private fieldStartLen = 3
    private isFinished : boolean = false

    public startGame(len : number) {
        this.fieldStartLen = len
        this.initField()
        this.isFinished = false
        this.stepCounter = 0;
        let gameContext = this

        this.gameField.cells.forEach(cell =>
            cell.addEventListener("click", function() {
                if (this.childNodes.length !== 0 || gameContext.isFinished) {
                    return
                }

                gameContext.doStepOnCell(this)

                if (gameContext.isWin(gameContext.gameField.cells)) {
                    gameContext.finishAndRestart(this.textContent + " wins!!!")
                    return;
                } else if (gameContext.stepCounter === gameContext.fieldStartLen * gameContext.fieldStartLen) {
                    gameContext.finishAndRestart("It's a draw...")
                    return;
                }
            })
        )
    }

    private initField() {
        if (typeof this.gameField !== 'undefined' && this.gameField !== null) {
            this.gameField.remove()
        }
        this.gameField = new Field(this.fieldStartLen)
    }

    private doStepOnCell(cell : HTMLTableCellElement) {
        if (this.stepCounter % 2 === 0) {
            this.gameField.changeColor(O_MARK.color) //next step
            cell.style.background = X_MARK.color
            cell.textContent = X_MARK.symb
        } else {
            this.gameField.changeColor(X_MARK.color) //next step
            cell.style.background = O_MARK.color
            cell.textContent = O_MARK.symb
        }
        this.stepCounter++
    }

    public finishAndRestart(message : string) {
        this.isFinished = true

        let finishMessage = this.createFinishMessage(message)

        let restartButton = document.createElement("button")
        restartButton.textContent = "Restart"
        document.body.appendChild(restartButton)
        let gameContext = this
        restartButton.addEventListener("click", function () {
            gameContext.initField()
            document.body.removeChild(restartButton)
            document.body.removeChild(finishMessage)
            gameContext.startGame(gameContext.fieldStartLen)
        })
    }

    private createFinishMessage(message : string) : HTMLHeadElement {
        let resultMessage = document.createElement("h1")
        resultMessage.textContent = message
        resultMessage.className = "finishMessage"
        document.body.appendChild(resultMessage)
        return resultMessage
    }

    private isWin(cells : Array<HTMLTableCellElement>): boolean {
        for (let i = 0; i < this.fieldStartLen; ++i) {
            if (this.isFullRow(cells, i)) {
                return true
            }
            if (this.isFullColumn(cells, i)) {
                return true
            }
        }
        return this.isDiagonal(cells);
    }


    private isDiagonal(cells: Array<HTMLTableCellElement>) {
        let isDiag : boolean = false
        for (let i = 0; i < this.fieldStartLen - 1; ++i) {
            isDiag = cells[i + (this.fieldStartLen * i)].textContent != '' &&
                cells[i + (this.fieldStartLen * i)].textContent === cells[(i + 1) + (this.fieldStartLen  * (i + 1))].textContent
            if (isDiag == false) break
        }

        if (isDiag === true) {
            return true
        }

        for (let i = this.fieldStartLen - 1; i >= 1; --i) {
            isDiag = cells[i + (this.fieldStartLen * (this.fieldStartLen - (i + 1)))].textContent != '' &&
                cells[i + (this.fieldStartLen * (this.fieldStartLen - (i + 1)))].textContent == cells[(this.fieldStartLen * (this.fieldStartLen - i) + (i - 1))].textContent
            if (isDiag == false) break
        }
        return isDiag
    }

    private isFullColumn(cells: Array<HTMLTableCellElement>, col : number) {
        let fullCol : boolean = true
        let j = 0
        while (fullCol && j < this.fieldStartLen - 1) {
            fullCol = cells[col + this.fieldStartLen * j].textContent != '' &&
                cells[col + this.fieldStartLen * j].textContent == cells[col + this.fieldStartLen * (j + 1)].textContent
            ++j
            if (!fullCol) break
        }
        return fullCol
    }

    private isFullRow(cells : Array<HTMLTableCellElement>, row : number) : boolean {
        let fullRow : boolean = true;
        let j = 0;
        while (fullRow && j < this.fieldStartLen - 1) {
            console.log(cells[j + row * this.fieldStartLen].textContent)
            fullRow = cells[j + row * this.fieldStartLen].textContent != '' &&
                cells[j + row * this.fieldStartLen].textContent == cells[j + 1 + row*this.fieldStartLen].textContent
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
const lenInput : HTMLInputElement = document.querySelector("#sizeInput")
lenInput.addEventListener("keydown", ev => {
    if (ev.code == "Enter") {
        game.startGame(Number(lenInput.value))
    }
})
