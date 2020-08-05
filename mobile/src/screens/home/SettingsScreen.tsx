import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Switch, Caption, Divider } from 'react-native-paper';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { dataRealmStore, VariableEntity, userRealmStore, ChildEntity, apiStore } from '../../stores';
import { Variables } from '../../stores/dataRealmStore';
import { navigation, backup, googleDrive } from '../../app';
import { VariableEntitySchema } from '../../stores/VariableEntity';
import { variables } from '../../themes/defaultTheme/variables';
import { ActivityIndicator, Snackbar, Colors, Appbar } from 'react-native-paper';
import { appConfig } from '../../app/appConfig';
import { ChildEntitySchema } from '../../stores/ChildEntity';
import { UserRealmConsumer, UserRealmContextValue } from '../../stores/UserRealmContext';

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
    isExportRunning: boolean;
    isImportRunning: boolean;
    isSnackbarVisible: boolean;
    snackbarMessage: string;
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
            isExportRunning: false,
            isImportRunning: false,
            isSnackbarVisible: false,
            snackbarMessage: '',
        };

        this.state = state;
    };

    private gotoBack() {
        this.props.navigation.goBack();
    }

    private changeSettings(target: string) {
        const stateKey = target as keyof State;
        const variableKey = target as keyof Variables;

        let value = !this.state[stateKey];

        this.setState({
            [stateKey]: value
        } as any);

        dataRealmStore.setVariable(variableKey, value)
    }

    private logout() {
        Alert.alert(
            translate('logoutAlert'),
            translate('logoutDataForDelete'),
            [{
                text: translate('settingsLogout'), onPress: () => {
                    
                    dataRealmStore.deleteVariable("userEmail");
                    dataRealmStore.deleteVariable("userIsLoggedIn");
                    dataRealmStore.deleteVariable("loginMethod");
                    dataRealmStore.deleteVariable("userEnteredChildData");
                    dataRealmStore.deleteVariable("userParentalRole");
                    dataRealmStore.deleteVariable("userName");
                    dataRealmStore.deleteVariable("currentActiveChildId");

                    userRealmStore.deleteAll(ChildEntitySchema);
                    navigation.navigate('LoginStackNavigator_LoginScreen');
                }
            },
            {
                text: translate('logoutCancel'),
                onPress: () => { }
            }
        ]);
    };

    private async exportAllData() {
        this.setState({ isExportRunning: true, });
        const exportIsSuccess = await backup.export();
        this.setState({ isExportRunning: false, });

        if (!exportIsSuccess) {
            this.setState({
                isSnackbarVisible: true,
                snackbarMessage: translate('settingsButtonExportError'),
            });
        };
    };

    private deleteAccountFromLocal() {
        const userRealm = userRealmStore.realm?.objects<ChildEntity>(ChildEntitySchema.name);

        userRealmStore.delete(userRealm);

        dataRealmStore.deleteVariable("allowAnonymousUsage");
        dataRealmStore.deleteVariable("currentActiveChildId");
        dataRealmStore.deleteVariable("dailyMessage");
        dataRealmStore.deleteVariable("followDevelopment");
        dataRealmStore.deleteVariable("followDoctorVisits");
        dataRealmStore.deleteVariable("followGrowth");
        dataRealmStore.deleteVariable("hideHomeMessages");
        dataRealmStore.deleteVariable("loginMethod");
        dataRealmStore.deleteVariable("notificationsApp");
        dataRealmStore.deleteVariable("notificationsEmail");
        dataRealmStore.deleteVariable("randomNumber");
        dataRealmStore.deleteVariable("userEmail");
        dataRealmStore.deleteVariable("userEnteredChildData");
        dataRealmStore.deleteVariable("userIsLoggedIn");
        dataRealmStore.deleteVariable("userIsOnboarded");
        dataRealmStore.deleteVariable("userName");
        dataRealmStore.deleteVariable("userParentalRole");
        dataRealmStore.deleteVariable("vocabulariesAndTerms");
    };

    private async deleteAccountCms() {
        const deleteAcc = await apiStore.deleteAccount();

        if (deleteAcc.deleteAccountSuccess) {
            this.deleteAccountFromLocal()
        };
    }

    private async deleteAccount() {

        const loginMethod = dataRealmStore.getVariable('loginMethod');

        Alert.alert(
            translate('deleteAccAlert'),
            translate('deleteAccAlertMsg'),
            [
                {
                    text: translate('deleteAcc'),
                    onPress: () => {
                        if (loginMethod === "cms") {
                            this.deleteAccountCms()
                        } else {
                            this.deleteAccountFromLocal();
                        }
                    }
                },
                {
                    text: translate('logoutCancel'),
                }
            ]
        );
    };

    private async importAllData(userRealmContext: UserRealmContextValue) {
        this.setState({ isImportRunning: true, });
        const importResponse = await backup.import(userRealmContext);
        this.setState({ isImportRunning: false, });

        if (importResponse instanceof Error) {
            this.setState({
                isSnackbarVisible: true,
                snackbarMessage: importResponse.message,
            });
        }
    }

    private onBackButtonClick() {
        if (!this.state.isExportRunning && !this.state.isImportRunning) {
            navigation.resetStackAndNavigate('DrawerNavigator');
        }
    }

    public render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <View style={{ flex: 1 }}>
                        <Appbar.Header style={{ backgroundColor: '#F8F8F8', borderBottomColor: '#DFE0E2', borderBottomWidth: 1 }}>
                            <Appbar.BackAction onPress={() => { this.onBackButtonClick() }} color={themeContext.theme.variables?.colors?.primary} />
                            <Appbar.Content title={translate('settingsTitle')} titleStyle={{ fontWeight: 'bold' }} style={{ alignItems: 'flex-start' }} />
                        </Appbar.Header>

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
                                {/* <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
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

                                <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} /> */}

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

                                <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                                {/* TITLE */}
                                <Typography type={TypographyType.headingSecondary}>
                                    {translate('settingsTitleImportExport')}
                                </Typography>

                                <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />

                                {/* Export all data */}
                                <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'center' }}>
                                    <RoundedButton
                                        text={translate('settingsButtonExport')}
                                        type={RoundedButtonType.hollowPurple}
                                        iconName="file-export"
                                        disabled={this.state.isExportRunning || this.state.isImportRunning}
                                        onPress={() => { this.exportAllData() }}
                                        style={{ flex: 1 }}
                                    />

                                    {this.state.isExportRunning && (
                                        <ActivityIndicator animating={true} style={{ marginLeft: scale(20) }} />
                                    )}
                                </View>

                                <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />

                                {/* Import all data */}
                                <View style={{ flexDirection: 'row', width: '85%', alignSelf: 'center' }}>
                                    <UserRealmConsumer>
                                        {(userRealmContext: UserRealmContextValue) => (
                                            <RoundedButton
                                                text={translate('settingsButtonImport')}
                                                type={RoundedButtonType.hollowPurple}
                                                iconName="file-import"
                                                disabled={this.state.isExportRunning || this.state.isImportRunning}
                                                onPress={() => { this.importAllData(userRealmContext) }}
                                                style={{ flex: 1 }}
                                            />
                                        )}
                                    </UserRealmConsumer>

                                    {this.state.isImportRunning && (
                                        <ActivityIndicator animating={true} style={{ marginLeft: scale(20) }} />
                                    )}
                                </View>

                                <Divider style={{ width: '100%', height: 1, marginTop: scale(60), marginBottom: scale(40) }} />


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
                                        onPress={() => this.deleteAccount()}
                                    >
                                        {translate('settingsButtonDeleteAllData')}
                                    </TextButton>
                                </View>

                                <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />
                            </View>
                        </ScrollView>

                        <Snackbar
                            visible={this.state.isSnackbarVisible}
                            duration={Snackbar.DURATION_SHORT}
                            onDismiss={() => { this.setState({ isSnackbarVisible: false }) }}
                            theme={{ colors: { onSurface: Colors.red500, accent: 'white' } }}
                            action={{
                                label: 'Ok',
                                onPress: () => {
                                    this.setState({ isSnackbarVisible: false });
                                },
                            }}
                        >
                            <Text style={{ fontSize: moderateScale(16) }}>
                                {this.state.snackbarMessage}
                            </Text>
                        </Snackbar>
                    </View>
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
