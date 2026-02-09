const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highElement = document.getElementById("highScore");
const gameOverScreen = document.getElementById("gameOverScreen");
const deathMessage = document.getElementById("deathMessage");

const box = 20; 
let score, highScore, gameActive, gameStarted, snake, food, bomb, d, gameLoop;

function init() {
    score = 0;
    highScore = localStorage.getItem("snakeHighScore") || 0;
    highElement.innerHTML = highScore;
    scoreElement.innerHTML = score;
    gameActive = true;
    gameStarted = false;
    snake = [{ x: 8 * box, y: 8 * box }];
    d = null;
    food = getRandomPos();
    bomb = getRandomPos();
    gameOverScreen.classList.add("hidden");
    if(gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(draw, 130);
}

function getRandomPos() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function setDirection(newDir) {
    if (!gameActive) return;
    gameStarted = true;
    if(newDir == "LEFT" && d != "RIGHT") d = "LEFT";
    else if(newDir == "UP" && d != "DOWN") d = "UP";
    else if(newDir == "RIGHT" && d != "LEFT") d = "RIGHT";
    else if(newDir == "DOWN" && d != "UP") d = "DOWN";
}

document.addEventListener("keydown", (e) => {
    const keys = { 37: "LEFT", 38: "UP", 39: "RIGHT", 40: "DOWN" };
    if (keys[e.keyCode]) setDirection(keys[e.keyCode]);
});

function draw() {
    if (!gameActive) return;

    ctx.fillStyle = "#16213e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Food & Bomb
    ctx.fillStyle = "#ff4d4d";
    ctx.fillRect(food.x, food.y, box, box);
    ctx.fillStyle = "#ff9f43";
    ctx.beginPath();
    ctx.arc(bomb.x + box/2, bomb.y + box/2, box/2, 0, Math.PI * 2);
    ctx.fill();

    // Draw Snake
    snake.forEach((part, i) => {
        ctx.fillStyle = (i == 0) ? "#4ecca3" : "#45b293";
        ctx.fillRect(part.x, part.y, box, box);
    });

    if (!gameStarted) {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("TAP TO START", canvas.width/2, canvas.height/2);
        return;
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    // Wall Warp
    if (snakeX < 0) snakeX = canvas.width - box;
    else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    else if (snakeY >= canvas.height) snakeY = 0;

    // Collision Check
    let newHead = { x: snakeX, y: snakeY };
    if ((snakeX === bomb.x && snakeY === bomb.y) || snake.some((p, i) => i !== 0 && p.x === snakeX && p.y === snakeY)) {
        triggerGameOver(snakeX === bomb.x ? "BOOM! HIT A BOMB" : "YOU HIT YOURSELF!");
        return;
    }

    // Eat Apple
    if(snakeX == food.x && snakeY == food.y) {
        score++;
        scoreElement.innerHTML = score;
        if(score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            highElement.innerHTML = highScore;
        }
        // Redirect Logic
        if (score >= 6) {
            clearInterval(gameLoop);
            window.location.href = "Vpage.html";
            return;
        }
        food = getRandomPos();
        bomb = getRandomPos();
    } else {
        snake.pop();
    }
    snake.unshift(newHead);
}

function triggerGameOver(msg) {
    gameActive = false;
    clearInterval(gameLoop);
    deathMessage.innerText = msg;
    gameOverScreen.classList.remove("hidden");
}

function resetGame() {
    init();
}

// Start game for first time
init();
