import Realm from 'realm';
import { dataRealmConfig } from "./dataRealmConfig";

type Variable = {
    'setting1': boolean;
    'setting2': string;
    'setting3': number;
};

type VariableKey = keyof Variable;

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

    public setVariable<T extends VariableKey>(key: T, value: Variable[T]): void {
        
    }

    public getVariable<T extends VariableKey>(key: T): Variable[T] | null {
        return null;
    }
}

export const dataRealmStore = DataRealmStore.getInstance();