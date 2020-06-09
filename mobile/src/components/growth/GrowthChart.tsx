import React from 'react';
import { VictoryArea, VictoryLabel, VictoryTooltip, VictoryScatter, VictoryChart, VictoryAxis, VictoryTheme, VictoryLine, VictoryZoomContainer } from "victory-native";
import { VictoryAxisCommonProps, TickLabelProps, Background } from 'victory-core';
import { VictoryTooltipProps } from 'victory-tooltip';
import { VictoryScatterProps } from 'victory-scatter';
import { VictoryLineProps } from 'victory-line';
import { VictoryAreaProps } from 'victory-area'
import { Dimensions, ViewStyle, StyleSheet, LayoutChangeEvent, View } from 'react-native';
import Svg from 'react-native-svg';
import { Typography, TypographyType } from '../Typography';
import { ChartData, GrowthChart0_2Type, GrowthChartHeightAgeType } from './growthChartData';
import Icon from 'react-native-vector-icons/Ionicons';
import { translate } from '../../translations';

const fontFamily = 'SFUIDisplay-Regular';

export interface singleAreaDataFormat {
    x: number | null,
    y: number | null,
    y0: number | null,
}

export interface chartAreaDataFormat {
    topArea: singleAreaDataFormat[],
    middleArea: singleAreaDataFormat[],
    bottomArea: singleAreaDataFormat[],

}

export enum chartTypes {
    height_length,
    length_age
}


export interface Props {
    chartType: chartTypes,
    title: string,
    lineChartData: ChartData[],
    childGender: "male" | "female",
    childBirthDate: Date,
    showFullscreen: boolean,
}

export interface State {
    orientation: 'portrait' | 'landscape';
    width: number,
    height: number,
    topArea: singleAreaDataFormat[],
    middleArea: singleAreaDataFormat[],
    bottomArea: singleAreaDataFormat[],
    lineChart: LineChartData[]
    labelX: "cm" | "meseci",
    labelY: "kg" | "cm",
}

