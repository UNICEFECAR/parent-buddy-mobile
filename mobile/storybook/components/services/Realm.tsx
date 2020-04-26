import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ScaledSheet, moderateScale, scale } from "react-native-size-matters";
import { Typography, TypographyType } from "../../../src/components/Typography";
import { Button, Colors } from "react-native-paper";
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';
import { facebook } from "../../../src/app/facebook";

export class Realm extends React.Component {
    render() {
        return (
            <ScrollView contentContainerStyle={{ flex: 1, padding: 24, alignItems: 'center' }}>
                <Typography type={TypographyType.headingSecondary}>
                    Realm
                </Typography>

                <Button mode="contained" uppercase={false} onPress={() => {}} color={Colors.blue700}>
                    test
                </Button>
                <View style={{ height: scale(10) }} />
            </ScrollView>
        );
    }
}