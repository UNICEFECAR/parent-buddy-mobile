import { dataRealmStore, apiStore } from "../stores";
import { ContentResponse, ApiImageData, BasicPagesResponse, MilestonesResponse } from "../stores/apiStore";
import { ContentEntitySchema, ContentEntity } from "../stores/ContentEntity";
import { appConfig } from "./appConfig";
import { content } from "./content";
import { navigation } from "../app/Navigators";
import { BasicPageEntity, BasicPagesEntitySchema } from "../stores/BasicPageEntity";
import { MilestoneEntity, MilestoneEntitySchema } from "../stores/MilestoneEntity";

/**
 * Sync data between API and realm.
 */
class SyncData {
    private static instance: SyncData;

    private constructor() { }

    static getInstance(): SyncData {
        if (!SyncData.instance) {
            SyncData.instance = new SyncData();
        }
        return SyncData.instance;
    }

    public async sync(): Promise<boolean> {
        let rval = false;
        const lastSyncTimestamp = dataRealmStore.getVariable('lastSyncTimestamp');

        // DOWNLOAD VOCABULARIES AND TERMS
        const vocabulariesAndTerms = await apiStore.getVocabulariesAndTerms();

        if (vocabulariesAndTerms?.categories && vocabulariesAndTerms.categories.length > 0) {
            await dataRealmStore.setVariable('vocabulariesAndTerms', vocabulariesAndTerms);

            if (appConfig.showLog) {
                console.log('syncData.sync(): Saved vocabularies and terms');
            }
        }

        // DOWNLOAD DEVELOPMENT MILESTONES 
        let allMilestones: MilestonesResponse = {total: 0, data: []}

        try{
            if(lastSyncTimestamp){
                allMilestones = await apiStore.getAllMilestones(lastSyncTimestamp)
            }else{
                allMilestones = await apiStore.getAllMilestones();
            }
        } catch (e){};

        // Save milestones
        if(allMilestones?.data && allMilestones.data.length > 0){
            const milestonesCreateOrUpdate: Promise<MilestoneEntity>[] = [];

            allMilestones.data.forEach((value) => {
                milestonesCreateOrUpdate.push(dataRealmStore.createOrUpdate(MilestoneEntitySchema, value))
            });

            try {
                await Promise.all(milestonesCreateOrUpdate);

                if (appConfig.showLog) {
                    console.log('syncData.sync(): Saved all milestones');
                };
            } catch (e) { };
        };

        // DOWNLOAD ALL CONTENT
        let allContent: ContentResponse = { total: 0, data: [] };

        try {
            if (lastSyncTimestamp) {
                allContent = await apiStore.getAllContent(undefined, lastSyncTimestamp);
            } else {
                allContent = await apiStore.getAllContent();
            };
        } catch (e) { };

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
                };
            } catch (e) { };
        }

        // DOWNLOAD BASIC PAGES 
        const basicPages = await apiStore.getBasicPages();

        // save basic pages 
        if (basicPages?.data && basicPages.data.length > 0) {
            const basicPageCreateOrUpdate: Promise<BasicPageEntity>[] = [];
            
            basicPages.data.forEach((value) => {
                basicPageCreateOrUpdate.push(dataRealmStore.createOrUpdate(BasicPagesEntitySchema, value));
            });

            try {
                await Promise.all(basicPageCreateOrUpdate);
                if (appConfig.showLog) {
                    console.log('syncData.sync(): Saved basic pages');
                };
            } catch (e){};
        };


        // DOWNLOAD COVER IMAGES
        if (allContent?.data && allContent.data.length > 0) {
            const apiImagesData: ApiImageData[] = [];

            allContent.data.forEach((contentEntity) => {
                const coverImageData = content.getCoverImageData(contentEntity);

                if (coverImageData) {
                    apiImagesData.push(coverImageData);
                }
            });

            const imagesDownloadResult = await apiStore.downloadImages(apiImagesData);

            if (appConfig.showLog) {
                // console.log('Images download results');
                // console.log( JSON.stringify(imagesDownloadResult, null, 4) );
            }
        }

        // UPDATE lastSyncTimestamp
        if (allContent.total > 0 && allContent.data.length === allContent.total) {
            dataRealmStore.setVariable('lastSyncTimestamp', Math.round(Date.now() / 1000));

            if (appConfig.showLog) {
                console.log('syncData.sync(): Updated lastSyncTimestamp');
            }
        }

        if (appConfig.showLog) {
            console.log('syncData.sync(): Finished');
        }

        return rval;
    }

    public async syncAndShowSyncingScreen() {
        try {
            navigation.navigate('RootModalStackNavigator_SyncingScreen');
            await syncData.sync();
            navigation.navigate('HomeStackNavigator_HomeScreen');
        } catch (e) {
            navigation.navigate('HomeStackNavigator_HomeScreen');
        }
    }
}

export const syncData = SyncData.getInstance();