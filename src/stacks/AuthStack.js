import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImageBackground, TouchableOpacity } from 'react-native';
import { Text, View, Dimensions, TextInput, ActivityIndicator } from "react-native";
import tw from 'tailwind-react-native-classnames';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from "../providers/AuthProvider";
import Wrapper from "../shared/Container";

const Stack = createNativeStackNavigator();
const {width, height} = Dimensions.get('screen');

const RouteButton = ({navigate, button }) => {
    const { isSubmitting } = useContext(AuthContext);

    return (
        <TouchableOpacity
            disabled={isSubmitting}
            onPress={() => {
                navigate(button);
            }}
        ><Text style={tw`text-white font-bold`}>{button}</Text></TouchableOpacity>
    )
}

const SubmitButton = ({ button, submit, disabled }) => {
    const { isSubmitting } = useContext(AuthContext);

    return (
        <TouchableOpacity 
            style={tw` ${!disabled ? 'bg-gray-50' : 'bg-gray-400'} w-full h-14 rounded-xl flex items-center justify-center`}
            disabled={isSubmitting || disabled}
            onPress={() => {
                submit();
            }}
        >
            {isSubmitting ? (
                    <ActivityIndicator size="small" color="#0086F1" />
                ) : (
                    <Text style={[{fontSize: 15}, tw`font-bold text-gray-800`]}>{button}</Text>
                )
            }
        </TouchableOpacity>
    )
}

const Auth = ({ navigation }) => {

    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null)
    const [password, setPassword] = useState(null);
    const { login, register, user } = useContext(AuthContext);

    const route = useRoute();

    useEffect(() => {
        if(user) navigation.navigate('App');
    }, [user])
    

    return(
        <Wrapper x={0}>
            <ImageBackground
                resizeMode='cover'
                style={{flex: 1, justifyContent: "center"}}
                source={
                    route.name === 'Login' ?
                    require('../../assets/image_processing20211123-13917-3pc0j8.png') :
                    require('../../assets/7d5a98edbd3e3719c6d446c9023f30cf.png')
                }
            >
                <View style={[tw`bg-black opacity-30`, {flex: 1, height, width}]}>
                </View>
                <View style={[{padding: 20, top: '20%'}, tw`absolute w-full`]}>
                    <TextInput
                        style={[tw`border-gray-500 bg-black mb-3 p-4 border text-white rounded-lg`]}
                        placeholder='Email'
                        onChangeText={text => setEmail(text)}
                        placeholderTextColor="white" 
                    />
                    {
                        route.name === 'Register' && (
                            <TextInput
                                style={[tw`border-gray-500 bg-black mb-3 p-4 border text-white rounded-lg`]}
                                placeholder='Name'
                                onChangeText={text => setName(text)}
                                placeholderTextColor="white" 
                            />
                        )
                    }
                    
                    <TextInput
                        style={[tw`border-gray-500 bg-black mb-3 p-4 border text-white rounded-lg`]}
                        placeholder='Password'
                        onChangeText={text => setPassword(text)}
                        placeholderTextColor="white" 
                    />
                </View>
                <View style={[{width}, tw`absolute flex items-center px-4 bottom-5 w-full`]}>
                    <View style={tw`pb-6 flex flex-row items-center justify-center`}>
                        <Text style={tw`text-gray-400 pr-1`}>{route.name === 'Login' ? "Don't have" : "Have"} an account?</Text>
                        {
                            route.name === 'Login' ? ( 
                                <RouteButton navigate={navigation.navigate} button='Register'/> 
                                ) : (
                                <RouteButton navigate={navigation.navigate} button='Login'/> 
                            )
                        }
                        
                    </View>
                    {
                        route.name === 'Login' ? (
                            <SubmitButton disabled={!email || !password} submit={() => login({email, password})} button='Sign In' />
                        ) : (
                            <SubmitButton disabled={!email || !password || !name} submit={() => register(email, name, password)} button='Sign Up' />
                        )
                    }
                </View>
            </ImageBackground>
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