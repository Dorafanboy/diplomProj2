import {Express, Request, Response} from "express";
import * as fs from 'fs';
import path from 'path';

export class ImageService {
    constructor(private readonly _app: Express) {}

    async getImage() {
        this._app.get('/image', (req: Request, res: Response) => {
            const filePath = path.resolve(__dirname, '../files', `${req.query.id}.jpg`);
            
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, '', 'base64');
            }
            
            try {
                const file = fs.readFileSync(filePath)
                const data = `data:image/png;base64,` + file.toString('base64')
                res.json(data)
            } catch (e) {
                return res.status(500).json('error')
            }
        })
    }

    async postImage() {
        this._app.post('/image', (req: Request, res: Response) => {
            try {
                const data = req.body.img.replace(`data:image/png;base64,`, '')
                fs.writeFileSync(path.resolve(__dirname, '../files', `${req.query.id}.jpg`), data, 'base64')
                
                return res.status(200).json({message: "Загружено"})
            } catch (e) {
                return res.status(500).json('error')
            }
        })
    }
}