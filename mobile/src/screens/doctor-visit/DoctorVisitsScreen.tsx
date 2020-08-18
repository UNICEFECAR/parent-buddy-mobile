import React, { Component } from 'react'
import { StyleSheet, ViewStyle, Text, View } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale } from 'react-native-size-matters';
import { HomeScreenParams } from '../home/HomeScreen';
import { translate } from '../../translations/translate';
import { Typography, TypographyType } from '../../components/Typography';

export interface DoctorVisitsScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>,
}

export class DoctorVisitsScreen extends Component<Props> {
    public constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={styles.container}
                    >
                        <Typography type={TypographyType.headingPrimary}>
                            {translate('doctorVisitsScreenTitle')}
                        </Typography>
                    </ScrollView>
                )}
            </ThemeConsumer>
        )
    }
}

export interface DoctorVisitsScreenStyles {
    container: ViewStyle
}

const styles = StyleSheet.create<DoctorVisitsScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    }
})

