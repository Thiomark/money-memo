import { Text, View, TouchableOpacity, SectionList, Dimensions} from 'react-native';
import { formatDistanceToNow, format } from 'date-fns';
import { BottomSheet, ListItem } from 'react-native-elements';
import Container from '../shared/Container';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'tailwind-react-native-classnames';
import { BudgetContext } from '../providers/BudgetProvider';
import { DeductionContext } from '../providers/DeductionProvider';
import { AuthContext } from '../providers/AuthProvider';
import AddDeductionButton from '../components/AddDeductionButton';
import { getBudgetsDeductedAmount } from '../utils/helperFunctions';

const HomeScreen = ({navigation}) => {
    const {fetchBudgets, budgets, deleteBudget, addBudget} = useContext(BudgetContext);
    const {fetchLocalDeductions, storedDeductions} = useContext(DeductionContext);
    const {user} = useContext(AuthContext);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const list = [
        { 
            title: 'View Deductions',
            onPress: () => {
                fetchLocalDeductions(selectedItem.id)
                navigation.navigate('Deductions', {id: selectedItem?.id, amount: selectedItem?.budget});
            }
        },
        { 
            title: 'Add User',
            onPress: () => {
                if(!user) 
                    navigation.navigate('Auth');
                else
                    navigation.navigate('AddPeopleScreen', {id: selectedItem.id});
            }
        },
        { 
            title: 'Delete',
            onPress: () => {
                deleteBudget(selectedItem.id);
                setIsVisible(false);
                setSelectedItem(null);
            }
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
        setIsFetching(false);
    }, [user]);

    return (
        <Container sides={1}>
            <View style={tw`h-full relative`}>
                <SectionList 
                    isFetching={isFetching}
                    onRefresh={() => { 
                        fetchBudgets();
                        setIsFetching(false);
                    }}
                    refreshing={isFetching}
                    sections={budgets}
                    keyExtractor={(item, index) => index.toString()}
                    renderSectionHeader={({ section: { group } }) => (
                        <View style={tw`flex flex-row items-center justify-between`}>
                            <Text style={tw`text-gray-300 pl-2 font-bold pb-2 pt-4 uppercase text-xs`}>{formatDistanceToNow(new Date(group), {addSuffix: true})}</Text>
                            <Text style={tw`text-gray-300 pr-2 font-bold pb-2 pt-4 uppercase text-xs`}>{format(new Date(group), 'PP')}</Text>
                        </View>
                    )}
                    renderItem={({item}) => (
                        <TouchableOpacity 
                            onPress={() => {
                                fetchLocalDeductions(item.id)
                                navigation.navigate('Deductions', {id: item.id, amount: item.budget});
                            }} 
                            onLongPress={() => {
                                setSelectedItem(item)
                                setIsVisible(true);
                            }} 
                            key={item.id} style={[tw`p-2 rounded mb-1 flex flex-row items-center justify-between`, {backgroundColor: '#1A1B21'}]}
                        >
                            <View style={tw`flex-1`}>
                                <View style={tw`flex flex-row items-center justify-between`}>
                                    <View style={tw`flex items-center flex-row`}>
                                        <Text style={tw`text-green-300 font-bold`}>{item.remaining_amount && formateAmount(item.budget + storedDeductions.filter(bg => bg.budgets_id === item.id).reduce((a, b) => b.amount + a, 0))}</Text>
                                        {
                                            !item.user_id && (
                                                <View style={tw`h-2 w-2 ml-2 rounded-full bg-yellow-500`}/>
                                            )
                                        }
                                    </View>
                                    
                                    {
                                        storedDeductions.filter(bg => bg.budgets_id === item.id).reduce((a, b) => b.amount + a, 0) < 0 && (
                                            <Text style={tw`text-red-500 text-xs font-bold`}>{getBudgetsDeductedAmount(storedDeductions, item.id, false)}</Text>
                                        )
                                    }
                                </View>
                                <Text style={tw`text-xs text-gray-200`}>initial amount = {formateAmount(item?.budget)}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                <AddDeductionButton event={() => {
                    navigation.navigate('AddAmountScreen', {type: 'addBudget'})
                }}/>
                <BottomSheet modalProps={{}} isVisible={isVisible}>
                    {
                        !selectedItem?.user_id && (
                            <ListItem
                                onPress={() => {
                                    setIsVisible(false);
                                    setSelectedItem(null);
                                    if(!user) return navigation.navigate('Auth');
                                    addBudget(selectedItem, true)
                                }}
                            >
                                <ListItem.Content>
                                    <ListItem.Title>Save to server</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        )
                    }
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