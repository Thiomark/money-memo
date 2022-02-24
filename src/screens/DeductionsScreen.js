import { Text, View, TouchableOpacity, SectionList, Alert } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import Container from '../shared/Container';
import tw from 'tailwind-react-native-classnames';
import { DeductionContext } from '../providers/DeductionProvider';
import AddDeductionButton from '../components/AddDeductionButton';
import { Image } from 'react-native-elements';
import { formateAmount } from '../utils/helperFunctions'

const DeductionsScreen = ({navigation}) => {
    const {fetchDeductions, deductions, deleteDeduction, fetchedDeductions, removeDeductions, url} = useContext(DeductionContext);
    const {params} = useRoute()

    useEffect(() => {
        fetchDeductions(params.id);
        return () => removeDeductions();
    }, [])
    
    return (
        <Container sides={1}>
            <View style={tw`flex h-full relative`}>
                {fetchedDeductions.length === 0 ? (
                    <View style={tw`flex-1 flex items-center justify-center`}>
                        <Text style={tw`text-gray-50 uppercase font-bold text-xs`}>No deductions</Text>
                    </View>
                    
                ) : (
                    <SectionList 
                        sections={deductions} 
                        style={tw`flex-1 h-full`}
                        keyExtractor={(item, index) => index}
                        renderSectionHeader={({ section: { group } }) => (
                            <Text style={[{fontSize: 16}, tw`text-gray-50 pl-2 font-bold text-blue-400 pb-2`]}>{group === 'null' || group === 'undefined' ? 'No tags' : group}</Text>
                        )}
                        renderItem={({item}) => (
                            <TouchableOpacity onLongPress={() => {
                                Alert.alert(  
                                    null,  
                                    'Do you wish to delete the selected deduction?',  
                                    [   
                                        {  
                                            text: 'Cancel',  
                                            onPress: () => console.log('Cancel Pressed'),  
                                            style: 'cancel',  
                                        },  
                                        {   
                                            text: 'Yes', 
                                            onPress: () => deleteDeduction(params.id, item.id)
                                        },  
                                    ],  
                                    {cancelable: false}  
                                )  
                            }} onPress={() => {
                                navigation.navigate('SummaryScreen', {id: item.id, summary: item.description})
                            }} style={[tw`p-2 rounded mb-1 flex items-center justify-between flex-row`, {backgroundColor: '#1A1B21'}]}>
                                <View style={tw`flex-1`}>
                                    <Text style={tw`font-bold pb-1 ${item.amount > 0 ? 'text-green-500' : 'text-red-400'}`}>R {item.amount}</Text>
                                    {
                                        item.description && <Text style={tw`text-gray-300 text-xs`}>{item.description}</Text>
                                    }
                                </View>
                                {item?.image && (
                                    <Image 
                                        source={{uri: `${url}/images/${item.image}`}}
                                        containerStyle={[tw`rounded ml-2 border border-gray-50`, {aspectRatio: 1, width: 40}]}
                                    />
                                )}
                            </TouchableOpacity>
                        )}
                    />
                )}
                
                {fetchedDeductions.length !== 0 && <View style={[tw`p-4 w-full`, {backgroundColor: '#313238', borderTopRightRadius: 0, borderTopLeftRadius: 0}]}>
                    <Text style={[tw`text-gray-50 font-bold`, {fontSize: 17}]}>Deducted Amount</Text>
                    <Text style={[tw`text-gray-50 font-bold pb-2 text-red-500`, {fontSize: 14}]}>{formateAmount(fetchedDeductions.reduce((a, b) => b.amount + a, 0) < 0 ? -fetchedDeductions.reduce((a, b) => b.amount + a, 0) : fetchedDeductions.reduce((a, b) => b.amount + a, 0))}</Text>
                </View>}
                <AddDeductionButton event={() => {
                    navigation.navigate('AddAmountScreen', {type: 'deductAmount', budgetsID: params.id})
                }}/>
            </View>
        </Container>
    )
}

export default DeductionsScreen