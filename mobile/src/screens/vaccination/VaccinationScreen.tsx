import React, { Component } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale } from 'react-native-size-matters';
import { HomeScreenParams } from '../home/HomeScreen';
import { translate } from '../../translations/translate';
import { OneVaccinations } from '../../components/vaccinations/oneVaccinations';

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

    render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={styles.container}
                    >
                        <OneVaccinations
                            title="Na rođenju"
                            isHorizontalLineVisible={true}
                            vaccineList={[
                                { complete: true, title: "Protiv tuberkuloze", },
                                { complete: true, title: "Protiv zarazne žutice B", },
                            ]}
                        />
                        <OneVaccinations
                            vaccinationDate="21.7.2019."
                            vaccineList={[
                                { complete: false, title: "Protiv zarazne žutice B", description: "Vakcina dobijena genetskim inženjeringom, sadrži prečišćeni HbsAg" },
                                { complete: true, title: "Protiv difterije, tetanusa, velikog kašlja - 14.6.2019.", description: "Vakcina koja sadrži toksoide difterije i tetanusa i inaktivisanu korpuskulu Bordetella pertusis" },
                                { complete: true, title: "Protiv dečije paralize", description: "Živa oralna tritipna polio vakcina koja sadrži sva tri tipa živa oslabljena poliovirusa" },
                                { complete: true, title: "Protiv oboljenja izazvanih hemofilusom influence tipa B - 15.5.2019.", description: "Konjugovana vakcina" },
                            ]}
                            title="5. Mesec"
                            isHorizontalLineVisible={true}
                        />
                        <OneVaccinations
                            vaccinationDate="17. - 24. mesec"
                            title="Predstojeća vakcinacija"
                            vaccineList={[
                                { complete: false, title: "Protiv zarazne žutice B", description: "Kombinovana vakcina koja sadrži toksoide difterije i tetanusa i inaktivisanu korpuskulu Bordetella pertusis" }
                            ]}
                        />

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

