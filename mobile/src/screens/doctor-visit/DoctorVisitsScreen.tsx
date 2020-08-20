import React, { Component } from 'react'
import { StyleSheet, ViewStyle, Text, View, TextStyle } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale } from 'react-native-size-matters';
import { HomeScreenParams } from '../home/HomeScreen';
import { translate } from '../../translations/translate';
import { Typography, TypographyType } from '../../components/Typography';
import { DoctorVisitCard, IconType } from '../../components/doctor-visit/DoctorVisitCard';

export interface DoctorVisitsScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>;
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
                        {/* TITLE */}
                        <Typography type={TypographyType.headingPrimary} style={styles.title}>
                            {translate('doctorVisitsScreenTitle')}
                        </Typography>

                        {/* CARDS */}
                        <DoctorVisitCard
                            title="Unesi nesto"
                            subTitle="9.7.2020"
                            // titleIcon={IconType.Info}
                        />
                    </ScrollView>
                )}
            </ThemeConsumer>
        )
    }
}

export interface DoctorVisitsScreenStyles {
    container: ViewStyle;
    title: TextStyle;
}

const styles = StyleSheet.create<DoctorVisitsScreenStyles>({
    container: {
        padding: scale(14),
        alignItems: 'stretch',
    },

    title: {
        paddingHorizontal: scale(10),
    },
})

