import React, { ReactNode } from 'react';
import { Platform } from 'react-native';
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
import Orientation from 'react-native-orientation-locker';

const fontFamily = 'SFUIDisplay-Regular';
const dayLimit = 730;

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

    public componentDidMount(){
        if(this.props.showFullscreen){
            Orientation.lockToLandscape()
        }else{
            Orientation.lockToPortrait()
        }
    }
    
    public componentWillUnmount() {
        Orientation.lockToPortrait();
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
                topArea.push({ x: item.Day / 30, y: item.SD3, y0: item.SD4 });
                middleArea.push({ x: item.Day / 30, y: item.SD3neg, y0: item.SD3 });
                bottomArea.push({ x: item.Day / 30, y: item.SD3neg, y0: item.SD4neg });
            } else {
                xValue = item.Height
                    if (item.Height >= 45 && item.Height <= 87) {
                        topArea.push({ x: item.Height, y: item.SD3, y0: item.SD4 });
                        middleArea.push({ x: item.Height, y: item.SD3neg, y0: item.SD3 });
                        bottomArea.push({ x: item.Height, y: item.SD3neg, y0: item.SD4neg });
                    }

                    if (item.Height > 87.0) {
                        topArea.push({ x: item.Height, y: item.SD3, y0: item.SD4 });
                        middleArea.push({ x: item.Height, y: item.SD3neg, y0: item.SD3 });
                        bottomArea.push({ x: item.Height, y: item.SD3neg, y0: item.SD4neg });
                    }
            }
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
            if (chartType === chartTypes.height_length) { 
                if (this.getChildAge() <= dayLimit) {
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
            if (chartType === chartTypes.height_length) {
                if (this.getChildAge() <= dayLimit) {
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

        /* Create line chart array for type chart */
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
            height: this.props.showFullscreen ? layout.height - 50:  layout.height - 200,
        })
    }

    private renderChart = (): ReactNode => (
        <>
            <VictoryChart
                theme={VictoryTheme.material}
                width={this.state.width}
                height={this.state.height}
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
                    style={{data: this.props.showFullscreen ? { fill: "#F9C49E" } : {fill: "#D8D8D8"}}}
                    data={this.state.topArea}
                />
                {/* ********* BOTTOM AREA ********* */}
                <VictoryArea
                    interpolation="natural"
                    style={{data: this.props.showFullscreen ? { fill: "#F9C49E" } : {fill: "#D8D8D8"}}}
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
                            onPressIn: (evt, pressedProps) => {
                                const selectedDataIndex = pressedProps.index
                                console.log(selectedDataIndex, 'data index')
                                return [
                                    {
                                        eventKey: 'all',
                                        target: 'labels',
                                        mutation: props => {
                                            let activeState = true
                                            if (props.active === true) {
                                                activeState = null
                                            }
                                            return props.index ===
                                                selectedDataIndex
                                                ? { active: activeState }
                                                : { active: false }
                                        },
                                    },
                                    {
                                        eventKey: 'all',
                                        target: "data",
                                        mutation: (props) => {
                                            const stroke = props.style && props.style.stroke;
                                            let st;
                                            let activeState = true
                                            if (props.active === true) {
                                                activeState = null
                                            }
                                            if (stroke === "orange") {
                                                st = '#ACACAC';
                                            } else {
                                                st = 'orange';

                                            }

                                            return props.index === selectedDataIndex
                                                ? { style: { stroke: st, strokeWidth: 3, fill: 'white' } }
                                                : null
                                        }
                                    },
                                ]
                            },
                            onPressOut: (evt, pressedProps) => {
                                const selectedDataIndex = pressedProps.index
                                return [
                                    {
                                        eventKey: "all",
                                        target: "labels",
                                        mutation: (props) => {
                                            console.log(props.index, 'props index in onPressOut');
                                            console.log(selectedDataIndex, 'selected data index in onPressOut');

                                            return props.index === selectedDataIndex
                                                ? { active: props.active }
                                                : null
                                        }
                                    },
                                    {
                                        eventKey: 'all',
                                        target: "data",
                                        mutation: (props) => {
                                            const stroke = props.style && props.style.stroke;
                                            // return stroke === "orange" ? null : { style: { stroke: "orange", strokeWidth: 4, fill: 'white' } };
                                            return props.index === selectedDataIndex
                                                ? { style: { fill: 'white', stroke: props.style.stroke, strokeWidth: 3 } }
                                                : null
                                        },
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
        </>
    )

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
                {
                    Platform.OS === 'ios' ?
                        this.renderChart()
                        :
                        <Svg style={{ marginLeft: -10 }} >
                            {this.renderChart()}
                        </Svg>
                }


            </View>
        )
    }
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
        data: { fill: "white", stroke: '#ACACAC', strokeWidth: 3 },
        labels: { fill: "red", fontFamily: fontFamily },
    },
    VictoryArea: {
        data: { fill: "#D8D8D8" }
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

export interface singleAreaDataFormat {
    x?: number | null,
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