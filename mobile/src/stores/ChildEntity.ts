import { ObjectSchema } from "realm";

export type ChildEntity = {
    name: string;
    gender: 'boy' | 'girl',
    photo: string;
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
        photo: {type:'string'},
    }
};