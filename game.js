const unitLength = 15;
const boxColor = "yellow"; // rgb 150 150 150 ＝ 黑 
const boxGenColor = "skyblue"
const boxNewColor = "orange"
const strokeColor = "black";
const stableColor = "green"
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard; //依一秒鐘魚江咩情況
let nextBoard; //下一秒鐘魚江咩情況
let fr = 20; //Default Speed
let diePpl = [2];
let birthPpl = [3];
let overPpl = [3];
let isGameStart = false
let randomNumber1; //(1-4) 
let randomNumber2; //(1-4) 
let randomNumber3; //(1-4) 

// let slider = document.getElementById("myRange");
// let output = document.getElementById("demo");
// output.innerHTML = slider.value;

// slider.oninput = function() { //立即看到
//   output.innerHTML = this.value;
//   document.getElementById("currentSpeed").innerHTML = this.value;
//   frameRate(this.value)
//   console.log(this.value)
// }


// document.querySelector('.fast')
//     .addEventListener('click', function () {
//         frameRate(200);
//         document.getElementById("currentSpeed").innerHTML = "Now : 200 Frame Rate "
//     })



function setup() {
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(windowWidth-50, windowHeight-250); // 850 479
    canvas.parent(document.querySelector('#canvas')); //拎番canvas 個parent 姐係個div


    background(255,0,0,0); //255 = white
    frameRate(20);

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);
    patternX = Math.floor(columns/2);
    patternY = Math.floor(rows/2);

    console.log(columns, rows);
    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) { //根據colums 數去loop,之後input empty into array
        currentBoard[i] = []; // currentBoard.push([])
        nextBoard[i] = []
    }
    setGameStart(false);
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();             // Set the initial values of the currentBoard and nextBoard
    insertPattern(patternX,patternY);
}


function windowResized() {
    resizeCanvas(windowWidth-50, windowHeight-250);
    setup();
  }



function init() {
    frameRate(fr);
    diePpl.splice(0, 0, 2);
    birthPpl.splice(0, 0, 3);
    overPpl.splice(0, 0, 3);
    document.getElementById("currentSpeed").innerHTML = "Now : 20 Frame Rate " //"Now : 20 Frame Rate "
    document.getElementById("currentDieNum").innerHTML = "Now : 2 "
    document.getElementById("currentOverNum").innerHTML = "Now : 3 "
    document.getElementById("currentBirthNum").innerHTML = "Now : 3 "


    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0; //0未出世 1出左世
            nextBoard[i][j] = 0;
        }
    }
}

function randomAll() {
    
    randomNumber1 = Math.floor(random() * 4 + 1)
    randomNumber2 = Math.floor(random() * 4 + 1)
    randomNumber3 = Math.floor(random() * 4 + 1)
    speedrandom = Math.floor(random() * 60 + 5)
    fr = speedrandom;

    diePpl.splice(0, 0, randomNumber1);
    birthPpl.splice(0, 0, randomNumber2);
    overPpl.splice(0, 0, randomNumber3);

    document.getElementById("currentDieNum").innerHTML = "Now : " + randomNumber1
    document.getElementById("currentOverNum").innerHTML = "Now : " + randomNumber2
    document.getElementById("currentBirthNum").innerHTML = "Now : " + randomNumber3
    document.getElementById("currentSpeed").innerHTML = "Now : " + speedrandom + " Frame Rate"

    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {

            currentBoard[i][j] = random() > 0.8 ? 1 : 0;
            nextBoard[i][j] = 0;
            frameRate(fr);
        }
    }
    setGameStart(false);
    updateUI();
}

function draw() {
    updateUI();
    if (!isGameStart) {
        return;
    }
    generate();
}

function generate() {
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {  //Loop 番周邊的9個格仔 (-1,-1) (-1,0) (-1,1)......
                for (let j of [-1, 0, 1]) {
                    if (i === 0 && j === 0) {
                        // the cell itself is not its own neighbor
                        // 9個可能性當中會出現（0 0） 即是自己，然後繼續行
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                    //IMPORTANT!!!!!!!,
                    //NEED TO UNDERSTAND!!!!
                }
            }
            // Rules of Life
            // 搵另一個位儲起更新，不想影響計算
            if (currentBoard[x][y] === 1 && neighbors < diePpl[0]) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] === 1 && neighbors > overPpl[0]) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] === 0 && neighbors === birthPpl[0]) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }
    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    fill(boxGenColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

function mousePressed() {
    noLoop();
    mouseDragged();
}

function mouseReleased() {
    loop();
}

function generatePattern(){
    const arr = [];
    for (let y = 0; y < rows; y++) {
        arr.push("");
        for (let x = 0; x < columns; x++) {
            arr[y] += currentBoard[x][y] === 0 ? "." : "O";
        }
    }
    const result = arr.join("\n");
    document.getElementById("patternTextArea").textContent = result;
}



//Insert new Pattern


// function insertNewPattern(x, y) {
//     const insertNewPattern = document.getElementById("insertPatternTextArea").value;

//     const newPatternArr = insertNewPattern.split("\n");
//     console.log(newPatternArr)

//     for (let i = 0; i < newPatternArr.length; i++) {  //逐個row loop
//         for (let j = 0; j < newPatternArr[i].length; j++) { //逐過column loop
//             currentBoard[x + j][y + i] = newPatternArr[i][j] === "." ? 0 : 1;
//         }
//     }
//     // currentBoard[0][5] = 1;
// }


function setGameStart(isStart) {
    isGameStart = isStart
    if (isStart) {
        loop();
    } else {
        noLoop();
    }
}

function updateUI() {

    // visualize the board
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            
            
            if (nextBoard[i][j] == 1) { //如果某一格等如1 （姐係有生命）
                fill(boxColor)
                if (currentBoard[i][j] === 1 && nextBoard[i][j] === currentBoard[i][j]){
                    fill(stableColor);
                }   //咁就會比色佢 色就去番頂頭選色
            } else if (currentBoard[i][j] == 1) {
                fill(boxNewColor); 
            } else {
                fill(60,0,0,70); 
                // fill(255) = white
            }

            stroke(strokeColor); //線條選色
            strokeWeight(2.5);
            
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
            //表達格仔線個座標位置，每個格仔左上角
            // unitLength 晝番條線出黎
        }
    }
}

