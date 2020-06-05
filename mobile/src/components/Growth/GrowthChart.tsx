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

const areaData = {
    boy: {
        areaExceptionsChartData: [
            { x: 0, y: 45, y0: 52 },
            { x: 1, y: 46, y0: 57 },
            { x: 2, y: 47, y0: 59 },
            { x: 25, y: 60, y0: 85 },
        ],
        areaChartData: [
            { x: 0, y: 47, y0: 49 },
            { x: 1, y: 48, y0: 54 },
            { x: 2, y: 49, y0: 57 },
            { x: 25, y: 65, y0: 85 },
        ],
    },
    girl: {
        areaExceptionsChartData: [
            { x: 0, y: 45, y0: 52 },
            { x: 1, y: 46, y0: 57 },
            { x: 2, y: 47, y0: 59 },
            { x: 25, y: 60, y0: 85 },
        ],
        areaChartData: [
            { x: 0, y: 47, y0: 49 },
            { x: 1, y: 48, y0: 54 },
            { x: 2, y: 49, y0: 57 },
            { x: 25, y: 65, y0: 85 },
        ],
    }
}

const fontFamily = 'SFUIDisplay-Regular';


export interface Props {
    labelXText: string,
    labelYText: string,
    title: string,
    dataX: number[],
    dataY: number[],
    gender: childGender,
    lineChartData: ChartData[],
}

export interface State {
    orientation: 'portrait' | 'landscape';
    width: number,
    height: number,
    areaChartData: ChartData[],
    areaExceptionsChartData: ChartData[],
}


export class GrowthChart extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.initState()
    }

    private initState() {
        let windowWidth = Dimensions.get('window').width;
        let windowHeight = Dimensions.get('window').height;

        let data = this.props.gender === 'boy' ? areaData.boy : areaData.girl

        let state: State = {
            orientation: windowWidth > windowHeight ? 'landscape' : 'portrait',
            width: windowWidth,
            height: windowHeight,
            areaChartData: data.areaChartData,
            areaExceptionsChartData: data.areaExceptionsChartData,
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
        const sortedXdata: number[] = this.props.dataX.sort((n1: number, n2: number) => n1 - n2);
        const sortedYdata: number[] = this.props.dataY.sort((n1: number, n2: number) => n1 - n2);

        const minDomain = {
            x: sortedXdata[0] - sortedXdata[0],
            y: sortedYdata[0] - sortedXdata[0]
        }

        const maxDomain = {
            x: sortedXdata[sortedXdata.length - 1],
            y: sortedYdata[sortedYdata.length - 1],
        }

        return (
            <View style={styles.container} onLayout={this.onLayout}>
                <Typography type={TypographyType.headingSecondary}>{this.props.title}</Typography>
                <Svg style={{ marginLeft: -10 }} >
                    <VictoryChart
                        theme={VictoryTheme.material}
                        minDomain={minDomain}
                        maxDomain={maxDomain}
                        domainPadding={20}
                        width={this.state.width}
                        height={this.state.height}
                    >
                        {/* ********* AXIS HORIZONTAL ********* */}
                        <VictoryAxis
                            tickFormat={this.props.dataX}
                            style={victoryStyles.VictoryAxis}
                            label={this.props.labelXText}
                            axisLabelComponent={<VictoryLabel x={this.state.width - 20} />}
                        />

                        {/* ********* AXIS VERTICAL ********* */}
                        <VictoryAxis
                            tickFormat={this.props.dataY}
                            style={victoryStyles.VictoryAxisVertical}
                            axisLabelComponent={<VictoryLabel y={30} />}
                            dependentAxis
                            label={this.props.labelYText}
                        />

                        {/* ********* AREA EXCEPTIONS ********* */}
                        <VictoryArea
                            interpolation="natural"
                            style={victoryStyles.VictoryExceptionsArea}
                            data={this.state.areaExceptionsChartData}
                        />

                        {/* ********* AREA ********* */}
                        <VictoryArea
                            interpolation="natural"
                            style={victoryStyles.VictoryArea}
                            data={this.state.areaChartData}
                        />
                        

                        {/* ********* LINE CHART ********* */}
                        <VictoryLine
                            data={this.props.lineChartData}
                            interpolation="natural"
                            style={victoryStyles.VictoryLine}
                        />

                        {/* ********* SCATTER ********* */}
                        <VictoryScatter
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
                        />
                    </VictoryChart>
                </Svg>
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

