import React, { RefObject, createRef } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle, Alert } from 'react-native';
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
import { dataRealmStore, userRealmStore } from '../../stores';
import { utils } from '../../app';
import { ChildEntity, ChildEntitySchema, ChildGender } from '../../stores/ChildEntity';
import { IconButton, Colors } from 'react-native-paper';

export interface Props {
    navigation: NavigationStackProp<NavigationStackState>;
}

export interface State {
    children: ChildEntity[];
}

export class AddChildrenScreen extends React.Component<Props, State> {

    private scrollView: RefObject<KeyboardAwareScrollView>;

    public constructor(props: Props) {
        super(props);
        this.scrollView = createRef<KeyboardAwareScrollView>();
        this.initState();
    }

    private initState() {
        const state: State = {
            children: [
                { name: '', gender: 'girl' }
            ]
        };

        this.state = state;
    }

    private gotoAddParentsScreen() {
        // userRealmStore.create<ChildEntity>(ChildEntitySchema, {
        //     name: 'foo2',
        //     gender: 'boy',
        // });

        // dataRealmStore.setVariable('userEnteredChildData', true);

        // this.props.navigation.navigate('AccountStackNavigator_AddParentsScreen');
    }

    private onChildGenderChange(childIndex: number, newGender: ChildGender) {
        this.setState((prevState) => {
            const newChildren = prevState.children;
            newChildren[childIndex].gender = newGender;

            return {
                children: newChildren,
            };
        });
    }

    private onChildNameChange(childIndex: number, newName: string) {
        this.setState((prevState) => {
            const children = prevState.children;
            children[childIndex].name = newName;

            return {children};
        });
    }

    private addAnotherChild() {
        this.setState((prevState) => {
            const children = prevState.children;

            children.push({
                name: '',
                gender: 'girl',
            });

            return {children};
        }, () => {
            setTimeout(() => {
                this.scrollView.current?.scrollToEnd();
            }, 0);
        });
    }

    private removeChild(childIndex:number) {
        this.setState((prevState) => {
            const children = prevState.children;
            children.splice(childIndex, 1);

            return {children};
        });
    }

    public render() {
        return (
            <SafeAreaView style={[styles.container]}>
                <KeyboardAwareScrollView ref={this.scrollView} contentContainerStyle={{ backgroundColor: 'white', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
                    {/* TITLE */}
                    <Typography style={{ margin: scale(30) }} type={TypographyType.headingPrimary}>
                        {translate('accountTitle')}
                    </Typography>

                    {/* CHILDREN */}
                    {this.state.children.map((child, childIndex) => (
                        <View key={childIndex}>
                            {/* CHILD HEADER */}
                            { childIndex !== 0 && (
                                <View style={{ height:scale(45), paddingLeft:scale(10), backgroundColor: '#F8F8F8', flexDirection:'row', alignItems:'center' }}>
                                    <Text style={{ flex:1, fontSize:moderateScale(16), fontWeight:'bold' }}>
                                        {translate('accountSisterOrBrother')}
                                    </Text>

                                    <IconButton
                                        icon="close"
                                        size={scale(25)}
                                        onPress={() => {this.removeChild(childIndex)}}
                                    />
                                </View>
                            ) }

                            {/* PHOTO PICKER */}
                            <PhotoPicker imageData={child.photoData} onChange={imageData => child.photoData = imageData} />

                            <View style={{ height: scale(30) }}></View>

                            <View style={{ padding: scale(30), alignItems: 'center' }}>
                                {/* CHOOSE GENDER */}
                                <RadioButtons
                                    value={child.gender}
                                    buttons={[{ text: translate('accountGirl'), value: 'girl' }, { text: translate('accountBoy'), value: 'boy' }]}
                                    onChange={value => { if (value) { child.gender = value as ChildGender; } }}
                                />

                                <View style={{ height: scale(20) }}></View>

                                {/* NAME */}
                                <RoundedTextInput
                                    label={translate('accountName')}
                                    icon="account-outline"
                                    value={child.name}
                                    onChange={(value) => { this.onChildNameChange(childIndex, value) }}
                                />

                                <View style={{ height: scale(20) }}></View>

                                {/* ADD SIBLING */}
                                {childIndex === this.state.children.length - 1 && (
                                    <TextButton color={TextButtonColor.purple} onPress={() => { this.addAnotherChild() }}>
                                        + { translate('accountHasSibling')}
                                    </TextButton>
                                )}

                                {/* <View style={{height:scale(20)}}></View> */}
                            </View>
                        </View>
                    ))}

                    <View style={{ height: scale(20) }}></View>

                    {/* NEXT BUTTON */}
                    <RoundedButton
                        text={translate('accountNext')}
                        type={RoundedButtonType.purple}
                        showArrow={true}
                        style={{ marginHorizontal: scale(30) }}
                        onPress={() => { this.gotoAddParentsScreen() }}
                    />

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
        backgroundColor: 'white'
    },
});
