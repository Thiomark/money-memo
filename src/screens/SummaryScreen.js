import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Container from '../shared/Container';
import tw from 'tailwind-react-native-classnames';
import { Image } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import { DeductionContext } from '../providers/DeductionProvider';

const SummaryScreen = ({navigation}) => {

    const {deduction} = useContext(DeductionContext);
    
    return (
        <Container>
            {deduction && (
                <SafeAreaView>
                    <ScrollView>
                        <View>
                            {/* {image && (
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
                            )} */}
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
        </Container>
    )
}

export default SummaryScreen