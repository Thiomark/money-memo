import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import AppTabs from '../stacks/AuthStack'

const Routes = () => {
    return (
        <NavigationContainer theme={DarkTheme}>
            <SafeAreaProvider>
                <AppTabs />
            </SafeAreaProvider>
        </NavigationContainer>
    );
}

export default Routes