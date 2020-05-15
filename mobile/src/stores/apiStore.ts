import { appConfig } from "../app/appConfig";

/**
 * Communication with API.
 */
class ApiStore {
    private static instance: ApiStore;

    private constructor() {}

    static getInstance(): ApiStore {
        if (!ApiStore.instance) {
            ApiStore.instance = new ApiStore();
        }
        return ApiStore.instance;
    }

    public getContent() {
        const url = appConfig.apiUrl + '/list-content/en/article';
    }
}

export const apiStore = ApiStore.getInstance();