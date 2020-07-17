import React, { Component } from 'react'
import { StyleSheet, ViewStyle, View } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';
import { dataRealmStore, userRealmStore } from '../../stores';
import { MilestoneForm, MilestoneItem } from '../../components/development/MilestoneForm';
import { Typography } from '../../components';
import { TypographyType } from '../../components/Typography';
import Icon from "react-native-vector-icons/FontAwesome";
import { DevelopmentInfo } from '../../components/development/DevelopmentInfo';
import { translate } from '../../translations';

export interface EditPeriodScreenParams {
    id: number,
    title: string,
    isCurrenPeriod: boolean,
    warningText: string,
    subtitle: string,
    onGoBack: Function
};


export interface Props {
    navigation: NavigationStackProp<NavigationStackState, EditPeriodScreenParams>,
};
export interface State {
    uncheckedMilestones: MilestoneItem[],
    checkedMilestones: MilestoneItem[],
    milestonesForCheck: MilestoneItem[],
};

export class EditPeriodScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
        this.initState();
    };

    private initState() {
        let id: number = 0;

        if (this.props.navigation.state.params) {
            id = this.props.navigation.state.params.id
        };

        let milestones = dataRealmStore.getMilestonesForGivenPeriod(id);

        let state: State = {
            checkedMilestones: milestones.checkedMilestones,
            uncheckedMilestones: milestones.uncheckedMilestones,
            milestonesForCheck: [],
        };

        this.state = state;
    };

    private setDefaultScreenParams() {
        let defaultScreenParams: EditPeriodScreenParams = {
            id: 0,
            isCurrenPeriod: false,
            onGoBack: () => { },
            subtitle: '',
            title: '',
            warningText: '',
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        };
    };

    /*
    * Delete milestone from unchecked and push in checked milestones array
    */
    private filterItems(id: number) {
        let milestones: number[] = userRealmStore.getVariable('checkedMilestones');
        let milestonesIds: number[] = [];

        if (!milestones) {
            userRealmStore.setVariable('checkedMilestones', []);
        } else {
            milestonesIds = milestones;
            if (milestonesIds?.indexOf(id) === -1) {
                milestonesIds.push(id);
            } else {
                milestonesIds?.splice(milestonesIds.indexOf(id), 1);
            };
        };

        userRealmStore.setVariable('checkedMilestones', milestonesIds);

    };

    private onCheckBoxPress(id: number) {

        let uncheckedMilestones = this.state.uncheckedMilestones;

        uncheckedMilestones.forEach(item => {
            if (item.id === id) {
                item.checked = !item.checked
            };
        });

        this.setState({
            uncheckedMilestones: uncheckedMilestones,
            milestonesForCheck: uncheckedMilestones.filter(item => item.checked === true)
        });

    };

    private save() {

        this.state.milestonesForCheck.forEach(item => {
            this.filterItems(item.id);
        })

        if (this.props.navigation.state?.params?.id) {
            let milestones = dataRealmStore.getMilestonesForGivenPeriod(this.props.navigation.state.params.id);

            this.setState({
                checkedMilestones: milestones.checkedMilestones,
                uncheckedMilestones: milestones.uncheckedMilestones,
            });
        };

        if (this.props.navigation.state.params?.onGoBack) {
            this.props.navigation.state.params.onGoBack();
        }
    };

    private renderIcon = () => {
        if (this.state.uncheckedMilestones.length === 0) {
            return "check-circle"
        } else {
            return "exclamation-circle"
        };
    };

    private iconColor = () => {
        if (this.state.uncheckedMilestones.length === 0) {
            return "#2CBA39"
        } else {
            if (this.props.navigation.state?.params?.isCurrenPeriod) {
                return "#2BABEE"
            } else {
                return "#EB4747"
            };
        };
    };

    render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={styles.container}
                    >
                        <View style={{ padding: 20 }}>
                            <View style={styles.headerView}>
                                <Icon
                                    name={this.renderIcon()}
                                    style={[styles.iconStyle, { color: this.iconColor() }]}
                                />
                                <View >
                                    <Typography type={TypographyType.headingSecondary}>
                                        {this.props.navigation.state?.params?.title}
                                    </Typography>
                                    <Typography style={{ marginTop: -5 }}>
                                        {this.props.navigation.state?.params?.subtitle}
                                    </Typography>
                                </View>
                            </View>
                            {
                                /* 
                                * Render all unchecked milestones
                                */
                                this.state.uncheckedMilestones.length !== 0 && (
                                    <MilestoneForm
                                        items={this.state.uncheckedMilestones}
                                        title={translate('abilitiesAndSkillsChildNeedToGet')}
                                        onCheckboxPressed={(id: number) => this.onCheckBoxPress(id)}
                                        roundedButton={{
                                            title: translate('accountSave'),
                                            onPress: () => this.save()
                                        }}
                                    />
                                )
                            }
                            {
                                /* 
                                * Render all checked milestones
                                */
                                this.state.checkedMilestones.length !== 0 && (
                                    <MilestoneForm
                                        title={translate('abilitiesAndSkillsChildAlreadGet')}
                                        items={this.state.checkedMilestones}
                                        onCheckboxPressed={() => { }}
                                    />
                                )
                            }
                        </View>
                        {
                            /* 
                            * Render warning text 
                            */
                            this.props.navigation.state?.params?.warningText &&
                            <DevelopmentInfo html={this.props.navigation.state.params.warningText} />
                        }
                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    };
};



export interface EditPeriodScreenStyles {
    container: ViewStyle,
    iconStyle: ViewStyle,
    headerView: ViewStyle,
};

const styles = StyleSheet.create<EditPeriodScreenStyles>({
    container: {
        alignItems: 'stretch',
    },
    iconStyle: {
        marginRight: scale(10),
        marginTop: scale(3),
        fontSize: moderateScale(26),
        color: "#2CBA39",
    },
    headerView: {
        flexDirection: 'row',
        marginBottom: 24
    }
});
