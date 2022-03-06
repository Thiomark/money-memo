import { Text, TouchableOpacity, View } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Container from '../shared/Container';

const ProfileScreen = () => {
    return (
        <Container sides={1}>
            <View style={tw`flex-1 relative flex items-center justify-center`}>
                <Text style={tw`font-bold text-gray-50`}>No Account</Text>
            </View>
            <TouchableOpacity style={[{backgroundColor: '#212121'}, tw`rounded py-3 my-2 flex items-center justify-center w-full`]}>
                <Text style={tw`font-bold text-gray-50`}>Log in</Text>
            </TouchableOpacity>
        </Container>
    )
}

export default ProfileScreen