import React, { Fragment } from 'react';
import { View, Text, StyleProp, StyleSheet, ViewStyle, TextStyle, ImageStyle, Image, ScrollView, ImageBackground } from 'react-native';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { ArticleViewEntity } from '../../stores/ArticleViewEntity';
import { CategoryArticlesViewEntity } from '../../stores/CategoryArticlesViewEntity';
import { scale, moderateScale } from 'react-native-size-matters';
import { translate } from '../../translations/translate';
import { articlesSectionAllData } from '../../dummy-data/articlesSectionAllData';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { CategoryArticlesScreenParams } from './CategoryArticlesScreen';
import { navigation } from '../../app/Navigators';
import { ArticleScreenParams } from './ArticleScreen';
import { BorderlessButton, RectButton, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity } from "react-native-gesture-handler";
import { StackActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ContentEntity } from '../../stores/ContentEntity';
import { content } from '../../app';
import { ContentViewEntity } from '../../stores/ContentViewEntity';
import { VocabulariesAndTermsResponse } from '../../stores/apiStore';

export interface Props {
    data: ArticlesSectionData;
    hideTitleUnderline?: boolean;
    style?: StyleProp<ViewStyle>;
}

export interface State {

}

export interface ArticlesSectionData {
    title: string;
    featuredArticle?: ContentEntity;
    otherFeaturedArticles?: ContentEntity[];
    categoryArticles?: CategoryArticlesViewEntity[];
    vocabulariesAndTermsResponse?: VocabulariesAndTermsResponse;
}

/**
 * Used from HomeScreen and ArticleScreen (related articles).
 */
export class ArticlesSection extends React.Component<Props, State> {
    static defaultProps: Props = {
        data: {title:'No articles'},
        // data: articlesSectionAllData,
        hideTitleUnderline: false,
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {

        };

        this.state = state;
    }

    private gotoCategoryArticlesScreen(categoryData: CategoryArticlesViewEntity) {
        let params: CategoryArticlesScreenParams = {
            data: categoryData
        };

        navigation.navigate('HomeStackNavigator_CategoryArticlesScreen', params);
    }

    private onArticlePress(article?: ContentEntity) {
        if (!article) return;

        // Text article
        const pushAction = StackActions.push({
            routeName: 'HomeStackNavigator_ArticleScreen',
            params: {
                article: article,
                categoryName: content.toContentViewEntity(article, this.props.data.vocabulariesAndTermsResponse).category?.name
            },
        });

        navigation.dispatch(pushAction);

        // if (!article.youTubeVideoId) {
        //     // Text article
        //     const pushAction = StackActions.push({
        //         routeName: 'HomeStackNavigator_ArticleScreen',
        //         params: {
        //             article: article
        //         },
        //     });

        //     navigation.dispatch(pushAction);
        // } else {
        //     // Video article
        //     navigation.navigate('RootModalStackNavigator_VideoScreen', {
        //         videoId: article?.youTubeVideoId
        //     });
        // }
    }

