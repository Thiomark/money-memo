import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { groupItems, url } from '../utils/helperFunctions';
import axiosInterceptor from '../utils/axiosInterceptor'
import { ToastAndroid } from 'react-native';

export const BudgetContext = createContext();

export const BudgetProvider = ({children}) => {
    const [fetchedBudgets, setFetchedBudgets] = useState([]);
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        const data = groupItems(fetchedBudgets, 'created_on')
        setBudgets(data);
        AsyncStorage.setItem('budgets', JSON.stringify(data))
    }, [fetchedBudgets]);

    useEffect(() => {
        if(budgets.length === 0){
            AsyncStorage.getItem('budgets')
                .then(x => {
                    if(x) setBudgets(JSON.parse(x))
                })
        }
    }, [])

    const fetchBudgets = async () => {
        try { 
            const { data } = await axiosInterceptor.get(`${url}/budgets`);
            setFetchedBudgets(data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteBudget = async (id) => {
        try {
            await axiosInterceptor.delete(`${url}/budgets/${id}`);
            setFetchedBudgets(pevBg => pevBg.filter(x => x.id !== id));
        } catch (error) {
            
        }
    }

    const addUser = async (id, user) => {
        try {
            await axiosInterceptor.post(`${url}/budgets/add/${id}`, {userToAdd: user});
            ToastAndroid.showWithGravityAndOffset(`${user} is successfully added`, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
        } catch (error) {
            ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
        }
    }

    const addBudget = async (amount) => {
        try {
            const {data: [budget]} = await axiosInterceptor.post(`${url}/budgets`, amount);
            setFetchedBudgets(pevDe => [{...budget, remaining_amount: budget.budget}, ...pevDe])
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <BudgetContext.Provider value={{budgets, fetchBudgets, deleteBudget, addBudget, addUser}}>
            {children}
        </BudgetContext.Provider>
    )
}

