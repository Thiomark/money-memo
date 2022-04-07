import { Text, SafeAreaView, TextInput, TouchableOpacity, View, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, {useContext, useEffect, useState} from 'react';
import Container from '../shared/Container';
import tw from 'tailwind-react-native-classnames';
import { BudgetContext } from '../providers/BudgetProvider';
import { DeductionContext } from '../providers/DeductionProvider';
import { useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

const btn = 'flex flex-1 flex-row items-center justify-center h-12 rounded bg-gray-600'
const btnText = 'font-bold text-gray-50'

const AddAmountScreen = ({navigation}) => {
    const [date, setDate] = useState(new Date(Date.now()));
    const [created_on, setCreatedOn] = useState(Date.now());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [isAmountPostive, setIsAmountPostive] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        console.log(new Date(currentDate).toISOString())
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

    const {addBudget, editBudget} = useContext(BudgetContext);
    const {addDeduction, editDeduction, image, setImage} = useContext(DeductionContext);

    useEffect(() => {
        if(params?.edit){
            let amt;
            if(params.type === 'deductAmount'){
                const temNumber = Number(params.edit.amount) 
                amt = temNumber > 0 ? temNumber : -temNumber;
                setIsAmountPostive(temNumber > 0 ? true : false);

                setTags(params.edit.tags);
            }else {
                amt = params.edit.budget;
            }
            setAmount((amt).toString());
            setDescription(params.edit.description);
            setCreatedOn(new Date (params.edit.created_on));
            setDate(new Date(params.edit.created_on));
        }

        return () => {
            setImage(null);
        }
    }, [])
    
    return (
        <Container>
            <SafeAreaView style={tw`p-2 flex-1`}>
                <View style={[tw`flex-1`]}>
                    {params.type === 'deductAmount' &&
                        <View style={tw`pb-1 flex flex-row`}>
                            <TouchableOpacity 
                                onPress={() => {
                                    if(!image) navigation.navigate('CameraScreen');
                                    else navigation.navigate('ImageScreen', { image })
                                }}
                                style={tw`bg-gray-400 h-16 border-2 border-gray-400 w-20 flex items-center justify-center rounded`}>
                                {
                                    image || params?.edit?.image ? (
                                        <Image source={{ uri: image || params?.edit?.image }} style={[tw`flex-1 w-full`, { width: '100%', height: '100%' }]} />
                                    ) : (
                                        <Icon 
                                            size={40}
                                            color='black'
                                            type='ionicon'
                                            name='image-outline'                                
                                        />
                                    )
                                }
                            </TouchableOpacity>
                            <View style={tw`ml-3 flex items-center justify-center`}>
                                {!image && <Text style={tw`font-bold uppercase text-xs text-gray-50`}>no image selected</Text>}
                            </View>
                        </View>
                    }
                    <View style={tw`flex flex-row mb-1`}>
                        <TextInput
                            style={[tw`rounded bg-gray-400 flex-1 text-black p-3`]}
                            onChangeText={setAmount}
                            value={amount}
                            placeholder='Enter amount'
                            keyboardType="numeric"
                        />
                        {params.type === 'deductAmount' &&
                            <TouchableOpacity 
                                onPress={() => setIsAmountPostive(prev => !prev)}
                                style={tw`w-14 rounded ${!isAmountPostive ? 'bg-red-400' : 'bg-green-400'} flex items-center justify-center ml-1`}>
                                <Text style={tw`text-3xl`}>{isAmountPostive ? '+' : '-'}</Text>
                            </TouchableOpacity>
                        }
                        
                    </View>
                    {params.type === 'deductAmount' && (
                        <TextInput
                            style={[tw`rounded bg-gray-400 mb-1 text-black p-3`]}
                            onChangeText={setTags}
                            value={tags}
                            placeholder="tags"
                        />
                    )}
                    <TextInput
                        style={[{ height:200, textAlignVertical: 'top'}, tw`rounded text-black mb-1 bg-gray-400 p-3`]}
                        multiline={true}
                        value={description}
                        numberOfLines={4}
                        onChangeText={setDescription}
                        placeholder="Amount description"
                    />
                    <View>
                        <View style={tw`flex flex-row`}>
                            <TouchableOpacity style={tw`${btn} ${image && 'mr-0.5'}`} onPress={showDatepicker}>
                                <Text style={tw`${btnText}`}>Change Date</Text>
                                <Icon 
                                    style={tw`ml-2`}
                                    name='calendar-outline'
                                    type='ionicon'
                                    color='white'
                                    size={20}
                                />
                            </TouchableOpacity>
                            {
                                image && (
                                    <TouchableOpacity onPress={() => setImage(null)} style={tw`${btn} ml-0.5 bg-red-500`}>
                                        <Text style={tw`${btnText}`}>Remove Image</Text>
                                    </TouchableOpacity>
                                )
                            }
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
                    (<TouchableOpacity
                        disabled={!amount}
                        onPress={() => {
                        if(params.type === 'deductAmount'){
                            if(Number(amount)){
                                addDeduction({
                                    amount: isAmountPostive ? Number(amount) : -Number(amount),
                                    description,
                                    tags,
                                    created_on,
                                    budgets_id: params.budgetsID,
                                    image,
                                }, params.budgetsID)
                            }
                        }else{
                            if(Number(amount)){
                                addBudget({
                                    budget: Number(amount),
                                    description,
                                    created_on
                                })
                            }
                        }
                        setDescription(null);
                        setAmount(null);
                        setTags(null);
                        setImage(null);
                        navigation.goBack()
                    }} style={[{backgroundColor: '#313238'}, tw`h-12 flex items-center justify-center rounded-lg`]}>
                        <Text style={tw`font-bold text-gray-50 uppercase`}>{params.type === 'deductAmount' ? 'Add Deduction' : 'Add Amount'}</Text>
                    </TouchableOpacity>) : (
                        <TouchableOpacity 
                            onPress={() => {
                                if(params.type === 'deductAmount'){
                                    editDeduction(params.edit.budgets_id, params.edit.id, {
                                        amount: isAmountPostive ? Number(amount) : -Number(amount),
                                        budgets_id: params.edit.budgets_id,
                                        image: params.edit.image,
                                        description,
                                        tags,
                                        created_on,
                                        id: params.edit.id,
                                    })
                                }else{
                                    editBudget(params.edit.id, {
                                        budget: Number(amount),
                                        description,
                                        created_on,
                                        id: params.edit.id,
                                    })
                                }
                                setTags(null);
                                setDescription(null);
                                setAmount(null);
                                navigation.goBack()
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