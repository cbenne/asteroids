import * as Vector from './Vector';

export default class Asteroid {
/* 	var size;
	var step = 25;
	var start = 100;
	var radius;
	var rotation;
	var x, y;
	var points;
	//vector for direction
	var vx;
	var vy;
	var gameheight;
	var gamewidth; */
	
	/** @constructor
    * Creates the game instance
    * @param {integer} size - the size (or mass) of the asteroid.
    * @param {integer} x - the initial x position
	* @param {integer} y - the initial y position
    * @param {integer} gameheight - the height of the game screen in pixels
	* @param {integer} gamewidth - the width of the game screen in pixels
    * @param {integer} dir - the normalized direction of the asteroid
	* @param {integer} speed - the magnitude of velocity of the asteroid
    */
	constructor(size, x, y, gameheight, gamewidth, dir, speed,step,start) {
		this.size = size;
		this.step = step;
		this.start = start;
		this.x = x;
		this.y = y;
		this.radius = size * this.step + this.start;
		this.gameheight = gameheight;
		this.gamewidth = gamewidth;
		this.dir = dir;
		this.speed = speed;
		this.points = [];
		
		for (var i = 0; i < size + 7; i++) {
			var b = {
				x: Math.random() * this.radius/5 + this.radius,
				y: 0
			}
			this.points.push(Vector.rotate(b, Math.PI * 2 * (i/(size + 7))));
		}
	}
	
	
	/** @method render
    * Draws the asteroid onto the screen
    * @param ctx - the canvas context
    */
	render(ctx) {
		
		ctx.beginPath();
		ctx.moveTo(this.x + this.points[0].x,this.y + this.points[0].y);
		for (var i = 1; i < this.points.length; i++) {
			ctx.lineTo(this.x + this.points[i].x,this.y + this.points[i].y);
		}
		ctx.closePath();
		ctx.strokeStyle = 'white';
		ctx.stroke();
		/*
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
		ctx.strokeStyle = 'white';
		ctx.stroke();*/
	}
	
	/** @method update
	 * Updates the positioning of the asteroid
	 * @param elapsed - the elapsed time since last updated
	 */
	update(elapsed) {
		this.x += elapsed * this.speed * this.dir.x;
		this.y += elapsed * this.speed * this.dir.y;
		
		//loop to other side of screen
		if (this.y > this.gameheight + this.radius) {
			this.y = -this.radius;
		}
		if (this.y < -this.radius) {
			this.y = this.gameheight + this.radius;
		}
		if (this.x > this.gamewidth + this.radius) {
			this.x = -this.radius * 2;
		}
		if (this.x < -this.radius * 2) {
			this.x = this.gamewidth + this.radius;
		}
	}
	/** @method collide
	 * Handles inter-asteroid collisions
	 * @param that - the colliding asteroid.
	 */
	collide(that) {
		var s1vect = Vector.scalar_mult(this.dir, this.speed);
		var s2vect = Vector.scalar_mult(that.dir, that.speed);
		var d = Math.sqrt(Math.pow(this.x - that.x, 2) + Math.pow(this.y - that.y, 2)); 
		var nx = (that.x - this.x) / d; 
		var ny = (that.y - this.y) / d; 
		var p = 2 * (s1vect.x * nx + s1vect.y * ny - s2vect.x * nx - s2vect.y * ny) / 
		        (this.size + that.size); 
		var a1 = {
			x: s1vect.x - p * this.size * nx,
			y: s1vect.y - p * this.size * ny
		};
		var a2 = {
			x: s2vect.x + p * that.size * nx, 
			y: s2vect.y + p * that.size * ny
		};
		this.dir = Vector.normalize(a1);
		this.speed = Vector.magnitude(a1);
		that.dir = Vector.normalize(a2);
		that.speed = Vector.magnitude(a2);
		var perp = Vector.normalize({x: this.x - that.x, y: this.y - that.y});
		var diff = this.radius + that.radius - d;
		var sepcount = 0;
		while (Vector.distance2(this,that) < Math.pow(this.radius + that.radius,2)) {
			this.x += diff * perp.x;
			this.y += diff * perp.y;
			sepcount ++;
			that.x -= diff * perp.x;
			that.y -= diff * perp.y
			/*this.x += this.dir.x * 0.5;
			this.y += this.dir.y * 0.5;
			that.x += that.dir.x * 0.5;
			that.y += that.dir.y * 0.5;
			if (sepcount > 300) {
				console.log('High Separation Factor found');
			}*/
		}

	}


	/** @method destroy
	 * Creates new asteroids if needed.
	 */
	destroy() {
		if (document.getElementById('explode').paused) {
			document.getElementById('explode').play();
		}
		else {
			document.getElementById('explode').currentTime = 0;
		}
		var newsize = this.size / 2;
		if (newsize >= 1) {
			var perp = Vector.normalize(Vector.perpendicular(this.dir));
			var x1 = (this.x + this.radius * 0.51 * Vector.rotate(this.dir,Math.PI/2).x)
			var y1 = (this.y + this.radius * 0.51 * Vector.rotate(this.dir,Math.PI/2).y)
			var x2 = (this.x + this.radius * 0.51 * Vector.rotate(this.dir,Math.PI/-2).x)
			var y2 = (this.y + this.radius * 0.51 * Vector.rotate(this.dir,Math.PI/-2).y)
			if (x1 == NaN || x2 == NaN || y1 == NaN || y2 == NaN) {
				alert('Bad number detected.');
			}
			//since m1*v1 = m1/2(v2 + v3) and v2 = v3, v1 = v2 = v3 when dividing size by two.
			var a1 = new Asteroid(newsize,x1,y1,this.gameheight,this.gamewidth,Vector.rotate(this.dir,-0.2),this.speed);
			var a2 = new Asteroid(newsize,x2,y2,this.gameheight,this.gamewidth,Vector.rotate(this.dir,0.2),this.speed);
			return {
				aster1: a1,
				aster2: a2
			}
		}
		return false;
		
	}
	
}
	