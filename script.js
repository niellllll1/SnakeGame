const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const box = 20;
let score, gameActive, gameStarted, snake, d, gameLoop, foodItems;

// --- CONFIGURATION ---
const REDIRECT_URL = "Vpage.html"; 
const TARGET_SCORE = 4;

function init() {
    score = 0;
    scoreElement.innerHTML = score;
    gameActive = true;
    gameStarted = false;
    snake = [{ x: 10 * box, y: 10 * box }];
    d = null;
    foodItems = [getRandomPos(), getRandomPos()];
    document.getElementById("gameOverScreen").classList.add("hidden");
    if(gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(draw, 140);
}

function getRandomPos() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function drawHeart(x, y, size) {
    ctx.fillStyle = "#e94560";
    ctx.beginPath();
    let topCurveHeight = size * 0.3;
    ctx.moveTo(x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + size);
    ctx.bezierCurveTo(x + size / 2, y + (size + topCurveHeight) / 2, x + size, y + (size + topCurveHeight) / 2, x + size, y + topCurveHeight);
    ctx.bezierCurveTo(x + size, y, x + size / 2, y, x + size / 2, y + topCurveHeight);
    ctx.fill();
}

function handleInput(dir) {
    gameStarted = true;
    if (dir === "UP" && d !== "DOWN") d = "UP";
    if (dir === "DOWN" && d !== "UP") d = "DOWN";
    if (dir === "LEFT" && d !== "RIGHT") d = "LEFT";
    if (dir === "RIGHT" && d !== "LEFT") d = "RIGHT";
}

// Mobile Button Listeners
document.getElementById("upBtn").addEventListener("touchstart", (e) => { e.preventDefault(); handleInput("UP"); });
document.getElementById("downBtn").addEventListener("touchstart", (e) => { e.preventDefault(); handleInput("DOWN"); });
document.getElementById("leftBtn").addEventListener("touchstart", (e) => { e.preventDefault(); handleInput("LEFT"); });
document.getElementById("rightBtn").addEventListener("touchstart", (e) => { e.preventDefault(); handleInput("RIGHT"); });

// Click fallback
document.getElementById("upBtn").addEventListener("click", () => handleInput("UP"));
document.getElementById("downBtn").addEventListener("click", () => handleInput("DOWN"));
document.getElementById("leftBtn").addEventListener("click", () => handleInput("LEFT"));
document.getElementById("rightBtn").addEventListener("click", () => handleInput("RIGHT"));

// Keyboard Listeners
document.addEventListener("keydown", (e) => {
    const keys = { 37: "LEFT", 38: "UP", 39: "RIGHT", 40: "DOWN" };
    if (keys[e.keyCode]) handleInput(keys[e.keyCode]);
});

function draw() {
    if (!gameActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    foodItems.forEach(item => drawHeart(item.x, item.y, box));

    snake.forEach((part, i) => {
        ctx.fillStyle = (i == 0) ? "#ff4d6d" : "#c9184a";
        ctx.beginPath();
        ctx.roundRect(part.x, part.y, box-2, box-2, 5);
        ctx.fill();
    });

    if (!gameStarted) {
        ctx.fillStyle = "white"; ctx.textAlign = "center";
        ctx.font = "14px Poppins";
        ctx.fillText("TAP BUTTONS TO START", canvas.width/2, canvas.height/2);
        return;
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    if (snakeX < 0) snakeX = canvas.width - box; else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box; else if (snakeY >= canvas.height) snakeY = 0;

    for(let i = 0; i < foodItems.length; i++) {
        if(snakeX === foodItems[i].x && snakeY === foodItems[i].y) {
            score++;
            scoreElement.innerHTML = score;
            
            // REDIRECT TO Vpage.html
            if (score >= TARGET_SCORE) {
                gameActive = false;
                clearInterval(gameLoop);
                window.location.href = REDIRECT_URL; 
                return;
            }
            
            foodItems[i] = getRandomPos();
            snake.push({}); 
        }
    }

    if (snake.some((p, i) => i !== 0 && p.x === snakeX && p.y === snakeY)) {
        gameActive = false;
        document.getElementById("gameOverScreen").classList.remove("hidden");
        return;
    }
    
    snake.pop();
    snake.unshift({ x: snakeX, y: snakeY });
}

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart-bg');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 5 + 5 + 's';
    document.getElementById('heart-container').appendChild(heart);
    setTimeout(() => { heart.remove(); }, 8000);
}

setInterval(createHeart, 600);
init();
