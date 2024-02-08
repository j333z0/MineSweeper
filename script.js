let board = [];
let rows = 8;
let cols = 8;
let w,
  h,
  cellDim = 40,
  fontSize = 24;

let minesCount = 10;
let minesLocation = [];

let gameOver;
let flagEnabled = false;
let tilesClicked;
let cells = document.querySelector(".cells");

function setMines() {
  minesLocation = [];
  let minesLeft = minesCount;
  while (minesLeft > 0) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    let id = r.toString() + "-" + c.toString();

    if (!minesLocation.includes(id)) {
      minesLocation.push(id);
      minesLeft--;
    }
  }
}

function updateBoard() {
  setMines();

  tilesClicked = 0;
  gameOver = false;
  cells.innerHTML = "";
  board = [];

  w = cols * cellDim;
  h = rows * cellDim;
  cells.style.width = w + "px";
  cells.style.height = h + "px";

  document.querySelector(".game_over").classList.add("none");
  document.querySelector(".prompt").classList.add("none");
  document.querySelector(".restart").classList.add("none");
  document.querySelector(".cells").style.width = w + 30 + "px";
  document.querySelector(".cells").style.height = h + 30 + "px";
  document.getElementById("mines-qty").innerHTML = minesCount;

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      let tile = document.createElement("button");
      tile.id = i.toString() + "-" + j.toString();
      tile.classList.add("btn");
      tile.style.width = cellDim + "px";
      tile.style.height = cellDim + "px";
      tile.style.fontSize = fontSize + "px";
      tile.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        tileClick(e.type, this);
      });
      tile.addEventListener("click", function (e) {
        e.preventDefault();
        tileClick(e.type, this);
      });
      document.querySelector(".cells").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
}

window.onload = () => {
  updateBoard();
};

function infoPlacement(diff) {
  let game_over = document.querySelector(".game_over").style;
  let container = document.querySelector(".container").style;
  let board = document.querySelector(".board").style;
  let board_top = document.querySelector(".board-top").style;
  let cells = document.querySelector(".cells").style;

  switch (diff) {
    case "easy":
      container.flexDirection = "column";
      board.flexDirection = "column";
      board.marginRight = 0;
      cells.marginLeft = 0;
      board_top.flexDirection = "row";
      game_over.flexDirection = "row";
      break;

    case "medium":
      container.flexDirection = "row";
      board.flexDirection = "row";
      board_top.flexDirection = "column";
      board.marginRight = 210 + "px";
      game_over.flexDirection = "column";
      board.gap = 30 + "px";
      break;
    case "hard":
      container.flexDirection = "row";
      board.flexDirection = "row";
      board_top.flexDirection = "column";
      board.marginRight = 210 + "px";
      game_over.flexDirection = "column";
      board.gap = 30 + "px";
      break;
  }
}

function difficultyCheck() {
  select = document.getElementById("diff");
  switch (select.value) {
    case "easy":
      rows = 8;
      cols = 8;
      minesCount = 10;
      cellDim = 40;
      fontSize = 24;
      infoPlacement("easy");
      break;
    case "medium":
      rows = 14;
      cols = 14;
      minesCount = 20;
      cellDim = 35;
      fontSize = 24;
      infoPlacement("medium");
      break;
    case "hard":
      rows = 20;
      cols = 20;
      minesCount = 30;
      cellDim = 30;
      fontSize = 20;
      infoPlacement("hard");
      break;
  }
  updateBoard();
}

function tileClick(type, el) {
  tile = el;
  if (type == "contextmenu") {
    if (tile.innerText == "") {
      tile.innerText = "🚩";
    } else if (tile.innerText == "🚩") {
      tile.innerText = "";
    }
    return;
  } else if (type == "click" && tile.innerText != "🚩") {
    if (gameOver || tile.classList.contains("btn-pressed")) {
      return;
    }

    if (minesLocation.includes(tile.id)) {
      over("lose");
      revealMines();
      return;
    }

    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
  }
}

function over(con) {
  gameOver = true;
  let prompt = document.querySelector(".prompt");
  document.querySelector(".game_over").classList.remove("none");
  prompt.classList.remove("none");
  document.querySelector(".restart").classList.remove("none");
  switch (con) {
    case "win":
      prompt.classList.remove("lost");
      prompt.innerHTML = "YOU WON <br> !!!!!";
      break;

    case "lose":
      prompt.innerHTML = "YOU LOST";
      prompt.classList.add("lost");
      break;
  }
}

function revealMines() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let tile = board[i][j];
      if (minesLocation.includes(tile.id)) {
        tile.innerText = "💣";
        tile.classList.add("btn-pressed");
      }
    }
  }
}

function checkMine(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) {
    return;
  }

  if (board[r][c].classList.contains("btn-pressed")) {
    return;
  }

  board[r][c].classList.add("btn-pressed");
  tilesClicked++;

  let minesFound = 0;

  // top 3
  minesFound += checkTile(r - 1, c - 1); // top left
  minesFound += checkTile(r - 1, c); // top mid
  minesFound += checkTile(r - 1, c + 1); // top right

  // mid 2
  minesFound += checkTile(r, c - 1); // mid left
  minesFound += checkTile(r, c + 1); // mid right

  // bottom 3
  minesFound += checkTile(r + 1, c - 1); // bottom left
  minesFound += checkTile(r + 1, c); // bottom mid
  minesFound += checkTile(r + 1, c + 1); // bottom right

  if (minesFound > 0) {
    board[r][c].innerText = minesFound;
  } else {
    // top 3
    checkMine(r - 1, c - 1); // top left
    checkMine(r - 1, c); // top mid
    checkMine(r - 1, c + 1); // top right

    // mid 2
    checkMine(r, c - 1); // mid left
    checkMine(r, c + 1); // mid right

    // bottom 3
    checkMine(r + 1, c - 1); // bottom left
    checkMine(r + 1, c); // bottom mid
    checkMine(r + 1, c + 1); // bottom right
  }

  if (tilesClicked == rows * cols - minesCount) {
    document.getElementById("mines-qty").innerHTML = "CLEARED";
    over("win");
    gameOver = true;
  }
}

function checkTile(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) {
    return 0;
  }
  if (minesLocation.includes(r.toString() + "-" + c.toString())) {
    return 1;
  }
  return 0;
}
