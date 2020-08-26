import { translate } from '../../translations/translate';
import { translateData, TranslateDataDoctorVisitPeriods } from '../../translationsData/translateData';
import { Props as  DoctorVisitCardProps, DoctorVisitCardItemIcon, DoctorVisitCardButtonType} from '../../components/doctor-visit/DoctorVisitCard';
import { dataRealmStore } from '..';

export function getDoctorVisitCardsNoBirthday(): DoctorVisitCardProps[] {
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