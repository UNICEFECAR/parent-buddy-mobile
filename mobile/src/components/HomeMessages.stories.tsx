import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { HomeMessages } from './HomeMessages';

storiesOf('HomeMessages', module)

.add('default', () => (
    <HomeMessages></HomeMessages>
))
;