import { navigation, AppNavigationContainer } from './Navigators';
import { NavigationContainerComponent, StackActions, NavigationActions } from 'react-navigation';
import { dataRealmStore } from '../stores';

/**
 * Various utils methods.
 */
class Utils {
    private static instance: Utils;

    private constructor() {}

    static getInstance(): Utils {
        if (!Utils.instance) {
            Utils.instance = new Utils();
        }
        return Utils.instance;
    }

    /**
     * When app opens, there is an order of screens that should open,
     * before the home screen is finally opened.
     */
    public gotoNextScreenOnAppOpen() {
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
                routeName = 'DrawerNavigator'; // Contains home screen
            }
        }

        // Navigate
        if (routeName) {
            navigation.resetStackAndNavigate(routeName);
        }
    }
}

export const utils = Utils.getInstance();