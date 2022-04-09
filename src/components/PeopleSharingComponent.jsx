import { View, Text } from 'react-native'
import React from 'react'
import { formateAmount } from '../utils/helperFunctions'
import { Icon } from 'react-native-elements'
import tw from 'tailwind-react-native-classnames'

const PeopleSharingComponent = ({people, amount}) => {
    return (
        <View style={[tw`flex flex-row mt-2 p-1 rounded items-center justify-between`, {backgroundColor: '#2B2C33'}]}>
            <View style={tw`flex items-center flex-row`}>
                <Icon
                    name='people-circle-outline'
                    type='ionicon'
                    color='#107ab0'
                    size={30}
                />
                <Text style={tw`ml-2 font-bold uppercase text-gray-50 text-xs`}>Sharing between {people} people</Text>
            </View>
            <Text style={[tw`ml-2 font-bold text-xs text-yellow-500 p-1 px-2 rounded-md`, {backgroundColor: '#1A1B21'}]}>{formateAmount(amount)} each</Text>
        </View>
    )
}

export default PeopleSharingComponent