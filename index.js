let arr = [];
let cols = 8;
let rows = 8;
let mines = 10;
let revealed = {};
let flagged = {};
let firstClick = true;
let firstClickRow = -1;
let firstClickCol = -1;
const body = document.querySelector("body")
let flagsCount = 0;
let countMines = mines;
let countNum = cols * rows - mines;


let startTime = Date.now();
let timerElement = document.getElementsByName('timer');
let formattedTime;
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
    minCount.textContent = `${countMines}`

    let timer = document.createElement("div");
    timer.className = "timer";
    timer.id = "timer";
    timer.textContent = `00:00:00`
    document.body.appendChild(timer);

    startTime = Date.now();
    timerElement = document.getElementById('timer');

    setInterval(updateTimer, 1000);


    for (let i = 0; i < rows; i++) {
        let rowDiv = document.createElement("div");
        rowDiv.className = "minesweeper_row";

        for (let j = 0; j < cols; j++) {
            let cellDiv = document.createElement("button");
            cellDiv.className = `minesweeper_field fieledNum}`;
            cellDiv.id = `cell_${i}_${j}`
            revealed[`${i}${j}`] = false
            flagged[`${i}${j}`] = false

            cellDiv.addEventListener('mousedown', function (event) {
                if (event.button === 0 && !(flagged[`${i}${j}`] || revealed[`${i}${j}`])) {
                    if (firstClick) {
                        firstClickRow = i;
                        firstClickCol = j;
                        firstClick = false;
                        console.log(firstClickRow, firstClickCol)
                        arrSapper()
                    }
                    revealed[`${i}${j}`] = true;
                    revealCells(i, j)
                }
                if (event.button === 2 && !revealed[`${i}${j}`] && countMines > 0) {

                    flagged[`${i}${j}`] = !flagged[`${i}${j}`];

                    if (flagged[`${i}${j}`]) {
                        cellDiv.className = `minesweeper_field flag`;
                        flagsCount++;
                    } else {
                        cellDiv.className = `minesweeper_field fieledNum}`;
                        flagsCount--;
                    }
                    countMines = mines - flagsCount;
                    console.log(countMines)
                    minCount.textContent = `${countMines}`

                }

            })
            cellDiv.addEventListener('contextmenu', function (event) {
                event.preventDefault();
            });
            rowDiv.appendChild(cellDiv);


        }

        body.appendChild(rowDiv);
        body.appendChild(minCount);
        document.body.appendChild(timer);

    }
}


function arrSapper() {

    for (let i = 0; i < rows; i++) {
        arr[i] = [];
        for (let j = 0; j < cols; j++) {
            arr[i][j] = "0";
        }
    }

    let count = 0;
    while (count < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        console.log('ввввввввв', firstClickRow, firstClickCol)
        if ((row != firstClickRow || col != firstClickCol) &&
            (row < firstClickRow - 1 || row > firstClickRow + 1 || col < firstClickCol - 1 || col > firstClickCol + 1)) {
            if (arr[row][col] !== "*") {
                arr[row][col] = "*";
                count++;
            }
        }
    }
    // printArr()

    let countMines;
    let x = 0;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            countMines = 0;

            if (arr[i][j] !== "*") {
                for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rows - 1); x++) {
                    for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, cols - 1); y++) {

                        if (x !== i || y !== j) {
                            if (arr[x][y] === "*") {
                                countMines++;
                            }
                        }
                    }
                }
                arr[i][j] = countMines.toString();
            }
        }
    }
}

function revealCells(i, j) {
    if (i < 0 || i >= rows || j < 0 || j >= cols) return;

    let cell = document.getElementById(`cell_${i}_${j}`);
    let value = arr[i][j];

    if (cell.classList.contains('revealed')) return;

    printNum(value, cell);
    countNum--;
    console.log(countNum)
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
        alert(`Вы выиграли! Игровое время ${formattedTime}`)
        location.reload()
    }
}

function printNum(value, cellDiv) {

    cellDiv.textContent = `${value}`
    let num = colors[value];

    if (value === "*") {
        cellDiv.className = `minesweeper_field mines`;
        alert(`Вы проиграли! Игровое время ${formattedTime}`)
        location.reload()

    } else {
        if (value !== "0") {
            cellDiv.className = `minesweeper_field fieledNum ${num}`;

        } else {
            cellDiv.className = `minesweeper_field fieledNum ${num}`;
            cellDiv.textContent = ` `

        }
    }
}

printArrHtml()



