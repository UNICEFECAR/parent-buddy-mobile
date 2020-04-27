import Realm from "realm";

/**
 * Article entity used by stores.
 */
export class ArticleEntity {
    static schema: Realm.ObjectSchema;

    // id: number = 0;
    title: string = '';
    coverImageUrl: string = '';
    coverImageLocalPath: string = '';
    youTubeVideoId?: string;
    categoryId: number = 0;
    tagsIds: number[] = [];
    bodyHTML: string = '';
}

ArticleEntity.schema = {
    name: 'ArticleEntity',
    // API: https://realm.io/docs/javascript/latest/#supported-types
    properties: {
        title: 'string',
        coverImageUrl: 'string',
        coverImageLocalPath: 'string',
        youTubeVideoId: 'string?',
        categoryId: 'int',
        tagsIds: 'int[]',
        bodyHTML: 'string',
    }
};