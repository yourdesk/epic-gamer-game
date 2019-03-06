var player;

function start() {
    player = new component(100, 100, "sprites/FUCK.jpg", 10, 120, "image");
    game.start();
}

var game = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1800;
        this.canvas.height = 900;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(renderFrame, 7);
        window.addEventListener('keydown', function (e) {
            game.keys = (game.keys || []);
            game.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
            game.keys[e.keyCode] = false;
        });

    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.velX = 0;
    this.velY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.05;
    this.gravityVel = 0;
    this.canJump = false;
    this.bounce = 0.1;
    this.update = function () {
        ctx = game.context;
        if (type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function () {
        this.gravityVel += this.gravity;
        this.x += this.velX;
        this.y += this.velY + this.gravityVel;
        this.footBreak();
    };
    this.footBreak = function () {
        var rockbottom = game.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravityVel = -(this.gravityVel * this.bounce);
            this.canJump = true;
        }

    };
}

function renderFrame() {
    game.clear();

    player.velX -= (player.velX / 30);
    player.velY -= (player.velY / 30);

    if (game.keys && game.keys[65]) { player.velX += -0.2; }
    if (game.keys && game.keys[68]) { player.velX += 0.2; }
    if (game.keys && game.keys[32] && player.canJump) { player.velY = -3; player.gravityVel = 0; player.canJump = false; }

    player.newPos();
    player.update();
}

// setInterval(function () { console.log(Math.round(player.velX), Math.round(player.velY), Math.round(player.gravityVel), player.canJump); }, 10);