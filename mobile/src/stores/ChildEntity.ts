import { ObjectSchema } from "realm";

export type ChildEntity = {
    name: string;
    gender: ChildGender,
    photoData?: string;
    createdAt?: Date;
    updatedAt: Date;
};

/**
 * Realm schema for ChildEntity.
 */
export const ChildEntitySchema: ObjectSchema = {
    name: 'ChildEntity',

    // API: https://bit.ly/3f7k9jq
    properties: {
        name: {type:'string'},
        gender: {type:'string'},
        photoData: {type:'string', optional:true},
        createdAt: {type:'date', optional:true},
        updatedAt: {type:'date'},
    }
};

export type ChildGender = 'boy' | 'girl';