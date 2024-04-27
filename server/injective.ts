import {Express} from "express";
import {ImageController} from "./src/entities/image/imageController";
import {ImageService} from "./src/entities/image/imageService";

// export class Injective {
//     public readonly ImageService: ImageService;
//     public readonly ImageController: ImageController;
//
//     constructor(app: Express) {
//         this.ImageService = new ImageService(app);
//         this.ImageController = new ImageController(this.ImageService);
//     }
// }