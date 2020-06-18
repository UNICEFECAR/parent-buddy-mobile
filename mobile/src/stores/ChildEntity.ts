import { ObjectSchema } from "realm";

export type ChildEntity = {
    uuid: string;
    name: string;
    gender: ChildGender,
    photoUri?: string;
    createdAt: Date;
    updatedAt: Date;
    plannedTermDate?: Date;
    birthDate?: Date;
    babyRate?: number;
    height?: String;
    weight?: String; 
    comment?: String;
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
        plannedTermDate: {type: 'date', optional: true},
        birthDate: {type: 'date', optional: true},
        babyRate: {type: 'int', optional: true},
        height: {type: 'string', optional: true},
        weight: {type: 'string', optional: true}, 
        comment: {type: 'string', optional: true},
    }
};

export type ChildGender = 'boy' | 'girl';