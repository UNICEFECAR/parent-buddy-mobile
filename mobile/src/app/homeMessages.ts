import { Message, IconType } from "../components/HomeMessages";
import { dataRealmStore, userRealmStore, ChildEntity } from "../stores";
import { DailyMessageEntity, DailyMessageEntitySchema } from "../stores/DailyMessageEntity";
import { appConfig } from "./appConfig";
import { DateTime } from 'luxon';
import { translate } from "../translations/translate";
import { RoundedButtonType } from "../components/RoundedButton";
import { navigation } from ".";
import { translateData, TranslateDataHealthCheckPeriods, HealthCheckPeriod } from "../translationsData/translateData";
import { utils } from "./utils";
import { Measures } from "../stores/ChildEntity";

/**
 * Home messages logic is here.
 * 
 * ### USAGE
 * 
 * ```
 * const messages = homeMessages.getMessages();
 * ```
 */
class HomeMessages {
    private currentChild?: ChildEntity;
    private childAgeInDays?: number;
    private static instance: HomeMessages;

    private constructor() { }

    static getInstance(): HomeMessages {
        if (!HomeMessages.instance) {
            HomeMessages.instance = new HomeMessages();
        }
        return HomeMessages.instance;
    }

    public getMessages(): Message[] {
        let rval: Message[] = [];

        // Set properties
        this.currentChild = userRealmStore.getCurrentChild();
        this.childAgeInDays = userRealmStore.getCurrentChildAgeInDays();

        // console.log('this.childAgeInDays', this.childAgeInDays);

        // Upcomming development period message
        const upcommingDevelopmentPeriodMessage = this.getUpcommingDevelopmentPeriodMessage();
        if (upcommingDevelopmentPeriodMessage) rval.push(upcommingDevelopmentPeriodMessage);

        // Ongoing development period message
        const ongoingDevelopmentPeriodMessage = this.getOngoingDevelopmentPeriodMessage();
        if (ongoingDevelopmentPeriodMessage) rval.push(ongoingDevelopmentPeriodMessage);

        // Enter birthday messages
        const enterBirthdayMessages = this.getEnterBirthdayMessages();
        if (enterBirthdayMessages.length > 0) rval = rval.concat(enterBirthdayMessages);

        // Daily message
        const dailyMessage = this.getDailyMessage();
        if (dailyMessage) rval.push(dailyMessage);

        // Growth messages
        const growthMessages = this.getGrowthMessages();
        if (growthMessages.length > 0) rval = rval.concat(growthMessages);

        return rval;
    }

    private getDailyMessage(): Message | null {
        let rval: Message | null = null;

        const dailyMessageVariable = dataRealmStore.getVariable('dailyMessage');

        // DAILY MESSAGE VARIABLE WAS NEVER SET
        if (!dailyMessageVariable) {
            try {
                // Set firstDailyMessageEntity
                let firstDailyMessageEntity: DailyMessageEntity | null = null;
                let allRecords = dataRealmStore.realm?.objects<DailyMessageEntity>(DailyMessageEntitySchema.name)
                    .sorted('id');

                const justFirstInArray = allRecords?.slice(0, 1);
                if (justFirstInArray && justFirstInArray[0]) {
                    firstDailyMessageEntity = justFirstInArray[0];
                }

                // Set newDailyMessageVariable
                let newDailyMessageVariable: DailyMessageVariable | null = null;

                if (firstDailyMessageEntity) {
                    let currentDate = DateTime.local();

                    newDailyMessageVariable = {
                        messageId: firstDailyMessageEntity.id,
                        messageText: firstDailyMessageEntity.title,
                        day: currentDate.day,
                        month: currentDate.month,
                        year: currentDate.year,
                    };

                    dataRealmStore.setVariable('dailyMessage', newDailyMessageVariable);

                    rval = {
                        text: newDailyMessageVariable.messageText,
                    };
                }
            } catch (e) {
                if (appConfig.showLog) console.log(e);
            }
        }

        // CHECK IF DAILY MESSAGE VARIABLE NEEDS TO BE UPDATED
        let dailyMessageVariableNeedsUpdate = false;

        if (dailyMessageVariable) {
            const currentDate = DateTime.local();

            if (
                dailyMessageVariable.day != currentDate.day
                || dailyMessageVariable.month != currentDate.month
                || dailyMessageVariable.year != currentDate.year
            ) {
                dailyMessageVariableNeedsUpdate = true;
            }
        }

        // USE CURRENT DAILY MESSAGE VARIABLE
        if (dailyMessageVariable && !dailyMessageVariableNeedsUpdate) {
            rval = {
                text: dailyMessageVariable.messageText,
            };
        }

        // UPATE DAILY MESSAGE VARIABLE
        if (dailyMessageVariable && dailyMessageVariableNeedsUpdate) {
            // Load all daily messages from realm
            let allDailyMessageEntities: DailyMessageEntity[] | undefined = undefined;

            const allRecords = dataRealmStore.realm?.objects<DailyMessageEntity>(DailyMessageEntitySchema.name)
                .sorted('id');

            allDailyMessageEntities = allRecords?.map(value => value);

            if (allDailyMessageEntities) {
                // Find the index of current daily message
                let currentIndex: number | null = null;

                allDailyMessageEntities.forEach((value, index) => {
                    if (value.id == dailyMessageVariable.messageId) {
                        currentIndex = index;
                    }
                });

                if (currentIndex !== null) {
                    // Find next index
                    let nextIndex = currentIndex + 1;

                    if (nextIndex >= allDailyMessageEntities.length) {
                        nextIndex = 0;
                    }

                    // Set next daily message entity
                    let nextDailyMessageEntity = allDailyMessageEntities[nextIndex];

                    // Save next daily message entity into variable
                    const currentDate = DateTime.local();

                    dataRealmStore.setVariable('dailyMessage', {
                        messageId: nextDailyMessageEntity.id,
                        messageText: nextDailyMessageEntity.title,
                        day: currentDate.day,
                        month: currentDate.month,
                        year: currentDate.year,
                    });

                    // Set rval
                    rval = {
                        text: nextDailyMessageEntity.title,
                    };
                }
            }
        }

        if (rval) {
            rval.iconType = IconType.heart;
        }

        return rval;
    }

