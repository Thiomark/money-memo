import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { groupItems, url } from '../utils/helperFunctions';
import axiosInterceptor from '../utils/axiosInterceptor'
import { ToastAndroid } from 'react-native';

export const BudgetContext = createContext();

export const BudgetProvider = ({children}) => {
    const [budgets, setBudgets] = useState([]);
    const [latestBudgets, setLatesBudgets] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('budgets')
            .then(stringifiedBudgets => {
                if(stringifiedBudgets){
                    setLatesBudgets(JSON.parse(stringifiedBudgets));
                }
            })
    }, []);

    useEffect(() => {
        const data = groupItems(latestBudgets, 'created_on');
        setBudgets(data);
        AsyncStorage.setItem('budgets', JSON.stringify(latestBudgets));
    }, [latestBudgets]);

    const addBudget = async (amount) => {
        try {
            const {data: [budget]} = await axiosInterceptor.post(`${url}/budgets`, amount)
                .then(data => {
                    const budget =
                })
            setLatesBudgets(pevDe => [
                {
                    ...budget, 
                    remaining_amount: budget.budget
                }, 
                ...pevDe
            ]);
        } catch (error) {
            setLatesBudgets(pevDe => [
                {
                    budget: amount, 
                    remaining_amount: amount, 
                    id: Date.now().toString(), 
                    user_id: null
                }, 
                ...pevDe
            ]);
            ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
        }
    }

    // const deleteBudget = async (id) => {
    //     try {
    //         await axiosInterceptor.delete(`${url}/budgets/${id}`);
    //         setFetchedBudgets(pevBg => pevBg.filter(x => x.id !== id));
    //     } catch (error) {
    //         ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
    //     }
    // }

    // const addUser = async (id, user) => {
    //     try {
    //         await axiosInterceptor.post(`${url}/budgets/add/${id}`, {userToAdd: user});
    //         ToastAndroid.showWithGravityAndOffset(`${user} is successfully added`, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
    //     } catch (error) {
    //         ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
    //     }
    // }

    return (
        <BudgetContext.Provider value={{ addBudget, budgets }}>
            {children}
        </BudgetContext.Provider>
    )
}

