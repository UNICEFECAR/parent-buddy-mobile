import Realm from 'realm';
import { dataRealmConfig } from "./dataRealmConfig";
import { VariableEntity, VariableEntitySchema } from './VariableEntity';

type Variables = {
    'userIsLoggedIn': boolean;
    'userIsOnboarded': boolean;
    'userEnteredChildData': boolean;
    'userEnteredHisData': boolean;
    'userEmail': string;
    'userLoggedInDate': Date;
};

type VariableKey = keyof Variables;

class DataRealmStore {
    public realm?: Realm;
    private static instance: DataRealmStore;

    private value: any;

    private constructor() {
        this.openRealm();
    }

    static getInstance(): DataRealmStore {
        if (!DataRealmStore.instance) {
            DataRealmStore.instance = new DataRealmStore();
        }
        return DataRealmStore.instance;
    }

    private openRealm() {
        Realm.open(dataRealmConfig)
            .then(realm => {
                this.realm = realm;
            })
            .catch(error => {
                // console.warn(error);
            });
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
}

export const dataRealmStore = DataRealmStore.getInstance();