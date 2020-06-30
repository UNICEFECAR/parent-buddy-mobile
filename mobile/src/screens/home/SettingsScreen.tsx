import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Switch, Caption } from 'react-native-paper';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { dataRealmStore, VariableEntity } from '../../stores';
import { Variables } from '../../stores/dataRealmStore';
import { navigation } from '../../app';
import { VariableEntitySchema } from '../../stores/VariableEntity';
import { variables } from '../../themes/defaultTheme/variables';

export interface SettingsScreenParams {
    searchTerm?: string;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, SettingsScreenParams>;
}

export interface State {
    notificationsApp: boolean;
    notificationsEmail: boolean;
    followGrowth: boolean;
    followDevelopment: boolean;
    followDoctorVisits: boolean;
}

export class SettingsScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
        this.initState();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: SettingsScreenParams = {

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
        const notificationApp = dataRealmStore.getVariable('notificationsApp');
        const notificationsEmail = dataRealmStore.getVariable('notificationsEmail');

        let state: State = {
            notificationsApp: notificationApp ? notificationApp : false,
            notificationsEmail: notificationsEmail ? notificationsEmail : false,
            followGrowth: followGrowth ? followGrowth : false,
            followDevelopment: followDevelopment ? followDevelopment : false,
            followDoctorVisits: followDoctorVisits ? followDoctorVisits : false,
        };

        this.state = state;
    }

    private gotoBack() {
        this.props.navigation.goBack();
    }

    private changeSettings(target: string) {
        const stateKey = target as keyof State;
        const variableKey = target as keyof Variables;

        let value = !this.state[stateKey]

        this.setState({
            [stateKey]: value
        } as Pick<State, keyof State>)

        dataRealmStore.setVariable(variableKey, value)
    }

    private logout() {
        const allVariables = dataRealmStore.realm?.objects<VariableEntity>(VariableEntitySchema.name);
        const variables: string[] = [];

        allVariables?.forEach((record, index, collection) => {
            if(record.key !== "lastSyncTimestamp" && record.key !== "vocabulariesAndTerms" && record.key !== "languageCode" && record.key !== "countryCode"){
                variables.push(record.key)
            }
        })

        variables.map(item => {
            let key = item as keyof Variables;
            dataRealmStore.deleteVariable(key)
        })
        navigation.navigate('LoginStackNavigator_LoginScreen');
    }

    public render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: 'white' }}
                        contentContainerStyle={[styles.container]}
                    >
                        <View style={{ alignItems: 'flex-start', padding: themeContext.theme.screenContainer?.padding }}>

                            {/* TITLE */}
                            <Typography type={TypographyType.headingSecondary}>
                                {translate('settingsTitleNotifications')}
                            </Typography>

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />

                            {/* state.notificationsApp */}
                            <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Switch
                                    value={this.state.notificationsApp}
                                    color={themeContext.theme.variables?.colors?.switchColor}
                                    onValueChange={() => this.changeSettings('notificationsApp')}
                                    style={{ marginRight: scale(20) }}
                                />
                                <Typography style={{ flex: 1 }} type={TypographyType.bodyRegular}>
                                    {translate('settingsNotificationsWithApp')}
                                </Typography>
                            </View>

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* state.notificationsEmail */}
                            <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Switch
                                    value={this.state.notificationsEmail}
                                    color={themeContext.theme.variables?.colors?.switchColor}
                                    onValueChange={() => this.changeSettings('notificationsEmail')}
                                    style={{ marginRight: scale(20) }}
                                />
                                <Typography style={{ flex: 1 }} type={TypographyType.bodyRegular}>
                                    {translate('settingsNotificationsWithEmail')}
                                </Typography>
                            </View>

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* Notifications help */}
                            <Caption style={{ fontSize: moderateScale(14) }}>
                                {translate('settingsNotificationsHelp')}
                            </Caption>

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* TITLE */}
                            <Typography type={TypographyType.headingSecondary}>
                                {translate('settingsTitleNotificationsDetails')}
                            </Typography>

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />

                            {/* state.followGrowth */}
                            <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Switch
                                    value={this.state.followGrowth}
                                    color={themeContext.theme.variables?.colors?.switchColor}
                                    onValueChange={() => this.changeSettings('followGrowth')}
                                    style={{ marginRight: scale(20) }}
                                />
                                <Typography style={{ flex: 1 }} type={TypographyType.bodyRegular}>
                                    {translate('settingsEnterGrowth')}
                                </Typography>
                            </View>

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* state.followDevelopment */}
                            <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Switch
                                    value={this.state.followDevelopment}
                                    color={themeContext.theme.variables?.colors?.switchColor}
                                    onValueChange={() => this.changeSettings('followDevelopment')}
                                    style={{ marginRight: scale(20) }}
                                />
                                <Typography style={{ flex: 1 }} type={TypographyType.bodyRegular}>
                                    {translate('settingsEnterDevelopment')}
                                </Typography>
                            </View>

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* state.followDoctorVisits */}
                            <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Switch
                                    value={this.state.followDoctorVisits}
                                    color={themeContext.theme.variables?.colors?.switchColor}
                                    onValueChange={() => this.changeSettings('followDoctorVisits')}
                                    style={{ marginRight: scale(20) }}
                                />
                                <Typography style={{ flex: 1 }} type={TypographyType.bodyRegular}>
                                    {translate('settingsEnterDoctorVisits')}
                                </Typography>
                            </View>

                            <View style={{ height: scale(50) }} />

                            {/* Export all data */}
                            <RoundedButton
                                text={translate('settingsButtonExport')}
                                type={RoundedButtonType.hollowPurple}
                                onPress={() => { }}
                                style={{ width: '85%', alignSelf: 'center' }}
                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* Logout */}
                            <View style={{ alignSelf: 'center', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Icon
                                    name={"sign-out"}
                                    style={{ color: themeContext.theme.variables?.colors?.primary, fontSize: scale(20), marginRight: scale(10) }}
                                />
                                <TextButton
                                    style={{ padding: 0, alignSelf: 'center' }}
                                    iconStyle={{ color: '#AA40BF' }}
                                    textStyle={{ fontSize: scale(16) }}
                                    color={TextButtonColor.purple}
                                    onPress={() => this.logout()}
                                >
                                    {translate('settingsLogout')}
                                </TextButton>
                            </View>

                            <View style={{ height: scale(70) }} />

                            {/* Delete account */}
                            <View style={{ alignSelf: 'center', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Icon
                                    name={"exclamation-triangle"}
                                    style={{ color: '#EB4747', fontSize: scale(20), marginRight: scale(10) }}
                                />
                                <TextButton
                                    style={{ padding: 0, alignSelf: 'center' }}
                                    iconStyle={{ color: '#AA40BF' }}
                                    textStyle={{ fontSize: scale(16) }}
                                    // color={TextButtonColor.purple}
                                    onPress={() => { }}
                                >
                                    {translate('settingsButtonDeleteAllData')}
                                </TextButton>
                            </View>

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />
                        </View>
                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    }

}

export interface SettingsScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<SettingsScreenStyles>({
    container: {

    },
});
