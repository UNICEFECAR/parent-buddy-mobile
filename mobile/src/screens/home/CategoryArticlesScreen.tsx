import React, { Fragment } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle, ScrollView, Image, ImageStyle, ImageBackground } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { ArticleScreenParams } from './ArticleScreen';
import { TouchableOpacity } from "react-native-gesture-handler";
import { CategoryArticlesViewEntity } from '../../stores/CategoryArticlesViewEntity';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ContentViewEntity } from '../../stores/ContentViewEntity';
import { DataRealmConsumer, DataRealmContextValue } from '../../stores/DataRealmContext';
import { ContentEntity, ContentEntitySchema } from '../../stores/ContentEntity';
import { content } from '../../app';
import { Media } from '../../components';
import { VideoType } from '../../components/Media';

export interface CategoryArticlesScreenParams {
    categoryName: string;
    categoryId: number;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, CategoryArticlesScreenParams>;
}

/**
 * Shows articles of some specific category.
 */
export class CategoryArticlesScreen extends React.Component<Props, object> {

    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: CategoryArticlesScreenParams = {
            // data: { categoryId: 0, categoryName: 'No category', articles: [] }
            categoryId: 0,
            categoryName: 'No category',
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private gotoBack() {
        this.props.navigation.goBack();
    }

    private gotoArticleScreen(article?: ContentEntity) {
        if (!article) return;

        const screenParams = this.props.navigation.state.params!;

        // Text article
        let params: ArticleScreenParams = {
            article: article,
            categoryName: screenParams.categoryName,
        };

        this.props.navigation.navigate('HomeStackNavigator_ArticleScreen', params);

        // if (!article.youTubeVideoId) {
        //     // Text article
        //     let params: ArticleScreenParams = {
        //         article: article
        //     };

        //     this.props.navigation.navigate('HomeStackNavigator_ArticleScreen', params);
        // } else {
        //     // Video article
        //     this.props.navigation.navigate('RootModalStackNavigator_VideoScreen', {
        //         videoId: article?.youTubeVideoId
        //     });
        // }
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;

        let getPlayIcon = (themeContext: ThemeContextValue, size: number = scale(70)) => {
            return (
                <View style={{
                    justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    width: size, height: size,
                    borderRadius: themeContext.percentageToDP('20%')
                }}>
                    <Icon
                        name={"play"}
                        style={{ color: 'white', marginLeft: size / 10, fontSize: size / 2 }}
                    />
                </View>
            );
        }

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }} contentContainerStyle={[styles.container, { padding: themeContext.theme.screenContainer?.padding }]}>
                        {/* GO BACK */}
                        <TextButton style={{ padding: 0 }} icon="chevron-left" iconStyle={{ color: '#AA40BF' }} textStyle={{ fontSize: scale(16) }} color={TextButtonColor.purple} onPress={() => { this.gotoBack() }}>
                            {translate('buttonBack')}
                        </TextButton>

                        <View style={{ marginBottom: scale(15) }} />

                        {/* CATEGORY NAME */}
                        <Typography type={TypographyType.headingPrimary}>
                            {screenParams.categoryName}
                        </Typography>

                        {/* CATEGORY ARTICLES */}
                        <DataRealmConsumer>
                            {(dataRealmContext: DataRealmContextValue) => (
                                <Fragment>
                                    {dataRealmContext.realm?.objects<ContentEntity>(ContentEntitySchema.name)
                                        .filtered(`category == ${screenParams.categoryId} AND type == 'article' SORT(id ASC)`).map(article => {
                                            return (
                                                <Media
                                                    key={article.id}
                                                    title={ article.title }

                                                    coverImageUrl={ content.getCoverImageFilepath(article) }
                                                    videoType={article.coverVideoSite as VideoType}
                                                    videoUrl={article.coverVideoUrl}

                                                    roundCorners={true}
                                                    aspectRatio={1.8}
                                                    style={{ width: '100%', marginBottom:scale(25) }}

                                                    onPress={() => { this.gotoArticleScreen(article) }}
                                                />
                                            );
                                        })
                                    }
                                </Fragment>
                            )}
                        </DataRealmConsumer>
                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    }

}

export interface CategoryArticlesScreenStyles {
    container?: ViewStyle;
    image?: ImageStyle;
}

const styles = StyleSheet.create<CategoryArticlesScreenStyles>({
    container: {

    },

    image: {
        borderRadius: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    }
});
