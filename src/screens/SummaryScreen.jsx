import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useContext } from 'react';
import Container from '../shared/Container';
import tw from 'tailwind-react-native-classnames';
import { Image } from 'react-native-elements';
import { DeductionContext } from '../providers/DeductionProvider';
import * as Clipboard from 'expo-clipboard';
import { format } from 'date-fns';

const Item = ({field, results, pre, noCopy}) => {
    const copyToClipboard = (word) => {
        Clipboard.setString(word);
    };

    return (
        <TouchableOpacity disabled={noCopy ? true : false} onPress={() => {
            if(noCopy) return;
            copyToClipboard(results);
            ToastAndroid.showWithGravityAndOffset('text copied to the clipboard', ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);

        }} style={tw`pb-4 px-2`}>
            <Text style={tw`font-bold text-lg text-gray-100`}>{field}</Text>
            <Text style={tw`text-gray-300`}>{pre ? `${pre} ` : ''}{results}</Text>
        </TouchableOpacity>
    )
}

const SummaryScreen = ({navigation}) => {

    const {deduction} = useContext(DeductionContext);
    
    return (
        <Container>
            {deduction && (
                <SafeAreaView>
                    <ScrollView>
                        <View>
                            {deduction?.image && (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('ImageScreen', {id: deduction.id, image: deduction?.image})
                                }} style={tw`p-2`}>
                                    <Image
                                        source={{ uri: deduction?.image }}
                                        style={tw`rounded`}
                                        resizeMode="contain"
                                        containerStyle={[tw`w-full`, {height: 300}]}
                                    />
                                </TouchableOpacity>
                            )}
                            <Item field='Amount' pre='R' results={deduction.amount < 0 ? -deduction.amount : deduction.amount}/>
                            {deduction.description && (
                                <Item field='Description' results={deduction.description}/>
                            )}
                            {deduction.tags && (
                                <Item field='Tags' results={deduction.tags}/>
                            )}
                            <Item noCopy field='Date' results={format(new Date(deduction.created_on), 'PPPPpppp')}/>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )}
        </Container>
    )
}

export default SummaryScreen