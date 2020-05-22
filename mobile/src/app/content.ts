import { ContentEntity } from "../stores/ContentEntity";
import { ApiImageData, VocabulariesAndTermsResponse } from "../stores/apiStore";
import RNFS from 'react-native-fs';
import { utils } from "./utils";
import { ContentViewEntity } from "../stores/ContentViewEntity";

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

    public getCoverImageFilepath(content: ContentEntity): string | undefined {
        let rval: string | undefined = undefined;
        let coverImageData = this.getCoverImageData(content);

        if (coverImageData) {
            rval = `${coverImageData.destFolder}/${coverImageData.destFilename}`;
        }

        return rval;
    }

    public toContentViewEntity(contentEntity: ContentEntity, vocabulariesAndTermsResponse:VocabulariesAndTermsResponse): ContentViewEntity {
        const contentViewEntity: ContentViewEntity = {
            id: contentEntity.id,
            type: contentEntity.type,
            langcode: contentEntity.langcode,
            title: contentEntity.title,
            body: contentEntity.body,
            coverImageUrl: contentEntity.coverImageUrl,
            coverImageAlt: contentEntity.coverImageAlt,
            updatedAt: contentEntity.updatedAt,

            category: {id:0, name:''},
            predefinedTags: [{id:0, name:''}],
            keywords: [{id:0, name:''}],
            coverImageFilepath: '',
        };

        // category
        let categoryName: string | null = null;
        
        vocabulariesAndTermsResponse.categories.forEach((value) => {
            if (value.id === contentEntity.category) {
                categoryName = value.name;
            }
        });

        if (categoryName) {
            contentViewEntity.category = {
                id: contentEntity.id,
                name: categoryName,
            };
        }

        // predefinedTags
        contentViewEntity.predefinedTags = vocabulariesAndTermsResponse.predefined_tags.filter((value) => {
            if (contentEntity.predefinedTags.indexOf(value.id) !== -1) {
                return true;
            } else {
                return false;
            }
        });

        // keywords
        contentViewEntity.keywords = vocabulariesAndTermsResponse.keywords.filter((value) => {
            if (contentEntity.keywords.indexOf(value.id) !== -1) {
                return true;
            } else {
                return false;
            }
        });

        // coverImageFilepath
        const coverImageFilepath = this.getCoverImageFilepath(contentEntity);
        
        if (coverImageFilepath) {
            contentViewEntity.coverImageFilepath = coverImageFilepath;
        }

        return contentViewEntity;
    }
}

export const content = Content.getInstance();