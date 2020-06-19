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
import { translateData } from "../translationsData/translateData";

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
                const allContent = realm?.objects<ContentEntity>(ContentEntitySchema.name);
                const filteredRecords = allContent?.filtered(`category == ${categoryId} AND type == 'article' SORT(id ASC) LIMIT(5)`);
                                            
                const childAgeTagId = dataRealmStore.getChildAgeTagWithArticles(categoryId)?.id;

                if (childAgeTagId !== null && childAgeTagId !== undefined) {
                    title = translate('todayArticles')
                    filteredRecords?.forEach((record, index, collection) => {
                        record.predefinedTags.forEach(item => {
                            if (item === childAgeTagId) {
                                categoryArticles.articles.push(
                                    record
                                );
                            };
                        });
                    });
                } else {
                    title = translate("popularArticles")
                    filteredRecords?.forEach((record, index, collection) => {
                        categoryArticles.articles.push(
                            record
                        );
                    });
                };

                
            } catch (e) {
                console.warn(e);
            };


            for(let item in categoryArticles){
                categoryArticles.articles = utils.randomizeArray(categoryArticles.articles)
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




