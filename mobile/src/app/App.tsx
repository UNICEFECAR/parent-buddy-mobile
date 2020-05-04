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
import { dataRealmStore } from '../stores';

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
        this.gotoFirstScreen();
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

    private gotoFirstScreen() {
        // Flags
        const userIsLoggedIn = dataRealmStore.getVariable('userIsLoggedIn');
        const userIsOnboarded = dataRealmStore.getVariable('userIsOnboarded');
        const userEnteredChildData = dataRealmStore.getVariable('userEnteredChildData');
        const userEnteredHisData = dataRealmStore.getVariable('userEnteredHisData');

        // Set routeName
        let routeName: string | null = null;
        
        // Default route name: LoginStackNavigator
        if (userIsLoggedIn) {
            if (!userIsOnboarded) {
                routeName = 'WalkthroughStackNavigator';
            } else if (!userEnteredChildData || !userEnteredHisData) {
                routeName = 'AccountStackNavigator';
            } else if (userIsLoggedIn && userIsOnboarded && userEnteredChildData && userEnteredHisData) {
                routeName = 'DrawerNavigator';
            }
        }

        // Navigate
        if (routeName) {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: routeName})],
            });
    
            navigation.dispatch(resetAction);
        }
    }

    public render() {
        return (
            <ThemeProvider>
                <PaperProvider>
                    <DataRealmProvider>
                        {/* <Storybook /> */}
                        <AppNavigationContainer
                            ref={(navigatorRef: NavigationContainerComponent) => {
                                return navigation.setTopLevelNavigator(navigatorRef);
                            }}
                        />
                    </DataRealmProvider>
                </PaperProvider>
            </ThemeProvider>
        );
    }
}