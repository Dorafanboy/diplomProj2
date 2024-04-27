import {ImageService} from "./imageService";

export class ImageController {
    constructor(private readonly _imageService: ImageService) {}

    async getImage() {
       await this._imageService.getImage()
    }

    async postImage() {
        await this._imageService.postImage()
    }
}