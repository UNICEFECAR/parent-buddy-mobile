import React, { RefObject, createRef, Fragment } from 'react';
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
import { debounce } from "lodash";
import Realm, { ObjectSchema } from 'realm';
import { UserRealmContext, UserRealmContextValue, UserRealmConsumer } from '../../stores/UserRealmContext';
import ImagePicker, { Image as ImageObject } from 'react-native-image-crop-picker';

export interface Props {
    navigation: NavigationStackProp<NavigationStackState>;
}

export interface State {

}

export class AddChildrenScreen extends React.Component<Props, State> {

    private scrollView: RefObject<KeyboardAwareScrollView>;

    public constructor(props: Props) {
        super(props);
        this.scrollView = createRef<KeyboardAwareScrollView>();
        this.initState();
        this.addFirstChild();
    }

    private initState() {
        const state: State = {

        };

        this.state = state;
    }

    private addFirstChild() {
        let numberOfChildren = userRealmStore.realm?.objects<ChildEntity>(ChildEntitySchema.name).length;

        if (numberOfChildren !== undefined && numberOfChildren !== 0) {
            return;
        }

        userRealmStore.create<ChildEntity>(ChildEntitySchema, {
            name: '',
            gender: 'girl',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    private gotoAddParentsScreen() {
        // userRealmStore.create<ChildEntity>(ChildEntitySchema, {
        //     name: 'foo2',
        //     gender: 'boy',
        // });

        // dataRealmStore.setVariable('userEnteredChildData', true);

        // this.props.navigation.navigate('AccountStackNavigator_AddParentsScreen');
    }

    private onChildGenderChange(child: ChildEntity, newGender: ChildGender) {
        userRealmStore.realm?.write(() => {
            child.gender = newGender;
            child.updatedAt = new Date();
        });
    }

    private onChildNameChange(child: ChildEntity, newName: string) {
        userRealmStore.realm?.write(() => {
            child.name = newName;
            child.updatedAt = new Date();
        });
    }

    private onChildPhotoChange(childIndex: number, image: ImageObject) {
        console.warn(image.path);
        // this.setState((prevState) => {
        //     const children = prevState.children;
        //     children[childIndex].photoData = imageData;

        //     return { children };
        // }, () => {
        //     this.saveChildrenToStore();
        // });
    }

    private async addAnotherChild() {
        await userRealmStore.create<ChildEntity>(ChildEntitySchema, {
            name:'',
            gender:'girl',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        setTimeout(() => {
            this.scrollView.current?.scrollToEnd();
        }, 0);
    }

    private async removeChild(child: ChildEntity) {
        await userRealmStore.delete(child);
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
                    <UserRealmConsumer>
                        {(userRealmContext: UserRealmContextValue) => (
                            <Fragment>
                                {userRealmContext.realm?.objects<ChildEntity>(ChildEntitySchema.name).map((child, childIndex) => (
                                <View key={childIndex}>
                                    {/* CHILD HEADER */}
                                    {childIndex !== 0 && (
                                        <View style={{ height: scale(45), paddingLeft: scale(10), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ flex: 1, fontSize: moderateScale(16), fontWeight: 'bold' }}>
                                                {translate('accountSisterOrBrother')}
                                            </Text>

                                            <IconButton
                                                icon="close"
                                                size={scale(25)}
                                                onPress={() => { this.removeChild(child) }}
                                            />
                                        </View>
                                    )}

                                    {/* PHOTO PICKER */}
                                    <PhotoPicker
                                        onChange={image => this.onChildPhotoChange(childIndex, image)}
                                    />

                                    <View style={{ height: scale(30) }}></View>

                                    <View style={{ padding: scale(30), alignItems: 'center' }}>
                                        {/* CHOOSE GENDER */}
                                        <RadioButtons
                                            value={child.gender}
                                            buttons={[{ text: translate('accountGirl'), value: 'girl' }, { text: translate('accountBoy'), value: 'boy' }]}
                                            onChange={value => { if (value) { this.onChildGenderChange(child, value as ChildGender) } }}
                                        />

                                        <View style={{ height: scale(20) }}></View>

                                        {/* NAME */}
                                        <RoundedTextInput
                                            label={translate('accountName')}
                                            icon="account-outline"
                                            value={child.name}
                                            onChange={(value) => { this.onChildNameChange(child, value) }}
                                        />

                                        <View style={{ height: scale(20) }}></View>

                                        {/* ADD SIBLING */}
                                        {(userRealmContext.realm?.objects(ChildEntitySchema.name) && childIndex === userRealmContext.realm?.objects(ChildEntitySchema.name).length-1) && (
                                            <TextButton color={TextButtonColor.purple} onPress={() => { this.addAnotherChild() }}>
                                                + { translate('accountHasSibling')}
                                            </TextButton>
                                        )}

                                        {/* <View style={{height:scale(20)}}></View> */}
                                    </View>
                                </View>
                                ))}
                            </Fragment>
                        )}
                    </UserRealmConsumer>

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
