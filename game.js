// Game variables
let canvas, ctx;
let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let gameInterval;
let gameSpeed = 150; // milliseconds
let gridSize = 20;
let gameActive = false;

// Game settings
let gameMode = 'classic'; // 'classic' or 'portal'
let colorTheme = 'green';
let boardSize = 400;

// Color themes
const colorThemes = {
    green: {
        primary: '#4caf50',
        secondary: '#2e7d32',
        food: '#ff6b6b'
    },
    blue: {
        primary: '#2196F3',
        secondary: '#1976D2',
        food: '#ff9800'
    },
    purple: {
        primary: '#9c27b0',
        secondary: '#7B1FA2',
        food: '#4caf50'
    },
    orange: {
        primary: '#ff9800',
        secondary: '#F57C00',
        food: '#2196F3'
    },
    red: {
        primary: '#f44336',
        secondary: '#D32F2F',
        food: '#ffeb3b'
    }
};

// DOM Elements
const gameOverlay = document.getElementById('game-over-overlay');
const finalScore = document.getElementById('final-score');
const scoreboard = document.getElementById('scoreboard');
const scoreDisplay = document.getElementById('score-display');
const restartBtn = document.getElementById('restart-btn');
const applySettingsBtn = document.getElementById('apply-settings');
const boardSizeSelect = document.getElementById('board-size');
const colorOptions = document.querySelectorAll('.color-option');
const gameModeRadios = document.querySelectorAll('input[name="game-mode"]');

// Initialize game
function initGame() {
    console.log("Initializing game..."); // Check if initGame starts
    canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("Failed to get 2D context!");
        return;
    }

    // Initialize snake
    const centerPos = Math.floor(boardSize / gridSize / 2) * gridSize;
    snake = [
        { x: centerPos + (2 * gridSize), y: centerPos },
        { x: centerPos + gridSize, y: centerPos },
        { x: centerPos, y: centerPos }
    ];

    // Create initial food
    createFood();

    // Set score to 0
    score = 0;
    updateScore();

    // Set initial direction
    direction = 'right';

    // Start game loop
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
    gameActive = true;

    // Hide game over overlay if visible
    gameOverlay.style.display = 'none';
}

// Main game loop
function gameLoop() {
    // console.log("Game loop running..."); // Uncomment this to check loop frequency (can be noisy)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (optional)
    drawGrid();

    // Move snake
    moveSnake();

    // Check collisions
    if (checkCollision()) {
        gameOver();
        return;
    }

    // Check if food is eaten
    if (snake[0].x === food.x && snake[0].y === food.y) {
        // Don't remove the tail piece to make snake longer
        score += 10;
        updateScore();
        createFood();
    } else {
        // Remove tail piece
        snake.pop();
    }

    // Draw snake
    drawSnake();

    // Draw food
    drawFood();
}

