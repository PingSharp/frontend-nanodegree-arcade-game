/**
 * constructor for enemis which shall be avoided
 * by player
 */
var Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = -100;
    this.y = (Math.floor(Math.random() * 3) + 1) * 75;
    this.speed = Math.floor(Math.random() * 300) + 190;
    this.sprite = 'images/enemy-bug.png';
};
/**
 * Update the enemy's position, required method for game
 * Parameter: dt, a time delta between ticks
 */
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    if (this.x > 505) {
        let index = allEnemies.indexOf(this);
        // remove enemy which are out of the canvas because not sure
        // if they need ressources
        allEnemies.splice(index, 1);

        let newEnemy = new Enemy();
        setTimeout(allEnemies.push(newEnemy), Math.floor(Math.random() * 2000) + 1);
    }
    else {
        // check if allEnemies can be reduced to this --> so simple change e.x to this.x
        if (this.x > player.x - 50 && this.x < player.x + 51 && this.y > player.y && this.y < player.y + 76) {
                player.x = 202;
                player.y = 4.5 * 83;
                player.update(0, 0);
                if (player.score > 0) {
                    player.score -= 10;
                }
            }
        }

    };

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Enemy.prototype.enemyInit = function (enemy) {
    let index = allEnemies.indexOf(enemy);
    allEnemies[index] = new Enemy();
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
    this.speedX = 101;
    this.speedY = 83;
    this.x = 2 * 101;
    this.y = 4.5 * 83;
    this.won = false;
    this.lose = false;
    this.charselected = false; // charSelected
    this.sprite = 'images/char-boy.png';
    this.score = 0;
};
Player.prototype.update = function (factorx=0, factory=0) {
   this. x += factorx * this.speedX;
   this. y += factory * this.speedY;
};
Player.prototype.render = function () {
    if (player.charselected === false) {
        player.showPlayerOption();
    }
    let currentScore = document.querySelector("#score");
    currentScore.innerHTML = player.score;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if (player.y <= 15 && player.won === false) {
        player.score += 5;
        setTimeout(function () { player.won = true; }, 500);
        setTimeout(player.playerWin, 500);
    }
    if (gameTime === 0 && player.lose === false && player.y > 15) {
        player.lose = true;
        player.playerLose();
    }
};
Player.prototype.showPlayerOption = function () {
    var canvas = document.querySelector("canvas");
    canvas.style.display = "none";
    var score = document.querySelector(".player-score");
    score.style.display = "none";
    var select = document.querySelector(".custom-select");
    var selectOption = document.querySelectorAll("input");
    select.style.display = "block";
    if (gameTime !== 16) {
        gameTime = 16;
    }
    let showtime = document.querySelector("#time");
        showtime.innerHTML = gameTime + "s";
    selectOption.forEach(s => s.checked = false);
    selectOption.forEach(s => s.addEventListener("click", this.selectPlayer));

};
Player.prototype.selectPlayer = function () {
    let value = event.target.value;
    player.sprite = value;
    player.charselected = true;
    interval = setInterval(countDown, 1000);
    var canvas = document.querySelector("canvas");
    canvas.style.display = "initial";
    var score = document.querySelector(".player-score");
    score.style.display = "block";
    var select = document.querySelector(".custom-select");
    var selectOption = document.querySelector("form");
    select.style.display = "none";
    selectOption.removeEventListener("change", this.selectPlayer);
};
// put the 83 and values to properties "speed" and
// call update with ("-","0") or ("0","+")
// compution of new values happen in update!
Player.prototype.handleInput = function (input) {
    if (input === "left" && this.x > 0) {
        this.update(-1, 0);
    }
    else if (input === "up" && this.y > 0) {
        this.update(0, -1);
    }
    else if (input === "right" && this.x < 404) {
        this.update(1, 0);
    }
    else if (input === "down" && this.y < 4.5 * 83) {
        this.update(0, 1);
    }

};
Player.prototype.playerInit = function () {
    if (player !== null) {
        player = null;
        player = new Player();
        return player;
    }
    else {
        player = new Player();
        return player;
    }
};
Player.prototype.playerWin = function () {
    var canvas = document.querySelector("canvas");
    canvas.style.display = "none";
    clearInterval(interval);
    var img = Resources.get("images/congratulations.jpg");
    document.body.appendChild(img);
    document.addEventListener("click", player.showPlayAgain);
};
Player.prototype.playerLose = function () {
    var canvas = document.querySelector("canvas");
    canvas.style.display = "none";
    clearInterval(interval);
    let time = document.querySelector(".player-score");
    time.style.display = "none";
    var img = Resources.get("images/GameOver.png");
    document.body.appendChild(img);
    document.addEventListener("click", player.showPlayAgain);
}
Player.prototype.showPlayAgain = function () {
    if (confirm("Do you want to play again?")) {
        document.removeEventListener("click", player.showPlayAgain);
        allEnemies.forEach(function (enemy) {
            enemy.enemyInit(enemy);
        });
        if (allGems.length === 0) {
            allGems = [new Gem(), new Gem()];
        }
        else if (allGems.length === 1) {
            let newGem = new Gem();
            allGems.push(newGem);
        }
        else {
            allGems.forEach(e => e = new Gem());
        }
        player.playerInit();
        var img = Resources.get("images/congratulations.jpg");
        var gameOverImg = Resources.get("images/GameOver.png");
        if (document.body.childNodes[12] === img) {
            document.body.removeChild(img);
        }
        else {
            document.body.removeChild(gameOverImg);
        }
        var canvas = document.querySelector("canvas");
        canvas.style.display = "initial";
        gameTime = 16;
    }
    else {
    }
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
// same to gem - this is not oop
Gem.prototype.update = function () {
    if (allGems.length > 1) {
        if (allGems[0].x === allGems[1].x && allGems[0].y === allGems[1].y) {
            allGems[0] = new Gem();
        }
    }

   
    if (this.x > player.x - 50 && this.x < player.x + 51 && this.y > player.y && this.y < player.y + 76) {
            player.score += 20;
            let index = allGems.indexOf(this);
            allGems.splice(index, 1);
}
    };
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

function countDown() {
    gameTime -= 1;
    let showtime = document.querySelector("#time");
    showtime.innerHTML = gameTime + "s";
    return gameTime;
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy(), new Enemy(), new Enemy()];
var player = new Player();
var allGems = [new Gem(), new Gem()];
let gameTime = 16;
let interval;

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
