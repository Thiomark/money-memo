import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Text, View, Dimensions, TextInput, ActivityIndicator, StyleSheet } from "react-native";
import tw from 'tailwind-react-native-classnames';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from "../providers/AuthProvider";
import Wrapper from "../shared/Container";
import { Icon } from "react-native-elements";

const Stack = createNativeStackNavigator();
const {width} = Dimensions.get('screen');

const SubmitSection = ({navigate, credentials}) => {
    const { login, register, isSubmitting } = useContext(AuthContext);
    const route = useRoute();

    const disable = () => {
        if(!credentials?.email || !credentials?.password || isSubmitting || (route.name === 'Register' && !credentials.name)) return true
        return false;
    }

    return (
        <View style={[{width}, tw`absolute flex items-center px-4 bottom-5 w-full`]}>
            <View style={tw`pb-6 flex flex-row items-center justify-center`}>
                <Text style={tw`text-gray-400 pr-1`}>{route.name === 'Login' ? "Don't have" : "Have"} an account?</Text>
                <TouchableOpacity
                    disabled={isSubmitting}
                    onPress={() => {
                        if(route.name === 'Login') return navigate('Register');
                        navigate('Login');
                    }}
                ><Text style={tw`text-white font-bold`}>{route.name === 'Login' ? 'Register' : 'Login'}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
                style={tw` ${disable() ? 'bg-gray-400' : 'bg-gray-50'} w-full h-14 rounded-xl flex items-center justify-center`}
                disabled={disable()}
                onPress={() => {
                    if(route.name === 'Login') return login(credentials);
                    else register(credentials);
                }}
            >
            {isSubmitting ? (
                    <ActivityIndicator size="small" color="#0086F1" />
                ) : (
                    <Text style={[{fontSize: 15}, tw`font-bold text-gray-800`]}>{route.name === 'Login' ? 'Sign In' : 'Sign Up'}</Text>
                )
            }
        </TouchableOpacity>
        </View>
    )
}


const Auth = ({ navigation }) => {

    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null)
    const [password, setPassword] = useState(null);
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const { user } = useContext(AuthContext);
    const route = useRoute();

    useEffect(() => {
        if(user) navigation.navigate('App');
    }, [user])
    

    return(
        <Wrapper x={0}>
            <View
                style={{flex: 1, justifyContent: "center", backgroundColor: '#0E0E10'}}
            >
                <View style={[{padding: 20, top: '20%'}, tw`absolute w-full`]}>
                    {
                        route.name === 'Login' ? (
                            <Text style={tw`font-bold text-3xl pb-10 text-gray-50`}>Welcome back. {'\n'}You've been missed!</Text>
                        ) : (
                            <Text style={tw`font-bold text-3xl pb-10 text-gray-50 text-center`}>Create an account</Text>
                        )
                    }
                    
                    <TextInput
                        autoCapitalize='none'
                        style={[style.input, tw`${inputStyle('mb-3')}`]}
                        placeholder={route.name === 'Login' ? 'Phone, email or username' : 'Email'}
                        onChangeText={text => setEmail(text.trim())}
                        placeholderTextColor={style.foreGround.color} 
                    />
                    {
                        route.name === 'Register' && (
                            <TextInput
                                style={[style.input, tw`${inputStyle('mb-3')}`]}
                                placeholder='Name'
                                onChangeText={text => setName(text)}
                                placeholderTextColor={style.foreGround.color} 
                            />
                        )
                    }
                    <View 
                        style={[style.input, tw`${inputStyle('')} pr-2 items-center flex-row flex w-full flex-1`]}
                    >
                        <TextInput
                            secureTextEntry={secureTextEntry}
                            style={[style.input, tw`w-full flex-1`]}
                            placeholder='Password'
                            onChangeText={text => setPassword(text.trim())}
                            placeholderTextColor={style.foreGround.color} 
                        />
                        <TouchableOpacity 
                            onPress={() => setSecureTextEntry(!secureTextEntry)}
                            style={[{borderColor: style.input.borderColor, height: 24, width: 24, elevation: 10}, tw`rounded flex items-center justify-center border`]}>
                            <Icon 
                                color={style.input.borderColor}
                                name='eye-outline'
                                type="ionicon"
                                size={18}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <SubmitSection credentials={{email, password, name}} navigate={navigation.navigate}/>
            </View>
        </Wrapper>
    )
}

const AuthStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Login' 
                component={Auth}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name='Register' 
                component={Auth}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};


export default AuthStack

const inputStyle = (last) => `${last} p-3.5 border-2 rounded-xl `;

const style = StyleSheet.create({
    input: {
        backgroundColor: '#1E1C24',
        borderColor: '#3A3943',
        color: '#9394A0'
    },
    foreGround: {
        color: '#9394A0'
    }
})