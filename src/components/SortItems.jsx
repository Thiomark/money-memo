import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'
import { Icon } from 'react-native-elements'

const button = (right = false) => `flex-1 flex flex-row items-center justify-center border-black ${right ? 'border-r' : ''}`

const text = (style) => `font-bold uppercase text-gray-50 ${style ? style : ''}`

const SortItems = ({sortEvent, itemsCount, filterResults}) => {
    return (
        <View style={[{backgroundColor: '#212121'}, tw`h-8 flex flex-row border-b border-black`]}>
            <View style={[tw `flex-1 h-full flex items-center justify-center`]}>
                <Text style={tw`${text()} text-xs`}>Items {`Items (${itemsCount})`}</Text>
            </View>
            <View style={[tw `flex-1 h-full border-l border-black flex flex-row`]}>
                <TouchableOpacity onPress={sortEvent} style={tw`${button(true)}`}>
                    <Icon 
                        name='funnel-outline'
                        type='ionicon'
                        color='white'
                        size={14}
                    />
                    <Text style={tw`${text('ml-1')}`}>sort</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={filterResults} style={tw`${button()}`}>
                    <Icon 
                        name='filter-outline'
                        type='ionicon'
                        color='white'
                        size={20}
                    />
                    <Text style={tw`${text('ml-1')}`}>filter</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SortItems