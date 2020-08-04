import React, { Fragment } from 'react';
import Realm from 'realm';
import { ScrollView, StyleSheet, View, ViewStyle, Alert, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { scale } from 'react-native-size-matters';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { ArticlesSection, ArticlesSectionData } from './ArticlesSection';
import { DataRealmContext, DataRealmContextValue, DataRealmConsumer } from '../../stores/DataRealmContext';
import { ContentEntity, ContentEntitySchema } from '../../stores/ContentEntity';
import { CategoryArticlesViewEntity } from '../../stores/CategoryArticlesViewEntity';
import { dataRealmStore, apiStore } from '../../stores';
import { translate } from '../../translations/translate';
import { content, localize, utils, googleDrive } from '../../app';
import { Media } from '../../components';
import Orientation from 'react-native-orientation-locker';
import { getSearchResultsScreenData } from '../../stores/getSearchResultsScreenData';
import axios, { AxiosResponse } from 'axios';
import { appConfig } from "../../app/appConfig";
import { HomeMessages, Message, IconType } from '../../components/HomeMessages';
import { RoundedButtonType } from '../../components/RoundedButton';
import { DataUserRealmsConsumer, DataUserRealmsContextValue } from '../../stores/DataUserRealmsContext';
import { UserRealmConsumer, UserRealmContextValue } from '../../stores/UserRealmContext';
import { syncUsers } from '../../app/syncUsers';

export interface HomeScreenParams {
    showSearchInput?: boolean;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>;
}

/**
 * Shows several ArticlesSection.
 */
export class HomeScreen extends React.Component<Props, object> {

    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
    }

    public componentDidMount() {
        Orientation.lockToPortrait();
    }

    public componentWillUnmount() {

    }

    private setDefaultScreenParams() {
        let defaultScreenParams: HomeScreenParams = {
            showSearchInput: false,
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private async onTestButtonPress(userRealmContext: UserRealmContextValue) {
        const email = 'halobebaapp@gmail.com';

        // EXPORT DATA
        // const response = await syncUsers.exportData(email);

        // IS THERE EXPORT?
        // const response = await syncUsers.isThereDataForImport(email);

        // DELETE SYNC DATA
        // const response = await syncUsers.deleteApiSyncData(email);

        // IMPORT DATA
        // const response = await syncUsers.importData(userRealmContext, email);

        // LIST
        const response = await googleDrive.list({
            filter: `trashed=false`,
        });

        console.log('Final response2', JSON.stringify(response, null, 4));
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }} contentContainerStyle={[styles.container, { padding: themeContext.theme.screenContainer?.padding }]}>

                        {/* <Text>{localize.getLanguage()}</Text> */}

                        {/* Test button */}
                        <UserRealmConsumer>
                            {(userRealmContext: UserRealmContextValue) => (
                                <Fragment>
                                    <Button onPress={() => { this.onTestButtonPress(userRealmContext) }}>Test</Button>
                                    <View style={{ height: 30 }} />
                                </Fragment>
                            )}
                        </UserRealmConsumer>

                        {/* HOME MESSAGES */}
                        <DataRealmConsumer>
                            {(dataRealmContext: DataRealmContextValue) => (
                                <UserRealmConsumer>
                                    {(userRealmContext: UserRealmContextValue) => (
                                        <HomeMessages showCloseButton={true}></HomeMessages>
                                    )}
                                </UserRealmConsumer>
                            )}
                        </DataRealmConsumer>

                        {/* ARTICLES SECTION */}
                        <DataRealmConsumer>
                            {(dataRealmContext: DataRealmContextValue) => (
                                <>
                                    {
                                        content.getHomeScreenDevelopmentArticles(dataRealmContext.realm).categoryArticles?.length !== 0 ?
                                            <ArticlesSection data={content.getHomeScreenDevelopmentArticles(dataRealmContext.realm)} />
                                            : null
                                    }
                                    <ArticlesSection data={content.getHomeScreenArticles(dataRealmContext.realm)} />
                                </>
                            )}
                        </DataRealmConsumer>
                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    }

}

export interface HomeScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<HomeScreenStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
});