///////////////////// KeyBoard //////////////////////


window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return; // Do nothing if event already handled
    }

    switch (event.code) {
        case "Digit1":
            // Handle "Start"
            setGameStart(true);
            break;
        case "Digit2":
            // Handle "Random"
            randomAll();
        case "Digit3":
            // Handle "Pause"
            setGameStart(false)
            break;
        case "Digit4":
            // Handle "Stop and clear setting"
            setGameStart(false);
            init();
            setup();
            break;
        case "Digit5":
            // Handle "Hold to pause"
            init();
            updateUI();
            break;
        case "Digit6":
            // Handle "Generate Pattern"
            generatePattern();
            break;
    }

    // Consume the event so it doesn't get handled twice
    event.preventDefault();
}, true);


/////////////Pattern Function///////////////////
function insertPattern(x, y) {
    const acornPatternArr = acornPattern.split("\n");
    let halfOfcolumnCount = 0;
    let halfOfrowCount = 0;

    for (let j = 0; j < acornPatternArr.length; j++){
        halfOfcolumnCount += 0.5;
    }

    for (let i = 0; i < acornPatternArr.length; i++){
        halfOfrowCount += 0.5;
    }


    for (let i = 0; i < acornPatternArr.length; i++) {  //逐個row loop
        for (let j = 0; j < acornPatternArr[i].length; j++) { //逐過column loop
            currentBoard[x - halfOfcolumnCount+ j][y - halfOfrowCount + i] = acornPatternArr[i][j] === "." ? 0 : 1;
        }
    }
    // currentBoard[0][5] = 1;
    updateUI();
}

function insertGun(x, y) {
    const gosperGliderArr = gosperGlider.split("\n");
    let halfOfrowCountGun = 0
    let halfOfcolumnCountGun = 0;


    for (let i = 0; i < gosperGliderArr.length; i++){
        halfOfrowCountGun += 0.5;
    }

    for (let j = 0; j < gosperGliderArr[0].length; j++){
        halfOfcolumnCountGun += 0.5;
    }


    for (let i = 0; i < gosperGliderArr.length; i++) {  //逐個row loop
        for (let j = 0; j < gosperGliderArr[i].length; j++) { //逐過column loop
            currentBoard[x - halfOfcolumnCountGun + j][y - Math.floor(halfOfrowCountGun) + i] = gosperGliderArr[i][j] === "." ? 0 : 1;
        }
    }
    updateUI();
}

function insertGlider(x, y) {
    const gliderArr = glider.split("\n");
    let halfOfrowCountGun = 0
    let halfOfcolumnCountGun = 0;
    
    for (let i = 0; i < gliderArr.length; i++){
        halfOfrowCountGun += 0.5;
    }

    for (let j = 0; j < gliderArr[0].length; j++){
        halfOfcolumnCountGun += 0.5;
    }


    for (let i = 0; i < gliderArr.length; i++) {  //逐個row loop
        for (let j = 0; j < gliderArr[i].length; j++) { //逐過column loop
            currentBoard[x - halfOfcolumnCountGun + j][y - Math.floor(halfOfrowCountGun) + i] = gliderArr[i][j] === "." ? 0 : 1;
        }
    }
    // currentBoard[0][5] = 1;
    updateUI();
}

function insertRich(x, y) {
    const richArr = Rich_s_p16.split("\n");
    let halfOfrowCountRich = 0
    let halfOfcolumnCountRich = 0;
    
    for (let i = 0; i < richArr.length; i++){
        halfOfrowCountRich += 0.5;
    }

    for (let j = 0; j < richArr[0].length; j++){
        halfOfcolumnCountRich += 0.5;
    }

    for (let i = 0; i < richArr.length; i++) {  //逐個row loop
        for (let j = 0; j < richArr[i].length; j++) { //逐過column loop
            currentBoard[x - Math.floor(halfOfcolumnCountRich) + j][y - Math.floor(halfOfrowCountRich) + i] = richArr[i][j] === "." ? 0 : 1;
        }
    }
    console.log(halfOfcolumnCountRich)
    // currentBoard[0][5] = 1;
    updateUI();
}



