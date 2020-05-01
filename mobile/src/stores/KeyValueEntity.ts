export type KeyValueEntity = {
    key: string;
    value: string;
};

/**
 * Realm schema for KeyValueEntity.
 */
export const KeyValueEntitySchema = {
    name: 'KeyValueEntity',

    properties: {
        key: {type:'string'},
        value: {type:'string'},
    }
};