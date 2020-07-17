import Realm, { ObjectSchema } from 'realm';
import { dataRealmConfig } from "./dataRealmConfig";
import { VariableEntity, VariableEntitySchema } from './VariableEntity';
import { appConfig } from '../app/appConfig';
import { VocabulariesAndTermsResponse, TermChildren, BasicPagesResponse } from './apiStore';
import { ListCardItem } from '../screens/home/ListCard';
import { ContentEntity } from '.';
import { ContentEntitySchema } from './ContentEntity';
import { translate } from '../translations/translate';
import { DateTime } from "luxon";
import { userRealmStore } from './userRealmStore';
import { BasicPageEntity, BasicPagesEntitySchema } from './BasicPageEntity';
import { MilestoneEntity, MilestoneEntitySchema } from './MilestoneEntity';
import { translateData, TranslateDataDevelopmentPeriods } from '../translationsData/translateData';
import { MilestoneItem } from '../components/development/MilestoneForm';
import { DailyMessageVariable } from '../app/homeMessages';

export type Variables = {
    'userEmail': string;
    'userName': string;
    "loginMethod": "facebook" | "google" | "cms";
    'userIsLoggedIn': boolean;
    'userIsOnboarded': boolean;
    'userEnteredChildData': boolean;
    'userParentalRole': 'mother' | 'father';
    'followGrowth': boolean;
    'followDevelopment': boolean;
    'followDoctorVisits': boolean;
    'notificationsApp': boolean;
    'notificationsEmail': boolean;
    'allowAnonymousUsage': boolean;
    'languageCode': string;
    'countryCode': string;
    'lastSyncTimestamp': number;
    'randomNumber': number;
    'vocabulariesAndTerms': VocabulariesAndTermsResponse;
    'dailyMessage': DailyMessageVariable;
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

    public getBasicPage(id: 4516 | 4836) {
        const basicPageVariable = this.realm?.objects<BasicPageEntity>(BasicPagesEntitySchema.name);
        return basicPageVariable?.filtered(`id == ${id}`).find(item => item);
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
                // console.log(variablesWithKey, 'varaibles with key')
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
                if (appConfig.showLog) console.log(e);
                reject();
            }
        });
    };
    
    /*
    *   Return all milestones for given age tag
    */
    public getMilestonesFromChildAge(ageTagId: number) {
        try {
            const allRecords = this.realm?.objects<MilestoneEntity>(MilestoneEntitySchema.name);
            return allRecords?.filter((value) => value.predefined_tags.indexOf(ageTagId) !== -1);
        } catch (e) {
            if (appConfig.showLog) {
                console.log(e);
            };
            return undefined;
        };
    };

    public getDevelopmentPeriods(): DevelopmentPeriodsType[] {
        let developmentPeriods: DevelopmentPeriodsType[] = [];

        const allPeriods = translateData("developmentPeriods") as (TranslateDataDevelopmentPeriods | null);

        const childAge = userRealmStore.getCurrentChild()?.birthDate;
        let childAgeMonths = DateTime.local().diff(DateTime.fromJSDate(childAge ? childAge : new Date()), "months",).months;

        const childAgeTagId = this.getTagIdFromChildAge(parseInt(childAgeMonths.toString()) + 1);
        const childGender = userRealmStore.getChildGender();

        if (allPeriods) {
            // if user didn't set age return all periods
            if (childAgeTagId === undefined || childAgeTagId === null) {
                developmentPeriods = allPeriods.map((period: any): DevelopmentPeriodsType => {
                    return {
                        body: period.description,
                        title: period.name,
                        subtilte: period.subtitle,
                        finished: undefined,
                        warningText: period.warningText,
                        currentPeriod: false,
                        relatedArticleId: childGender === 'boy' ?
                            period.moreAboutPeriodArticleIdMale :
                            period.moreAboutPeriodArticleIdFemale,
                    };
                });
            } else {
                // if user set age return periods up to current age + featured period
                developmentPeriods = allPeriods
                    .filter(period => period.predefinedTagId <= childAgeTagId)
                    .map((period: any): DevelopmentPeriodsType => {
                        let allMilestones = this.getMilestonesFromChildAge(period.predefinedTagId);
                        let checkedMilesteones: number[] = userRealmStore.getVariable('checkedMilestones');
                        
                        let completed = true;
                        let currentPeriod = false;

                        // check for current period 
                        if (period.predefinedTagId === childAgeTagId) {
                            currentPeriod = true
                        } else {
                            currentPeriod = false;
                        };

                        // Check is period milestones completed 
                        allMilestones?.forEach(item => {
                            let checkedMilesteone = checkedMilesteones?.find(id => item.id === id);

                            if (checkedMilesteone === undefined) {
                                completed = false
                            };
                        });

                        return {
                            body: period.description,
                            title: period.name,
                            subtilte: period.subtitle,
                            finished: completed,
                            childAgeTagId: period.predefinedTagId,
                            warningText: period.warningText,
                            currentPeriod: currentPeriod,
                            relatedArticleId: childGender === 'boy' ?
                                period.moreAboutPeriodArticleIdMale :
                                period.moreAboutPeriodArticleIdFemale,
                        };
                    });

                // Get first next period and return for featuredPeriod
                let featurePeriod = allPeriods?.filter(childAgeTag => childAgeTag.predefinedTagId > childAgeTagId);

                featurePeriod.forEach(item => {
                    if (featurePeriod) {
                        developmentPeriods.push({
                            body: item.description,
                            title: item.name,
                            subtilte: item.subtitle,
                            finished: undefined,
                            childAgeTagId: item.predefinedTagId,
                            currentPeriod: false,
                            relatedArticleId: childGender === 'boy' ?
                                item.moreAboutPeriodArticleIdMale :
                                item.moreAboutPeriodArticleIdFemale,
                        });
                    };
                })
               
            };
        };

        return developmentPeriods;
    };
    
    public getMilestonesForGivenPeriod(ageId: number): { checkedMilestones: MilestoneItem[], uncheckedMilestones: MilestoneItem[] } {
        let milestones: {
            checkedMilestones: MilestoneItem[],
            uncheckedMilestones: MilestoneItem[],
        };

        milestones = {
            checkedMilestones: [],
            uncheckedMilestones: [],
        };

        let allMilestones = this.getMilestonesFromChildAge(ageId);
        let checkedItems: number[] = userRealmStore.getVariable('checkedMilestones');

        if (allMilestones) {
            allMilestones.forEach(milestone => {
                // true if item exist in checked item array
                let item = checkedItems?.find(id => id === milestone.id)

                // if item exist, update checkedMilestones else udpate unchecked milestones => Important for split screen logic 
                if (item) {
                    milestones.checkedMilestones.push({
                        checked: true,
                        html: milestone.body,
                        id: milestone.id,
                        title: milestone.title,
                        relatedArticles: milestone.related_articles,
                    });
                } else {
                    milestones.uncheckedMilestones.push({
                        checked: false,
                        html: milestone.body,
                        relatedArticles: milestone.related_articles,
                        id: milestone.id,
                        title: milestone.title
                    });
                };
            });
        };

        return milestones;
    };

    public getContentFromId(id: number) {
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




    public getTagIdFromChildAge = (months: number): number => {
        let id = 58;
        if (months === 1 || months === 0) {
            id = 43;
        }
        if (months === 2) {
            id = 44;
        }
        if (months === 3 || months === 4) {
            id = 45;
        }
        if (months === 5 || months === 6) {
            id = 46;
        }
        if (months >= 7 && months <= 9) {
            id = 47;
        }
        if (months >= 10 && months <= 12) {
            id = 48;
        }
        if (months >= 13 && months <= 18) {
            id = 49;
        }
        if (months >= 19 && months <= 24) {
            id = 50;
        }
        if (months >= 25 && months <= 36) {
            id = 51;
        }
        if (months >= 37 && months <= 48) {
            id = 52;
        }
        // if (months >= 15 && months <= 26) {
        //     id = 53;
        // }
        if (months >= 49 && months <= 60) {
            id = 57;
        }
        if (months >= 61) {
            id = 58;
        }
        return id
    }

    public getChildAgeTagWithArticles = (categoryId: number | null = null, returnNext: boolean = false): { id: number, name: string } | null => {
        let obj: { id: number, name: string } | null = {
            id: 0,
            name: ""
        };

        const birthday = userRealmStore.getCurrentChild()?.birthDate;
        const timeNow = DateTime.local();

        if (birthday === null || birthday === undefined) {
            obj = null;
        } else {
            // calculate months and get id
            let date = DateTime.fromJSDate(birthday);
            let monthsDiff = timeNow.diff(date, "month").toObject();
            let months: number = 0;

            if (monthsDiff.months) {
                months = Math.round(monthsDiff.months);
            };

            let id = this.getTagIdFromChildAge(months);
            const vocabulariesAndTermsResponse = this.getVariable('vocabulariesAndTerms');

            if (returnNext) {
                const allContent = this.realm?.objects<ContentEntity>(ContentEntitySchema.name);
                const filteredRecords = allContent?.filtered(`category == ${categoryId} AND type == 'article'`);

                let tagsBefore: { id: number, name: string }[] = [];
                let tagsAfter: { id: number, name: string }[] = [];

                // get all tags from our main tag and sort 
                vocabulariesAndTermsResponse?.predefined_tags.forEach(item => {
                    item.children.forEach(i => {
                        if (i.id <= 58 && i.id >= 43) {
                            if (i.id < id) {
                                tagsAfter.push({ id: i.id, name: i.name });
                            } else {
                                tagsBefore.push({ id: i.id, name: i.name });
                            };
                        };
                    });
                });

                tagsBefore = tagsBefore.sort((a, b) => a.id - b.id);
                tagsAfter = tagsAfter.sort((a, b) => b.id - a.id);

                let mergedTags = tagsBefore.concat(tagsAfter);

                for (let i = 0; i < mergedTags.length; i++) {
                    let check = false;

                    filteredRecords?.forEach((record, index, collection) => {
                        record.predefinedTags.forEach(tag => {
                            if (tag === mergedTags[i].id && record.predefinedTags.length !== 0) {
                                obj = { id: tag, name: mergedTags[i].name }
                                check = true;
                            };
                        });
                    });

                    if (check) {
                        break;
                    };
                };
            } else {
                let name = "";
                vocabulariesAndTermsResponse?.predefined_tags.forEach(item => {
                    item.children.forEach(i => {
                        if (i.id === id) {
                            name = i.name
                        }
                    })
                })

                obj = { id: id, name: name };
            };
        };

        return obj;
    }

    public getChildAgeTags(removeAllAgesTag: boolean = false) {
        let childAgeTags: TermChildren[] = [];

        const vocabulariesAndTerms = dataRealmStore.getVariable('vocabulariesAndTerms');
        const childAgeTagsGroup = vocabulariesAndTerms?.predefined_tags.find((value) => {
            return value.id === 42;
        });
        if (childAgeTagsGroup && childAgeTagsGroup.children && Array.isArray(childAgeTagsGroup.children)) {
            childAgeTags = childAgeTagsGroup.children;
        }

        if (removeAllAgesTag) {
            childAgeTags = childAgeTags.filter((value) => {
                return value.id !== 446;
            });
        }

        return childAgeTags;
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

    private findSearchedKeywords(keywords: string, searchValue: string): boolean {
        let isInclude = false;
        if (keywords.toLowerCase().includes(searchValue.toLowerCase())) {
            isInclude = true
        }

        return isInclude;
    };

    private findSearchedPredefinedTags(keywords: string, searchValue: string): boolean {
        let isInclude = false;
        if (keywords.toLowerCase().includes(searchValue.toLowerCase())) {
            isInclude = true
        }

        return isInclude;
    };


}

export type FaqScreenDataResponse = FaqScreenArticlesResponseItem[];

export type FaqScreenArticlesResponseItem = {
    title: string;
    tagType: TagType;
    items: ListCardItem[];
};

export type DevelopmentPeriodsType = {
    finished?: boolean,
    title: string,
    subtilte: string,
    body: string,
    childAgeTagId?: number,
    currentPeriod: boolean,
    warningText?: string,
    relatedArticleId: number,
}

export enum TagType {
    category = 'category',
    predefinedTag = 'predefinedTag',
    keyword = 'keyword',
};

type SearchResultsScreenDataCategoryArticles = { categoryId: number, categoryName: string, contentItems: ContentEntity[] };

export type SearchResultsScreenDataResponse = {
    articles?: SearchResultsScreenDataCategoryArticles[];
    faqs?: ContentEntity[];
};

export const dataRealmStore = DataRealmStore.getInstance();