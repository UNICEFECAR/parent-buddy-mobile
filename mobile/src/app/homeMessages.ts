import { Message, IconType } from "../components/HomeMessages";
import { dataRealmStore, userRealmStore, ChildEntity } from "../stores";
import { DailyMessageEntity, DailyMessageEntitySchema } from "../stores/DailyMessageEntity";
import { appConfig } from "./appConfig";
import { DateTime } from 'luxon';
import { translate } from "../translations/translate";
import { RoundedButtonType } from "../components/RoundedButton";
import { navigation } from ".";
import { translateData } from "../translationsData/translateData";
import { utils } from "./utils";

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
    private currentChild: ChildEntity | undefined;
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

        // Get current child
        this.currentChild = userRealmStore.getCurrentChild();

        // Upcomming development period message
        const upcommingDevelopmentPeriodMessage = this.getUpcommingDevelopmentPeriodMessage();
        if (upcommingDevelopmentPeriodMessage) rval.push(upcommingDevelopmentPeriodMessage);

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
                textStyle: {fontWeight:'bold'},
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

        // console.log('babyAgeInDays', babyAgeInDays);
        developmentPeriods?.forEach((value, index) => {
            // console.log('value.daysStart', value.daysStart);
            // console.log('value.daysStart - babyAgeInDays > 0', value.daysStart - babyAgeInDays > 0);
            // console.log('value.daysStart - babyAgeInDays < 10', value.daysStart - babyAgeInDays < 10);
            // console.log('--------');

            if (
                (value.daysStart - babyAgeInDays > 0)
                && (value.daysStart - babyAgeInDays <= 10)
            ) {
                if (value.homeMessage) {
                    activePeriodHomeMessage = value.homeMessage;
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
                textStyle: {fontWeight:'bold'},
                iconType: IconType.celebrate,
            };
        }

        return rval;
    }

    private getGrowthMessages(): Message[] {
        let rval: Message[] = [];

        // Get currentChild
        if (!this.currentChild || !this.currentChild.birthDate) {
            return [];
        }

        return rval;
    }

    /**
     * Growth message should be shown if 
     */
    private shouldGrowthMessageBeShown(childEntity: ChildEntity): boolean {
        let rval = false;

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