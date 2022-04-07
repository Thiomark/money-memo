import { createNativeStackNavigator } from '@react-navigation/native-stack';
import App from './HomeStack';
import Auth from './AuthStack'

const AppStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            initialRouteName='App'
            screenOptions={() => ({
                headerShown: false
            })} 
        >
            <Stack.Screen            
                options={() => ({
                    headerShown: false
                })}
                name='App' 
                component={App}
            />
            <Stack.Screen            
                options={() => ({
                    headerShown: false
                })}
                name='Auth' 
                component={Auth}
            />
        </Stack.Navigator>
    )
}

export default AppStack