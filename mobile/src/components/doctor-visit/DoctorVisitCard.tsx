import React, { Component } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle, ImageStyle, Text } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { translate } from '../../translations/translate';
import { scale, moderateScale } from 'react-native-size-matters';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export interface Props {
    title: string;
    subTitle?: string;
    titleIcon?: TitleIconType;
    showVerticalLine?: boolean;
    items: DoctorVisitCardItem[];
    buttons?: any[];
}

export interface State {
    titleIcon?: JSX.Element;
}

export class DoctorVisitCard extends Component<Props, State> {
    static defaultProps: Props = {
        title: '',
        items: [],
        buttons: [],
        showVerticalLine: true,
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        const state: State = {};

        // TITLE ICON

        // Checked icon
        if (this.props.titleIcon === TitleIconType.Checked) {
            state.titleIcon = (
                <Icon
                    name={"check-circle"}
                    style={[styles.titleIcon, { color: '#2CBB39' }]}
                />
            );
        }

        // Add icon
        if (this.props.titleIcon === TitleIconType.Add) {
            state.titleIcon = (
                <Icon
                    name={"plus-circle-outline"}
                    style={[styles.titleIcon, { color: '#AA40BF' }]}
                />
            );
        }

        // Info icon
        if (this.props.titleIcon === TitleIconType.Info) {
            state.titleIcon = (
                <Icon
                    name={"information"}
                    style={[styles.titleIcon, { color: '#2BABEF' }]}
                />
            );
        }

        this.state = state;
    }

    render() {
        return (
            <View>
                {/* CARD */}
                <View style={styles.card}>
                    {/* TITLE & SUBTITLE */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: scale(15) }}>
                        {/* Title icon */}
                        {this.state.titleIcon ? this.state.titleIcon : null}

                        <View style={{ flex: 1 }}>
                            {/* Title */}
                            <Typography
                                style={styles.title}
                                type={TypographyType.headingSecondary}
                            >
                                {this.props.title}
                            </Typography>

                            {/* Subtitle */}
                            <Typography type={TypographyType.bodyRegular}>
                                {this.props.subTitle}
                            </Typography>
                        </View>
                    </View>

                    {/* ITEMS */}
                    {this.props.items.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', marginBottom: scale(12) }}>
                            <FontAwesome5Icon
                                name={ item.icon }
                                style={styles.itemIcon}
                            />

                            <Typography type={TypographyType.bodyRegular} style={{ flex: 1 }}>
                                {item.text}
                            </Typography>
                        </View>
                    ))}
                </View>

                {/* VERTICAL LINE */}
                {this.props.showVerticalLine ? (
                    <View style={styles.verticalLine} />
                ) : (
                        <View style={{ height: scale(30) }} />
                    )}
            </View>
        )
    }
}

export interface DoctorVisitCardStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    card: ViewStyle;
    title: TextStyle;
    titleIcon: TextStyle;
    itemIcon: TextStyle;
    verticalLine: ViewStyle;
}

const styles = StyleSheet.create<DoctorVisitCardStyles>({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
    },

    title: {
        fontSize: scale(22),
        lineHeight: scale(25),
        marginBottom: scale(3),
    },

    titleIcon: {
        lineHeight: scale(25),
        paddingRight: scale(14),
        fontSize: scale(20),
    },

    itemIcon: {
        color: '#272727',
        paddingRight: scale(14),
        fontSize: scale(20),
        opacity: 0.7,
    },

    verticalLine: {
        backgroundColor: '#939395',
        width: scale(3),
        height: scale(25),
        marginLeft: scale(20),
    },
});

export enum TitleIconType {
    Checked,
    Info,
    Add,
}

export type DoctorVisitCardItem = {
    icon: DoctorVisitCardItemIcon;
    text: string;
}

export enum DoctorVisitCardItemIcon {
    Syringe = 'syringe',
    Weight = 'weight',
    Stethoscope = 'stethoscope',
};