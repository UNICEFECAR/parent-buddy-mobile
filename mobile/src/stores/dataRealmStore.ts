import Realm, { ObjectSchema } from 'realm';
import { dataRealmConfig } from "./dataRealmConfig";
import { VariableEntity, VariableEntitySchema } from './VariableEntity';
import { appConfig } from '../app/appConfig';
import { VocabulariesAndTermsResponse, TermChildren } from './apiStore';
import { ListCardItem } from '../screens/home/ListCard';
import { ContentEntity } from '.';
import { ContentEntitySchema } from './ContentEntity';
import { translate } from '../translations/translate';

type Variables = {
    'userEmail': string;
    'userName': string;
    'userIsLoggedIn': boolean;
    'userIsOnboarded': boolean;
    'userEnteredChildData': boolean;
    'userParentalRole': 'mother' | 'father';
    'followGrowth': boolean;
    'followDevelopment': boolean;
    'followDoctorVisits': boolean;
    'allowAnonymousUsage': boolean;
    'languageCode': string;
    'countryCode': string;
    'lastSyncTimestamp': number;
    'vocabulariesAndTerms': VocabulariesAndTermsResponse;
};

type VariableKey = keyof Variables;

class DataRealmStore {
    public realm?: Realm;
    private static instance: DataRealmStore;

    private constructor() {
        this.openRealm();
    }

    static getInstance(): DataRealmStore {
        if (!DataRealmStore.instance) {
            DataRealmStore.instance = new DataRealmStore();
        }
        return DataRealmStore.instance;
    }

