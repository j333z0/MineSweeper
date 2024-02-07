let board = []
let rows = 8
let cols = 8
let w, h, cellDim = 40, fontSize = 24

let minesCount = 10
let minesLocation = []

let gameOver = false
let flagEnabled = false
let tilesClicked = 0
let cells = document.querySelector(".cells")

document.querySelector(".flag").addEventListener("click", setFlag)

function updateBoard() {
    setMines()
    cells.innerHTML = ""
    board = []

    w = cols * cellDim
    h = rows * cellDim
    cells.style.width = w + "px"
    cells.style.height = h + "px"

    document.querySelector(".cells").style.width = w + 30 + "px"
    document.querySelector(".cells").style.height = h + 30 + "px"
    document.getElementById("mines-qty").innerHTML = minesCount
    
    for (let i = 0; i < rows; i++) {
        let row = []
        for (let j = 0; j < cols; j++) {
            let tile = document.createElement("button")
            tile.id = i.toString() + "-" + j.toString()
            tile.classList.add("btn")
            tile.style.width = cellDim + "px"
            tile.style.height = cellDim + "px"
            tile.style.fontSize = fontSize + "px"
            tile.addEventListener("click", tileClick)
            document.querySelector(".cells").append(tile)
            row.push(tile)
        }
        board.push(row)
    }
}

function setMines() {
    minesLocation = []
    let minesLeft = minesCount
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows)
        let c = Math.floor(Math.random() * cols)
        let id = r.toString() + "-" + c.toString()

        if (!minesLocation.includes(id)) {
            minesLocation.push(id)
            minesLeft--
        }
    }
}

window.onload = () => {
    updateBoard()
    setMines()
}

function infoPlacement(diff) {

    let container = document.querySelector(".container")
    let board = document.querySelector(".board")
    let board_top = document.querySelector(".board-top")
    let cells = document.querySelector(".cells")

    switch (diff) {
        case "easy":
            container.style.flexDirection = "column"
            board_top.style.flexDirection = "row"
            board.style.flexDirection = "column"
            board_top.style.marginBottom = 30 + "px"
            cells.style.marginLeft = 0
            break;
    
        case "medium":
            container.style.flexDirection = "row"
            board.style.flexDirection = "row"
            board_top.style.flexDirection = "column"
            board_top.style.marginBottom = 0
            cells.style.marginLeft = 30 + "px"
            board.style.marginRight = 210 + "px"
            break;
        case "hard":
            container.style.flexDirection = "row"
            board.style.flexDirection = "row"
            board_top.style.flexDirection = "column"
            board_top.style.marginBottom = 0
            cells.style.marginLeft = 30 + "px"
            board.style.marginRight = 210 + "px"
            break;
    }
}

function difficultyCheck() {
    select = document.getElementById("diff")
    switch(select.value) {
        case "easy": 
            rows = 8
            cols = 8
            minesCount = 10
            cellDim = 40
            fontSize = 24
            infoPlacement("easy")
        break
        case "medium": 
            rows = 14
            cols = 14
            minesCount = 20
            cellDim = 35
            fontSize = 24
            infoPlacement("medium")
        break
        case "hard": 
            rows = 20
            cols = 20
            minesCount = 30
            cellDim = 30
            fontSize = 20
            infoPlacement("hard")
        break
    }
    updateBoard()
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false
        document.querySelector(".flag").style.backgroundColor = "#001d3d"
    } else {
        flagEnabled = true
        document.querySelector(".flag").style.backgroundColor = "#03274f"
    }
}

function tileClick() {
    if (gameOver || this.classList.contains("btn-pressed")) {
        return
    }
    let tile = this
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩"
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = ""
        }
        return
    }

    if (minesLocation.includes(tile.id)) {
        gameOver = true
        revealMines()
        return
    }


    let coords = tile.id.split("-") // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0])
    let c = parseInt(coords[1])
    checkMine(r, c)

}

function revealMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let tile = board[i][j]
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣"
                tile.classList.add("btn-pressed")
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return
    }

    if (board[r][c].classList.contains("btn-pressed")) {
        return
    }

    board[r][c].classList.add("btn-pressed")
    tilesClicked++

    let minesFound = 0

    // top 3
    minesFound += checkTile(r - 1, c - 1) // top left
    minesFound += checkTile(r - 1, c) // top mid
    minesFound += checkTile(r - 1, c + 1) // top right

    // mid 2
    minesFound += checkTile(r, c - 1) // mid left
    minesFound += checkTile(r, c + 1) // mid right

    // bottom 3
    minesFound += checkTile(r + 1, c - 1) // bottom left
    minesFound += checkTile(r + 1, c) // bottom mid
    minesFound += checkTile(r + 1, c + 1) // bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound
    } else {
        // top 3
        checkMine(r - 1, c - 1) // top left
        checkMine(r - 1, c) // top mid
        checkMine(r - 1, c + 1) // top right

        // mid 2
        checkMine(r, c - 1) // mid left
        checkMine(r, c + 1) // mid right

        // bottom 3
        checkMine(r + 1, c - 1) // bottom left
        checkMine(r + 1, c) // bottom mid
        checkMine(r + 1, c + 1) // bottom right
    }

    if (tilesClicked == rows * cols - minesCount) {
        document.getElementById("mines-qty").innerHTML = "CLEARED"
        document.querySelector(".prompt").innerHTML = "You Won <br> !!!!!"
        document.querySelector(".info-block").style.height = 520 + "px"
        document.querySelector(".prompt").style.backgroundColor = "#003566"
        document.querySelector(".prompt").style.padding = 15 + "px"
        document.querySelector(".prompt").style.borderRadius = 15 + "px"
        gameOver = true
    }
}


function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return 0
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1
    }
    return 0
}