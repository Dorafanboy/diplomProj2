import React from 'react';
import toolState from "../store/toolState";
import LineWidth from "../tools/LineWidth";
import canvasState from "../store/canvasState";
import Line from "../tools/Line";
import Polygon from "../tools/Polygon";
import Ruler from "../tools/Ruler";
import Cell from "../tools/Cell";
import TextTool from "../tools/TextTool";

const SettingBar = () => {
    return (
        <div className="setting-bar">
            <label htmlFor="line-width">Толщина линии</label>
            <input
                onChange={e => {
                    let lineWidth = new LineWidth(canvasState.canvas, canvasState.socket, canvasState.sessionid)
                    toolState.setTool(lineWidth)
                    toolState.setLineWidth(e.target.value);
                    lineWidth.test(e.target.value)
                    console.log('sfhfssfh')
                }}
                style={{margin: '0 10px'}}
                id="line-width"
                type="number" defaultValue={1} min={1} max={50}/>
            <label htmlFor="line-width">Количество углов многоугольника</label>
            <input
                onChange={e => {
                    let polygon = new Polygon(canvasState.canvas, canvasState.socket, canvasState.sessionid, e.target.value)
                    toolState.setTool(polygon)
                    console.log('Количество сторон многоугольника изменено')
                }}
                style={{margin: '0 10px'}}
                id="polygon-sides"
                type="number" defaultValue={5} min={5} max={50}/>
            <label htmlFor="line-width">Изменить длинну клеток</label>
            <input
                onChange={e => {
                    let ruler = new Ruler(canvasState.canvas, canvasState.socket, canvasState.sessionid, e.target.value)
                    let cell = new Cell(canvasState.canvas, canvasState.socket, canvasState.sessionid, e.target.value)
                    toolState.setTool(ruler)
                    toolState.setTool(cell)
                    console.log('Размер шага сетки изменен')
                    console.log('Размер шага сетки изменен')
                }}
                style={{margin: '0 10px'}}
                id="grid-step-size"
                type="number" defaultValue={50} min={5} max={100}/>
            <label htmlFor="font-size">Размер шрифта</label>
            <input
                style={{margin: '0 10px'}}
                id="font-size"
                type="number" defaultValue={16} min={1} max={72}
                onChange={e => {
                    let textTool = new TextTool(canvasState.canvas, canvasState.socket, canvasState.sessionid)
                    toolState.setTool(textTool)
                   // toolState.setFontSize(e.target.value);
                    textTool.setFontSize(e.target.value)
                }}
            />
            <label htmlFor="font-family">Шрифт</label>
            <select
                style={{margin: '0 10px'}}
                id="font-family"
                onChange={e => {
                    let textTool = new TextTool(canvasState.canvas, canvasState.socket, canvasState.sessionid)
                    toolState.setTool(textTool)
                  //  toolState.setFontFamily(e.target.value);
                    textTool.setFontFamily(e.target.value)
                }}
            >
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Times New Roman">Times New Roman</option>
                {/* Добавьте другие шрифты по желанию */}
            </select>
        </div>
    );
};

export default SettingBar;