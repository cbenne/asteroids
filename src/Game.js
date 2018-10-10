import Asteroid from './Asteroid';
import Ship from './Ship';
import Bullet from './Bullet';
import * as Vector from './Vector';

/** @class Game
  * A class representing the high-level functionality
  * of a game - the game loop, buffer swapping, etc.
  */
 export default class Game {
    handleKeydown(event) {
        switch(event.key) {
          case ' ':
            this.currentInput.space = true;
            break;
          case 'ArrowLeft':
          case 'a':
            this.currentInput.left = true;
            break;
          case 'ArrowRight':
          case 'd':
            this.currentInput.right = true;
            break;
          case 'ArrowUp':
          case 'w':
            this.currentInput.up = true;
            break;
          case 'ArrowDown':
          case 's':
            this.currentInput.down = true;
            break;
        }
      }
      handleKeyup(event) {
        switch(event.key) {
          case ' ':
            this.currentInput.space = false;
            break;
          case 'ArrowLeft':
          case 'a':
            this.currentInput.left = false;
            break;
          case 'ArrowRight':
          case 'd':
            this.currentInput.right = false;
            break;
          case 'ArrowUp':
          case 'w':
            this.currentInput.up = false;
            break;
          case 'ArrowDown':
          case 's':
            this.currentInput.down = false;
            break;
        }
      }
    /** @constructor
      * Creates the game instance
      * @param {integer} width - the width of the game screen in pixels
      * @param {integer} heght - the height of the game screen in pixels
      */
    constructor(width, height) {
      this._start = null;
      this.WIDTH = width;
      this.HEIGHT = height;
      // Set up the back buffer
      this.backBuffer = document.createElement('canvas');
      this.backBuffer.width = this.WIDTH;
      this.backBuffer.height = this.HEIGHT;
      this.backBufferCtx = this.backBuffer.getContext('2d');
  
      // Set up the screen buffer
      this.screenBuffer = document.createElement('canvas');
      this.screenBuffer.width = this.WIDTH;
      this.screenBuffer.height = this.HEIGHT;
      this.screenBufferCtx = this.screenBuffer.getContext('2d');
      document.body.append(this.screenBuffer);

      //Set up the environment
      this.player = new Ship(this.WIDTH, this.HEIGHT);
      this.playerlives = 3;
      this.respawning = false;
      this.respawntime = 0;
      this.asteroids = [];
      this.bullets = [];
      this.difficulty = 1;
      this.score = 0;
      this.over = false;
      //quick function to format the score
      Number.prototype.pad = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
      }
      for (var i = 0; i < 7; i++) {
        this.asteroids.push(this.spawnAsteroid());
      }
      /* for (var i = 0; i < 4; i++) {
          // Spawn asteroids to the right of the player;
          
          
      } */
      this.currentInput = {
        space: false,
        left: false,
        right: false,
        up: false,
        down: false,
      }
      window.addEventListener('keydown', evt => this.handleKeydown(evt));
      window.addEventListener('keyup', evt => this.handleKeyup(evt));
    }

    spawnAsteroid() {
        //start asteroids towards edge of map. if some are overlapping, they'll work themselves out.
        var xrand = Math.random();
        var yrand = Math.random();
        var pos = Math.random();
        var xnew, ynew;
        if (pos > 0.75) {
            xnew = xrand * this.WIDTH * 0.3;
            ynew = yrand * this.HEIGHT;
        }
        else if (pos < 0.25) {
            xnew = this.WIDTH - xrand * this.WIDTH * 0.3;
            ynew = yrand * this.HEIGHT;
        }
        else if (pos < 0.5) {
            ynew = yrand * this.HEIGHT * 0.3;
            xnew = xrand * this.WIDTH;
        }
        else {
            ynew = this.HEIGHT - yrand * this.HEIGHT * 0.3;
            xnew = xrand * this.WIDTH;
        }
        var size = Math.min(Math.ceil((this.difficulty + 1) * Math.random()),6);
        var dir = Vector.normalize({x: Math.random(), y: Math.random()});
        var speed = this.difficulty * 0.01 + Math.random() * 0.05;
        var ast = new Asteroid(size,xnew,ynew,this.HEIGHT,this.WIDTH,dir,speed,10,10);
        return ast;
    }

    tutorial(ctx) {
        ctx.fillStyle = "white";
        ctx.font = "16px 'Courier New'";
        ctx.fillText(String.fromCharCode(8593) + " to increase speed",this.WIDTH - 200, this.HEIGHT -100);
        ctx.fillText(String.fromCharCode(8595) + " to decrease speed", this.WIDTH - 200, this.HEIGHT - 80);
        ctx.fillText(String.fromCharCode(8592) + " to turn left", this.WIDTH - 200,this.HEIGHT - 60);
        ctx.fillText(String.fromCharCode(8594) + " to turn right", this.WIDTH - 200,this.HEIGHT - 40);
        ctx.fillText('Space to shoot',this.WIDTH - 200,this.HEIGHT - 20);
    }

      y_dir() {
          if (this.currentInput.up && this.currentInput.down) {
              return 0;
          }
          if (this.currentInput.up) {
              return 0.2;
          }
          if (this.currentInput.down) {
              return -0.2;
          }
          return 0;
      }

      r_dir() {
          if (this.currentInput.left && this.currentInput.down) {
              return 0;
          }
          if (this.currentInput.left) {
              return -1;
          }
          if (this.currentInput.right) {
              return 1;
          }
          return 0;
      }

      gameover(ctx) {
        ctx.font = "40px Arial";
        ctx.fillStyle = "lightcyan";
        ctx.fillText("Game Over.",this.WIDTH/2 - 100,this.HEIGHT/2 -20);
      }
      playerdie() {
        this.playerlives--;
        if (this.playerlives < 0) {
            this.over = true;
        }
        this.player = new Ship(this.WIDTH, this.HEIGHT);
        var tooclose = false;
        for (var i = 0; i < this.asteroids.length; i++) {
            if (Vector.distance2(this.asteroids[i], this.player) < Math.pow(this.asteroids[i].radius + this.player.radius * 2,2)) {
                //just pop the asteroid away, instead of finding a better place for the ship.
                this.asteroids[i].x = 0;
                this.asteroids[i].y = 0;
            }
        } 
        this.render();
        this.respawning = true;
        this.respawntime = 0;
      }

      countdown(ctx) {
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.fillRect(this.WIDTH/2 - 30, this.HEIGHT/2 - 65,60,70);
        ctx.strokeRect(this.WIDTH/2 - 30, this.HEIGHT/2 - 65,60,70);
        ctx.font = "bold 80px Arial";
        ctx.fillStyle = "lightcyan";
        ctx.fillText((3 - Math.floor(this.respawntime/1000)).toString(),this.WIDTH/2 - 20, this.HEIGHT/2);
      }

      drawOverlay(ctx) {
        ctx.fillStyle = "yellow";
        ctx.font = "20px 'Courier New'";
        ctx.fillText(this.score.pad(3),4,20);
        for (var i = 0; i < this.playerlives; i++) {
            var offset = 10 + 12*i;
            ctx.beginPath();
            ctx.moveTo(offset, 25);
            ctx.lineTo(offset + 5,37);
            ctx.lineTo(offset, 34);
            ctx.lineTo(offset - 5,37);
            ctx.closePath();
            ctx.fill();
    
        }
        ctx.font = "30px 'Courier New'";
        ctx.fillText(this.difficulty.pad(2),4,60);
        //ctx.fillText("LIVES: ",5,20);
        //ctx.fillText("SCORE: ",this.WIDTH/2 - 80, 20);
        //ctx.fillText("LEVEL: ",this.WIDTH - 120,20);
      }

      checkcollisions() {
          for (var i = 0; i < this.asteroids.length; i++) {
              var j;
              for (j = i+1; j < this.asteroids.length; j++) {
                  if (Vector.distance2(this.asteroids[i],this.asteroids[j]) < Math.pow(this.asteroids[i].radius + this.asteroids[j].radius,2)) {
                      this.asteroids[i].collide(this.asteroids[j]);
                  }

                  //Check collisions across boundaries by transposing the asteroid then bringing it back.
                  if (this.asteroids[i].x < 0) {
                    this.asteroids[i].x += this.WIDTH + 2* this.asteroids[i].radius;
                    if (Vector.distance2(this.asteroids[i],this.asteroids[j]) < Math.pow(this.asteroids[i].radius + this.asteroids[j].radius,2)) {
                      this.asteroids[i].collide(this.asteroids[j]);
                    }
                    this.asteroids[i].x -= this.WIDTH + 2* this.asteroids[i].radius;
                  }
                  if (this.asteroids[i].x > this.WIDTH) {
                    this.asteroids[i].x += this.WIDTH + 2* this.asteroids[i].radius;
                    if (Vector.distance2(this.asteroids[i],this.asteroids[j]) < Math.pow(this.asteroids[i].radius + this.asteroids[j].radius,2)) {
                        this.asteroids[i].collide(this.asteroids[j]);
                    }
                    this.asteroids[i].x -= this.WIDTH + 2* this.asteroids[i].radius;
                  }
                  if (this.asteroids[i].y < 0) {
                    this.asteroids[i].y += this.HEIGHT + 2* this.asteroids[i].radius;
                    if (Vector.distance2(this.asteroids[i],this.asteroids[j]) < Math.pow(this.asteroids[i].radius + this.asteroids[j].radius,2)) {
                        this.asteroids[i].collide(this.asteroids[j]);
                    }
                    this.asteroids[i].y -= this.HEIGHT + 2* this.asteroids[i].radius;
                  }
                  if (this.asteroids[i].y > this.HEIGHT) {
                    this.asteroids[i].y -= this.HEIGHT + 2* this.asteroids[i].radius;
                    if (Vector.distance2(this.asteroids[i],this.asteroids[j]) < Math.pow(this.asteroids[i].radius + this.asteroids[j].radius,2)) {
                        this.asteroids[i].collide(this.asteroids[j]);
                    }
                    this.asteroids[i].y += this.HEIGHT + 2* this.asteroids[i].radius;
                  }
              }
              if (Vector.distance2(this.asteroids[i], this.player) < Math.pow(this.asteroids[i].radius + this.player.radius,2)) {
                if(this.player.collidecheck(this.asteroids[i])) {
                    this.playerdie();
                }
              }
              for (j = 0; j < this.bullets.length; j++) {
                if (Vector.distance2(this.asteroids[i],this.bullets[j]) < Math.pow(this.asteroids[i].radius + this.bullets[j].radius,2)) {
                    this.score += Math.floor(this.asteroids[i].size * 10);
                    var x = this.asteroids[i].destroy();
                    if (x) {
                        this.asteroids.push(x.aster1);
                        this.asteroids.push(x.aster2);
                    }
                    this.asteroids.splice(i,1);
                    this.bullets.splice(j,1);
                    
                    i--;
                    j--;
                    break;
                }
              }
            
          }
      }

    /** @method update
      * Updates the game state
      * @param {integer} elapsedTime - the number of milliseconds per frame
      */
    update(elapsedTime) {
      if (this.respawning) {
          this.respawntime += elapsedTime;
          if (this.respawntime > 3000) {
            this.respawning = false;
          }
          return;
      }
      this.player.update(this.y_dir(),this.r_dir(),elapsedTime);
      this.asteroids.forEach(function(a) {
          a.update(elapsedTime);
      });
      if (this.currentInput.space) {
          var res = this.player.fire();
          if (res) {
              this.bullets.push(res);
          }
      };
      for (var i = 0; i < this.bullets.length; i++) {
          if (this.bullets[i].update(elapsedTime)) {
              this.bullets.splice(i,1);
          }
      }
      this.checkcollisions();
      if(this.asteroids.length == 0) {
          this.difficulty++;
          // give a player an extra life once they complete the level.
          this.playerlives = Math.min(this.playerlives + 1, 3);
          for (var i = 0; i < this.difficulty + 6; i++) {
              this.asteroids.push(this.spawnAsteroid());
          }
          this.player = new Ship(this.WIDTH, this.HEIGHT);
      }
    }
    /** @method render
      * Renders the game state
      * @param {integer} elapsedTime - the number of milliseconds per frame
      */
    render(elapsedTime) {
      if (this.over) {
        this.gameover(this.backBufferCtx);
      }
      else if (this.respawning) {
          this.countdown(this.backBufferCtx);
      }
      else {
        var bbctx = this.backBufferCtx;
        // Clear the back buffer
        bbctx.clearRect(0,0,this.WIDTH, this.HEIGHT);
  
        this.player.render(this.backBufferCtx);
        this.asteroids.forEach(function (a) {
            a.render(bbctx);
        })
        this.bullets.forEach(function (b) {
            b.render(bbctx);
        })
        this.drawOverlay(this.backBufferCtx);
        if (this.difficulty == 1) {
            this.tutorial(this.backBufferCtx);
        }
      }
      
      // Flip the back buffer
      this.screenBufferCtx.clearRect(0,0,this.width,this.heght);
      this.screenBufferCtx.fillStyle = 'black';
      this.screenBufferCtx.fillRect(0,0,this.WIDTH,this.HEIGHT)
      this.screenBufferCtx.drawImage(this.backBuffer, 0, 0);
    }
    /** @method loop
      * Updates and renders the game,
      * and calls itself on the next draw cycle.
      * @param {DOMHighResTimestamp} timestamp - the current system time
      */
    loop(timestamp) {
      var elapsedTime = this._frame_start ? timestamp - this._frame_start : 0;
      this.update(elapsedTime);
      this.render(elapsedTime);
      this._frame_start = timestamp;
      if (this.over) {
          return;
      }
      window.requestAnimationFrame((timestamp) => {this.loop(timestamp)});
    }
  }