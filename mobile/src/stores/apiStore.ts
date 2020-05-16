import { appConfig } from "../app/appConfig";
import { localize } from "../app";
import { ContentEntity, ContentEntityType } from "./ContentEntity";
import axios, { AxiosResponse } from 'axios';
import RNFS from 'react-native-fs';

/**
 * Communication with API.
 */
class ApiStore {
    private static instance: ApiStore;

    private constructor() { }

    static getInstance(): ApiStore {
        if (!ApiStore.instance) {
            ApiStore.instance = new ApiStore();
        }
        return ApiStore.instance;
    }

    public async getContent(args: GetContentArgs): Promise<ContentResponse> {
        // URL
        const language = localize.getLanguage();
        const contentType: string = args.type;
        let url = `${appConfig.apiUrl}/list-content/${language}/${contentType}`;

        // URL params
        const urlParams: any = {};

        urlParams.page = args.page !== undefined ? args.page : 0;
        urlParams.numberOfItems = args.numberOfItems !== undefined ? args.numberOfItems : 10;
        if (args.updatedFromDate !== undefined) {
            urlParams.updatedFromDate = args.updatedFromDate;
        }

        // Get API response
        let response: ContentResponse = {total:0, data:[]};

        try {
            if (appConfig.showLog) {
                console.log('apiStore.getContent(): ', args);
            }

            let axiosResponse: AxiosResponse = await axios({
                // API: https://bit.ly/2ZatNfQ
                url: url,
                params: urlParams,
                method: 'GET',
                responseType: 'json',
                timeout: appConfig.apiTimeout, // milliseconds
                maxContentLength: 100000, // bytes
            });

            let rawResponseJson = axiosResponse.data;

            if (rawResponseJson) {
                response.total = rawResponseJson.total;
                response.data = rawResponseJson.data.map((rawContent:any): ContentEntity => {
                    return {
                        id: parseInt(rawContent.id),
                        body: rawContent.body,
                        type: rawContent.type,
                        langcode: rawContent.langcode,
                        title: rawContent.title,
                        category: parseInt(rawContent.category),
                        predefinedTags: rawContent.predefined_tags.map((value:any) => parseInt(value)),
                        keywords: rawContent.keywords.map((value:any) => parseInt(value)),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        coverImageUrl: rawContent.cover_image?.url,
                        coverImageAlt: rawContent.cover_image?.alt,
                    };
                });
            }
        } catch (rejectError) { }

        return response;
    }

    public async getAllContent(contentType:ContentEntityType, updatedFromDate:number|undefined = undefined): Promise<ContentResponse> {
        const numberOfItems = appConfig.apiNumberOfItems;

        // Make first request
        let finalContentResponse = await this.getContent({
            type: contentType,
            page: 0,
            numberOfItems: numberOfItems,
            updatedFromDate: updatedFromDate,
        });

        // If all items are returned in first request
        if (finalContentResponse.total <= numberOfItems) {
            if (appConfig.showLog) {
                console.log(`apiStore.getAllContent(): contentType=${contentType}, updatedFromDate=${updatedFromDate}, total: ${finalContentResponse.total}, data length: ${finalContentResponse.data?.length}`, );
            }

            return finalContentResponse;
        }

        // Make other requests
        let promises: Promise<any>[] = [];

        for (let page=1; page<Math.ceil(finalContentResponse.total/numberOfItems); page++) {
            promises.push( this.getContent({
                type: contentType,
                page: page,
                numberOfItems: numberOfItems,
                updatedFromDate: updatedFromDate,
            }) );
        }

        let allResponses = await Promise.all<ContentResponse>(promises);

        // Combine all responses
        allResponses.forEach((contentResponse) => {
            finalContentResponse.data = finalContentResponse.data.concat(contentResponse.data);
        });

        if (appConfig.showLog) {
            console.log(`apiStore.getAllContent(): contentType=${contentType}, updatedFromDate=${updatedFromDate}, total: ${finalContentResponse.total}, data length: ${finalContentResponse.data?.length}`, );
        }

        return finalContentResponse;
    }

    private getVocabularies(): Vocabulary[] {
        return ['categories', 'keywords', 'predefined_tags'];
    }

    public async getVocabulariesAndTerms(): Promise<VocabulariesAndTermsResponse> {
        const language = localize.getLanguage();
        let vocabularies = this.getVocabularies();

        let response: VocabulariesAndTermsResponse = {
            categories: [],
            keywords: [],
            predefined_tags: [],
        };

        const objectToArray = (obj:any) => {
            const rval: any = [];

            for (let id in obj) {
                let value = obj[id];
                let children = value.children;
                
                if (!Array.isArray(children)) {
                    children = objectToArray(children);
                }
                
                rval.push({
                    id: parseInt(id),
                    name: value.name,
                    children: children,
                });
            }

            return rval;
        };

        for (let index in vocabularies) {
            let vocabulary = vocabularies[index];
            let url = `${appConfig.apiUrl}/list-taxonomy/${language}/${vocabulary}`;

            try {
                let axiosResponse: AxiosResponse = await axios({
                    // API: https://bit.ly/2ZatNfQ
                    url: url,
                    method: 'GET',
                    responseType: 'json',
                    timeout: appConfig.apiTimeout, // milliseconds
                    maxContentLength: 100000, // bytes
                });

                // Transform response
                if (axiosResponse.data?.data) {
                    response[vocabulary] = objectToArray(axiosResponse.data.data);
                }
            } catch (rejectError) { }
        }

        return response;
    }

    public async downloadImage(args: DownloadImageArgs): Promise<boolean> {
        let rval: boolean = false;

        try {
            // Create dest folder if it doesn't exist
            if (!(await RNFS.exists(args.destFolder))) {
                await RNFS.mkdir(args.destFolder);
            }

            // Download image
            let {jobId, promise:downloadPromise} = RNFS.downloadFile({
                fromUrl: args.srcUrl,
                toFile: args.destFolder + `/${args.destFilename}`,
            });

            let downloadResult = await downloadPromise;

            if (downloadResult.statusCode === 200) {
                rval = true;

                if (appConfig.showLog) {
                    console.log(`apiStore.downloadImage(): ${args.srcUrl}`, );
                }
            }
        } catch(rejectError) {}

        return rval;
    }

    public async downloadImages(args: DownloadImageArgs[]): Promise<boolean[]> {
        const promises: Promise<boolean>[] = [];

        args.forEach((downloadImageArgs) => {
            promises.push( this.downloadImage(downloadImageArgs) );
        });

        let allResponses = await Promise.all<boolean>(promises);

        return allResponses;
    }
}

interface GetContentArgs {
    type: ContentEntityType;

    /**
     * Defaults to 10
     */
    numberOfItems?: number;

    /**
     * Defaults to 0
     */
    page?: number;

    /**
     * UNIX timestamp
     */
    updatedFromDate?: number;
}

interface ContentResponse {
    total: number;
    data: ContentEntity[];
}

type Vocabulary = 'categories' | 'keywords' | 'predefined_tags';

type TermChildren = {
    id: number;
    name: string;
    children: TermChildren[];
};

export type VocabulariesAndTermsResponse  = {
    [key in Vocabulary]: {
        id: number;
        name: string;
        children: TermChildren[];
    }[];
};

export type DownloadImageArgs = {
    srcUrl: string;
    destFolder: string;
    destFilename: string;
};

export const apiStore = ApiStore.getInstance();