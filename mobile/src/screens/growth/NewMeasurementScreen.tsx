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
import { Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, moderateScale } from 'react-native-size-matters';
import { translate } from '../../translations/translate';
import { userRealmStore, dataRealmStore } from '../../stores';
import { Measures } from '../../stores/ChildEntity';
import { navigation } from '../../app';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { GrowthScreen } from '../home';


export interface Props {
    navigation: NavigationStackProp<NavigationStackState, {}>;
}

export interface State {
    measurementDate: Date | undefined,
    measurementDateError: boolean,
    length: string,
    lengthError: boolean,
    height: string,
    heightError: boolean,
    comment: string,
    measurementPlace: string | undefined,
    isVaccineReceived: string | undefined,
}


export class NewMeasurementScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.initState()
    }

    private initState = () => {
        let state: State = {
            measurementDate: undefined,
            length: "",
            height: "",
            comment: "",
            isVaccineReceived: "no",
            measurementPlace: "home",
            measurementDateError: false,
            heightError: false,
            lengthError: false,
        };

        this.state = state;
    }

    private setMeasurementPlace = (value: string | undefined) => {
        this.setState({
            // measurementPlace: value,
        })
    }

    private setisVaccineReceived = (value: string | undefined) => {
        this.setState({
            isVaccineReceived: value,
        })
    }

    private setMeasurementDate = (value: Date) => {
        this.setState({
            measurementDate: value,
        })
    }

    private measureChange = (value: string, label: string) => {
        if (label === "length") {
            this.setState({
                length: value
            })
        } else {
            this.setState({
                height: value
            })
        }
    }

    private valueCheck() {
        let isValid = true;

        if (this.state.length === "") {
            isValid = false;
            this.setState({ lengthError: true })
        }

        if (this.state.height === "") {
            isValid = false;
            this.setState({ heightError: true })
        }

        if (this.state.measurementDate === undefined) {
            isValid = false;
            this.setState({ measurementDateError: true })
        }

        return isValid;
    }

    private submit() {
        const { comment, length, height, measurementDate } = this.state;
        const currentChild = userRealmStore.getCurrentChild();
        if (!currentChild) return;

        let measures: Measures[] = [];

        if(this.valueCheck()){
            if (currentChild.measures !== null && currentChild.measures !== "") {
                measures = JSON.parse(currentChild.measures);
                measures.push({ length: length, height: height, measurementDate: measurementDate })
            } else {
                measures[0].height = height;
                measures[0].length = length;
                measures[0].measurementDate = measurementDate;
            }
    
            userRealmStore.realm?.write(() => {
                currentChild.comment = comment;
                currentChild.measures = JSON.stringify(measures);
                // This will just trigger the update of data realm
                dataRealmStore.setVariable('randomNumber', Math.floor(Math.random() * 6000) + 1);
                this.props.navigation.goBack();
            });
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
                        <View style={styles.dateTimePickerContainer}>
                            <DateTimePicker
                                label={translate("newMeasureScreenDatePickerLabel")}
                                onChange={(date) => this.setMeasurementDate(date)} />
                        </View>
                        <View style={styles.measurementPlaceContainer}>
                            <Typography style={{ marginBottom: 22 }}>{translate("newMeasureScreenPlaceTitle")}</Typography>
                            <RadioButtons
                                value={this.state.measurementPlace}
                                buttons={[
                                    { text: translate("newMeasureScreenPlaceOptionDoctor"), value: 'doctor' },
                                    {
                                        text: translate("newMeasureScreenPlaceOptionHome"), value: 'home'
                                    }]}
                                onChange={value => this.setMeasurementPlace(value)}
                            />
                        </View>

                        <View>
                            <RoundedTextInput
                                label={translate('heightLabel')}
                                suffix="g"
                                icon="weight"
                                style={{ width: 150 }}
                                value={this.state.height}
                                onChange={value => this.measureChange(value, 'height')}
                            />
                            <RoundedTextInput
                                label={translate('lengthLabel')}
                                suffix="cm"
                                icon="weight"
                                style={{ width: 150, marginTop: 8 }}
                                value={this.state.length}
                                onChange={value => this.measureChange(value, 'length')}

                            />
                        </View>

                        {/* if measurementPlace === "doctor"  */}
                        {
                            this.state.measurementPlace === "doctor" && (
                                <View style={styles.vaccineContainer} >
                                    <Typography style={{ marginBottom: 16 }}>{translate("newMeasureScreenVaccineTitle")}</Typography>
                                    <RadioButtons
                                        value={this.state.isVaccineReceived}
                                        buttonStyle={{ width: 150 }}
                                        buttons={[
                                            { text: translate("newMeasureScreenVaccineOptionYes"), value: 'yes' },
                                            { text: translate("newMeasureScreenVaccineOptionNo"), value: 'no' }
                                        ]}
                                        onChange={value => this.setisVaccineReceived(value)}
                                    />
                                </View>
                            )
                        }



                        {/* ####### radio buttons "DA" is clicked FIXED TEXTS FOR TESTING ONLY #######  */}
                        {/* ####### previous vaccine #######  */}
                        {
                            this.state.isVaccineReceived === "yes" && (
                                <>
                                    <View style={styles.vaccineContainerTitle}>
                                        <Typography type={TypographyType.headingSecondary}>Vakcine iz prethodnog perioda</Typography>
                                    </View>
                                    <View style={styles.vaccineContainerBody}>
                                        <Checkbox status="unchecked" />
                                        <View style={styles.vaccineContainerText}>
                                            <Typography style={styles.vaccineText}>
                                                Vakcina protiv difterije, tetanusa, velikog kašlja, dečije paralize, hemofilus influence tipa B
                                            </Typography>
                                            <Icon name="chevron-down" />
                                        </View>
                                    </View>
                                    <View style={styles.vaccineContainerBody}>
                                        <Checkbox status="unchecked" />
                                        <View style={styles.vaccineContainerText}>
                                            <Typography style={styles.vaccineText} >
                                                Vakcina protiv velikih boginja
                                            </Typography>
                                            <Icon name="chevron-down" />
                                        </View>
                                    </View>

                                    {/* ####### next vaccine ####### */}
                                    <View style={styles.vaccineContainerTitle}>
                                        <Typography type={TypographyType.headingSecondary}>Vakcine planirane u 3. mesecu</Typography>
                                    </View>
                                    <View style={styles.vaccineContainerBody}>
                                        <Checkbox status="unchecked" />
                                        <View style={styles.vaccineContainerText}>
                                            <Typography style={styles.vaccineText} >
                                                Vakcina protiv hemofilus influence tipa B, tuberkuloze, zarazne žutice
                                            </Typography>
                                            <Icon name="chevron-down" />
                                        </View>
                                    </View>
                                    <View style={styles.vaccineContainerBody}>
                                        <Checkbox status="unchecked" />
                                        <View style={styles.vaccineContainerText}>
                                            <Typography style={styles.vaccineText} >
                                                [sve vakcine iz prethodnog perioda koje nisu evidentirane]
                                            </Typography>
                                            <Icon name="chevron-down" />
                                        </View>
                                    </View>
                                </>
                            )
                        }


                        <View style={styles.commenterContainer}>
                            <RoundedTextArea placeholder={translate("newMeasureScreenCommentPlaceholder")} />
                        </View>

                        <View>
                            <RoundedButton
                                text={translate("newMeasureScreenSaveBtn")}
                                type={RoundedButtonType.purple}
                                onPress={() => this.submit()}
                            />
                        </View>
                    </ScrollView>
                )}
            </ThemeConsumer>

        )
    }
}

