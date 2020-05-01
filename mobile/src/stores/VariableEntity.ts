export type VariableEntity = {
    key: string;
    value: string;
    createdAt?: Date;
    updatedAt: Date;
};

/**
 * Realm schema for VariableEntity.
 */
export const VariableEntitySchema = {
    name: 'VariableEntity',

    // API: https://bit.ly/3f7k9jq
    properties: {
        key: {type:'string'},
        value: {type:'string'},
        createdAt: {type:'date'},
        updatedAt: {type:'date'},
    }
};