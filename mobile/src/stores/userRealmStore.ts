import Realm, { ObjectSchema, Collection } from 'realm';
import { userRealmConfig } from "./userRealmConfig";
import { VariableEntity, VariableEntitySchema } from './VariableEntity';
import { appConfig } from '../app/appConfig';
import { ChildEntity } from '.';
import { ChildEntitySchema } from './ChildEntity';

type Variables = {
    'userChildren': any;
    'userData': any;
};

type VariableKey = keyof Variables;

class UserRealmStore {
    public realm?: Realm;
    private static instance: UserRealmStore;

    private constructor() {
        this.openRealm();
    }

    static getInstance(): UserRealmStore {
        if (!UserRealmStore.instance) {
            UserRealmStore.instance = new UserRealmStore();
        }
        return UserRealmStore.instance;
    }

    public async openRealm(): Promise<Realm | null> {
        return new Promise((resolve, reject) => {
            if (this.realm) {
                resolve(this.realm);
            } else {
                // Delete realm file
                if (appConfig.deleteRealmFilesBeforeOpen) {
                    Realm.deleteFile(userRealmConfig);
                }

                // Open realm file
                Realm.open(userRealmConfig)
                .then(realm => {
                    this.realm = realm;
                    resolve(realm);
                })
                .catch(error => {
                    resolve(null);
                });
            }
        });
    }

    public getCurrentChild = () => {
        return this.realm?.objects<ChildEntity>(ChildEntitySchema.name).find((record, index, collection) => index === 0);
    }

    public async setVariable<T extends VariableKey>(key: T, value: Variables[T] | null): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this.realm) {
                reject();
                return;
            }

            try {
                const allVariables = this.realm.objects<VariableEntity>(VariableEntitySchema.name);
                const variablesWithKey = allVariables.filtered(`key == "${key}"`);
                const keyAlreadyExists = variablesWithKey && variablesWithKey.length > 0 ? true : false;

                if (keyAlreadyExists) {
                    this.realm.write(() => {
                        variablesWithKey[0].value = JSON.stringify(value);
                        variablesWithKey[0].updatedAt = new Date();
                        resolve(true);
                    });
                }

                if (!keyAlreadyExists) {
                    this.realm.write(() => {
                        this.realm?.create<VariableEntity>(VariableEntitySchema.name, {
                            key: key,
                            value: JSON.stringify(value),
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        });
                        resolve(true);
                    });
                }
            } catch (e) {
                reject();
            }
        });
    }

    public getVariable<T extends VariableKey>(key: T): Variables[T] | null {
        if (!this.realm) return null;

        try {
            const allVariables = this.realm.objects<VariableEntity>(VariableEntitySchema.name);
            const variablesWithKey = allVariables.filtered(`key == "${key}"`);
    
            if (variablesWithKey && variablesWithKey.length > 0) {
                const record = variablesWithKey.find(obj => obj.key === key);
    
                if (record) {
                    return JSON.parse(record.value);
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch(e) {
            return null;
        }
    }

    public async deleteVariable<T extends VariableKey>(key:T): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.realm) {
                reject();
                return;
            }

            try {
                const allVariables = this.realm.objects<VariableEntity>(VariableEntitySchema.name);
                const variablesWithKey = allVariables.filtered(`key == "${key}"`);
        
                if (variablesWithKey && variablesWithKey.length > 0) {
                    const record = variablesWithKey.find(obj => obj.key === key);
                    
                    this.realm.write(() => {
                        this.realm?.delete(record);
                        resolve();
                    });
                } else {
                    reject();
                }
            } catch(e) {
                reject();
            }
        });
    }

    public async create<Entity>(entitySchema:ObjectSchema, record:Entity): Promise<Entity> {
        return new Promise((resolve, reject) => {
            if (!this.realm) {
                reject();
                return;
            }

            try {
                this.realm.write(() => {
                    this.realm?.create<Entity>(entitySchema.name, record);
                    resolve(record);
                });
            } catch (e) {
                reject();
            }
        });
    }

    public async delete(record:any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.realm) {
                reject();
                return;
            }

            try {
                this.realm.write(() => {
                    this.realm?.delete(record);
                    resolve();
                });
            } catch (e) {
                reject();
            }
        });
    }

    public async deleteAll(entitySchema:ObjectSchema): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.realm) {
                reject();
                return;
            }

            try {
                const allRecords = this.realm?.objects(entitySchema.name);
    
                this.realm?.write(() => {
                    this.realm?.delete(allRecords);
                    resolve();
                });
            } catch(e) {
                reject(e);
            }
        });
    }
}

export const userRealmStore = UserRealmStore.getInstance();