import React from 'react';
import { Dimensions, View, StyleProp, ViewStyle, StyleSheet, TouchableWithoutFeedback, ImageBackground, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker, { Image as ImageObject } from 'react-native-image-crop-picker';

const CROPPED_IMAGE_WIDTH = 800;
const CROPPED_IMAGE_HEIGHT = 800;

export interface Props {
    /**
     * Image in base64 format. For example: data:image/png;base64,iVBORw0KG...
     */
    imageData?: string;
    style?: StyleProp<ViewStyle>;
    onChange?: (imageData:string)=>void
}

export interface State {
    imageData?: string;
    windowWidth: number;
    windowHeight: number;
}

export class PhotoPicker extends React.Component<Props, State> {
    static defaultProps: Props = {
        
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            imageData: this.props.imageData,
            windowWidth: Dimensions.get('screen').width,
            windowHeight: Dimensions.get('screen').height,
        };

        this.state = state;
    }

    private onPhotoPress() {
        ImagePicker.openPicker({
            includeBase64: true,
            compressImageMaxWidth: 500,
            compressImageMaxHeight: 500,

            cropping: true,
            width: CROPPED_IMAGE_WIDTH, // Width of result image when used with cropping option
            height: CROPPED_IMAGE_HEIGHT,
            freeStyleCropEnabled: true,
            showCropGuidelines: true,
        }).then((image:ImageObject | ImageObject[]) => {
            if (!Array.isArray(image)) {
                let imageData = `data:${image.mime};base64,${image.data}`;

                this.setState({
                    imageData: image.data ? imageData : undefined
                }, () => {
                    if (this.props.onChange && image.data) {
                        this.props.onChange(imageData);
                    }
                });
            }
        }).catch(() => {
            // User canceled image selection
            // console.warn('User canceled image selection');
        });
    }

    public render() {
        const cameraIcon = (color:string = '#AA40BF') => {
            let iconStyle: ViewStyle = {};
            let iconContainerStyle: ViewStyle = {};

            if (this.state.imageData) {
                iconStyle.shadowOpacity = 0.5;
                iconStyle.shadowOffset = {width:2, height:2};
                iconStyle.elevation = 2;

                iconContainerStyle.position = 'absolute';
                iconContainerStyle.right = 15;
                iconContainerStyle.bottom = 15;

                iconContainerStyle.shadowOpacity = 0.5;
                iconContainerStyle.shadowOffset = {width:2, height:2};
                iconContainerStyle.elevation = 2;
            }

            return (
                <View style={[{width:55, height:55, borderWidth:2, borderColor:color, borderRadius:5, justifyContent:'center', alignItems:'center'}, iconContainerStyle]}>
                    <Icon
                        name='camera'
                        style={[{ fontSize:20, color:color }, iconStyle]}
                    />
                </View>
            )
        };

        return (
            <TouchableWithoutFeedback onPress={ () => {this.onPhotoPress()} }>
                <View style={ [styles.container, this.props.style] }>
                    {/* NO PHOTO */}
                    {!this.state.imageData ? (
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <Icon
                                name='baby'
                                style={{ position:'absolute', fontSize:(this.state.windowWidth*0.6), color:'#EBEBEB', paddingTop:5 }}
                            />
                            { cameraIcon() }
                        </View>
                    ) : null}

                    {/* SHOW PHOTO */}
                    {this.state.imageData ? (
                        <View style={{flex:1}}>
                            <ImageBackground
                                source={ {uri: this.state.imageData} }
                                style={{ width:'100%', height:'100%' }}
                                resizeMode="cover"
                            >
                                { cameraIcon('white') }
                            </ImageBackground>
                        </View>
                    ) : null}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export interface PhotoPickerStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<PhotoPickerStyles>({
    container: {
        width: '100%',
        aspectRatio: 1.3,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#D8D8D8'
    },
});
