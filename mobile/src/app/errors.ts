import { Linking, Alert } from "react-native";
import { dataRealmStore, userRealmStore } from "../stores";
import { UserRealmContextValue } from "../stores/UserRealmContext";

/**
 * Redefines global error handler.
 */
export function initGlobalErrorHandler() {
    // During development, RN doesn't crash the app when error happens.
    // It shows the LogBox, and we will not change that.
    if (__DEV__) {
        return;
    }

    // In production, RN will crash the app on error, and we don't want that.
    ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
        // Log error to Firebase Crashlytics
        sendErrorReportWithCrashlytics(error);

        // Give user an option to send bug report
        Alert.alert(
            'ERROR HAPPENED',
            'Send report to Byteout',
            [
                { text: 'Ok', onPress: () => { sendErrorReportWithEmail(error) } },
                { text: 'Cancel', style: 'cancel', },
            ],
        );
    });
}

export function sendErrorReportWithEmail(error: any) {
    const unknownError = new UnknownError(error);

    const mailSubject = `HaloBeba bug report`;

    // Message
    let mailBody = `${unknownError.name}: ${unknownError.message}\n\n`;

    // Data realm variables
    try {
        if (dataRealmStore && dataRealmStore.realm && !dataRealmStore.realm.isClosed) {
            const dataRealmVariables = {
                'countryCode': dataRealmStore.getVariable('countryCode'),
                'currentActiveChildId': dataRealmStore.getVariable('currentActiveChildId'),
                'languageCode': dataRealmStore.getVariable('languageCode'),
                'lastSyncTimestamp': dataRealmStore.getVariable('lastSyncTimestamp'),
                'loginMethod': dataRealmStore.getVariable('loginMethod'),
                'userEmail': dataRealmStore.getVariable('userEmail'),
            };
    
            mailBody += 'DATA REALM VARIABLES:\n' + JSON.stringify(dataRealmVariables, null, 4) + '\n\n';
        }
    } catch(e) {};

    // User realm variables
    try {
        if (userRealmStore && userRealmStore.realm && !userRealmStore.realm.isClosed) {
            const userRealmVariables = {
                'userData': userRealmStore.getVariable('userData'),
                'userChildren': userRealmStore.getVariable('userChildren'),
                'checkedMilestones': userRealmStore.getVariable('checkedMilestones'),
            };
    
            mailBody += 'USER REALM VARIABLES:\n' + JSON.stringify(userRealmVariables, null, 4) + '\n\n';
        }
    } catch(e) {}

    // Children
    try {
        let allChildren = userRealmStore.getAllChilds({realm:userRealmStore.realm} as UserRealmContextValue);
        mailBody += `CHILDREN:\n${JSON.stringify(allChildren, null, 4)}\n\n`;
    } catch(e) {}

    // Stack
    try {
        mailBody += (unknownError.stack ? 'ERROR STACK:\n' + unknownError.stack : 'Please describe error here');
    } catch(e) {}

    const mailUrl = `mailto:office@byteout.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    Linking.openURL(mailUrl);
}

export function sendErrorReportWithCrashlytics(error: any, componentStack?: string) {
    const unknownError = new UnknownError(error);
}

// GENERAL ERRORS
export class UnknownError extends Error {
    constructor(error: any) {
        let message = '';

        if (typeof error === 'string') {
            message = error;
        } else if (typeof error === 'number') {
            message = error + '';
        } else if (error instanceof Error) {
            message = error.message;
        } else {
            message = JSON.stringify(error, null, 4);
        };

        super(message);

        if (error instanceof Error) {
            this.name = error.name;
        }
    }
};