# Snake Game

A classic Snake game implementation with user authentication, persistent scores, and customizable settings.

## Features

*   **User Authentication:** Sign up and log in to save your scores.
*   **Persistent Scores:** Your high scores and recent scores are saved using browser localStorage.
*   **Classic & Portal Modes:** Choose between the traditional mode where hitting a wall ends the game, or a portal mode where the snake wraps around the screen.
*   **Customizable Appearance:**
    *   Select from multiple color themes.
    *   Adjust the board size (Small, Medium, Large, Extra Large).
*   **Scoreboard:** View your top 10 scores with dates after each game.
*   **Responsive Design:** Basic styling for usability on different screen sizes (though primarily designed for desktop).

## How to Run

1.  Clone or download this repository.
2.  Open the `index.html` file in your web browser.

No build process or server is required; the game runs entirely in the browser using HTML, CSS, and JavaScript.

## How to Play

1.  **Sign Up / Login:** Create an account or log in using the form on the initial page (`index.html`).
2.  **Start Game:** You will be redirected to the game page (`game.html`).
3.  **Controls:** Use the **Arrow Keys** (Up, Down, Left, Right) to control the snake's direction.
4.  **Objective:** Eat the food (colored circles) to grow the snake and increase your score.
5.  **Game Over:**
    *   **Classic Mode:** The game ends if the snake hits the wall or runs into its own body.
    *   **Portal Mode:** The game ends only if the snake runs into its own body.
6.  **Settings:** Before starting or after a game, you can adjust the Game Mode, Board Size, and Color Theme using the controls above the game canvas and clicking "Apply Settings".

## File Structure

*   `index.html`: The login/signup page.
*   `game.html`: The main game page, including the canvas, settings, and game over modal.
*   `styles.css`: Contains all the CSS styling for both pages.
*   `auth.js`: Handles user signup, login, logout, and authentication checks using localStorage.
*   `game.js`: Contains the core game logic, including snake movement, collision detection, food generation, drawing, scoring, settings management, and the game loop.