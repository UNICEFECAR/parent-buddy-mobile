import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ScaledSheet, moderateScale, scale } from "react-native-size-matters";
import { Typography, TypographyType } from "../../../src/components/Typography";
import { Button, Colors } from "react-native-paper";
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';

export class Google extends React.Component {
    private googleLogIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.warn(userInfo);
        } catch (error) {
            // error.code === statusCodes.SIGN_IN_CANCELLED
            console.warn('Did not sign in');
        }
    };

    private googleIsLoggedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        console.warn(isSignedIn);
    };

    private googleGetUser = async () => {
        const currentUser = await GoogleSignin.getCurrentUser();

        if (currentUser) {
            console.warn(JSON.stringify(currentUser, null, 4));
        } else {
            console.warn('Not logged in');
        }
    };

    private googleGetTokens = async () => {
        try {
            const tokens = await GoogleSignin.getTokens();
            console.warn(JSON.stringify(tokens, null, 4));
        } catch(e) {
            // Not logged in
            console.warn(e);
        }
    };

    private googleLogout = async () => {
        await GoogleSignin.signOut();
        console.warn('Logged out');
    };

    private gdriveCreateFile = async () => {

    };

    private gdriveGetFiles = async () => {

    };

    render() {
        return (
            <ScrollView contentContainerStyle={{ flex:1, padding:24, alignItems:'center' }}>
                {/* GOOGLE AUTH */}
                <Typography type={TypographyType.headingSecondary}>
                    Google Auth
                </Typography>

                <Button mode="contained" uppercase={false} onPress={ this.googleLogIn } color={Colors.blue700}>
                    Log in
                </Button>
                <View style={{height:scale(10)}} />

                <Button mode="contained" uppercase={false} onPress={ this.googleIsLoggedIn } color={Colors.blue700}>
                    Is logged in?
                </Button>
                <View style={{height:scale(10)}} />

                <Button mode="contained" uppercase={false} onPress={ this.googleGetUser } color={Colors.blue700}>
                    Get user
                </Button>
                <View style={{height:scale(10)}} />

                <Button mode="contained" uppercase={false} onPress={ this.googleGetTokens } color={Colors.blue700}>
                    Get tokens
                </Button>
                <View style={{height:scale(10)}} />

                <Button mode="contained" uppercase={false} onPress={ this.googleLogout } color={Colors.blue700}>
                    Logout
                </Button>
                <View style={{height:scale(30)}} />

                {/* GOOGLE DRIVE */}
                <Typography type={TypographyType.headingSecondary}>
                    Google Drive
                </Typography>

                <Button mode="contained" uppercase={false} onPress={ this.gdriveCreateFile } color={Colors.deepPurple500}>
                    Create file
                </Button>
                <View style={{height:scale(10)}} />

                <Button mode="contained" uppercase={false} onPress={ this.gdriveGetFiles } color={Colors.deepPurple500}>
                    Get files
                </Button>
                <View style={{height:scale(10)}} />
            </ScrollView>
        );
    }
}