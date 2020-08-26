import React, { Component } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale } from 'react-native-size-matters';
import { HomeScreenParams } from '../home/HomeScreen';
import { translate } from '../../translations/translate';
import { OneVaccinations } from '../../components/vaccinations/oneVaccinations';
import { translateData } from '../../translationsData/translateData';
import { userRealmStore } from '../../stores';
import { DataRealmConsumer } from '../../stores/DataRealmContext';
import { UserRealmConsumer } from '../../stores/UserRealmContext';

export interface VaccinationScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>,
}

export class VaccinationScreen extends Component<Props> {
    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
    }



    private setDefaultScreenParams() {
        let defaultScreenParams: VaccinationScreenParams = {

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private getAllVaccinationsPeriods() {
        let periods = translateData('immunizationsPeriods');

        return periods;
    }

    /*
        Ako datum rodjenja nije unet, ne treba da ima red or green mark, 
        treba da ima listu vakcina sa tackicama
        ne treba da ima button-e 
    */

    render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={styles.container}
                    >
                        <DataRealmConsumer>
                            {data => (
                                <UserRealmConsumer>
                                    {(user) => (
                                        <>
                                            {userRealmStore.getAllVaccinationPeriods().map(period => {

                                                let isComplete = true;

                                                period.vaccineList.forEach(vaccine => {
                                                    if (vaccine.complete === false) {
                                                        isComplete = false;
                                                        return
                                                    }
                                                });
                                               
                                                return (
                                                    <OneVaccinations
                                                        title={period.title}
                                                        isBirthDayEntered={period.isBirthDayEntered}
                                                        isFeaturedPeriod={period.isFeaturedPeriod}
                                                        isCurrentPeriod={period.isCurrentPeriod}
                                                        isVaccinationComplete={isComplete}
                                                        isVerticalLineVisible={true}
                                                        vaccineList={period.vaccineList}
                                                        onPress={() => this.props.navigation.navigate('HomeStackNavigator_NewDoctorVisitScreen')}
                                                        onPress2={() => this.props.navigation.navigate('HomeStackNavigator_VaccinationDataScreen')}
                                                    />
                                                )
                                            })}
                                        </>
                                    )}
                                </UserRealmConsumer>
                            )}
                        </DataRealmConsumer>

                    </ScrollView>
                )}
            </ThemeConsumer>
        )
    }
}

export interface VaccinationScreenStyles {
    container: ViewStyle
}

const styles = StyleSheet.create<VaccinationScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    }
})

