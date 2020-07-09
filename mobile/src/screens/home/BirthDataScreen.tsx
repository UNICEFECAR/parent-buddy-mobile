import React from 'react';
import { View, StyleSheet, ViewStyle, } from 'react-native';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Typography, TypographyType } from '../../components/Typography';
import { DateTimePicker, DateTimePickerType } from '../../components/DateTimePicker';
import { RateAChild } from '../../components/RateAChild';
import { RoundedTextInput } from '../../components/RoundedTextInput';
import { RoundedTextArea } from '../../components/RoundedTextArea';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { userRealmStore, dataRealmStore } from '../../stores';
import { Measures } from '../../stores/ChildEntity';
import { currentLocale } from 'i18n-js';

export interface BirthDataScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, BirthDataScreenParams>;
}

export interface State {
    plannedTermDate: Date | undefined,
    birthDate: Date | undefined,
    babyRating: number | undefined,
    height: string,
    length: string,
    comment: string | undefined,
}

export class BirthDataScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
        this.initState();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: BirthDataScreenParams = {

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private initState = () => {
        let state: State;

        const currentChild = userRealmStore.getCurrentChild();

        if (currentChild) {

            let height: string = "";
            let length: string = "";

            if(currentChild.measures && currentChild.measures !== ""){
                let measures = JSON.parse(currentChild.measures);

                height = measures[0].height;
                length = measures[0].length;
            };

            state = {
                babyRating: currentChild.babyRating,
                birthDate: currentChild.birthDate ? currentChild.birthDate : undefined,
                comment: currentChild.comment,
                height: height === undefined ? "" : height.toString(),
                plannedTermDate: currentChild.plannedTermDate,
                length: length === undefined ? "" : length.toString(),
            };

            this.state = state;
        };
    };

    private gotoBack() {
        this.props.navigation.goBack();
    };

    private submit = () => {
        const { comment, length, height, babyRating, plannedTermDate, birthDate } = this.state;

        const currentChild = userRealmStore.getCurrentChild();
        if (!currentChild) return;

        let measures: Measures[] = [];

        if (currentChild.measures !== null && currentChild.measures !== "") {
            measures = JSON.parse(currentChild.measures);

            measures[0].height = height;
            measures[0].length = length;
            measures[0].measurementDate = birthDate;
        } else {
            measures.push({ length: length, height: height, measurementDate: birthDate })
        }

        userRealmStore.realm?.write(() => {
            currentChild.comment = comment;
            currentChild.babyRating = babyRating;
            currentChild.plannedTermDate = plannedTermDate;
            currentChild.birthDate = birthDate;
            currentChild.measures = JSON.stringify(measures);
            // This will just trigger the update of data realm
            dataRealmStore.setVariable('randomNumber', Math.floor(Math.random() * 6000) + 1);

            this.props.navigation.goBack();
        });
    }

    private setPlannedTerm = (date: Date) => {
        this.setState({
            plannedTermDate: date
        })
    }

    private setBirthDate = (date: Date) => {
        this.setState({
            birthDate: date
        })
    }

    private setChildWeight = (value: string) => {
        this.setState({
            height: value
        })
    }

    private setChildLength = (value: string) => {
        this.setState({
            length: value
        })
    }

    private setChildRaiting = (value: number) => {
        this.setState({
            babyRating: value
        })
    }

    private setComment = (value: string) => {
        this.setState({
            comment: value
        })
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <KeyboardAwareScrollView
                        // themeContext.theme.screenContainer?.backgroundColor
                        style={{ backgroundColor: 'white' }}
                        contentContainerStyle={[styles.container]}
                        keyboardShouldPersistTaps='always'
                    >
                        <View style={{ alignItems: 'flex-start', padding: themeContext.theme.screenContainer?.padding }}>

                            {/* DESCRIPTION TEXT */}
                            <Typography type={TypographyType.bodyRegular}>
                                {translate('birthDataDescription')}
                            </Typography>

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* PLANNED TERM */}
                            <DateTimePicker
                                label={translate('fieldLabelPlannedTerm')} type={DateTimePickerType.date}
                                style={{ alignSelf: 'stretch' }}
                                value={this.state.plannedTermDate}
                                onChange={(date) => this.setPlannedTerm(date)}
                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />

                            {/* BIRTH DATE */}
                            <DateTimePicker
                                label={translate('fieldLabelBirthDate')} type={DateTimePickerType.date}
                                style={{ alignSelf: 'stretch' }}
                                value={this.state.birthDate}
                                onChange={(date) => this.setBirthDate(date)}
                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* BABY RATING ON BIRTH */}
                            <Typography type={TypographyType.bodyRegular} style={{ marginBottom: scale(5) }}>
                                {translate('fieldLabelBabyRatingOnBirth')}
                            </Typography>

                            <RateAChild onChange={(value) => this.setChildRaiting(value)} value={this.state.babyRating} />
                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* BABY MEASUREMENTS */}
                            <Typography type={TypographyType.bodyRegular} style={{ marginBottom: scale(8) }}>
                                {translate('fieldLabelMeasurementsOnBirth')}
                            </Typography>

                            <RoundedTextInput
                                label={translate('fieldLabelWeight')}
                                suffix="g"
                                icon="weight"
                                style={{ width: scale(150) }}
                                onChange={(value) => this.setChildWeight(value)}
                                value={this.state.height}
                                keyboardType="numeric"
                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />

                            <RoundedTextInput
                                label={translate('fieldLabelLength')}
                                suffix="cm"
                                icon="weight"
                                style={{ width: scale(150) }}
                                onChange={(value) => this.setChildLength(value)}
                                value={this.state.length}
                                keyboardType="numeric"

                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* DOCTOR COMMENTS */}
                            <RoundedTextArea
                                label={translate('fieldLabelCommentFromDoctor')} onChange={(value) => this.setComment(value)}
                                style={{ alignSelf: 'stretch' }}
                                value={this.state.comment}
                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                            {/* SUBMIT BUTTON */}
                            <RoundedButton
                                text={translate('buttonSaveData')}
                                type={RoundedButtonType.purple}
                                onPress={() => this.submit()}
                            />

                            <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />
                        </View>

                    </KeyboardAwareScrollView>
                )}
            </ThemeConsumer>
        );
    }

}

export interface BirthDataScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<BirthDataScreenStyles>({
    container: {

    },
});
