import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ScaledSheet, moderateScale, scale } from "react-native-size-matters";
import { Typography, TypographyType } from "../../../src/components/Typography";
import { Button, Colors } from "react-native-paper";
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
// @ts-ignore
import GDrive from "react-native-google-drive-api-wrapper";

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

    /**
     * Don't save token anywhere, always request new tokens so they are refreshed.
     */
    private googleGetTokens = async () => {
        try {
            const tokens = await GoogleSignin.getTokens();
            console.warn(JSON.stringify(tokens, null, 4));
        } catch (e) {
            // Not logged in
            console.warn(e);
        }
    };

    private googleLogout = async () => {
        await GoogleSignin.signOut();
        console.warn('Logged out');
    };

    private async setGDriveAccessToken() {
        const tokens = await GoogleSignin.getTokens();

        if (tokens && tokens.accessToken) {
            GDrive.setAccessToken(tokens.accessToken);
            GDrive.init();
        } else {
            throw 'Could not set Google access token';
        }
    }

    private gdriveCreateFile = async () => {
        try {
            await this.setGDriveAccessToken();

            GDrive.files.createFileMultipart(
                `Hello file`,
                'text/plain',
                {
                    parents: ['root'],
                    name: 'file1.txt'
                }
            );

            console.warn('File created');
        } catch (e) {
            console.warn('You are not logged in');
        }
    };

    private gdriveGetFiles = async () => {
        try {
            await this.setGDriveAccessToken();

            // API: https://bit.ly/2xGQw7T
            const response = await GDrive.files.list({
                // spaces: 'drive',

                // Fields: https://bit.ly/3eIpXzG
                // fields: '*', // Use just during development!
                fields: 'files(id,name,mimeType,kind,trashed,version,originalFilename,fileExtension)',

                // Filter: https://bit.ly/3ax8TJI
                q: `trashed=false`, // `trashed=false and name contains 'file1'`

                // Order: https://bit.ly/34ZczTf
                orderBy: 'name asc',
            });

            if (response.status === 200) {
                let results = await response.json();
                console.warn(JSON.stringify(results.files, null, 4));
            } else {
                let results = await response.text();
                console.warn(results);
            }
        } catch(e) {
            console.warn('You are not logged in');
        }
    };

    render() {
        return (
            <ScrollView contentContainerStyle={{ flex: 1, padding: 24, alignItems: 'center' }}>
                {/* GOOGLE AUTH */}
                <Typography type={TypographyType.headingSecondary}>
                    Google Auth
                </Typography>

                <Button mode="contained" uppercase={false} onPress={this.googleLogIn} color={Colors.blue700}>
                    Log in
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.googleIsLoggedIn} color={Colors.blue700}>
                    Is logged in?
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.googleGetUser} color={Colors.blue700}>
                    Get user
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.googleGetTokens} color={Colors.blue700}>
                    Get tokens
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.googleLogout} color={Colors.blue700}>
                    Logout
                </Button>
                <View style={{ height: scale(30) }} />

                {/* GOOGLE DRIVE */}
                <Typography type={TypographyType.headingSecondary}>
                    Google Drive
                </Typography>

                <Button mode="contained" uppercase={false} onPress={this.gdriveCreateFile} color={Colors.deepPurple500}>
                    Create file
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.gdriveGetFiles} color={Colors.deepPurple500}>
                    Get files
                </Button>
                <View style={{ height: scale(10) }} />
            </ScrollView>
        );
    }
}