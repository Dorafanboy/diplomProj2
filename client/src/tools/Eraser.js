import Tool from "./Tool";

export default class Eraser extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        console.log('listen')
        console.log(this.ctx.strokeStyle)
        this.previousStyle = this.ctx.strokeStyle
        this.ctx.strokeStyle = 'white'; // Используем strokeStyle для цвета линии
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'finish',
            }
        }))
    }
    
    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }
    
    mouseMoveHandler(e) {
        if (this.mouseDown) {
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'erase',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    previousStyle: this.previousStyle
                }
            }))
        }
    }

    static erase(ctx, x, y, previousStyle) {
        ctx.strokeStyle = 'white'; // Используем strokeStyle для цвета линии
        ctx.lineTo(x, y)
        ctx.stroke()
        console.log('erase')
        ctx.strokeStyle = previousStyle
    }
}
