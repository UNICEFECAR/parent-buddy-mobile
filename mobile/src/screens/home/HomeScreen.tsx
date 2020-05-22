import React from 'react';
import Realm from 'realm';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { scale } from 'react-native-size-matters';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { ArticlesSection, ArticlesSectionData } from './ArticlesSection';
import { DataRealmContext, DataRealmContextValue, DataRealmConsumer } from '../../stores/DataRealmContext';
import { ContentEntity, ContentEntitySchema } from '../../stores/ContentEntity';
import { CategoryArticlesViewEntity } from '../../stores/CategoryArticlesViewEntity';
import { dataRealmStore } from '../../stores';
import { translate } from '../../translations/translate';
import { content } from '../../app';

export interface HomeScreenParams {
    showSearchInput?: boolean;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>;
}

/**
 * Shows several ArticlesSection.
 */
export class HomeScreen extends React.Component<Props, object> {

    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: HomeScreenParams = {
            showSearchInput: false,
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private getHomeScreenArticles(realm: Realm | null): ArticlesSectionData {
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

        // Set categoryIds
        const categoryIds = [
            55, // Play and Learning
            2, // Health and Wellbeing
            3, // Safety and Protection
            56, // Responsive Parenting
            4, // Parenting Corner
            1, // Nutrition and Breastfeeding
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
        
                filteredRecords?.forEach((record, index, collection) => {
                    categoryArticles.articles.push(
                        record
                        // content.toContentViewEntity(record, vocabulariesAndTermsResponse)
                    );
                });
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
        }

        return rval;
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }} contentContainerStyle={[styles.container, { padding: themeContext.theme.screenContainer?.padding }]}>
                        <DataRealmConsumer>
                            {(dataRealmContext: DataRealmContextValue) => (
                                <ArticlesSection data={ this.getHomeScreenArticles(dataRealmContext.realm) } />
                            )}
                        </DataRealmConsumer>
                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    }

}

export interface HomeScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<HomeScreenStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
});
