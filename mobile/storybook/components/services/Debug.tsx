import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ScaledSheet, moderateScale, scale } from "react-native-size-matters";
import { Typography, TypographyType } from "../../../src/components/Typography";
import { Button, Colors } from "react-native-paper";
import { dataRealmStore, userRealmStore } from '../../../src/stores';

export class Debug extends React.Component {
    private deleteAllOnboardingData() {
        dataRealmStore.deleteVariable('userEmail');
        dataRealmStore.deleteVariable('userIsLoggedIn');
        dataRealmStore.deleteVariable('followGrowth');
        dataRealmStore.deleteVariable('followDoctorVisits');
        dataRealmStore.deleteVariable('followDevelopment');
        dataRealmStore.deleteVariable('allowAnonymousUsage');
        dataRealmStore.deleteVariable('userIsOnboarded');
        dataRealmStore.deleteVariable('userEnteredChildData');
        dataRealmStore.deleteVariable('userParentalRole');
        dataRealmStore.deleteVariable('userName');
    }

    private logRealmPath() {
        console.log( userRealmStore.realm?.path.replace('user.realm', '') );
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ flex: 1, padding: 24, alignItems: 'center' }}>
                <Typography type={TypographyType.headingSecondary}>
                    Debug
                </Typography>

                <Button mode="contained" uppercase={false} onPress={ () => {this.logRealmPath()} } color={Colors.blue700}>
                    Log realms path
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={ () => {this.deleteAllOnboardingData()} } color={Colors.blue700}>
                    Delete all onboarding data
                </Button>
                <View style={{ height: scale(10) }} />
            </ScrollView>
        );
    }
}