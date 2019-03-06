var player;

function start() {
    player = new component(100, 100, "sprites/FUCK.jpg", 10, 120, "image");
    game.start();
}

var game = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1800; // width and height of the canvas
        this.canvas.height = 900;

        this.context = this.canvas.getContext("2d"); // game is in 2d
        
        document.body.insertBefore(this.canvas, document.body.childNodes[0]); // create the canvas element

        this.interval = setInterval(renderFrame, 7); // render the game at 144fps (draw a new frame every 7 milliseconds)

        window.addEventListener('keydown', function (e) { // keydowb and keyup listeners
            game.keys = (game.keys || []); // add the current pressed keys to an array
            game.keys[e.keyCode] = true;
        });

        window.addEventListener('keyup', function (e) {
            game.keys[e.keyCode] = false; // remove the keys if they are not pressed
        });

    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); // clear the screen
    }
};

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") { // if the object should use a sprite or just a color
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width; // width and height of the object
    this.height = height;

    this.velX = 0; // velocity of the object
    this.velY = 0;

    this.x = x; // x and y coordinates of the object
    this.y = y;
    
    this.gravity = 0.05; // how fast gravity is
    this.gravityVel = 0; // how fast the object going down now

    this.canJump = false; // if the object can jump

    this.bounce = 0.1; // how much the object bounces

    this.update = function () { // draw images to frame
        ctx = game.context;
        if (type == "image") { // use the sprite
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else { // use the color
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function () { // calculate new positions
        this.gravityVel += this.gravity;

        this.x += this.velX;
        this.y += this.velY + this.gravityVel;

        this.footBreak();
    };
    this.footBreak = function () { // if the object is touching the ground
        var rockbottom = game.canvas.height - this.height;
        if (this.y > rockbottom) {

            this.y = rockbottom; // set the y value to "rock bottom" if object the goes below it
            
            this.gravityVel = -(this.gravityVel * this.bounce); // boing

            this.canJump = true; // if the object hits the ground, let it jump
        }
    };
}

function renderFrame() { // render frames n shit
    game.clear();

    // velocity is nice
    player.velX -= (player.velX / 30); 
    player.velY -= (player.velY / 30);

    // keys for movement 
    if (game.keys && game.keys[65]) { player.velX += -0.2; }
    if (game.keys && game.keys[68]) { player.velX += 0.2; }
    if (game.keys && game.keys[32] && player.canJump) { player.velY = -3; player.gravityVel = 0; player.canJump = false; }

    player.newPos();
    player.update();
}

// setInterval(function () { console.log(Math.round(player.velX), Math.round(player.velY), Math.round(player.gravityVel), player.canJump); }, 10); 