import Tool from "./Tool";

export default class Polygon extends Tool {
    constructor(canvas, socket, id, sides = 5) {
        super(canvas, socket, id);
        this.sides = sides;
        this.listen();
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
        this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    }

    mouseDownHandler(e) {
        this.mouseDown = true;
        this.ctx.beginPath();
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        this.saved = this.canvas.toDataURL();
    }

    mouseUpHandler(e) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'polygon',
                x: this.startX,
                y: this.startY,
                radius: this.radius,
                sides: this.sides,
                color: this.ctx.fillStyle,
            }
        }));
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            this.radius = Math.sqrt(Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2));
            this.draw(this.startX, this.startY, this.radius, this.sides);
        }
    }

    draw(x, y, radius, sides) {
        const img = new Image();
        img.src = this.saved;
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            this.ctx.beginPath();
            for (let i = 0; i <= sides; i++) {
                let curAngle = i * (2 * Math.PI / sides) - Math.PI / 2; // Изменение здесь
                let curX = x + radius * Math.cos(curAngle);
                let curY = y + radius * Math.sin(curAngle);
                if (i === 0) {
                    this.ctx.moveTo(curX, curY);
                } else {
                    this.ctx.lineTo(curX, curY);
                }
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    static staticDraw(ctx, x, y, radius, sides, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
            let curAngle = i * (2 * Math.PI / sides) - Math.PI / 2; // Изменение здесь
            let curX = x + radius * Math.cos(curAngle);
            let curY = y + radius * Math.sin(curAngle);
            if (i === 0) {
                ctx.moveTo(curX, curY);
            } else {
                ctx.lineTo(curX, curY);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
