import React from 'react';
import { View, Text, StyleProp, StyleSheet, ViewStyle, TextStyle, ImageStyle, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { Typography, TypographyType } from './Typography';
import { scale } from 'react-native-size-matters';
import { themes } from '../themes';
import Icon from 'react-native-vector-icons/FontAwesome';

export interface Props {
    title?: string;
    videoType?: VideoType;
    videoUrl?: string;
    videoPlayButtonSize?: number;
    coverImageUrl: string;
    aspectRatio?: number;
    roundCorners?: boolean;
    style?: StyleProp<ViewStyle>;
    onTextPress?: Function;
}

export interface State {

}

export class Media extends React.Component<Props, State> {
    static defaultProps: Props = {
        videoType: 'youtube',
        videoUrl: '',
        videoPlayButtonSize: scale(70),
        coverImageUrl: '',
        aspectRatio: 1.7,
        roundCorners: false,
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
        let getPlayIcon = () => {
            const size = this.props.videoPlayButtonSize ?? scale(60);

            return (
                <View style={{
                    justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    width: size, height: size,
                    borderRadius: themes.percentageToDP('20%')
                }}>
                    <Icon
                        name={"play"}
                        style={{ color: 'white', marginLeft: size / 10, fontSize: size / 2 }}
                    />
                </View>
            );
        };
            
            return (
                <View style={[styles.container, (this.props.roundCorners ? styles.roundCorner : {}), this.props.style]}>
                    {/* COVER IMAGE */}
                    <TouchableOpacity
                        onPress={() => { console.log(this.props.coverImageUrl) }}
                    >
                        <ImageBackground
                            source={{ uri: this.props.coverImageUrl }}
                            style={[styles.coverImage, { width: '100%', aspectRatio:this.props.aspectRatio }]}
                            resizeMode="cover"
                        >
                            {getPlayIcon()}
                        </ImageBackground>
                    </TouchableOpacity>

                    {/* TITLE */}
                    {this.props.title ? (
                        <>
                            <View style={{ height: scale(10) }} />
                            <TouchableOpacity
                                onPress={() => { console.warn('text clicked') }}
                            >
                                <Typography type={TypographyType.headingSecondary}>
                                    {this.props.title}
                                </Typography>
                            </TouchableOpacity>
                        </>
                    ) : null}
                </View>
            );
        }
    }

export interface VideoStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
    roundCorner: ViewStyle;
    coverImage: ViewStyle;
}

const styles = StyleSheet.create<VideoStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: 'orange',
        // padding: 15,
    },

    roundCorner: {
        borderRadius: 10,
        overflow: 'hidden',
    },

    coverImage: {
        borderRadius: scale(10),
        justifyContent: 'center',
        alignItems:'center',
        overflow: 'hidden',
    }
});

export type VideoType = 'youtube' | 'vimeo';