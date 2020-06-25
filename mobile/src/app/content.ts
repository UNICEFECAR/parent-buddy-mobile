import { ContentEntity, ContentEntitySchema } from "../stores/ContentEntity";
import { ApiImageData, VocabulariesAndTermsResponse, TermChildren } from "../stores/apiStore";
import RNFS from 'react-native-fs';
import { utils } from "./utils";
import { ContentViewEntity } from "../stores/ContentViewEntity";
import { ArticlesSectionData } from "../screens/home/ArticlesSection";
import { translate } from "../translations/translate";
import { dataRealmStore, CategoryArticlesViewEntity, userRealmStore } from "../stores";
import { Platform } from "react-native";
import { translateData } from "../translationsData/translateData";
import { DateTime } from "luxon";
import { isArray, indexOf } from "lodash";
import { Collection } from "realm";
import { JsonFormatter } from "cucumber";
import { ChildGender } from "../stores/ChildEntity";

/**
 * Utility methods related to ContentEntity.
 */
class Content {
    private static instance: Content;

    private constructor() { }

    static getInstance(): Content {
        if (!Content.instance) {
            Content.instance = new Content();
        }
        return Content.instance;
    }

    public getCoverImageData(content: ContentEntity): ApiImageData | null {
        let rval: ApiImageData | null = null;

        if (!content || !content.coverImageUrl) {
            return null;
        }

        const imageExt = utils.getExtensionFromUrl(content.coverImageUrl);

        rval = {
            srcUrl: content.coverImageUrl,
            destFolder: RNFS.DocumentDirectoryPath + '/content',
            destFilename: `cover_image_${content.id}${imageExt ? '.' + imageExt : ''}`
        };

        return rval;
    }

    public getCoverImageFilepath(content: ContentEntity): string | undefined {
        let rval: string | undefined = undefined;
        let coverImageData = this.getCoverImageData(content);

        if (coverImageData) {
            rval = (Platform.OS === 'android' ? 'file://' : '') + `${coverImageData.destFolder}/${coverImageData.destFilename}`;
        }

        return rval;
    }

    public toContentViewEntity(contentEntity: ContentEntity, vocabulariesAndTermsResponse?: VocabulariesAndTermsResponse): ContentViewEntity {
        const contentViewEntity: ContentViewEntity = {
            id: contentEntity.id,
            type: contentEntity.type,
            langcode: contentEntity.langcode,
            title: contentEntity.title,
            body: contentEntity.body,
            coverImageUrl: contentEntity.coverImageUrl,
            coverImageAlt: contentEntity.coverImageAlt,
            updatedAt: contentEntity.updatedAt,

            category: { id: 0, name: '' },
            predefinedTags: [{ id: 0, name: '' }],
            keywords: [{ id: 0, name: '' }],
            coverImageFilepath: '',
        };

        if (!vocabulariesAndTermsResponse) {
            return contentViewEntity;
        }

        // category
        let categoryName: string | null = null;

        vocabulariesAndTermsResponse.categories.forEach((value) => {
            if (value.id === contentEntity.category) {
                categoryName = value.name;
            }
        });

        if (categoryName) {
            contentViewEntity.category = {
                id: contentEntity.id,
                name: categoryName,
            };
        }

        // predefinedTags
        contentViewEntity.predefinedTags = vocabulariesAndTermsResponse.predefined_tags.filter((value) => {
            if (contentEntity.predefinedTags.indexOf(value.id) !== -1) {
                return true;
            } else {
                return false;
            }
        });

        // keywords
        contentViewEntity.keywords = vocabulariesAndTermsResponse.keywords.filter((value) => {
            if (contentEntity.keywords.indexOf(value.id) !== -1) {
                return true;
            } else {
                return false;
            }
        });

        // coverImageFilepath
        const coverImageFilepath = this.getCoverImageFilepath(contentEntity);

        if (coverImageFilepath) {
            contentViewEntity.coverImageFilepath = coverImageFilepath;
        }

        return contentViewEntity;
    }

