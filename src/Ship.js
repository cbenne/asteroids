import * as Vector from './Vector';
import Bullet from './Bullet';
export default class Ship {
	/*var vx;
	var vy;
	var x, y;
	var hitrad = 30;
	var gameheight;
	var gamewidth;
	var acceleration = 0.02;*/
	

	/** @constructor
	 * @param gamewidth - width of the game
	 * @param gameheight - height of the game
	 */
	constructor(gamewidth, gameheight) {
		this.gameheight = gameheight;
		this.gamewidth = gamewidth;
		this.x = gamewidth /2;
		this.y = gameheight /2;
		this.dir = {x: 0, y: -1};
		this.acceleration = 0.0005;
		this.radius = 12;
		this.speed = 0;
		this.points = [
			{x: 0, y:-12},
			{x: 10, y: 12},
			{x: 0, y: 6},
			{x: -10, y: 12}
		]
		this.canFire = true;
		this.firetimeout = 500;
		this.lastfired = 0;
		this.audio = document.getElementById('fire');
	}
	
	/** @method render
	 * @param ctx - A canvas context
	 * @param inputr - 1 if cw, -1 if ccw
	 * @param elapsed - the amount of time elapsed
	 */
	render(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.x + this.points[0].x,this.y + this.points[0].y);
		for (var i = 1; i < this.points.length; i++) {
			ctx.lineTo(this.x + this.points[i].x,this.y + this.points[i].y);
		}
		
		ctx.strokeStyle = 'blue';
		ctx.stroke();
		ctx.fillStyle = 'white';
		ctx.fill();
	}
	

	/** @method update
	 * @param inputy - 1 if up, -1 if down
	 * @param inputr - 1 if cw, -1 if ccw
	 * @param elapsed - the amount of time elapsed
	 */
	update(inputy, inputr, elapsed) {
		if (inputy == 0) {
			this.acceleration = 0.0003;
		} else {
			this.acceleration = 0.0005;
		}
		if (this.speed > inputy) {
			this.speed -= elapsed * this.acceleration;
		}
		if (this.speed < inputy) {
			this.speed += elapsed * this.acceleration;
		}
		if (inputr > 0) {
			this.dir = Vector.rotate(this.dir, 0.005 * elapsed);
			for (var i = 0; i < this.points.length; i++) {
				this.points[i] = Vector.rotate(this.points[i], 0.005 * elapsed);
			}
		}
		if (inputr < 0) {
			this.dir = Vector.rotate(this.dir, -0.005 * elapsed);
			for (var i = 0; i < this.points.length; i++) {
				this.points[i] = Vector.rotate(this.points[i], -0.005 * elapsed);
			}
		}
		if (!(this.canFire)) {
			this.lastfired += elapsed;
			if (this.lastfired > this.firetimeout) {
				this.canFire = true;
			}
		}
		this.x += this.dir.x * this.speed * elapsed;
		this.y += this.dir.y * this.speed * elapsed;

		if (this.x > this.gamewidth + this.radius) {
			this.x = -this.radius;
		}
		if (this.y > this.gameheight + this.radius) {
			this.y = -this.radius;
		}
		if (this.x < -this.radius) {
			this.x = this.gamewidth + this.radius;
		}
		if (this.y < -this.radius) {
			this.y = this.gameheight + this.radius;
		}
	}

	fire() {
		if (this.canFire) {
			this.lastfired = 0;
			this.canFire = false;
			if (document.getElementById('fire').paused) {
				document.getElementById('fire').play();
			}
			else {
				document.getElementById('fire').currentTime = 0;
			}
			var new_b = new Bullet(Vector.normalize(this.dir), this.x, this.y,this.gamewidth,this.gameheight);
			return new_b;
		}
		return false;
	}

	collidecheck(that) {
		if (Vector.distance2({x: this.x + this.points[0].x,y: this.y + this.points[0].y},that) < Math.pow(that.radius,2)) {
			return true;
		}
		if (Vector.distance2({x: this.x + this.points[1].x,y: this.y + this.points[1].y},that) < Math.pow(that.radius,2)) {
			return true;
		}
		if (Vector.distance2({x: this.x + this.points[3].x,y: this.y + this.points[3].y},that) < Math.pow(that.radius,2)) {
			return true;
		}
		if (Vector.distance2({x: this.x + (this.points[0].x +this.points[1].x)*0.5,y: this.y + (this.points[0].y * this.points[1].y)*0.5},that) < Math.pow(that.radius,2)) {
			return true;
		}
		if (Vector.distance2({x: this.x + (this.points[0].x +this.points[3].x)*0.5,y: this.y + (this.points[0].y * this.points[3].y)*0.5},that) < Math.pow(that.radius,2)) {
			return true;
		}
		return false;
	}
}