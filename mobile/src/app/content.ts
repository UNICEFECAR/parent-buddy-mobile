import { ContentEntity } from "../stores/ContentEntity";
import { ApiImageData } from "../stores/apiStore";
import RNFS from 'react-native-fs';
import { utils } from "./utils";

/**
 * Utility methods related to ContentEntity.
 */
class Content {
    private static instance: Content;

    private constructor() {}

    static getInstance(): Content {
        if (!Content.instance) {
            Content.instance = new Content();
        }
        return Content.instance;
    }

    public getCoverImageData(content: ContentEntity): ApiImageData | null {
        let rval: ApiImageData | null = null;

        if (!content || !content.coverImageUrl) {
            return null;
        }

        const imageExt = utils.getExtensionFromUrl(content.coverImageUrl);

        rval = {
            srcUrl: content.coverImageUrl,
            destFolder: RNFS.DocumentDirectoryPath + '/content',
            destFilename: `cover_image_${content.id}${imageExt ? '.' + imageExt : ''}`
        };

        return rval;
    }
}

export const content = Content.getInstance();