import React from 'react';
import { Text, SafeAreaView, View, StyleSheet, ViewStyle, Image, StatusBar, Keyboard, LayoutAnimation, LayoutAnimationConfig } from 'react-native';
import { NavigationSwitchProp, NavigationState } from 'react-navigation';
import { GradientBackground } from '../../components/GradientBackground';
import { Typography, TypographyType } from '../../components/Typography';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { RoundedTextInput } from '../../components/RoundedTextInput';
import { TextButton, TextButtonSize } from '../../components/TextButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { translate } from '../../translations/translate';
import { Animated, Easing } from 'react-native';
import { WalkthroughScreenParams } from './WalkthroughScreen';
import { StackActions, NavigationActions } from 'react-navigation';
import { googleAuth } from '../../app';

export interface Props {
    navigation: NavigationSwitchProp<NavigationState>;
}

export interface State {

}

interface Animations {
    toggleButtons?: Animated.CompositeAnimation
}

interface AnimationsState {
    animatedValues: {
        toggleButtons: Animated.Value
    },

    animatedStyles: {
        toggleButtons: {
            height: Animated.AnimatedInterpolation,
            spaceHeight: Animated.AnimatedInterpolation
        }
    }
}

export class LoginScreen extends React.Component<Props, State & AnimationsState> {

    private animations: Animations = {};

    public constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        const animationsState = this.initAnimationsState();

        let state: State & AnimationsState = {
            ...animationsState
        };

        this.state = state;
    }

    private onLoginClick() {
        Keyboard.dismiss();
        // this.gotoWalkthroughScreen();
        // this.gotoTermsScreen();

        // Go to WalkthroughScreen and reset history
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'WalkthroughStackNavigator'})],
        });
        this.props.navigation.dispatch(resetAction);
    }

    private onInputFocus() {
        this.startAnimationToggleButtons();
    }

    private onKeyboardWillShow() {
        this.startAnimationToggleButtons();
    }

    private onKeyboardWillHide() {
        this.startAnimationToggleButtons(true);
    }

    private gotoRegisterScreen() {
        this.props.navigation.navigate('LoginStackNavigator_RegisterScreen');
    };

    private gotoWalkthroughScreen() {
        let params: WalkthroughScreenParams = {
            step: 0,
        };

        this.props.navigation.navigate('WalkthroughStackNavigator_WalkthroughScreen', params);
    };

    private gotoTermsScreen() {
        this.props.navigation.navigate('WalkthroughStackNavigator_TermsScreen');
    };

    private startAnimationToggleButtons(reverse = false, callback = (result: Animated.EndResult) => { }) {
        if (this.animations.toggleButtons) {
            this.animations.toggleButtons.stop();
        }

        // Create animation
        this.animations.toggleButtons = Animated.timing(
            this.state.animatedValues.toggleButtons,
            {
                toValue: (reverse ? 0 : 1),
                useNativeDriver: false,
                duration: 200
            }
        );

        this.animations.toggleButtons.start(callback);
    }

    public initAnimationsState(): AnimationsState {
        let animationsState = { animatedValues: {}, animatedStyles: {} } as AnimationsState;

        // DEFINE ANIMATION: toggleButtons
        const toggleButtonsValue = new Animated.Value(0);

        let toggleButtonsStyles = {
            height: toggleButtonsValue.interpolate({
                inputRange: [0, 1],
                outputRange: [180, 0]
            }),

            spaceHeight: toggleButtonsValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 20]
            })
        };

        animationsState.animatedValues.toggleButtons = toggleButtonsValue;
        animationsState.animatedStyles.toggleButtons = toggleButtonsStyles;

        return animationsState;
    }

    private async googleLogin() {
        let response = await googleAuth.signIn();
        
        if (response?.user?.email) {
            console.warn(response.user.email);
        }
    }

    public render() {
        const anim = this.state.animatedStyles;

        return (
            <GradientBackground>
                <StatusBar barStyle="light-content" />

                <SafeAreaView style={[styles.container]}>
                    <KeyboardAwareScrollView
                        style={{ borderWidth: 0, borderColor: 'red' }} contentContainerStyle={{ borderWidth: 0, borderColor: 'green', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 30, marginRight: 30 }}
                        onKeyboardWillShow={() => { this.onKeyboardWillShow() }}
                        onKeyboardWillHide={() => { this.onKeyboardWillHide() }}
                        onKeyboardDidShow={() => { this.onKeyboardWillShow() }}
                        onKeyboardDidHide={() => { this.onKeyboardWillHide() }}
                    >
                        {/* TITLE */}
                        <Typography type={TypographyType.logo} style={{ textAlign: 'center', color: 'white', marginTop: 20 }}>
                            {translate('appName')}
                        </Typography>

                        <Animated.View style={[{ overflow: 'hidden' }, { height: anim.toggleButtons.height }]}>
                            {/* LOGIN WITH GOOGLE */}
                            <RoundedButton
                                type={RoundedButtonType.google}
                                onPress={() => { this.googleLogin() }}
                                style={{ marginBottom: 15, width:'100%' }}
                            />

                            {/* LOGIN WITH FACEBOOK */}
                            <RoundedButton
                                type={RoundedButtonType.facebook}
                                onPress={() => { }}
                                style={{ marginBottom: 15, width:'100%' }}
                            />

                            {/* REGISTER ACCOUNT */}
                            <RoundedButton
                                text={translate('registerAccount')}
                                type={RoundedButtonType.purple}
                                onPress={() => { this.gotoRegisterScreen() }}
                                style={{ marginBottom: 15, width:'100%' }}
                            />
                        </Animated.View>


                        <Animated.View style={{ height: anim.toggleButtons.spaceHeight }}></Animated.View>

                        {/* INPUT: email */}
                        <RoundedTextInput
                            label={translate('fieldLabelEmail')}
                            icon="email-outline"
                            onChange={() => { }}
                            onFocus={() => { this.onInputFocus() }}
                            style={{ marginBottom: 15 }}
                        />

                        {/* INPUT: password */}
                        <RoundedTextInput
                            label={translate('fieldLabelPassword')}
                            icon="lock-outline"
                            onChange={() => { }}
                            onFocus={() => { this.onInputFocus() }}
                            style={{ marginBottom: 15 }}
                        />

                        {/* LOGIN BUTTON */}
                        <RoundedButton
                            text={translate('loginButton')}
                            type={RoundedButtonType.hollowWhite}
                            onPress={() => { this.onLoginClick() }}
                            style={{ marginBottom: 15 }}
                        />

                        {/* FORGOT THE PASSWORD */}
                        <TextButton size={TextButtonSize.small} textStyle={{ color: 'white', textAlign: 'center' }} onPress={() => { }}>
                            {translate('loginForgotPassword')}
                        </TextButton>

                        <View style={{ height: 60 }}></View>

                        {/* LOGO IMAGES */}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Image
                                source={require('../../themes/assets/gradski_zavod.png')}
                                style={{ width: '48%', maxWidth: 150, aspectRatio: 3.26 }}
                                resizeMode="cover"
                            />
                            <View style={{ flex: 1 }}></View>
                            <Image
                                source={require('../../themes/assets/unicef.png')}
                                style={{ width: '48%', maxWidth: 140, aspectRatio: 4 }}
                                resizeMode="cover"
                            />
                        </View>

                        <View style={{ height: 30 }} />
                    </KeyboardAwareScrollView>
                </SafeAreaView>
            </GradientBackground>
        );
    }

}

export interface LoginScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<LoginScreenStyles>({
    container: {
        flex: 1,
    },
});
