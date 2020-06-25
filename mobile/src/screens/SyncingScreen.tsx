import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle } from 'react-native';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { Typography } from '../components';
import { TypographyType } from '../components/Typography';
import { utils, syncData } from '../app';
import { appConfig } from '../app/appConfig';
import LottieView from 'lottie-react-native';
import lottieAnimation from './lottie-animation.json';

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
            await syncData.sync();
        }

        setTimeout(() => {
            utils.gotoNextScreenOnAppOpen();
        }, 0);
    }

    public render() {
        return (
            <SafeAreaView style={styles.container}>
                <LottieView
                    style={{ width:'70%' }}
                    source={lottieAnimation}
                    autoPlay loop
                />

                <Typography type={TypographyType.headingPrimary}>
                    Changing diapers
                </Typography>
                <Typography type={TypographyType.headingSecondary} style={{ color: 'grey' }}>
                    ... and syncing data
                </Typography>
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
