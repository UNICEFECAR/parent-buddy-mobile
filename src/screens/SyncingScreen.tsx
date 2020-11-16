import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle, View, Dimensions } from 'react-native';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { Typography } from '../components';
import { TypographyType } from '../components/Typography';
import { utils, syncData, navigation } from '../app';
import { appConfig } from '../app/appConfig';
import { translate } from '../translations';
import { ActivityIndicator, ProgressBar } from 'react-native-paper';
import { scale } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';
import { dataRealmStore } from '../stores';

export interface Props {
    navigation: NavigationStackProp<NavigationStackState>;
}

export class SyncingScreen extends React.Component<Props, object> {

    public constructor(props: Props) {
        super(props);
        this.startSync();
    }

    private async startSync() {

        const userIsLoggedIn = dataRealmStore.getVariable('userIsLoggedIn');
        const acceptDownload = dataRealmStore.getVariable('acceptDownload');
        const accpetTerms = dataRealmStore.getVariable("acceptTerms");

        if (userIsLoggedIn && acceptDownload) {
            if (!appConfig.preventSync) {
                const syncResponse = await syncData.sync();
                const canAppBeOpened = utils.canAppBeOpened();

                if (accpetTerms) {
                    setTimeout(() => { utils.gotoNextScreenOnAppOpen() }, 0);
                } else {
                    setTimeout(() => { navigation.navigate('HomeStackNavigator_TermsScreen') }, 0);
                }

                setTimeout(() => {
                    if (syncResponse instanceof Error && !canAppBeOpened) {
                        // throw syncResponse;
                        console.log(syncResponse);
                    }
                }, 1000);
            } else {
                setTimeout(() => { utils.gotoNextScreenOnAppOpen() }, 0);
            }
        } else {
            setTimeout(() => { utils.gotoNextScreenOnAppOpen() }, 0);
        };
    };

    private sliderImages() {
        return <FastImage
            source={require('../themes/assets/sync_data.png')}
            style={{ flex: 1, width: '100%' }}
            resizeMode="cover"
        />
    }


    public render() {
        let images = [require('../themes/assets/sync_data.png'), require('../themes/assets/sync_data.png'), require('../themes/assets/sync_data.png')]
        let fastImages = <FastImage
            source={require('../themes/assets/sync_data.png')}
            style={{ flex: 1, width: '100%' }}
            resizeMode="cover"
        />

        return (
            dataRealmStore.getVariable('acceptDownload') ?
                <SafeAreaView style={styles.container}>
                    <FastImage
                        source={require('../themes/assets/sync_data.png')}
                        style={{ flex: 1, width: '100%' }}
                        resizeMode="cover"
                    />
                    <View style={{ flex: 0, marginTop: -10, marginBottom: -10 }}>
                        <ActivityIndicator size="large" color="white" />
                        {/* <ProgressBar indeterminate={true} progress={0.5} color={'white'} style={{width: '100%', height: scale(20), borderWidth:10, borderColor:'transparent'}} /> */}
                    </View>
                    <View style={{ flex: 0, marginTop: scale(20) }}>
                        <Typography type={TypographyType.headingPrimary} style={{ fontSize: scale(18), lineHeight: scale(20), marginBottom: 0, textAlign: 'center', color: 'white', marginHorizontal: scale(15) }}>
                            {translate('syncScreenText')}
                        </Typography>

                        <Typography type={TypographyType.headingPrimary} style={{ fontSize: scale(18), lineHeight: scale(20), textAlign: 'center', color: 'white', marginTop: scale(15), marginHorizontal: scale(15) }}>
                            {translate('syncScreenSubText')}
                        </Typography>
                    </View>
                </SafeAreaView>
                :
                <SafeAreaView style={styles.container}>
                </SafeAreaView>
        );
    }

}

export interface SyncingScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<SyncingScreenStyles>({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#A178A9',
    },
});
