import { Text, SafeAreaView, TextInput, TouchableOpacity, View } from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Container from '../shared/Container';
import tw from 'tailwind-react-native-classnames';
import { useRoute } from '@react-navigation/native';
import { BudgetContext } from '../providers/BudgetProvider';

const AddAmountScreen = ({}) => {
    const [user, setUser] = useState(null);
    const {addUser} = useContext(BudgetContext)
    const {params} = useRoute();

    return (
        <Container>
            <SafeAreaView style={tw`p-2 flex-1`}>
                <View style={tw`flex-1`}>
                    <TextInput
                        style={[tw`rounded bg-gray-400 mb-1 text-black p-3`]}
                        onChangeText={setUser}
                        placeholder="Enter the user's username"
                    />
                </View>
                <TouchableOpacity onPress={() => {
                    addUser(params.id, user);
                }} style={[{backgroundColor: '#313238'}, tw`h-12 flex items-center justify-center rounded-lg`]}>
                    <Text style={tw`font-bold text-gray-50 uppercase`}>Add User</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </Container>
    )
}


export default AddAmountScreen