    public render() {
        // console.log('RENDER ArticlesSection');

        let getPlayIcon = (themeContext: ThemeContextValue, size:number = scale(70)) => {
            return (
                <View style={{
                    justifyContent:'center', alignItems:'center',
                    backgroundColor:'rgba(255,255,255,0.4)',
                    width:size, height:size,
                    borderRadius: themeContext.percentageToDP('20%')
                }}>
                    <Icon
                        name={ "play" }
                        style={{ color:'white', marginLeft:size/10, fontSize:size/2 }}
                    />
                </View>
            );
        }

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <View style={[styles.container, this.props.style]}>
                        {/* SECTION TITLE */}
                        <Typography type={TypographyType.headingPrimary} style={{ marginBottom: 0 }}>{this.props.data.title}</Typography>

                        {/* DIVIDER */}
                        {this.props.hideTitleUnderline ? (
                            <View style={{ height: scale(10) }} />
                        ) : (
                                <View style={styles.divider} />
                            )}

                        {/* ----------------- */}
                        {/* FEATURED ARTICLES */}
                        {/* ----------------- */}
                        {this.props?.data?.featuredArticle || this.props?.data?.otherFeaturedArticles ? (
                            <View style={{ marginBottom: scale(20) }}>
                                {this.props?.data?.featuredArticle ? (
                                    <TouchableOpacity
                                        onPress={() => { this.onArticlePress(this.props?.data?.featuredArticle) }}
                                    >
                                        {/* Featured image */}
                                        <ImageBackground
                                            source={{ uri: content.getCoverImageFilepath(this.props?.data?.featuredArticle) }}
                                            style={[styles.image, { width: '100%', aspectRatio: 1.7 }]}
                                            resizeMode="cover"
                                        >
                                            {/* {this.props?.data?.featuredArticle.youTubeVideoId ? getPlayIcon(themeContext) : null} */}
                                        </ImageBackground>

                                        <View style={{ height: scale(10) }} />

                                        {/* Featured title */}
                                        <Typography type={TypographyType.headingSecondary}>
                                            {this.props?.data?.featuredArticle?.title}
                                        </Typography>
                                    </TouchableOpacity>
                                ) : null}

                                {/* Featured articles */}
                                {this.props?.data?.otherFeaturedArticles && this.props?.data?.otherFeaturedArticles.length > 0 ? (
                                    <ScrollView horizontal={true}>
                                        {this.props?.data?.otherFeaturedArticles.map((article, index) => (
                                            <TouchableOpacity key={index} onPress={() => { this.onArticlePress(article) }} style={{ width: scale(180), marginRight: scale(15), marginBottom: scale(10) }}>
                                                <ImageBackground
                                                    // source={{ uri: (article.coverImageUrl ? article.coverImageUrl : undefined) }}
                                                    source={{ uri: content.getCoverImageFilepath(article) }}
                                                    style={[styles.image, { width: '100%', aspectRatio: 1 }]}
                                                    resizeMode="cover"
                                                >
                                                    {/* {article.youTubeVideoId ? getPlayIcon(themeContext, scale(60)) : null} */}
                                                </ImageBackground>

                                                <View style={{ height: scale(10) }} />

                                                <Typography type={TypographyType.headingSecondary} style={{ marginBottom: 0 }}>
                                                    {article?.title}
                                                </Typography>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                ) : null}
                            </View>
                        ) : null}

                        {/* ----------------- */}
                        {/* CATEGORY ARTICLES */}
                        {/* ----------------- */}
                        {this.props?.data?.categoryArticles && this.props?.data?.categoryArticles.length > 0 ? (
                            <View>
                                {this.props?.data?.categoryArticles.map((category, index) => (
                                    <View key={index} style={{ marginBottom: scale(15) }}>
                                        <View style={{ marginBottom: scale(10), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            {/* Category name */}
                                            <Typography type={TypographyType.bodyRegular} style={{ flex: 1 }}>{category.categoryName}</Typography>

                                            {/* Show all articles */}
                                            <TextButton color={TextButtonColor.purple} style={{ padding: 0 }} onPress={() => { this.gotoCategoryArticlesScreen(category) }}>
                                                {translate('showAllArticles')}
                                            </TextButton>
                                        </View>

                                        {/* Category articles */}
                                        {category?.articles && category?.articles.length > 0 ? (
                                            <ScrollView horizontal={true}>
                                                {category?.articles.map((article, index) => (
                                                    <TouchableOpacity onPress={() => { this.onArticlePress(article) }} key={index} style={{ width: scale(180), marginRight: scale(15), marginBottom: scale(15) }}>
                                                        <ImageBackground
                                                            // source={{ uri: (article.coverImageUrl ? article.coverImageUrl : undefined) }}
                                                            source={{ uri: content.getCoverImageFilepath(article) }}
                                                            style={[styles.image, { width: '100%', aspectRatio: 1 }]}
                                                            resizeMode="cover"
                                                        >
                                                            {/* {article.youTubeVideoId ? getPlayIcon(themeContext, scale(60)) : null} */}
                                                        </ImageBackground>

                                                        <View style={{ height: scale(10) }} />

                                                        <Typography type={TypographyType.headingSecondary} style={{ marginBottom: 0 }}>
                                                            {article?.title}
                                                        </Typography>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        ) : null}
                                    </View>
                                ))}
                            </View>
                        ) : null}
                    </View>
                )}
            </ThemeConsumer>
        );
    }
}

export interface ArticlesSectionStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
    divider: ViewStyle;
    image: ImageStyle;
}

const styles = StyleSheet.create<ArticlesSectionStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        // backgroundColor: 'orange',
        // borderWidth: 10,
        // borderColor: 'green',
    },

    divider: {
        marginTop: scale(10),
        marginBottom: scale(20),
        borderBottomWidth: 1,
        borderBottomColor: '#D8D8D8',
    },

    image: {
        borderRadius: scale(10),
        justifyContent: 'center',
        alignItems:'center',
        overflow: 'hidden',
    }
});
