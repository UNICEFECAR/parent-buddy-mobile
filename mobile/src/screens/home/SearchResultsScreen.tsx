import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ViewStyle, ScrollView, Linking } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { ListCard, ListCardMode, ListCardItem } from './ListCard';
import { listCardArticlesSearchResultsDummyData, listCardFaqSearchResultsDummyData } from "../../dummy-data/listCardDummyData";
import { DidntFindAnswers } from './DidntFindAnswers';
import { StackActions } from 'react-navigation';
import { dataRealmStore, ContentEntity } from '../../stores';
import { content } from '../../app';
import { SearchResultsScreenDataResponse } from '../../stores/dataRealmStore';
import { Button } from 'react-native-paper';

export interface SearchResultsScreenParams {
    searchTerm?: string;
    showSearchInput: boolean;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, SearchResultsScreenParams>;
}

export interface State {

}

export class SearchResultsScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: SearchResultsScreenParams = {
            showSearchInput: false,
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private gotoArticle(item: ListCardItem) {
        const article = dataRealmStore.getContentFromId(item.id);
        console.log(article);
        if (!article) return;

        const pushAction = StackActions.push({
            routeName: 'HomeStackNavigator_ArticleScreen',
            params: {
                article: article,
                // categoryName: content.toContentViewEntity(article, this.props.data.vocabulariesAndTermsResponse).category?.name
            },
        });

        this.props.navigation.dispatch(pushAction);
    }

    private gotoBack() {
        this.props.navigation.goBack();
    }

    private convertContentEntityToListCardItem(content: ContentEntity): ListCardItem {
        return {
            id: content.id,
            title: content.title,
            type: content.type,
            bodyHtml: content.body,
        };
    }

    private onTestButtonPress() {

    }

    public render() {
        const screenParams = this.props.navigation.state.params!;
        // console.log('SEARCH RESULTS RENDER');

        // Get data
        let data: SearchResultsScreenDataResponse = {};
        
        if (screenParams.searchTerm && screenParams.searchTerm !== '') {
            data = dataRealmStore.getSearchResultsScreenData(screenParams.searchTerm);
        }

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={[styles.container]}
                    >
                        <View style={{ alignItems: 'flex-start', padding: themeContext.theme.screenContainer?.padding }}>
                            {/* GO BACK */}
                            <TextButton style={{ padding: 0 }} icon="chevron-left" iconStyle={{ color: '#AA40BF' }} textStyle={{ fontSize: scale(16) }} color={TextButtonColor.purple} onPress={() => { this.gotoBack() }}>
                                {translate('buttonBack')}
                            </TextButton>

                            <View style={{ height: scale(15) }} />

                            {/* TITLE */}
                            <Typography type={TypographyType.headingPrimary}>
                                {translate('searchResults')}
                            </Typography>

                            {/* TEST */}
                            <Button onPress={() => {this.onTestButtonPress()}}>Test</Button>

                            {/* LIST CARD: Articles */}
                            {data.articles && data.articles.map((articles, index) => (
                                <>
                                    <ListCard
                                        key={index}
                                        mode={ListCardMode.simpleList}
                                        title={articles.categoryName}
                                        items={articles.contentItems.map((content) => this.convertContentEntityToListCardItem(content))}
                                        onItemPress={(item) => { this.gotoArticle(item) }}
                                    />
                                    <View style={{ height: scale(20) }} />
                                </>
                            ))}

                            {/* LIST CARD: FAQ */}
                            {data.faqs && data.faqs.length > 0 ? (
                                <ListCard
                                    mode={ListCardMode.accordionList}
                                    title={'Cestaaaaa pitanjaaa'}
                                    items={data.faqs.map((content) => this.convertContentEntityToListCardItem(content))}
                                    onItemPress={(item) => { console.warn(item.id) }}
                                />
                            ) : null}

                            {/* YOU DIDNT FIND ANSWER */}
                            <View style={{ height: scale(40) }} />
                            <DidntFindAnswers />
                            <View style={{ height: scale(40) }} />
                        </View>
                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    }

}

export interface SearchResultsScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<SearchResultsScreenStyles>({
    container: {
        // flex: 1,
    },
});
