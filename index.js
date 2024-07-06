// Constants
const COLS = 8;
const ROWS = 8;
const MINES = 10;

// State
let arr = [];
let revealed = {};
let flagged = {};
let firstClick = true;
let firstClickRow = -1;
let firstClickCol = -1;
let flagsCount = 0;
let countNum = COLS * ROWS - MINES;
let startTime = Date.now();
let timerElement;
let formattedTime;

// Colors mapping
const colors = {
    0: "white",
    1: "blue",
    2: "green",
    3: "red",
    4: "darkblue",
    5: "brown",
    6: "cyan",
    7: "black",
    8: "gray"
};

// DOM Elements
const body = document.querySelector("body");

// Functions
function updateTimer() {
    let currentTime = Date.now();
    let elapsedTime = currentTime - startTime;
    let seconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerElement.textContent = formattedTime;
}

function printArrHtml() {
    let minCount = document.createElement("div");
    minCount.className = "min_count";
    minCount.textContent = `${MINES}`;

    timerElement = document.createElement("div");
    timerElement.className = "timer";
    timerElement.id = "timer";
    timerElement.textContent = "00:00:00";

    body.appendChild(minCount);
    body.appendChild(timerElement);

    startTime = Date.now();
    setInterval(updateTimer, 1000);

    for (let i = 0; i < ROWS; i++) {
        let rowDiv = document.createElement("div");
        rowDiv.className = "minesweeper_row";

        for (let j = 0; j < COLS; j++) {
            let cellDiv = document.createElement("button");
            cellDiv.className = "minesweeper_field fieledNum";
            cellDiv.id = `cell_${i}_${j}`;
            revealed[`${i}${j}`] = false;
            flagged[`${i}${j}`] = false;

            cellDiv.addEventListener('mousedown', function (event) {
                handleCellClick(event, i, j);
            });

            cellDiv.addEventListener('contextmenu', function (event) {
                event.preventDefault();
            });

            rowDiv.appendChild(cellDiv);
        }

        body.appendChild(rowDiv);
    }
}

function handleCellClick(event, i, j) {
    if (event.button === 0 && !(flagged[`${i}${j}`] || revealed[`${i}${j}`])) {
        if (firstClick) {
            firstClickRow = i;
            firstClickCol = j;
            firstClick = false;
            arrSapper();
        }
        revealed[`${i}${j}`] = true;
        revealCells(i, j);
    } else if (event.button === 2 && !revealed[`${i}${j}`] && MINES - flagsCount > 0) {
        flagged[`${i}${j}`] = !flagged[`${i}${j}`];
        if (flagged[`${i}${j}`]) {
            flagsCount++;
            document.getElementById(`cell_${i}_${j}`).classList.add('flag');
        } else {
            flagsCount--;
            document.getElementById(`cell_${i}_${j}`).classList.remove('flag');
        }
        document.querySelector('.min_count').textContent = `${MINES - flagsCount}`;
    }
}

function arrSapper() {
    arr = Array.from({ length: ROWS }, () => Array(COLS).fill("0"));

    let count = 0;
    while (count < MINES) {
        const row = Math.floor(Math.random() * ROWS);
        const col = Math.floor(Math.random() * COLS);
        if ((row !== firstClickRow || col !== firstClickCol) &&
            (row < firstClickRow - 1 || row > firstClickRow + 1 || col < firstClickCol - 1 || col > firstClickCol + 1)) {
            if (arr[row][col] !== "*") {
                arr[row][col] = "*";
                count++;
            }
        }
    }

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (arr[i][j] !== "*") {
                let countMines = 0;
                for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, ROWS - 1); x++) {
                    for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, COLS - 1); y++) {
                        if (arr[x][y] === "*") {
                            countMines++;
                        }
                    }
                }
                arr[i][j] = countMines.toString();
            }
        }
    }
}

function revealCells(i, j) {
    if (i < 0 || i >= ROWS || j < 0 || j >= COLS) return;

    let cell = document.getElementById(`cell_${i}_${j}`);
    let value = arr[i][j];

    if (cell.classList.contains('revealed')) return;

    printNum(value, cell);
    countNum--;

    cell.classList.add('revealed');

    if (value === "0") {
        for (let x = i - 1; x <= i + 1; x++) {
            for (let y = j - 1; y <= j + 1; y++) {
                if (x !== i || y !== j) {
                    revealCells(x, y);
                }
            }
        }
    }

    if (countNum === 0) {
        alert(`Вы выиграли! Игровое время ${formattedTime}`);
        location.reload();
    }
}

function printNum(value, cellDiv) {
    cellDiv.textContent = value;
    let num = colors[value];

    if (value === "*") {
        cellDiv.className = `minesweeper_field mines`;
        alert(`Вы проиграли! Игровое время ${formattedTime}`);
        location.reload();
    } else {
        cellDiv.className = `minesweeper_field fieledNum ${num}`;
        if (value === "0") {
            cellDiv.textContent = "";
        }
    }
}

printArrHtml();