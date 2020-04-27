import Realm from 'realm';
import { ArticleEntitySchema } from './ArticleEntity';

export const dataRealmConfig: Realm.Configuration = {
    // API: https://bit.ly/36WypWV
    path: 'data.realm',
    schema: [
        ArticleEntitySchema,
    ],
};
