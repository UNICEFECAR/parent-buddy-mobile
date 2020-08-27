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
import { userRealmStore, dataRealmStore } from '../../stores';
import { Vaccine } from '../../components/vaccinations/oneVaccinations';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Checkbox } from 'react-native-paper';
import { Measures } from '../../stores/ChildEntity';
import { NavigationStackState, NavigationStackProp } from 'react-navigation-stack';
import { StackActions } from 'react-navigation';
import { navigation } from '../../app';

const colorError = "#EB4747"

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, {}>;
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
    vaccinesForCurrenPeriod: Vaccine[],
    vaccinesForPreviousPeriod: Vaccine[],
}


export class NewDoctorVisitScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.initState()
    }

    private initState = () => {

        let vaccinesForCurrenPeriod = userRealmStore.getVaccinationsForCurrentPeriod();
        let vaccinesForPreviousPeriod = userRealmStore.getPreviousVaccines();

        let isVaccineReceived = "";

        if (this.props.navigation.state?.params?.screenType === screenType.vaccination) {
            isVaccineReceived = "yes"
        }

        let state: State = {
            visitDate: "",
            weight: "",
            height: "",
            comment: "",
            isVaccineReceived: isVaccineReceived,
            isChildMeasured: "",
            childMeasuredError: "",
            childMeasuredWeightError: "",
            childMeasuredHeightError: "",
            vaccinesForCurrenPeriod: vaccinesForCurrenPeriod,
            vaccinesForPreviousPeriod: vaccinesForPreviousPeriod,
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
        // if (this.state.isChildMeasured === "") {
        //     this.setState({
        //         childMeasuredError: translate('childMeasuredError')
        //     })
        // }

        let measure: Measures = {
            weight: "1",
            length: "1",
            measurementDate: 1,
            titleDateInMonth: 1,
            vaccineIds: this.getCompletedVaccines(),
        }


        userRealmStore.addMeasuresForCurrentChild(measure)

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

    private onCheckBox(periodType: "previousPeriod" | "currentPeriod", id: string) {
        let vaccinesPeriod = periodType === "previousPeriod" ? this.state.vaccinesForPreviousPeriod : this.state.vaccinesForCurrenPeriod;
        vaccinesPeriod.forEach(item => {
            if (item.uuid === id) {
                item.complete = !item.complete
            };
        });

        if (periodType === "previousPeriod") {
            this.setState({
                vaccinesForPreviousPeriod: vaccinesPeriod
            });
        } else {
            this.setState({
                vaccinesForCurrenPeriod: vaccinesPeriod
            });
        };
    }

    private getCompletedVaccines() {
        let currentPeriod = this.state.vaccinesForCurrenPeriod.filter(item => item.complete === true);
        let previousPeriod = this.state.vaccinesForPreviousPeriod.filter(item => item.complete === true);

        let allVaccines: any = [];

        allVaccines = allVaccines.concat(currentPeriod.map(item => item.uuid));
        allVaccines = allVaccines.concat(previousPeriod.map(item => item.uuid));

        return allVaccines
    }

    private goToArticle(id: number) {
        let article = dataRealmStore.getContentFromId(id);
        let category = dataRealmStore.getCategoryNameFromId(id);

        const pushAction = StackActions.push({
            routeName: 'HomeStackNavigator_ArticleScreen',
            params: {
                article: article,
                categoryName: category,
            },
        });

        navigation.dispatch(pushAction)
    };


    private renderVaccines(vaccinesList: Vaccine[], periodType: "previousPeriod" | "currentPeriod") {
        return (
            <>
                {
                    vaccinesList.length > 0 ?
                        <>
                            <View style={styles.vaccineContainerTitle}>
                                <Typography type={TypographyType.headingSecondary}>
                                    {
                                        periodType === "previousPeriod" ?
                                            "TODO Vakcine iz prethodnog perioda"
                                            :
                                            "TODO VAKCINE IZ SADASNJEG PERIODA"
                                    }
                                </Typography>
                            </View>
                            {
                                vaccinesList.map(item => (
                                    <View style={styles.vaccineContainerBody}>
                                        <Checkbox.Android status={item.complete ? "checked" : "unchecked"} onPress={() => this.onCheckBox(periodType, item.uuid)} />
                                        <View style={styles.vaccineContainerText}>
                                            <Typography style={styles.vaccineText}>
                                                {item.title}
                                            </Typography>
                                            <Icon name="info" onPress={() => this.goToArticle(parseInt(item.hardcodedArticleId))} />
                                        </View>
                                    </View>
                                ))
                            }
                        </> : null
                }
            </>
        )
    }

    private renderVaccinesSection() {
        return (
            <>
                {
                    this.props.navigation.state.params?.screenType === screenType.heltCheckUp ?
                        <View style={styles.vaccineContainer} >
                            <Typography style={{ marginBottom: scale(16) }}>{translate("newMeasureScreenVaccineTitle")}</Typography>
                            <RadioButtons
                                value={this.state.isVaccineReceived}
                                onChange={(value) => this.setState({ isVaccineReceived: value })}
                                buttonStyle={{ width: 150 }}
                                buttons={[
                                    { text: translate("newMeasureScreenVaccineOptionYes"), value: "yes" },
                                    { text: translate("newMeasureScreenVaccineOptionNo"), value: "no" }
                                ]}
                            />
                        </View>
                        :
                        null
                }

                {
                    this.state.isVaccineReceived === "yes" ?
                        <>
                            {this.renderVaccines(this.state.vaccinesForPreviousPeriod, "previousPeriod")}
                            {this.renderVaccines(this.state.vaccinesForCurrenPeriod, "currentPeriod")}
                        </>
                        : null
                }
            </>
        )
    }

    private renderChildMeasuresSection() {
        return (
            <>
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
                    )}
            </>
        );
    };

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

                        {
                            this.props.navigation.state.params?.screenType === screenType.vaccination ?
                                <>
                                    {this.renderVaccinesSection()}
                                    {this.renderChildMeasuresSection()}
                                </>
                                :
                                <>
                                    {this.renderChildMeasuresSection()}
                                    {this.renderVaccinesSection()}
                                </>
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

export enum screenType {
    "vaccination",
    "heltCheckUp"
}

export interface NewDoctorVisitScreenStyles {
    container: ViewStyle,
    vaccineContainer: ViewStyle,
    commenterContainer: ViewStyle,
    vaccineText: TextStyle,
    vaccineContainerText: ViewStyle,
    vaccineContainerBody: ViewStyle,
    vaccineContainerTitle: ViewStyle,
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
    vaccineContainerText: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    vaccineText: {
        fontSize: moderateScale(12),
        width: moderateScale(260),
        marginRight: scale(20),
        marginLeft: moderateScale(5),
        lineHeight: moderateScale(18)
    },
    vaccineContainerBody: {
        flexDirection: 'row',
        borderBottomColor: 'rgba(0,0,0,0.06)',
        borderBottomWidth: 1
    },
    vaccineContainerTitle: {
        marginTop: scale(32),
        marginBottom: scale(22),
    },
})

