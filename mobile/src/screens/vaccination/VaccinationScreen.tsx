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
                        {
                            this.getAllVaccinationsPeriods()?.map(item => {
                                console.log(item)
                                return(
                                    <OneVaccinations
                                        title={item.title}
                                        isVaccinationComplete={true}
                                        isVerticalLineVisible={true}
                                        vaccineList={item.vaccines}
                                        onPress={() => this.props.navigation.navigate('HomeStackNavigator_NewDoctorVisitScreen')}
                                        onPress2={() => this.props.navigation.navigate('HomeStackNavigator_VaccinationDataScreen')}
                                    />
                                )
                            }
                               
                            )
                        }

                        {/* <OneVaccinations
                            vaccinationDate="21.7.2019."
                            vaccineList={[
                                { complete: false, title: "Protiv zarazne žutice B", description: "Vakcina dobijena genetskim inženjeringom, sadrži prečišćeni HbsAg" },
                                { complete: true, title: "Protiv difterije, tetanusa, velikog kašlja - 14.6.2019.", description: "Vakcina koja sadrži toksoide difterije i tetanusa i inaktivisanu korpuskulu Bordetella pertusis" },
                                { complete: true, title: "Protiv dečije paralize", description: "Živa oralna tritipna polio vakcina koja sadrži sva tri tipa živa oslabljena poliovirusa" },
                                { complete: true, title: "Protiv oboljenja izazvanih hemofilusom influence tipa B - 15.5.2019.", description: "Konjugovana vakcina" },
                            ]}
                            title="5. Mesec"
                            isVerticalLineVisible={true}
                            onPress={() => this.props.navigation.navigate('HomeStackNavigator_NewDoctorVisitScreen')}
                            onPress2={() => this.props.navigation.navigate('HomeStackNavigator_VaccinationDataScreen')}

                        />
                        <OneVaccinations
                            vaccinationDate="17. - 24. mesec"
                            title="Predstojeća vakcinacija"
                            vaccineList={[
                                { complete: false, title: "Protiv zarazne žutice B", description: "Kombinovana vakcina koja sadrži toksoide difterije i tetanusa i inaktivisanu korpuskulu Bordetella pertusis" }
                            ]}
                            onPress={() => this.props.navigation.navigate('HomeStackNavigator_NewDoctorVisitScreen')}
                            onPress2={() => this.props.navigation.navigate('HomeStackNavigator_VaccinationDataScreen')}
                        /> */}

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

