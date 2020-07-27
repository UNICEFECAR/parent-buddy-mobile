import React from 'react';
import { View, Text, StyleProp, StyleSheet, ViewStyle, TextStyle, ImageStyle, LayoutAnimation, LayoutAnimationConfig } from 'react-native';
import { RoundedButtonType } from './RoundedButton';
import { scale, moderateScale } from 'react-native-size-matters';
import { Typography, RoundedButton, TextButton } from '.';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { IconButton, Colors } from 'react-native-paper';
import { TypographyType } from './Typography';
import { homeMessages } from '../app';
import { translate } from "../translations/translate";
import { TextButtonColor } from './TextButton';
import { dataRealmStore } from '../stores/dataRealmStore';

export interface Props {
    cardType?: 'purple' | 'white';
    showCloseButton?: boolean;
    style?: StyleProp<ViewStyle>;
    onClosePress?: () => void;
}

export interface State {
    messagesAreHidden: boolean;
}

export class HomeMessages extends React.Component<Props, State> {
    private oldMessages: Message[] | null = null;

    static defaultProps: Props = {
        cardType: 'white',
        showCloseButton: false,
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let hideHomeMessages = dataRealmStore.getVariable('hideHomeMessages');
        if (hideHomeMessages === null) hideHomeMessages = false;

        let state: State = {
            messagesAreHidden: hideHomeMessages,
        };

        this.state = state;
    }

    private getTextStyle(): TextStyle {
        const rval: TextStyle = {};

        if (this.props.cardType === 'purple') {
            rval.color = 'white';
        }

        return rval;
    }

    private getIconStyle(message: Message): TextStyle {
        const rval: TextStyle = {
            color: 'black',
            fontSize: scale(18),
            lineHeight: scale(20),
            // marginRight: scale(13),
            width: scale(35)
        };

        if (message.iconType === IconType.growth) {
            rval.color = '#00B80C';
        }

        if (message.iconType === IconType.celebrate) {
            rval.color = '#AA40BF';
        }

        if (message.iconType === IconType.doctor) {
            rval.color = '#2CABEF';
        }

        if (message.iconType === IconType.heart) {
            rval.color = '#ED2223';
        }

        if (message.iconType === IconType.syringe) {
            rval.color = '#2CABEF';
        }

        if (message.iconType === IconType.user) {
            rval.color = '#ED2223';
        }

        if (this.props.cardType === "purple") {
            rval.color = 'white';
        }

        return rval;
    }

    private getIconName(message: Message): string {
        let rval: string = 'home';

        if (message.iconType === IconType.doctor) rval = 'stethoscope';
        if (message.iconType === IconType.heart) rval = 'heart';
        if (message.iconType === IconType.growth) rval = 'weight'; // weight, dashboard
        if (message.iconType === IconType.checked) rval = 'check-circle';
        if (message.iconType === IconType.celebrate) rval = 'crown'; // centos, crown, fire
        if (message.iconType === IconType.syringe) rval = 'syringe';
        if (message.iconType === IconType.user) rval = 'user';

        return rval;
    }

    private onCloseButtonPress() {
        let layoutAnimationConfig: LayoutAnimationConfig = {
            duration: 200,
            update: {
                springDamping: 0.4,
                type: LayoutAnimation.Types.easeInEaseOut,
            }
        };

        LayoutAnimation.configureNext(layoutAnimationConfig);

        this.setState({
            messagesAreHidden: true,
        }, () => {
            if (this.props.onClosePress) {
                this.props.onClosePress();
            }
        });

        dataRealmStore.setVariable('hideHomeMessages', true);
    }

    private onShowMessagesPress() {
        LayoutAnimation.spring();

        this.setState({
            messagesAreHidden: false,
        });

        dataRealmStore.setVariable('hideHomeMessages', false);
    }

    public render() {
        // console.log('RENDER: HomeMessages');

        // Get new messages
        const messages = homeMessages.getMessages();

        // Decide whether to unhide messages
        if (this.oldMessages !== null && this.state.messagesAreHidden) {
            if (JSON.stringify(this.oldMessages) !== JSON.stringify(messages)) {
                this.setState({
                    messagesAreHidden: false,
                });
                dataRealmStore.setVariable('hideHomeMessages', false);
            }
        }
        this.oldMessages = messages;

        // Sre messages hidden?
        if (this.state.messagesAreHidden) {
            return (
                <TextButton onPress={() => { this.onShowMessagesPress() }} style={{ justifyContent: 'center', marginBottom: scale(15) }} color={TextButtonColor.purple}>{translate('showHomeMessages')}</TextButton>
            );
        }

        return (
            <View style={[
                styles.container,
                this.props.cardType === 'white' ? styles.cardWhite : styles.cardPurple,
                this.props.style
            ]}>
                {messages?.map((message, index) => (
                    <View style={{ paddingRight: moderateScale(22) }}>
                        {message.text && (
                            <View style={{ flexDirection: 'row' }}>
                                {message.iconType ? (
                                    <IconFontAwesome5
                                        name={this.getIconName(message)}
                                        style={this.getIconStyle(message)}
                                    />
                                ) : null}

                                <View style={{ flex: 1 }}>
                                    <Typography style={[this.getTextStyle(), message.textStyle]}>
                                        {message.text}
                                    </Typography>

                                    {message.subText ? (
                                        <Typography style={{ fontSize: moderateScale(14), color: (this.props.cardType === 'white' ? 'grey' : 'white') }} type={TypographyType.bodyRegular}>
                                            {message.subText}
                                        </Typography>
                                    ) : null}
                                </View>
                            </View>
                        )}

                        {message.button ? (
                            <RoundedButton
                                style={{ width: '100%', marginTop: message.text ? scale(10) : 0, marginBottom: scale(10), marginLeft: moderateScale(11) }}
                                type={message.button.type}
                                text={message.button.text}
                                onPress={() => { if (message.button?.onPress) message.button?.onPress() }}
                            />
                        ) : null}

                        {messages?.length !== (index + 1) ? (
                            <View style={{ height: scale(15) }} />
                        ) : null}
                    </View>
                ))}

                {this.props.showCloseButton ? (
                    <IconButton
                        icon="close"
                        color={this.props.cardType === "white" ? 'grey' : 'white'}
                        size={moderateScale(20)}
                        style={{ position: 'absolute', right: scale(5), top: scale(5) }}
                        onPress={() => { this.onCloseButtonPress() }}
                    />
                ) : null}
            </View>
        );
    }
}

export interface HomeMessagesStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
    cardWhite: ViewStyle;
    cardPurple: ViewStyle;
}

const styles = StyleSheet.create<HomeMessagesStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: 'white',
        padding: 15,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        elevation: 2,
        borderRadius: 8,
        marginBottom: scale(30),
    },

    cardWhite: {
        backgroundColor: 'white',
    },

    cardPurple: {
        backgroundColor: '#AA40BF',
    },
});

export type Message = {
    text?: string;
    textStyle?: TextStyle;
    subText?: string;
    iconType?: IconType;
    button?: {
        type: RoundedButtonType.purple | RoundedButtonType.hollowPurple,
        text: string;
        onPress?: () => void
    };
};

export enum IconType {
    celebrate = 'celebrate',
    syringe = 'syringe',
    growth = 'growth',
    doctor = 'doctor',
    heart = 'heart',
    checked = 'checked',
    user = 'user',
};