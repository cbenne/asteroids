export default class Heart {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
    }

    render(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x,this.y+4);
        ctx.lineTo(this.x+4,this.y);
        ctx.arcTo(this.x+6,this.y-2,this.x + 4,this.y-4,2);
        ctx.lineTo(this.x + 4, this.y - 4);
        ctx.arcTo(this.x+2,this.y-6,this.x,this.y-4,2);
        ctx.lineTo(this.x, this.y -4);
        ctx.arcTo(this.x-2,this.y-6,this.x - 4,this.y-4,2);
        ctx.lineTo(this.x - 4, this.y -4);
        ctx.arcTo(this.x-6,this.y-2,this.x - 4,this.y,2);
        ctx.lineTo(this.x - 4, this.y);
        ctx.closePath();
        ctx.fillStyle = 'red';
        ctx.fill();
    }
}