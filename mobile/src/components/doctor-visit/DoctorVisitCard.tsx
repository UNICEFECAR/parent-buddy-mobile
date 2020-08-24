import React, { Component } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle, ImageStyle } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { translate } from '../../translations/translate';
import { scale, moderateScale } from 'react-native-size-matters';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export interface Props {
    title: string;
    subTitle?: string;
    titleIcon?: TitleIconType;
    showVerticalLine?: boolean;
    items: any[];
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
        showVerticalLine: false,
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
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
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
            </View>
        )
    }
}

export interface DoctorVisitCardStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
    title: TextStyle;
    titleIcon: TextStyle;
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

    title: {
        fontSize: scale(22),
        lineHeight: scale(25),
        marginBottom: scale(3),
    },

    titleIcon: {
        lineHeight: scale(25),
        paddingRight: 10,
        fontSize: 24,
    },
});

export enum TitleIconType {
    Checked,
    Info,
    Add,
}