export class GrowthChart extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.initState()
    }

    /* *********** GET AGE FROM BIRTH DATE *********** */
    private getChildAge = () => {
        var diff_ms = Date.now() - this.props.childBirthDate.getTime();
        var age_dt = new Date(diff_ms);

        return (age_dt.getUTCFullYear() - 1970) * 365; // CONVERT VALUE IN DAYS FOR CALCULATION 
    }

    /* *********** FORMAT DATA FOR OUR CHART *********** */
    private formatChartData = (data: GrowthChart0_2Type | GrowthChartHeightAgeType) => {

        let obj: chartAreaDataFormat;

        let topArea: singleAreaDataFormat[] = [];
        let middleArea: singleAreaDataFormat[] = [];
        let bottomArea: singleAreaDataFormat[] = [];

        // FIX ME 
        data.map(item => {
            let xValue: number = 0;

            if (this.props.chartType === chartTypes.length_age) {
                xValue = item.Day / 30; // GET ARRAY OF MONTHS
            } else {
                xValue = item.Height
            }

            topArea.push({ x: xValue, y: item.SD3, y0: item.SD4 });
            middleArea.push({ x: xValue, y: item.SD3neg, y0: item.SD3 });
            bottomArea.push({ x: xValue, y: item.SD3neg, y0: item.SD4neg });
        })

        obj = {
            topArea: topArea,
            middleArea: middleArea,
            bottomArea: bottomArea,
        }

        return obj;
    }

    private initState() {
        let windowWidth = Dimensions.get('window').width;
        let windowHeight = Dimensions.get('window').height;


        const { GrowthChartBoys0_2, GrowthChartBoys2_5, GrowthChartGirls0_2, GrowthChartGirls2_5, Height_age_boys0_5, Height_age_girls0_5 } = ChartData;
        const { childGender, chartType } = this.props;

        let obj: chartAreaDataFormat;

        if (childGender === "male") {
            // boys
            if (chartType === chartTypes.height_length) { // tezina za visinu 
                if (this.getChildAge() <= 730) {
                    /*********** BOYS 0 - 2 ***********/
                    obj = this.formatChartData(GrowthChartBoys0_2);
                } else {
                    /*********** BOYS 2 - 5 ***********/
                    obj = this.formatChartData(GrowthChartBoys2_5);
                }
            } else {
                /*********** ###### tezina uzrast decaci 0 - 5 ***********/
                obj = this.formatChartData(Height_age_boys0_5);
            }
        } else {
            /*********** girls ***********/
            if (chartType === chartTypes.height_length) { // tezina za visinu 
                if (this.getChildAge() <= 730) {
                    /*********** Girls 0 - 2 ***********/
                    obj = this.formatChartData(GrowthChartGirls0_2);
                } else {
                    /*********** Girls 2 - 5 ***********/
                    obj = this.formatChartData(GrowthChartGirls2_5);
                }
            } else {
                /***********tezina uzrast devojcice 0 - 5 ***********/
                obj = this.formatChartData(Height_age_girls0_5);
            }
        }

        const chartData: LineChartData[] = [];

        /*********** CREATE LINE CHART ARRAY FOR TYPE OF CHART ***********/
        this.props.lineChartData.map(item => {
            chartData.push(this.props.chartType === chartTypes.height_length ? { x: item.length, y: item.height } : { x: item.measurementDay / 30, y: item.length })
        })

        let state: State = {
            orientation: windowWidth > windowHeight ? 'landscape' : 'portrait',
            width: windowWidth,
            height: windowHeight,
            bottomArea: obj.bottomArea,
            topArea: obj.topArea,
            middleArea: obj.middleArea,
            lineChart: chartData,
            labelX: chartType === chartTypes.height_length ? "cm" : "meseci",
            labelY: chartType === chartTypes.height_length ? "kg" : "cm"
        };

        this.state = state;
    }


    private onLayout = (event: LayoutChangeEvent) => {
        let layout = event.nativeEvent.layout;

        this.setState({
            width: layout.width,
            height: layout.height,
        })
    }


    public render() {

        return (
            <View style={styles.container} onLayout={this.onLayout}>
                <View style={styles.chartHeader}>
                    <Typography type={TypographyType.headingSecondary}>{this.props.title}</Typography>
                    {
                        this.props.showFullscreen ?
                            <Icon name="md-close" style={{ position: 'absolute', right: 0, fontSize: 20 }} />
                            :
                            <Icon name="md-resize" style={{ position: 'absolute', right: 0, fontSize: 20 }} />

                    }
                </View>
                <Svg style={{ marginLeft: -10 }} >
                    <VictoryChart
                        // containerComponent={<VictoryZoomContainer allowZoom={false} zoomDomain={{x: [1, 60]} }/>}  
                        theme={VictoryTheme.material}
                        // minDomain={0}
                        // maxDomain={400}
                        // domainPadding={-120}
                        width={this.state.width}
                        height={this.state.height - 200}
                    >
                        {/* ********* AXIS HORIZONTAL ********* */}
                        <VictoryAxis
                            // tickFormat={this.state.topArea}
                            style={victoryStyles.VictoryAxis}
                            label={this.state.labelX}
                            axisLabelComponent={<VictoryLabel x={this.state.width - 20} />}
                        />

                        {/* ********* AXIS VERTICAL ********* */}
                        <VictoryAxis
                            // tickFormat={this.props.dataY}
                            style={victoryStyles.VictoryAxisVertical}
                            axisLabelComponent={<VictoryLabel y={30} />}
                            dependentAxis
                            label={this.state.labelY}
                        />

                        {/* ********* TOP AREA ********* */}
                        <VictoryArea
                            interpolation="natural"
                            style={victoryStyles.VictoryExceptionsArea}
                            data={this.state.topArea}
                        />
                        {/* ********* BOTTOM AREA EXCEPTIONS ********* */}
                        <VictoryArea
                            interpolation="natural"
                            style={victoryStyles.VictoryExceptionsArea}
                            data={this.state.bottomArea}
                        />
                        {/* ********* MIDDLE AREA ********* */}
                        <VictoryArea
                            interpolation="natural"
                            style={victoryStyles.VictoryArea}
                            data={this.state.middleArea}
                        />


                        {/* ********* LINE CHART ********* */}
                        <VictoryLine
                            data={this.state.lineChart}
                            interpolation="natural"
                            style={victoryStyles.VictoryLine}
                        />

                        {/* ********* SCATTER ********* */}
                        <VictoryScatter
                            data={this.state.lineChart}
                            size={9}
                            style={victoryStyles.VictoryScatter}
                            labelComponent={
                                <VictoryTooltip
                                    renderInPortal={false}
                                    style={victoryStyles.VictoryTooltip.style}
                                    flyoutStyle={victoryStyles.VictoryTooltip.flyoutStyle}
                                />
                            }
                            labels={(props) => props.datum.y + " " + this.state.labelY + ' / ' + (Math.round((props.datum.x + Number.EPSILON) * 100) / 100) + " " + this.state.labelX}
                            events={[{
                                target: "data",
                                eventHandlers: {
                                    onPressIn: () => {
                                        return [
                                            {
                                                target: "data",
                                                mutation: (props) => {
                                                    const stroke = props.style && props.style.stroke;
                                                    return stroke === "orange" ? null : { style: { stroke: "orange", strokeWidth: 4, fill: 'white' } };
                                                }
                                            },
                                            {
                                                target: "labels",
                                                mutation: (props) => typeof props.active === "boolean" ? null : { active: true }
                                            },

                                        ]
                                    },
                                    onPressOut: () => {
                                        return [
                                            {
                                                target: "labels",
                                                mutation: (props) => ({ active: props.active })
                                            },
                                        ]
                                    }
                                }
                            }]}
                        />
                    </VictoryChart>
                    <View style={styles.chartLegend}>
                        <View style={styles.chartLegendItem}>
                            <View style={{ width: 27, height: 12, backgroundColor: '#D8D8D8', margin: 10 }}></View>
                            <Typography style={{ fontSize: 11, opacity: 0.5 }}>{translate('growthChartLegendSilverLabel')}</Typography>
                        </View>
                        {
                            this.props.showFullscreen && (
                                <View style={styles.chartLegendItem}>
                                    <View style={{ width: 27, height: 12, backgroundColor: '#F9C49E', margin: 10 }}></View>
                                    <Typography style={{ fontSize: 11, opacity: 0.5 }}>{translate('growthChartLegendOrangeLabel')}</Typography>
                                </View>
                            )
                        }
                    </View>
                </Svg>

            </View>
        )
    }
}


