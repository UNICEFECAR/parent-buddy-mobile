import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle, ScrollView, Image, ImageBackground, Alert } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { ShareButton } from '../../components/ShareButton';
import { Tag } from '../../components/Tag';
import { Divider } from '../../components/Divider';
import { ArticlesSection } from './ArticlesSection';
import AutoHeightWebView from 'react-native-autoheight-webview'
import { Dimensions, Linking } from 'react-native';
// @ts-ignore
import HTML from 'react-native-render-html';
import { ContentEntity } from '../../stores/ContentEntity';
import { content } from '../../app';
import { DataRealmContext, DataRealmContextValue, DataRealmConsumer } from '../../stores/DataRealmContext';
import { Media } from '../../components';
import { VideoType } from '../../components/Media';

export interface ArticleScreenParams {
    article: ContentEntity;
    categoryName: string;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, ArticleScreenParams>;
}

/**
 * Shows one article.
 */
export class ArticleScreen extends React.Component<Props, object> {

    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: ArticleScreenParams = {
            article: {} as any,
            categoryName: '',
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

    public render() {
        const screenParams = this.props.navigation.state.params!;

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

                            {/* ARTICLE TITLE */}
                            <Typography style={{ textAlign: 'left' }} type={TypographyType.headingPrimary}>
                                {screenParams.article.title}
                            </Typography>

                            {/* TAG WITH CATEGORY NAME */}
                            {screenParams?.categoryName ? (
                                <Tag>{screenParams?.categoryName}</Tag>
                            ) : null}
                        </View>

                        <View style={{ paddingBottom: 0 }}>
                            {/* ARTICLE IMAGE */}
                            <Media
                                coverImageUrl={ content.getCoverImageFilepath(screenParams.article) }
                                videoType={screenParams.article.coverVideoSite as VideoType}
                                videoUrl={screenParams.article.coverVideoUrl}

                                roundCorners={false}
                                aspectRatio={1.4}
                                style={{ width:'100%' }}
                            />

                            {/* SHARE BUTTON */}
                            {/* <ShareButton style={{ position: 'absolute', bottom: scale(0), right: scale(20) }} onPress={() => { }} /> */}
                        </View>

                        <View style={{ flexDirection: 'column', justifyContent: 'flex-start', padding: themeContext.theme.screenContainer?.padding }}>
                            {/* ARTICLE BODY */}
                            {/* <AutoHeightWebView
                            source={{ html:screenParams.article.bodyHTML}}
                            style={{width: '100%'}}
                            customStyle={ `p {font-size:20px}` }
                            scalesPageToFit={true}
                            scrollEnabled={false}
                            viewportContent={'width=device-width, user-scalable=no'}
                            // onSizeUpdated={ size => console.warn(size.height) }
                        /> */}

                            <HTML
                                html={screenParams.article.body}
                                baseFontStyle={{ fontSize: scale(17) }}
                                tagsStyles={htmlStyles}
                                imagesMaxWidth={Dimensions.get('window').width}
                                staticContentMaxWidth={Dimensions.get('window').width}
                                onLinkPress={(event: any, href: string) => {
                                    Linking.openURL(href);
                                }}
                            />

                            {/* SHARE BUTTON */}
                            {/* <TextButton icon="share-alt" iconStyle={{ color: '#AA40BF' }} color={TextButtonColor.purple}>
                                {translate('buttonShare')}
                            </TextButton> */}

                            <Divider style={{ marginTop: scale(30), marginBottom: scale(30) }} />

                            {/* RELATED ARTICLES */}
                            <DataRealmConsumer>
                                {(dataRealmContext: DataRealmContextValue) => (
                                    <ArticlesSection data={content.getRelatedArticles(dataRealmContext.realm, screenParams.article)} hideTitleUnderline={true} />
                                )}
                            </DataRealmConsumer>
                        </View>
                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    }

}

export interface ArticleScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<ArticleScreenStyles>({
    container: {

    },
});

const htmlStyles = {
    p: { marginBottom: 15 },
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(15) },
};