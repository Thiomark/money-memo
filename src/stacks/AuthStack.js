import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ImageBackground, TouchableOpacity } from 'react-native';
import { Text, View, Dimensions, TextInput, ActivityIndicator } from "react-native";
import tw from 'tailwind-react-native-classnames';
import {useRoute} from '@react-navigation/native';
import { AuthContext } from "../src/AuthProvider";
import Wrapper from "../shared/Wrapper";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const SubmitButton = ({ button, submit }) => {
    const { isSubmitting } = useContext(AuthContext);

    return (
        <TouchableOpacity 
            style={tw`bg-gray-50 w-full h-14 rounded-xl flex items-center justify-center`}
            disabled={isSubmitting}
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

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [url, setUrl] = useState(null);
    const { login, register } = useContext(AuthContext);

    useEffect(() => {
        AsyncStorage.getItem('url')
            .then(res => setUrl(res.replaceAll('http://', '').replaceAll(':5500', '')))
            .catch(err => {});  
    }, [])

    const route = useRoute();

    return(
        <Wrapper x={0}>
            <ImageBackground
                resizeMode='cover'
                style={{flex: 1, justifyContent: "center"}}
                source={
                    route.name === 'Login' ?
                    require('../assets/image_processing20211123-13917-3pc0j8.png') :
                    require('../assets/7d5a98edbd3e3719c6d446c9023f30cf.png')
                }
            >
                <View style={[tw`bg-black opacity-30`, {flex: 1, height, width}]}>
                </View>
                <View style={[{padding: 20, top: '20%'}, tw`absolute w-full`]}>
                    <TextInput
                        style={[tw`border-gray-500 bg-black mb-3 p-4 border text-white rounded-lg`]}
                        placeholder='Username'
                        onChangeText={text => setUsername(text)}
                        placeholderTextColor="white" 
                    />
                    <TextInput
                        style={[tw`border-gray-500 bg-black mb-3 p-4 border text-white rounded-lg`]}
                        placeholder='Password'
                        onChangeText={text => setPassword(text)}
                        placeholderTextColor="white" 
                    />
                    <TextInput
                        style={[tw`border-gray-500 bg-black p-4 border text-white rounded-lg`]}
                        placeholder='Url'
                        value={url}
                        onChangeText={text => setUrl(text)}
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
                            <SubmitButton submit={() => login(username, password, url)} button='Sign In' />
                        ) : (
                            <SubmitButton submit={() => register(username, password, url)} button='Sign Up' />
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