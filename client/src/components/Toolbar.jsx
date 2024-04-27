import React from 'react';
import '../styles/toolbar.scss'
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import canvasState from "../store/canvasState";
import Rect from "../tools/Rect";
import Line from "../tools/Line";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Triangle from "../tools/Triangle";
import Cell from "../tools/Cell";
import Ruler from "../tools/Ruler";
import Polygon from "../tools/Polygon";
import Axis from "../tools/Axis";
import TextTool from "../tools/TextTool";
import RightTriangle from "../tools/RightTriangle";

const Toolbar = () => {

    const changeColor = e => {
        toolState.setStrokeColor(e.target.value)
        toolState.setFillColor(e.target.value)
    }

    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL()
        console.log(dataUrl)
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = canvasState.sessionid + ".jpg"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const sendUndo = () => {
        if (canvasState.socket && canvasState.socket.readyState === WebSocket.OPEN) {
            console.log('snasch undo')
            canvasState.socket.send(JSON.stringify({ method: 'undo', id: canvasState.sessionid }));
        }
    };

    const sendRedo = () => {
        if (canvasState.socket && canvasState.socket.readyState === WebSocket.OPEN) {
            canvasState.socket.send(JSON.stringify({ method: 'redo', id: canvasState.sessionid }));
        }
    };

    return (
        <div className="toolbar">
            <button className="toolbar__btn brush"
                    onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn rect"
                    onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn triangle"
                    onClick={() => toolState.setTool(new Triangle(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn rightTriangle"
                    onClick={() => toolState.setTool(new RightTriangle(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn circle"
                    onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn polygon"
                    onClick={() => toolState.setTool(new Polygon(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn eraser"
                    onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn line"
                    onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn cell"
                    onClick={() => toolState.setTool(new Cell(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn ruler"
                    onClick={() => toolState.setTool(new Ruler(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn axis"
                    onClick={() => toolState.setTool(new Axis(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <button className="toolbar__btn text"
                    onClick={() => toolState.setTool(new TextTool(canvasState.canvas, canvasState.socket, canvasState.sessionid))}/>
            <input onChange={e => changeColor(e)} style={{marginLeft: 10}} type="color"/>
            <button className="toolbar__btn undo" onClick={() => {
                // canvasState.undo();
                sendUndo();
            }}/>
            <button className="toolbar__btn redo" onClick={() => {
                canvasState.redo();
                sendRedo();
            }}/>
            <button className="toolbar__btn save" onClick={() => download()}/>
        </div>
    );
};

export default Toolbar;