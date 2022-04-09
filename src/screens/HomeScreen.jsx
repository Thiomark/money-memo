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
import { getBudgetsDeductedAmount, formateAmount } from '../utils/helperFunctions';
import PeopleSharingComponent from '../components/PeopleSharingComponent';

const HomeScreen = ({navigation}) => {
    const {fetchBudgets, budgets, deleteBudget, addBudget, archiveBudget} = useContext(BudgetContext);
    const {fetchLocalDeductions, storedDeductions, deleteBudgetDeductions} = useContext(DeductionContext);
    const {user} = useContext(AuthContext);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const getRemaingAmount = (item) => {
        const filteredStoredDeductions = storedDeductions.filter(x => x.budgets_id === item.id);
        return item?.remaining_amount && filteredStoredDeductions.length === 0 ? formateAmount(item.remaining_amount) : formateAmount(Number(item.budget) + filteredStoredDeductions.reduce((a, b) => b.amount + a, 0))
    }

    const [isVisible, setIsVisible] = useState(false);
    const list = [
        { 
            title: 'Edit Budget',
            onPress: () => {
                setSelectedItem(null);
                setIsVisible(false);
                navigation.navigate('AddAmountScreen', {type: 'addBudget', edit: selectedItem});
            }
        },
        { 
            title: selectedItem?.archived ? 'Un Archive' : 'Archive',
            onPress: () => {
                setSelectedItem(null);
                setIsVisible(false);
                archiveBudget(selectedItem);
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
                deleteBudgetDeductions(selectedItem.id);
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
                                navigation.navigate('Deductions', {id: item.id, amount: item.budget, remaining_amount: getRemaingAmount(item), peopleToShareBetween: item.divide_by});
                            }} 
                            onLongPress={() => {
                                setSelectedItem(item)
                                setIsVisible(true);
                            }} 
                            key={item.id} style={[tw`p-2 rounded mb-1 flex flex-row items-center justify-between`, {backgroundColor: '#1A1B21'}]}
                        >
                            <View style={tw`flex-1`}>
                                {
                                   item?.recuring && <Text style={tw`text-blue-200 font-bold uppercase text-xs self-end`}>recuring every month on 20th</Text>
                                }
                                
                                <View style={tw`flex flex-row items-center justify-between`}>
                                    <View style={tw`flex items-center flex-row`}>
                                        <Text style={tw`text-green-300 font-bold`}>{getRemaingAmount(item)}</Text>
                                        {
                                            !item.user_id && (
                                                <View style={tw`h-2 w-2 ml-2 rounded-full bg-yellow-500`}/>
                                            )
                                        }
                                    </View>
                                    {
                                        (storedDeductions.filter(bg => bg.budgets_id === item.id).reduce((a, b) => Number(b.amount) + a, 0) < 0 || Number(item?.remaining_amount) < Number(item.budget)) && (
                                            <Text style={tw`text-red-500 text-xs font-bold`}>{item?.remaining_amount ? formateAmount(Number(item.budget) - Number(item.remaining_amount)) : getBudgetsDeductedAmount(storedDeductions, item.id, false)}</Text>
                                        )
                                    }
                                </View>
                                <Text style={tw`text-xs text-gray-200`}>initial amount = {formateAmount(item?.budget)}</Text>
                                {
                                    item.description && <Text style={tw`text-xs text-gray-400 mt-2`}>{item.description}</Text>
                                }
                                {item.divide_by > 1 && <PeopleSharingComponent people={item.divide_by} amount={item.budget / item.divide_by} />}
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