export interface ChartData {
    measurementDay: number,
    height: number,
    length: number,
}

export interface LineChartData {
    x: number,
    y: number,
}

export interface GrowtChartStyles {
    container?: ViewStyle;
    contentWrapper?: ViewStyle;
    chartLegend: ViewStyle;
    chartLegendItem: ViewStyle;
    chartHeader: ViewStyle;
}

export interface VictoryStyles {
    VictoryAxis: VictoryAxisCommonProps['style'],
    VictoryAxisVertical: VictoryAxisCommonProps['style'],
    VictoryLine: VictoryLineProps['style'],
    VictoryScatter: VictoryScatterProps['style'],
    VictoryArea: VictoryAreaProps['style'],
    VictoryExceptionsArea: VictoryAreaProps['style'],
    axisLabel?: TickLabelProps,
    VictoryTooltip: VictoryTooltipProps,
}

const styles = StyleSheet.create<GrowtChartStyles>({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    chartHeader: {
        flexDirection: "row"
    },
    contentWrapper: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    chartLegend: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    chartLegendItem: {
        flexDirection: 'row',
        alignItems: 'center'
    }

});


const victoryStyles: VictoryStyles = {
    VictoryAxis: {
        grid: { stroke: 'transparent' },
        axis: { stroke: 'none' },
        axisLabel: { fontFamily: fontFamily, },
        tickLabels: { fontFamily: fontFamily }
    },

    VictoryAxisVertical: {
        grid: { stroke: 'transparent' },
        axis: { stroke: 'none' },
        // @ts-ignore
        axisLabel: { angle: 0, fontFamily: fontFamily },
        tickLabels: { fontFamily: fontFamily }
    },
    VictoryLine: {
        data: { stroke: "#0C66FF", strokeWidth: 9, strokeLinecap: "round", }
    },
    VictoryScatter: {
        data: { fill: "white", stroke: 'grey', strokeWidth: 3 },
        labels: { fill: "red", fontFamily: fontFamily },
    },
    VictoryArea: {
        data: { fill: "#D8D8D8" }
    },
    VictoryExceptionsArea: {
        data: { fill: "#F9C49E" }
    },
    VictoryTooltip: {
        flyoutStyle: {
            stroke: 'none',
            fill: '#262626',
            opacity: 85
        },
        style: {
            padding: 15,
            fill: 'white',
        }
    },

}
