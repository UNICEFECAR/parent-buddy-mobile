import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { GrowthChart, chartTypes } from './GrowthChart';

const dumbData = {
    dataX: [5, 10, 15, 20, 25],
    dataY: [45, 55, 65, 75, 85],
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
    lineChartData: [{ x: 10, y: 43 }, { x: 15, y: 65 }, { x: 15, y: 80 }]
}


storiesOf('GrowthChart', module)

    .add('Tezina za visinu devojcice 0-2 godine', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                dataX={dumbData.dataX}
                dataY={dumbData.dataY}
                lineChartData={dumbData.lineChartData}
                childGender="female"
                childAge={1}
                showFullscreen={false}
                chartType={chartTypes.height_length}

            />
        </View>
    ))
    .add('Tezina za visinu devojcice 2-5 godine', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                dataX={dumbData.dataX}
                dataY={dumbData.dataY}
                lineChartData={dumbData.lineChartData}
                childGender="female"
                childAge={3}
                showFullscreen={false}
                chartType={chartTypes.height_length}

            />
        </View>
    ))
    .add('Tezina za visinu decaci 0-2 godine', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                dataX={dumbData.dataX}
                dataY={dumbData.dataY}
                lineChartData={dumbData.lineChartData}
                childGender="female"
                childAge={1}
                showFullscreen={false}
                chartType={chartTypes.height_length}

            />
        </View>
    ))
    .add('Tezina za visinu decaci 2-5 godine', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                dataX={dumbData.dataX}
                dataY={dumbData.dataY}
                lineChartData={dumbData.lineChartData}
                childGender="male"
                childAge={1}
                showFullscreen={false}
                chartType={chartTypes.height_length}

            />
        </View>
    ))
    .add('Tezina za visinu decaci 2-5 godine', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                dataX={dumbData.dataX}
                dataY={dumbData.dataY}
                lineChartData={dumbData.lineChartData}
                childGender="male"
                childAge={1}
                showFullscreen={false}
                chartType={chartTypes.height_length}

            />
        </View>
    ))
    .add('Visina za uzrast devojcice 0 - 5 g', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                dataX={dumbData.dataX}
                dataY={dumbData.dataY}
                lineChartData={dumbData.lineChartData}
                childGender="female"
                childAge={1}
                showFullscreen={false}
                chartType={chartTypes.length_age}
            />
        </View>
    ))
    .add('Visina za uzrast decaci 0 - 5 g', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                dataX={dumbData.dataX}
                dataY={dumbData.dataY}
                lineChartData={dumbData.lineChartData}
                childGender="male"
                childAge={1}
                showFullscreen={false}
                chartType={chartTypes.length_age}
            />
        </View>
    ));