/*--------------------------------------
 * Variables
 *--------------------------------------
 */


var snake;
var snakeLength;
var snakeSize;
var snakeDirection;

var food;

var context;
var screenWidth;
var screenHeight;

var gameState;
var gameOverMenu;
var restartButton;
var playHUD;
var scoreboard;

/*----------------------------------------------
 * Executing Game Code
 * ---------------------------------------------
 */
gameInitialize();
snakeInitialize();
foodInitialize();
setInterval(gameLoop, 1000 / 30);

/*----------------------------------------------
 * Game Functions
 * ---------------------------------------------
 */

function gameInitialize() {
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    document.addEventListener("keydown", keyboardHandler);

    gameOverMenu = document.getElementById("gameOver");
    centerMenuPosition(gameOverMenu);

    restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", gameRestart);

    playHUD = document.getElementById("playHUD");
    scoreboard = document.getElementById("scoreboard");

    setState("PLAY");
}

function gameLoop() {
    gameDraw();
    drawScoreboard();
    if (gameState == "PLAY") {
        snakeUpdate();
        snakeDraw();
        foodDraw();
    }
}

/*gameDraw is where you can put in your background like color and height of the screen.*/
function gameDraw() {
    context.fillStyle = "rgb(30, 199, 199)";
    context.fillRect(0, 0, screenWidth, screenHeight);
}

/*gameRestart is when you loose the game and these are used for functioning to start over.*/
function gameRestart() {
    snakeInitialize();
    foodInitialize();
    hideMenu(gameOverMenu);
    setState("PLAY");
}

/*----------------------------------------
 * Snake Functions
 * ---------------------------------------
 */

/*snakeInitalize is where you can put the size you want to put in your snake and what direction it should start while playing.*/
function snakeInitialize() {
    snake = [];
    snakeLength = 1;
    snakeSize = 20;
    snakeDirection = "down";

    for (var index = snakeLength - 1; index >= 0; index--) {
        snake.push({
            x: index,
            y: 0
        });
    }
}

function snakeDraw() {
    for (var index = 0; index < snake.length; index++) {
        context.fillStyle = "navy";
        context.fillRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
    }
}

function snakeUpdate() {
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;

    if (snakeDirection == "down") {
        snakeHeadY++;
    }

    else if (snakeDirection == "right") {
        snakeHeadX++;
    }

    else if (snakeDirection == "left") {
        snakeHeadX--
    }
    else if (snakeDirection == "up") {
        snakeHeadY--
    }

    checkFoodCollisions(snakeHeadX, snakeHeadY);
    checkWallCollisions(snakeHeadX, snakeHeadY);
    checkSnakeCollisions(snakeHeadX, snakeHeadY);

    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

/*-------------------------------------
 *  Food Functions
 *------------------------------------- 
 */

function foodInitialize() {
    food = {
        x: 0,
        y: 0
    };
    setFoodPosition();
}

function foodDraw() {
    context.filStyle = "white";
    context.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}

function setFoodPosition() {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);

    food.x = Math.floor(randomX / snakeSize);
    food.y = Math.floor(randomY / snakeSize);
}
/*-----------------------------
 * Input Functions
 * ----------------------------
 */

function keyboardHandler(event) {
    console.log(event);

    if (event.keyCode == "39" || event.keyCode == "82" && snakeDirection != "left") {
        snakeDirection = "right";
    }

    else if (event.keyCode == "40" || event.keyCode == "68" && snakeDirection != "up") {
        snakeDirection = "down";
    }

    else if (event.keyCode == "37" || event.keyCode == "76" && snakeDirection != "right") {
        snakeDirection = "left";
    }

    else if (event.keyCode == "38" || event.keyCode == "85" && snakeDirection != "down") {
        snakeDirection = "up";
    }
}

/*---------------------------------------------------------------------------------------------------
 * Collision Handling
 *---------------------------------------------------------------------------------------------------
 */


function checkFoodCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX == food.x && snakeHeadY == food.y) {
        snake.push({
            x: 0,
            y: 0
        });
        snakeLength++;
    }
}

function checkWallCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0) {
        setState("GAME OVER");
    }
}

function checkSnakeCollisions(snakeHeadX, snakeHeadY) {
    for (var index = 1; index < snake.length; index++)
        if (snakeHeadX == snake[index].x && snakeHeadY == snake[index].y) {
            setState("GAME OVER");
            return;
        }
}

/*--------------------------------------------------------------------------------------
 * Game State Handling
 *--------------------------------------------------------------------------------------
 */

function setState(state) {
    gameState = state;
    showMenu(state);
}

/*----------------------------------------------------------------------------------------
 * Menu Functions
 *----------------------------------------------------------------------------------------
 */

function displayMenu(menu) {
    menu.style.visibility = "visible";
}

function hideMenu(menu) {
    menu.style.visibility = "hidden"
}

function showMenu(state) {
    if (state == "GAME OVER") {
        displayMenu(gameOverMenu);
    }
    else if (state == "PLAY") {
        displayMenu(playHUD);
    }
}

function centerMenuPosition(menu) {
    menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px";
    menu.style.left = (screenWidth / 2) - (menu.offsetWidth / 2) + "px";
}

/**/
function drawScoreboard() {
    scoreboard.innerHTML = "Length :" + snakeLength;
}