    public async openRealm(): Promise<Realm | null> {
        return new Promise((resolve, reject) => {
            if (this.realm) {
                resolve(this.realm);
            } else {
                // Delete realm file
                if (appConfig.deleteRealmFilesBeforeOpen) {
                    Realm.deleteFile(dataRealmConfig);
                }

                // Open realm file
                Realm.open(dataRealmConfig)
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
        } catch (e) {
            return null;
        }
    }

    public async deleteVariable<T extends VariableKey>(key: T): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.realm) {
                resolve();
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
                    resolve();
                }
            } catch (e) {
                resolve();
            }
        });
    }

    /**
     * Create new record or update existing one.
     * 
     * ### WARNING
     * 
     * - You must give primary key in record, or return promise will reject
     * - entitySchema must have primaryKey defined, or return promise will reject
     */
    public async createOrUpdate<Entity>(entitySchema: ObjectSchema, record: Entity): Promise<Entity> {
        return new Promise((resolve, reject) => {
            if (!this.realm || !entitySchema.primaryKey) {
                reject();
                return;
            }

            try {
                this.realm.write(() => {
                    this.realm?.create<Entity>(entitySchema.name, record, true);
                    resolve(record);
                });
            } catch (e) {
                reject();
            }
        });
    }

    public getContentFromId(id:number) {
        console.log(id);
        try {
            const allRecords = this.realm?.objects<ContentEntity>(ContentEntitySchema.name);
            return allRecords?.find((value) => {
                return value.id === id;
            });
        } catch (e) {
            console.log(e);
            return undefined;
        }
    }

    public getCategoryNameFromId(categoryId: number): string | null {
        const vocabulariesAndTerms = this.getVariable('vocabulariesAndTerms');
        if (!vocabulariesAndTerms) return null;

        let rval = '';
        vocabulariesAndTerms.categories.forEach((categoryObject) => {
            if (categoryObject.id === categoryId) {
                rval = categoryObject.name;
            }
        });

        return rval;
    }

    public getFaqScreenData(): FaqScreenDataResponse {
        const rval: FaqScreenDataResponse = [];
        const vocabulariesAndTerms = this.getVariable('vocabulariesAndTerms');

        // Main categories
        if (vocabulariesAndTerms?.categories) {
            const faqSection: FaqScreenArticlesResponseItem = {
                title: translate('faqYourChild'),
                tagType: TagType.category,
                items: vocabulariesAndTerms.categories.map((value) => {
                    return {
                        id: value.id,
                        type: 'faq',
                        title: value.name,
                    } as ListCardItem;
                }),
            };

            rval.push(faqSection);
        }

        // Per age tags
        if (vocabulariesAndTerms?.predefined_tags) {
            let childAgeTags: TermChildren[] | null = null;

            vocabulariesAndTerms.predefined_tags.forEach((value) => {
                if (value.id === 42) {
                    childAgeTags = value.children;

                    // Remove "All ages": 446
                    childAgeTags = childAgeTags.filter((value) => {
                        if (value.id === 446) return false;
                            else return true;
                    });
                }
            });

            if (childAgeTags) {
                const faqSection: FaqScreenArticlesResponseItem = {
                    title: translate('faqPerAge'),
                    tagType: TagType.predefinedTag,
                    items: (childAgeTags as TermChildren[]).map((value) => {
                        return {
                            id: value.id,
                            type: 'faq',
                            title: value.name,
                        } as ListCardItem;
                    }),
                };

                rval.push(faqSection);
            }
        }

        return rval;
    }

    public getFaqCategoryScreenData(tagType: TagType, tagId: number): ListCardItem[] {
        let rval: ListCardItem[] = [];

        // category
        if (tagType === TagType.category) {
            const allContent = this.realm?.objects<ContentEntity>(ContentEntitySchema.name);
            const filteredRecords = allContent?.filtered(`type == 'faq' AND category == ${tagId}`);

            if (filteredRecords) {
                rval = filteredRecords.map((contentEntity): ListCardItem => {
                    return {
                        id: contentEntity.id,
                        title: contentEntity.title,
                        type: 'faq',
                        bodyHtml: contentEntity.body,
                    };
                });
            }
        }

        // predefinedTag
        if (tagType === TagType.predefinedTag) {
            const allContent = this.realm?.objects<ContentEntity>(ContentEntitySchema.name);
            const filteredRecords = allContent?.filtered(`type == 'faq'`);

            if (filteredRecords) {
                rval = filteredRecords.filter((contentEntity) => {
                    return contentEntity.predefinedTags.indexOf(tagId) !== -1;
                }).map((contentEntity): ListCardItem => {
                    return {
                        id: contentEntity.id,
                        title: contentEntity.title,
                        type: 'faq',
                        bodyHtml: contentEntity.body,
                    };
                });
            }
        }

        return rval;
    }

    public getSearchResultsScreenData(searchTerm: string): SearchResultsScreenDataResponse {
        const rval: SearchResultsScreenDataResponse = {
            articles: [],
            faqs: [],
        };

        // Get vocabulariesAndTerms
        const vocabulariesAndTerms = this.getVariable('vocabulariesAndTerms');

        // Get relevantArticles
        const relevantArticles: ContentEntity[] = [];

        try {
            const allRecords = this.realm?.objects<ContentEntity>(ContentEntitySchema.name);
            const filteredRecords = allRecords?.filtered(`type == 'article' AND (body CONTAINS[c] '${searchTerm}' OR title CONTAINS[c] '${searchTerm}')`);
    
            filteredRecords?.forEach((record, index, collection) => {
                relevantArticles.push(record);
            });
        } catch (e) {
            console.log(e);
        }

        // Set categorizedArticles
        const categorizedArticles: SearchResultsScreenDataCategoryArticles[] = [];

        vocabulariesAndTerms?.categories.forEach((category) => {
            const currentCategorizedArticles: SearchResultsScreenDataCategoryArticles = {
                categoryId: category.id,
                categoryName: category.name,
                contentItems: [],
            };

            relevantArticles.forEach((article) => {
                if (article.category === category.id) {
                    currentCategorizedArticles.contentItems.push(article);
                }
            });

            if (currentCategorizedArticles.contentItems.length > 0) {
                categorizedArticles.push(currentCategorizedArticles);
            }
        });

        // Set faqs
        const faqs: ContentEntity[] = [];

        try {
            const allRecords = this.realm?.objects<ContentEntity>(ContentEntitySchema.name);
            const filteredRecords = allRecords?.filtered(`type == 'faq' AND (body CONTAINS[c] '${searchTerm}' OR title CONTAINS[c] '${searchTerm}')`);
    
            filteredRecords?.forEach((record, index, collection) => {
                faqs.push(record);
            });
        } catch (e) {
            console.log(e);
        }

        // Response
        rval.articles = categorizedArticles;
        rval.faqs = faqs;

        return rval;
    }
}

export type FaqScreenDataResponse = FaqScreenArticlesResponseItem[];

export type FaqScreenArticlesResponseItem = {
    title: string;
    tagType: TagType;
    items: ListCardItem[];
};

export enum TagType {
    category = 'category',
    predefinedTag = 'predefinedTag',
    keyword = 'keyword',
};

type SearchResultsScreenDataCategoryArticles = {categoryId:number, categoryName:string, contentItems:ContentEntity[]};

export type SearchResultsScreenDataResponse = {
    articles?: SearchResultsScreenDataCategoryArticles [];
    faqs?: ContentEntity[];
};

export const dataRealmStore = DataRealmStore.getInstance();