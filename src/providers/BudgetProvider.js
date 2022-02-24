import {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { groupItems, url } from '../utils/helperFunctions';

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
            const { data } = await axios.get(`${url}/budgets`);
            setFetchedBudgets(data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteBudget = async (id) => {
        try {
            await axios.delete(`${url}/budgets/${id}`);
            setFetchedBudgets(pevBg => pevBg.filter(x => x.id !== id));
        } catch (error) {
            
        }
    }

    const addBudget = async (amount) => {
        try {
            const {data: [budget]} = await axios.post(`${url}/budgets`, amount);
            setFetchedBudgets(pevDe => [{...budget, remaining_amount: budget.budget}, ...pevDe])
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <BudgetContext.Provider value={{budgets, fetchBudgets, deleteBudget, addBudget}}>
            {children}
        </BudgetContext.Provider>
    )
}

