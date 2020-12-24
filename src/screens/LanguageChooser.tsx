import React from 'react';
import { ScrollView, ViewStyle, StyleSheet, Linking, Dimensions, View, Text } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../themes/ThemeContext';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as RNLocalize from 'react-native-localize'

import { setI18nConfig, translate } from '../translations/translate';
import { scale } from 'react-native-size-matters';
import { TextButton, TextButtonColor } from '../components/TextButton';
import { dataRealmStore } from '../stores';
// @ts-ignore
import { RoundedButton, Typography } from '../components';
import { RoundedButtonType } from '../components/RoundedButton';
import { languageList } from '../stores/dataRealmStore';
import { Button, Paragraph, RadioButton } from 'react-native-paper';
import { DataRealmConsumer, DataRealmContextValue } from '../stores/DataRealmContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TypographyType } from '../components/Typography';
import { Theme, themes } from '../themes';
import { theme } from '@storybook/react-native/dist/preview/components/Shared/theme';
import { LanguageItem } from '../components/LanguageItem';
import { utils } from '../app';

export interface LanguageChooserParams { }

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, LanguageChooserParams>;
}

export interface State { }

/**
 * Describes who created the application.
 */
export class LanguageChooser extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
    };

    private  onLanguageChange(languageCode: string){
        dataRealmStore.changeLanguage(languageCode)
    };

    private async onNext(){
        dataRealmStore.setVariable("isUserSetLanguage", true);
        await dataRealmStore.deleteDataOnLanguageChange();

        utils.gotoNextScreenOnAppOpen();
    }

    public render() {

        let currentLanguageCode = dataRealmStore.getVariable("languageCode") ?? "";

        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <DataRealmConsumer>
                        {(dataContext: DataRealmContextValue) => (
                            <ScrollView
                                style={{ flex: 1, backgroundColor: 'white' }}
                                contentContainerStyle={[styles.container]}
                            >
                                <Typography type={TypographyType.headingPrimary} style={{ textAlign: 'center' }}>{translate('TitleChooseLanguage')}</Typography>
                                <RadioButton.Group onValueChange={() => { }} value="">
                                    {
                                        languageList.map(lang => (
                                            <TouchableOpacity key={lang.code} onPress={() => this.onLanguageChange(lang.code)} style={{ borderColor: '#CCCCCC', height: 60, justifyContent: 'center', alignContent: 'center', borderWidth: 1 }}>
                                                <LanguageItem language={lang} activeLanguage={dataRealmStore.getVariable("languageCode")}/>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </RadioButton.Group>

                                <View style={{ position: "absolute", bottom: scale(60), width: '100%', alignSelf: "center", padding: themeContext.theme.screenContainer?.padding }}>
                                    <RoundedButton type={RoundedButtonType.hollowPurple} text={translate("buttonNext")} onPress={() => this.onNext()} />
                                </View>
                            </ScrollView>
                        )}
                    </DataRealmConsumer>
                )}
            </ThemeConsumer>
        );
    }

}

export interface LanguageChooserStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<LanguageChooserStyles>({
    container: {
        flex: 1,
        marginTop: scale(50),
    },
});