import React from 'react';
import { ViewStyle, Text, View, Dimensions } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../themes/ThemeContext';
import NetInfo from "@react-native-community/netinfo";

// @ts-ignore
import WebView from 'react-native-webview';
import { GradientBackground, Typography, RoundedButton } from '../components';
import { TypographyType } from '../components/Typography';
import { dataRealmStore } from '../stores';
import { ActivityIndicator } from 'react-native-paper';
import { translate } from 'i18n-js';


export interface PollsScreenParams {
    showSearchInput?: boolean;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, PollsScreenParams>;
}

export interface State {
    title: string,
    url: string,
}

/**
 * Describes who created the application.
 */
export class PollsScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
        this.initState();
    }

    private initState() {

        const polls = this.props.navigation.state.params?.polls;

        let state: State = {
            title: "",
            url: "",
        }

        if (polls) {
            const activePolls = polls

            state.title = activePolls.title;
            state.url = activePolls.link;
        };


        this.state = state;
    };

    private setDefaultScreenParams() {
        let defaultScreenParams: PollsScreenParams = {
            showSearchInput: false,
        };


        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private gotoBack() {
        this.props.navigation.goBack();
    }

    private async canPollsBeOpened() {
        const netInfo = await NetInfo.fetch();

        if (netInfo.isConnected && netInfo.isInternetReachable) {
            return true;
        } else {
            return false;
        }
    }

    private onMessage() {
        let polls = this.props.navigation.state.params?.polls;

        if (polls) {
            let id = polls.id;
            let updated_at = polls.updated_at

            dataRealmStore.onPollFinished(id, updated_at)
        };

        this.props.navigation.goBack();
    };

    private loader() {
        let top = Dimensions.get('window').height / 2;
        return <ActivityIndicator size='large' style={{top: -top}} />
    }

    public render() {
        if (!this.canPollsBeOpened()) {
            return (
                <View style={{ alignContent: 'stretch', alignItems: 'center', justifyContent: 'center', paddingTop: 50 }}>
                    <Typography style={{ textAlign: 'center', padding: 20 }} type={TypographyType.headingSecondary}>{translate('pollsNoInternet')}</Typography>
                </View>
            )
        }
        return (
            <WebView
                style={{ flex: 1 }}
                renderLoading={this.loader}
                startInLoadingState={true}
                source={{
                    uri: this.state.url
                }}

                onMessage={() => this.onMessage()}
            />
            // <RoundedButton text="TEST FINISH" onPress={() => this.onMessage()} />
        );
    }

}

export interface PollsScreenStyles {
    container?: ViewStyle;
}

