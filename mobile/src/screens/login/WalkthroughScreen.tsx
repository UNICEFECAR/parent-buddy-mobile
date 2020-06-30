import React, { Fragment } from 'react';
import { View, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { WalkthroughBackground } from '../../components/WalkthroughBackground';
import { Typography, TypographyType } from '../../components/Typography';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton'
import { TextButton, TextButtonColor } from '../../components/TextButton'
import { Switch } from 'react-native-paper';
import { themes } from '../../themes/themes';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { dataRealmStore } from '../../stores';
import Orientation from 'react-native-orientation-locker';

export interface WalkthroughScreenParams {
    /**
     * It goes form 0.
     */
    step: number;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, WalkthroughScreenParams>;
}

export interface State {
    followGrowth: boolean;
    followDevelopment: boolean;
    followDoctorVisits: boolean;
}

export class WalkthroughScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
        this.initState();
    }

    public componentDidMount() {
        Orientation.lockToPortrait();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: WalkthroughScreenParams = {
            step: 0,
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private initState() {
        const followGrowth = dataRealmStore.getVariable('followGrowth');
        const followDevelopment = dataRealmStore.getVariable('followDevelopment');
        const followDoctorVisits = dataRealmStore.getVariable('followDoctorVisits');

        let state: State = {
            followGrowth: followGrowth ? followGrowth : false,
            followDevelopment: followDevelopment ? followDevelopment : false,
            followDoctorVisits: followDoctorVisits ? followDoctorVisits : false,
        };

        this.state = state;
    }

    private onNextClick() {
        const screenParams = this.props.navigation.state.params!;

        let params: WalkthroughScreenParams = {
            step: screenParams.step + 1,
        };

        if (params.step < 5) {
            this.props.navigation.push('WalkthroughStackNavigator_WalkthroughScreen', params);
        } else {
            this.gotoTermsScreen();
        }
    }

    private onBackClick() {
        this.props.navigation.goBack();
    }

    private gotoTermsScreen() {
        this.props.navigation.navigate('WalkthroughStackNavigator_TermsScreen');
    };

    private onFollowGrowthChange() {
        this.setState((prevState) => {
            return {
                followGrowth: !prevState.followGrowth,
            };
        }, () => {
            dataRealmStore.setVariable('followGrowth', this.state.followGrowth);
        });
    }

    private onFollowDevelopmentChange() {
        this.setState((prevState) => {
            return {
                followDevelopment: !prevState.followDevelopment,
            };
        }, () => {
            dataRealmStore.setVariable('followDevelopment', this.state.followDevelopment);
        });
    }

    private onFollowDoctorVisitsChange() {
        this.setState((prevState) => {
            return {
                followDoctorVisits: !prevState.followDoctorVisits,
            };
        }, () => {
            dataRealmStore.setVariable('followDoctorVisits', this.state.followDoctorVisits);
        });
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;

        return (
            <WalkthroughBackground type={screenParams.step}>
                {/* STEP 0 */}
                {screenParams.step === 0 ? (
                    <Fragment>
                        <StatusBar barStyle="dark-content" />

                        <Typography type={TypographyType.headingPrimary} style={{ width: scale(300), color: 'white', textAlign: 'center' }}>
                            Dobrodošli, roditelji!
                        </Typography>

                        <Typography type={TypographyType.bodyRegular} style={{ color: 'white', textAlign: 'center' }}>
                            Čast nam je da podržimo vaš put kroz jedno od najlepših doba života.
                        </Typography>

                        <View style={{ flex: 1, maxHeight: 30 }} />

                        <Typography type={TypographyType.bodyRegular} style={{ color: 'white', textAlign: 'center' }}>
                            Pomoći ćemo Vam da pratite rast deteta na jednostavan i razumljiv način.
                        </Typography>

                        <View style={{ flex: 1 }} />
                    </Fragment>
                ) : null}

                {/* STEP 1 */}
                {screenParams.step === 1 ? (
                    <Fragment>
                        <StatusBar barStyle="dark-content" />

                        <Typography type={TypographyType.headingPrimary} style={{ width: scale(300), color: '#262628', textAlign: 'center' }}>
                            Pratite rast svog deteta
                        </Typography>

                        <Typography type={TypographyType.bodyRegular} style={{ color: '#262628', textAlign: 'center' }}>
                            Unosom mera visine i mase steknite uvid u tok detetovog rasta.
                        </Typography>

                        <View style={{ flex: 1, maxHeight: 30 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Switch
                                value={ this.state.followGrowth }
                                color={ themes.getCurrentTheme().theme.variables?.colors?.switchColor }
                                onValueChange={ () => { this.onFollowGrowthChange() } }
                                style={{marginRight:20}}
                            />
                            <Typography type={TypographyType.bodyRegular} style={{ flex: 1, color: '#262628', textAlign: 'left' }}>
                                Želim da pratim rast i da me aplikacija podseća da unosim mere deteta
                            </Typography>
                        </View>

                        <View style={{ flex: 1 }} />
                    </Fragment>
                ) : null}

                {/* STEP 2 */}
                {screenParams.step === 2 ? (
                    <Fragment>
                        <StatusBar barStyle="dark-content" />

                        <Typography type={TypographyType.headingPrimary} style={{ width: scale(300), color: 'white', textAlign: 'center' }}>
                            Saveti prilagođeni vama
                        </Typography>

                        <Typography type={TypographyType.bodyRegular} style={{ color: 'white', textAlign: 'center' }}>
                            Pronaći ćete informacije o razvoju deteta kao i ideje za igru i pripremu hrane prilagođene detetovom uzrastu.
                        </Typography>

                        <View style={{ flex: 1, maxHeight: 30 }} />

                        <Typography type={TypographyType.bodyRegular} style={{ color: 'white', textAlign: 'center' }}>
                            
                        </Typography>

                        <View style={{ flex: 1 }} />
                    </Fragment>
                ) : null}

                {/* STEP 3 */}
                {screenParams.step === 3 ? (
                    <Fragment>
                        <StatusBar barStyle="dark-content" />

                        <Typography type={TypographyType.headingPrimary} style={{ width: scale(300), color: '#262628', textAlign: 'center' }}>
                            Beležite važne razvojne događaje
                        </Typography>

                        <Typography type={TypographyType.bodyRegular} style={{ color: '#262628', textAlign: 'center' }}>
                            Spremite se za promene u različitim razvojnim periodima i pratite događaje u razvoju deteta.
                        </Typography>

                        <View style={{ flex: 1, maxHeight: 30 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Switch
                                value={ this.state.followDevelopment }
                                color={ themes.getCurrentTheme().theme.variables?.colors?.switchColor }
                                onValueChange={ () => { this.onFollowDevelopmentChange() } }
                                style={{marginRight:20}}
                            />
                            <Typography type={TypographyType.bodyRegular} style={{ flex: 1, color: '#262628', textAlign: 'left' }}>
                                {/* Želim da beležim razvojne događaje i da me aplikacija podseća da unosim podatke */}
                                Želim da me aplikacija podseća da beležim razvojne događaje
                            </Typography>
                        </View>

                        <View style={{ flex: 1 }} />
                    </Fragment>
                ) : null}

                {/* STEP 4 */}
                {screenParams.step === 4 ? (
                    <Fragment>
                        <StatusBar barStyle="dark-content" />

                        <Typography type={TypographyType.headingPrimary} style={{ width: scale(300), color: '#262628', textAlign: 'center' }}>
                            Evidentirajte posete doktoru
                        </Typography>

                        <Typography type={TypographyType.bodyRegular} style={{ color: '#262628', textAlign: 'center' }}>
                            Beležite podatke o pregledima pedijatra, vakcinaciji i ostalim zdravstvenim informacijama
                        </Typography>

                        <View style={{ flex: 1, maxHeight: 30 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Switch
                                value={ this.state.followDoctorVisits }
                                color={ themes.getCurrentTheme().theme.variables?.colors?.switchColor }
                                onValueChange={ () => { this.onFollowDoctorVisitsChange() } }
                                style={{marginRight:20}}
                            />
                            <Typography type={TypographyType.bodyRegular} style={{ flex: 1, color: '#262628', textAlign: 'left' }}>
                                {/* Želim da evidentiram posete doktoru i da me aplikacija podseća da unosim podatke */}
                                Želim da me aplikacija podseca da evidentiram posete doktoru
                            </Typography>
                        </View>

                        <View style={{ flex: 1 }} />
                    </Fragment>
                ) : null}

                <View style={{ marginBottom: scale(20), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {screenParams.step !== 0 ? (
                        <TextButton style={{width:80}} color={ screenParams.step === 2 ? TextButtonColor.white : TextButtonColor.purple } onPress={ () => {this.onBackClick()} }>
                            { translate('buttonBack') }
                        </TextButton>
                    ) : null}

                    <RoundedButton
                        text={ translate('buttonNext') + ' >' }
                        type={RoundedButtonType.hollowPurple}
                        onPress={() => { this.onNextClick() }}
                        style={{ width: 150 }}
                    />
                </View>
            </WalkthroughBackground>
        );
    }

}

export interface WalkthroughScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<WalkthroughScreenStyles>({
    container: {
        flex: 1,
    },
});
