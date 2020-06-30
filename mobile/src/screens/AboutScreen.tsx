import React from 'react';
import { ScrollView, ViewStyle, StyleSheet, Linking, Dimensions } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../themes/ThemeContext';
import { translate } from '../translations/translate';
import { scale } from 'react-native-size-matters';
import { TextButton, TextButtonColor } from '../components/TextButton';
import { TermsScreenParams } from './login/TermsScreen';
import { dataRealmStore } from '../stores';
// @ts-ignore
import HTML from 'react-native-render-html';

export interface AboutScreenParams {
    showSearchInput?: boolean;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, AboutScreenParams>;
}

export interface State {
    title: string,
    body: string,

}

/**
 * Describes who created the application.
 */
export class AboutScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
        this.initState();
    }

    private initState() {
        const aboutPageData = dataRealmStore.getBasicPage(4516);

        if (aboutPageData) {
            let state: State = {
                title: aboutPageData.title,
                body: aboutPageData.body,
            };

            this.state = state;
        };
    };

    private setDefaultScreenParams() {
        let defaultScreenParams: AboutScreenParams = {
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

    private sendEmail() {
        Linking.openURL(`mailto:${translate('appEmail')}`).catch(() => { });
    }

    private callPhone() {
        Linking.openURL(`tel:${translate('appPhone')}`).catch(() => { });
    }

    private openWebsite() {
        Linking.openURL('https://www.halobeba.rs/');
    }

    private gotoTermsScreen() {
        let screenParams: TermsScreenParams = {
            hideCheckboxes: true,
            showBackButton: true
        };

        this.props.navigation.navigate('HomeStackNavigator_TermsScreen', screenParams);
    }

    public render() {
        console.log(dataRealmStore.getBasicPage(4516)?.body, "OVDE")
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ flex: 1, backgroundColor: 'white' }}
                        contentContainerStyle={[styles.container, { padding: themeContext.theme.screenContainer?.padding }]}
                    >
                        <HTML
                            html={this.state.body}
                            baseFontStyle={{ fontSize: scale(18) }}
                            tagsStyles={htmlStyles}
                            imagesMaxWidth={Dimensions.get('window').width}
                            staticContentMaxWidth={Dimensions.get('window').width}
                            onLinkPress={(event: any, href: string) => {
                                Linking.openURL(href);
                            }}
                        />


                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    }

}

export interface AboutScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<AboutScreenStyles>({
    container: {
        // flex: 1,
    },
});
const htmlStyles = {
    p: { marginBottom: 15},
    ol: {display: 'flex', flexDirection: "column"},
    li: {width: '100%'},
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(15) },
};