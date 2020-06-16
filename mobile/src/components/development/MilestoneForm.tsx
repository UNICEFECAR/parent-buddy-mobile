import React, { Component, Children } from 'react'
import { ViewStyle, StyleSheet, TextStyle, Dimensions, View } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { RoundedButton, RoundedButtonType } from '../RoundedButton';
import { scale } from 'react-native-size-matters';
import { List } from "react-native-paper";
import { Checkbox } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
// @ts-ignore
import HTML from 'react-native-render-html';

export interface MilestoneItem {
    checked: boolean;
    title: string;
    id: number,
    html: string;
}

export interface Props {
    title?: string
    items: MilestoneItem[];
    onCheckboxPressed: Function
    roundedButton?: { title: string, onPress: Function }
}

export class MilestoneForm extends Component<Props> {

    private change = (id: number) => {
        if(this.props.onCheckboxPressed){
                this.props.onCheckboxPressed(id)

        }
    }

    render() {
        return (
            <ScrollView>
                <Typography type={TypographyType.headingSecondary} style={styles.headerStyle}>{this.props.title}</Typography>
                <List.AccordionGroup>
                    {
                        this.props.items.map((item, key) => {
                            console.log(item.checked, 'checked')
                            return (
                                <View>
                                    <View style={{ width: 30, marginTop: 5, alignItems: 'center', justifyContent: 'center', position: 'absolute', zIndex: 1, }}>
                                        <Checkbox.Android status={item.checked ? 'checked' : 'unchecked'} color="#2BABEE" style={{ width: 2 }} onPress={() => this.change(item.id)} />
                                    </View>
                                    <List.Accordion
                                        id={key + 1}
                                        key={key + 1}
                                        title={item?.title}
                                        onPress={() => { console.log('press') }}
                                        expanded={false}
                                        titleNumberOfLines={2}
                                        titleStyle={{fontSize: 15}}
                                        style={styles.listStyle}
                                    >
                                        <HTML
                                            html={item.html}
                                            baseFontStyle={{ fontSize: scale(15) }}
                                            tagsStyles={htmlStyles}
                                            imagesMaxWidth={Dimensions.get('window').width}
                                            staticContentMaxWidth={Dimensions.get('window').width}
                                        />
                                    </List.Accordion>
                                </View>
                            )

                        })
                    }
                </List.AccordionGroup>
                {
                    this.props.roundedButton && (
                        <RoundedButton
                            showArrow={true}
                            type={RoundedButtonType.purple}
                            text={this.props.roundedButton.title}
                            onPress={this.props.roundedButton.onPress}
                            style={styles.buttonStyle} />
                    )
                }

            </ScrollView>
        )
    }
}


export interface MilestoneFormStyles {
    [index: string]: ViewStyle | TextStyle,
    container: ViewStyle,
    listStyle: ViewStyle,
    buttonStyle: ViewStyle,
    headerStyle: TextStyle,
}

const styles = StyleSheet.create<MilestoneFormStyles>({
    container: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
    },
    listStyle: {
        paddingVertical: scale(2),
        paddingLeft: 30,
        borderBottomColor: 'rgba(0,0,0,0.06)',
        borderBottomWidth: 1,

    },
    buttonStyle: {
        marginTop: scale(20),
        marginBottom: scale(32)
    },
    headerStyle: {
        textAlign: 'center'
    }

})

const htmlStyles = {
    p: { marginTop: 15, marginBottom: 15},
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(15) },
};