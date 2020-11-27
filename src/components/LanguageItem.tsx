import React from 'react';
import { Text, StyleProp, ViewStyle, StyleSheet, TouchableOpacity, View, TextStyle } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { scale } from 'react-native-size-matters';
import { Typography } from '.';
import { dataRealmStore, Language } from '../stores/dataRealmStore';
import { translate } from '../translations';
import { TypographyType } from './Typography';

export interface Props {
    language: Language,
    activeLanguage: string | null,
}

export interface State {
}

export class LanguageItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <View style={styles.container}>
                <RadioButton.IOS value={this.props.language.code} status={this.props.activeLanguage === this.props.language.code ? "checked" : "unchecked"} />
                <Typography style={{ textAlign: 'left' }} type={TypographyType.bodyRegularLargeSpacing}>{translate(this.props.language.title)}</Typography>
            </View>
        );
    }
}

export interface LanguageItemStyles {
    container?: ViewStyle;
};

const styles = StyleSheet.create<LanguageItemStyles>({
    container: {
        flexDirection: 'row',
        marginTop: scale(10)
    },
});
