import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle } from 'react-native';
import { NavigationScreenConfigProps } from 'react-navigation';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Typography, TypographyType } from '../../components/Typography';
import { RadioButtons, RadioButtonsStyles } from "../../components/RadioButtons";
import { RoundedTextInput, RoundedTextInputStyles } from "../../components/RoundedTextInput";
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { TextButton, TextButtonSize, TextButtonColor } from "../../components/TextButton";
import { dataRealmStore } from '../../stores';
import { utils } from '../../app';

export interface Props {
    navigation: NavigationStackProp<NavigationStackState>;
}

export interface State {
    parent: 'mother' | 'father';
    parentName?: string;
}

export class AddParentsScreen extends React.Component<Props, State> {

    /**
     * Navigator configuration specific for this screen.
     */
    public static navigationOptions = ({navigation}: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState>>): NavigationStackOptions => {
        return {
            // API: https://bit.ly/2koKtOw
            headerTitle: 'Upoznajmo roditelje',
        };
    };

    public constructor(props:Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            parent: "mother"
        };

        this.state = state;
    }

    private saveParentsData() {
        dataRealmStore.setVariable('userParentalRole', this.state.parent);

        if (this.state.parentName) {
            dataRealmStore.setVariable('userName', this.state.parentName);
        } else {
            dataRealmStore.deleteVariable('userName');
        }

        utils.gotoNextScreenOnAppOpen();
    }

    public render() {
        return (
            <SafeAreaView style={ [styles.container] }>
                <View style={ {padding:scale(30), backgroundColor:'white', flex:1, flexDirection:'column', justifyContent:'flex-start', alignItems:'center'} }>
                    
                    {/* I AM */}
                    <Typography type={TypographyType.bodyRegular}>
                        Ja sam
                    </Typography>

                    <View style={{height:scale(20)}}></View>

                    {/* CHOOSE PARENT TYPE */}
                    <RadioButtons
                        value={ this.state.parent }
                        buttons={ [{text:translate('accountMother'), value:'mother'}, {text:translate('accountFather'), value:'father'}] }
                        onChange={ (text:any) => {this.setState({parent:text})} }
                    />

                    <View style={{height:scale(20)}}></View>

                    {/* NAME */}
                    <RoundedTextInput
                        label={ translate('accountName') }
                        icon="email-outline"
                        value={ this.state.parentName }
                        onChange={ (value) => { this.setState({parentName:value}) } }
                    />

                    <View style={{height:scale(30)}}></View>

                    {/* INVITE OTHER PARENT */}
                    <TextButton color={TextButtonColor.purple} onPress={ () => {} } textStyle={{textAlign:'center'}}>
                        { this.state.parent === 'mother' ? translate('accountInviteFather') : translate('accountInviteMother') }
                    </TextButton>

                    <View style={{flex:1}}></View>

                    {/* SAVE BUTTON */}
                    <RoundedButton
                        text = { translate('accountSave') }
                        type = { RoundedButtonType.purple }
                        onPress={ () => { this.saveParentsData() } }
                    />
                </View>
            </SafeAreaView>
        );
    }

}

export interface AddParentsScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<AddParentsScreenStyles>({
    container: {
        flex: 1,
    },
});
