import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ScaledSheet, moderateScale, scale } from "react-native-size-matters";
import { Typography, TypographyType } from "../../../src/components/Typography";
import { Button, Colors } from "react-native-paper";
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { LoginButton, AccessToken } from 'react-native-fbsdk';

export class Google extends React.Component {
    private googleSignIn = async () => {
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

    };

    private googleRefreshToken = async () => {

    };

    private googleLogout = async () => {

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

                <Button mode="contained" uppercase={false} onPress={ this.googleSignIn } color={Colors.blue700}>Sign in</Button>
                <View style={{height:scale(10)}} />

                <Button mode="contained" uppercase={false} onPress={ this.googleIsLoggedIn } color={Colors.blue700}>Is logged in?</Button>
                <View style={{height:scale(10)}} />

                <Button mode="contained" uppercase={false} onPress={ this.googleRefreshToken } color={Colors.blue700}>Refresh token</Button>
                <View style={{height:scale(10)}} />

                <Button mode="contained" uppercase={false} onPress={ this.googleLogout } color={Colors.blue700}>Logout</Button>
                <View style={{height:scale(30)}} />

                {/* GOOGLE DRIVE */}
                <Typography type={TypographyType.headingSecondary}>
                    Google Drive
                </Typography>

                <Button mode="contained" uppercase={false} onPress={ this.gdriveCreateFile } color={Colors.deepPurple500}>Create file</Button>
                <View style={{height:scale(10)}} />

                <Button mode="contained" uppercase={false} onPress={ this.gdriveGetFiles } color={Colors.deepPurple500}>Get files</Button>
                <View style={{height:scale(10)}} />
            </ScrollView>
        );
    }
}