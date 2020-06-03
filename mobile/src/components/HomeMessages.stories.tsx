import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { HomeMessages, Message, IconType } from './HomeMessages';
import { RoundedButtonType } from './RoundedButton';

const messages: Message[] = [
    {
        text: 'Hello world 01',
        subText: 'Some text',
        textStyle: { fontWeight: 'bold' },
        iconType: IconType.growth,
    },

    {
        text: 'Set data',
        iconType: IconType.doctor,
        button: {
            text: 'Click me',
            type: RoundedButtonType.purple,
            onPress: action('Button clicked')
        }
    },

    {
        text: 'Hello world 02',
        iconType: IconType.doctor,
    },

    {
        text: 'Hello world 03',
        iconType: IconType.heart,
    },

    {
        text: 'Hello world 04',
        iconType: IconType.checked,
    },

    {
        text: 'Hello world 05',
        iconType: IconType.celebrate,
    },

    {
        text: 'Hello world 06',
        iconType: IconType.syringe,
    },

    {
        text: 'Hello world 07',
        iconType: IconType.user,
    },
];

storiesOf('HomeMessages', module)

    .add('default', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <HomeMessages showCloseButton={true} messages={messages}></HomeMessages>
        </View>
    ))

    .add('purple', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <HomeMessages showCloseButton={true} cardType="purple" messages={messages}></HomeMessages>
        </View>
    ))
    ;