import { SearchResultsScreenDataResponse, dataRealmStore } from "./dataRealmStore"
import { ContentEntity } from ".";
import { ContentEntitySchema } from "./ContentEntity";
import { TermChildren } from "./apiStore";


// GET IDS IF SEARCH VALUE EXIST IN STRING OF KEYWORDS OR PREDEFINED TAGS 
function getIdsForSearchedString(type: string, searchedValue: string) {
    const vocabulariesAndTerms = dataRealmStore?.getVariable('vocabulariesAndTerms');

    let idsList: number[] = [];

    if (type === "keywords") {
        vocabulariesAndTerms?.keywords.forEach(keyword => {
            let keywordExist = false;
            if (keyword.name.toLowerCase().includes(searchedValue.toLowerCase())) {
                keywordExist = true
            }

            if (keywordExist) {
                idsList.push(keyword.id);
            }
        })
    } else {
        vocabulariesAndTerms?.predefined_tags.forEach(predefinetTag => {
            let tagExist = false;

            predefinetTag.children.forEach(child => {
                if (child.name.toLowerCase().includes(searchedValue.toLowerCase())) {
                    tagExist = true
                }
                if (tagExist) {
                    idsList.push(child.id);
                }
            })
        })
    }

    return idsList;
}

function formatChildAgeIds() {
    const currentChildAgeTag = dataRealmStore.getChildAgeTagWithArticles();

    // Get childAgeTags
    let childAgeTags: TermChildren[] = dataRealmStore.getChildAgeTags(true);

    // Reorder childAgeTags
    if (currentChildAgeTag) {
        let indexOfTag = 0;

        childAgeTags.forEach((value, index) => {
            if (value.id === currentChildAgeTag.id) {
                indexOfTag = index;
            }
        });

        if (indexOfTag !== 0) {
            let deletedElements = childAgeTags.splice(indexOfTag);
            childAgeTags = deletedElements.concat(childAgeTags);
        }
    }

    return childAgeTags;
}

function removeDuplicatedArticles(data: ContentEntity[], id: number): boolean {
    let check = false;
    data.map(data => {
        if (id === data.id) {
            check = true;
        }
    })

    return check
}

function sortArticlesByCategory(data: ContentEntity[], categoryId: number, categoryName: string): SearchResultsScreenDataCategoryArticles {
    const currentCategorizedArticles: SearchResultsScreenDataCategoryArticles = {
        categoryId: categoryId,
        categoryName: categoryName,
        contentItems: [],
    };

    data.forEach((article) => {
        if (article.category === categoryId) {
            currentCategorizedArticles.contentItems.push(article);
        }
    });

    return currentCategorizedArticles;
}

export function getSearchResultsScreenData(searchTerm: string): SearchResultsScreenDataResponse {
    const rval: SearchResultsScreenDataResponse = {
        articles: [],
        faqs: [],
    };

    let AllArticlesCollection: ContentEntity[] = [];

    const store = dataRealmStore;
    const allContent = store.realm?.objects<ContentEntity>(ContentEntitySchema.name);

    const vocabulariesAndTerms = dataRealmStore?.getVariable('vocabulariesAndTerms');

    // get all ids for keywords and predefined tags
    const allKeywordsIds = getIdsForSearchedString("keywords", searchTerm)
    const allPredefinteTagsIds = getIdsForSearchedString("predefinedTags", searchTerm)

    // get collections
    const titleAndBodyCollection = allContent?.
        filtered(`(body CONTAINS[c] '${searchTerm}' OR title CONTAINS[c] '${searchTerm}')`)

    const keywordsCollection = allContent?.
        filter(record => {
            return record.keywords.filter(x => allKeywordsIds.includes(x)).length !== 0;
        });

    const predefinedTagsCollection = allContent?.
        filter(record => {
            return record.predefinedTags.filter(x => allPredefinteTagsIds.includes(x)).length !== 0;
        })

    
    // Remove duplicates and add to allCollection
    titleAndBodyCollection?.forEach(item => {
        let check = removeDuplicatedArticles(AllArticlesCollection, item.id);
        if (!check) {
            AllArticlesCollection.push(item)
        }
    })

    keywordsCollection?.forEach(item => {
        let check = removeDuplicatedArticles(AllArticlesCollection, item.id);
        if (!check) {
            AllArticlesCollection.push(item)
        }
    })

    predefinedTagsCollection?.forEach(item => {
        let check = removeDuplicatedArticles(AllArticlesCollection, item.id);
        if (!check) {
            AllArticlesCollection.push(item)
        }
    })


    // get child age ids 
    const childAgeTags = formatChildAgeIds();

    let finalArticlesResult: ContentEntity[] = [];

    // sort articles for child age 
    childAgeTags.forEach(ageId => {
        let filteredAgeArticles = AllArticlesCollection.filter(item => item.predefinedTags.indexOf(ageId.id) !== -1);

        filteredAgeArticles.map(article => {
            let articleAlreadyAdded = false;
            finalArticlesResult.forEach((finalArticle) => {
                if (finalArticle.id === article.id) articleAlreadyAdded = true;
            });
            if (!articleAlreadyAdded) finalArticlesResult.push(article);
        })
    })

    // sort child age non set articles
    AllArticlesCollection.map(item => {
        let articleAlreadyAdded = false;
        finalArticlesResult.map(data => {
            if (data.id === item.id) articleAlreadyAdded = true;
        })

        if (!articleAlreadyAdded) {
            finalArticlesResult.push(item)
        }
    })

    // get faq articles
    const categorizedArticles: SearchResultsScreenDataCategoryArticles[] = [];
    
    // move articles in category 
    vocabulariesAndTerms?.categories.forEach((category) => {
        let currentCategorizedArticles = sortArticlesByCategory(finalArticlesResult, category.id, category.name)
        if (currentCategorizedArticles.contentItems.length > 0) {
            categorizedArticles.push(currentCategorizedArticles);
        }
    });

    // get FAQ articles 
    const faqArticles: ContentEntity[] = finalArticlesResult.filter(faqItem => faqItem.type === 'faq');

    rval.articles = categorizedArticles;
    rval.faqs = faqArticles

    return rval;
}



export type SearchResultsScreenDataCategoryArticles = {
    categoryId: number,
    categoryName: string,
    contentItems: ContentEntity[]
}