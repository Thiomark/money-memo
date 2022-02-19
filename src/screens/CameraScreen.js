import React, { useState, useRef, useContext } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Container from '../shared/Container';
import tw from 'tailwind-react-native-classnames';
import { Icon } from 'react-native-elements';
import { BudgetContext } from '../providers/BudgetProvider';

const CameraScreen = ({navigation}) => {
    const [image, setChoosenImage] = useState(null);
    const cameraRef = useRef(null);
    const {setImage} = useContext(BudgetContext)

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setChoosenImage(result.uri);
            setImage(result.uri)
        }
    };

    const takeImage = async () => {
        if (cameraRef) {
            try {
                let photo = await cameraRef.current.takePictureAsync ({
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality:1,
                });
                setImage(photo.uri);
                setChoosenImage(photo.uri);
            }
            catch (e) { }
        }
    }

    return (
        <Container sides={1}>
            <Camera 
                style={tw`flex-1`} 
                type={Camera.Constants.Type.back} 
                ref={cameraRef}
            />
            <View style={tw`h-28 flex items-center flex-row relative justify-evenly`}>
                <TouchableOpacity onPress={() => {
                    if(!image) return
                    navigation.navigate('ImageScreen', { image })
                }} style={tw`h-16 w-16 ${image && 'border-2 border-gray-50'} rounded-full`}>
                    {image &&
                        <Image source={{ uri: image }} style={[tw`rounded-full flex-1 w-full`, { width: '100%', height: '100%' }]} />
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={takeImage} style={tw`h-16 flex items-center justify-center bg-gray-50 w-16 rounded-full`}>
                    <Icon
                        size={30}
                        name='camera'
                        type='ionicon'
                        color='black'
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={pickImage} style={[tw`h-16 flex items-center border-2 border-gray-50 justify-center bg-black w-16 rounded-full`]}>
                    <Icon
                        name='image-outline'
                        type='ionicon'
                        color='white'
                    />
                </TouchableOpacity>
            </View>
        </Container>
    );
}

export default CameraScreen;