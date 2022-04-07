
import { useRoute } from '@react-navigation/native';
import React, {useEffect} from 'react'
import { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { Icon, Image } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import Container from '../shared/Container';

const ImageScreen = ({navigation}) => {
    const [image, setImage] = useState(null);
    const {params} = useRoute();

    useEffect(() => {
        setImage(params.image);
    }, [params]);

    return (
        <Container>
            <View style={tw`relative`}>
                {/* <TouchableOpacity 
                    onPress={() => {
                        navigation.goBack();
                        console.log('sdd')
                    }}
                    style={[{elevation: 10}, tw`bg-white rounded-full flex items-center justify-center left-4 top-10 absolute h-12 w-12`]}>
                    <Icon 
                        type='ionicon'
                        name='arrow-back-outline'
                        color='black'
                        size={30}
                    />
                </TouchableOpacity> */}
                <Image
                    source={{ uri: image }}
                    resizeMode="contain"
                    style={tw`rounded`}
                    containerStyle={[tw`w-full h-full`]}
                    PlaceholderContent={<ActivityIndicator />}
                />
            </View>
        </Container>
        
    )
}

export default ImageScreen