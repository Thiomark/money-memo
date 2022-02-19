import { Text, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'

const AddDeductionButton = ({event}) => {
    return (
        <TouchableOpacity onPress={event} style={tw`h-12 w-12 absolute bottom-4 right-4 flex items-center justify-center bg-blue-500 rounded-full`}>
            <Text style={tw`text-gray-50 text-2xl`}>+</Text>
        </TouchableOpacity>
    )
}

export default AddDeductionButton