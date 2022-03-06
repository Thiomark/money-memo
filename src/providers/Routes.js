import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import AppStack from '../stacks/AppStack'

const Routes = () => {
    return (
        <NavigationContainer theme={DarkTheme}>
            <SafeAreaProvider>
                <AppStack />
            </SafeAreaProvider>
        </NavigationContainer>
    );
}

export default Routes