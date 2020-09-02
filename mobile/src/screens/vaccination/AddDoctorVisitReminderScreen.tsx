import React, { Component, useDebugValue } from 'react'
import { View, StyleSheet, ViewStyle, } from 'react-native'
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { DateTimePicker, DateTimePickerType } from '../../components/DateTimePicker';
import { Typography, TypographyType } from '../../components/Typography';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { scale, moderateScale } from 'react-native-size-matters';
import { translate } from '../../translations/translate';
import { userRealmStore } from '../../stores';
import Icon from 'react-native-vector-icons/EvilIcons';

import { NavigationStackState, NavigationStackProp } from 'react-navigation-stack';
import { DateTime } from 'luxon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Reminder } from '../../stores/ChildEntity';
import { stat } from 'react-native-fs';

const colorError = "#EB4747"

export interface AddDoctorVisitReminderScreenParams {
    reminder: Reminder
}
export interface Props {
    navigation: NavigationStackProp<NavigationStackState, AddDoctorVisitReminderScreenParams>;
}

export interface State {
    doctorVisitDate: DateTime | null,
    doctorVisitTime: DateTime | null,
    screenType: AddDoctorVisitReminderScreenType,
    uuid?: string,
};


export class AddDoctorVisitReminderScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.initState();
    };

    private initState = () => {

        let date = null;
        let time = null;
        let uuid = "";
        let screenType = AddDoctorVisitReminderScreenType.newReminder;

        if(this.props.navigation.state.params?.reminder){

            date = DateTime.fromMillis(this.props.navigation.state.params.reminder.date);
            time = DateTime.fromMillis(this.props.navigation.state.params.reminder.time);
            uuid = this.props.navigation.state.params.reminder.uuid;
            screenType = AddDoctorVisitReminderScreenType.updateReminder;

        }else{
            date = null;
            time = null;
            uuid = "";
            screenType = AddDoctorVisitReminderScreenType.newReminder;
        }

        let state = {
            doctorVisitDate: date,
            doctorVisitTime: time,
            uuid: uuid,
            screenType: screenType,
        };

        this.state = state;
    };

    private setDateAndTIme = (value: Date, type: "date" | "time") => {
        if(type === "date"){
            this.setState({
                doctorVisitDate: DateTime.fromJSDate(value),
            });
        }else{
            this.setState({
                doctorVisitTime: DateTime.fromJSDate(value),
            });
        };
    };

    private setReminder(){
        if(this.state.doctorVisitDate !== null && this.state.doctorVisitTime !== null){

            let date = this.state.doctorVisitDate.toMillis();
            let time = this.state.doctorVisitTime.toMillis();
            let uuid = this.state.uuid;
            
            if(this.state.screenType === AddDoctorVisitReminderScreenType.newReminder){
                userRealmStore.addReminder(date, time);
            }else{
                // fuunction for update reminder here 
            }
        };
    };

    render() {
        
        
        console.log(JSON.stringify(userRealmStore.getActiveReminders(), null, 4), "ACTIVE REMINDERS")
        let date = this.state.doctorVisitDate ? this.state.doctorVisitDate.toJSDate() : undefined;
        let time = this.state.doctorVisitTime ? this.state.doctorVisitTime.toJSDate() : undefined;

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <>
                        <KeyboardAwareScrollView
                            style={{ backgroundColor: 'white' }}
                            keyboardShouldPersistTaps='handled'
                            contentContainerStyle={[styles.container]}
                        >
                            <View>
                                <View style={{flexDirection: 'row', alignContent: "center",marginBottom: 20, marginLeft: -10}}>
                                    <Icon name="clock" style={{fontSize: moderateScale(22), color: '#2BABEE'}} />
                                    <Typography>TODO Upišite datum i vreme zakazanog pregleda i HaloBeba će Vas podsetiti.</Typography>
                                </View>
                                <DateTimePicker
                                    label={translate("NewDoctorVisitScreenDatePickerLabel")}
                                    onChange={(value) => this.setDateAndTIme(value, "date")}
                                    minimumDate={new Date()}
                                    style={{marginBottom: 20}}
                                    value={date}
                                />
                                <DateTimePicker
                                    type={DateTimePickerType.time}
                                    label={translate("NewDoctorVisitScreenDatePickerLabel")}
                                    onChange={(value) => this.setDateAndTIme(value, "time")}
                                    minimumDate={new Date()}
                                    style={{marginBottom: 20}}
                                    value={time}
                                // style={this.state.visitDateError !== "" ? { borderColor: colorError, borderWidth: 1, borderRadius: 27 } : null}
                                />
                                {/* {
                                    this.state.visitDateError !== "" ?
                                        <Typography style={{ color: colorError, fontSize: moderateScale(15) }}>{this.state.visitDateError}</Typography>
                                        : null
                                } */}
                            </View>


                            <View>
                                <RoundedButton
                                    text={translate("newMeasureScreenSaveBtn")}
                                    type={RoundedButtonType.purple}
                                    onPress={() => this.setReminder()}
                                />
                            </View>
                        </KeyboardAwareScrollView>
                    </>
                )}
            </ThemeConsumer>

        )
    }
}


enum AddDoctorVisitReminderScreenType{
    newReminder,
    updateReminder,
};

export interface AddDoctorVisitReminderScreenStyles {
    container: ViewStyle,
};

const styles = StyleSheet.create<AddDoctorVisitReminderScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    }
});

