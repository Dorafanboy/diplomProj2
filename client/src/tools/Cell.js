import Tool from "./Tool";

export default class Cell extends Tool {
    constructor(canvas, socket, id, stepSize = 20) {
        super(canvas, socket, id);
        this.stepSize = stepSize;
        this.draw()
        console.log('drawiru')
    }

    draw() {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            // Здесь добавьте код для рисования сетки на холсте
            this.ctx.stroke()
        }
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'grid',
                stepSize: this.stepSize, // Замените на реальное значение шага сетки
                color: this.ctx.strokeStyle, // Используем strokeStyle для цвета линии
            }
        }))
    }

    static staticDraw(ctx, stepSize, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;

        console.log('rusiyu')
        // Рисуем вертикальные линии
        for (let x = stepSize; x < ctx.canvas.width; x += stepSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, ctx.canvas.height);
            ctx.stroke();
        }

        // Рисуем горизонтальные линии
        for (let y = stepSize; y < ctx.canvas.height; y += stepSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(ctx.canvas.width, y);
            ctx.stroke();
        }
    }
}
