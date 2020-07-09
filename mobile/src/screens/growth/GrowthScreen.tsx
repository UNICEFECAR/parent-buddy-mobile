import React, { Component } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { NoMeasurements } from '../../components/growth/NoMeasurements';
import { LastMeasurements } from '../../components/growth/LastMeasurements';
import { OneMeasurements } from '../../components/growth/OneMeasurement';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale } from 'react-native-size-matters';
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
import { StackActions } from 'react-navigation';
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
    InterpretationTexWeightLength: InterpretationTex,
}

export class GrowthScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.initState()
        this.setDefaultScreenParams();
    }

    private getInterpretationTexLenghtForAge(gender: ChildGender, childAgeInDays: number, lastMeasurements: Measures) {
        const childAgeId = dataRealmStore.getChildAgeTagWithArticles()?.id;

        let InterpretationTex: InterpretationTex = {
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

        let height: number = 0;
        let length: number = 0;

        if (lastMeasurements.height && lastMeasurements.length) {
            height = parseFloat(lastMeasurements.height);
            length = parseFloat(lastMeasurements.length);
        };


        let filteredDataForHeight = chartData.find(data => data.Day === childAgeInDays)
        let InterpretationData = translateData('interpretationWeightForHeight')?.find(item => item.predefined_tags.indexOf(childAgeId) !== -1)

        // if(filteredDataForHeight){
        //     if()
        // }

    }

    private getInterpretationTexWeightForHeight(gender: ChildGender, childAgeInDays: number, lastMeasurements: Measures) {
        const dayLimit = 730;
        const childAgeId = dataRealmStore.getChildAgeTagWithArticles()?.id;

        let InterpretationTex: InterpretationTex = {
            name: "",
            text: "",
            articleId: 0
        };

        let chartData: GrowthChart0_2Type = [];

        if (gender === "boy") {
            if (childAgeInDays <= dayLimit) {
                chartData = Data.GrowthChartBoys0_2
            } else {
                chartData = Data.GrowthChartBoys2_5
            }
        } else {
            if (childAgeInDays <= dayLimit) {
                chartData = Data.GrowthChartGirls0_2
            } else {
                chartData = Data.GrowthChartGirls2_5
            }
        }
        let height: number = 0;
        let length: number = 0;

        if (lastMeasurements.height && lastMeasurements.length) {
            height = parseFloat(lastMeasurements.height);
            length = parseFloat(lastMeasurements.length);
        }


        let filteredDataForHeight = chartData.find(data => data.Height === length)
        let InterpretationData = translateData('interpretationWeightForHeight')?.find(item => item.predefined_tags.indexOf(childAgeId) !== -1)

        console.log(filteredDataForHeight?.SD2neg, "NEG")
        if (filteredDataForHeight) {
            if (height >= filteredDataForHeight?.SD2neg && height <= filteredDataForHeight.SD2) {
                // normalno
                InterpretationTex = InterpretationData.goodText
            }

            if (height <= filteredDataForHeight.SD2neg && height >= filteredDataForHeight.SD3neg) {
                // warning 

                InterpretationTex = InterpretationData.warrningSmallHeightText

            }

            if (height < filteredDataForHeight.SD3neg) {
                // OPASNO
                InterpretationTex = InterpretationData.emergencySmallHeightText;
            }

            if (height >= filteredDataForHeight.SD2 && height <= filteredDataForHeight.SD3) {
                InterpretationTex = InterpretationData.warrningBigHeightText;

            }

            if (height > filteredDataForHeight.SD3) {
                // opasno 2 
                InterpretationTex = InterpretationData.emergencyBigHeightText;

            }
        }

        console.log(height, "HEIGHT")
        return InterpretationTex;

    }

    private convertMeasuresData(measures: Measures[]) {
        let measurementDateInDays: number | undefined = 0;
        const timeNow = DateTime.local();

        let measuresData = measures.map(item => {
            if (item.measurementDate) {
                let date = DateTime.fromJSDate(item.measurementDate);
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
        console.log(Math.round(Date.now() / 1000), "BEOFRE FUNCTION")

        // initialize state 
        let state: State = {
            periodIntroductionText: "",
            measuresData: [],
            InterpretationTexWeightLength: {
                text: "",
                articleId: 0,
                name: "",
            }

        };

        let childAgeInDays: number = 0;

        let measures: Measures[] = [];
        let periodIntroductionText: string = '';

        let curentChild = userRealmStore.getCurrentChild();

        // if curentChild birthDate is not set return HomeScreen message 
        if (curentChild && curentChild.birthDate) {
            let childGender = curentChild?.gender;

            let growthPeriod = translateData('growthPeriods')?.
                filter((item: any) => (childAgeInDays >= item.dayMin && childAgeInDays <= item.dayMax))[0];

            periodIntroductionText = growthPeriod.text;

            // if measures is empty return just box for adding a new measure 
            if (curentChild?.measures !== "" && curentChild.measures !== undefined && curentChild.measures !== null) {
                measures = JSON.parse(curentChild?.measures);
                childAgeInDays = userRealmStore.getCurrentChildAgeInDays(curentChild.birthDate);

                const measuresData = this.convertMeasuresData(measures);
                const InterpretationTexWeightLength = this.getInterpretationTexWeightForHeight(childGender, childAgeInDays, measures[measures.length - 1]);

                state = {
                    periodIntroductionText: periodIntroductionText,
                    measuresData: measuresData,
                    InterpretationTexWeightLength: InterpretationTexWeightLength
                };

            } else {
                state.periodIntroductionText = periodIntroductionText;
            };
        };

        this.state = state;
        console.log(Math.round(Date.now() / 1000), "AFTER FUNCTION")
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

        const pushAction = StackActions.push({
            routeName: 'HomeStackNavigator_ArticleScreen',
            params: {
                article: article,
                categoryName: categoryName,
            },
        });

        navigation.navigate(
            'HomeStackNavigator_ArticleScreen',
            { article: article, categoryName: categoryName }
        )

    }

    render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={styles.container}
                    >
                        {
                            this.state.periodIntroductionText === "" ?
                                <Typography>SDASDASD</Typography>
                                :
                                <View>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignContent: 'center' }}>
                                        <Typography type={TypographyType.headingPrimary}>
                                            Rast deteta
                                        </Typography>
                                        <TextButton color={TextButtonColor.purple} onPress={() => {navigation.navigate('HomeStackNavigator_AllMeasurementScreen')}}>Sva merenja</TextButton>
                                    </View>
                                    <View>
                                        <Typography>
                                            {this.state.periodIntroductionText}
                                        </Typography>
                                    </View>
                                    {
                                        this.state.measuresData.length === 0 ?
                                            <NoMeasurements />
                                            :
                                            <>
                                                <View style={{ flex: 1, height: 350, marginBottom: 20, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
                                                    <GrowthChart
                                                        title="AAAA"
                                                        chartType={chartTypes.heightLength}
                                                        childBirthDate={userRealmStore.getCurrentChild()?.birthDate}
                                                        childGender={userRealmStore.getChildGender() === "boy" ? "male" : 'female'}
                                                        lineChartData={this.state.measuresData}
                                                        showFullscreen={false}

                                                    />
                                                </View>
                                                {
                                                    this.state.InterpretationTexWeightLength.text ?
                                                        <View style={{ flex: 1, padding: 20, marginBottom: 20, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
                                                            <Typography>
                                                                {this.state.InterpretationTexWeightLength.text}
                                                            </Typography>
                                                            <TextButton color={TextButtonColor.purple} onPress={() => { console.log('ID', this.state.InterpretationTexWeightLength.articleId) }}>Saznaj vise</TextButton>
                                                        </View> : null
                                                }

                                                <View style={{ flex: 1, height: 350, marginBottom: 20, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
                                                    {/* <GrowthChart
                                                        title="AAAA"
                                                        chartType={chartTypes.lengthAge}
                                                        childBirthDate={userRealmStore.getCurrentChild()?.birthDate}
                                                        childGender={userRealmStore.getChildGender() === "boy" ? "male" : 'female'}
                                                        // lineChartData={this.state.measuresData}
                                                        lineChartData={this.state.measuresData}
                                                        showFullscreen={false}
                                                    /> */}
                                                </View>
                                                {
                                                    this.state.InterpretationTexWeightLength.text ?
                                                        <View style={{ flex: 1, padding: 20, marginBottom: 20, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
                                                            <Typography>
                                                                {this.state.InterpretationTexWeightLength.text}
                                                            </Typography>
                                                            <TextButton color={TextButtonColor.purple} onPress={() => this.goToArticle(this.state.InterpretationTexWeightLength.articleId)}>Saznaj vise</TextButton>
                                                        </View> : null
                                                }
                                                <View>
                                                    {/* <NewMeasurements onPress={() => this.goToNewMeasurements()} /> */}
                                                    <LastMeasurements
                                                        measureDate={this.state.measuresData[this.state.measuresData.length - 1].measurementDate.toString()}
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
    container: ViewStyle
}

const styles = StyleSheet.create<GrowthScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    }
})

