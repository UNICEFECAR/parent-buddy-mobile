import Realm from 'realm';
import { ArticleEntitySchema } from './ArticleEntity';

export const dataRealmConfig: Realm.Configuration = {
    path: 'data.realm',
    schema: [
        ArticleEntitySchema,
    ],
};
