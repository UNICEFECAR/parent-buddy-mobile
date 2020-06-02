import React from 'react';
import { VictoryArea, VictoryLabel, VictoryTooltip, VictoryScatter, VictoryChart, VictoryAxis, VictoryTheme, VictoryLine } from "victory-native";
import { Text, Dimensions, ViewStyle, StyleSheet, LayoutChangeEvent, View } from 'react-native';
import Svg from 'react-native-svg';


export interface ChartData {
    x: number,
    y: number,
}

export interface Props {
    labelXText: string,
    labelYText: string,
    labelXPosition?: number,
    labelYPosition?: number,
    title: string,
    dataX: number[],
    dataY: number[],
    lineChartData: ChartData[],
    areaChartData: ChartData[],
    areaExceptionsChartData: ChartData[],
}

export interface State {
    orientation: 'portrait' | 'landscape';
    width: number,
    height: number,
}

export class GrowthChart extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.initState()
    }

    private initState() {
        let windowWidth = Dimensions.get('window').width;
        let windowHeight = Dimensions.get('window').height;

        let state: State = {
            orientation: windowWidth > windowHeight ? 'landscape' : 'portrait',
            width: windowWidth,
            height: windowHeight,
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
                <Text>{this.props.title}</Text>
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
                            axisLabelComponent={<VictoryLabel x={this.props.labelXPosition || this.state.width - 20} />}
                        />

                        {/* ********* AXIS VERTICAL ********* */}
                        <VictoryAxis
                            tickFormat={this.props.dataY}
                            style={victoryStyles.VictoryAxisVertical}
                            axisLabelComponent={<VictoryLabel y={this.props.labelYPosition || 30} />}
                            dependentAxis
                            label={this.props.labelYText}
                        />

                        {/* ********* AREA EXCEPTIONS ********* */}
                        <VictoryArea
                            interpolation="natural"
                            style={victoryStyles.VictoryExceptionsArea}
                            data={this.props.areaExceptionsChartData}
                        />

                        {/* ********* AREA ********* */}
                        <VictoryArea
                            interpolation="natural"
                            style={victoryStyles.VictoryArea}
                            data={this.props.areaChartData}
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
                            labelComponent={<VictoryTooltip />}
                            labels={() => null}
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
                                                mutation: (props) => {
                                                    return typeof props.active === "boolean" ?
                                                        null : { active:  true, text: props.datum.y + ' cm' + ' / ' + props.datum.x + ' kg ' };
                                                }
                                            },

                                        ]
                                    },
                                    onPressOut: () => {
                                        return [
                                            {
                                                target: "labels",
                                                mutation: (props) => {
                                                    console.log(props.active, 'active')
                                                    return { active: props.active, text: props.datum.y + " " + this.props.labelYText + ' / ' + props.datum.x + ' ' + this.props.labelXText }

                                                }
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

export interface GrowtChartStyles {
    container?: ViewStyle;
    contentWrapper?: ViewStyle;
}

export interface VictoryStyles {
    VictoryAxis: object,
    VictoryAxisVertical: object,
    VictoryLine: object,
    VictoryScatter: object,
    VictoryArea: object,
    VictoryExceptionsArea: object,
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
    },
    VictoryAxisVertical: {
        grid: { stroke: 'transparent' },
        axis: { stroke: 'none' },
        axisLabel: { angle: 0, }
    },
    VictoryLine: {
        data: { stroke: "#0C66FF", strokeWidth: 9, strokeLinecap: "round", }
    },
    VictoryScatter: {
        data: { fill: "white", stroke: 'grey', strokeWidth: 3 },
        labels: { fill: "red" }
    },
    VictoryArea: {
        data: { fill: "silver" }
    },
    VictoryExceptionsArea: {
        data: { fill: "orange" }
    }
}