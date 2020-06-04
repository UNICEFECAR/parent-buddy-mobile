import React, { Component } from 'react'
import { Text, View, StyleSheet, ViewStyle } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { NoMeasurements } from '../../components/Growth/NoMeasurements';
import { LastMeasurements } from '../../components/Growth/LastMeasurements';
import { OneMeasurements } from '../../components/Growth/OneMeasurement';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';

export interface GrowthScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, {}>;
}

export class GrowthScreen extends Component<Props> {
    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: GrowthScreenParams = {

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
                        {/* margin just for testing */}
                        <View style={{ marginBottom: 20 }}>
                            <NoMeasurements />
                        </View>
                        <View style={{ marginBottom: 20 }} >
                            <LastMeasurements
                                measureDate="13.9.2018."
                                measureMass="11,4"
                                measureLength="80"
                            />
                        </View>
                        <View style={{ marginBottom: 20 }} >
                            <OneMeasurements
                                measureDate="13.9.2018."
                                measureMass="11,4"
                                measureLength="80"
                            />
                        </View>
                    </ScrollView>
                )}
            </ThemeConsumer>

        )
    }
}

export interface GrowthScreenStyles {
    container: ViewStyle
}

const styles = StyleSheet.create<GrowthScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    }
})

