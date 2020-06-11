import React, { Component } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { RoundedButton, RoundedButtonType } from '../RoundedButton';
import { translate } from '../../translations/translate';
import { scale, moderateScale } from 'react-native-size-matters';
import { ContentEntity } from '../../stores';
import { TextButton } from '..';
import { TextButtonColor } from '../TextButton';


export interface Props {
    title?: string
    subTitle?: string
    html?: string
    roundedButton?: { title: string, onPress: Function }
    textButton?: { title: string, onPress: Function }
    articles?: ContentEntity[]
}

export class MilestoneCard extends Component<Props> {
    render() {
        return (
            <View style={styles.container}>

                {this.props.title && (<Typography type={TypographyType.headingPrimary} style={{ marginBottom: 0 }}>{this.props.title}</Typography>)}
                {this.props.subTitle && (<Typography type={TypographyType.headingSecondary}>{this.props.subTitle}</Typography>)}

                {this.props.html && (
                    <Typography type={TypographyType.bodyRegularLargeSpacing} style={{ marginTop: 15 }}>
                        {this.props.html}
                    </Typography>
                )}
                {
                    this.props.roundedButton && (
                        <RoundedButton text="Popunite upitnik" type={RoundedButtonType.purple} showArrow={true} style={{ marginTop: 20 }} />
                    )
                }
                {
                    this.props.textButton && (
                        <TextButton color={TextButtonColor.purple} style={{ justifyContent: "center", marginTop: 20 }} >Više o razvoju u ovom periodu</TextButton>
                    )
                }
            </View>
        )
    }
}


export interface MilestoneCardStyles {
    [index: string]: ViewStyle | TextStyle,
    container: ViewStyle,
    measureDateContainer: ViewStyle,
    measureContainer: ViewStyle,
    measureDateContainerText: TextStyle,
    measureDateText: TextStyle,
    button: ViewStyle,
}

const styles = StyleSheet.create<MilestoneCardStyles>({
    container: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
    },
    measureContainer: {
        flexDirection: 'row',
        marginTop: scale(24),
        marginBottom: scale(32),
    },
    measureDateContainer: {
        width: scale(88),
        marginRight: scale(42)
    },
    measureDateContainerText: {
        opacity: 0.5,
    },
    button: {
        marginBottom: scale(8),
    },
    measureDateText: {
        marginTop: moderateScale(-7),
        fontWeight: "bold",
    }
})