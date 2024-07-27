let score = JSON.parse(localStorage.getItem('score')) || { wins: 0, losses: 0, ties: 0 };
let gameStarted = JSON.parse(localStorage.getItem('gameStarted')) || false;

window.onload = function() {
    if (gameStarted) {
        restoreGameState();
    } else {
        document.querySelector('.start-button').style.display = 'inline-block';
        document.getElementById('gameArea').style.display = 'none';
    }
    updateScore();
};

function startGame() {
    gameStarted = true;
    localStorage.setItem('gameStarted', JSON.stringify(gameStarted));
    document.querySelector('.start-button').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    const buttons = document.querySelectorAll('.move-button');
    buttons.forEach(button => {
        button.style.display = 'inline-block';
    });
}

function play(playerMove) {
    const computermove = pickMove();
    let result = '';

    if (playerMove === computermove) {
        result = 'Tie';
        score.ties += 1;
    } else if (
        (playerMove === 'Rock' && computermove === 'Scissors') ||
        (playerMove === 'Paper' && computermove === 'Rock') ||
        (playerMove === 'Scissors' && computermove === 'Paper')
    ) {
        result = 'You won!';
        score.wins += 1;
    } else {
        result = 'You lose';
        score.losses += 1;
    }

    localStorage.setItem('score', JSON.stringify(score));
    updateScore();
    showModal(result, playerMove, computermove);

    if (score.wins === 3 || score.losses === 3) {
        let finalResult = score.wins === 3 ? 'You won the game!' : 'You lost the game!';
        setTimeout(() => {
            document.getElementById('fullscreenResult').style.display = "block";
            document.getElementById('finalResultText').innerHTML = finalResult;
            setTimeout(() => {
                document.querySelector('.play-again-button').style.display = 'inline-block';
                document.querySelector('.quit-button').style.display = 'inline-block';
            }, 1000); // Show the "Play Again" and "Quit" buttons after 1 second
        }, 500);
    }
}

function playAgain() {
    document.getElementById('fullscreenResult').style.display = "none"; // Hide the fullscreen result
    resetScore(); // Reset the game and score

    // Hide the start button and show the game area with move buttons
    document.querySelector('.start-button').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    const buttons = document.querySelectorAll('.move-button');
    buttons.forEach(button => {
        button.style.display = 'inline-block';
    });

    // Clear the modal content and ensure it's hidden
    document.getElementById('modal-result').innerHTML = ''; // Clear previous result
    document.getElementById('modal-moves').innerHTML = ''; // Clear previous moves

    // Hide the result modal if it's visible
    document.getElementById('resultModal').style.display = 'none';
}

function quitGame() {
    document.getElementById('fullscreenResult').style.display = "none"; // Hide the fullscreen result
    document.getElementById('modal-result').innerHTML = ''; // Clear previous result
    document.getElementById('modal-moves').innerHTML = ''; // Clear previous moves

    // Hide the result modal if it's visible
    document.getElementById('resultModal').style.display = 'none';

    // Reset the game state and UI
    resetScore(); // Reset the score and game state
    document.querySelector('.start-button').style.display = 'inline-block'; // Show the start button
    document.getElementById('gameArea').style.display = 'none'; // Hide the game area

    // Ensure that all move buttons are hidden
    const buttons = document.querySelectorAll('.move-button');
    buttons.forEach(button => {
        button.style.display = 'none';
    });

    // Hide any other elements related to the result display
    document.querySelectorAll('.move-text').forEach(text => {
        text.style.display = 'none';
    });

    gameStarted = false;
    localStorage.setItem('gameStarted', JSON.stringify(gameStarted));
}

function updateScore() {
    document.querySelector('.showscore').innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

function pickMove() {
    const rand = Math.random();
    if (rand < 1 / 3) {
        return 'Rock';
    } else if (rand < 2 / 3) {
        return 'Paper';
    } else {
        return 'Scissors';
    }
}

function resetScore() {
    score = { wins: 0, losses: 0, ties: 0 };
    localStorage.removeItem('score');
    updateScore();
}

function showModal(result, playerMove, computermove) {
    document.getElementById('modal-result').innerHTML = result;
    document.getElementById('modal-moves').innerHTML = `
        You <img src="images/${playerMove}.png" class="move-icon">
        <img src="images/${computermove}.png" class="move-icon"> Computer
    `;
    document.getElementById('resultModal').style.display = "block";
}

function closeModal() {
    document.getElementById('resultModal').style.display = "none";
}

function restoreGameState() {
    document.querySelector('.start-button').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    const buttons = document.querySelectorAll('.move-button');
    buttons.forEach(button => {
        button.style.display = 'inline-block';
    });
}

window.onclick = function(event) {
    if (event.target === document.getElementById('resultModal')) {
        closeModal();
    }
}

updateScore();
