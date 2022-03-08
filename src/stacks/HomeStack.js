import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import HomeScreen from '../screens/HomeScreen';
import DeductionsScreen from '../screens/DeductionsScreen';
import SummaryScreen from '../screens/SummaryScreen';
import ImageScreen from '../screens/ImageScreen';
import AddAmountScreen from '../screens/AddAmountScreen';
import AddPeopleScreen from '../screens/AddPeopleScreen'
import CameraScreen from '../screens/CameraScreen';
import ImagePickerScreen from '../screens/ImagePickerScreen';
import { TouchableOpacity, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import { DeductionContext } from '../providers/DeductionProvider';
import { AuthContext } from '../providers/AuthProvider';

const HomeStack = () => {
    const Stack = createNativeStackNavigator();
    const {storedDeductions} = useContext(DeductionContext);
    const {user, logout} = useContext(AuthContext)

    const formateAmount = (amount) => {
        return 'R ' + (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }

    return (
        <Stack.Navigator
            initialRouteName='HomeScreen'
            screenOptions={() => ({
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: '#212121'
                },
            })} 
        >
            <Stack.Screen  
                options={({navigation}) => ({
                    headerTitle: 'Home',
                    headerRight: () => {
                        return (
                            <View style={tw`flex flex-row`}>
                                {
                                    user ? (
                                        <TouchableOpacity
                                            onPress={logout}
                                        >
                                            <Text style={tw`font-bold uppercase text-red-400 text-xs`}>Sign out</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('Auth')}
                                        >
                                            <Text style={tw`font-bold uppercase text-green-400 text-xs`}>Sign in</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        )
                    }
                })}
                name='HomeScreen' 
                component={HomeScreen}
            />
            <Stack.Screen  
                options={({route}) => ({
                    headerTitle: () => {
                        return (
                            <View>
                                <Text style={tw`text-gray-50 text-lg font-bold`}>{formateAmount(route.params.amount)}</Text> 
                                <Text style={tw`text-green-300 font-bold -mt-1.5`}>{formateAmount(route.params.amount + (storedDeductions.filter(bg => bg.budgets_id === route.params.id).reduce((a, b) => b.amount + a, 0)))}</Text>
                            </View>
                        )
                    }
                })}
                name='Deductions'
                component={DeductionsScreen}
            />
            <Stack.Screen  
                options={({route}) => ({
                    headerTitle: `${route.params.summary}`
                })}
                name='SummaryScreen' 
                component={SummaryScreen}
            />
            <Stack.Screen            
                options={() => ({
                    headerShown: false
                })}
                name='ImageScreen' 
                component={ImageScreen}
            />
            <Stack.Screen  
                options={({navigation, route}) => ({
                    headerTitle: `Receipt`,
                    headerRight: () => {
                        return (
                            route?.params?.type === 'deductAmount' &&
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('CameraScreen')
                            }} style={[tw`p-2 rounded-full`]}>
                                <Icon
                                    name='camera'
                                    type='ionicon'
                                    color='white'
                                />
                            </TouchableOpacity>
                        )
                    }
                })}
                name='AddAmountScreen' 
                component={AddAmountScreen}
            />
            <Stack.Screen  
                options={() => ({
                    headerTitle: `Camera`,
                })}
                name='CameraScreen' 
                component={CameraScreen}
            />
            <Stack.Screen  
                options={() => ({
                    headerTitle: `Image`,
                })}
                name='ImagePickerScreen' 
                component={ImagePickerScreen}
            />
            <Stack.Screen  
                options={() => ({
                    headerTitle: `Add User`,
                })}
                name='AddPeopleScreen' 
                component={AddPeopleScreen}
            />
        </Stack.Navigator>
    )

}

export default HomeStack
