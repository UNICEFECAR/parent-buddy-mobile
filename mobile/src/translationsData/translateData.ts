import { dataRealmStore } from "../stores";
import * as RNLocalize from 'react-native-localize'
import { en } from './en';
import { sr } from './sr';

export function translateData(key: TranslateDataKey): TranslateDataValue {
    let data: any = null;
    if (!languageCode) languageCode = getLanguageCode();

    if (languageCode === 'en') data = en;
    if (languageCode === 'sr') data = sr;

    if (data && data[key]) {
        return data[key];
    }

    return null;
}

let languageCode: string | null = null;
type TranslateDataKey = keyof typeof en;
type TranslateDataValue = typeof en[TranslateDataKey] | null;

function getLanguageCode() {
    return dataRealmStore.getVariable('languageCode');
}

RNLocalize.addEventListener('change', () => {
    languageCode = getLanguageCode();
});