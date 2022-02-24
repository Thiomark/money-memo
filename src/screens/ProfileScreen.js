import { View, Text } from 'react-native'
import React from 'react'
import tw from 'tailwind-react-native-classnames'
import Container from '../shared/Container'

const ProfileScreen = () => {
    return (
        <Container sides={1}>
            <Text style={tw`text-gray-50`}>ProfileScreen</Text>
        </Container>
    )
}

export default ProfileScreen