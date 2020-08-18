import React, { Component } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle, ImageStyle } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { translate } from '../../translations/translate';
import Icon from "react-native-vector-icons/FontAwesome";
import { scale, moderateScale } from 'react-native-size-matters';
import { IconProps } from 'react-native-paper/lib/typescript/src/components/MaterialCommunityIcon';

export interface Props {
    title: string,
}

export class DoctorVisitCard extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>
            </View>
        )
    }
}


export interface DoctorVisitCardStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle,
    container: ViewStyle,
}

const styles = StyleSheet.create<DoctorVisitCardStyles>({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
    },
});