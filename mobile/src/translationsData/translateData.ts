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

export type TranslateDataDevelopmentPeriods = typeof en['developmentPeriods'];
export type TranslateDataGrowthPeriods = typeof en['growthPeriods'];
export type TranslateDataGrowthPeriodsMessages = typeof en['growthPeriodsMessages'];
export type TranslateDataDoctorVisitPeriods = typeof en['doctorVisitPeriods'];
export type HealthCheckPeriod = TranslateDataGrowthPeriodsMessages[0];
export type TranslateDataInterpretationWeightForHeight = typeof en['interpretationWeightForHeight'];
export type TranslateDataInterpretationLenghtForAge = typeof en['interpretationLenghtForAge'];
export type ImmunizationsPeriods = typeof en['immunizationsPeriods'];

type TranslateDataValue =
    TranslateDataDevelopmentPeriods
    | TranslateDataGrowthPeriods
    | TranslateDataGrowthPeriodsMessages
    | TranslateDataDoctorVisitPeriods
    | TranslateDataInterpretationWeightForHeight
    | TranslateDataInterpretationLenghtForAge
    | ImmunizationsPeriods
    | null;

function getLanguageCode() {
    return dataRealmStore.getVariable('languageCode');
}

RNLocalize.addEventListener('change', () => {
    languageCode = getLanguageCode();
});