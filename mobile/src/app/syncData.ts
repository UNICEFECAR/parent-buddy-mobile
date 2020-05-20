import { dataRealmStore, apiStore } from "../stores";
import { ContentResponse, ApiImageData } from "../stores/apiStore";
import { ContentEntitySchema, ContentEntity } from "../stores/ContentEntity";
import { appConfig } from "./appConfig";
import { content } from "./content";

/**
 * Sync data between API and realm.
 */
class SyncData {
    private static instance: SyncData;

    private constructor() {}

    static getInstance(): SyncData {
        if (!SyncData.instance) {
            SyncData.instance = new SyncData();
        }
        return SyncData.instance;
    }

    public async sync(): Promise<boolean> {
        let rval = false;
        const lastSyncTimestamp = dataRealmStore.getVariable('lastSyncTimestamp');

        // VOCABULARIES AND TERMS
        const vocabulariesAndTerms = await apiStore.getVocabulariesAndTerms();
        
        if (vocabulariesAndTerms?.categories && vocabulariesAndTerms.categories.length > 0) {
            await dataRealmStore.setVariable('vocabulariesAndTerms', vocabulariesAndTerms);

            if (appConfig.showLog) {
                console.log('syncData.sync(): Saved vocabularies and terms');
            }
        }

        // ALL CONTENT
        let allContent: ContentResponse = {total:0, data:[]};

        try {
            if (lastSyncTimestamp) {
                allContent = await apiStore.getAllContent(undefined, lastSyncTimestamp);
            } else {
                allContent = await apiStore.getAllContent();
            }
        } catch(e) {}

        // Save content
        if (allContent?.data && allContent.data.length > 0) {
            const promisesCreateOrUpdate: Promise<ContentEntity>[] = [];

            allContent.data.forEach((value) => {
                promisesCreateOrUpdate.push( dataRealmStore.createOrUpdate(ContentEntitySchema, value) );
            });

            try {
                await Promise.all(promisesCreateOrUpdate);

                if (appConfig.showLog) {
                    console.log('syncData.sync(): Saved all content');
                }
            } catch(e) {}
        }

        // COVER IMAGES
        if (allContent?.data && allContent.data.length > 0) {
            const apiImagesData: ApiImageData[] = [];

            allContent.data.forEach((contentEntity) => {
                const coverImageData = content.getCoverImageData(contentEntity);
                
                if (coverImageData) {
                    apiImagesData.push(coverImageData);
                }
            });

            await apiStore.downloadImages(apiImagesData);
        }

        // UPDATE lastSyncTimestamp
        if (allContent.total > 0 && allContent.data.length === allContent.total) {
            dataRealmStore.setVariable('lastSyncTimestamp', Math.round(Date.now()/1000));

            if (appConfig.showLog) {
                console.log('syncData.sync(): Updated lastSyncTimestamp');
            }
        }

        return rval;
    }
}

export const syncData = SyncData.getInstance();