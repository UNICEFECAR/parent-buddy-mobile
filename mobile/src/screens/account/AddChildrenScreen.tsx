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
import { IconButton, Colors, Snackbar } from 'react-native-paper';
import { debounce } from "lodash";
import Realm, { ObjectSchema } from 'realm';
import { UserRealmContext, UserRealmContextValue, UserRealmConsumer } from '../../stores/UserRealmContext';
import ImagePicker, { Image as ImageObject } from 'react-native-image-crop-picker';
import { DocumentDirectoryPath, copyFile, exists, unlink, mkdir } from "react-native-fs";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export interface Props {
    navigation: NavigationStackProp<NavigationStackState>;
}

export interface State {
    isSnackbarVisible: boolean;
    snackbarMessage: string;
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
            isSnackbarVisible: false,
            snackbarMessage: '',
        };

        this.state = state;
    }

    private addFirstChild() {
        let numberOfChildren = userRealmStore.realm?.objects<ChildEntity>(ChildEntitySchema.name).length;

        if (numberOfChildren !== undefined && numberOfChildren !== 0) {
            return;
        }

        userRealmStore.create<ChildEntity>(ChildEntitySchema, this.getNewChild());
    }

    private getNewChild(): ChildEntity {
        return {
            uuid: uuidv4(),
            name: '',
            gender: 'girl',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
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

    private async onChildPhotoChange(child: ChildEntity, image: ImageObject) {
        // Create Documents/children folder if it doesnt exist
        if (!(await exists(`${DocumentDirectoryPath}/children`))) {
            mkdir(`${DocumentDirectoryPath}/children`);
        }

        // Set newFilename
        let newFilename: string;

        let parts = image.filename.split('.');
        let extension: string | null = null;
        if (parts.length > 1) {
            extension = parts[parts.length - 1].toLowerCase();
        }

        if (extension) {
            newFilename = `${child.uuid}.${extension}`;
        } else {
            newFilename = child.uuid;
        }

        // Set destPath
        let destPath = `${DocumentDirectoryPath}/children/${newFilename}`;

        // Delete image if it exists
        if (await exists(destPath)) {
            await unlink(destPath);
        }

        // Copy image
        await copyFile(image.path, destPath);

        // Save imageUri to realm
        userRealmStore.realm?.write(() => {
            child.photoUri = destPath;
        });
    }

    private async addAnotherChild() {
        await userRealmStore.create<ChildEntity>(ChildEntitySchema, this.getNewChild());

        setTimeout(() => {
            this.scrollView.current?.scrollToEnd();
        }, 0);
    }

    private async removeChild(child: ChildEntity) {
        await userRealmStore.delete(child);
    }

    private gotoAddParentsScreen() {
        if (this.validate()) {
            dataRealmStore.setVariable('userEnteredChildData', true);
            this.props.navigation.navigate('AccountStackNavigator_AddParentsScreen');
        } else {
            this.setState({
                isSnackbarVisible: true,
                snackbarMessage: 'All names must be given',
            });
        }
    }

    private validate(): boolean {
        let rval = true;

        const allChildren = userRealmStore.realm?.objects<ChildEntity>(ChildEntitySchema.name);

        allChildren?.forEach((child) => {
            if (!child.name || child.name === '') {
                rval = false;
            }
        });

        return rval;
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
                                            imageUri={child.photoUri}
                                            onChange={image => this.onChildPhotoChange(child, image)}
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
                                            {(userRealmContext.realm?.objects(ChildEntitySchema.name) && childIndex === userRealmContext.realm?.objects(ChildEntitySchema.name).length - 1) && (
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

                    <View style={{ height: scale(40) }}></View>

                </KeyboardAwareScrollView>

                <Snackbar
                    visible={this.state.isSnackbarVisible}
                    duration={Snackbar.DURATION_SHORT}
                    onDismiss={() => { this.setState({ isSnackbarVisible: false }) }}
                    theme={{ colors: { onSurface: Colors.red500, accent: 'white' } }}
                    action={{
                        label: 'Ok',
                        onPress: () => {
                            this.setState({ isSnackbarVisible: false });
                        },
                    }}
                >
                    <Text style={{ fontSize: moderateScale(16) }}>
                        { this.state.snackbarMessage }
                    </Text>
                </Snackbar>
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
