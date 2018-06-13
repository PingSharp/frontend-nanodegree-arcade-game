/**
 * constructor for enemis which shall be avoided
 * by player
 */
var Enemy = function () {
    /**
     * Variables applied to each of our instances go here,
     * we've provided one for you to get started
     */
    this.x = -100;
    this.y = (Math.floor(Math.random() * 3) + 1) * 75;
    this.speed = Math.floor(Math.random() * 300) + 190;
    /**
     * The image/sprite for our enemies, this uses
     * a helper we've provided to easily load images
     */
    this.sprite = 'images/enemy-bug.png';
};
/**
 * Update the enemy's position, required method for game
 * Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function (dt) {
    /**
     * You should multiply any movement by the dt parameter
     * which will ensure the game runs at the same speed for
     * all computers.
     */
    this.x += dt * this.speed;
    if (this.x > 505) {
        let index = allEnemies.indexOf(this);
        /**
         * remove enemy which are out of the canvas because not sure
         * if they need ressources
         */
        allEnemies.splice(index, 1);
        /**
         * after delete need new enemy
         */
        let newEnemy = new Enemy();
        setTimeout(allEnemies.push(newEnemy), Math.floor(Math.random() * 2000) + 1);
    } else {
        /**
         * after moving check collision with player
         */
        if (this.x > player.x - 50 && this.x < player.x + 51 && this.y > player.y && this.y < player.y + 76) {
            /**
             * set back to start position
             */
            player.x = 202;
            player.y = 4.5 * 83;
            player.update(0, 0);
            collisionMusic.play();
            if (player.score > 0) {
                player.score -= 10;
            }
        }
    }

};

/**
 * Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/**
 * Add enemy to list
 */
Enemy.prototype.enemyInit = function (enemy) {
    let index = allEnemies.indexOf(enemy);
    allEnemies[index] = new Enemy();
};

/**
 * Now write your own player class
 * This class requires an update(), render() and
 * a handleInput() method.
 */

/**
 * constructor of player
 */
var Player = function () {
    this.speedX = 101;
    this.speedY = 83;
    this.x = 2 * 101;
    this.y = 4.5 * 83;
    this.won = false;
    this.lose = false;
    this.charSelected = false;
    this.sprite = 'images/char-boy.png';
    this.score = 0;
};
/**
 * Compute next position according to directions
 * @param {1,0,-1} factorx Direction of x movement
 * @param {1,0,-1} factory Direction of y movement
 */
Player.prototype.update = function (factorx = 0, factory = 0) {
    this.x += factorx * this.speedX;
    this.y += factory * this.speedY;
};
/**
 * Force browser to update score
 * Update the player and check if win or lose
 */
Player.prototype.render = function () {
    if (player.charSelected === false) {
        player.showPlayerOption();
    }
    let currentScore = document.querySelector("#score");
    currentScore.innerHTML = player.score;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if (player.y <= 15 && player.won === false) {
        player.score += 5;
        setTimeout(function () {
            player.won = true;
        }, 500);
        setTimeout(player.playerWin, 500);
    }
    if (gameTime === 0 && player.lose === false && player.y > 15) {
        player.lose = true;
        player.playerLose();
    }
};
/**
 * Get the canvas and ask player for sprite
 */
Player.prototype.showPlayerOption = function () {
    canvas = document.querySelector("canvas");
    canvas.style.display = "none";
    scoreAndTime = document.querySelector(".player-score");
    scoreAndTime.style.display = "none";
    select = document.querySelector(".custom-select");
    let selectOption = document.querySelectorAll("input");
    select.style.display = "block";
    if (gameTime !== 16) {
        gameTime = 16;
    }
    let showtime = document.querySelector("#time");
    showtime.innerHTML = gameTime + "s";
    selectOption.forEach(s => s.checked = false);
    selectOption.forEach(s => s.addEventListener("click", this.selectPlayer));
};
/**
 * Set sprite according to seleted value
 * Set counter
 * Set blocks and game area
 */
Player.prototype.selectPlayer = function () {
    let value = event.target.value;
    player.sprite = value;
    player.charSelected = true;
    interval = setInterval(countDown, 1000);
    canvas.style.display = "initial";
    scoreAndTime.style.display = "block";
    let selectOption = document.querySelector("form");
    select.style.display = "none";
    selectOption.removeEventListener("change", this.selectPlayer);
};
/**
 * Handle input key and ensure player is not out the game
 * also call update step with correct parameter
 * @param {string} input Last pushed key for direction, can be left, up, right, down
 */
