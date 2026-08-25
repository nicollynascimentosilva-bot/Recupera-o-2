/**
 * ARCADEVERSE - CORE PLATFORM SCRIPT REVISADO
 * Gerenciador nativo de mini-games, modais e comportamento de interface.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothNavigation();
    initModalGameSystem();
});

// Mantém as abas do menu marcadas ao navegar
function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Mecânica modular dos jogos dentro da janela ativa (modal)
function initModalGameSystem() {
    const modal = document.getElementById('game-modal');
    const modalTitle = document.getElementById('modal-game-title');
    const modalScore = document.getElementById('modal-score-value');
    const closeBtn = document.getElementById('close-modal-btn');
    const controlsGuide = document.getElementById('modal-controls-guide');

    // Módulos internos de renderização
    const canvas = document.getElementById('arcadeCanvas');
    const clickerZone = document.getElementById('clickerTargetZone');
    const quizZone = document.getElementById('quizQuestionZone');

    let gameLoopInterval = null;
    let scoreCounter = 0;

    // Estados e variáveis do escopo do Snake corrigidos contra o bug NaN
    let snake = [];
    let dx = 20;
    let dy = 0;
    let food = { x: 0, y: 0 };

    const cards = document.querySelectorAll('.game-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const gameType = card.getAttribute('data-game');
            openArena(gameType);
        });
    });

    function openArena(type) {
        if (!modal) return;
        modal.classList.add('active');
        scoreCounter = 0;
        modalScore.innerText = scoreCounter;

        // Reset visual das sub-arenas
        if (canvas) canvas.style.display = 'none';
        if (clickerZone) clickerZone.style.display = 'none';
        if (quizZone) quizZone.style.display = 'none';
        if (gameLoopInterval) clearInterval(gameLoopInterval);

        document.removeEventListener('keydown', handleSnakeControls);

        if (type === 'snake') {
            if (modalTitle) modalTitle.innerText = '🐍 Neon Snake Active';
            if (canvas) canvas.style.display = 'block';
            if (controlsGuide) controlsGuide.innerHTML = 'Use as setas do teclado <kbd>▲</kbd> <kbd>▼</kbd> <kbd>◀</kbd> <kbd>▶</kbd>';
            startSnakeEngine();
        } else if (type === 'clicker') {
            if (modalTitle) modalTitle.innerText = '⚡ Quantum Clicker Active';
            if (clickerZone) clickerZone.style.display = 'block';
            if (controlsGuide) controlsGuide.innerHTML = 'Clique repetidamente no núcleo atômico central.';
            startClickerEngine();
        } else if (type === 'quiz') {
            if (modalTitle) modalTitle.innerText = '🏆 Tech Quiz Challenge';
            if (quizZone) quizZone.style.display = 'block';
            if (controlsGuide) controlsGuide.innerHTML = 'Selecione a alternativa correta baseada no conteúdo do projeto.';
            startQuizEngine();
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            if (gameLoopInterval) clearInterval(gameLoopInterval);
            document.removeEventListener('keydown', handleSnakeControls);
        });
    }

    /* MINI GAME NATIVO 1: SNAKE CORE ENGINE REVISADO */
    function startSnakeEngine() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // Inicializa a cabeça estruturada no array de objetos
        snake = [{x: 80, y: 80}, {x: 60, y: 80}];
        dx = 20; 
        dy = 0;
        food = {x: 160, y: 160};

        document.addEventListener('keydown', handleSnakeControls);

        gameLoopInterval = setInterval(() => {
            ctx.fillStyle = '#02010a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Desenha a partícula da comida
            ctx.fillStyle = '#ff0055';
            ctx.fillRect(food.x, food.y, 18, 18);

            // CORREÇÃO CRÍTICA: Mapeia as propriedades 'x' e 'y' acessando o primeiro índice (cabeça) da lista [0]
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            
            // Comportamento de túnel infinito pelas paredes do Canvas
            if (head.x < 0) head.x = 320;
            if (head.x > 320) head.x = 0;
            if (head.y < 0) head.y = 320;
            if (head.y > 320) head.y = 0;

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                scoreCounter += 10;
                modalScore.innerText = scoreCounter;
                food.x = Math.floor(Math.random() * 15) * 20;
                food.y = Math.floor(Math.random() * 15) * 20;
            } else {
                snake.pop();
            }

            // Desenha o corpo da cobra em neon estável
            snake.forEach(part => {
                ctx.fillStyle = '#00ff87';
                ctx.fillRect(part.x, part.y, 18, 18);
            });
        }, 130);
    }

    function handleSnakeControls(e) {
        if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
            e.preventDefault(); // Impede que a tela suba/desça jogando
        }
        if (e.key === 'ArrowLeft' && dx === 0) { dx = -20; dy = 0; }
        if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -20; }
        if (e.key === 'ArrowRight' && dx === 0) { dx = 20; dy = 0; }
        if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 20; }
    }

    /* MINI GAME NATIVO 2: CLICKER ENGINE */
    function startClickerEngine() {
        const atom = document.getElementById('coreTargetAtom');
        if (!atom) return;
        
        atom.style.cssText = "padding:1.5rem; background:#00d2ff; color:black; font-weight:bold; border:none; border-radius:50%; cursor:pointer; box-shadow:0 0 20px #00d2ff;";
        
        atom.onclick = () => {
            scoreCounter++;
            modalScore.innerText = scoreCounter;
        };
    }

    /* MINI GAME NATIVO 3: QUIZ ENGINE */
    function startQuizEngine() {
        const questionText = document.getElementById('quiz-question-prompt');
        const stack = document.getElementById('quiz-answers-stack');
        if (!questionText || !stack) return;

        questionText.innerText = "Qual elemento HTML é utilizado para renderizar os gráficos dos jogos nativos via Script?";
        stack.innerHTML = "";

        const options = ["<section>", "<canvas>", "<video>", "<div>"];
        options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.style.cssText = "width:100%; padding:0.6rem; margin-top:0.5rem; background:#161245; color:white; border:1px solid #231a66; border-radius:6px; cursor:pointer;";
            btn.innerText = opt;
            btn.onclick = () => {
                if (index === 1) { // Alternativa correta: <canvas>
                    scoreCounter += 100;
                    modalScore.innerText = scoreCounter;
                    questionText.innerText = "Parabéns! Resposta Correta.";
                    stack.innerHTML = "";
                } else {
                    questionText.innerText = "Resposta incorreta. Tente novamente!";
                }
            };
            stack.appendChild(btn);
        });
    }
}