///////////////////Button/////////////////

//Start Game

document.querySelector('#start').addEventListener("click", (e) => {
    setGameStart(true);
});

//Start Game (Random)

document.querySelector('#random').addEventListener("click", (e) => {
    randomAll()
});


//Pause
document.querySelector('#pause').addEventListener("click", (e) => {
    setGameStart(false);
});

//Stop Game & Reset
document.querySelector('#stopNclear').addEventListener("click", (e) => {
    setGameStart(false);
    setup();
    frameRate(20);
});


//Press the button to Pause until release mouse
document.querySelector('#clear').addEventListener("click", (e) => {
    init();
    updateUI();
});


//Generate Pattern
document.querySelector('#generatePattern').addEventListener("click", (e) => {
    generatePattern();
});

// //Insert Pattern
// document.querySelector('#insertPattern').addEventListener("click", (e) => {
//     init();
//     updateUI();
//     insertNewPattern();
// });

//Insert Pattern (Gosper Glider Gun)

document.querySelector('#GosperGliderGun').addEventListener("click", (e) => {
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);
    patternX = Math.floor(columns/2);
    patternY = Math.floor(rows/2);

    init();
    updateUI();
    insertGun(patternX, patternY);
});

document.querySelector('#glider').addEventListener("click", (e) => {
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);
    patternX = Math.floor(columns/2);
    patternY = Math.floor(rows/2);

    init();
    updateUI();
    insertGlider(patternX, patternY);
});

document.querySelector('#rich_s_p16').addEventListener("click", (e) => {
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);
    patternX = Math.floor(columns/2);
    patternY = Math.floor(rows/2);

    init();
    updateUI();
    insertRich(patternX, patternY);
});



//Speed function

document.querySelector('.fast')
    .addEventListener('click', function () {
        frameRate(200);
        document.getElementById("currentSpeed").innerHTML = "Now : 200 Frame Rate "
    })

document.querySelector('.normal')
    .addEventListener('click', function () {
        frameRate(20);
        document.getElementById("currentSpeed").innerHTML = "Now : 20 Frame Rate "
    })

document.querySelector('.slow')
    .addEventListener('click', function () {
        frameRate(10);
        document.getElementById("currentSpeed").innerHTML = "Now : 10 Frame Rate "
    })
/////////////////////////


//rules of survival - Underpopulation
///////////////////
document.querySelector('.dieOne')
    .addEventListener('click', function () {
        diePpl.splice(0, 1, 1)
        document.getElementById("currentDieNum").innerHTML = "Now : 1"
    })

document.querySelector('.dieTwo')
    .addEventListener('click', function () {
        diePpl.splice(0, 1, 2)
        document.getElementById("currentDieNum").innerHTML = "Now : 2"
    })

document.querySelector('.dieThree')
    .addEventListener('click', function () {
        diePpl.splice(0, 1, 3)
        document.getElementById("currentDieNum").innerHTML = "Now : 3"
    })


document.querySelector('.dieFour')
    .addEventListener('click', function () {
        diePpl.splice(0, 1, 4)
        document.getElementById("currentDieNum").innerHTML = "Now : 4"
    })
/////////////////





//rules of survival - Overpopulation
///////////////////
document.querySelector('.overOne')
    .addEventListener('click', function () {
        overPpl.splice(0, 1, 1)
        document.getElementById("currentOverNum").innerHTML = "Now : 1 "
    })

document.querySelector('.overTwo')
    .addEventListener('click', function () {
        overPpl.splice(0, 1, 2)
        document.getElementById("currentOverNum").innerHTML = "Now : 2"
    })

document.querySelector('.overThree')
    .addEventListener('click', function () {
        overPpl.splice(0, 1, 3)
        document.getElementById("currentOverNum").innerHTML = "Now : 3 "
    })


document.querySelector('.overFour')
    .addEventListener('click', function () {
        overPpl.splice(0, 1, 4)
        document.getElementById("currentOverNum").innerHTML = "Now : 4"
    })
/////////////////


//rules of survival - Reproduction
///////////////////
document.querySelector('.birthOne')
    .addEventListener('click', function () {
        birthPpl.splice(0, 1, 1)
        document.getElementById("currentBirthNum").innerHTML = "Now : 1"
    })

document.querySelector('.birthTwo')
    .addEventListener('click', function () {
        birthPpl.splice(0, 1, 2)
        document.getElementById("currentBirthNum").innerHTML = "Now : 2"
    })
document.querySelector('.birthThree')
    .addEventListener('click', function () {
        birthPpl.splice(0, 1, 3)
        document.getElementById("currentBirthNum").innerHTML = "Now : 3"
    })
document.querySelector('.birthFour')
    .addEventListener('click', function () {
        birthPpl.splice(0, 1, 4)
        document.getElementById("currentBirthNum").innerHTML = "Now : 4"
    })
//////////////////
