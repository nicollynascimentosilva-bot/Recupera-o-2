// CONTROLE DE TEMA (DARK / LIGHT)
const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// VARIÁVEIS GERAIS DO ENGINE DE JOGOS
let gameInterval;
let countdownInterval;
let snake = [];
let food = {};
let dx = 20, dy = 0;
let score = 0;
let timeLeft = 10;
let gameActive = false;

function openGame(gameType) {
    const modal = document.getElementById('game-modal');
    const title = document.getElementById('game-title');
    const canvas = document.getElementById('gameCanvas');
    const clickerArena = document.getElementById('clicker-arena');
    const instructions = document.getElementById('instructions-panel');
    const timerDisplay = document.getElementById('timer-display');
    
    // Reset de estados
    modal.style.display = 'flex';
    document.getElementById('game-score').innerText = '0';
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    gameActive = true;

    if (gameType === 'snake') {
        title.innerText = '🐍 Snake Game';
        canvas.style.display = 'block';
        clickerArena.style.display = 'none';
        timerDisplay.style.display = 'none';
        
        // Correção Aprendizado 2: Instruções explícitas de controle
        instructions.innerHTML = 'Use as teclas <kbd>▲</kbd> <kbd>▼</kbd> <kbd>◀</kbd> <kbd>▶</kbd> do teclado para guiar a cobra.';
        startSnakeGame();
    } else if (gameType === 'clicker') {
        title.innerText = '⚡ Cyber Clicker';
        canvas.style.display = 'none';
        clickerArena.style.display = 'block';
        timerDisplay.style.display = 'block';
        
        // Correção Aprendizado 2: Objetivo e tempo explícitos
        instructions.innerHTML = 'Clique no botão azul o mais rápido possível antes do tempo esgotar!';
        startClickerGame();
    }
}

function closeGame() {
    document.getElementById('game-modal').style.display = 'none';
    clearInterval(gameInterval);
    clearInterval(countdownInterval);
    gameActive = false;
}

// LÓGICA: SNAKE GAME
function startSnakeGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    score = 0;
    
    snake = [{x: 160, y: 160}, {x: 140, y: 160}, {x: 120, y: 160}];
    dx = 20; dy = 0;
    genFood();
    
    document.addEventListener('keydown', changeDirection);
    gameInterval = setInterval(() => {
        ctx.fillStyle = '#050b14';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Desenha a Comida
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(food.x, food.y, 18, 18);
        
        // Move a Cobra
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        // Teletransporte de parede a parede
        if (head.x < 0) head.x = 380;
        if (head.x >= 400) head.x = 0;
        if (head.y < 0) head.y = 380;
        if (head.y >= 400) head.y = 0;
        
        snake.unshift(head);
        
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('game-score').innerText = score;
            genFood();
        } else {
            snake.pop();
        }
        
        // Desenha o corpo
        snake.forEach(part => {
            ctx.fillStyle = '#10b981';
            ctx.fillRect(part.x, part.y, 18, 18);
        });
    }, 100);
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    if (keyPressed === 37 && dx === 0) { dx = -20; dy = 0; } // Esquerda
    if (keyPressed === 38 && dy === 0) { dx = 0; dy = -20; } // Cima
    if (keyPressed === 39 && dx === 0) { dx = 20; dy = 0; }  // Direita
    if (keyPressed === 40 && dy === 0) { dx = 0; dy = 20; }  // Baixo
}

function genFood() {
    food.x = Math.floor(Math.random() * 20) * 20;
    food.y = Math.floor(Math.random() * 20) * 20;
}

// LÓGICA: CYBER CLICKER
function startClickerGame() {
    score = 0;
    timeLeft = 10;
    document.getElementById('game-timer').innerText = timeLeft;
    
    const btn = document.getElementById('target-btn');
    btn.style.top = '50%';
    btn.style.left = '50%';
    btn.disabled = false;
    
    btn.onclick = () => {
        if (!gameActive) return;
        score++;
        document.getElementById('game-score').innerText = score;
        
        // Move o alvo aleatoriamente dentro da arena de 300x400
        const newX = Math.floor(Math.random() * 80) + 10;
        const newY = Math.floor(Math.random() * 80) + 10;
        btn.style.left = `${newX}%`;
        btn.style.top = `${newY}%`;
    };
    
    // Contador regressivo do tempo limite
    countdownInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('game-timer').innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            gameActive = false;
            btn.disabled = true;
            document.getElementById('game-title').innerText = '🏁 FIM DE JOGO!';
        }
    }, 100);
}
