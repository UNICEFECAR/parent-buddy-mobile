import React from 'react';
import { navigation, AppNavigationContainer } from './Navigators';
import { NavigationContainerComponent, StackActions, NavigationActions } from 'react-navigation';
import { YellowBox, View, Text, Platform, UIManager } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Storybook from '../../storybook';
import { ThemeProvider } from '../themes/ThemeContext';
import { GoogleSignin } from '@react-native-community/google-signin';
import { googleAuth } from './googleAuth';
import { DataRealmProvider } from '../stores/DataRealmContext';
import { UserRealmProvider } from '../stores/UserRealmContext';
import { dataRealmStore } from '../stores';
import { utils } from './utils';
import * as RNLocalize from "react-native-localize";
import { Locale } from "react-native-localize";

// Warnings to ignore
YellowBox.ignoreWarnings([
    'Warning: ',
    'Require cycle',
    'Sending `onAnimatedValueUpdate` with no listeners registered',
    'Unable to find module for UIManager',
    // 'createStackNavigator',
]);

// Turn on layout animations on Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

/**
 * First component to render.
 */
export class App extends React.Component<object> {
    constructor(props: object) {
        super(props);
    }

    public componentDidMount() {
        this.addItemsToDevMenu();
        googleAuth.configure();
        utils.gotoNextScreenOnAppOpen();
        this.setLocale();
    }

    private addItemsToDevMenu() {
        if (__DEV__) {
            const DevMenu = require('react-native-dev-menu');
            DevMenu.addItem('Storybook', () => this.gotoStorybookScreen());
        }
    }

    private setLocale() {
        const locales = RNLocalize.getLocales();
        let firstLocale: Locale|null = null;
        if (locales && locales.length > 0) {
            firstLocale = locales[0];
        }

        let languageCode = dataRealmStore.getVariable('languageCode');
        let countryCode = dataRealmStore.getVariable('countryCode');

        if (!languageCode && firstLocale) {
            dataRealmStore.setVariable('languageCode', firstLocale.languageCode);
        }

        if (!countryCode && firstLocale) {
            dataRealmStore.setVariable('countryCode', firstLocale.countryCode);
        }
    }

    private gotoStorybookScreen() {
        navigation.navigate('RootModalStackNavigator_StorybookScreen');
    };

    public render() {
        return (
            <ThemeProvider>
                <PaperProvider>
                    <DataRealmProvider>
                        <UserRealmProvider>
                            {/* <Storybook /> */}
                            <AppNavigationContainer
                                ref={(navigatorRef: NavigationContainerComponent) => {
                                    return navigation.setTopLevelNavigator(navigatorRef);
                                }}
                            />
                        </UserRealmProvider>
                    </DataRealmProvider>
                </PaperProvider>
            </ThemeProvider>
        );
    }
}