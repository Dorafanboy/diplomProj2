import Tool from "./Tool";

export default class TextTool extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen();
        this.fontSize = '16px';
        this.fontFamily = 'Arial';
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    }

    mouseDownHandler(e) {
        const x = e.pageX - e.target.offsetLeft;
        const y = e.pageY - e.target.offsetTop;
        const text = prompt('Введите текст:');
        if (text) {
            this.drawText(x, y, text);
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'text',
                    x: x,
                    y: y,
                    text: text,
                    font: this.ctx.font
                }
            }));
        }
    }

    drawText(x, y, text) {
        this.ctx.font = this.font;
        this.ctx.fillText(text, x, y);
    }

    setFontSize(size) {
        this.fontSize = size;
        this.updateFont();
    }

    setFontFamily(family) {
        this.fontFamily = family;
        this.updateFont();
    }

    updateFont() {
        this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    }

    static staticDraw(ctx, x, y, text, font) {
        ctx.font = font;
        ctx.fillText(text, x, y);
    }
}