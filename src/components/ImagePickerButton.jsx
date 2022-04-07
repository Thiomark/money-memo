import React, { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import tw from 'tailwind-react-native-classnames';
import { Icon, Image } from 'react-native-elements';

const CameraScreen = ({navigation}) => {
    const [image, setImage] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [takenImage, setTakenImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const cameraRef = useRef(null)

    useEffect(() => {
        (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const takeImage = async () => {
        if (cameraRef) {
            try {
                let photo = await cameraRef.current.takePictureAsync ({
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality:1,
                });
                setImage(photo);
                setTakenImage(photo);
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    return (
        <View style={tw`h-full flex`}>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
            <Camera 
                style={tw`flex-1`} 
                type={Camera.Constants.Type.back} 
                ref={cameraRef}
            />
            <View style={tw`h-28 flex items-center flex-row relative justify-evenly`}>
                <TouchableOpacity onPress={() => {
                    if(!takenImage) return
                    navigation.navigate('ImageScreen', { image: takenImage.uri})
                }} style={tw`h-16 w-16 ${takenImage && 'border-2 border-gray-50'} rounded-full`}>
                    {takenImage &&
                        <Image
                            source={{ uri: takenImage.uri }}
                            containerStyle={[tw`rounded-full flex-1 w-full`, {aspectRatio: 1}]}
                            PlaceholderContent={<ActivityIndicator />}
                        />
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
        </View>
    );
}

export default CameraScreen
    