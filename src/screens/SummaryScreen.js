import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, Button } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Container from '../shared/Container';
import tw from 'tailwind-react-native-classnames';
import { Image } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import { BudgetContext } from '../providers/BudgetProvider';
import * as ImagePicker from 'expo-image-picker';

const SummaryScreen = ({navigation}) => {
    const {deduction, fetchDeduction, url, uploadImage, removeDeduction} = useContext(BudgetContext);
    const {params} = useRoute();
    const [image, setImage] = useState(null)

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    useEffect(() => {
        fetchDeduction(params.id)
        return () => {
            removeDeduction()
        }
    }, [params]);

    useEffect(() => {
        if(deduction?.image){
            setImage(`${url}/images/${deduction.image}`)
        }
    }, [deduction?.image]);
    
    return (
        <Container>
            {deduction && (
                <SafeAreaView>
                    <ScrollView>
                        <View>
                            {image && (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('ImageScreen', {id: deduction.id, image})
                                }} style={tw`p-2`}>
                                    <Image
                                        source={{ uri: image }}
                                        style={tw`rounded`}
                                        resizeMode="contain"
                                        containerStyle={[tw`w-full`], {height: 300}}
                                    />
                                </TouchableOpacity>
                            )}
                            <View style={tw`pb-2 px-2`}>
                                <Text style={tw`font-bold text-lg text-gray-100`}>{deduction.amount > 0 ? 'Added amount' : 'Removed amount'}</Text>
                                <Text style={tw`text-gray-300`}>R {deduction.amount < 0 ? -deduction.amount : deduction.amount}</Text>
                            </View>
                            <View style={tw`pb-2 px-2`}>
                                <Text style={tw`font-bold text-lg text-gray-100`}>Description</Text>
                                <Text style={tw`text-gray-300`}>{deduction.description}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )}
            {/* {!deduction?.image
                && (
                    <View style={tw`flex flex-row px-2`}>
                        <TouchableOpacity 
                            onPress={pickImage}
                            style={tw`flex flex-1 items-center rounded mr-0.5 mt-4 justify-center bg-blue-500`}
                        >
                            <Text style={tw`text-white font-bold p-3`}>Add Image</Text>
                        </TouchableOpacity>
                        {
                            image && (
                                <TouchableOpacity 
                                    onPress={() => [
                                        uploadImage(deduction.id, {image})
                                    ]}
                                    style={tw`flex flex-1 items-center rounded ml-0.5 mt-4 justify-center bg-green-500`}
                                >
                                    <Text style={tw`text-white font-bold p-3`}>Upload Image</Text>
                                </TouchableOpacity>
                            )
                        }
                        
                    </View>
                )
            } */}
        </Container>
    )
}

export default SummaryScreen