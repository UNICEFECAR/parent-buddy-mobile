import React, { Component, Children } from 'react'
import { scale } from 'react-native-size-matters';

// @ts-ignore
import HTML from 'react-native-render-html';
import { Dimensions } from 'react-native';

export interface Props {
    html: string
}

export class DevelopmentInfo extends Component<Props> {
    render() {
        return (
            <HTML
                html={this.props.html}
                baseFontStyle={{ fontSize: scale(17) }}
                tagsStyles={htmlStyles}
                imagesMaxWidth={Dimensions.get('window').width}
                staticContentMaxWidth={Dimensions.get('window').width}
            />
        )
    }
}


const htmlStyles = {
    p: { marginBottom: 15 },
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(15) },
};