import { ObjectSchema } from "realm";

export type ChildEntity = {
    uuid: string;
    name: string;
    gender: ChildGender,
    photoUri?: string;
    createdAt: Date;
    updatedAt: Date;
};

/**
 * Realm schema for ChildEntity.
 */
export const ChildEntitySchema: ObjectSchema = {
    name: 'ChildEntity',
    primaryKey: 'uuid',

    // API: https://bit.ly/3f7k9jq
    properties: {
        uuid: {type:'string'},
        name: {type:'string'},
        gender: {type:'string'},
        photoUri: {type:'string', optional:true},
        createdAt: {type:'date'},
        updatedAt: {type:'date'},
    }
};

export type ChildGender = 'boy' | 'girl';