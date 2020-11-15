import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'
import { appConfig } from '../app/appConfig';

const translationGetters: { [language: string]: any } = {
    // en: () => require('./en.json'),
    en: () => require('./en.json'),
    sr: () => require('./sr.json')
}

/**
 * Function that returns a translation for the given key.
 * 
 * ```
 * translate('Good morning')
 * ```
 */
export const translate = memoize(
    (key, config = null) => i18n.t(key, config),
    (key, config = null) => (config ? key + JSON.stringify(config) : key)
);

export const setI18nConfig = () => {
    const fallback = { languageTag: 'en' };

    const { languageTag } =
        RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
        fallback;

    if (translate?.cache?.clear) {
        translate.cache.clear();
    }

    let tag = "";
    let forcedLanguage = appConfig.forceOneLanguage;

    if(forcedLanguage && forcedLanguage !== ""){
        tag = forcedLanguage
    }else{
        tag = languageTag;
    };

    i18n.translations = { [tag]: translationGetters[tag]() }
    i18n.locale = tag;
}

// Call setI18nConfig when user changes the language.
RNLocalize.addEventListener('change', setI18nConfig);
setI18nConfig();