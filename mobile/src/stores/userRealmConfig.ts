import Realm from 'realm';
import { VariableEntitySchema } from './VariableEntity';

export const userRealmConfig: Realm.Configuration = {
    // API: https://bit.ly/36WypWV
    path: 'user.realm',
    schema: [
        VariableEntitySchema,
    ],
};
