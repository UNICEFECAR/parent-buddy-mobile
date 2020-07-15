import { Message, IconType } from "../components/HomeMessages";
import { dataRealmStore, userRealmStore } from "../stores";
import { DailyMessageEntity, DailyMessageEntitySchema } from "../stores/DailyMessageEntity";
import { appConfig } from "./appConfig";
import { DateTime } from 'luxon';
import { translate } from "../translations/translate";
import { RoundedButtonType } from "../components/RoundedButton";
import { navigation } from ".";

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

        // Daily message
        const dailyMessage = this.getDailyMessage();
        if (dailyMessage) rval.push(dailyMessage);

        // Enter birthday messages
        const enterBirthdayMessages = this.getEnterBirthdayMessages();
        if (enterBirthdayMessages.length > 0) rval = rval.concat(enterBirthdayMessages);

        // Upcomming milestone message
        const upcommingMilestoneMessage = this.getUpcommingMilestoneMessage();
        if (upcommingMilestoneMessage) rval.push(upcommingMilestoneMessage);

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

        return rval;
    }

    private getEnterBirthdayMessages(): Message[] {
        let rval: Message[] = [];

        // Get currentChild
        const currentChild = userRealmStore.getCurrentChild();
        if (!currentChild) return [];

        if (!currentChild.birthDate) {
            // Message: Child has its profile
            let messageText = translate('homeMessageChildHasItsProfile');

            let childName = '';
            if (currentChild.name) childName = currentChild.name;
            childName = childName.charAt(0).toUpperCase() + childName.slice(1)

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

    private getUpcommingMilestoneMessage(): Message | null {
        let rval: Message | null = null;

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