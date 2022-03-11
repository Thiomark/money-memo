import { Text, View, TouchableOpacity, SectionList, Alert } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRoute } from '@react-navigation/native';
import Container from '../shared/Container';
import { DeductionContext } from '../providers/DeductionProvider';
import DeductionCardComponent from '../components/DeductionCardComponent';
import tw from 'tailwind-react-native-classnames';
import AddDeductionButton from '../components/AddDeductionButton';
import SelectDeduction from '../components/SelectDeduction';
import { AuthContext } from '../providers/AuthProvider';
import { formateAmount, getBudgetsDeductedAmount } from '../utils/helperFunctions';
import SortItems from '../components/SortItems';

const DeductionsScreen = ({navigation}) => {
    const {fetchServerDeductions, deductions, fetchImages, fetchLocalDeductions, deleteDeduction, fetchSingleDeduction, tagOtherDeductions, storedDeductions, addDeduction} = useContext(DeductionContext);
    const [selectedDeductions, setSelectedDeductions] = useState([]);
    const { params } = useRoute();
    const [isFetching, setIsFetching] = useState(false);
    const {user} = useContext(AuthContext);
    const [sortByDate, setSortByDate] = useState(false)

    useEffect(() => {
        fetchServerDeductions(params.id);
        fetchImages(params.id);
    }, []);

    useEffect(() => {
        fetchLocalDeductions(params.id, storedDeductions, sortByDate ? 'created_on': 'tags')
    }, [sortByDate])
    
    return (
        <Container sides={0} topPadding={1}>
            <SortItems sortEvent={() => {
                return;
                setSortByDate(prev => !prev)
            }}/>
            {selectedDeductions.length > 0 && (
                <SelectDeduction 
                    selectedDeductions={selectedDeductions}
                    tageDeductions={() => {
                        setSelectedDeductions([]);
                        tagOtherDeductions(storedDeductions.filter(x => x.id === selectedDeductions[0])[0])
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
                            renderSectionHeader={({ section: { group } }) => (
                                <Text style={tw`text-gray-300 pl-2 font-bold pb-2 pt-4 uppercase text-xs`}>{sortByDate ?  group : group}</Text>
                            )}
                            renderItem={({item}) => (
                                <DeductionCardComponent
                                    sortByDate={sortByDate}
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
                                    areDeductionsSelected={selectedDeductions.length > 0}
                                />
                            )}
                        />
                    </View>
                )
            }
            <View style={[tw`p-4 w-full`, {backgroundColor: '#313238', borderTopRightRadius: 0, borderTopLeftRadius: 0}]}>
                <Text style={[tw`text-gray-50 font-bold`, {fontSize: 17}]}>Deducted Amount</Text>
                <Text style={[tw`text-gray-50 font-bold pb-2 text-red-500`, {fontSize: 14}]}>{getBudgetsDeductedAmount(storedDeductions, params.id)}</Text>
            </View>
            <AddDeductionButton event={() => {
                navigation.navigate('AddAmountScreen', {type: 'deductAmount', budgetsID: params.id})
            }}/>
        </Container>
    )
}

export default DeductionsScreen