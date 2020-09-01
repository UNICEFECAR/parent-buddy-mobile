import React, { Component } from 'react'
import { View, StyleSheet, ViewStyle, Text, TextStyle } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { RadioButtons } from '../../components/RadioButtons';
import { DateTimePicker, DateTimePickerType } from '../../components/DateTimePicker';
import { RoundedTextArea } from '../../components/RoundedTextArea';
import { Typography, TypographyType } from '../../components/Typography';
import { RoundedTextInput } from '../../components/RoundedTextInput';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { scale, moderateScale } from 'react-native-size-matters';
import { translate } from '../../translations/translate';
import { userRealmStore, dataRealmStore } from '../../stores';
import { Vaccine } from '../../components/vaccinations/oneVaccinations';
import Icon from 'react-native-vector-icons/EvilIcons';
import { Checkbox, Snackbar } from 'react-native-paper';
import { Measures } from '../../stores/ChildEntity';
import { NavigationStackState, NavigationStackProp } from 'react-navigation-stack';
import { StackActions } from 'react-navigation';
import { navigation } from '../../app';
import { DateTime } from 'luxon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const colorError = "#EB4747"

export interface AddDoctorVisitReminderScreenParams {
    screenType: AddDoctorVisitReminderScreenType;
}
export interface Props {
    navigation: NavigationStackProp<NavigationStackState, AddDoctorVisitReminderScreenParams>;
}

export interface State {
    doctorVisitDate: Date | null,
    doctorVisitTime: Date | null,
};


export class AddDoctorVisitReminderScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.initState()
    };

    private initState = () => {
        let state = {
            doctorVisitDate: null,
            doctorVisitTime: null,
        };

        this.state = state;
    };

    private setDateAndTIme = (value: Date, type: "date" | "time") => {
        if(type === "date"){
            this.setState({
                doctorVisitDate: value,
            });
        }else{
            this.setState({
                doctorVisitTime: value,
            });
        };
    };

    private setReminder(){
        if(this.state.doctorVisitDate !== null && this.state.doctorVisitTime !== null){

            let date = DateTime.fromJSDate(this.state.doctorVisitDate).toMillis();
            let time = DateTime.fromJSDate(this.state.doctorVisitTime).toMillis();
            
            userRealmStore.addReminder(date, time);
        };
    };

    render() {
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
                                // style={this.state.visitDateError !== "" ? { borderColor: colorError, borderWidth: 1, borderRadius: 27 } : null}
                                />
                                <DateTimePicker
                                    type={DateTimePickerType.time}
                                    label={translate("NewDoctorVisitScreenDatePickerLabel")}
                                    onChange={(value) => this.setDateAndTIme(value, "time")}
                                    minimumDate={new Date()}
                                    style={{marginBottom: 20}}
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
                        {/* <Snackbar
                            visible={this.state.isSnackbarVisible}
                            duration={Snackbar.DURATION_SHORT}
                            onDismiss={() => { this.setState({ isSnackbarVisible: false }) }}
                            theme={{ colors: { onSurface: "red", accent: 'white' } }}
                            action={{
                                label: 'Ok',
                                onPress: () => {
                                    this.setState({ isSnackbarVisible: false });
                                },
                            }}
                        >
                            <Text style={{ fontSize: moderateScale(16) }}>
                                {this.state.snackbarMessage}
                            </Text>
                        </Snackbar> */}
                    </>
                )}
            </ThemeConsumer>

        )
    }
}


export interface AddDoctorVisitReminderScreenStyles {
    container: ViewStyle,
};

const styles = StyleSheet.create<AddDoctorVisitReminderScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    }
});

