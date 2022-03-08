import {createContext, useContext, useEffect, useState} from 'react';
import { groupItems } from '../utils/helperFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInterceptor from '../utils/axiosInterceptor';
import { ToastAndroid } from 'react-native';
import { AuthContext } from './AuthProvider'
import { BudgetContext } from './BudgetProvider';

export const DeductionContext = createContext();

export const DeductionProvider = ({children}) => {
    const [storedDeductions, setStoredDeductions] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [deduction, setDeduction] = useState(null);
    const {user} = useContext(AuthContext);
    const {fetchBudgets} = useContext(BudgetContext)

    useEffect(() => {
        AsyncStorage.getItem('deductions')
            .then(stringifiedDeductions => {
                const savedDeductions = JSON.parse(stringifiedDeductions);
                if(savedDeductions && savedDeductions.length > 0){
                    setStoredDeductions(savedDeductions);
                }
            });
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('deductions', JSON.stringify(storedDeductions));
    }, [storedDeductions]);


    const fetchServerDeductions = (id) => {
        if(!user) return;
        
        axiosInterceptor.get(`/deductions/${id}`)
            .then(({data}) => {
                const updatedArray = storedDeductions.filter(x => x.sign || x.budgets_id !== id);
                const updatedDeductions = [...data, ...updatedArray];
                setStoredDeductions(updatedDeductions);
            });
    }

    const fetchLocalDeductions = (id, arrayOfDeductions) => {
        const selectedArray = arrayOfDeductions ? arrayOfDeductions : storedDeductions;
        const localDeductions = selectedArray.filter(x => x.budgets_id === id);
        const structedDeductions = groupItems(localDeductions, 'created_on');
        setDeductions(structedDeductions);
    }

    const fetchSingleDeduction = (id) => {
        const [singleDeduction] = storedDeductions.filter(x => x.id !== id);
        setDeduction(singleDeduction);
    }

    const addDeduction = async (deduction, id, retry = false) => {

        const newDeduction = {
            ...deduction, 
            sign: 'temp',
            created_on: new Date(deduction.created_on).toISOString(), 
            id: Date.now()
        };

        if(!retry){
            fetchLocalDeductions(id, [newDeduction, ...storedDeductions]);
            if(!user){
                setStoredDeductions(prev => {
                    fetchLocalDeductions(id, [newDeduction, ...prev]);
                    return [...prev, newDeduction]
                });
                return;
            };
        }

        axiosInterceptor.post(`/deductions/${id}`, deduction)
            .then(({data}) => {
                setStoredDeductions(prev => {
                    let updatedDeductions = prev
                    if(retry){
                        updatedDeductions = storedDeductions.filter(x => x.id !== deduction.id);
                    }
                    fetchLocalDeductions(id, [data, ...updatedDeductions]);
                    return [...updatedDeductions, data]
                });
            })
            .catch((error) => {
                if(user){
                    fetchLocalDeductions(id, storedDeductions);
                    ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
                }
            });

        fetchBudgets();
    }

    const editDeduction = (budgets_id, deduction_id, editedDeduction) => {
        const tempDeductions = deductions;
        fetchLocalDeductions(budgets_id, storedDeductions.map(x => x.id === deduction_id ? {...editedDeduction, created_on: new Date(editedDeduction.created_on).toISOString()} : x))

        axiosInterceptor.post(`/deductions/${budgets_id}/${deduction_id}`, editedDeduction)
            .then(({data})=> {
                setStoredDeductions(prev => prev.map(x => x.id === deduction_id ? data : x));
            })
            .catch((error) => {
                if(user){
                    setDeductions(tempDeductions);
                    ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
                }
            });
        
    }

    const deleteDeduction = async (budgetID, id) => {
        fetchLocalDeductions(budgetID, storedDeductions.filter(x => x.id !== id));

        axiosInterceptor.delete(`/deductions/${budgetID}/${id}`)
            .then(() => {
                setStoredDeductions(prev => prev.filter(x => x.id !== id));
            })
            .catch((error) => {
                if(user){
                    fetchLocalDeductions(budgetID, storedDeductions);
                    ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
                }
            });
        
        fetchBudgets();
    }

    return (
        <DeductionContext.Provider value={{deductions, storedDeductions, fetchServerDeductions, deduction, editDeduction, fetchSingleDeduction, fetchLocalDeductions, addDeduction, deleteDeduction}}>
            {children}
        </DeductionContext.Provider>
    )
}

/*


    const uploadImage = async (id, image) => {
        try {
            const imageName = `${Date.now()}-proof.jpg`;
            const formData = new FormData();
            formData.append('photo', { uri: image.image, name: imageName, type: 'image/jpg' });

            await fetch(`/deductions/image`, {
                method: 'POST',
                body: formData,
                headers: {
                    'content-type': 'multipart/form-data',
                },
            });

            await axiosInterceptor.post(`/deductions/${id}`, {
                image: imageName
            });
        } catch (error) {
            
        }
    }

    const addDeduction = async (amount, budgetID) => {
        let imageName = null;
        // if(amount.image){
        //     imageName = `${Date.now()}-proof.jpg`;
        //     const formData = new FormData();
        //     formData.append('photo', { uri: amount.image, name: imageName, type: 'image/jpg' });

        //     await fetch(`/deductions/image`, {
        //         method: 'POST',
        //         body: formData,
        //         headers: {
        //             'content-type': 'multipart/form-data',
        //         },
        //     });
        // }

        try {
            const res = await axiosInterceptor.post(`/deductions/${budgetID}`, {
                image: imageName,
                description: amount.description,
                tags: amount.tags,
                amount: -amount.amount,
                created_on: amount.created_on
            })

            setFetchedDeductions(pevDe => [res.data, ...pevDe]);
        } catch (error) {
            console.log(error.message)
        }

        setImage(null)
    }


*/
