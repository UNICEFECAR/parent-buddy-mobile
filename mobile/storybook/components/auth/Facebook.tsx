import React from 'react';
import { View, Text } from 'react-native';

export class Facebook extends React.Component {
    render() {
        return (
            <View style={{ flex:1, padding:24 }}>
                <Text style={{ fontSize: 16, marginBottom: 16, lineHeight: 20 }}>
                    Facebook
                </Text>
            </View>
        );
    }
}