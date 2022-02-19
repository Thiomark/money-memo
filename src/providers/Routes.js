import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import HomeStack from '../stacks/HomeStack'
import { BudgetProvider } from './BudgetProvider';

const Routes = () => {
    return (
        <NavigationContainer theme={DarkTheme}>
            <SafeAreaProvider>
                <BudgetProvider>
                    <HomeStack />
                </BudgetProvider>
            </SafeAreaProvider>
        </NavigationContainer>
    );
}

export default Routes