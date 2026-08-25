/**
 * ARCADEVERSE - CORE FRAMEWORK ENGINE REVISADO
 * Código totalmente blindado contra exceções nulas ou estouro de memória no DOM.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigationModule();
    initThemeModule();
    initGameEngineModule();
    initValidationFormModule();
});

// GESTÃO DO MENU MOBILE RESPONSIVO
function initNavigationModule() {
    const menuMobileBtn = document.getElementById('menu-mobile-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (menuMobileBtn && navLinks) {
        menuMobileBtn.addEventListener('click', () => {
            const isExpanded = menuMobileBtn.getAttribute('aria-expanded') === 'true';
            menuMobileBtn.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-item-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuMobileBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ALTERNADOR INTELIGENTE DE TEMAS COM CORES NEON ADAPTATIVAS
function initThemeModule() {
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        if (localStorage.getItem('arcadeverse-theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('arcadeverse-theme', isDark ? 'dark' : 'light');
        });
    }
}

// CONTROLE E MÁQUINA DE ESTADO DOS JOGOS INTERATIVOS NATIVOS
function initGameEngineModule() {
    const modal = document.getElementById('game-modal');
    const modalTitle = document.getElementById('modal-title');
    const displayScore = document.getElementById('display-score');
    const timerWrapper = document.getElementById('display-timer-wrapper');
    const displayTimer = document.getElementById('display-timer');
    const controlsGuide = document.getElementById('modal-controls-guide');
    
    const snakeCanvas = document.getElementById('snakeCanvas');
    const clickerArena = document.getElementById('clickerArena');
    const quizArena = document.getElementById('quizArena');

    let engineInterval = null;
    let countdownInterval = null;
    let currentGameState = { score: 0, timer: 10, isRunning: false };

    // Escopo de variáveis do Mini-game Snake
    let sBody = [];
    let fPoint = { x: 0, y: 0 };
    let sDx = 20;
    let sDy = 0;

    const cards = document.querySelectorAll('.game-card');
    cards.forEach(card => {
        const runTrigger = () => openGameInterface(card.getAttribute('data-game'));
        card.addEventListener('click', runTrigger);
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') runTrigger(); });
    });

    function openGameInterface(gameType) {
        if (!modal) return;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        if (displayScore) displayScore.innerText = '0';
        
        currentGameState.score = 0;
        currentGameState.isRunning = true;

        if (snakeCanvas) snakeCanvas.style.display = 'none';
        if (clickerArena) clickerArena.style.display = 'none';
        if (quizArena) quizArena.style.display = 'none';
        if (timerWrapper) timerWrapper.style.display = 'none';
        
        if (engineInterval) clearInterval(engineInterval);
        if (countdownInterval) clearInterval(countdownInterval);

        document.removeEventListener('keydown', handleSnakeControls);

        if (gameType === 'snake') {
            if (modalTitle) modalTitle.innerText = 'Neon Snake System';
            if (snakeCanvas) snakeCanvas.style.display = 'block';
            if (controlsGuide) controlsGuide.innerHTML = 'Controles: Use as setas <kbd>▲</kbd> <kbd>▼</kbd> <kbd>◀</kbd> <kbd>▶</kbd> do teclado.';
            runSnakeEngine();
        } else if (gameType === 'clicker') {
            if (modalTitle) modalTitle.innerText = 'Quantum Target Hunter';
            if (clickerArena) clickerArena.style.display = 'block';
            if (timerWrapper) timerWrapper.style.display = 'block';
            if (controlsGuide) controlsGuide.innerHTML = 'Ação: Clique o mais rápido que conseguir no alvo antes que o tempo zere.';
            runClickerEngine();
        } else if (gameType === 'quiz') {
            if (modalTitle) modalTitle.innerText = 'Tech Quiz Challenge';
            if (quizArena) quizArena.style.display = 'block';
            if (controlsGuide) controlsGuide.innerHTML = 'Teoria: Selecione as respostas corretas baseadas nos dados de mercado.';
            runQuizEngine();
        }
    }

    const closeBtn = document.getElementById('close-modal-x');
    const shutdownModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        if (engineInterval) clearInterval(engineInterval);
        if (countdownInterval) clearInterval(countdownInterval);
        currentGameState.isRunning = false;
        document.removeEventListener('keydown', handleSnakeControls);
    };

    if (closeBtn) closeBtn.addEventListener('click', shutdownModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) shutdownModal(); });

    /* ENGINE 1: SNAKE GAME */
    function runSnakeEngine() {
        if (!snakeCanvas) return;
        const ctx = snakeCanvas.getContext('2d');
        
        const currentSize = window.innerWidth <= 768 ? 290 : 360;
        snakeCanvas.width = currentSize;
        snakeCanvas.height = currentSize;

        sBody = [{x: 100, y: 100}, {x: 80, y: 100}, {x: 60, y: 100}];
        sDx = 20; 
        sDy = 0;
        generateFoodPosition(currentSize);

        document.addEventListener('keydown', handleSnakeControls);

        engineInterval = setInterval(() => {
            ctx.fillStyle = '#060814';
            ctx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

            ctx.fillStyle = '#dc2626';
            ctx.fillRect(fPoint.x, fPoint.y, 18, 18);

            // CORREÇÃO CRÍTICA: Mapeia as coordenadas do primeiro elemento (cabeça) da lista
            const sHead = { x: sBody[0].x + sDx, y: sBody[0].y + sDy };

            if (sHead.x < 0) sHead.x = snakeCanvas.width - 20;
            if (sHead.x >= snakeCanvas.width) sHead.x = 0;
            if (sHead.y < 0) sHead.y = snakeCanvas.height - 20;
            if (sHead.y >= snakeCanvas.height) sHead.y = 0;

            sBody.unshift(sHead);

            if (sHead.x === fPoint.x && sHead.y === fPoint.y) {
                currentGameState.score += 10;
                if (displayScore) displayScore.innerText = currentGameState.score;
                generateFoodPosition(snakeCanvas.width);
            } else {
                sBody.pop();
            }

            sBody.forEach(cell => {
                ctx.fillStyle = '#10b981';
                ctx.fillRect(cell.x, cell.y, 18, 18);
            });
        }, 120);
    }

    function handleSnakeControls(e) {
        if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
            e.preventDefault(); // Trava o scroll da página enquanto joga
        }
        if (e.key === 'ArrowLeft' && sDx === 0) { sDx = -20; sDy = 0; }
        if (e.key === 'ArrowUp' && sDy === 0) { sDx = 0; sDy = -20; }
        if (e.key === 'ArrowRight' && sDx === 0) { sDx = 20; sDy = 0; }
        if (e.key === 'ArrowDown' && sDy === 0) { sDx = 0; sDy = 20; }
    }

    function generateFoodPosition(size) {
        const gridMax = (size / 20) - 1;
        fPoint = {
            x: Math.floor(Math.random() * gridMax) * 20,
            y: Math.floor(Math.random() * gridMax) * 20
        };
    }

    /* ENGINE 2: QUANTUM TARGET HUNTER */
    function runClickerEngine() {
        currentGameState.timer = 10;
        if (displayTimer) displayTimer.innerText = currentGameState.timer;
        const target = document.getElementById('quantumTarget');
        if (!target) return;
        
        target.style.top = '50%'; 
        target.style.left = '50%';
        target.disabled = false;

        target.onclick = () => {
            if (!currentGameState.isRunning) return;
            currentGameState.score++;
            if (displayScore) displayScore.innerText = currentGameState.score;
            
            const rx = Math.floor(Math.random() * 80) + 10;
            const ry = Math.floor(Math.random() * 80) + 10;
            target.style.left = `${rx}%`;
            target.style.top = `${ry}%`;
        };

        countdownInterval = setInterval(() => {
            currentGameState.timer--;
            if (displayTimer) displayTimer.innerText = currentGameState.timer;
            if (currentGameState.timer <= 0) {
                clearInterval(countdownInterval);
                currentGameState.isRunning = false;
                target.disabled = true;
                if (modalTitle) modalTitle.innerText = 'Sessão Finalizada!';
            }
        }, 1000);
    }

    /* ENGINE 3: HISTÓRIA / TECH QUIZ ACADÊMICO */
    const quizData = [
        { q: "Qual jogo marcou o início comercial da indústria em 1972?", o: ["Pac-Man", "Pong", "Tetris"], a: 1 },
        { q: "O que preconiza a WCAG no desenvolvimento de interfaces?", o: ["Apenas estética", "Inclusão e Acessibilidade", "Exclusão de scripts"], a: 1 }
    ];
    let qIdx = 0;

    function runQuizEngine() {
        qIdx = 0;
        renderQuizQuestion();
    }

    function renderQuizQuestion() {
        const qText = document.getElementById('quiz-question-text');
        const container = document.getElementById('quiz-options-container');
        
        if (!qText || !container) return;

        if (qIdx >= quizData.length) {
