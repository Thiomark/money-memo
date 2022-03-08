import {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { groupItems } from '../utils/helperFunctions';
import axiosInterceptor from '../utils/axiosInterceptor';
import { ToastAndroid } from 'react-native';
import { AuthContext } from './AuthProvider';

export const BudgetContext = createContext();

export const BudgetProvider = ({children}) => {
    const [storedBudgets, setStoredBudgets] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const {user} = useContext(AuthContext);

    useEffect(() => {
        AsyncStorage.getItem('budgets')
            .then(stringifiedBudgets => {
                const savedBudgets = JSON.parse(stringifiedBudgets);
                if(savedBudgets && savedBudgets.length > 0){
                    setBudgets(groupItems(savedBudgets, 'created_on'));
                    setStoredBudgets(savedBudgets);
                }
            });
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('budgets', JSON.stringify(storedBudgets));
    }, [storedBudgets]);

    const fetchBudgets = () => {
        if(!user) return;
        
        axiosInterceptor.get(`/budgets`)
            .then(({data}) => {
                const localOnes = storedBudgets.filter(x => !x.user_id);

                setBudgets(groupItems([...localOnes ,...data], 'created_on'));
                setStoredBudgets([...localOnes ,...data]);
            })
            .catch((error) => {
                if(user){
                    ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
                }
            });
    }

    const deleteBudget = async (id) => {
        const tempBudg = budgets;
        setBudgets(groupItems(storedBudgets.filter(x => x.id !== id), 'created_on'));

        axiosInterceptor.delete(`/budgets/${id}`)
            .then(() => {
                setStoredBudgets(pevBg => pevBg.filter(x => x.id !== id));
            })
            .catch((error) => {
                if(user){
                    setBudgets(tempBudg);
                    ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
                }
            });
    }

    const addBudget = async (amount, retry = false) => {

        const tempBudg = budgets;

        if(!retry){
            const tempBudget = {
                ...amount, 
                remaining_amount: amount.budget, 
                removed_amount: 0,
                id: Date.now(), 
                user_id: null,
                created_on: new Date(amount.created_on).toISOString()
            }

            setBudgets(groupItems([tempBudget, ...storedBudgets], 'created_on'));

            if(!user){
                setStoredBudgets(pevDe => [tempBudget, ...pevDe]);
            }
        }
        
        axiosInterceptor.post(`/budgets`, amount)
            .then(({data: [budget]}) => {
                let updatedStored = storedBudgets;
                if(retry){
                    updatedStored = storedBudgets.filter(xx => xx.id !== amount.id);
                }
                setBudgets(groupItems([{...budget, remaining_amount: budget.budget}, ...updatedStored], 'created_on'));
                setStoredBudgets([{...budget, remaining_amount: budget.budget}, ...updatedStored])
            })
            .catch((error) => {
                if(user){
                    setBudgets(tempBudg);
                    ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
                }
            });
    }

    const addUser = async (id, addUser) => {
        if(!user) return;

        try {
            await axiosInterceptor.post(`/budgets/add/${id}`, {userToAdd: addUser});
            ToastAndroid.showWithGravityAndOffset(`${addUser} is successfully added`, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
        } catch (error) {
            ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
        }
    }

    return (
        <BudgetContext.Provider value={{budgets, fetchBudgets, deleteBudget, addBudget, addUser}}>
            {children}
        </BudgetContext.Provider>
    )
}