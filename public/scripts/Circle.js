export class Circle {
        
    /**
     * Creates an instance of Circle.
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} owner
     * @param {string} id
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {string} color
     * @param {number} dx
     * @param {number} dy
     * @memberof Circle
     */
    constructor(canvas, ctx, owner, id, x, y, radius, color, dx, dy) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.owner = owner;
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = dx;
        this.dy = dy;
    }

    /**
     * draw arc
     *
     * @memberof Circle
     */
    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI  * 2, false);
        this.ctx.fillStyle = this.color ?? "yellow";
        this.ctx.fill();
    }

    /**
     * change circle position
     *
     * @memberof Circle
     */
    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

}