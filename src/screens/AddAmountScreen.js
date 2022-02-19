import { Text, SafeAreaView, TextInput, TouchableOpacity, View } from 'react-native'
import React, {useContext, useEffect, useState} from 'react'
import Container from '../shared/Container'
import tw from 'tailwind-react-native-classnames'
import { BudgetContext } from '../providers/BudgetProvider'
import { useRoute } from '@react-navigation/native'

const AddAmountScreen = ({navigation}) => {
    const [amount, setAmount] = useState(null);
    const [description, setDescription] = useState(null);
    const [tags, setTags] = useState('');
    const {image, addAmount, addBudget, setImage} = useContext(BudgetContext);
    const {params} = useRoute(); 

    return (
        <Container>
            <SafeAreaView style={tw`p-2 flex-1`}>
                <View style={[tw`flex-1`]}>
                    <TextInput
                        style={[tw`rounded bg-gray-400 mb-1 text-black p-3`]}
                        onChangeText={setAmount}
                        placeholder='Enter amount'
                        keyboardType="numeric"
                    />
                    {params.type === 'deductAmount' && (
                        <View>
                            <TextInput
                                style={[tw`rounded bg-gray-400 mb-1 text-black p-3`]}
                                onChangeText={setTags}
                                placeholder="tags"
                            />
                            <TextInput
                                style={[{ height:200, textAlignVertical: 'top'}, tw`rounded text-black mb-1 bg-gray-400 p-3`]}
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={setDescription}
                                placeholder="Amount description"
                            />
                        </View>
                        
                    )}
                    
                </View>
                
                <TouchableOpacity onPress={() => {
                    if(params.type === 'deductAmount'){
                        if(Number(amount)){
                            addAmount({
                                budgetsID: params.budgetsID,
                                amount: Number(amount),
                                description,
                                tags,
                                image: image ? image.uri : null
                            })
                        }
                        setDescription(null);
                        setAmount(null);
                    }else{
                        if(Number(amount)){
                            addBudget({
                                budget: Number(amount)
                            })
                            setDescription(null);
                            setAmount(null);
                        }
                    }
                   navigation.goBack()
                }} style={[{backgroundColor: '#313238'}, tw`h-12 flex items-center justify-center rounded-lg`]}>
                    <Text style={tw`font-bold text-gray-50 uppercase`}>Add Deduction</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </Container>
    )
}


export default AddAmountScreen