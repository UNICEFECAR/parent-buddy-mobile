class DataRealmStore {
    private static instance: DataRealmStore;

    private constructor() {}

    static getInstance(): DataRealmStore {
        if (!DataRealmStore.instance) {
            DataRealmStore.instance = new DataRealmStore();
        }
        return DataRealmStore.instance;
    }
}

export const dataRealmStore = DataRealmStore.getInstance();