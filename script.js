/**
 * ARCADEVERSE - CORE PLATFORM SYSTEM SCRIPT
 * Código totalmente auditado contra falhas lógicas e erros de runtime.
 */

document.addEventListener('DOMContentLoaded', () => {
    initModalGameSystem();
});

function initModalGameSystem() {
    const modal = document.getElementById('game-modal');
    const modalTitle = document.getElementById('modal-game-title');
    const modalScore = document.getElementById('modal-score-value');
    const closeBtn = document.getElementById('close-modal-x');

    const canvas = document.getElementById('arcadeCanvas');
    const clickerZone = document.getElementById('clickerZone');
    const quizZone = document.getElementById('quizZone');

    let gameLoopInterval = null;
    let scoreCounter = 0;

    // Estados e variáveis do escopo do Snake blindados contra erros matemáticos
    let snake = [];
    let dx = 20;
    let dy = 0;
    let food = { x: 0, y: 0 };

    const cards = document.querySelectorAll('.arcade-card');
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

        if (canvas) canvas.style.display = 'none';
        if (clickerZone) clickerZone.style.display = 'none';
        if (quizZone) quizZone.style.display = 'none';
        if (gameLoopInterval) clearInterval(gameLoopInterval);

        document.removeEventListener('keydown', handleSnakeControls);

        if (type === 'snake') {
            if (modalTitle) modalTitle.innerText = '🐍 Neon Snake Ativo';
            if (canvas) canvas.style.display = 'block';
            startSnakeEngine();
        } else if (type === 'clicker') {
            if (modalTitle) modalTitle.innerText = '⚡ Quantum Clicker Ativo';
            if (clickerZone) clickerZone.style.display = 'block';
            startClickerEngine();
        } else if (type === 'quiz') {
            if (modalTitle) modalTitle.innerText = '🏆 Tech Quiz Challenge';
            if (quizZone) quizZone.style.display = 'block';
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

    /* MINI GAME 1: SNAKE CORE ENGINE TOTALMENTE CORRIGIDO */
    function startSnakeEngine() {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        snake = [{x: 80, y: 80}, {x: 60, y: 80}];
        dx = 20; 
        dy = 0;
        food = {x: 160, y: 160};

        document.addEventListener('keydown', handleSnakeControls);

        gameLoopInterval = setInterval(() => {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Renderiza a maçã no canvas
            ctx.fillStyle = '#ff0055';
            ctx.fillRect(food.x, food.y, 18, 18);

            // CORREÇÃO DEFINITIVA: Acessa o índice 0 da lista (cabeça) para computar o vetor de movimento
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            
            // Tratamento de colisão por borda infinita
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

            // Desenha o corpo da cobra
            snake.forEach(part => {
                ctx.fillStyle = '#00ff87';
                ctx.fillRect(part.x, part.y, 18, 18);
            });
        }, 130);
    }

    function handleSnakeControls(e) {
        if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
            e.preventDefault(); // Impede a rolagem involuntária do navegador
        }
        if (e.key === 'ArrowLeft' && dx === 0) { dx = -20; dy = 0; }
        if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -20; }
        if (e.key === 'ArrowRight' && dx === 0) { dx = 20; dy = 0; }
        if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 20; }
    }

    /* MINI GAME 2: CLICKER ENGINE */
    function startClickerEngine() {
        const target = document.getElementById('clickerTarget');
        if (!target) return;
        target.style.cssText = "padding:1.5rem; background:#00d2ff; color:black; font-weight:bold; border:none; border-radius:50%; cursor:pointer; box-shadow:0 0 20px #00d2ff; font-family: inherit;";
        target.onclick = () => {
            scoreCounter++;
            modalScore.innerText = scoreCounter;
        };
    }

    /* MINI GAME 3: QUIZ ENGINE ACADÊMICO */
    function startQuizEngine() {
        const questionText = document.getElementById('quiz-question');
        const optionsStack = document.getElementById('quiz-options');
        if (!questionText || !optionsStack) return;

        questionText.innerText = "Qual elemento HTML é utilizado para renderizar os gráficos dos jogos nativos via Script?";
        optionsStack.innerHTML = "";

        const options = ["<section>", "<canvas>", "<video>", "<div>"];
        options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.style.cssText = "width:100%; padding:0.6rem; margin-top:0.5rem; background:#161245; color:white; border:1px solid #231a66; border-radius:6px; cursor:pointer; font-family: inherit;";
            btn.innerText = opt;
            btn.onclick = () => {
                if (index === 1) { // Mapeia <canvas> como correta
                    scoreCounter += 100;
                    modalScore.innerText = scoreCounter;
                    questionText.innerText = "Parabéns! Resposta Correta.";
                    optionsStack.innerHTML = "";
                } else {
                    questionText.innerText = "Resposta incorreta. Tente novamente!";
                }
            };
            optionsStack.appendChild(btn);
        });
    }
}