    public getHomeScreenDevelopmentArticles(realm: Realm | null): ArticlesSectionData {
        let isChildInDevelopmentPeriod = false;

        const rval: ArticlesSectionData = {
            title: translate('developmentArticles'),
            categoryArticles: [],
            featuredArticle: undefined,
        };
        // Set categories
        const vocabulariesAndTermsResponse = dataRealmStore.getVariable('vocabulariesAndTerms');

        if (!vocabulariesAndTermsResponse ||
            !vocabulariesAndTermsResponse.categories ||
            !Array.isArray(vocabulariesAndTermsResponse.categories)) {
            return rval;
        }

        const childBirthDay = userRealmStore.getCurrentChild()?.birthDate;

        if (childBirthDay === undefined || childBirthDay === null) {
            return rval
        } else {
            const dateNow = DateTime.local();
            const diff = dateNow.diff(DateTime.fromJSDate(childBirthDay), ["month", "day"],).toObject();

            // get info is child in development period 
            if (diff.days) {
                if (diff.days >= 0 && diff.days <= 10.9) {
                    isChildInDevelopmentPeriod = true
                } else if (diff.days >= 20 && diff.days <= 30.9) {
                    isChildInDevelopmentPeriod = true
                } else {
                    isChildInDevelopmentPeriod = false
                }
            }

            if (!isChildInDevelopmentPeriod) {
                return rval;
            } else {

                let childAgeTagid = dataRealmStore.getChildAgeTagWithArticles()?.id;
                let childGender: ChildGender | undefined = userRealmStore.getChildGender();
                let oppositeChildGender: ChildGender | undefined = undefined;

                if (childGender) oppositeChildGender = childGender === 'boy' ? 'girl' : 'boy';

                let oppositeChildGenderTagId: number | undefined = undefined;

                if (oppositeChildGender) {
                    oppositeChildGenderTagId = oppositeChildGender === 'boy' ? 40 : 41;
                };

                const featuredArticles = translateData('developmentPeriods');

                if (childAgeTagid && childAgeTagid > 51) {
                    childAgeTagid = 51
                }

                const featuredData = featuredArticles?.find(item => item.predefinedTagId === childAgeTagid);

                const featuredPredefinedTagId = featuredData?.predefinedTagId;
                const featuredArticleId = childGender === "girl" ? featuredData?.moreAboutPeriodArticleIdFemale : featuredData?.moreAboutPeriodArticleIdMale;


                const categories = vocabulariesAndTermsResponse.categories;
                // Set categoryIds
                const categoryIds = [
                    6, // child development
                    5, // child growth
                    8, // vaccination
                    7, // Health Check-ups
                ];

                const allContent = realm?.objects<ContentEntity>(ContentEntitySchema.name);
                const featuredRecord = allContent?.filtered(`id == ${featuredArticleId}`).find(record => record);

                if (featuredRecord !== undefined) {
                    rval.featuredArticle = featuredRecord;
                }

                categoryIds.forEach((categoryId) => {
                    // Set categoryName
                    let thisCategoryArray = categories.filter((category) => {
                        return category.id === categoryId;
                    });

                    let categoryName = '';
                    if (thisCategoryArray && thisCategoryArray.length > 0) {
                        categoryName = thisCategoryArray[0].name;
                    };

                    // Set categoryArticles
                    const categoryArticles: CategoryArticlesViewEntity = {
                        categoryId: categoryId,
                        categoryName: categoryName,
                        articles: []
                    };


                    try {
                        const childAgeTagId = dataRealmStore.getChildAgeTagWithArticles(categoryId, true)?.id;

                        if (childAgeTagId !== undefined) {
                            const filteredRecords = allContent?.
                                filtered(`category == ${categoryId} AND type == 'article'`)
                                .filter(item => item.predefinedTags.indexOf(childAgeTagId) !== -1);

                            filteredRecords?.forEach((record, index, collection) => {
                                if (record.id !== featuredArticleId && oppositeChildGenderTagId && record.predefinedTags.indexOf(oppositeChildGenderTagId) === -1) {
                                    categoryArticles.articles.push(
                                        record
                                    );
                                };
                            });
                        }

                    } catch (e) {
                        console.warn(e);
                    };


                    for (let item in categoryArticles) {
                        categoryArticles.articles = utils.randomizeArray(categoryArticles.articles).slice(0, 5)
                    };


                    if (categoryArticles.articles.length > 0) {
                        rval.categoryArticles?.push(categoryArticles);
                    };

                });

                if (rval.categoryArticles && rval.categoryArticles.length > 0) {
                    rval.vocabulariesAndTermsResponse = vocabulariesAndTermsResponse;
                };
            }

        }
        return rval;
    }


