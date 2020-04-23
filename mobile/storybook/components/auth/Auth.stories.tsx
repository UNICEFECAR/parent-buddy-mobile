import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { Google } from "./Google";
import { Facebook } from "./Facebook";

storiesOf('Auth', module)

.add('google', () => (
    <Google />
))

.add('facebook', () => (
    <Facebook />
))
;