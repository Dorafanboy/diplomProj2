import {Request} from "express";
import {ImageController} from "./entities/image/imageController";
import {ImageService} from "./entities/image/imageService";
import bodyParser from "body-parser";
import path from "path";
import * as fs from "node:fs";

const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const libre = require('libreoffice-convert');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

async function startApp() {
    const imageService = new ImageService(app)
    const imageController = new ImageController(imageService)
    
    app.use(cors())
    app.use(express.json())

    app.use(bodyParser.json({limit: '1000mb'}));
    app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}));

    app.ws('/', (ws: any, req: Request) => {
        ws.on('message', (msg: any) => {
            msg = JSON.parse(msg)
            switch (msg.method) {
                case "connection":
                    connectionHandler(ws, msg)
                    break
                case "draw":
                    broadcastConnection(ws, msg)
                    break
                case "undo":
                case "redo":
                    broadcastConnection(ws, msg)
                    break
                case "lineWidthChanged":
                    broadcastConnection(ws, msg)
                    break
            }
        })
    })
    
    await imageController.postImage()
    await imageController.getImage()
}

app.post('/upload', upload.single('file'), async (req: any, res: any) => {
    console.log('test upldoa')

    const filePath = path.join(__dirname, req.file.path);
        const outputPath = path.join(__dirname, 'output.pdf');
        const file = fs.readFileSync(filePath);

        libre.convert(file, '.pdf', undefined, (err: any, done: any) => {
            if (err) {
                console.log(`Error converting file: ${err}`);
                res.status(500).send('Error converting file');
            }

            fs.writeFileSync(outputPath, done);
            res.download(outputPath);
        });
});

startApp()

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))

const connectionHandler = (ws: any, msg: any) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws: any, msg: any) => {
    aWss.clients.forEach((client: any) => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}