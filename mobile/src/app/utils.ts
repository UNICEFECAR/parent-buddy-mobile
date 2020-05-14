import { navigation } from './Navigators';
import { dataRealmStore } from '../stores';
import SendSMS, { AndroidSuccessTypes } from 'react-native-sms'

/**
 * Various utils methods.
 */
class Utils {
    private static instance: Utils;

    private constructor() { }

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

    public sendSms(text:string) {
        SendSMS.send({
            body: text,
            // @ts-ignore
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true
        }, (completed:boolean, cancelled:boolean, error:boolean) => {
            console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
        });
    }
}

export const utils = Utils.getInstance();