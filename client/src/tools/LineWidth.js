import Tool from "./Tool";
import canvasState from "../store/canvasState";

export default class LineWidth extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
        this.name = 'Line'
    }

    listen() {
        //this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    test(value) {
        console.log("mouseDownHandler");
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'test',
                value: value,
            }
        }))
    }

    static changeLineWidth(ctx, newLineWidth, socket) {
        console.log("Делаю смену ширины линии"); // Добавляем отладочный вывод
        console.log(newLineWidth)
        ctx.lineWidth = newLineWidth;
    }
}