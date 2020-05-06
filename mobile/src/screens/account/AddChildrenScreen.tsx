import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Typography, TypographyType } from '../../components/Typography';
import { PhotoPicker, PhotoPickerStyles } from "../../components/PhotoPicker";
import { RadioButtons, RadioButtonsStyles } from "../../components/RadioButtons";
import { RoundedTextInput, RoundedTextInputStyles } from "../../components/RoundedTextInput";
import { TextButton, TextButtonSize, TextButtonColor } from "../../components/TextButton";
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { dataRealmStore } from '../../stores';
import { utils } from '../../app';

export interface Props {
    navigation: NavigationStackProp<NavigationStackState>;
}

export interface State {

}

export class AddChildrenScreen extends React.Component<Props, State> {

    public constructor(props:Props) {
        super(props);
    }

    private gotoAddParentsScreen() {
        dataRealmStore.setVariable('userEnteredChildData', true);
        
        this.props.navigation.navigate('AccountStackNavigator_AddParentsScreen');
    }

    public render() {
        return (
            <SafeAreaView style={ [styles.container] }>
                <KeyboardAwareScrollView contentContainerStyle={ {backgroundColor:'white', flexDirection:'column', justifyContent:'flex-start', alignItems:'stretch'} }>
                    {/* TITLE */}
                    <Typography style={{margin:scale(30)}} type={ TypographyType.headingPrimary }>
                        { translate('accountTitle') }
                    </Typography>

                    {/* PHOTO PICKER */}
                    <PhotoPicker onChange={ ()=>{} } />

                    <View style={{height:scale(30)}}></View>

                    <View style={{padding:scale(30), alignItems:'center'}}>
                        {/* CHOOSE GENDER */}
                        <RadioButtons
                            value="girl"
                            buttons={ [{text:translate('accountGirl'), value:'girl'}, {text:translate('accountBoy'), value:'boy'}] }
                            onChange={ () => {} }
                        />

                        <View style={{height:scale(20)}}></View>

                        {/* NAME */}
                        <RoundedTextInput
                            label={ translate('accountName') }
                            icon="account-outline"
                            onChange={ () => {} }
                        />

                        <View style={{height:scale(20)}}></View>

                        {/* ADD SIBLING */}
                        <TextButton color={TextButtonColor.purple} onPress={ () => {} }>
                            + { translate('accountHasSibling') }
                        </TextButton>

                        <View style={{height:scale(20)}}></View>

                        {/* NEXT BUTTON */}
                        <RoundedButton
                            text = { translate('accountNext') }
                            type = { RoundedButtonType.purple }
                            showArrow={ true }
                            onPress={ () => {this.gotoAddParentsScreen()} }
                        />
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }

}

export interface AddChildrenScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<AddChildrenScreenStyles>({
    container: {
        flex: 1,
        backgroundColor:'white'
    },
});
