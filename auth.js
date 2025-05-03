// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const logoutBtn = document.getElementById('logout-btn');

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
        // If we're on the login page, redirect to game
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            window.location.href = 'game.html';
        } else {
            // We're on the game page, display username
            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay) {
                usernameDisplay.textContent = `Player: ${currentUser}`;
                document.getElementById('game-container').style.display = 'block';
                // Call startGame from game.js to initialize
                if (typeof startGame === 'function') {
                    startGame();
                }
            }
        }
    } else {
        // If we're on the game page, redirect to login
        if (window.location.pathname.includes('game.html')) {
            window.location.href = 'index.html';
        }
    }
}

// Tab switching functionality
if (loginTab && signupTab) {
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    });
}

// Handle login
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {};

        // Check if user exists and password matches
        if (users[username] && users[username].password === password) {
            localStorage.setItem('currentUser', username);
            window.location.href = 'game.html';
        } else {
            alert('Invalid username or password');
        }
    });
}

// Handle signup
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {};

        // Check if username already exists
        if (users[username]) {
            alert('Username already exists');
            return;
        }

        // Add new user
        users[username] = {
            password: password,
            highScore: 0,
            scores: []
        };

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', username);

        // Redirect to game
        window.location.href = 'game.html';
    });
}

// Handle logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

// Return to menu button in game over screen
const returnBtn = document.getElementById('return-btn');
if (returnBtn) {
    returnBtn.addEventListener('click', () => {
        document.getElementById('game-over-overlay').style.display = 'none';
        window.location.href = 'index.html';
    });
}

// Check authentication status when page loads
document.addEventListener('DOMContentLoaded', checkAuth); 