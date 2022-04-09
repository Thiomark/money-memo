import {createContext, useContext, useEffect, useState} from 'react';
import { groupItems } from '../utils/helperFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInterceptor from '../utils/axiosInterceptor';
import { ToastAndroid } from 'react-native';
import { AuthContext } from './AuthProvider'
import { BudgetContext } from './BudgetProvider';
import { createDeduction } from '../utils/helperFunctions'
import {url} from '../utils/helperFunctions';

export const DeductionContext = createContext();

export const DeductionProvider = ({children}) => {
    const [storedDeductions, setStoredDeductions] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [deduction, setDeduction] = useState(null);
    const [image, setImage] = useState(null);
    const {user} = useContext(AuthContext);
    const {fetchBudgets} = useContext(BudgetContext);
    const [sortByDate, setSortByDate] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('deductions')
            .then(stringifiedDeductions => {
                const savedDeductions = JSON.parse(stringifiedDeductions);
                if(savedDeductions && savedDeductions.length > 0){
                    setStoredDeductions(savedDeductions);
                }
            });
    }, []);

    const controlSortBy = (budgetID) => {
        setSortByDate(prev => {
            const newValue = !prev
            fetchLocalDeductions(budgetID, null, newValue ? 'created_on' : 'tags')
            return newValue
        });
        
    }

    const sortBy = () => sortByDate ? 'created_on' :'tags'

    useEffect(() => {
        AsyncStorage.setItem('deductions', JSON.stringify(storedDeductions));
    }, [storedDeductions]);

    const removeAllDeductions = () => {
        setStoredDeductions([]);
        setDeductions([]);
    }

    const fetchServerDeductions = (id) => {
        if(!user) return;
        axiosInterceptor.get(`/deductions/${id}`)
            .then(({data}) => {
                const locallySavedDeductions = storedDeductions.filter(x => x.sign === 'temp' && x.budgets_id === id);
                const updatedArray = storedDeductions.filter(x => x.budgets_id !== id)
                const allDeductions = [...data, ...updatedArray, ...locallySavedDeductions];
                setStoredDeductions([...allDeductions]);
                if(deductions.length !== 0) return;

                const structedDeductions = groupItems([...locallySavedDeductions, ...data], sortBy());
                setDeductions(structedDeductions);
            })
            .catch(error => {
                const messageToShow = error?.response?.data.message ? error.response.data.message : error?.message ? error.message : 'failed refrehsing'
                ToastAndroid.showWithGravityAndOffset(messageToShow, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
            })
    }

    const deleteBudgetDeductions = (id) => {
        setStoredDeductions(prev => prev.filter(x => x.budgets_id !== id));
    }

    const fetchLocalDeductions = (budgets_id, arrayOfDeductions, sortBy = sortByDate ? 'created_on' : 'tags') => {
        const selectedArray = arrayOfDeductions ? arrayOfDeductions : storedDeductions;
        const localDeductions = selectedArray.filter(x => x.budgets_id === budgets_id);
        const structedDeductions = groupItems(localDeductions, sortBy);
        setDeductions(structedDeductions);
    }

    const fetchSingleDeduction = (id) => {
        const [singleDeduction] = storedDeductions.filter(x => x.id === id);
        setDeduction(singleDeduction);
    }

    const addDeduction = async (deduction, id, retry = false) => {
        
        const newDeduction = createDeduction(deduction);

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

        let imageName = null;

        if(deduction.image){
            try {
                imageName = `budget-img-${Date.now()}-${deduction.amount}`
                
                const formData = new FormData();

                formData.append('featuredImage', {
                    name: imageName,
                    uri: deduction.image,
                    type: 'image/jpg',
                });

                await fetch(url + '/deductions/image/' + id, {
                    method: 'POST',
                    body: formData,
                })
            } catch (error) {
                imageName = null;
                ToastAndroid.showWithGravityAndOffset('Image not saved', ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
            }
        }

        deduction.image = imageName;

        await axiosInterceptor.post(`/deductions/${id}`, deduction)
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

    const editDeduction = async (budgets_id, deduction_id, editedDeduction) => {

        const tempDeductions = deductions;
        fetchLocalDeductions(budgets_id, storedDeductions.map(x => x.id === deduction_id ? {...editedDeduction, created_on: new Date(editedDeduction.created_on).toISOString()} : x))

        if(!user) return;
        // if(editedDeduction.image){
        //     let imageName = null;

        //     if(editedDeduction.image){
        //         try {
        //             imageName = `budget-img-${Date.now()}-${editedDeduction.amount}`
                    
        //             const formData = new FormData();

        //             formData.append('featuredImage', {
        //                 name: imageName,
        //                 uri: editedDeduction.image,
        //                 type: 'image/jpg',
        //             });

        //             await fetch(url + '/deductions/image/' + id, {
        //                 method: 'POST',
        //                 body: formData,
        //             })
        //             editedDeduction.image = imageName;
        //         } catch (error) {
        //             ToastAndroid.showWithGravityAndOffset('Image not updated', ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
        //         }
        //     }
        // }

        await axiosInterceptor.post(`/deductions/${budgets_id}/${deduction_id}`, editedDeduction)
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

    const deleteDeduction = async (budgetID, id, imageUrl) => {

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

    const archiveDeductions = (budgets_id, selectedDeductions, archive) => {
        
    }

    return (
        <DeductionContext.Provider value={{deductions, setImage, image, controlSortBy, sortByDate, removeAllDeductions, storedDeductions, deleteBudgetDeductions, archiveDeductions, fetchServerDeductions, deduction, editDeduction, fetchSingleDeduction, fetchLocalDeductions, addDeduction, deleteDeduction}}>
            {children}
        </DeductionContext.Provider>
    )
}
