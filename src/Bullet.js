export default class Bullet {

    constructor(dir, x, y,gamewidth,gameheight) {
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.speed = 0.3;
        this.radius = 2;
        this.gameheight = gameheight;
        this.gamewidth = gamewidth;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x - this.radius, this.y -this.radius, this.radius * 2, this.radius * 2);
    }

    update(elapsed) {
        this.x += this.dir.x * this.speed * elapsed;
        this.y += this.dir.y * this.speed * elapsed;

        if (this.x > this.gamewidth + this.radius || this.y > this.gameheight + this.radius || this.x < -this.radius || this.y < -this.radius) {
			return true;
		}
        return false;
    }
}