import React, { Component, Children } from 'react'
import { ViewStyle, StyleSheet, TextStyle, Dimensions } from 'react-native'
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
    html: string;
}

export interface Props {
    title?: string
    items: MilestoneItem[];
    roundedButton?: { title: string, onPress: Function }
}


export class MilestoneForm extends Component<Props> {
    render() {
        return (
            <ScrollView>
                <Typography type={TypographyType.headingSecondary} style={styles.headerStyle}>{this.props.title}</Typography>
                <List.AccordionGroup>
                    {
                        this.props.items.map((item, key) => (
                            <List.Accordion
                                id={key + 1}
                                key={key + 1}
                                left={props => <Checkbox status={item.checked ? 'checked' : 'unchecked'} color="#2BABEE" onPress={() => { }} />}
                                title={item?.title}
                                titleNumberOfLines={3}
                                style={styles.listStyle}
                            >
                                <HTML
                                    html={item.html}
                                    baseFontStyle={{ fontSize: scale(17) }}
                                    tagsStyles={htmlStyles}
                                    imagesMaxWidth={Dimensions.get('window').width}
                                    staticContentMaxWidth={Dimensions.get('window').width}
                                />
                            </List.Accordion>
                        ))
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
        paddingLeft: 0,
        borderBottomColor: 'rgba(0,0,0,0.06)',
        borderBottomWidth: 1
    },
    buttonStyle:{
        marginTop: scale(20), 
        marginBottom: scale(32)
    },
    headerStyle:{
        textAlign: 'center'
    }

})

const htmlStyles = {
    p: { marginBottom: 15 },
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(15) },
};