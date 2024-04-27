import Tool from "./Tool";

export default class Axis extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.draw()
        console.log('Axis drawn')
    }

    draw() {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.drawAxis()
        }
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'axis',
                color: this.ctx.strokeStyle, // Используем strokeStyle для цвета линии
            }
        }))
    }

    drawAxis() {
        // Определение центра холста
        let xCenter = this.canvas.width / 2;
        let yCenter = this.canvas.height / 2;

        // Рисование оси X
        this.ctx.beginPath();
        this.ctx.moveTo(0, yCenter);
        this.ctx.lineTo(this.canvas.width, yCenter);
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        // Рисование стрелки для оси X
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width, yCenter);
        this.ctx.lineTo(this.canvas.width - 10, yCenter - 5);
        this.ctx.lineTo(this.canvas.width - 10, yCenter + 5);
        this.ctx.fill();

        // Рисование оси Y
        this.ctx.beginPath();
        this.ctx.moveTo(xCenter, 0);
        this.ctx.lineTo(xCenter, this.canvas.height);
        this.ctx.stroke();

        // Рисование стрелки для оси Y
        this.ctx.beginPath();
        this.ctx.moveTo(xCenter, 0);
        this.ctx.lineTo(xCenter - 5, 10);
        this.ctx.lineTo(xCenter + 5, 10);
        this.ctx.fill();

        // Добавление подписей к осям
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Y', xCenter + 10, 20);
        this.ctx.fillText('X', this.canvas.width - 20, yCenter - 10);
    }

    static staticDraw(ctx, color) {
        ctx.strokeStyle = color;

        // Определение центра холста
        let xCenter = ctx.canvas.width / 2;
        let yCenter = ctx.canvas.height / 2;

        // Рисование оси X
        ctx.beginPath();
        ctx.moveTo(0, yCenter);
        ctx.lineTo(ctx.canvas.width, yCenter);
        ctx.strokeStyle = 'black';
        ctx.stroke();

        // Рисование стрелки для оси X
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width, yCenter);
        ctx.lineTo(ctx.canvas.width - 10, yCenter - 5);
        ctx.lineTo(ctx.canvas.width - 10, yCenter + 5);
        ctx.fill();

        // Рисование оси Y
        ctx.beginPath();
        ctx.moveTo(xCenter, 0);
        ctx.lineTo(xCenter, ctx.canvas.height);
        ctx.stroke();

        // Рисование стрелки для оси Y
        ctx.beginPath();
        ctx.moveTo(xCenter, 0);
        ctx.lineTo(xCenter - 5, 10);
        ctx.lineTo(xCenter + 5, 10);
        ctx.fill();

        // Добавление подписей к осям
        ctx.font = '20px Arial';
        ctx.fillText('Y', xCenter + 10, 20);
        ctx.fillText('X', ctx.canvas.width - 20, yCenter - 10);
    }
}
