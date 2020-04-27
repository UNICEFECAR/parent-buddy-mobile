/**
 * Article entity used by stores.
 */
export type ArticleEntity = {
    title: string;
    coverImageUrl: string;
    coverImageLocalPath?: string;
    youTubeVideoId?: string;
    categoryId: number;
    tagsIds?: Array<number>;
    bodyHTML: string;
};

export const ArticleEntitySchema = {
    name: 'ArticleEntity',
    properties: {
        title: {type:'string'},
        coverImageUrl: {type:'string'},
        coverImageLocalPath: {type:'string', optional:true},
        youTubeVideoId: {type:'string', optional:true},
        categoryId: {type:'int'},
        tagsIds: {type:'int[]', optional:true},
        bodyHTML: {type:'string'}
    }
};