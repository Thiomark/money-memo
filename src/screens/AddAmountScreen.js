import { Text, SafeAreaView, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useContext, useEffect, useState} from 'react';
import Container from '../shared/Container';
import tw from 'tailwind-react-native-classnames';
import { BudgetContext } from '../providers/BudgetProvider';
import { DeductionContext } from '../providers/DeductionProvider';
import { useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

const btn = 'flex flex-1 flex-row items-center justify-center h-10 rounded bg-gray-600'
const btnText = 'font-semibold text-gray-50'

const AddAmountScreen = ({navigation}) => {
    const [date, setDate] = useState(new Date(Date.now()));
    const [created_on, setCreatedOn] = useState(Date.now());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setCreatedOn(currentDate);
    };
    
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    
    const showDatepicker = () => {
        showMode('date');
    };

    const {params} = useRoute(); 
    const [amount, setAmount] = useState();
    const [description, setDescription] = useState(null);
    const [tags, setTags] = useState(null);

    const {addBudget} = useContext(BudgetContext);
    const {addDeduction, editDeduction, fetchLocalDeductions} = useContext(DeductionContext);

    useEffect(() => {
        if(params?.edit){
            const {amount: amt} = params.edit
            setDescription(params.edit.description);
            setTags(params.edit.tags);
            setAmount((-amt).toString());
            setDate(new Date(params.edit.created_on));
            setCreatedOn(new Date (params.edit.created_on));
        }
    }, [])
    
    return (
        <Container>
            <SafeAreaView style={tw`p-2 flex-1`}>
                <View style={[tw`flex-1`]}>
                    <TextInput
                        style={[tw`rounded bg-gray-400 mb-1 text-black p-3`]}
                        onChangeText={setAmount}
                        value={amount}
                        placeholder='Enter amount'
                        keyboardType="numeric"
                    />
                    {params.type === 'deductAmount' && (
                        <View>
                            <TextInput
                                style={[tw`rounded bg-gray-400 mb-1 text-black p-3`]}
                                onChangeText={setTags}
                                value={tags}
                                placeholder="tags"
                            />
                            <TextInput
                                style={[{ height:200, textAlignVertical: 'top'}, tw`rounded text-black mb-1 bg-gray-400 p-3`]}
                                multiline={true}
                                value={description}
                                numberOfLines={4}
                                onChangeText={setDescription}
                                placeholder="Amount description"
                            />
                        </View>
                    )}
                    <View>
                        <View style={tw`flex flex-row`}>
                            <TouchableOpacity style={tw`${btn}`} onPress={showDatepicker}>
                                <Text style={tw`${btnText}`}>Change Date</Text>
                                <Icon 
                                    style={tw`ml-2`}
                                    name='calendar-outline'
                                    type='ionicon'
                                    color='white'
                                    size={20}
                                />
                            </TouchableOpacity>
                        </View>
                        {show && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={mode}
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                            />
                        )}
                    </View>
                </View>
                {!params.edit ?
                    (<TouchableOpacity onPress={() => {
                        if(params.type === 'deductAmount'){
                            if(Number(amount)){
                                addDeduction({
                                    amount: -Number(amount),
                                    description,
                                    tags,
                                    created_on,
                                    budgets_id: params.budgetsID,
                                    image: null,
                                }, params.budgetsID)
                            }
                        }else{
                            if(Number(amount)){
                                addBudget({
                                    budget: Number(amount),
                                    created_on
                                })
                            }
                        }
                        setDescription(null);
                        setAmount(null);
                        setTags(null);
                        navigation.goBack()
                    }} style={[{backgroundColor: '#313238'}, tw`h-12 flex items-center justify-center rounded-lg`]}>
                        <Text style={tw`font-bold text-gray-50 uppercase`}>{params.type === 'deductAmount' ? 'Add Deduction' : 'Add Amount'}</Text>
                    </TouchableOpacity>) : (
                        <TouchableOpacity 
                            onPress={() => {
                                if(params.type === 'deductAmount'){
                                    editDeduction(params.edit.budgets_id, params.edit.id, {
                                        amount: -Number(amount),
                                        budgets_id: params.edit.budgets_id,
                                        image: params.edit.image,
                                        description,
                                        tags,
                                        created_on,
                                        id: params.edit.id,
                                    })
                                }else{

                                }
                                setTags(null);
                                setDescription(null);
                                setAmount(null);
                                navigation.navigate('Deductions', {id: params.edit.id});
                            }}
                            style={[{backgroundColor: '#313238'}, tw`h-12 flex flex-row items-center justify-center rounded-lg`]}>
                            <Icon 
                                name='save-outline'
                                color='white'
                                type='ionicon'
                            />
                        </TouchableOpacity>
                    )
                }
                
            </SafeAreaView>
        </Container>
    )
}

export default AddAmountScreen