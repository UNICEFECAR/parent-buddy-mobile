import React, { Component } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { NoMeasurements } from '../../components/growth/NoMeasurements';
import { LastMeasurements } from '../../components/growth/LastMeasurements';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';
import { NewMeasurements } from '../../components/growth/NewMeasurements';
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

const lineChartData = [{ measurementDate: 269, height: 2, length: 45 }, { measurementDate: 330, height: 4.5, length: 55 }, { measurementDate: 400, height: 7, length: 70 }, { measurementDate: 1000, height: 8, length: 80 }, { measurementDate: 1000, height: 12, length: 87 }];

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
    childBirthDate: Date,
    childGender: ChildGender,
    lastMeasurementDate: string | undefined,
}

export class GrowthScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.initState()
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

        if (lastMeasurements.height && lastMeasurements.length) {
            length = parseFloat(lastMeasurements.length);
        };

        const childBirthDay = userRealmStore.getCurrentChild()?.birthDate;
        let measurementDate: DateTime = DateTime.local();
        
        if(lastMeasurements.measurementDate){
            console.log('uso')
            measurementDate = DateTime.fromJSDate(new Date(lastMeasurements.measurementDate));
        }

        let days = 0;

        if(childBirthDay){
            let date = DateTime.fromJSDate(childBirthDay);
            let convertInDays = measurementDate.diff(date, "days").toObject().days;

            if(convertInDays!== undefined) days = convertInDays;
        };

        console.log(days, "ASDadsaddasadsasdasdasdasdadsasd")

        let filteredData = chartData.find(data => data.Day === days)
        let interpretationData = translateData('interpretationWeightForHeight')?.find(item => item.predefined_tags.indexOf(childAgeId) !== -1)

        if(filteredData){
            if(length >= filteredData.SD2neg && length <= filteredData.SD3){
                // dobro 
                interpretationTex = interpretationData.goodText;
            }

            if(length < filteredData.SD2neg && length > filteredData.SD3neg){
                // sporo raste warningLow
                interpretationTex = interpretationData.warrningSmallLengthText
            }

            if(length < filteredData.SD3neg){
                // rast ozbiljno zaostaje uzas katastrofa
                interpretationTex = interpretationData.emergencySmallLengthText
            }

            if(length > filteredData.SD3){
                // MASALA
                interpretationTex = interpretationData.warrningBigLengthText
            }
        }

        return interpretationTex;
    }

    private getInterpretationTexWeightForHeight(gender: ChildGender, childAgeInDays: number, lastMeasurements: Measures) {
        const dayLimit = 730; // 0-2 yeast || 2-5 years 
        const childAgeId = dataRealmStore.getChildAgeTagWithArticles()?.id;

        let interpretationTex: InterpretationTex = {
            name: "",
            text: "",
            articleId: 0
        };

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

        if (lastMeasurements.height && lastMeasurements.length) {
            height = parseFloat(lastMeasurements.height);
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

    private convertMeasuresData(measures: Measures[]) {
        let measurementDateInDays: number | undefined = 0;
        const timeNow = DateTime.local();

        let measuresData = measures.map(item => {
            if (item.measurementDate) {
                let date = DateTime.fromJSDate(new Date(item.measurementDate));
                measurementDateInDays = timeNow.diff(date, "days").toObject().days;
            };

            return {
                height: item.height ? parseFloat(item.height) : 0,
                length: item.length ? parseFloat(item.length) : 0,
                measurementDate: measurementDateInDays ? measurementDateInDays : 0,
            };
        });

        return measuresData;
    }

    private initState() {
        // initialize state 
        let state: State = {
            periodIntroductionText: "",
            measuresData: [],
            childBirthDate: new Date(),
            childGender: "boy",
            lastMeasurementDate: undefined,
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

        let childAgeInDays: number = 0;

        let measures: Measures[] = [];
        let periodIntroductionText: string = '';

        let currentChild = userRealmStore.getCurrentChild();

        // if currentChild birthDate is not set return HomeScreen message 
        if (currentChild && currentChild.birthDate) {
            let childGender = currentChild?.gender;

            let growthPeriod = translateData('growthPeriods')?.
                filter((item: any) => (childAgeInDays >= item.dayMin && childAgeInDays <= item.dayMax))[0];

            periodIntroductionText = growthPeriod.text;

            // if measures is empty return just box for adding a new measure 
            if (currentChild?.measures !== "" && currentChild.measures !== undefined && currentChild.measures !== null) {
                measures = JSON.parse(currentChild?.measures);
                childAgeInDays = userRealmStore.getCurrentChildAgeInDays(currentChild.birthDate);

                let lastMeasurementDate: string | undefined = undefined;

                if (measures[measures.length - 1].measurementDate !== undefined) {
                    let date = new Date(measures[0].measurementDate ? measures[0].measurementDate : "");
                    lastMeasurementDate = DateTime.fromJSDate(date).toISODate()
                }

                const measuresData = this.convertMeasuresData(measures);
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
                    childBirthDate: currentChild.birthDate,
                    lastMeasurementDate: lastMeasurementDate,
                };

            } else {
                state.periodIntroductionText = periodIntroductionText;
            };
        };

        this.state = state;
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
        this.props.navigation.navigate('HomeStackNavigator_NewMeasurementScreen');
    }

    private goToArticle(id: number) {
        let article = dataRealmStore.getContentFromId(id);
        let categoryName = dataRealmStore.getCategoryNameFromId(id);

        navigation.navigate(
            'HomeStackNavigator_ArticleScreen',
            { article: article, categoryName: categoryName }
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
                            this.state.periodIntroductionText === "" ?
                                <Typography>TODO: NO BIRTH DAY (HOME SCREEN NOTIFICATION)</Typography>
                                :
                                <View>
                                    <View style={styles.header}>
                                        <View style={{alignSelf: 'center'}}>
                                            <Typography type={TypographyType.headingPrimary}>
                                                Rast deteta
                                            </Typography>
                                        </View>
                                        <View style={styles.allMeasuresBtn}>
                                            <TextButton color={TextButtonColor.purple} onPress={() => { navigation.navigate('HomeStackNavigator_AllMeasurementScreen') }}>Sva merenja</TextButton>
                                        </View>
                                    </View>
                                    <View style={styles.card}>
                                        <Typography>
                                            {periodIntroductionText}
                                        </Typography>
                                    </View>
                                    {
                                        measuresData.length === 0 ?
                                            <NoMeasurements />
                                            :
                                            <>
                                                <View style={styles.chartCard}>
                                                    <GrowthChart
                                                        title="Tezina za visinu"
                                                        chartType={chartTypes.heightLength}
                                                        childBirthDate={childBirthDate}
                                                        childGender={childGender === "boy" ? "male" : 'female'}
                                                        lineChartData={measuresData}
                                                        showFullscreen={false}

                                                    />
                                                </View>
                                                {
                                                    interpretationTexWeightLength.text ?
                                                        <View style={styles.card}>
                                                            <Typography>
                                                                {interpretationTexWeightLength.text}
                                                            </Typography>
                                                            <TextButton color={TextButtonColor.purple} onPress={() => { console.log('ID', this.state.InterpretationTexWeightLength.articleId) }}>Saznaj vise</TextButton>
                                                        </View> : null
                                                }

                                                <View style={styles.chartCard}>
                                                    <GrowthChart
                                                        title="Visina za uzrast"
                                                        chartType={chartTypes.lengthAge}
                                                        childBirthDate={childBirthDate}
                                                        childGender={childGender === "boy" ? "male" : 'female'}
                                                        lineChartData={measuresData}
                                                        showFullscreen={false}
                                                    />
                                                </View>
                                                {
                                                    interpretationTexLenghtAge.text ?
                                                        <View style={{ flex: 1, padding: 20, marginBottom: 20, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
                                                            <Typography>
                                                                {interpretationTexLenghtAge.text}
                                                            </Typography>
                                                            <TextButton color={TextButtonColor.purple} onPress={() => this.goToArticle(this.state.InterpretationTexWeightLength.articleId)}>Saznaj vise</TextButton>
                                                        </View> : null
                                                }
                                                <View>
                                                    {/* <NewMeasurements onPress={() => this.goToNewMeasurements()} /> */}
                                                    <LastMeasurements
                                                        measureDate={this.state.lastMeasurementDate ? this.state.lastMeasurementDate : ""}
                                                        measureLength={this.state.measuresData[this.state.measuresData.length - 1].length.toString()}
                                                        measureMass={this.state.measuresData[this.state.measuresData.length - 1].height.toString()}
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
    header:{
        display: 'flex', 
        flexDirection: 'row', 
        width: '100%', 
        alignContent: 'center'
    },
    allMeasuresBtn:{
        position: "absolute", 
        right: 0, 
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
        height: moderateScale(340)
    }
})

