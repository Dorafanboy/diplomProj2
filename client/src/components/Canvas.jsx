import React, {useEffect, useRef, useState} from 'react';
import "../styles/canvas.scss"
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import  {Modal, Button} from "react-bootstrap";
import {useParams} from "react-router-dom"
import Rect from "../tools/Rect";
import axios from 'axios'
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import Eraser from "../tools/Eraser";
import LineWidth from "../tools/LineWidth";
import Triangle from "../tools/Triangle";
import Cell from "../tools/Cell";
import Ruler from "../tools/Ruler";
import Polygon from "../tools/Polygon";
import Axis from "../tools/Axis";
import {Page, pdfjs, Document} from 'react-pdf';
import TextTool from "../tools/TextTool";
import RightTriangle from "../tools/RightTriangle";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Canvas = observer(() => {
    let socket = null;
    const canvasRef = useRef()
    const usernameRef = useRef()
    const [modal, setModal] = useState(true)
    const params = useParams()
    const [width, setWidth] = useState(800); // Начальная ширина холста
    const [height, setHeight] = useState(600); // Начальная высота холста
    const [dragging, setDragging] = useState(false);
    const [lastX, setLastX] = useState(0);
    const [lastY, setLastY] = useState(0);
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [dragMode, setDragMode] = useState(true); // Новое состояние для режима прокрутки
    const [drawMode, setDrawMode] = useState(true); // Новое состояние для режима рисования
    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [file, setFile] = useState(null);

    const handleMouseDown = (e) => {
        if (!drawMode) return; // Добавлено здесь
        setLastX(e.clientX);
        setLastY(e.clientY);
        setDragging(true);
    };

    const handleMouseLeave = () => {
        setDragging(false);
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!dragging || !dragMode) return; // Изменение здесь
        e.preventDefault();
        setTranslateX(translateX + e.clientX - lastX);
        setTranslateY(translateY + e.clientY - lastY);
        setLastX(e.clientX);
        setLastY(e.clientY);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(translateX, translateY);
        // Здесь вы можете рисовать на холсте, и он будет перемещаться вместе с прокруткой.
        ctx.restore();
    }, [translateX, translateY]);
    
    useEffect(() => {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
    }, [width, height]);
    
    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            })
    }, [])

    useEffect(() => {
        if (!drawMode) {
            console.log('darw mode:', drawMode)
            return;
        };
        
        console.log('darw mode2:', drawMode)

        if (canvasState.username) {
            socket = new WebSocket(`ws://localhost:5000/`);
            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                console.log('Подключение установлено')
                socket.send(JSON.stringify({
                    id:params.id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = async (event) => {
                let msg = JSON.parse(event.data)
                switch (msg.method) {
                    case "connection":
                        console.log(`пользователь ${msg.username} присоединился`)
                        break
                    case "draw":
                        drawHandler(msg)
                        break
                    case "undo":
                        console.log('undo')
                        canvasState.undo();
                        break;
                    case "redo":
                        console.log('redo')
                        canvasState.redo();
                        break;
                    case "pdfChange": // 
                        console.log('обрабатываем сообщения о изменении PDF')
                        setFile(msg.file);
                        await renderPdf(msg.file);
                        break
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y)
                break
            case "rect":
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color)
                break
            case "circle":
                Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color)
                break
            case "line":
                Line.staticDraw(ctx, figure.startX, figure.startY, figure.endX, figure.endY, figure.color);
                break
            case "erase":
                Eraser.erase(ctx, figure.x, figure.y, figure.previousStyle);
                break
            case "finish":
                ctx.beginPath()
                break
            case "test":
                LineWidth.changeLineWidth(ctx, figure.value);
                break
            case "triangle":
                Triangle.staticDraw(ctx, figure.x1, figure.y1, figure.x2, figure.y2, figure.x3, figure.y3, figure.color);
                break
            case "rightTriangle":
                RightTriangle.staticDraw(ctx, figure.x1, figure.y1, figure.x2, figure.y2, figure.x3, figure.y3, figure.color);
                break
            case "grid":
                Cell.staticDraw(ctx, figure.stepSize, figure.color);
                break;
            case "ruler":
                Ruler.staticDraw(ctx, figure.stepSize, figure.color);
                break;
            case "polygon":
                Polygon.staticDraw(ctx, figure.x, figure.y, figure.radius, figure.sides, figure.color);
                break;
            case "axis":
                Axis.staticDraw(ctx, figure.color);
                break;
            case "text":
                TextTool.staticDraw(ctx, figure.x, figure.y, figure.text, figure.font);
                break;
        }
    }

    const mouseDownHandler = () => {
        console.log('dawn handler')
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(response => console.log(response.data))
    }

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        setModal(false)
    }

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };
    
    const handleFileChangePdf = (event) => {
        setFile(URL.createObjectURL(event.target.files[0]));

        const reader = new FileReader();
        reader.onload = function(event) {
            socket.send(JSON.stringify({
                method: 'pdfChange',
                id: params.id,
                username: canvasState.username,
                file: event.target.result,
            }));
            
            console.log("snesdsd")
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    const handleFileChangeNotPdf = async (e) => {
        const fileName = e.target.files[0].name

        if (fileName.includes('.pdf')) {
            handleFileChangePdf(e);
            return;
        }
    };

    const renderPdf = async (pdfUrl) => {
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        await page.render(renderContext);
    };

    useEffect(() => {
        if (file) {
            renderPdf(file);
        }
    }, [file, currentPage]);

    return (
        <div className="canvas">
            <button onClick={() =>{
                setDragMode(!dragMode)
                console.log(dragMode)
            }}>
                {dragMode ? 'Switch to Draw Mode' : 'Switch to Drag Mode'}
            </button>
            <input type="file" onChange={handleFileChangeNotPdf} />
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                Предыдущая страница
            </button>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === numPages}>
                Следующая страница
            </button>
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header >
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <div style={{position: 'absolute', top: '100px', left: 0}}>
                Ширина: <input type="number" value={width} onChange={e => setWidth(+e.target.value)} />
                Высота: <input type="number" value={height} onChange={e => setHeight(+e.target.value)} />
            </div>
            <canvas
                onMouseDown={() => mouseDownHandler()}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                ref={canvasRef}
                width={width}
                height={height}
            />
            {/*{file && (*/}
            {/*    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>*/}
            {/*        {Array.from(new Array(numPages), (el, index) => (*/}
            {/*            <Page key={`page_${index + 1}`} pageNumber={index + 1} />*/}
            {/*        ))}*/}
            {/*    </Document>*/}
            {/*)}*/}
        </div>
    );

});

export default Canvas;