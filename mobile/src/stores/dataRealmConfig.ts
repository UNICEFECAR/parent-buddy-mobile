import Realm from 'realm';
import { ArticleEntity } from './ArticleEntity';

export const dataRealmConfig: Realm.Configuration = {
    path: 'data.realm',
    schema: [
        ArticleEntity.schema,
    ],
};
