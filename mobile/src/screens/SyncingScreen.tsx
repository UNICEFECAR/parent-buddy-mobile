import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle, View } from 'react-native';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { Typography } from '../components';
import { TypographyType } from '../components/Typography';
import { utils, syncData } from '../app';
import { appConfig } from '../app/appConfig';
import { translate } from '../translations';
import { ActivityIndicator } from 'react-native-paper';
import { scale } from 'react-native-size-matters';
import FastImage from 'react-native-fast-image';

export interface Props {
    navigation: NavigationStackProp<NavigationStackState>;
}

export class SyncingScreen extends React.Component<Props, object> {

    public constructor(props: Props) {
        super(props);
        this.startSync();
    }

    private async startSync() {
        if (!appConfig.preventSync) {
            const syncResponse = await syncData.sync();
            const canAppBeOpened = utils.canAppBeOpened();

            setTimeout(() => {utils.gotoNextScreenOnAppOpen()}, 0);
            setTimeout(() => {
                if (syncResponse instanceof Error && !canAppBeOpened) {
                    throw syncResponse;
                }
            }, 1000);
        } else {
            setTimeout(() => {utils.gotoNextScreenOnAppOpen()}, 0);
        }
    }

    public render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 0, marginTop: scale(20) }}>
                    <Typography type={TypographyType.headingPrimary} style={{ marginBottom: 0 }}>
                        {translate('syncScreenText')}
                    </Typography>
                    <Typography type={TypographyType.headingSecondary}>
                        {translate('syncScreenSubText')}
                    </Typography>
                </View>

                <FastImage
                    source={ require('../themes/assets/sync_data.png') }
                    style={{ flex:1, width:'100%' }}
                    resizeMode="cover"
                />

                <View style={{ flex: 0, marginBottom: scale(20) }}>
                    <ActivityIndicator size="large" />
                </View>
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
        backgroundColor: 'white',
    },
});