    private getEnterBirthdayMessages(): Message[] {
        let rval: Message[] = [];

        // Get currentChild
        if (!this.currentChild) return [];

        if (!this.currentChild.birthDate) {
            // Message: Child has its profile
            let messageText = translate('homeMessageChildHasItsProfile');

            let childName = '';
            if (this.currentChild.name) childName = this.currentChild.name;
            childName = utils.upperCaseFirstLetter(childName);

            messageText = messageText.replace('%CHILD%', childName);

            rval.push({
                text: messageText,
                textStyle: { fontWeight: 'bold' },
                iconType: IconType.celebrate,
            });

            // Message: Enter baby data
            rval.push({
                text: translate('homeMessageEnterBabyData'),
                button: {
                    text: translate('homeMessageEnterBabyDataButton'),
                    type: RoundedButtonType.purple,
                    onPress: () => {
                        navigation.navigate('HomeStackNavigator_BirthDataScreen');
                    }
                }
            });
        }

        return rval;
    }

    private getUpcommingDevelopmentPeriodMessage(): Message | null {
        let rval: Message | null = null;

        if (!this.currentChild || !this.currentChild.birthDate) return null;

        // Set babyBirthday, currentDate
        const babyBirthDate = DateTime.fromJSDate(this.currentChild.birthDate);
        const currentDate = DateTime.local();

        // Set babyAgeInDays
        const diffDate = currentDate.diff(babyBirthDate, 'days');
        let babyAgeInDays = diffDate.get('days');

        if (babyAgeInDays < 0) return null;
        babyAgeInDays = Math.ceil(babyAgeInDays);

        // Get all development periods
        const developmentPeriods = translateData('developmentPeriods');

        // Find active period
        let activePeriodHomeMessage: string | null = null;

        developmentPeriods?.forEach((value: any, index: any) => {
            if (
                (value.daysStart - babyAgeInDays > 0)
                && (value.daysStart - babyAgeInDays <= 10)
            ) {
                if (value.homeMessageBefore) {
                    activePeriodHomeMessage = value.homeMessageBefore;
                }
            }
        });

        // Add message for active period
        if (activePeriodHomeMessage) {
            let homeMessage: string = activePeriodHomeMessage;
            let childName = this.currentChild.name;
            childName = utils.upperCaseFirstLetter(childName);

            homeMessage = homeMessage.replace('%CHILD%', childName);

            rval = {
                text: homeMessage,
                textStyle: { fontWeight: 'bold' },
                iconType: IconType.celebrate,
            };
        }

        return rval;
    }

    private getOngoingDevelopmentPeriodMessage(): Message | null {
        let rval: Message | null = null;

        if (!this.currentChild || !this.currentChild.birthDate) return null;

        // Set babyBirthday, currentDate
        const babyBirthDate = DateTime.fromJSDate(this.currentChild.birthDate);
        const currentDate = DateTime.local();

        // Set babyAgeInDays
        const diffDate = currentDate.diff(babyBirthDate, 'days');
        let babyAgeInDays = diffDate.get('days');

        if (babyAgeInDays < 0) return null;
        babyAgeInDays = Math.ceil(babyAgeInDays);

        // Get all development periods
        const developmentPeriods = translateData('developmentPeriods');

        // Find active period
        let activePeriodHomeMessage: string | null = null;

        developmentPeriods?.forEach((value: any, index: any) => {
            if (
                (babyAgeInDays - value.daysStart >= 0)
                && (babyAgeInDays - value.daysStart <= 10)
            ) {
                if (value.homeMessageAfter) {
                    activePeriodHomeMessage = value.homeMessageAfter;
                }
            }
        });

        // Add message for active period
        if (activePeriodHomeMessage) {
            let homeMessage: string = activePeriodHomeMessage;
            let childName = this.currentChild.name;
            childName = utils.upperCaseFirstLetter(childName);

            homeMessage = homeMessage.replace('%CHILD%', childName);

            rval = {
                text: homeMessage,
                textStyle: { fontWeight: 'bold' },
                iconType: IconType.celebrate,
            };
        }

        return rval;
    }

