import React, { Component } from "react";
import { GrowthChart, chartTypes, ChartData } from "../../components/growth/GrowthChart";
import { navigation } from "../../app";
import { NavigationStackProp, NavigationStackState } from "react-navigation-stack";
import { HomeScreenParams } from "../home/HomeScreen";
import { translate } from "../../translations";

interface State{
    chartType: chartTypes,
    childBirthDate: Date,
    childGender: "male" | "female",
    lineChartData: ChartData[],
}

interface Props{
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>,
}

export class ChartFullScreen extends Component<Props, State>{
    constructor(props: Props){
        super(props);
        this.initState();
    }

    private initState(){
       if(this.props.navigation.state.params){
           const {chartType, childBirthDate, childGender, lineChartData} = this.props.navigation.state.params;
           let state: State = {
               chartType: chartType,
               childBirthDate: childBirthDate,
               childGender: childGender,
               lineChartData: lineChartData,
           }

           this.state = state;
       }
    }

    private closeFullScreen(){
        navigation.navigate('');
    }

    render(){
        const {chartType, childBirthDate, childGender, lineChartData} = this.state;
        const title = chartType === chartTypes.heightLength ? translate('heightForLength') : translate('lengthForAge');
        
        return(
            <GrowthChart 
                title={title}
                showFullscreen={true}
                chartType={chartType}
                childBirthDate={childBirthDate}
                childGender={childGender}
                lineChartData={lineChartData}
                closeFullScreen={() => this.closeFullScreen()}
            />
        )
    }

}