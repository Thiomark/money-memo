import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Icon } from 'react-native-elements';
import {formateAmount} from '../utils/helperFunctions';
import { formatDistanceToNow } from 'date-fns'
import PeopleSharingComponent from './PeopleSharingComponent';

const DeductionCardComponent = ({item, isSelected, pressAndHold, viewDeduction, areDeductionsSelected, removeDeduction, navigation, sortByDate, belongToUser}) => {
    
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
                        <View style={tw`flex flex-row items-center justify-between mb-2`}>
                            <View style={tw`flex flex-row items-center`}>
                                <View style={tw`flex items-center flex-row`}>
                                    <Text style={tw`font-bold ${item.amount > 0 ? 'text-green-500' : 'text-red-400'}`}>{formateAmount(item.amount)}</Text>
                                    {
                                        item.sign && (
                                            <View style={tw`h-2 w-2 ml-2 rounded-full bg-yellow-500`}/>
                                        )
                                    }
                                </View>
                                {
                                    !sortByDate && item.tags ? (
                                        <View style={tw`px-2 ml-4 py-0.5 rounded-full bg-black border border-yellow-400 flex items-center justify-center`}>
                                            <Text style={tw`font-semibold text-gray-50 text-xs`}>{item.tags}</Text>
                                        </View>
                                    ) : (
                                        <Text style={tw`font-bold text-gray-400 text-xs ml-3 uppercase`}>{formatDistanceToNow(new Date(item.created_on), {addSuffix: true})}</Text>
                                    )
                                }
                            </View>
                            {
                                belongToUser && <Icon
                                    name='alert-circle-outline'
                                    type='ionicon'
                                    color='red'
                                    size={30}
                                />
                            }
                        </View>
                        {item.description && <Text style={tw`text-gray-300 text-xs`}>{item.description}</Text>}
                        {
                            item.divide_by > 1 && <PeopleSharingComponent people={item.divide_by} amount={item.amount > 0 ? item.amount / item.divide_by : -item.amount / item.divide_by} />
                        }
                    </View>
                    {item?.image && (
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('ImageScreen', { image: item.image })}
                            style={tw`h-10 w-10 ml-2 rounded border border-gray-500`}
                        >
                            <Image source={{ uri: item.image }} style={[tw`flex-1 w-full rounded `, { width: '100%', height: '100%' }]} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default DeductionCardComponent