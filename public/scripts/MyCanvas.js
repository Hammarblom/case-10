export class MyCanvas {
    /**
     * Creates an instance of MyCanvas.
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} ctx
     * @memberof MyCanvas
     */
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    /**
     *
     *
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @param {string} color
     * @memberof MyCanvas
     */
    drawCircle(x, y, radius, color) {

        // eventuellt kontrollera argument så att 
        // värden för datatyper är okej

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        this.ctx.fillStyle = color ? color : "yellow";
        this.ctx.fill();        
    }

    /**
     *
     *
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {string} color
     * @memberof MyCanvas
     */
    drawText(text, x, y, color) {
        this.ctx.font = "16px Comic sans";
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y, this.canvas.width);
    }

}