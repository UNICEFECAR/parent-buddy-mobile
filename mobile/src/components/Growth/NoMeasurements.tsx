import React, { Component } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography, TypographyType } from '../Typography';
import { RoundedButton, RoundedButtonType } from '../RoundedButton';
import { Tag, TagColor } from '../Tag';
import { translate } from '../../translations/translate';

export class NoMeasurements extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.tagContainer}>
                    <Tag color={TagColor.orange}>
                        {translate('noMeasurementsTagWarrning')}
                    </Tag>
                </View>
                <View style={styles.textContainer}>
                    <Typography type={TypographyType.bodyRegular}>
                        {translate('noMeasurementsDescription')}
                    </Typography>
                </View>
                <RoundedButton
                    type={RoundedButtonType.purple}
                    showArrow={true}
                    text={translate('noMeasurementsDescriptionAddMeasureBtn')} 
                />
            </View>
        )
    }
}


export interface NoMeasurementsStyles {
    container: ViewStyle,
    tagContainer: ViewStyle,
    textContainer: ViewStyle,
}

const styles = StyleSheet.create<NoMeasurementsStyles>({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: 16,
    },
    textContainer: {
        marginBottom: 30
    },
    tagContainer: {
        marginTop: 8,
        marginBottom: 16,
        width: 180,
        height: 30,
    }
})