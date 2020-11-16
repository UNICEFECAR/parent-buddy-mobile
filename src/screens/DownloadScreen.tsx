import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle, View, Dimensions } from 'react-native';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { RoundedButton, Typography } from '../components';
import { TypographyType } from '../components/Typography';
import { translate } from '../translations';
import { scale } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';
import { dataRealmStore, userRealmStore } from '../stores';
import { navigation, utils } from '../app';
// @ts-ignore
import appIcon from '../themes/assets/icon.png'
import { ChildEntitySchema } from '../stores/ChildEntity';

export interface Props {
    navigation: NavigationStackProp<NavigationStackState>;
}

export class DownloadScreen extends React.Component<Props, object> {

    public constructor(props: Props) {
        super(props);
    };

    private onDownloadAccepted() {
        dataRealmStore.setVariable('acceptDownload', true);
        navigation.navigate('RootModalStackNavigator_SyncingScreen')
    };

    private logout = () => {
        dataRealmStore.deleteVariable("userEmail");
        dataRealmStore.deleteVariable("userIsLoggedIn");
        dataRealmStore.deleteVariable("loginMethod");
        dataRealmStore.deleteVariable("userEnteredChildData");
        dataRealmStore.deleteVariable("userParentalRole");
        dataRealmStore.deleteVariable("userName");
        dataRealmStore.deleteVariable("currentActiveChildId");
        dataRealmStore.deleteVariable("acceptTerms");
        dataRealmStore.deleteVariable("acceptDownload");

        userRealmStore.deleteAll(ChildEntitySchema);
        navigation.resetStackAndNavigate('LoginStackNavigator')
    };

    public render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ alignContent: 'center', alignItems: 'center', marginTop: scale(-150) }}>
                    <FastImage
                        source={appIcon}
                        style={{ width: scale(100), height: scale(100), marginBottom: 10 }}
                    />
                    <Typography type={TypographyType.headingSecondary} style={{ textAlign: 'center', color: 'white' }}>{translate('DataDownloadAlert')}</Typography>
                </View>

                <View style={{ width: '90%', height: scale(200), position: 'absolute', bottom: 10 }}>
                    <RoundedButton text={translate('newMeasureScreenVaccineOptionYes')} onPress={() => this.onDownloadAccepted()} style={{ marginBottom: 15 }} />
                    <RoundedButton text={translate("newMeasureScreenVaccineOptionNo")} onPress={() => this.logout()} />
                </View>
            </SafeAreaView>
        );
    };
};

export interface DownloadScreenStyles {
    container?: ViewStyle;
};

const styles = StyleSheet.create<DownloadScreenStyles>({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#875593'
    },
});
