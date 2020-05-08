import { navigation } from './Navigators';
import { dataRealmStore } from '../stores';
import { userRealmStore } from '../stores';

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
        const userParentalRole = dataRealmStore.getVariable('userParentalRole');

        // Set routeName
        let routeName: string | null = null;

        // Default route name: LoginStackNavigator
        if (userIsLoggedIn) {
            if (!userIsOnboarded) {
                routeName = 'WalkthroughStackNavigator';
            } else if (!userEnteredChildData || !userParentalRole) {
                routeName = 'AccountStackNavigator';
            } else if (userIsLoggedIn && userIsOnboarded && userEnteredChildData && userParentalRole) {
                routeName = 'DrawerNavigator'; // Contains home screen
            }
        }

        // Navigate
        if (routeName) {
            navigation.resetStackAndNavigate(routeName);
        }
    }

    /**
     * Convert ArrayBuffer to string.
     */
    public ab2str(buf:ArrayBuffer): string {
        return String.fromCharCode.apply(null, new Uint16Array(buf) as any);
    }
    
    /**
     * Convert string to ArrayBuffer.
     */
    public str2ab(str:string) {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
}

export const utils = Utils.getInstance();