    public getHomeScreenArticles(realm: Realm | null): ArticlesSectionData {
        const rval: ArticlesSectionData = {
            title: translate('noArticles'),
            categoryArticles: [],
        };
        // Set categories
        const vocabulariesAndTermsResponse = dataRealmStore.getVariable('vocabulariesAndTerms');

        if (!vocabulariesAndTermsResponse || !vocabulariesAndTermsResponse.categories || !Array.isArray(vocabulariesAndTermsResponse.categories)) {
            return rval;
        }

        const categories = vocabulariesAndTermsResponse.categories;
        let title: string = "";
        // Set categoryIds
        const categoryIds = [
            55, // Play and Learning
            56, // Responsive Parenting
            2, // Health and Wellbeing
            1, // Nutrition and Breastfeeding
            3, // Safety and Protection
            4, // Parenting Corner
            // DONT SHOW THESE CATEGORIES
            // 5, // Growth
        ];

        // Get artciles for each category
        categoryIds.forEach((categoryId) => {
            // Set categoryName
            let thisCategoryArray = categories.filter((category) => {
                return category.id === categoryId;
            });

            let categoryName = '';
            if (thisCategoryArray && thisCategoryArray.length > 0) {
                categoryName = thisCategoryArray[0].name;
            };

            // Set categoryArticles
            const categoryArticles: CategoryArticlesViewEntity = {
                categoryId: categoryId,
                categoryName: categoryName,
                articles: []
            };
            try {
                const childAgeTagId = dataRealmStore.getChildAgeTagWithArticles(categoryId, true)?.id;
                const allContent = realm?.objects<ContentEntity>(ContentEntitySchema.name);

                if (childAgeTagId !== null && childAgeTagId !== undefined) {
                    title = translate("todayArticles")

                    const filteredRecordsWithAge = allContent?.
                        filtered(`category == ${categoryId} AND type == 'article'`)
                        .filter(item => item.predefinedTags.indexOf(childAgeTagId) !== -1)
                    filteredRecordsWithAge?.forEach((record, index, collection) => {
                        categoryArticles.articles.push(record)
                    })
                } else {
                    title = translate("popularArticles");
                    const filteredRecords = allContent?.filtered(`category == ${categoryId} AND type == 'article'`)
                    // .filter(item => item.predefinedTags.indexOf(4756) === -1);
                    filteredRecords?.forEach((record, index, collection) => {
                        categoryArticles.articles.push(
                            record
                        );
                    });
                }

            } catch (e) {
                console.warn(e);
            };

            for (let item in categoryArticles) {
                categoryArticles.articles = utils.randomizeArray(categoryArticles.articles).slice(0, 5)
            };


            if (categoryArticles.articles.length > 0) {
                rval.categoryArticles?.push(categoryArticles);
            };
        });

        // Change title
        if (rval.categoryArticles && rval.categoryArticles.length > 0) {
            rval.title = title;
            rval.vocabulariesAndTermsResponse = vocabulariesAndTermsResponse;
        };

        return rval;
    }

