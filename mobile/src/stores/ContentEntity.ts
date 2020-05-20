import { ObjectSchema } from "realm";

export type ContentEntityType = 'article' | 'faq';

export type ContentEntity = {
    id: number;
    type: ContentEntityType;
    langcode: string;
    title: string;
    body?: string;
    category?: number;
    predefinedTags: number[];
    keywords: number[];
    coverImageUrl?: string;
    coverImageAlt?: string;
    updatedAt: Date;
};

/**
 * Realm schema for ContentEntity.
 */
export const ContentEntitySchema: ObjectSchema = {
    name: 'ContentEntity',
    primaryKey: 'id',

    // API: https://bit.ly/3f7k9jq
    properties: {
        id: {type:'int'},
        type: {type:'string'},
        langcode: {type:'string'},
        title: {type:'string'},
        body: {type:'string', optional:true},
        category: {type:'int', optional:true},
        predefinedTags: {type:'int[]'},
        keywords: {type:'int[]'},
        coverImageUrl: {type:'string', optional:true},
        coverImageAlt: {type:'string', optional:true},
        updatedAt: {type:'date'},
    }
};