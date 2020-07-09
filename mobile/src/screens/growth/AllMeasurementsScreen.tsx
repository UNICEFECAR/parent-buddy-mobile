import React, { Component } from 'react'
import { View } from "react-native";
import { Measures } from '../../stores/ChildEntity';
import { userRealmStore } from '../../stores';
import { DateTime } from 'luxon';
import { OneMeasurements } from '../../components/growth/OneMeasurement';

interface Props{

}

interface State{
    allMeasurements: Measures[]
}

export class AllMeasurementsScreen extends Component<Props, State>{
    constructor(props: Props){
        super(props);

        this.initState();
    }

    private initState(){
        let state: State = {
            allMeasurements: []
        }

        let currentChild = userRealmStore.getCurrentChild();

        if(currentChild && currentChild.measures !== "" && currentChild.measures !== null){
            let measrues = JSON.parse(currentChild.measures);
            let measurementDateInDays: number | undefined = 0;
            const timeNow = DateTime.local();

            state.allMeasurements = measrues.map(item => {
                if (item.measurementDate) {
                    let date = DateTime.fromJSDate(item.measurementDate);
                    measurementDateInDays = timeNow.diff(date, "days").toObject().days;
                };
    
                return {
                    height: item.height ? parseFloat(item.height) : 0,
                    length: item.length ? parseFloat(item.length) : 0,
                    measurementDate: measurementDateInDays ? measurementDateInDays : 0,
                };
            })

        }


        this.state = state;
    }


    render(){
        return(
            <View>
                {this.state.allMeasurements.length && this.state.allMeasurements.map(measure => (
                    <OneMeasurements 
                        measureDate={measure.measurementDate ? measure.measurementDate?.toDateString() : ""}
                        measureLength={measure.length ? measure.length?.toString() : ""}
                        measureMass={measure.height ? measure.height.toString() : ""}
                        title="a"
                    />
                ))}
            </View>
        )
    }
}