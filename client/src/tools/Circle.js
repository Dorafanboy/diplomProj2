import Tool from "./Tool";


export default class Circle extends Tool {
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
                type: 'circle',
                x: this.startX,
                y: this.startY,
                r: Math.sqrt(this.width**2 + this.height**2),
                color: this.ctx.strokeStyle, // Используем strokeStyle для цвета линии
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX-e.target.offsetLeft
        this.startY = e.pageY-e.target.offsetTop
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e) {
        if(this.mouseDown) {
            let curentX =  e.pageX-e.target.offsetLeft
            let curentY =  e.pageY-e.target.offsetTop
            this.width = curentX-this.startX
            this.height = curentY-this.startY
            let r = Math.sqrt(this.width**2 + this.height**2)
            this.draw(this.startX, this.startY, r)
        }
    }

    draw(x,y,r) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2*Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx, x, y, r, color) {
        ctx.strokeStyle = color; // Используем strokeStyle для цвета линии
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2*Math.PI)
        ctx.fill()
        ctx.stroke()
        console.log('strok')
    }
}
