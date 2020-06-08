import React from 'react';
import { VictoryArea, VictoryLabel, VictoryTooltip, VictoryScatter, VictoryChart, VictoryAxis, VictoryTheme, VictoryLine } from "victory-native";
import { VictoryAxisCommonProps, TickLabelProps } from 'victory-core';
import { VictoryTooltipProps } from 'victory-tooltip';
import { VictoryScatterProps } from 'victory-scatter';
import { VictoryLineProps } from 'victory-line';
import { VictoryAreaProps } from 'victory-area'
import { Dimensions, ViewStyle, StyleSheet, LayoutChangeEvent, View } from 'react-native';
import Svg from 'react-native-svg';
import { Typography, TypographyType } from '../Typography';
import { ChartData } from '../../dummy-data/growthChartData';

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

export enum chartTypes{
    height_length,
    length_age
}


export interface Props {
    chartType: chartTypes,
    title: string,
    dataX: number[],
    dataY: number[],
    gender: childGender,
    lineChartData: ChartData[],
    childGender: "male" | "female",
    // childBirthDate: Date,
    showFullscreen: boolean,
    childAge: number, // temporary 
}

export interface State {
    orientation: 'portrait' | 'landscape';
    width: number,
    height: number,
    topArea: singleAreaDataFormat[],
    middleArea: singleAreaDataFormat[],
    bottomArea: singleAreaDataFormat[],

}


