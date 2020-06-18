import { ContentEntity, ContentEntitySchema } from "../stores/ContentEntity";
import { ApiImageData, VocabulariesAndTermsResponse } from "../stores/apiStore";
import RNFS from 'react-native-fs';
import { utils } from "./utils";
import { ContentViewEntity } from "../stores/ContentViewEntity";
import { ArticlesSectionData } from "../screens/home/ArticlesSection";
import { translate } from "../translations/translate";
import { dataRealmStore, CategoryArticlesViewEntity, ChildEntity, userRealmStore } from "../stores";
import { Platform } from "react-native";
import { ChildEntitySchema } from "../stores/ChildEntity";
import { Collection } from "realm";
import { identity } from "lodash";

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

    private getChildAge = (): number => {
        const childContent = userRealmStore.realm?.objects<ChildEntity>(ChildEntitySchema.name);
        var id: number = 0;

        childContent?.forEach((record, index, collection) => {
            let months;
            let now = new Date()
            let birthDate = record.birthDate ? record.birthDate : null;
            
            // Chekc is child birthDate seted  
            if (birthDate === null) {
                id = 0;
            } else {
                // calculate months and get id
                months = (now.getFullYear() - birthDate.getFullYear()) * 12;
                months -= birthDate.getMonth();
                months += now.getMonth();

                if (months === 1) {
                    id = 43;
                }
                if (months === 2) {
                    id = 44
                }
                if (months === 3 || months === 4) {
                    id = 45
                }
                if (months === 5 || months === 6) {
                    id = 46
                }
                if (months >= 10 && months <= 12) {
                    id = 47
                }
                if (months >= 13 && months <= 18) {
                    id = 49
                }
                if (months >= 19 && months <= 24) {
                    id = 50
                }
                if (months >= 25 && months <= 36) {
                    id = 51
                }
                if (months >= 37 && months <= 48) {
                    id = 52
                }
                if (months >= 15 && months <= 26) {
                    id = 53
                }
                if (months >= 49 && months <= 60) {
                    id = 57
                }
                if (months >= 61 && months <= 72) {
                    id = 58
                }
            }
        })
        return id // return id 
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
        const age = vocabulariesAndTermsResponse.predefined_tags;

        // Set categoryIds
        const categoryIds = [
            // Health and Wellbeing
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
            }

            // Set categoryArticles
            const categoryArticles: CategoryArticlesViewEntity = {
                categoryId: categoryId,
                categoryName: categoryName,
                articles: []
            };

            try {
                const allContent = realm?.objects<ContentEntity>(ContentEntitySchema.name);
                const filteredRecords = allContent?.filtered(`category == ${categoryId} AND type == 'article' SORT(id ASC) LIMIT(5)`);

                if (this.getChildAge() !== 0) {
                    filteredRecords?.forEach((record, index, collection) => {
                        record.predefinedTags.forEach(item => {
                            if (item === this.getChildAge()) {
                                categoryArticles.articles.push(
                                    record
                                );
                            }
                        })
                    });
                } else {
                    filteredRecords?.forEach((record, index, collection) => {
                        categoryArticles.articles.push(
                            record
                        );
                    });
                }



            } catch (e) {
                console.warn(e);
            }

            if (categoryArticles.articles.length > 0) {
                rval.categoryArticles?.push(categoryArticles);
            }
        });

        // Change title
        if (rval.categoryArticles && rval.categoryArticles.length > 0) {
            rval.title = translate('popularArticles');
            rval.vocabulariesAndTermsResponse = vocabulariesAndTermsResponse;
        }

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


