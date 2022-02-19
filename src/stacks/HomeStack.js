import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import HomeScreen from '../screens/HomeScreen';
import DeductionsScreen from '../screens/DeductionsScreen';
import SummaryScreen from '../screens/SummaryScreen';
import ImageScreen from '../screens/ImageScreen'
import AddAmountScreen from '../screens/AddAmountScreen'
import CameraScreen from '../screens/CameraScreen'
import ImagePickerScreen from '../screens/ImagePickerScreen'
//import ImagePickerButton from '../components/ImagePickerButton'
import { TouchableOpacity, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import { BudgetContext } from '../providers/BudgetProvider';

const HomeStack = () => {
    const Stack = createNativeStackNavigator();
    const {fetchDeductions, fetchBudgets, fetchedDate} = useContext(BudgetContext);

    const formateAmount = (amount) => {
        return 'R ' + (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }

    return (
        <Stack.Navigator
            initialRouteName='HomeScreen'
            screenOptions={() => ({
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: '#212121',
                },
            })} 
        >
            <Stack.Screen  
                options={() => ({
                    headerTitle: 'Home',
                    headerRight: () => {
                        return (
                            <TouchableOpacity
                                onPress={() => fetchBudgets()}
                            >
                                <Icon 
                                    type='ionicon'
                                    name='refresh-outline'
                                    size={28}
                                    color='white'
                                />
                            </TouchableOpacity>
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
                                <Text style={tw`text-green-300 font-bold -mt-1.5`}>{formateAmount(route.params.amount + fetchedDate.reduce((a, b) => b.amount + a, 0))}</Text>
                            </View>
                        )
                    },
                    headerRight: () => {
                        return (
                            <TouchableOpacity
                                onPress={() => fetchDeductions(route.params.id)}
                            >
                                <Icon 
                                    type='ionicon'
                                    name='refresh-outline'
                                    size={28}
                                    color='white'
                                />
                            </TouchableOpacity>
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
        </Stack.Navigator>
    )

}

export default HomeStack