    public getCategoryScreenArticles(realm: Realm | null, categoryId: number): ContentEntity[] {
        let rval: ContentEntity[] = [];

        // Get childGender, oppositeChildGender, oppositeChildGenderTagId
        const childGender: ChildGender | undefined = userRealmStore.getChildGender();
        let oppositeChildGender: ChildGender | undefined = undefined;
        if (childGender) oppositeChildGender = childGender === 'boy' ? 'girl' : 'boy';

        let oppositeChildGenderTagId: number | undefined = undefined;
        if (oppositeChildGender) {
            oppositeChildGenderTagId = oppositeChildGender === 'boy' ? 40 : 41;
        }

        // Get childAgeTagWithArticles
        const childAgeTagWithArticles = dataRealmStore.getChildAgeTagWithArticles(categoryId, true);

        // Get childAgeTags
        let childAgeTags: TermChildren[] = dataRealmStore.getChildAgeTags(true);

        // Reorder childAgeTags
        if (childAgeTagWithArticles) {
            let indexOfTag = 0;

            childAgeTags.forEach((value, index) => {
                if (value.id === childAgeTagWithArticles.id) {
                    indexOfTag = index;
                }
            });

            if (indexOfTag !== 0) {
                let deletedElements = childAgeTags.splice(indexOfTag);
                childAgeTags = deletedElements.concat(childAgeTags);
            }
        }

        // Query
        const query = `category == ${categoryId} AND type == 'article' SORT(id ASC)`;

        // Get articles for childAgeTags
        childAgeTags.forEach((childAgeTag) => {
            const articlesForChildAgeTag = realm?.objects<ContentEntity>(ContentEntitySchema.name)
                .filtered(query)

                // Filter articles with this child age tag
                .filter((article) => {
                    return article.predefinedTags.indexOf(childAgeTag.id) !== -1;
                })

                // Remove opposite gender
                .filter((article) => {
                    if (!childGender || !oppositeChildGenderTagId) return true;
                    return article.predefinedTags.indexOf(oppositeChildGenderTagId) === -1;
                })

                .map(article => article);

            // Add child age articles to rval. If not already there
            articlesForChildAgeTag?.forEach((article) => {
                let articleAlreadyAdded = false;
                rval.forEach((finalArticle) => {
                    if (finalArticle.id === article.id) articleAlreadyAdded = true;
                });
                if (!articleAlreadyAdded) rval.push(article);
            });
        });

        // Get other articles
        const articlesOther = realm?.objects<ContentEntity>(ContentEntitySchema.name)
            .filtered(query)

            // Remove opposite gender
            .filter((article) => {
                if (!childGender || !oppositeChildGenderTagId) return true;
                return article.predefinedTags.indexOf(oppositeChildGenderTagId) === -1;
            })

            .map(article => article);

        // Add other articles to rval. If not already there
        articlesOther?.forEach((article) => {
            let articleAlreadyAdded = false;
            rval.forEach((finalArticle) => {
                if (finalArticle.id === article.id) articleAlreadyAdded = true;
            });
            if (!articleAlreadyAdded) rval.push(article);
        });

        return rval;
    }

    public getRelatedArticles(realm: Realm | null, contentEntity: ContentEntity): ArticlesSectionData {
        const rval: ArticlesSectionData = {
            title: translate('relatedArticles'),
            otherFeaturedArticles: [],
        };

        // Get all articles from contentEntity category except contentEntity
        let allArticles: ContentEntity[] = [];

        try {
            const allContent = realm?.objects<ContentEntity>(ContentEntitySchema.name);
            const filteredRecords = allContent?.filtered(`category == ${contentEntity.category} AND type == 'article' AND id <> ${contentEntity.id}`);

            filteredRecords?.forEach((record, index, collection) => {
                allArticles.push(record);
            });
        } catch (e) {
            console.warn(e);
        }

        // Randomize articles
        allArticles = utils.randomizeArray(allArticles);

        rval.otherFeaturedArticles = allArticles.slice(0, 5);
        return rval;
    }
}

export const content = Content.getInstance();




/*
    private filterPredefinedTagsAndKeywords(key: string, searchValue: string, filter: Realm.Results<ContentEntity & Object> | undefined, relevantArticles: ContentEntity[]): ContentEntity[] {
        const vocabulariesAndTerms = this.getVariable('vocabulariesAndTerms');

        let dataForFiltering: ContentEntity[] = [];
        let vocabulariesAndTermsKeys = key === "keywords" ? vocabulariesAndTerms?.keywords : vocabulariesAndTerms?.predefined_tags;
        let articles: ContentEntity[] = [];

        vocabulariesAndTermsKeys?.forEach(record => {
            console.log("uso ovde ")
            if (filter && vocabulariesAndTerms) {
                if (key === "keywords") {
                    dataForFiltering = filter.filter(record => record.keywords.indexOf(record.id) !== -1);
                } else {
                    dataForFiltering = filter.filter(record => record.predefinedTags.indexOf(record.id) !== -1);
                }
            }

            if (this.findSearchedKeywords(record.name, searchValue)) {
                dataForFiltering = dataForFiltering.filter(item => item.keywords.indexOf(record.id))
                //     if (key === "keywords") {
                //         console.log('uso u kewyords')
                //        return item.keywords.indexOf(record.id) !== -1
                //     } else {
                //         console.log('uso u predefined');
                //        return item.predefinedTags.indexOf(record.id) !== -1
                //     }
                // })
            }

            // if (dataForFiltering) {
            //     dataForFiltering.forEach(item => {
            //         if (!relevantArticles.some(i => i.id === item?.id)) {
            //             articles.push(item);
            //         }
            //     })
            // };
        })

        return articles;
    }








*/