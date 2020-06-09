import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { GrowthChart, chartTypes } from './GrowthChart';

const dumbData = {
    lineChartData: [{ measurementDay: 269, height: 5.8, length: 65 }, { measurementDay: 330, height: 8, length: 68 }, { measurementDay: 400, height: 10, length: 82 }, { measurementDay: 1000, height: 15, length: 95 }],
    childBirthDate: new Date("06/09/2018"),   // 0 - 2
    childBirthDate2: new Date("06/09/2017"), // 2 - 5
}


storiesOf('GrowthChart', module)

    .add('Tezina za visinu devojcice 0-2 godine', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                lineChartData={dumbData.lineChartData}
                childGender="female"
                showFullscreen={false}
                chartType={chartTypes.height_length}
                childBirthDate={dumbData.childBirthDate}

            />
        </View>
    ))
    .add('Tezina za visinu devojcice 2-5 godine', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                lineChartData={dumbData.lineChartData}
                childGender="female"
                showFullscreen={false}
                chartType={chartTypes.height_length}
                childBirthDate={dumbData.childBirthDate2}

            />
        </View>
    ))
    .add('Tezina za visinu decaci 0-2 godine', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                lineChartData={dumbData.lineChartData}
                childGender="female"
                showFullscreen={false}
                chartType={chartTypes.height_length}
                childBirthDate={dumbData.childBirthDate}

            />
        </View>
    ))
    .add('Tezina za visinu decaci 2-5 godine', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                lineChartData={dumbData.lineChartData}
                childGender="male"
                showFullscreen={false}
                chartType={chartTypes.height_length}
                childBirthDate={dumbData.childBirthDate2}

            />
        </View>
    ))
    .add('Visina za uzrast devojcice 0 - 5 g', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Visina za uzrast"
                lineChartData={dumbData.lineChartData}
                childGender="female"
                showFullscreen={false}
                chartType={chartTypes.length_age}
                childBirthDate={dumbData.childBirthDate}

            />
        </View>
    ))
    .add('Visina za uzrast decaci 0 - 5 g', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Visina za uzrast"
                lineChartData={dumbData.lineChartData}
                childGender="male"
                showFullscreen={false}
                chartType={chartTypes.length_age}
                childBirthDate={dumbData.childBirthDate}
            />
        </View>
    ));