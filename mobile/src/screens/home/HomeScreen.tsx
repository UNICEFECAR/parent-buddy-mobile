import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { scale } from 'react-native-size-matters';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { apiStore } from '../../stores';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { ArticlesSection } from './ArticlesSection';
import RNFS from 'react-native-fs';
import { utils } from '../../app';

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

    private async onTestButtonClick() {
        let ext = utils.getExtensionFromUrl('http://ecaroparentingappt8q2psucpz.devcloud.acquia-sites.com/sites/default/files/styles/crop_freeform/public/2020-05/UNI114991resized.JPG?itok=_-LnJkk0');
        console.log(ext);

        // IMAGES
        // let response = await apiStore.downloadImage({
        //     srcUrl: 'http://ecaroparentingappt8q2psucpz.devcloud.acquia-sites.com/sites/default/files/styles/crop_freeform/public/2020-05/UNI114991resized.JPG?itok=_-LnJkk0',
        //     destFolder: RNFS.DocumentDirectoryPath,
        //     destFilename: 'foo.jpg'
        // });
        // console.log(response);

        // VOCABULARIES
        // let response = await apiStore.getVocabulariesAndTerms();
        // console.log( JSON.stringify(response, null, 4) );

        // CONTENT
        // let response = await apiStore.getAllContent('article');

        // response.data = response.data.map((value) => {
        //     value.body = 'radim nesto';
        //     return value;
        // });

        // let response = await apiStore.getContent({type:'article'});
        // console.log( JSON.stringify(response.data, null, 4) );
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }} contentContainerStyle={[styles.container, { padding: themeContext.theme.screenContainer?.padding }]}>

                        <Button onPress={() => { this.onTestButtonClick() }}>Test</Button>
                        <Button onPress={() => { this.props.navigation.navigate('HomeStackNavigator_SearchResultsScreen') }}>Search results</Button>
                        <Button onPress={() => { this.props.navigation.navigate('HomeStackNavigator_FaqScreenScreen') }}>FAQ</Button>
                        <Button onPress={() => { this.props.navigation.navigate('HomeStackNavigator_AboutScreen') }}>About US</Button>
                        <Button onPress={() => { this.props.navigation.navigate('HomeStackNavigator_SettingsScreen') }}>Settings</Button>
                        <Button onPress={() => { this.props.navigation.navigate('HomeStackNavigator_AppFeedbackScreen') }}>Give app feedback</Button>
                        <Button onPress={() => { this.props.navigation.navigate('HomeStackNavigator_BirthDataScreen') }}>Birth data</Button>
                        <Button onPress={() => { this.props.navigation.navigate('HomeStackNavigator_ExaminationReminderScreen') }}>Exam reminder</Button>
                        <Button onPress={() => { this.props.navigation.navigate('HomeStackNavigator_ChildProfileScreen') }}>Child profile</Button>

                        {/* Wzrw7WTBVuk, nHoMIuf7fWk, YwJA04-zpvQ,  */}
                        {/* <Button onPress={() => {this.props.navigation.navigate('RootModalStackNavigator_VideoScreen', {
                        videoId:'Wzrw7WTBVuk'
                    })}}>Video</Button> */}

                        <View style={{ height: scale(30) }} />

                        <ArticlesSection />
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