Player.prototype.handleInput = function (input) {
    if (input === "left" && this.x > 0) {
        this.update(-1, 0);
    } else if (input === "up" && this.y > 0) {
        this.update(0, -1);
    } else if (input === "right" && this.x < 404) {
        this.update(1, 0);
    } else if (input === "down" && this.y < 4.5 * 83) {
        this.update(0, 1);
    }

};
/**
 * Delete player and create new one
 * or just create
 */
Player.prototype.playerInit = function () {
    if (player !== null) {
        player = null;
        player = new Player();
        return player;
    } else {
        player = new Player();
        return player;
    }
};
/**
 * Update canvas for situation when player win
 */
Player.prototype.playerWin = function () {
    canvas.style.display = "none";
    clearInterval(interval);
    CongraImg = Resources.get("images/congratulations.jpg");
    document.body.appendChild(CongraImg);
    document.addEventListener("click", player.showPlayAgain);
};
/**
 * Update canvas for situation when player lose
 */
Player.prototype.playerLose = function () {
    canvas.style.display = "none";
    clearInterval(interval);
    scoreAndTime.style.display = "none";
    GameOverImg = Resources.get("images/GameOver.png");
    document.body.appendChild(GameOverImg);
    document.addEventListener("click", player.showPlayAgain);
}
/**
 * Ask human player for next game
 * if yes 
 */
Player.prototype.showPlayAgain = function () {
    if (confirm("Do you want to play again?")) {
        document.removeEventListener("click", player.showPlayAgain);
        allEnemies.forEach(function (enemy) {
            enemy.enemyInit(enemy);
        });
        if (allGems.length === 0) {
            allGems = [new Gem(), new Gem()];
        } else if (allGems.length === 1) {
            let newGem = new Gem();
            allGems.push(newGem);
        } else {
            allGems.forEach(e => e = new Gem());
        }
        player.playerInit();
        if (document.body.childNodes[12] === CongraImg) {
            document.body.removeChild(CongraImg);
        } else {
            document.body.removeChild(GameOverImg);
        }
        canvas.style.display = "initial";
        gameTime = 16;
    } else {}
};
/**
 * constructor of collectable gems
 * use random location for more fun
 */
var Gem = function () {
    this.x = (Math.floor(Math.random() * 5) * 101);
    this.y = (Math.floor(Math.random() * 3) + 1) * 75;
    let gemcollection = ["images/Gem Blue.png", "images/Gem Green.png", "images/Gem Orange.png"];
    this.sprite = gemcollection[Math.floor(Math.random() * 3)];
};
/**
 * Updates the gem
 * if two gems same location let the 1st one be generated again
 * Check if it is touched by player
 */
Gem.prototype.update = function () {
    if (allGems.length > 1) {
        if (allGems[0].x === allGems[1].x && allGems[0].y === allGems[1].y) {
            allGems[0] = new Gem();
        }
    }
    if (this.x > player.x - 50 && this.x < player.x + 51 && this.y > player.y && this.y < player.y + 76) {
        player.score += 20;
        collectedGemMusic.play();
        let index = allGems.indexOf(this);
        allGems.splice(index, 1);
    }
};
/**
 * Render gem
 */
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
/**
 * Callback for count down and update HTML according to gameTime
 * Interval is set in SelectPlayer
 */
function countDown() {
    gameTime -= 1;
    let showtime = document.querySelector("#time");
    showtime.innerHTML = gameTime + "s";
    return gameTime;
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [new Enemy(), new Enemy(), new Enemy()];
let player = new Player();
let allGems = [new Gem(), new Gem()];
let gameTime = 16;
let canvas;
let select;
let scoreAndTime;
let CongraImg;
let GameOverImg;
let interval;
const gameStartMusic = new Howl({
    src: ['../music/Arcade-Madness.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.1
});
const collectedGemMusic = new Howl({
    src: ['../music/SynthChime2.mp3']
})
const collisionMusic = new Howl({
    src: ['../music/PowerDown7.mp3']
})



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
