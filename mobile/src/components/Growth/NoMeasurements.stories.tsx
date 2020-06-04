import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { NoMeasurements } from './NoMeasurements';

storiesOf('NoMeasurements', module)

    .add('default', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', }}>
            <NoMeasurements />
        </View>
    ));