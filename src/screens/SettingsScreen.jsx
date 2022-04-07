import { useContext, useEffect, useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Container from '../shared/Container';
import * as Updates from 'expo-updates';
import {colors} from '../utils/colors'
import { BudgetContext } from '../providers/BudgetProvider';
import { DeductionContext } from '../providers/DeductionProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
    const [isAnUpdateAvialble, setIsAnUpdateAvialble] = useState(false);
    const {removeAllBudgets, archiveBudgets, setArchiveBudgets} = useContext(BudgetContext);
    const {removeAllDeductions} = useContext(DeductionContext);

    const toggleSwitch = () => setArchiveBudgets(previousState => {
        AsyncStorage.setItem('archive', JSON.stringify(!previousState));
        return !previousState
    });
    
    const reactToUpdate = async () => {
        Updates.addListener((event) => {
            if(event.type === Updates.UpdateEventType.UPDATE_AVAILABLE){
                setIsAnUpdateAvialble(true)
            }
        })
    }

    useEffect(() => {
        reactToUpdate();
    }, [])

    return (
        <Container sides={1}>
            <View style={tw`flex-1 px-1 pt-4 relative`}>
                <Text style={tw`${colors.textTailwind} mb-4 font-semibold`}>Remove all saved budgets</Text>
                <TouchableOpacity onPress={() => removeAllBudgets()} style={[tw`flex w-full items-center justify-center rounded h-12`, {backgroundColor: colors.cardBackgroundColor}]}>
                    <Text style={tw`${colors.textTailwind} font-bold`}>Delete Budgets</Text>
                </TouchableOpacity>
                <Text style={tw`${colors.textTailwind} mb-4 mt-3 font-semibold`}>Remove all saved deductions</Text>
                <TouchableOpacity onPress={() => removeAllDeductions()} style={[tw`flex w-full items-center justify-center rounded h-12`, {backgroundColor: colors.cardBackgroundColor}]}>
                    <Text style={tw`${colors.textTailwind} font-bold`}>Delete Deductions</Text>
                </TouchableOpacity>
                <View style={tw`mt-4 flex flex-row items-center justify-between`}>
                    <Text style={tw`${colors.textTailwind} font-semibold`}>Show archived budgets</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={archiveBudgets ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={archiveBudgets}
                    />
                </View>
            </View>
            {
                <TouchableOpacity disabled={!isAnUpdateAvialble} onPress={() => Updates.reloadAsync()} style={[tw`flex absolute bottom-4 w-full items-center justify-center rounded h-12 ${!isAnUpdateAvialble ? 'bg-red-500' : 'bg-green-500'}`]}>
                    <Text style={tw`text-gray-50 font-semibold `}>{!isAnUpdateAvialble ? 'No updates' : 'Update'}</Text>
                </TouchableOpacity>
            }
        </Container>
    )
}

export default SettingsScreen;