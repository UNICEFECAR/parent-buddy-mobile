import Realm from 'realm';
import { ArticleEntitySchema } from './ArticleEntity';
import { VariableEntitySchema } from './VariableEntity';

export const dataRealmConfig: Realm.Configuration = {
    // API: https://bit.ly/36WypWV
    path: 'data.realm',
    schema: [
        VariableEntitySchema,
        ArticleEntitySchema,
    ],
};
