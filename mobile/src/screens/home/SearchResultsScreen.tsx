import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle, ScrollView, Linking } from 'react-native';
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
import { dataRealmStore } from '../../stores';
import { content } from '../../app';

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

    public constructor(props:Props) {
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

    public render() {
        const screenParams = this.props.navigation.state.params!;
        // console.log('SEARCH RESULTS RENDER');

        return (
            <ThemeConsumer>
            {(themeContext:ThemeContextValue) => (
                <ScrollView
                    style={{backgroundColor:themeContext.theme.screenContainer?.backgroundColor}}
                    contentContainerStyle={ [styles.container] }
                >
                    <View style={{alignItems:'flex-start', padding:themeContext.theme.screenContainer?.padding}}>
                        {/* GO BACK */}
                        <TextButton style={{padding:0}} icon="chevron-left" iconStyle={{color:'#AA40BF'}} textStyle={{fontSize:scale(16)}} color={TextButtonColor.purple} onPress={ () => {this.gotoBack()} }>
                            {translate('buttonBack')}
                        </TextButton>

                        <View style={{height:scale(15)}} />

                        {/* TITLE */}
                        <Typography type={TypographyType.headingPrimary}>
                            { translate('searchResults') }
                        </Typography>

                        {/* TODO */}
                        <Text style={{fontSize:40, paddingBottom:20}}>
                            {screenParams.searchTerm}
                        </Text>

                        {/* LIST CARD: Articles */}
                        <ListCard
                            mode={ ListCardMode.simpleList }
                            title={ listCardArticlesSearchResultsDummyData.title }
                            subTitle={ listCardArticlesSearchResultsDummyData.subTitle }
                            items={ listCardArticlesSearchResultsDummyData.items }
                            onItemPress={(item) => { this.gotoArticle(item) }}
                        />

                        <View style={{height:scale(20)}} />

                        {/* LIST CARD: FAQ */}
                        <ListCard
                            mode={ ListCardMode.accordionList }
                            title={ listCardFaqSearchResultsDummyData.title }
                            subTitle={ listCardFaqSearchResultsDummyData.subTitle }
                            items={ listCardFaqSearchResultsDummyData.items }
                            onItemPress={(item) => {console.warn(item.id)}}
                        />

                        {/* YOU DIDNT FIND ANSWER */}
                        <View style={{height:scale(40)}} />
                        <DidntFindAnswers />
                        <View style={{height:scale(40)}} />
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
