import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ScaledSheet, moderateScale, scale } from "react-native-size-matters";
import { Typography, TypographyType } from "../../../src/components/Typography";
import { Button, Colors } from "react-native-paper";
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
// @ts-ignore
import GDrive from "react-native-google-drive-api-wrapper";
import RNFS, { DownloadResult } from "react-native-fs";

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
            console.warn('You must login first');
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
            console.warn('You must login first');
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

            // CREATE: https://bit.ly/3atW5DJ
            const response: Response = await GDrive.files.createFileMultipart(
                `Hello file`,
                'text/plain',
                {
                    parents: ['root'], // id of parent folder. 'root' has special meaning.
                    name: 'file1.txt'
                }
            );

            if (response.status === 200) {
                console.warn('File created');
            } else {
                let results = await response.text();
                console.warn(results);
            }
        } catch (e) {
            console.warn('You must login first');
        }
    };

    /**
     * If folder exists, it simply returns its id.
     */
    private gdriveCreateFolder = async () => {
        try {
            await this.setGDriveAccessToken();

            const id = await GDrive.files.safeCreateFolder({
                name: "HaloBeba",
                parents: ["root"]
            });

            console.warn(`Folder created (id = ${id})`);
        } catch (e) {
            console.warn('You must login first');
        }
    };

    private gdriveGet = async () => {
        try {
            await this.setGDriveAccessToken();

            const response = await GDrive.files.get(
                '1RNrDUHIhJgwdmXUjbJsQf9GnUnOvNTAA', // id
                // Fields: https://bit.ly/3eIpXzG
                {'fields':'id,name,mimeType,kind,parents,trashed,version,originalFilename,fileExtension'}, // query params
            );

            if (response.status === 200) {
                const results = await response.json();
                console.warn(JSON.stringify(results, null, 4));
            } else {
                console.warn('There is no item with that id');
            }
        } catch (e) {
            console.warn('You must login first');
            // console.warn(await e.text());
        }
    };

    private gdriveGetId = async () => {
        try {
            await this.setGDriveAccessToken();

            const id = await GDrive.files.getId(
                'HaloBeba', // name
                ['root'], // parents
                'application/vnd.google-apps.folder', // mimeType
                false, // trashed
            );

            if (id) {
                console.warn(id);
            } else {
                console.warn('There is no item with that name');
            }
        } catch (e) {
            console.warn('You must login first');
            // console.warn(await e.text());
        }
    };

    private gdriveGetFiles = async () => {
        try {
            await this.setGDriveAccessToken();

            // LIST: https://bit.ly/2xGQw7T
            const response: Response = await GDrive.files.list({
                // Fields: https://bit.ly/3eIpXzG
                fields: 'files(id,name,mimeType,kind,parents,trashed,version,originalFilename,fileExtension)',
                // fields: '*', // Use only during development!

                // Filter: https://bit.ly/3ax8TJI
                q: `trashed=false`,
                // q: `trashed=false and (name contains 'file1') and ('root' in parents) and (mimeType contains 'text/plain') or (mimeType contains 'folder')`,

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
        } catch (e) {
            console.warn('You must login first');
        }
    };

    private gdriveDownloadFile = async () => {
        try {
            await this.setGDriveAccessToken();

            const filePath = RNFS.TemporaryDirectoryPath + '/foo.txt';

            let response: {jobId:number, promise:Promise<DownloadResult>} = GDrive.files.download(
                // File ID
                '1Qxn-e29NpmPvXg6fRRTgZC67lwYnPi_M',
                
                // Download file options: https://bit.ly/2S5CeEu
                {
                    toFile: filePath
                },
                
                // Query params
                {},
            );

            let downloadResult = await response.promise;
            
            if (downloadResult.statusCode === 200) {
                const fileContent = await RNFS.readFile(filePath);
                console.warn(fileContent);
            } else {
                console.warn('File was not downloaded');
            }
        } catch (e) {
            console.warn('You must login first');
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

                <Button mode="contained" uppercase={false} onPress={this.gdriveCreateFolder} color={Colors.deepPurple500}>
                    Create folder
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.gdriveCreateFile} color={Colors.deepPurple500}>
                    Create file
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.gdriveGet} color={Colors.deepPurple500}>
                    Get metadata
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.gdriveGetId} color={Colors.deepPurple500}>
                    Get ID
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.gdriveGetFiles} color={Colors.deepPurple500}>
                    Get files
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.gdriveDownloadFile} color={Colors.deepPurple500}>
                    Download file
                </Button>
                <View style={{ height: scale(10) }} />
            </ScrollView>
        );
    }
}