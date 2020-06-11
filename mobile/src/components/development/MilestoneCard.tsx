import React, { Component } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle, Dimensions } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { RoundedButton, RoundedButtonType } from '../RoundedButton';
import { scale } from 'react-native-size-matters';
import { ContentEntity } from '../../stores';
import { TextButton } from '..';
import { TextButtonColor } from '../TextButton';
// @ts-ignore
import HTML from 'react-native-render-html';

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

                {this.props.title && (<Typography type={TypographyType.headingPrimary} style={styles.headerStyle}>{this.props.title}</Typography>)}
                {this.props.subTitle && (<Typography type={TypographyType.headingSecondary}>{this.props.subTitle}</Typography>)}

                {this.props.html && (
                    <View style={styles.contentStyle}>
                        <HTML
                            html={this.props.html}
                            baseFontStyle={{ fontSize: scale(17) }}
                            tagsStyles={htmlStyles}
                            imagesMaxWidth={Dimensions.get('window').width}
                            staticContentMaxWidth={Dimensions.get('window').width}
                        />                    
                    </View>
                )}
                {
                    this.props.roundedButton && (
                        <RoundedButton
                            text={this.props.roundedButton.title}
                            type={RoundedButtonType.purple}
                            showArrow={true}
                            style={styles.buttonStyle}
                            onPress={this.props.roundedButton.onPress}
                        />
                    )
                }
                {
                    this.props.textButton && (
                        <TextButton
                            color={TextButtonColor.purple}
                            style={styles.textButtonStyle}
                            onPress={this.props.textButton.onPress}
                        >
                            {this.props.textButton.title}
                        </TextButton>
                    )
                }
            </View>
        )
    }
}


export interface MilestoneCardStyles {
    [index: string]: ViewStyle | TextStyle,
    container: ViewStyle,
    headerStyle: TextStyle,
    buttonStyle: ViewStyle,
    textButtonStyle: ViewStyle,
    contentStyle: ViewStyle
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
    headerStyle: {
        marginBottom: 0,
    },
    contentStyle: {
        marginTop: scale(15)
    },
    buttonStyle: {
        marginTop: scale(20)
    },
    textButtonStyle: {
        justifyContent: "center",
        marginTop: scale(20)
    }
})

const htmlStyles = {
    p: { marginBottom: 15 },
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(15) },
};