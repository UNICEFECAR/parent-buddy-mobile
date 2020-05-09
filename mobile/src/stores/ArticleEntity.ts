import { ObjectSchema } from "realm";

export type ArticleEntity = {
    externalId: number;
    title: string;
    coverImageUrl: string;
    coverImageLocalPath?: string;
    youTubeVideoId?: string;
    categoryId: number;
    tagsIds?: Array<number>;
    bodyHTML: string;
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Realm schema for ArticleEntity.
 */
export const ArticleEntitySchema: ObjectSchema = {
    name: 'ArticleEntity',

    // API: https://bit.ly/3f7k9jq
    properties: {
        externalId: {type:'int'},
        title: {type:'string'},
        coverImageUrl: {type:'string'},
        coverImageLocalPath: {type:'string', optional:true},
        youTubeVideoId: {type:'string', optional:true},
        categoryId: {type:'int'},
        tagsIds: {type:'int[]', optional:true},
        bodyHTML: {type:'string'},
        createdAt: {type:'date'},
        updatedAt: {type:'date'},
    }
};