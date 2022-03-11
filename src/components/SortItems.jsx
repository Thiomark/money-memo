import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'

const button = (right = false) => `flex-1 flex items-center justify-center border-black ${right ? 'border-r' : ''}`

const text = () => `font-bold uppercase text-gray-50`

const SortItems = ({sortEvent}) => {
    return (
        <View style={[{backgroundColor: '#212121'}, tw`h-12 flex flex-row border-b border-black`]}>
            <View style={[tw `flex-1 h-full`]}/>
            <View style={[tw `flex-1 h-full border-l border-black flex flex-row`]}>
                <TouchableOpacity onPress={sortEvent} style={tw`${button(true)}`}>
                    <Text style={tw`${text()}`}>sort</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tw`${button()}`}>
                    <Text style={tw`${text()}`}>filter</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SortItems