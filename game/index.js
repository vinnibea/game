
let width = window.innerWidth > 640 ? 640 : window.innerWidth;
let height = width / 2;
let p1 = 0;
let p2 = 0;
let keys = {};
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
canvas.width = width - 5;
canvas.height = height - 10;
canvas.style.border = "4px solid green";
canvas.style.borderRadius = "8px";
let pos = width / 2 - 50 / 2;
ctx.fillStyle = "rgba(10, 120, 100, 0.7)";
canvas.style.backgroundColor = 'black';
let ballDirection = Math.floor(Math.random() * (1 - (-1) + 1) - 1) || -1;

class Particle {
    constructor(
        ctx, x = (canvas.width - 10) / 2,
        y = (canvas.height - 10) / 2,
        size = height / 25,
        direction = ballDirection
    ) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.context = ctx;
        this.direction = direction;
        this.velocityX = 5 * this.direction;
        this.velocityY = (Math.random() * (0.5 + (-0.5)) + 0.5);
        this.count = 1;
        this.max = size * 1;
        this.color = 'green';

    }
    setDirection(n) {
        this.direction = n;
    }

    draw() {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(this.x - 4, this.y - 2, this.size + 2, this.size + 2);

    }

    update(dir) {
        if (this.y - this.size / 2 < 0) {
            this.velocityY = Math.abs(this.velocityY);
            this.velocityX = this.velocityX - 0.0001;
        }

        if (this.y + this.size + 4 >= canvas.height) {
            this.velocityY = -this.velocityY;
        }

        if (dir === -1) {
            this.velocityX = this.velocityX * dir;
            this.velocityY += Math.random() * (2.5 + (-2.5) + (-2.5))
            this.x += 4 + Math.abs(this.velocityX) * 3;
            this.y += this.velocityY;
            return;
        }
        if (dir === 1) {
            this.velocityX = -Math.abs(this.velocityX);

            this.x += -4 + this.velocityX * 3;
            this.velocityY += Math.random() * (2.5 + (-2.5) + (-2.5))
            this.y += this.velocityY;
            return;
        }
        if (!dir) {
            this.x += this.velocityX;
            this.y += this.velocityY;
        }
    }
}

class Pad {
    constructor(
        x,
        y,
        height,
        width,
        ctx
    ) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.context = ctx;
        this.score = 0;
    }

    draw() {
        this.context.strokeStyle = "rgba(255, 0, 0, 0.5)";
        ctx.fillStyle = "white";
        this.context.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "rgba(140, 100, 200, 0.3)";
        this.context.fillRect(this.x + 4, this.y, this.width - 4, this.height);
        this.context.stroke();
        ctx.fillStyle = "lightgreen";
    }

    moveUp() {
        if (this.y - 20 < 0) return;
        this.y -= 25;
    }

    moveDown() {
        if (this.y + this.height + 20 > canvas.height) return;
        this.y += 25;
    }

    onScore() {
        this.score++;
    }
}

class Field {
    constructor(ctx) {
        this.particles = [];
        this.player1 = new Pad((10), (canvas.height / 2) - height / 4 / 2, height / 4, 8, ctx);
        this.player2 = new Pad((canvas.width - 20), (canvas.height / 2) - height / 4 / 2, height / 4, 8, ctx)
        this.context = ctx;
        this.pads = [];
        this.gameOver = false;
    }

    collectParticles(direction) {
        this.particles.push(new Particle(this.context, (canvas.width - 10) / 2, (canvas.height - 10) / 2, height / 25, direction));
    }

    moveStart(e) {
        keys[e.keyCode] = true;
        if (keys[40] && keys[83]) {
            this.player1.moveDown();
            this.player2.moveDown();
            return;
        }
        if (keys[87] && keys[38]) {
            this.player1.moveUp();
            this.player2.moveUp();
            return;
        }
        if (keys[87]) return this.player1.moveUp();
        if (keys[83]) return this.player1.moveDown();
        if (keys[38]) return this.player2.moveUp();
        if (keys[40]) return this.player2.moveDown()
    }

    moveFinish(e) {
        keys = {};
    }

    draw() {
        this.particles.concat().forEach(particle => {
            particle.draw()
        });

        [this.player1, this.player2].forEach(p => {
            p.draw();
        })
    }

    update() {
        ctx.font = `${canvas.height / 12}px serif`;
        ctx.texAlign = "center";
        ctx.fillStyle = "grey";
        ctx.fillText(`Player 1: ${p1}`, 40, canvas.height / 10);
        ctx.fillText(`Player 2: ${p2}`, canvas.width - 130, canvas.height / 10);
        
        for (let i = 36; i < canvas.width - 34; i += 40) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
            ctx.fillRect(i, 0, 1, canvas.height);
            ctx.fillRect(0, i, canvas.width, 1);
        }
        
        this.particles.forEach(particle => {
            if (
                this.player1.x >= particle.x - particle.size / 2
                && particle.y - particle.size / 2 <= this.player1.y + this.player1.height
                && particle.y + particle.size / 2 >= this.player1.y
            ) {
                particle.update(-1);
                return;
            } else {
                if (
                    this.player2.x <= particle.x + particle.size
                    && particle.y - particle.size / 2 <= this.player2.y + this.player2.height
                    && particle.y + particle.size / 2 >= this.player2.y
                ) {
                    particle.update(1);
                    return;
                } if (
                    particle.x < 0 || particle.x + particle.size >= canvas.width
                ) {
                    if (particle.x < 0) {
                        p2++;
                        ballDirection = -1;

                    } else {
                        p1++;
                        ballDirection = 1;
                    }

                    this.gameOver = true;
                    return;
                }
            }

            particle.update(0);
        });

    }
}

let field = new Field(ctx);
field.collectParticles();
document.addEventListener('keydown', (e) => field.moveStart(e))
document.addEventListener('keyup', (e) => field.moveFinish(e));

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    field.draw();
    field.update();
    if (field.gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        field = new Field(ctx);
        field.gameOver = false;
        field.collectParticles(ballDirection);
        field.draw();
    }

    requestAnimationFrame(animate);
}

animate();




