import React, { Component } from 'react'
import { View, StyleSheet, ViewStyle, LayoutChangeEvent, Dimensions } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { NoMeasurements } from '../../components/growth/NoMeasurements';
import { LastMeasurements } from '../../components/growth/LastMeasurements';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';
import { HomeScreenParams } from '../home/HomeScreen';
import { translate } from '../../translations/translate';
import { Typography, TextButton } from '../../components';
import { TypographyType } from '../../components/Typography';
import { translateData } from '../../translationsData/translateData';
import { dataRealmStore, userRealmStore } from '../../stores';
import { chartTypes, GrowthChart, ChartData } from '../../components/growth/GrowthChart';
import { ChildGender, Measures } from '../../stores/ChildEntity';
import { DateTime } from 'luxon';
import { ChartData as Data, GrowthChart0_2Type, GrowthChartHeightAgeType } from '../../components/growth/growthChartData';
import { TextButtonColor } from '../../components/TextButton';
import { navigation } from '../../app';
import { ActivityIndicator } from 'react-native-paper';
import { stat } from 'react-native-fs';
import { color } from 'react-native-reanimated';

export interface GrowthScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>,
}

export interface State {
    periodIntroductionText: string,
    measuresData: ChartData[],
    interpretationTexWeightLength: InterpretationTex,
    interpretationTexLenghtAge: InterpretationTex,
    childBirthDate: DateTime | null,
    childGender: ChildGender,
    lastMeasurementDate: string | undefined,
    isFirstChartLoaded: boolean,
    isSecoundChartLoaded: boolean
    lastMeasuresHeight: number,
    lastMeasuresLength: number,
    defaultMessage: string,

}

