import { Text, View, TouchableOpacity, FlatList, Alert} from 'react-native';
import { BottomSheet, Button, ListItem } from 'react-native-elements';
import Container from '../shared/Container';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'tailwind-react-native-classnames';
import { BudgetContext } from '../providers/BudgetProvider';
import AddDeductionButton from '../components/AddDeductionButton';

const HomeScreen = ({navigation}) => {
    const {fetchBudgets, budgets, deleteBudget} = useContext(BudgetContext);

    const [isVisible, setIsVisible] = useState(false);
    const list = [
        { title: 'Add People' },
        { 
            title: 'Delete',
            onPress: () => deleteBudget(item.id)
        },
        {
            title: 'Close',
            containerStyle: { backgroundColor: 'red' },
            titleStyle: { color: 'white' },
            onPress: () => setIsVisible(false),
        },
    ];
    
    const formateAmount = (amount) => {
        return 'R ' + (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }

    useEffect(() => {
        fetchBudgets();
    }, []);

    return (
        <Container sides={1}>
            <View style={tw`h-full relative`}>
                <FlatList 
                    data={budgets}
                    keyExtractor={(item, index) => index}
                    renderItem={({item}) => (
                        <TouchableOpacity onLongPress={() => {
                            setIsVisible(true) 
                        }} onPress={() => {
                            navigation.navigate('Deductions', {id: item?.id, amount: item?.budget});
                        }} key={item.id} style={[tw`p-2 rounded mb-1 flex flex-row items-center justify-between`, {backgroundColor: '#1A1B21'}]}>
                            <View style={tw`flex-1`}>
                                <View style={tw`flex flex-row items-center justify-between`}>
                                    <Text style={tw`text-green-300 font-bold`}>{item.remaining_amount && formateAmount(item?.remaining_amount)}</Text>
                                    {
                                        item.removed_amount > 0 && (
                                            <Text style={tw`text-red-500 font-semibold`}>{formateAmount(item?.removed_amount)}</Text>
                                        )
                                    }
                                </View>
                                <Text style={tw`text-xs text-gray-200 `}>Deposited amount = {formateAmount(item?.budget)}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                <AddDeductionButton event={() => {
                    navigation.navigate('AddAmountScreen', {type: 'addBudget'})
                }}/>
                <BottomSheet modalProps={{}} isVisible={isVisible}>
                    {list.map((l, i) => (
                    <ListItem
                        key={i}
                        containerStyle={l.containerStyle}
                        onPress={l.onPress}
                    >
                        <ListItem.Content>
                        <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                    ))}
                </BottomSheet>
            </View>
        </Container>
    )
}

export default HomeScreen