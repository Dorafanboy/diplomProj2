import Tool from "./Tool";


export default class Line extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
        this.name = 'Line'
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'line',
                startX: this.currentX, // Добавляем координаты начальной точки
                startY: this.currentY, // Добавляем координаты начальной точки
                endX: e.pageX - e.target.offsetLeft, // Координаты конечной точки
                endY: e.pageY - e.target.offsetTop, // Координаты конечной точки
                color: this.ctx.strokeStyle, // Используем strokeStyle для цвета линии
            }
        }))
        
        console.log("Отправляем цвет:", this.ctx.strokeStyle); // Добавляем отладочный вывод
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.currentX = e.pageX-e.target.offsetLeft
        this.currentY = e.pageY-e.target.offsetTop
        this.ctx.beginPath()
        this.ctx.moveTo(this.currentX, this.currentY )
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.draw(e.pageX-e.target.offsetLeft, e.pageY-e.target.offsetTop);
        }
    }

    draw(x, y) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.currentX, this.currentY )
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx, startX, startY, endX, endY, color) {
        ctx.strokeStyle = color; // Используем strokeStyle для цвета линии
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        console.log("Принят цвет:", color); // Добавляем отладочный вывод
    }
}
