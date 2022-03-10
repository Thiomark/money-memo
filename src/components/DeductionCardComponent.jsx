import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect } from 'react'
import tw from 'tailwind-react-native-classnames'
import { Icon } from 'react-native-elements'
import { DeductionContext } from '../providers/DeductionProvider'

const DeductionCardComponent = ({item, isSelected, pressAndHold, viewDeduction, areDeductionsSelected, removeDeduction, navigation}) => {
    const {firestoreImages} = useContext(DeductionContext);

    const returnImage = (image) => {
        const xr = firestoreImages.find(xx => xx.name === image);
        if(xr) return xr.url
        return false
    }
    
    return (
        <TouchableOpacity 
            style={tw`mb-1`}
            onLongPress={pressAndHold}
            onPress={() => {
                if(areDeductionsSelected){
                    if(isSelected) removeDeduction()
                    else pressAndHold() 
                }else{
                    viewDeduction()
                }
            }}
        >
            <View style={tw`flex flex-row`}>
                {isSelected && (
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
                )}
                <View style={[tw`flex flex-1 p-2 rounded items-center justify-between flex-row`, {backgroundColor: '#1A1B21'}]}>
                    <View style={tw`flex-1`}>
                        <View style={tw`flex flex-row items-center justify-between`}>
                            
                            <View style={tw`flex items-center flex-row`}>
                                <Text style={tw`font-bold pb-1 ${item.amount > 0 ? 'text-green-500' : 'text-red-400'}`}>R {item.amount}</Text>
                                {
                                    item.sign && (
                                        <View style={tw`h-2 w-2 ml-2 rounded-full bg-yellow-500`}/>
                                    )
                                }
                            </View>
                            {
                                item.tags && (
                                    <View style={tw`px-2 py-0.5 rounded-full bg-black border border-yellow-500 flex items-center justify-center`}>
                                        <Text style={tw`font-semibold text-gray-50 text-xs`}>{item.tags}</Text>
                                    </View>
                                )
                            }
                        </View>
                        {item.description && <Text style={tw`text-gray-300 text-xs`}>{item.description}</Text>}
                    </View>
                    {returnImage(item.image) && (
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('ImageScreen', { image: returnImage(item.image) })}
                            style={tw`h-10 w-10 ml-2 rounded border border-gray-500`}
                        >
                            <Image source={{ uri: returnImage(item.image) }} style={[tw`flex-1 w-full rounded `, { width: '100%', height: '100%' }]} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default DeductionCardComponent