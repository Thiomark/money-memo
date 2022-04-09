import { Text, View, SectionList, TextInput, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import Container from '../shared/Container';
import { DeductionContext } from '../providers/DeductionProvider';
import DeductionCardComponent from '../components/DeductionCardComponent';
import tw from 'tailwind-react-native-classnames';
import AddDeductionButton from '../components/AddDeductionButton';
import SelectDeduction from '../components/SelectDeduction';
import { AuthContext } from '../providers/AuthProvider';
import { getBudgetsDeductedAmount } from '../utils/helperFunctions';
import SortItems from '../components/SortItems';
import {colors} from '../utils/colors'
import { Icon } from 'react-native-elements';

const DeductionsScreen = ({navigation}) => {
    const {fetchServerDeductions, deductions, sortByDate, controlSortBy, deleteDeduction, fetchSingleDeduction, fetchLocalDeductions, archiveDeductions, storedDeductions, addDeduction} = useContext(DeductionContext);
    const [selectedDeductions, setSelectedDeductions] = useState([]);
    const { params } = useRoute();
    const [isFetching, setIsFetching] = useState(false);
    const [filterResults, setFilterResults] = useState(false);
    const [forOnePerson, setForOnePerson] = useState(false);
    const {user} = useContext(AuthContext);

    useEffect(() => {
        fetchServerDeductions(params.id);
    }, []);
    
    return (
        <Container sides={0} topPadding={1}>
            {filterResults && (
                <View style={[tw`flex flex-row border-2 w-full h-12`, {borderColor: colors.cardBackgroundColor, backgroundColor: colors.cardBackgroundColor}]}>
                    <TextInput
                        autoCapitalize='none'
                        style={[tw`rounded px-4 bg-black text-gray-50 flex-1`]}
                        placeholder='search...'
                        onChangeText={text => {
                            fetchLocalDeductions(params.id, storedDeductions.filter(deduct => {
                                const regex = new RegExp(`${text}`, 'gi');
                                return deduct?.tags?.match(regex) || deduct?.description?.match(regex) || deduct?.amount.toString()?.match(regex);
                            }));
                        }}
                    />
                    <TouchableOpacity 
                        onPress={() => {
                            fetchLocalDeductions(params.id, storedDeductions)
                            setFilterResults(false)
                        }}
                        style={[tw`flex ml-1 h-full w-16 items-center justify-center rounded`]}>
                        <Icon 
                            type='ionicon'
                            size={25}
                            name='close-outline'
                            color='white'
                        />
                    </TouchableOpacity>
                </View>
            )}
            {
                deductions.length > 0 && !filterResults && (
                    <SortItems 
                        filterResults={() => setFilterResults(true)}
                        itemsCount={storedDeductions.filter(x => x.budgets_id === params.id).length} 
                        sortEvent={(() => controlSortBy(params.id))}
                    />)
            }
            {selectedDeductions.length > 0 && (
                <SelectDeduction 
                    selectedDeductions={selectedDeductions}
                    tageDeductions={() => {
                        setSelectedDeductions([]);
                        //archiveDeductions(params.id, selectedDeductions, true);
                    }}
                    upload={() => {
                        setSelectedDeductions([]);
                        if(!user) return navigation.navigate('Auth');
                        addDeduction(storedDeductions.filter(x => x.id === selectedDeductions[0])[0], params.id, true)
                    }}
                    canUpload={selectedDeductions.length === 1 && storedDeductions.filter(x => x.id === selectedDeductions[0])[0].sign}
                    cancelEvent={() => setSelectedDeductions([])}
                    deleteEvent={() => {
                        deleteDeduction(params.id, selectedDeductions[0], storedDeductions.find(x => x.id === selectedDeductions[0])?.image);
                        setSelectedDeductions([]);
                    }}
                    editEvent={() => {
                        if(selectedDeductions.length !== 1) return;
                        const tempArray = [];
                        deductions.forEach(element => {
                            tempArray.push(...element.data);
                        });
                        const [xitem] = tempArray.filter(x => x.id === selectedDeductions[0]);
                        navigation.navigate('AddAmountScreen', {type: 'deductAmount', edit: xitem, budgetsID: params.id});
                        setSelectedDeductions([]);
                    }}
                />
            )}
            {
                deductions.length === 0 ? (
                    <View style={tw`flex-1 flex justify-center`}>
                        <Text style={tw`text-center -mt-16 font-semibold text-gray-50`}>Click on the + button to {'\n'} add deductions</Text>
                    </View>
                ) : (
                    <View style={tw`flex-1`}>
                        <SectionList 
                            isFetching={isFetching}
                            onRefresh={() => fetchServerDeductions(params.id)} 
                            refreshing={isFetching}
                            sections={deductions} 
                            style={tw`flex-1 h-full`}
                            keyExtractor={(item, index) => index}
                            renderSectionHeader={({ section: { group, formatedDate } }) => {
                                return (
                                    <View style={tw`px-2`}>
                                        {sortByDate && formatedDate ? 
                                        (<View style={tw`flex flex-row items-center justify-between`}>
                                            <Text style={tw`text-gray-300 font-bold pb-2 pt-4 uppercase text-xs`}>{formatedDate?.distance}</Text>
                                            <Text style={tw`text-gray-300 font-bold pb-2 pt-4 uppercase text-xs`}>{formatedDate?.date}</Text>
                                        </View>) : (
                                            group === 'null' ? <View style={tw`mt-4`}/> :
                                                <Text style={tw`text-gray-300 font-bold pb-2 pt-4 uppercase text-xs`}>{group}</Text>
                                        )}
                                    </View>
                                )
                            }}
                            renderItem={({item}) => (
                                <DeductionCardComponent
                                    sortByDate={sortByDate ? false : true}
                                    navigation={navigation}
                                    viewDeduction={() => {
                                        fetchSingleDeduction(item.id);
                                        navigation.navigate('SummaryScreen', {summary: `R ${item.amount < 0 ? -item.amount : item.amount}`})
                                    }}
                                    removeDeduction={() => {
                                        setSelectedDeductions(prev => prev.filter(x => x !== item.id))
                                    }}
                                    isSelected={selectedDeductions.includes(item.id)} 
                                    pressAndHold={() => setSelectedDeductions(prev => [...prev, item.id])} 
                                    item={item}
                                    belongToUser={item.divide_by === 1 && item.user_id !== user.username && forOnePerson}
                                    areDeductionsSelected={selectedDeductions.length > 0}
                                />
                            )}
                        />
                    </View>
                )
            }
            {deductions.length > 0 && (
                <TouchableOpacity 
                    onPress={() => setForOnePerson(prev => !prev)}
                    style={[tw`p-4 w-full`, {backgroundColor: '#313238', borderTopRightRadius: 0, borderTopLeftRadius: 0}]}>
                    <Text style={[tw`text-gray-50 font-bold`, {fontSize: 17}]}>{forOnePerson ? 'My Share' : 'Deducted Amount'}</Text>
                    <Text style={[tw`text-gray-50 font-bold pb-2 text-red-500`, {fontSize: 14}]}>{getBudgetsDeductedAmount(storedDeductions, params.id, true, forOnePerson, user.username)}</Text>
                </TouchableOpacity>
            )}
            <AddDeductionButton event={() => {
                navigation.navigate('AddAmountScreen', {type: 'deductAmount', budgetsID: params.id, peopleToShareBetween: params.peopleToShareBetween})
            }}/>
        </Container>
    )
}

export default DeductionsScreen