// Draw grid lines
function drawGrid() {
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;

    for (let i = 0; i <= canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

    for (let i = 0; i <= canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

// Move snake based on direction
function moveSnake() {
    // Create new head position based on current direction
    const head = { x: snake[0].x, y: snake[0].y };

    switch (direction) {
        case 'up':
            head.y -= gridSize;
            break;
        case 'down':
            head.y += gridSize;
            break;
        case 'left':
            head.x -= gridSize;
            break;
        case 'right':
            head.x += gridSize;
            break;
    }

    // Handle portal mode (wrap around the edges)
    if (gameMode === 'portal') {
        if (head.x < 0) head.x = canvas.width - gridSize;
        if (head.x >= canvas.width) head.x = 0;
        if (head.y < 0) head.y = canvas.height - gridSize;
        if (head.y >= canvas.height) head.y = 0;
    }

    // Add new head to the beginning of snake array
    snake.unshift(head);
}

// Check for collisions with walls or self
function checkCollision() {
    const head = snake[0];

    // Check wall collision (only in classic mode)
    if (gameMode === 'classic') {
        if (
            head.x < 0 ||
            head.x >= canvas.width ||
            head.y < 0 ||
            head.y >= canvas.height
        ) {
            return true;
        }
    }

    // Check self collision (skip the head)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Create food at random position
function createFood() {
    // Get random position within grid
    const maxX = (canvas.width / gridSize) - 1;
    const maxY = (canvas.height / gridSize) - 1;

    let foodX, foodY;
    let validPosition = false;

    while (!validPosition) {
        foodX = Math.floor(Math.random() * maxX) * gridSize;
        foodY = Math.floor(Math.random() * maxY) * gridSize;

        // Check if food position overlaps with snake
        validPosition = true;
        for (let i = 0; i < snake.length; i++) {
            if (foodX === snake[i].x && foodY === snake[i].y) {
                validPosition = false;
                break;
            }
        }
    }

    food = { x: foodX, y: foodY };
}

// Draw snake on canvas
function drawSnake() {
    // Draw each snake segment
    snake.forEach((segment, index) => {
        // Head is slightly different color
        if (index === 0) {
            ctx.fillStyle = colorThemes[colorTheme].secondary;
        } else {
            ctx.fillStyle = colorThemes[colorTheme].primary;
        }

        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);

        // Add a subtle border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
    });
}

// Draw food on canvas
function drawFood() {
    ctx.fillStyle = colorThemes[colorTheme].food;
    ctx.beginPath();
    ctx.arc(
        food.x + gridSize / 2,
        food.y + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Game over function
function gameOver() {
    clearInterval(gameInterval);
    gameActive = false;

    // Show game over overlay
    gameOverlay.style.display = 'flex';
    finalScore.textContent = score;

    // Save score
    saveScore();

    // Display scoreboard
    displayScoreboard();
}

// Save score to localStorage
function saveScore() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[currentUser]) {
        // Add new score
        users[currentUser].scores.push({
            score: score,
            date: new Date().toISOString()
        });

        // Sort scores
        users[currentUser].scores.sort((a, b) => b.score - a.score);

        // Keep only top 10 scores
        if (users[currentUser].scores.length > 10) {
            users[currentUser].scores = users[currentUser].scores.slice(0, 10);
        }

        // Update high score
        if (score > users[currentUser].highScore) {
            users[currentUser].highScore = score;
        }

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Display scoreboard with top scores
function displayScoreboard() {
    scoreboard.innerHTML = '';

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[currentUser] && users[currentUser].scores.length > 0) {
        // Display top scores
        const scores = users[currentUser].scores;

        // Create header
        const header = document.createElement('div');
        header.className = 'score-item';
        header.innerHTML = '<strong>Rank</strong><strong>Score</strong><strong>Date</strong>';
        scoreboard.appendChild(header);

        // Add score items
        scores.forEach((scoreObj, index) => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';

            // Format date
            const date = new Date(scoreObj.date);
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

            scoreItem.innerHTML = `<span>#${index + 1}</span><span>${scoreObj.score}</span><span>${formattedDate}</span>`;
            scoreboard.appendChild(scoreItem);
        });
    } else {
        scoreboard.innerHTML = '<p>No scores yet</p>';
    }
}

// Apply game settings
function applySettings() {
    // Get selected game mode
    const selectedModeRadio = document.querySelector('input[name="game-mode"]:checked');
    if (selectedModeRadio) {
        gameMode = selectedModeRadio.value;
    }

    // Get selected board size
    const selectedSize = boardSizeSelect.value;
    if (selectedSize) {
        boardSize = parseInt(selectedSize);
        canvas.width = boardSize;
        canvas.height = boardSize;
    }

    // Get selected color theme
    const selectedThemeBtn = document.querySelector('.color-option.active');
    if (selectedThemeBtn) {
        colorTheme = selectedThemeBtn.getAttribute('data-theme');
    }

    // Update CSS variables
    document.documentElement.style.setProperty('--primary-color', colorThemes[colorTheme].primary);
    document.documentElement.style.setProperty('--secondary-color', colorThemes[colorTheme].secondary);

    // Save settings to localStorage
    saveSettings();

    // Restart game with new settings
    initGame();
}

// Color option selection
if (colorOptions) {
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
        });
    });
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;

    // Prevent default behavior for arrow keys
    if (e.key.includes('Arrow')) {
        e.preventDefault();
    }

    // Change direction based on key pressed
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Apply settings button
if (applySettingsBtn) {
    applySettingsBtn.addEventListener('click', applySettings);
}

// Restart button
if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        initGame();
    });
}

// NEW function called by auth.js after authentication is confirmed
function startGame() {
    // Load saved settings if they exist
    loadSettings();
    // Initialize the game
    initGame();
}

// Save settings to localStorage
function saveSettings() {
    const settings = {
        gameMode,
        colorTheme,
        boardSize
    };

    localStorage.setItem('snakeGameSettings', JSON.stringify(settings));
}

// Load settings from localStorage
function loadSettings() {
    console.log("Loading settings..."); // Check if loadSettings starts
    const savedSettings = localStorage.getItem('snakeGameSettings');

    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            console.log("Loaded settings:", settings);

            // Apply saved settings
            if (settings.gameMode) {
                gameMode = settings.gameMode;
                document.querySelector(`input[name="game-mode"][value="${settings.gameMode}"]`).checked = true;
            }

            if (settings.colorTheme) {
                colorTheme = settings.colorTheme;
                colorOptions.forEach(option => {
                    if (option.getAttribute('data-theme') === settings.colorTheme) {
                        colorOptions.forEach(opt => opt.classList.remove('active'));
                        option.classList.add('active');
                    }
                });
            }

            if (settings.boardSize) {
                boardSize = settings.boardSize;
                boardSizeSelect.value = settings.boardSize;
                canvas.width = boardSize;
                canvas.height = boardSize;
            }

            // Update CSS variables
            document.documentElement.style.setProperty('--primary-color', colorThemes[colorTheme].primary);
            document.documentElement.style.setProperty('--secondary-color', colorThemes[colorTheme].secondary);
        } catch (error) {
            console.error("Error parsing saved settings:", error);
            // Optionally clear the invalid settings
            // localStorage.removeItem('snakeGameSettings');
        }
    } else {
        console.log("No saved settings found.");
    }
} 