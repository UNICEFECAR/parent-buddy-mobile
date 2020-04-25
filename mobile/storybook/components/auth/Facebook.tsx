import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ScaledSheet, moderateScale, scale } from "react-native-size-matters";
import { Typography, TypographyType } from "../../../src/components/Typography";
import { Button, Colors } from "react-native-paper";
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';

export class Facebook extends React.Component {
    private logIn = async () => {
        try {
            // Permissions: https://bit.ly/3eJcrfg
            const loginResult = await LoginManager.logInWithPermissions([
                "public_profile",
                "email",
            ]);

            if (loginResult.isCancelled) {
                console.warn("Login cancelled");
            } else if (loginResult.error) {
                console.warn("Login fail with error: " + loginResult.error);
            } else {
                console.warn("Login success with permissions: " + loginResult.grantedPermissions?.toString());
            }
        } catch (e) {
            console.warn("Login fail with error: " + e);
        }
    };

    private getUser = () => {
        // Create graph request
        const graphRequest = new GraphRequest(
            '/me',
            
            {
                parameters: {
                    fields: {
                        // For gender and some others, you need to ask FB for permission
                        string: 'id,name,email,first_name,last_name,gender'
                    }
                },
            },

            (error?:object, result?:object) => {
                if (result) console.warn(JSON.stringify(result, null, 4));
                if (error) console.warn('You are not logged in');
            },
        );

        // Start graph request
        new GraphRequestManager().addRequest(graphRequest).start();
    };

    private getAccessToken = async () => {
        const accessToken = await AccessToken.getCurrentAccessToken();
        console.warn( JSON.stringify(accessToken, null, 4) );
    };

    private logOut = async () => {
        LoginManager.logOut();
        console.warn('Logged out');
    };

    render() {
        return (
            <ScrollView contentContainerStyle={{ flex: 1, padding: 24, alignItems: 'center' }}>
                <Typography type={TypographyType.headingSecondary}>
                    Facebook
                </Typography>

                <Button mode="contained" uppercase={false} onPress={this.logIn} color={Colors.blue700}>
                    Log in
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.getUser} color={Colors.blue700}>
                    Get user
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.getAccessToken} color={Colors.blue700}>
                    Get access token
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.logOut} color={Colors.blue700}>
                    Logout
                </Button>
                <View style={{ height: scale(10) }} />
            </ScrollView>
        );
    }
}