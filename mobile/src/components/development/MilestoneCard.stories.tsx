import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import {MilestoneCard} from './MilestoneCard';

const onPres = () => {

}

storiesOf('MilestoneCard', module)
    .add('MilestoneCard', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <MilestoneCard 
                title="TITLE"
                subTitle="SUBTITLE "
                html={"HTML"}
                roundedButton={{title: 'Rounded button', onPress: onPres}}
            />
        </View>
    ));