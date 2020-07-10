import { ObjectSchema } from "realm";


export type Measures = {
    height: string;
    length: string;
    measurementDate: Date | undefined;
    titleDateInMonth?: number,
}

export type ChildEntity = {
    uuid: string;
    name: string;
    gender: ChildGender,
    photoUri?: string;
    createdAt: Date;
    updatedAt: Date;
    plannedTermDate?: Date;
    birthDate?: Date | undefined;
    babyRating?: number;
    measures: string;
    comment?: string;
};

/**
 * Realm schema for ChildEntity.
 */
export const Measure = {

}

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
        babyRating: {type: 'int', optional: true},
        measures: {type: 'string', optional: true},
        comment: {type: 'string', optional: true},
    }
};

export type ChildGender = 'boy' | 'girl';