export class GrowthChart extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.initState()
    }

    private getChildAge = () => {
        // izraunavanje godina deteta 

    }


    private formatChartData = (data: object[]) => {

        let obj: chartAreaDataFormat;

        let topArea: singleAreaDataFormat[] = [];
        let middleArea: singleAreaDataFormat[] = [];
        let bottomArea: singleAreaDataFormat[] = [];

        data.map(item => {

            let xValue:number;

            if(this.props.chartType === chartTypes.length_age){
                xValue = item.Day
            }else{
                xValue = item.Length ? item.Length : item.Height
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
        const { childGender, chartType, childAge } = this.props;

        let obj: chartAreaDataFormat;

        if (childGender === "male") {
            // boys
            if (chartType === chartTypes.height_length) { // tezina za visinu 
                if (childAge < 2) {
                    // BOYS 0 - 2
                    // ###### tezina za visinu, decaci 0-2 ######
                    obj = this.formatChartData(GrowthChartBoys0_2);


                } else {
                    // BOYS 2 - 5
                    // ###### tezina za visinu, decaci 2-5 ######
                    obj = this.formatChartData(GrowthChartBoys2_5);

                }
            } else {
                // ###### tezina uzrast decaci 0 - 5
                obj = this.formatChartData(Height_age_boys0_5);

            }
        } else {
            /// girls 
            if (chartType === chartTypes.height_length) { // tezina za visinu 
                if (childAge < 2) {
                    // Girls 0 - 2
                    // ###### tezina za visinu, devojcice 0-2 ######
                    obj = this.formatChartData(GrowthChartGirls0_2);

                } else {
                    // Girls 2 - 5
                    // ###### tezina za visinu, devojcice 2-5 ######
                    obj = this.formatChartData(GrowthChartGirls2_5);

                }
            } else {
                // ###### tezina uzrast devojcice 0 - 5
                obj = this.formatChartData(Height_age_girls0_5);
            }
        }


        let state: State = {
            orientation: windowWidth > windowHeight ? 'landscape' : 'portrait',
            width: windowWidth,
            height: windowHeight,
            bottomArea: obj.bottomArea,
            topArea: obj.topArea,
            middleArea: obj.middleArea,
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

        // SET MAX AND MIN VALUES TO CREATE RANGE FOR X and Y => (X[0] === minX, x[x.length] === max X)
        // const sortedXdata: number[] = this.props.dataX.sort((n1: number, n2: number) => n1 - n2);
        // const sortedYdata: number[] = this.props.dataY.sort((n1: number, n2: number) => n1 - n2);

        // const minDomain = {
        //     x: sortedXdata[0] - sortedXdata[0],
        //     y: sortedYdata[0] - sortedXdata[0]
        // }

        // const maxDomain = {
        //     x: sortedXdata[sortedXdata.length - 1],
        //     y: sortedYdata[sortedYdata.length - 1],
        // }

        return (
            <View style={styles.container} onLayout={this.onLayout}>
                <Typography type={TypographyType.headingSecondary}>{this.props.title}</Typography>
                <Svg style={{ marginLeft: -10 }} >
                    <VictoryChart
                        theme={VictoryTheme.material}
                        // minDomain={0}
                        // maxDomain={400}
                        // domainPadding={-120}
                        width={this.state.width}
                        height={this.state.height}
                    >
                        {/* ********* AXIS HORIZONTAL ********* */}
                        <VictoryAxis
                            // tickFormat={this.state.topArea}
                            style={victoryStyles.VictoryAxis}
                            label={this.props.chartType === chartTypes.height_length ? 'cm' : 'meseci'}
                            axisLabelComponent={<VictoryLabel x={this.state.width - 20} />}
                        />

                        {/* ********* AXIS VERTICAL ********* */}
                        <VictoryAxis
                            // tickFormat={this.props.dataY}
                            style={victoryStyles.VictoryAxisVertical}
                            axisLabelComponent={<VictoryLabel y={30} />}
                            dependentAxis
                            label={this.props.chartType === chartTypes.height_length ? 'kg' : 'cm'}
                        />

                        {/* ********* AREA EXCEPTIONS ********* */}
                        <VictoryArea
                            interpolation="natural"
                            style={victoryStyles.VictoryExceptionsArea}
                            data={this.state.topArea}
                        />
                        {/* ********* AREA EXCEPTIONS ********* */}
                        <VictoryArea
                            interpolation="natural"
                            style={victoryStyles.VictoryExceptionsArea}
                            data={this.state.bottomArea}
                        />
                        {/* ********* AREA ********* */}
                        <VictoryArea
                            interpolation="natural"
                            style={victoryStyles.VictoryArea}
                            data={this.state.middleArea}
                        />


                        {/* ********* LINE CHART ********* */}
                        {/* <VictoryLine
                            data={this.props.lineChartData}
                            interpolation="natural"
                            style={victoryStyles.VictoryLine}
                        /> */}

                        {/* ********* SCATTER ********* */}
                        {/* <VictoryScatter
                            data={this.props.lineChartData}
                            size={9}
                            style={victoryStyles.VictoryScatter}
                            labelComponent={<VictoryTooltip renderInPortal={false} style={victoryStyles.VictoryTooltip.style} flyoutStyle={victoryStyles.VictoryTooltip.flyoutStyle} />}
                            labels={(props) => props.datum.y + this.props.labelYText + ' / ' + props.datum.x + this.props.labelXText}
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
                        /> */}
                    </VictoryChart>
                </Svg>
                {/* <View style={styles.chartLegend}>
                    <View style={styles.chartLegendItem}>
                        <View style={{width: 30, height: 30, backgroundColor: 'black'}}></View>
                        <Typography>asdasdas</Typography>
                    </View>
                </View> */}
            </View>
        )
    }
}


export interface ChartData {
    x: number,
    y: number,
}

export type childGender = 'boy' | 'girl';

export interface GrowtChartStyles {
    container?: ViewStyle;
    contentWrapper?: ViewStyle;
    chartLegend: ViewStyle;
    chartLegendItem: ViewStyle;
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

    contentWrapper: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    chartLegend: {
        flexDirection: 'row',
    },
    chartLegendItem: {
        flexDirection: 'row'
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
        data: { fill: "silver" }
    },
    VictoryExceptionsArea: {
        data: { fill: "orange" }
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

