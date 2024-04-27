import Tool from "./Tool";

export default class RightTriangle extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'rightTriangle',
                x1: this.startX,
                y1: this.startY,
                x2: this.startX + this.width,
                y2: this.startY,
                x3: this.startX,
                y3: this.startY - this.height,
                color: this.ctx.fillStyle,
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.startX;
            this.height = this.startY - currentY;
            this.draw(this.startX, this.startY, this.width, this.height)
        }
    }

    draw(x, y, w, h) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(x, y)
            this.ctx.lineTo(x + w, y)
            this.ctx.lineTo(x, y - h)
            this.ctx.closePath()
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx, x1, y1, x2, y2, x3, y3, color) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineTo(x3, y3)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
    }
}
