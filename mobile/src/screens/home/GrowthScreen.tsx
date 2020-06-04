import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { NoMeasurements } from '../../components/Growth/NoMeasurements';
import { LastMeasurements } from '../../components/Growth/LastMeasurements';

export interface GrowthScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, {}>;
}

export default class GrowthScreen extends Component<Props> {
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
            <View style={{ flex: 1, padding: 24, alignItems: 'stretch', backgroundColor: 'white' }}>
                <View style={{marginBottom: 20}}>
                    <NoMeasurements />

                </View>
                <View>
                    <LastMeasurements
                        measureDate="13.9.2018."
                        measureMass="11,4"
                        measureLength="80"
                    />
                </View>

            </View>
        )
    }
}
