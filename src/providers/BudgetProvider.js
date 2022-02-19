import {createContext, useEffect, useState} from 'react';
import axios from 'axios';

export const BudgetContext = createContext();

export const BudgetProvider = ({children}) => {
    const [fetchedDate, setFetchedData] = useState([])

    const [budgets, setBudgets] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [deduction, setDeduction] = useState(null);
    const [image, setImage] = useState(null);
    const url = 'http://192.168.0.100:5000/api/v1';
    //const url = 'https://budget-as3rd.herokuapp.com/api/v1'

    useEffect(() => {
        setDeductions(groupItems(fetchedDate))
    }, [fetchedDate])

    const fetchBudgets = async () => {
        try {
            const {data} = await axios.get(`${url}/budgets`);
            setBudgets(data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchDeductions = async (id) => {
        try {
            const {data} = await axios.get(`${url}/deductions/${id}`);
            setFetchedData(data)
        } catch (error) {
            
        }
    }

    const fetchDeduction = (id) => {
        const [deduction] = fetchedDate.filter(x => x.id === id);
        setDeduction(deduction);
    }

    const removeDeductions = () => {
        setFetchedData([]);
    }

    const removeDeduction = () => {
        setDeduction(null);
    }

    const uploadImage = async (id, image) => {
        try {
            const imageName = `${Date.now()}-proof.jpg`;
            const formData = new FormData();
            formData.append('photo', { uri: image.image, name: imageName, type: 'image/jpg' });

            await fetch(`${url}/deductions/image`, {
                method: 'POST',
                body: formData,
                headers: {
                    'content-type': 'multipart/form-data',
                },
            });

            await axios.post(`${url}/deductions/${id}`, {
                image: imageName
            });
        } catch (error) {
            
        }
    }

    const addAmount = async (amount) => {
        let imageName = null;
        if(amount.image){
            imageName = `${Date.now()}-proof.jpg`;
            const formData = new FormData();
            formData.append('photo', { uri: amount.image, name: imageName, type: 'image/jpg' });

            await fetch(`${url}/deductions/image`, {
                method: 'POST',
                body: formData,
                headers: {
                'content-type': 'multipart/form-data',
                },
            });
        }

        try {
            const res = await axios.post(`${url}/deductions`, {
                image: imageName,
                budgetsID: amount.budgetsID,
                description: amount.description,
                tags: amount.tags,
                amount: -amount.amount
            })

            setFetchedData(pevDe => [res.data, ...pevDe]);
    
        } catch (error) {
            console.log(error.nessage)
        }

        setImage(null)
    }

    const deleteBudget = async (id) => {
        try {
            await axios.delete(`${url}/budgets/${id}`);
            setBudgets(pevBg => pevBg.filter(x => x.id !== id));
        } catch (error) {
            
        }
    }

    const deleteDeduction = async (id) => {
        try {
            await axios.delete(`${url}/deductions/${id}`);
            setFetchedData(pevBg => pevBg.filter(x => x.id !== id));
        } catch (error) {
            
        }
    }

    const addBudget = async (amount) => {
        try {
            const res = await axios.post(`${url}/budgets`, amount)
            setBudgets(pevDe => [{...res.data, remaingAmount: res.data.budget}, ...pevDe])
        } catch (error) {
            
        }
    }

    return (
        <BudgetContext.Provider value={{budgets, url, fetchedDate, uploadImage, deleteDeduction, addBudget, deleteBudget, removeDeduction, fetchBudgets, deductions, addAmount, image, setImage, fetchDeductions, deduction, fetchDeduction, removeDeductions}}>
            {children}
        </BudgetContext.Provider>
    )
}

const groupItems = (data) => {

    const groups = data.reduce((groups, game) => {
        const tags = game.tags;
        if (!groups[tags]) {
          groups[tags] = [];
        }
        groups[tags].push(game);
        return groups;
    }, {});
      
      // Edit: to add it in the array format instead
    return Object.keys(groups).map((group) => {
        return {
            group,
            data: groups[group]
        };
    });
}