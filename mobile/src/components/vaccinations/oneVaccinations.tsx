import React, { Component } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { RoundedButton, RoundedButtonType } from '../RoundedButton';
import { translate } from '../../translations/translate';
import Icon from "react-native-vector-icons/FontAwesome";
import { scale, moderateScale } from 'react-native-size-matters';
import { IconProps } from 'react-native-paper/lib/typescript/src/components/MaterialCommunityIcon';
import { TextButton } from '..';
import { TextButtonColor } from '../TextButton';

export interface VaccinationDate {
    complete: boolean,
    title: string,
    description?: string,
}

export interface Props {
    vaccinationDate?: string,
    title: string,
    isHorizontalLineVisible?: boolean,
    vaccineList: VaccinationDate[]
    onPress: Function,
    onPress2: Function,
}

export interface State {
    isVaccinationComplete: boolean
}

export class OneVaccinations extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.initState()
    }

    private initState = () => {
        let vaccinationComplete = true;

        for (let i: number = 0; i < this.props.vaccineList.length; i++) {
            if (!this.props.vaccineList[i].complete) {
                vaccinationComplete = false;
                break;
            }
        }

        let state: State = {
            isVaccinationComplete: vaccinationComplete,
        }

        this.state = state;
    }

    private renderIcon = (complete: boolean) => {
        if (complete) {
            return "check-circle"
        } else {
            return "exclamation-circle"
        }
    }

    render() {
        return (
            <View>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon
                            name={this.renderIcon(this.state.isVaccinationComplete)}
                            style={[styles.iconStyle, { color: this.state.isVaccinationComplete ? "#2CBA39" : "#EB4747" }]}
                        />
                        <View style={{ flexDirection: "column" }}>
                            <Typography type={TypographyType.headingSecondary}>
                                {this.props.title}
                            </Typography>
                            {
                                !this.state.isVaccinationComplete ? <Typography style={{ marginTop: -7 }} type={TypographyType.headingSecondary}>{translate('vaccinationTitleQuestion')}</Typography> : null
                            }
                            {
                                this.props.vaccinationDate && (
                                    <Typography type={TypographyType.headingSecondary} style={styles.vaccineDateText}>
                                        {this.props.vaccinationDate}
                                    </Typography>
                                )
                            }
                        </View>
                    </View>

                    <View style={styles.vaccineContainer}>
                        <View style={{ flexDirection: 'column' }}>
                            {
                                this.props.vaccineList.map(item => (
                                    <View style={styles.vaccineItemContainer} >
                                        <View style={styles.vaccineItemHeader}>
                                            <Icon
                                                name={this.renderIcon(item.complete)}
                                                style={[styles.iconStyle, { color: item.complete ? "#2CBA39" : "#EB4747" }]}
                                            />
                                            <Typography style={styles.vaccineItemTitle} type={TypographyType.headingSecondary}>
                                                {item.title}
                                            </Typography>
                                        </View>
                                        <View style={styles.vaccineItemContent}>
                                            <TextButton color={TextButtonColor.purple} style={{ marginTop: -4, marginBottom: 12 }}>{translate('moreAboutDisease')}</TextButton>
                                            {
                                                item.description && (
                                                    <>
                                                        <Typography>
                                                            {item.description}
                                                        </Typography>
                                                        <TextButton color={TextButtonColor.purple} style={{ marginTop: 4, marginBottom: 12 }}>{translate('moreAboutVaccineBtn')}</TextButton>
                                                    </>
                                                )
                                            }
                                        </View>
                                    </View>
                                ))
                            }

                            <View>

                            </View>
                        </View>
                    </View>
                    {
                        !this.state.isVaccinationComplete ?
                            <View >
                                <RoundedButton 
                                    style={{ paddingLeft: moderateScale(20) }} 
                                    type={RoundedButtonType.purple} text={translate('AddDataAboutVaccination')} 
                                    showArrow={true} 
                                    onPress={() => this.props.onPress()}
                                />
                                <RoundedButton 
                                    type={RoundedButtonType.hollowPurple} 
                                    text={translate('AddVaccinationReminder')} 
                                    showArrow={true} style={styles.reminderBtn} 
                                    onPress={() => this.props.onPress2()}
                                />
                            </View>
                            : null
                    }

                </View>
                {this.props.isHorizontalLineVisible ? <View style={styles.horizontalLine} /> : null}
            </View >
        )
    }
}


export interface OneVaccinationsStyles {
    [index: string]: ViewStyle | TextStyle,
    container: ViewStyle,
    vaccineContainer: ViewStyle,
    vaccineItemContainer: ViewStyle,
    vaccineItemHeader: ViewStyle,
    vaccineItemTitle: TextStyle,
    vaccineItemContent: ViewStyle,
    reminderBtn: ViewStyle,
    iconStyle: IconProps,
    horizontalLine: ViewStyle,
    vaccineDateText: TextStyle,

}

const styles = StyleSheet.create<OneVaccinationsStyles>({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
    },
    reminderBtn:{
        paddingLeft: moderateScale(20), 
        marginTop: moderateScale(20), 
        marginBottom: moderateScale(24)
    },
    vaccineContainer: {
        flexDirection: 'row',
        marginBottom: scale(16),
    },
    vaccineItemContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 4
    },
    vaccineDateText: {
        marginTop: moderateScale(-5),
        fontSize: moderateScale(17),
        marginBottom: scale(24)
    },
    vaccineItemHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    vaccineItemTitle: {
        width: '90%',
        fontSize: moderateScale(16)
    },
    vaccineItemContent: {
        marginLeft: scale(33),
    },
    iconStyle: {
        marginRight: scale(15),
        marginTop: scale(3),
        fontSize: moderateScale(21),
        color: "#2CBA39",
        lineHeight: moderateScale(21),
    },
    horizontalLine: {
        width: 3,
        height: moderateScale(24),
        backgroundColor: '#979797',
        borderWidth: 1.5,
        borderColor: '#979797',
        marginLeft: moderateScale(24)
    }
})