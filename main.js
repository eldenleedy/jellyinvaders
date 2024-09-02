document.addEventListener("DOMContentLoaded", function() {
    const player = document.getElementById("player");
    const gameArea = document.getElementById("game");
    let playerPosition = 175;
    let invadersArray = [];
    let score = 0;
    let multiplier = 1;
    let consecutiveKills = 0;

    // Create a score display
    const scoreDisplay = document.createElement("div");
    scoreDisplay.id = "score";
    scoreDisplay.style.position = "absolute";
    scoreDisplay.style.top = "10px";
    scoreDisplay.style.right = "10px";
    scoreDisplay.style.color = "#ffffff";
    scoreDisplay.style.fontSize = "20px";
    scoreDisplay.innerHTML = `Score: ${score}`;
    gameArea.appendChild(scoreDisplay);

    // Move player left or right
    document.addEventListener("keydown", function(event) {
        if (event.key === "a" && playerPosition > 0) {
            playerPosition -= 10;
        } else if (event.key === "d" && playerPosition < 350) {
            playerPosition += 10;
        }
        player.style.left = playerPosition + "px";
    });

    // Shoot bullet
    document.addEventListener("keydown", function(event) {
        if (event.key === "f") {
            shootBullet();
        }
    });

    function shootBullet() {
        let bullet = document.createElement("div");
        bullet.classList.add("bullet");
        bullet.style.left = (playerPosition + 15) + "px";
        bullet.style.bottom = "60px";
        gameArea.appendChild(bullet);

        let bulletInterval = setInterval(function() {
            let bulletBottom = parseInt(bullet.style.bottom);
            bullet.style.bottom = (bulletBottom + 10) + "px";

            // Check for collision with invaders
            invadersArray.forEach((invaderObj, index) => {
                let invader = invaderObj.element;
                let invaderRect = invader.getBoundingClientRect();
                let bulletRect = bullet.getBoundingClientRect();

                if (
                    bulletRect.bottom <= invaderRect.bottom &&
                    bulletRect.top >= invaderRect.top &&
                    bulletRect.left >= (invaderRect.left - 5) &&
                    bulletRect.right <= (invaderRect.right + 5)
                ) {
                    gameArea.removeChild(invader);
                    invadersArray.splice(index, 1);
                    gameArea.removeChild(bullet);
                    clearInterval(bulletInterval);
                    clearInterval(invaderObj.interval); // Clear the invader's movement interval

                    // Update score and multiplier
                    consecutiveKills++;
                    if (consecutiveKills % 2 === 0 && multiplier < 10) {
                        multiplier++;
                    }
                    score += 10 * multiplier;
                    scoreDisplay.innerHTML = `Score: ${score}`;
                }
            });

            // Remove bullet if it goes off screen
            if (bulletBottom > 500) {
                gameArea.removeChild(bullet);
                clearInterval(bulletInterval);
                consecutiveKills = 0; // Reset consecutive kills if the shot misses
                multiplier = 1; // Reset multiplier if a shot is missed
            }
        }, 50);
    }

    // Create invaders
    function createInvader() {
        let invader = document.createElement("div");
        invader.classList.add("invader");
        invader.style.top = "0px";
        invader.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 40)) + "px";
        gameArea.appendChild(invader);

        let invaderInterval = setInterval(function() {
            let invaderTop = parseInt(invader.style.top);
            invader.style.top = (invaderTop + 5) + "px";

            // Check if invader reaches the bottom
            if (invaderTop >= 460) {
                alert("Game Over!");
                clearInterval(invaderInterval);
                location.reload();
            }
        }, 100);

        // Store invader and its interval
        invadersArray.push({ element: invader, interval: invaderInterval });
    }

    // Start creating invaders every 2.5 seconds
    setInterval(createInvader, 2500);
});
