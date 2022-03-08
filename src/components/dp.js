import { Text, View, TouchableOpacity, SectionList, Alert } from 'react-native';
import { format } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import Container from '../shared/Container';
import tw from 'tailwind-react-native-classnames';
import { DeductionContext } from '../providers/DeductionProvider';
import AddDeductionButton from '../components/AddDeductionButton';
import { Icon, Image } from 'react-native-elements';
import { formateAmount } from '../utils/helperFunctions';

const IconButton = ({name, size = 25, color='white', event}) => {
    return (
        <TouchableOpacity onPress={event} style={[{height: 35, width: 35}, tw`flex flex-row items-center justify-center`]}>
            <Icon 
                name={name}
                type='ionicon'
                color={color}
                size={size}
            />
        </TouchableOpacity>
    )
}

const DeductionsScreen = ({navigation}) => {
    const {fetchDeductions, deductions, deleteDeduction, fetchedDeductions, removeDeductions, url} = useContext(DeductionContext);
    const [selectedItem, setSelectedItem] = useState(null);
    const [allSelectedItems, setAllSelectedItems] = useState([])
    const {params} = useRoute();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        fetchDeductions(params.id);
    }, [])

    useEffect(() => {
        if(allSelectedItems.length === 1){
            setSelectedItem(allSelectedItems[0])
        }
    }, [allSelectedItems])
    
    return (
        <Container sides={0}>
            {
                allSelectedItems.length > 0 && (
                    <View style={[tw`h-16 -mt-2 flex items-center justify-between px-3 flex-row`, {backgroundColor: '#212121'}]}>
                        <IconButton event={() => {
                            setAllSelectedItems([])
                        }} name='close-outline' size={35}/>
                        <IconButton color='orange' name='pricetag-outline'/>
                        {
                            allSelectedItems.length === 1 &&
                            (
                                <IconButton name='eye-outline' event={() => {
                                    
                                }}/>
                            )
                        }
                        {
                            allSelectedItems.length === 1 &&
                            (
                                <IconButton name='trash-outline' color='red' event={() => {
                                    setAllSelectedItems([])
                                    deleteDeduction(params.id, selectedItem)
                                }}/>
                            )
                        }
                    </View>
                )
            }
            <View style={tw`flex flex-1 px-1 relative`}>
                {/* <View 
                    style={[tw`absolute top-0 bottom-0 w-full flex items-center justify-center`, {elevation: 20}]}
                    onPress={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <View style={[tw`p-2 rounded bg-gray-200`, {width: '90%'}]}>
                        <Text>hhshs</Text>
                    </View>
                </View> */}
                {/* <View style={[tw`absolute top-0 bottom-0 w-full flex items-center justify-center bg-black`, {elevation: 10}]} /> */}
                {fetchedDeductions.length === 0 ? (
                    <View style={tw`flex-1 flex items-center justify-center`}>
                        <Text style={tw`text-gray-50 uppercase font-bold text-xs`}>No deductions</Text>
                    </View>
                    
                ) : (
                    <SectionList 
                        isFetching={isFetching}
                        onRefresh={() => fetchDeductions(params.id)}
                        refreshing={isFetching}
                        sections={deductions} 
                        style={tw`flex-1 h-full`}
                        keyExtractor={(item, index) => index}
                        renderSectionHeader={({ section: { group } }) => (
                            <Text style={tw`text-gray-300 pl-2 font-bold pb-2 pt-4 uppercase text-xs`}>{format(new Date(group), 'PP')}</Text>
                        )}
                        renderItem={({item}) => (
                            <TouchableOpacity 
                                onLongPress={() => {
                                    if(allSelectedItems.length === 0){
                                        setAllSelectedItems(prev => [...prev, item.id])
                                    }
                                }} 
                                onPress={() => {
                                    if(allSelectedItems.length === 0){
                                        navigation.navigate('SummaryScreen', {id: item.id, summary: item.description})
                                    }else{
                                        if(allSelectedItems.includes(item.id)){
                                            setAllSelectedItems(prev => prev.filter(tmx => tmx !== item.id))
                                        }else{
                                            setAllSelectedItems(prev => [...prev, item.id])
                                        }
                                    }
                                }} 
                                style={tw`mb-1`}
                            >
                                <View style={tw`flex flex-row`}>
                                    {
                                        allSelectedItems.includes(item?.id) && (
                                            <View style={tw`h-full w-10 flex`}>
                                                <View style={tw`flex-1 flex justify-center items-center`}>
                                                    <Icon
                                                        name='checkmark-circle-outline'
                                                        type='ionicon'
                                                        color='#234C6B'
                                                        size={30}
                                                    />
                                                </View>
                                            </View>
                                        )
                                    }
                                    
                                    <View style={[tw`flex flex-1 p-2 rounded items-center justify-between flex-row`, {backgroundColor: '#1A1B21'}]}>
                                        <View style={tw`flex-1`}>
                                            <View style={tw`flex flex-row items-center justify-between`}>
                                                <Text style={tw`font-bold pb-1 ${item.amount > 0 ? 'text-green-500' : 'text-red-400'}`}>R {item.amount}</Text>
                                                {
                                                    item.tags && (
                                                        <View style={tw`px-2 py-0.5 rounded-full bg-black border border-yellow-500 flex items-center justify-center`}>
                                                            <Text style={tw`font-semibold text-gray-50 text-xs`}>{item.tags}</Text>
                                                        </View>
                                                    )
                                                }
                                                
                                            </View>
                                            
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
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}
                {
                    allSelectedItems.length === 0 && (
                        <View>
                            {fetchedDeductions.length !== 0 && <View style={[tw`p-4 w-full`, {backgroundColor: '#313238', borderTopRightRadius: 0, borderTopLeftRadius: 0}]}>
                                <Text style={[tw`text-gray-50 font-bold`, {fontSize: 17}]}>Deducted Amount</Text>
                                <Text style={[tw`text-gray-50 font-bold pb-2 text-red-500`, {fontSize: 14}]}>{formateAmount(fetchedDeductions.reduce((a, b) => b.amount + a, 0) < 0 ? -fetchedDeductions.reduce((a, b) => b.amount + a, 0) : fetchedDeductions.reduce((a, b) => b.amount + a, 0))}</Text>
                            </View>}
                            <AddDeductionButton event={() => {
                                navigation.navigate('AddAmountScreen', {type: 'deductAmount', budgetsID: params.id})
                            }}/>
                        </View>
                    )
                }
            </View>
        </Container>
    )
}

export default DeductionsScreen

/*a

                       Alert.alert(  
                                    null,  
                                    'Do you wish to delete the selected deduction?',  
                                    [   
                                        {  
                                            text: 'Cancel', 
                                            style: 'cancel',  
                                        },  
                                        {   
                                            text: 'Yes', 
                                            onPress: () => deleteDeduction(params.id, item.id)
                                        },  
                                    ],  
                                    {cancelable: false}  
                                )  
*/


import { View, Text, ActivityIndicator, SafeAreaView, ScrollView, TouchableOpacity, Button } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Container from '../shared/Container';
import tw from 'tailwind-react-native-classnames';
import { Image } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import { DeductionContext } from '../providers/DeductionProvider';
import * as ImagePicker from 'expo-image-picker';

const SummaryScreen = ({navigation}) => {
    const {deduction, fetchDeduction, url, uploadImage, removeDeduction} = useContext(DeductionContext);
    const {params} = useRoute();
    const [image, setImage] = useState(null)

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    useEffect(() => {
        fetchDeduction(params.id)
        return () => {
            removeDeduction()
        }
    }, [params]);

    useEffect(() => {
        if(deduction?.image){
            setImage(`${url}/images/${deduction.image}`)
        }
    }, [deduction?.image]);
    
    return (
        <Container>
            {deduction && (
                <SafeAreaView>
                    <ScrollView>
                        <View>
                            {image && (
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('ImageScreen', {id: deduction.id, image})
                                }} style={tw`p-2`}>
                                    <Image
                                        source={{ uri: image }}
                                        style={tw`rounded`}
                                        resizeMode="contain"
                                        containerStyle={[tw`w-full`], {height: 300}}
                                    />
                                </TouchableOpacity>
                            )}
                            <View style={tw`pb-2 px-2`}>
                                <Text style={tw`font-bold text-lg text-gray-100`}>{deduction.amount > 0 ? 'Added amount' : 'Removed amount'}</Text>
                                <Text style={tw`text-gray-300`}>R {deduction.amount < 0 ? -deduction.amount : deduction.amount}</Text>
                            </View>
                            <View style={tw`pb-2 px-2`}>
                                <Text style={tw`font-bold text-lg text-gray-100`}>Description</Text>
                                <Text style={tw`text-gray-300`}>{deduction.description}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )}
            {/* {!deduction?.image
                && (
                    <View style={tw`flex flex-row px-2`}>
                        <TouchableOpacity 
                            onPress={pickImage}
                            style={tw`flex flex-1 items-center rounded mr-0.5 mt-4 justify-center bg-blue-500`}
                        >
                            <Text style={tw`text-white font-bold p-3`}>Add Image</Text>
                        </TouchableOpacity>
                        {
                            image && (
                                <TouchableOpacity 
                                    onPress={() => [
                                        uploadImage(deduction.id, {image})
                                    ]}
                                    style={tw`flex flex-1 items-center rounded ml-0.5 mt-4 justify-center bg-green-500`}
                                >
                                    <Text style={tw`text-white font-bold p-3`}>Upload Image</Text>
                                </TouchableOpacity>
                            )
                        }
                        
                    </View>
                )
            } */}
        </Container>
    )
}

export default SummaryScreen