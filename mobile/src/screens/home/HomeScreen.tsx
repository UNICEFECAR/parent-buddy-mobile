import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ViewStyle, ScrollView, Alert } from 'react-native';
import { NavigationScreenConfigProps } from 'react-navigation';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { themes } from '../../themes/themes';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { IconButton, Button } from 'react-native-paper';
import { ProfileIcon } from "../../components/ProfileIcon";
import { SearchInput, SearchInputSize } from "../../components/SearchInput";
import { DrawerActions } from 'react-navigation-drawer';
import { ArticlesSection } from './ArticlesSection';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
import { dataRealmStore } from "../../stores/dataRealmStore";

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
        // await dataRealmStore.setVariable('setting2', 'misha');

        // const record = dataRealmStore.getVariable('setting2');
        // console.warn( JSON.stringify(record, null, 4), typeof record );

        dataRealmStore.deleteVariable("setting2").catch(() => {console.warn('Already deleted')});
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
