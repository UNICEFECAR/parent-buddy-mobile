import React, { Component } from 'react'
import { ViewStyle, StyleSheet, Dimensions, View } from 'react-native'
import { scale, moderateScale } from 'react-native-size-matters';
import { List } from "react-native-paper";
import { Checkbox } from 'react-native-paper';
// @ts-ignore
import HTML from 'react-native-render-html';

export interface MilestoneItem {
    checked: boolean;
    title: string;
    id: number,
    html?: string;
}

export interface Props {
    title?: string
    items: MilestoneItem[];
    onCheckboxPressed: Function
    roundedButton?: { title: string, onPress: Function }
}

export class AccordionCheckBoxList extends Component<Props> {

    private change = (id: number) => {
        if (this.props.onCheckboxPressed) {
            this.props.onCheckboxPressed(id)
        }
    }

    render() {
        return (
            <List.AccordionGroup>
                {
                    this.props.items.map((item, key) => (
                        <View>
                            <View style={styles.checkBoxContainer}>
                                <Checkbox.Android status={item.checked ? 'checked' : 'unchecked'} color="#2BABEE" style={{ width: 2 }} onPress={() => this.change(item.id)} />
                            </View>
                            <List.Accordion
                                id={key + 1}
                                key={key + 1}
                                title={item?.title}
                                expanded={false}
                                titleNumberOfLines={2}
                                titleStyle={{ fontSize: moderateScale(15) }}
                                style={styles.listStyle}
                            >
                                <HTML
                                    html={item.html}
                                    baseFontStyle={{ fontSize: moderateScale(15) }}
                                    tagsStyles={htmlStyles}
                                    imagesMaxWidth={Dimensions.get('window').width}
                                    staticContentMaxWidth={Dimensions.get('window').width}
                                />
                            </List.Accordion>
                        </View>
                    ))
                }
            </List.AccordionGroup>
        )
    }
}


export interface MilestoneFormStyles {
    listStyle: ViewStyle,
    checkBoxContainer: ViewStyle
}

const styles = StyleSheet.create<MilestoneFormStyles>({
    listStyle: {
        paddingVertical: scale(2),
        paddingLeft: 30,
        borderBottomColor: 'rgba(0,0,0,0.06)',
        borderBottomWidth: 1,
    },
    checkBoxContainer: {
        width: 30,
        marginTop: 5, 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'absolute', 
        zIndex: 1, 
    }
})

const htmlStyles = {
    p: { marginTop: 15, marginBottom: 15 },
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(15) },
};