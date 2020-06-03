import React from 'react';
import { View, Text, StyleProp, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

export interface Props {
    style?: StyleProp<ViewStyle>;
}

export interface State {
    
}

export class HomeMessages extends React.Component<Props, State> {
    static defaultProps: Props = {
        
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            
        };

        this.state = state;
    }

    public render() {
        return (
            <View style={ [styles.container, this.props.style] }>
                <Text>Component: HomeMessages</Text>
            </View>
        );
    }
}

export interface HomeMessagesStyles {
    [index:string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
}

const styles = StyleSheet.create<HomeMessagesStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: 'orange',
        padding: 15,
    },
});
