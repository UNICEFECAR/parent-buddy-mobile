import React, { Fragment } from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { DateTimePicker, DateTimePickerType } from '../../components/DateTimePicker';
import { RateAChild } from '../../components/RateAChild';
import { RoundedTextInput } from '../../components/RoundedTextInput';
import { RoundedTextArea } from '../../components/RoundedTextArea';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import FastImage from 'react-native-fast-image';
import { ChildGender, ChildEntity, ChildEntitySchema } from '../../stores/ChildEntity';
import { userRealmStore, dataRealmStore } from '../../stores';
import { DateTime } from 'luxon';
import { UserRealmConsumer, UserRealmContextValue } from '../../stores/UserRealmContext';

export interface ChildProfileScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, ChildProfileScreenParams>;
}

export interface State {
    allChilds: Child[]
}

export class ChildProfileScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
    };

    private setDefaultScreenParams() {
        let defaultScreenParams: ChildProfileScreenParams = {

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        };
    };

    private gotoBack() {
        this.props.navigation.goBack();
    };

    private setActiveChildId(id: string) {
        dataRealmStore.setVariable('currentActiveChildId', id);
        this.props.navigation.goBack();
    };

    public render() {
        const screenParams = this.props.navigation.state.params!;

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={[styles.container]}
                        contentContainerStyle={{ alignItems: 'center', padding: themeContext.theme.screenContainer?.padding }}
                    >
                        <UserRealmConsumer>
                            {
                                (userRealmContext: UserRealmContextValue) => (
                                    <Fragment>
                                        {
                                            userRealmStore.getAllChilds(userRealmContext.realm?.objects<ChildEntity>(ChildEntitySchema.name)).map((child) => (
                                                <View style={[child.isCurrentActive ? { backgroundColor: 'rgba(216,216,216,0.42)' } : {}, { width: "90%", alignContent: 'center', alignItems: "center" }]}>
                                                    <View style={{ height: scale(40) }} />
                                                    {child.isCurrentActive ? <Typography style={{ marginBottom: 15 }}>Aktivan profil deteta</Typography> : null}
                                                    {/* PHOTO */}
                                                    <FastImage
                                                        style={styles.photo}
                                                        source={{
                                                            uri: child.photo,
                                                            priority: FastImage.priority.normal,
                                                        }}
                                                        resizeMode={FastImage.resizeMode.cover}
                                                    />

                                                    <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />
                                                    {/* NAME */}
                                                    <Typography type={TypographyType.headingPrimary} style={{ marginBottom: scale(5) }}>
                                                        {child.name}
                                                    </Typography>

                                                    {/* BIRTH DATE */}
                                                    <Typography type={TypographyType.bodyRegular} style={{ fontSize: moderateScale(15), color: 'grey' }}>
                                                        {child.gender === "girl" ? translate('childProfileBirthDateGirl') : translate('childProfileBirthDateBoy')}
                                                        {child.birthDay}
                                                    </Typography>

                                                    <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />
                                                    {
                                                        child.isCurrentActive === false ?
                                                            <RoundedButton
                                                                text="Aktivirajte"
                                                                type={RoundedButtonType.hollowPurple}
                                                                style={{ width: 193, marginBottom: 15 }}
                                                                onPress={() => this.setActiveChildId(child.childId)}
                                                            />
                                                            : null
                                                    }
                                                    {/* EDIT PROFILE */}
                                                    <TextButton color={TextButtonColor.purple} onPress={() => { this.props.navigation.navigate('AccountStackNavigator_AddChildrenScreen', { screenParam: "EditChild", id: child.id }) }}>
                                                        {translate('childProfileChange')}
                                                    </TextButton>

                                                    <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                                                    {/* ADD SIBLING */}
                                                </View>
                                            ))
                                        }
                                    </Fragment>
                                )
                            }
                        </UserRealmConsumer>

                        <TextButton color={TextButtonColor.purple} onPress={() => { this.props.navigation.navigate('AccountStackNavigator_AddChildrenScreen', { screenParam: "NewChild" }) }}>
                            + {translate('childProfileAddSibling')}
                        </TextButton>

                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    };
};

export interface Child {
    childId: string,
    birthDay: string,
    name: string,
    photo: string | undefined,
    gender: ChildGender,
    isCurrentActive: boolean
    id: string
}

export interface ChildProfileScreenStyles {
    container?: ViewStyle;
    photo?: ViewStyle;
}

const styles = StyleSheet.create<ChildProfileScreenStyles>({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    photo: {
        width: scale(120),
        height: scale(120),
        borderRadius: scale(60),
    },
});
