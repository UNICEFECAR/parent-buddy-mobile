import React, { Component } from 'react'
import { View, StyleSheet, ViewStyle, Text, TextStyle } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { RadioButtons } from '../../components/RadioButtons';
import { DateTimePicker } from '../../components/DateTimePicker';
import { RoundedTextArea } from '../../components/RoundedTextArea';
import { Typography, TypographyType } from '../../components/Typography';
import { RoundedTextInput } from '../../components/RoundedTextInput';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { scale, moderateScale } from 'react-native-size-matters';
import { translate } from '../../translations/translate';

const colorError = "#EB4747"

export interface Props {
    // navigation: NavigationStackProp<NavigationStackState, {}>;
}

export interface State {
    visitDate: string,
    weight: string,
    height: string,
    comment: string,
    isVaccineReceived: string | undefined,
    isChildMeasured: string | undefined,
    childMeasuredError: string,
    childMeasuredWeightError: string,
    childMeasuredHeightError: string,
}


export class NewDoctorVisitScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.initState()
    }

    private initState = () => {
        let state: State = {
            visitDate: "",
            weight: "",
            height: "",
            comment: "",
            isVaccineReceived: "yes",
            isChildMeasured: "",
            childMeasuredError: "",
            childMeasuredWeightError: "",
            childMeasuredHeightError: "",

        };

        this.state = state;
    }

    private setisChildMeasured = (value: string | undefined) => {
        this.setState({
            childMeasuredError: "",
            isChildMeasured: value,
        })
    }

    private saveData = () => {
        if(this.state.isChildMeasured === ""){
            this.setState({
                childMeasuredError: translate('childMeasuredError')
            })
        }
    }

    private setMeasurementDate = (value: string) => {
        this.setState({
            visitDate: value,
        })
    }

    private measureChange = (value: string, label: string) => {
        if (label === "weight") {
            this.setState({
                weight: value
            })
        } else {
            this.setState({
                height: value
            })
        }
    }

    render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={styles.container}
                    >
                        <View>
                            <DateTimePicker label={translate("NewDoctorVisitScreenDatePickerLabel")} onChange={() => { }} />
                        </View>
                        <View style={styles.vaccineContainer} >
                            <Typography style={{ marginBottom: scale(16) }}>{translate("newMeasureScreenVaccineTitle")}</Typography>
                            <RadioButtons
                                value={this.state.isVaccineReceived}
                                buttonStyle={{ width: 150 }}
                                buttons={[
                                    { text: translate("newMeasureScreenVaccineOptionYes"), value: "yes" },
                                    { text: translate("newMeasureScreenVaccineOptionNo"), value: 'no' }
                                ]}
                            />
                        </View>
                        <View style={styles.vaccineContainer} >
                            <Typography style={{ marginBottom: 16 }}>{translate("NewDoctorVisitMeasurementTitle")}</Typography>
                            <RadioButtons
                                style={this.state.childMeasuredError !== "" ? { borderColor: colorError, borderWidth: 1, borderRadius: 27 } : null}
                                value={this.state.isChildMeasured}
                                buttonStyle={{ width: 150 }}
                                buttons={[
                                    { text: translate("newMeasureScreenVaccineOptionYes"), value: "yes" },
                                    { text: translate("newMeasureScreenVaccineOptionNo"), value: 'no' }
                                ]}
                                onChange={value => this.setisChildMeasured(value)}
                            />
                            {
                                this.state.childMeasuredError !== "" ?
                                    <Typography style={{ color: colorError }}>{this.state.childMeasuredError}</Typography>
                                    : null
                            }
                        </View>
                        {
                            this.state.isChildMeasured === "yes" && (
                                <View style={{ marginTop: 16 }}>
                                    <RoundedTextInput
                                        label="Težina"
                                        suffix="g"
                                        icon="weight"
                                        style={{ width: 150 }}
                                        value={this.state.weight}
                                        onChange={value => this.measureChange(value, 'weight')}
                                    />
                                    <RoundedTextInput
                                        label="Visina"
                                        suffix="cm"
                                        icon="weight"
                                        style={{ width: 150, marginTop: 8 }}
                                        value={this.state.height}
                                        onChange={value => this.measureChange(value, 'height')}

                                    />
                                </View>
                            )
                        }

                        <View style={styles.commenterContainer}>
                            <RoundedTextArea placeholder={translate("newMeasureScreenCommentPlaceholder")} />
                        </View>

                        <View>
                            <RoundedButton
                                text={translate("newMeasureScreenSaveBtn")}
                                type={RoundedButtonType.purple}
                                onPress={() => this.saveData()}
                            />
                        </View>
                    </ScrollView>
                )}
            </ThemeConsumer>

        )
    }
}

export interface NewDoctorVisitScreenStyles {
    container: ViewStyle,
    vaccineContainer: ViewStyle,
    commenterContainer: ViewStyle,
}

const styles = StyleSheet.create<NewDoctorVisitScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    },
    vaccineContainer: {
        alignItems: "flex-start",
        marginTop: scale(32),
    },
    commenterContainer: {
        marginTop: scale(32),
        marginBottom: scale(32),
    },
})

