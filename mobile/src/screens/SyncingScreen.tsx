import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle, Text } from 'react-native';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { IconButton, Button } from "react-native-paper";
import { scale } from 'react-native-size-matters';

export interface Props {
    navigation: NavigationStackProp<NavigationStackState>;
}

export class SyncingScreen extends React.Component<Props, object> {

    public constructor(props:Props) {
        super(props);
    }

    private onClosePress() {
        this.props.navigation.goBack();
    };

    public render() {
        return (
            <SafeAreaView style={ styles.container }>
                <Text>Syncing</Text>
                <Button onPress={() => {this.onClosePress()}}>Close</Button>
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
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: 'white',
    },
});
