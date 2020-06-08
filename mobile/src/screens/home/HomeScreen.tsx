import React from 'react';
import Realm from 'realm';
import { ScrollView, StyleSheet, View, ViewStyle, Alert } from 'react-native';
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
import { Media } from '../../components';

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

    private onTestButtonPress() {
        const results = dataRealmStore.getSearchResultsScreenData('yes');
        console.log(JSON.stringify(results, null, 4));
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }} contentContainerStyle={[styles.container, { padding: themeContext.theme.screenContainer?.padding }]}>

                        {/* Test button */}
                        {/* <Button onPress={() => {this.onTestButtonPress()}}>Test</Button>
                        <View style={{height:30}} /> */}

                        <Media
                            title="Hello baby"

                            // image
                            // coverImageUrl={`http:\/\/ecaroparentingapppi3xep5h4v.devcloud.acquia-sites.com\/sites\/default\/files\/styles\/crop_freeform\/public\/2020-05\/polo%C5%BEaj%20bebe%20u%20vreme%20podoja.jpg?itok=rxiQDXN5`}
                            
                            // YouTube
                            // videoType="youtube"
                            // videoUrl="https://www.youtube.com/watch?v=LjkSW_j6-hA"
                            // coverImageUrl="http://ecaroparentingapppi3xep5h4v.devcloud.acquia-sites.com/sites/default/files/styles/medium/public/video_thumbnails/LjkSW_j6-hA.jpg?itok=OasX9-fq"
                            
                            // Vimeo
                            videoType="vimeo"
                            videoUrl="https://vimeo.com/277586602"
                            coverImageUrl="http://ecaroparentingapppi3xep5h4v.devcloud.acquia-sites.com/sites/default/files/styles/medium/public/video_thumbnails/277586602.jpg?itok=kBNillFw"

                            roundCorners={true}
                            onPress={()=>{console.warn('Press')}}
                            // aspectRatio={1}
                        />
                        <View style={{height:100}} />

                        <DataRealmConsumer>
                            {(dataRealmContext: DataRealmContextValue) => (
                                <ArticlesSection data={content.getHomeScreenArticles(dataRealmContext.realm)} />
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
