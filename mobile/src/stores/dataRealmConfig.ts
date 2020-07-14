import Realm from 'realm';
import { ContentEntitySchema } from './ContentEntity';
import { VariableEntitySchema } from './VariableEntity';
import { BasicPagesEntitySchema } from './BasicPageEntity';
import { DailyMessageEntity, DailyMessageEntitySchema } from './DailyMessageEntity';

export const dataRealmConfig: Realm.Configuration = {
    // API: https://bit.ly/36WypWV
    path: 'data.realm',
    schema: [
        ContentEntitySchema,
        VariableEntitySchema,
        BasicPagesEntitySchema,
        DailyMessageEntitySchema
    ],
};  