export class GrowthScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = this.initState()
        this.setDefaultScreenParams();
    }

    private getInterpretationTexLenghtForAge(gender: ChildGender, lastMeasurements: Measures) {
        const childAgeId = dataRealmStore.getChildAgeTagWithArticles()?.id;

        let interpretationTex: InterpretationTex = {
            name: "",
            text: "",
            articleId: 0
        };

        let chartData: GrowthChartHeightAgeType = [];

        if (gender === "boy") {
            chartData = Data.Height_age_boys0_5
        } else {
            chartData = Data.Height_age_girls0_5
        }

        let length: number = 0;
        if (lastMeasurements !== undefined && lastMeasurements.height && lastMeasurements.length) {
            length = parseFloat(lastMeasurements.length);
        };

        const childBirthDay = userRealmStore.getCurrentChild()?.birthDate;
        let measurementDate: DateTime = DateTime.local();

        if (lastMeasurements !== undefined && lastMeasurements.measurementDate) {
            measurementDate = DateTime.fromJSDate(new Date(lastMeasurements.measurementDate));
        }

        let days = 0;

        if (childBirthDay) {
            let date = DateTime.fromJSDate(childBirthDay);
            let convertInDays = measurementDate.diff(date, "days").toObject().days;


            if (convertInDays !== undefined) days = Math.round(convertInDays);
        };
        console.log(days, "DAYS")
        let filteredData = chartData.find(data => data.Day === days);
        let interpretationData = translateData('interpretationLenghtForAge')?.
            find(item => item.predefined_tags.indexOf(childAgeId) !== -1);


        if (filteredData !== undefined) {
            if (length >= filteredData.SD2neg && length <= filteredData.SD3) {
                interpretationTex = interpretationData.goodText;
            };

            if (length < filteredData.SD2neg && length > filteredData.SD3neg) {
                interpretationTex = interpretationData.warrningSmallLengthText;
            };

            if (length < filteredData.SD3neg) {
                interpretationTex = interpretationData.emergencySmallLengthText;
            };
            if (length > filteredData.SD3) {
                interpretationTex = interpretationData.warrningBigLengthText;
            };
        };
        return interpretationTex;
    };

    private getInterpretationTexWeightForHeight(gender: ChildGender, childAgeInDays: number, lastMeasurements: Measures) {
        const dayLimit = 730; // 0-2 yeast || 2-5 years 
        const childAgeId = dataRealmStore.getChildAgeTagWithArticles()?.id;

        let interpretationTex: InterpretationTex = {
            name: "",
            text: "",
            articleId: 0
        };

        console.log(lastMeasurements, "last")

        let chartData: GrowthChart0_2Type = [];

        if (gender === "boy") {
            if (childAgeInDays <= dayLimit) {
                chartData = Data.GrowthChartBoys0_2;
            } else {
                chartData = Data.GrowthChartBoys2_5;
            };
        } else {
            if (childAgeInDays <= dayLimit) {
                chartData = Data.GrowthChartGirls0_2;
            } else {
                chartData = Data.GrowthChartGirls2_5;
            };
        };

        let height: number = 0;
        let length: number = 0;

        if (lastMeasurements !== undefined && lastMeasurements.height && lastMeasurements.length) {
            height = parseFloat(lastMeasurements.height) / 1000;
            length = parseFloat(lastMeasurements.length);
        };

        let filteredDataForHeight = chartData.find(data => data.Height === length);
        let interpretationData = translateData('interpretationWeightForHeight')?.
            find(item => item.predefined_tags.indexOf(childAgeId) !== -1);

        if (filteredDataForHeight) {
            if (height >= filteredDataForHeight?.SD2neg && height <= filteredDataForHeight.SD2) {
                interpretationTex = interpretationData.goodText;
            };

            if (height <= filteredDataForHeight.SD2neg && height >= filteredDataForHeight.SD3neg) {
                interpretationTex = interpretationData.warrningSmallHeightText;
            };

            if (height < filteredDataForHeight.SD3neg) {
                interpretationTex = interpretationData.emergencySmallHeightText;
            };

            if (height >= filteredDataForHeight.SD2 && height <= filteredDataForHeight.SD3) {
                interpretationTex = interpretationData.warrningBigHeightText;
            };

            if (height > filteredDataForHeight.SD3) {
                interpretationTex = interpretationData.emergencyBigHeightText;
            };
        };

        return interpretationTex;
    }

    private convertMeasuresData(measures: Measures[], childBirthDay: Date) {
        let measurementDateInDays: number | undefined = 0;

        let measuresData: ConvertedMeasures[] = [];

        measures.forEach(item => {
            console.log(item.measurementDate, 'measurement date')
            if (item.measurementDate) {
                console.log('uso', item.measurementDate)
                let childAge = DateTime.fromJSDate(childBirthDay)
                let date = DateTime.fromJSDate(new Date(item.measurementDate));

                measurementDateInDays = date.diff(childAge, "days").toObject().days;
                console.log(date, 'a')
            };
            console.log(measurementDateInDays, "a")
            if (measurementDateInDays < 1855) {
                measuresData.push({
                    height: item.height ? parseFloat(item.height) / 1000 : 0,
                    length: item.length ? parseFloat(item.length) : 0,
                    measurementDate: measurementDateInDays ? measurementDateInDays : 0,
                });
            };
        });

        console.log(measuresData, "MD")
        return measuresData;
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                isFirstChartLoaded: true,
            })
        }, 200);

        setTimeout(() => {
            this.setState({
                isSecoundChartLoaded: true,
            })
        }, 250)
    }

    public initState() {
        // initialize state 
        let state: State = {
            periodIntroductionText: "",
            measuresData: [],
            childBirthDate: null,
            childGender: "boy",
            lastMeasurementDate: undefined,
            isFirstChartLoaded: false,
            isSecoundChartLoaded: false,
            lastMeasuresHeight: 0,
            lastMeasuresLength: 0,
            defaultMessage: "",
            interpretationTexWeightLength: {
                text: "",
                articleId: 0,
                name: "",
            },
            interpretationTexLenghtAge: {
                text: "",
                articleId: 0,
                name: "",
            }

        };

        let childAgeInDays: number | null = null;

        let measures: Measures[] = [];
        let periodIntroductionText: string = '';
        let defaultMessage = "";

        let currentChild = userRealmStore.getCurrentChild();
        // if currentChild birthDate is not set return HomeScreen message 
        if (currentChild && currentChild.birthDate) {
            state.childBirthDate = DateTime.fromJSDate(currentChild.birthDate);
            let childGender = currentChild?.gender;

            childAgeInDays = userRealmStore.getCurrentChildAgeInDays(currentChild.birthDate.getTime())
            if (childAgeInDays !== null) {
                let ageInDays = 0;

                if(childAgeInDays >= 1885){
                    ageInDays = 1885;
                    defaultMessage = translate('DefaultPeriodInterpretationText');
                }else{
                    ageInDays = childAgeInDays;
                    defaultMessage = "";
                };

                let growthPeriod = translateData('growthPeriods')?.
                    filter((item: any) => (ageInDays >= item.dayMin && ageInDays <= item.dayMax))[0];

                periodIntroductionText = growthPeriod?.text ? growthPeriod.text : "";

            }

            // if measures is empty return just box for adding a new measure 
            if (currentChild?.measures !== "" && currentChild.measures !== undefined && currentChild.measures !== null) {
                measures = JSON.parse(currentChild?.measures);

                let lastMeasurementDate: string | undefined = undefined;
                let lastMeasuresHeight: number = 0;
                let lastMeasuresLength: number = 0;

                if (measures[measures.length - 1]?.measurementDate !== undefined) {
                    let date: DateTime = DateTime.local();

                    let dt = measures[measures.length - 1].measurementDate;

                    if (dt) {
                        date = DateTime.fromMillis(dt);
                    }

                    lastMeasurementDate = date.toFormat("dd'.'MM'.'yyyy");
                    lastMeasuresHeight = measures[measures.length - 1].height ? parseFloat(measures[measures.length - 1].height) / 1000 : 0
                    lastMeasuresLength = measures[measures.length - 1].length ? parseFloat(measures[measures.length - 1].length) : 0
                }

                let birthDay = new Date(currentChild.birthDate);

                const measuresData = this.convertMeasuresData(measures, birthDay);
                const interpretationTexWeightLength = this.getInterpretationTexWeightForHeight(
                    childGender,
                    childAgeInDays,
                    measures[measures.length - 1]
                );

                const interpretationTexLenghtAge = this.getInterpretationTexLenghtForAge(
                    childGender,
                    measures[measures.length - 1]
                )

                state = {
                    periodIntroductionText: periodIntroductionText,
                    measuresData: measuresData,
                    interpretationTexWeightLength: interpretationTexWeightLength,
                    interpretationTexLenghtAge: interpretationTexLenghtAge,
                    childGender: childGender,
                    childBirthDate: DateTime.fromJSDate(currentChild.birthDate),
                    lastMeasurementDate: lastMeasurementDate,
                    isFirstChartLoaded: false,
                    isSecoundChartLoaded: false,
                    lastMeasuresHeight: lastMeasuresHeight,
                    defaultMessage: defaultMessage,
                    lastMeasuresLength: lastMeasuresLength,
                };

            } else {
                state.periodIntroductionText = periodIntroductionText;
            };
        };
        return state;
    };

    private setDefaultScreenParams() {
        let defaultScreenParams: GrowthScreenParams = {

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private goToNewMeasurements() {
        this.props.navigation.navigate('HomeStackNavigator_NewMeasurementScreen', { screen: "growth" });
    }

    private goToArticle(id: number) {
        let article = dataRealmStore.getContentFromId(id);
        let categoryName = dataRealmStore.getCategoryNameFromId(id);

        if (article === undefined) return;

        navigation.navigate(
            'HomeStackNavigator_ArticleScreen',
            { article: article, categoryName: categoryName }
        );
    };

    private openFullScreenChart(type: chartTypes) {
        this.props.navigation.navigate('RootModalStackNavigator_ChartFullScreen',
            {
                chartType: type,
                childBirthDate: this.state.childBirthDate,
                childGender: this.state.childGender === "boy" ? "male" : 'female',
                lineChartData: this.state.measuresData,
            }
        );
    };

    render() {
        const {
            periodIntroductionText,
            measuresData,
            childBirthDate,
            childGender,
            interpretationTexWeightLength,
            interpretationTexLenghtAge
        } = this.state;

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={styles.container}
                    >
                        {
                            this.state.childBirthDate === null ?
                                <Typography>TODO: NO BIRTH DAY (HOME SCREEN NOTIFICATION)</Typography>
                                :
                                <View>
                                    <View style={styles.header}>
                                        <View style={{ alignSelf: 'center' }}>
                                            <Typography type={TypographyType.headingPrimary}>
                                                {translate('growScreenTitle')}
                                            </Typography>
                                        </View>
                                        {
                                            measuresData.length !== 0 ?
                                                <View style={styles.allMeasuresBtn}>
                                                    <TextButton
                                                        color={TextButtonColor.purple}
                                                        onPress={() => {
                                                            navigation.navigate('HomeStackNavigator_AllMeasurementScreen')
                                                        }}
                                                    >
                                                        {translate('allMeasurements')}
                                                    </TextButton>
                                                </View> : null
                                        }
                                    </View>
                                    <View style={styles.card}>
                                        <Typography>
                                            {periodIntroductionText}
                                        </Typography>
                                    </View>
                                    {
                                        measuresData.length === 0 ?
                                            <NoMeasurements
                                                addNewMeasures={() => this.goToNewMeasurements()}
                                            />
                                            :
                                            <>
                                                {this.state.isFirstChartLoaded ?
                                                    <View style={styles.chartCard}>
                                                        <GrowthChart
                                                            title={translate('heightForLength')}
                                                            chartType={chartTypes.heightLength}
                                                            childBirthDate={childBirthDate ? childBirthDate : DateTime.local()}
                                                            childGender={childGender === "boy" ? "male" : 'female'}
                                                            lineChartData={measuresData}
                                                            showFullscreen={false}
                                                            openFullScreen={() => this.openFullScreenChart(chartTypes.heightLength)}

                                                        />
                                                    </View>
                                                    : <View style={styles.card}><ActivityIndicator /></View>

                                                }

                                                {
                                                    this.state.defaultMessage === "" ? 
                                                    interpretationTexWeightLength?.text ?
                                                        <View style={styles.card}>
                                                            <Typography>
                                                                {interpretationTexWeightLength.text}
                                                            </Typography>
                                                            <TextButton
                                                                color={TextButtonColor.purple}
                                                                onPress={() => this.goToArticle(interpretationTexWeightLength.articleId)}
                                                            >
                                                                {translate('moreAboutChildGrowth')}
                                                            </TextButton>
                                                        </View> : null 
                                                        : null
                                                }
                                                {
                                                    this.state.isSecoundChartLoaded ?
                                                        <View style={styles.chartCard}>
                                                            <GrowthChart
                                                                title={translate('lengthForAge')}
                                                                chartType={chartTypes.lengthAge}
                                                                childBirthDate={childBirthDate ? childBirthDate : DateTime.local()}
                                                                childGender={childGender === "boy" ? "male" : 'female'}
                                                                lineChartData={measuresData}
                                                                showFullscreen={false}
                                                                openFullScreen={() => this.openFullScreenChart(chartTypes.lengthAge)}

                                                            />
                                                        </View> : <View style={styles.card}><ActivityIndicator /></View>
                                                }

                                                {
                                                    this.state.defaultMessage === "" ?
                                                    interpretationTexLenghtAge?.text ?
                                                        <View style={styles.card}>
                                                            <Typography>
                                                                {interpretationTexLenghtAge.text}
                                                            </Typography>
                                                            <TextButton
                                                                color={TextButtonColor.purple}
                                                                onPress={() => this.goToArticle(interpretationTexLenghtAge.articleId)}
                                                            >
                                                                {translate('moreAboutChildGrowth')}
                                                            </TextButton>
                                                        </View> : null
                                                        : <View style={styles.card}>
                                                        <Typography>
                                                            {this.state.defaultMessage}
                                                        </Typography>
                                                    </View>
                                                }
                                                <View>
                                                    {/* <NewMeasurements onPress={() => this.goToNewMeasurements()} /> */}
                                                    <LastMeasurements
                                                        measureDate={this.state.lastMeasurementDate ? this.state.lastMeasurementDate : ""}
                                                        measureLength={this.state.lastMeasuresLength.toString()}
                                                        measureMass={this.state.lastMeasuresHeight.toString()}
                                                        onPress={() => this.goToNewMeasurements()}
                                                    />
                                                </View>
                                            </>
                                    }

                                </View>
                        }
                    </ScrollView>
                )}
            </ThemeConsumer>
        )
    }
}

export interface InterpretationTex {
    text: string,
    name: string,
    articleId: number
}

export interface ConvertedMeasures {
    height: number,
    length: number,
    measurementDate: number,
}

export interface GrowthScreenStyles {
    container: ViewStyle,
    header: ViewStyle,
    card: ViewStyle,
    chartCard: ViewStyle,
    allMeasuresBtn: ViewStyle,
}

const styles = StyleSheet.create<GrowthScreenStyles>({
    container: {
        padding: scale(14),
        alignItems: 'stretch',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignContent: 'center'
    },
    allMeasuresBtn: {
        position: "absolute",
        right: 0,
        top: 16,
        alignSelf: 'center'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
        marginBottom: 20,
    },
    chartCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        marginBottom: 20,
        // height: moderateScale(940)
    }
})

