import { translate } from '../../translations/translate';
import { translateData, TranslateDataDoctorVisitPeriods } from '../../translationsData/translateData';
import { Props as  DoctorVisitCardProps, DoctorVisitCardItemIcon, DoctorVisitCardButtonType, DoctorVisitTitleIconType} from '../../components/doctor-visit/DoctorVisitCard';
import { dataRealmStore } from '..';
import { userRealmStore } from '../userRealmStore';
import { Measures } from '../ChildEntity';
import { DateTime } from 'luxon';

export function getDoctorVisitCardsBirthdayIsNotSet(): DoctorVisitCardProps[] {
    let rval: DoctorVisitCardProps[] = [];

    // REQUIRED DATA
    const doctorVisitPeriods = translateData('doctorVisitPeriods') as (TranslateDataDoctorVisitPeriods);
    if (!doctorVisitPeriods) return [];

    // BIRTHDAY IS NOT ENTERED
    doctorVisitPeriods.forEach((doctorVisit, index) => {
        rval.push({
            title: doctorVisit.nameOfTheDoctorVisit,
            subTitle: doctorVisit.periodSubtitle,
            items: [
                {
                    icon: DoctorVisitCardItemIcon.Syringe,
                    text: translate('doctorVisitsVaccineDataNotEntered'),
                },
                {
                    icon: DoctorVisitCardItemIcon.Weight,
                    text: translate('doctorVisitsMeasuresNotEntered'),
                },
            ],
            buttons: [
                {
                    type: DoctorVisitCardButtonType.Text,
                    text: translate('doctorVisitsReadMore'),
                    onPress: () => {
                        if (doctorVisit.moreAboutDoctorVisitArticleId && doctorVisit.moreAboutDoctorVisitArticleId !== 0) {
                            dataRealmStore.openArticleScreen(doctorVisit.moreAboutDoctorVisitArticleId);
                        }
                    },
                }
            ],
            showVerticalLine: index !== doctorVisitPeriods.length - 1,
        });
    });

    return rval;
}

export function getDoctorVisitCardsBirthdayIsSet(): DoctorVisitCardProps[] {
    let rval: DoctorVisitCardProps[] = [];

    // SET doctorVisitPeriods
    const doctorVisitPeriods = translateData('doctorVisitPeriods') as (TranslateDataDoctorVisitPeriods);
    if (!doctorVisitPeriods) return [];

    // SET regularAndAdditionalMeasures
    const regularAndAdditionalMeasures = userRealmStore.getRegularAndAdditionalMeasures();

    // SET regularCards
    const regularCards: DoctorVisitCardProps[] = [];

    doctorVisitPeriods.forEach((doctorVisitPeriod) => {
        // SET thisPeriodMeasures
        let thisPeriodMeasures: Measures | null = null;

        regularAndAdditionalMeasures.regularMeasures.forEach((value) => {
            if (value.doctorVisitPeriodUuid === doctorVisitPeriod.uuid) {
                thisPeriodMeasures = value.measures;
            }
        });

        // SET measuresEnteredType
        let measuresEnteredType: MeasuresEnteredType = MeasuresEnteredType.NotEntered;

        if (thisPeriodMeasures !== null) {
            const m = thisPeriodMeasures as Measures;

            if (
                m.isChildMeasured && m.length && m.length !== '' && m.weight && m.weight !== ''
                && m.didChildGetVaccines && m.vaccineIds && Array.isArray(m.vaccineIds) && m.vaccineIds.length > 0
            ) {
                measuresEnteredType = MeasuresEnteredType.EnteredFully;
            } else {
                measuresEnteredType = MeasuresEnteredType.EnteredIncomplete;
            }
        }

        // CREATE CARD

        // Card values
        let cardTitle = '';
        let cardSubTitle = '';
        let cardTitleIcon: DoctorVisitTitleIconType | undefined = undefined;

        if (thisPeriodMeasures !== null) {
            // cardTitle
            cardTitle = doctorVisitPeriod.periodSubtitle;

            // cardSubTitle
            let cardMeasurementMillis = (thisPeriodMeasures as Measures).measurementDate;
            if (cardMeasurementMillis) {
                let cardMeasurementDateTime = DateTime.fromMillis(cardMeasurementMillis);
                cardSubTitle = cardMeasurementDateTime.toLocaleString(DateTime.DATE_MED);
            }

            // cardTitleIcon
            if (measuresEnteredType === MeasuresEnteredType.EnteredFully) {
                cardTitleIcon = DoctorVisitTitleIconType.Checked;
            }
            if (measuresEnteredType === MeasuresEnteredType.EnteredIncomplete) {
                cardTitleIcon = DoctorVisitTitleIconType.Info;
            }
        } else {
            cardTitle = doctorVisitPeriod.nameOfTheDoctorVisit;
            cardSubTitle = doctorVisitPeriod.periodSubtitle;
        }

        // Create card
        regularCards.push({
            title: cardTitle,
            subTitle: cardSubTitle,
            items: [],
            titleIcon: cardTitleIcon,
            buttons: [
                {
                    type: DoctorVisitCardButtonType.Text,
                    text: translate('doctorVisitsReadMore'),
                    onPress: () => { dataRealmStore.openArticleScreen(doctorVisitPeriod.moreAboutDoctorVisitArticleId) },
                }
            ]
        });
    });

    // COMBINE CARDS
    rval = regularCards;

    // SET showVerticalLine
    rval[rval.length - 1].showVerticalLine = false;

    return rval;
}

enum MeasuresEnteredType {
    EnteredFully,
    EnteredIncomplete,
    NotEntered,
};