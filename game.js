
document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.querySelector('.game-container');
    const player = document.getElementById('player');
    const obstacle = document.getElementById('obstacle');
    const collectible = document.getElementById('collectible');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const startButton = document.getElementById('start-button');
    const gameOverDisplay = document.getElementById('game-over');
    let playerX = gameContainer.clientWidth / 2 - 64; // Center player
    const playerY = gameContainer.clientHeight - 180;
    const playerSpeed = 10;
    let obstacleY = -120;
    let collectibleY = -120;
    let objectSpeed = 8;
    let score = 0;
    let highScore = 0;
    let isDragging = false;
    let dragOffsetX = 0;
    let gameInterval;
    let speedInterval;
    let isGameActive = false;

    function movePlayer(event) {
        if (!isGameActive) return;
        switch (event.key) {
            case 'ArrowLeft':
                playerX -= playerSpeed;
                if (playerX < 0) playerX = 0;
                break;
            case 'ArrowRight':
                playerX += playerSpeed;
                if (playerX > gameContainer.clientWidth - player.clientWidth) {
                    playerX = gameContainer.clientWidth - player.clientWidth;
                }
                break;
        }
        player.style.left = `${playerX}px`;
    }

    function startDrag(event) {
        if (!isGameActive) return;
        isDragging = true;
        dragOffsetX = (event.touches ? event.touches[0].clientX : event.clientX) - player.getBoundingClientRect().left;
        player.style.cursor = 'grabbing';
    }

    function dragPlayer(event) {
        if (!isGameActive || !isDragging) return;
        playerX = (event.touches ? event.touches[0].clientX : event.clientX) - dragOffsetX - gameContainer.getBoundingClientRect().left;
        if (playerX < 0) playerX = 0;
        if (playerX > gameContainer.clientWidth - player.clientWidth) {
            playerX = gameContainer.clientWidth - player.clientWidth;
        }
        player.style.left = `${playerX}px`;
    }

    function stopDrag() {
        isDragging = false;
        player.style.cursor = 'grab';
    }

    function moveObstacle() {
        if (!isGameActive) return;
        obstacleY += objectSpeed;
        if (obstacleY > gameContainer.clientHeight) {
            obstacleY = -120;
            obstacle.style.left = `${getRandomXPosition(obstacle.clientWidth)}px`;
        }
        obstacle.style.top = `${obstacleY}px`;

        if (isCollision(player, obstacle)) {
            score -= 20;
            if (score < 0) score = 0;
            updateScore();
            if (score === 0) {
                endGame();
            }
        }

        requestAnimationFrame(moveObstacle);
    }

    function moveCollectible() {
        if (!isGameActive) return;
        collectibleY += objectSpeed;
        if (collectibleY > gameContainer.clientHeight) {
            collectibleY = -120;
            collectible.style.left = `${getRandomXPosition(collectible.clientWidth)}px`;
        }
        collectible.style.top = `${collectibleY}px`;

        if (isCollision(player, collectible)) {
            score += 10;
            updateScore();
            collectibleY = -120;
        }

        requestAnimationFrame(moveCollectible);
    }

    function isCollision(player, object) {
        const playerRect = player.getBoundingClientRect();
        const objectRect = object.getBoundingClientRect();
        return !(
            playerRect.top > objectRect.bottom ||
            playerRect.bottom < objectRect.top ||
            playerRect.right < objectRect.left ||
            playerRect.left > objectRect.right
        );
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
    }

    function resetGame() {
        score = 0;
        updateScore();
        obstacleY = -120;
        collectibleY = -120;
        objectSpeed = 5;
        obstacle.style.left = `${getRandomXPosition(obstacle.clientWidth)}px`;
        collectible.style.left = `${getRandomXPosition(collectible.clientWidth)}px`;
    }

    function increaseSpeed() {
        if (!isGameActive) return;
        objectSpeed *= 1.1;
    }

    function startGame() {
        startButton.style.display = 'none';
        gameOverDisplay.style.display = 'none';
        resetGame();
        isGameActive = true;
        document.addEventListener('keydown', movePlayer);
        player.addEventListener('mousedown', startDrag);
        player.addEventListener('touchstart', startDrag);
        document.addEventListener('mousemove', dragPlayer);
        document.addEventListener('touchmove', dragPlayer);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
        requestAnimationFrame(moveObstacle);
        requestAnimationFrame(moveCollectible);
        speedInterval = setInterval(increaseSpeed, 12000); // Increase speed every 12 seconds
    }

    function endGame() {
        isGameActive = false;
        document.removeEventListener('keydown', movePlayer);
        player.removeEventListener('mousedown', startDrag);
        player.removeEventListener('touchstart', startDrag);
        document.removeEventListener('mousemove', dragPlayer);
        document.removeEventListener('touchmove', dragPlayer);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
        clearInterval(speedInterval);
        gameOverDisplay.style.display = 'block';
        startButton.style.display = 'block';
    }

    function getRandomXPosition(objectWidth) {
        const minX = 0;
        const maxX = gameContainer.clientWidth - objectWidth;
        return Math.random() * (maxX - minX) + minX;
    }

    startButton.addEventListener('click', startGame);
});