export interface NewMeasurementScreenStyles {
    [index: string]: ViewStyle | TextStyle,
    container: ViewStyle,
    dateTimePickerContainer: ViewStyle,
    measurementPlaceContainer: ViewStyle,
    vaccineContainer: ViewStyle,
    vaccineContainerTitle: ViewStyle,
    vaccineContainerBody: ViewStyle,
    vaccineContainerText: ViewStyle,
    commenterContainer: ViewStyle,
    vaccineText: TextStyle,
}

const styles = StyleSheet.create<NewMeasurementScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    },
    dateTimePickerContainer: {

    },
    measurementPlaceContainer: {
        alignItems: 'flex-start',
        marginTop: scale(32),
        marginBottom: scale(32)
    },
    vaccineContainer: {
        alignItems: "flex-start",
        marginTop: scale(32),
    },
    vaccineContainerTitle: {
        marginTop: scale(32),
        marginBottom: scale(22),
    },
    vaccineContainerBody: {
        flexDirection: 'row',
        borderBottomColor: 'rgba(0,0,0,0.06)',
        borderBottomWidth: 1
    },
    vaccineContainerText: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    commenterContainer: {
        marginTop: scale(32),
        marginBottom: scale(32),
    },
    vaccineText: {
        fontSize: moderateScale(12),
        width: moderateScale(260),
        marginRight: scale(20),
        marginLeft: moderateScale(5),
        lineHeight: moderateScale(18)
    }
})

