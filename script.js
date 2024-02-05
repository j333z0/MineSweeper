let board = []
let rows = 8
let cols = 8
let w, h, cellD = 40

let minesCount = 5
let minesLocation = []

let gameOver = false
let flagEnabled = false
let tilesClicked = 0

document.querySelector(".flag").addEventListener("click", setFlag)

function setMines() {
    // minesLocation.push("2-2")
    // minesLocation.push("2-3")
    // minesLocation.push("5-6")
    // minesLocation.push("3-4")
    // minesLocation.push("1-1")

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

setMines()

for (let i = 0; i < rows; i++) {
    let row = []
    for (let j = 0; j < cols; j++) {
        let tile = document.createElement("button")
        tile.id = i.toString() + "-" + j.toString()
        tile.classList.add("btn")
        tile.addEventListener("click", tileClick)
        document.querySelector(".cells").append(tile)
        row.push(tile)
    }
    board.push(row)
}

w = cols * cellD
h = rows * cellD

document.querySelector(".cells").style.width = w + "px"
document.querySelector(".cells").style.height = h + "px"

document.querySelector(".board").style.width = w + 30 + "px"
document.querySelector(".board").style.height = h + 15 + "px"

document.querySelector(".board-top").style.width = w + 30 + "px"

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false
        document.querySelector(".flag").style.backgroundColor = "#003566"
    } else {
        flagEnabled = true
        document.querySelector(".flag").style.backgroundColor = "#001d3d"
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
        document.querySelector(".prompt").innerHTML = "All Mines Are Cleared, </br> You Won !!!!!"
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