    private getGrowthMessages(): Message[] {
        let rval: Message[] = [];

        // Set currentHealthCheckPeriod
        const currentHealthCheckPeriod = this.getCurrentHealthCheckPeriod();

        // Is child currently in helath check period?
        if (!currentHealthCheckPeriod) {
            return [];
        }

        // Set measuresForHealthCheckPeriod
        const measuresForHealthCheckPeriod = this.getMeasuresForHealthCheckPeriod(currentHealthCheckPeriod);

        // Show "Measurement data is NOT entered"
        if (!measuresForHealthCheckPeriod) {
            rval.push({
                text: translate('homeMessageGrowthMeasurementNotEntered'),
                iconType: IconType.growth,
                button: {
                    text: translate('homeMessageGrowthAddMeasurementButton'),
                    type: RoundedButtonType.purple,
                    onPress: () => { navigation.navigate('HomeStackNavigator_NewMeasurementScreen'); }
                }
            });
        }

        // Show "Measurement data is entered"
        if (measuresForHealthCheckPeriod && this.currentChild?.gender && this.childAgeInDays) {
            const interpretationLengthForAge = userRealmStore.getInterpretationLenghtForAge(this.currentChild?.gender, measuresForHealthCheckPeriod);
            const interpretationWeightForHeight = userRealmStore.getInterpretationWeightForHeight(this.currentChild?.gender, this.childAgeInDays, measuresForHealthCheckPeriod);

            const measureIsGood = interpretationLengthForAge.goodMeasure && interpretationWeightForHeight.goodMeasure;

            let intepretationText: string = '';
            if (measureIsGood) {
                intepretationText = translate('homeMessageGrowthMeasurementsOk').replace('%CHILD%', utils.upperCaseFirstLetter(this.currentChild.name));
            } else {
                intepretationText = translate('homeMessageGrowthMeasurementsBad');
            }

            rval.push({
                text: translate('homeMessageGrowthMeasurementEntered') + ' ' + intepretationText,
                iconType: IconType.growth,
            });
        }

        return rval;
    }

    private getCurrentHealthCheckPeriod(): HealthCheckPeriod | null {
        let rval: HealthCheckPeriod | null = null;

        // Validation
        if (this.childAgeInDays === undefined) return null;

        // Set healthCheckPeriods
        let healthCheckPeriods = translateData('healthCheckPeriods') as (TranslateDataHealthCheckPeriods | null);

        if (!healthCheckPeriods || healthCheckPeriods.length === 0) {
            return null;
        }

        // Go over all healthCheckPeriods
        const childAgeInDays = this.childAgeInDays;

        healthCheckPeriods.forEach((period) => {
            if (
                childAgeInDays >= period.showGrowthMessageInDays.from
                && childAgeInDays <= period.showGrowthMessageInDays.to
            ) {
                rval = period;
            }
        });

        return rval;
    }

    private getMeasuresForHealthCheckPeriod(healthCheckPeriod: HealthCheckPeriod | null): Measures | null {
        let rval: Measures | null = null;

        // Validation
        if (!this.currentChild || !this.currentChild.measures) {
            return null;
        }

        if (!healthCheckPeriod || !healthCheckPeriod.childAgeInDays.from || !healthCheckPeriod.childAgeInDays.to) {
            return null;
        }

        // Set allMesaures
        const allMeasures = JSON.parse(this.currentChild.measures) as Measures[];

        // Set importantMeasures
        const importantMeasures: Measures[] = [];

        allMeasures.forEach((measure) => {
            const childBirtDateTimestampMills = this.currentChild?.birthDate?.getTime();
            const currentMesaureDateTimestampMills = measure.measurementDate;

            if (
                childBirtDateTimestampMills
                && currentMesaureDateTimestampMills
                && currentMesaureDateTimestampMills >= childBirtDateTimestampMills
            ) {
                const measureChildAgeInDays = Math.ceil((currentMesaureDateTimestampMills / 1000 - childBirtDateTimestampMills / 1000) / (60 * 60 * 24));

                if (
                    measureChildAgeInDays >= healthCheckPeriod?.childAgeInDays.from
                    && measureChildAgeInDays <= healthCheckPeriod?.childAgeInDays.to
                ) {
                    importantMeasures.push(measure);
                }
            }
        });

        // Set newestImportantMeasure
        importantMeasures.sort((a, b) => {
            if (!a.measurementDate || !b.measurementDate) return 0;
            if (a.measurementDate > b.measurementDate) return -1;
            if (a.measurementDate < b.measurementDate) return 1;
            if (a.measurementDate == b.measurementDate) return 0;
            return 0;
        });

        // Return the latest measure
        if (importantMeasures && importantMeasures.length > 0) {
            rval = importantMeasures[0];
        }

        return rval;
    }
}

export interface DailyMessageVariable {
    messageId: number;
    messageText: string;
    day: number;
    month: number;
    year: number;
}

export const homeMessages = HomeMessages.getInstance();