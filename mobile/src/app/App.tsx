import React from 'react';
import { navigation, AppNavigationContainer } from './Navigators';
import { NavigationContainerComponent } from 'react-navigation';
import { YellowBox, Platform, UIManager } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '../themes/ThemeContext';
import { googleAuth } from './googleAuth';
import { DataRealmProvider } from '../stores/DataRealmContext';
import { UserRealmProvider } from '../stores/UserRealmContext';
import { HomeMessagesProvider } from '../stores/HomeMessagesContext';
import { utils } from './utils';
import { localize } from './localize';
// @ts-ignore
import { decode as atob, encode as btoa } from 'base-64';
import { apiStore, dataRealmConfig, dataRealmStore } from '../stores';

// ADD GLOBAL POLYFILLS: atob, btoa
if (!(global as any).btoa) (global as any).btoa = btoa;
if (!(global as any).atob) (global as any).atob = atob;

// Warnings to ignore
YellowBox.ignoreWarnings([
    'Warning: ',
    'Require cycle',
    'Sending `onAnimatedValueUpdate` with no listeners registered',
    'Unable to find module for UIManager',

    // WebView with Vimeo: https://bit.ly/2YqNaR0
    'startLoadWithResult invoked',
    'Did not receive response to shouldStartLoad',

    // Lottie
    'ReactNative.NativeModules.LottieAnimationView',
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
        localize.setLocalesIfNotSet();
    }

    private addItemsToDevMenu() {
        if (__DEV__) {
            const DevMenu = require('react-native-dev-menu');
            DevMenu.addItem('Storybook', () => this.gotoStorybookScreen());
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
                            <HomeMessagesProvider>
                                <AppNavigationContainer
                                    ref={(navigatorRef: NavigationContainerComponent) => {
                                        return navigation.setTopLevelNavigator(navigatorRef);
                                    }}
                                />
                            </HomeMessagesProvider>
                        </UserRealmProvider>
                    </DataRealmProvider>
                </PaperProvider>
            </ThemeProvider>
        );
    }
}