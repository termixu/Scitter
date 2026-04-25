const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Размеры мира
const W = 800, H = 600;

// Объекты игры
let mouse = { x: 400, y: 300, w: 30, h: 30, speed: 4 };
let cat = { x: 100, y: 100, w: 40, h: 40, speed: 2.2 };
let score = 0;

let gameRunning = true;

// Сыр
let cheese = { x: 650, y: 500, w: 18, h: 18, active: true };

// Управление
const keys = {
    ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
    w: false, s: false, a: false, d: false
};

// Назначение событий
window.addEventListener("keydown", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});
window.addEventListener("keyup", (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// Движение мыши
function moveMouse() {
    let dx = 0, dy = 0;
    if (keys.ArrowUp || keys.w) dy -= 1;
    if (keys.ArrowDown || keys.s) dy += 1;
    if (keys.ArrowLeft || keys.a) dx -= 1;
    if (keys.ArrowRight || keys.d) dx += 1;

    if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        dx /= len;
        dy /= len;
        mouse.x += dx * mouse.speed;
        mouse.y += dy * mouse.speed;
    }

    // Границы
    mouse.x = Math.min(Math.max(mouse.x, 0), W - mouse.w);
    mouse.y = Math.min(Math.max(mouse.y, 0), H - mouse.h);
}

// Кот преследует мышь
function moveCat() {
    const dx = mouse.x - cat.x;
    const dy = mouse.y - cat.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 0.5) {
        const move = Math.min(cat.speed, dist);
        cat.x += (dx / dist) * move;
        cat.y += (dy / dist) * move;
    }
}

// Проверка столкновений
function checkCollisions() {
    // Кот поймал мышь?
    if (cat.x < mouse.x + mouse.w &&
        cat.x + cat.w > mouse.x &&
        cat.y < mouse.y + mouse.h &&
        cat.y + cat.h > mouse.y) {
        gameRunning = false;
        alert("🐱 Кот поймал тебя! Очки: " + Math.floor(score) + "\nИгра окончена. Обнови страницу.");
        location.reload();
    }

    // Сбор сыра
    if (cheese.active &&
        mouse.x < cheese.x + cheese.w &&
        mouse.x + mouse.w > cheese.x &&
        mouse.y < cheese.y + cheese.h &&
        mouse.y + mouse.h > cheese.y) {
        cheese.active = false;
        score += 50;
        document.getElementById("scoreValue").innerText = Math.floor(score);
        // Респавн сыра в новом месте
        cheese.x = 50 + Math.random() * (W - 100);
        cheese.y = 50 + Math.random() * (H - 100);
        cheese.active = true;
    }
}

// Сложность растёт со счётом
function updateDifficulty() {
    cat.speed = 2.2 + Math.floor(score / 200);
    if (cat.speed > 6) cat.speed = 6;
}

// Отрисовка (пока прямоугольники, вместо спрайтов)
function draw() {
    ctx.fillStyle = "#0a0f0a";
    ctx.fillRect(0, 0, W, H);

    // Сыр
    if (cheese.active) {
        ctx.fillStyle = "#ffcc44";
        ctx.fillRect(cheese.x, cheese.y, cheese.w, cheese.h);
        ctx.fillStyle = "#ffaa22";
        ctx.fillRect(cheese.x + 4, cheese.y + 4, cheese.w - 8, cheese.h - 8);
    }

    // Кот Termix (квадратный, но скоро добавим спрайты)
    ctx.fillStyle = "#00aa33";
    ctx.fillRect(cat.x, cat.y, cat.w, cat.h);
    ctx.fillStyle = "#88ff88";
    ctx.font = "bold 18px monospace";
    ctx.fillText("😾", cat.x + 10, cat.y + 28);

    // Мышка
    ctx.fillStyle = "#aa8866";
    ctx.fillRect(mouse.x, mouse.y, mouse.w, mouse.h);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("🐭", mouse.x + 7, mouse.y + 22);

    // Очки на экране
    ctx.fillStyle = "#00ff41";
    ctx.font = "20px monospace";
    ctx.fillText("SCORE: " + Math.floor(score), 20, 40);
}

// Игровой цикл
function gameLoop() {
    if (!gameRunning) return;
    moveMouse();
    moveCat();
    checkCollisions();
    updateDifficulty();
    draw();
    requestAnimationFrame(gameLoop);
}

// Ежекундное увеличение очков за выживание
setInterval(() => {
    if (gameRunning) {
        score += 2;
        document.getElementById("scoreValue").innerText = Math.floor(score);
    }
}, 1000);

// Старт игры
window.onload = () => {
    canvas.width = W;
    canvas.height = H;
    gameLoop();
};
