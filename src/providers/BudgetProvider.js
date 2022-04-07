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
    const [archiveBudgets, setArchiveBudgets] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('budgets')
            .then(async stringifiedBudgets => {
                const savedBudgets = JSON.parse(stringifiedBudgets);
                if(savedBudgets && savedBudgets.length > 0)
                    setBudgets(groupItems(savedBudgets, 'created_on', archiveBudgets));
                    setStoredBudgets(savedBudgets);
            });
    }, []);

    useEffect(() => {
        AsyncStorage.getItem('archive').then(x => {
            if(!x) return;

            const isArchived = JSON.parse(x);
            setArchiveBudgets(isArchived);
        });
    }, []);

    useEffect(() => {
        setBudgets(groupItems(storedBudgets, 'created_on', archiveBudgets));
    }, [archiveBudgets]);

    useEffect(() => {
        //console.log(storedBudgets);
        AsyncStorage.setItem('budgets', JSON.stringify(storedBudgets));
    }, [storedBudgets]);

    const fetchBudgets = () => {
        if(!user) return;
        
        axiosInterceptor.get(`/budgets`)
            .then(({data}) => {
                const localOnes = storedBudgets.filter(x => !x.user_id);
                const serverBudgets = data.map(x => ({...x, archived: storedBudgets.find(y => y.id === x.id)?.archived}));
                const newUpdatedArrayOfBudgets = [...localOnes, ...serverBudgets];

                setBudgets(groupItems(newUpdatedArrayOfBudgets, 'created_on', archiveBudgets));
                setStoredBudgets(newUpdatedArrayOfBudgets);
            })
            .catch((error) => {
                if(user){
                    const messageToShow = error?.response?.data.message ? error.response.data.message : error?.message ? error.message : 'failed refrehsing'
                    ToastAndroid.showWithGravityAndOffset(messageToShow , ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
                }
            });
    }

    const archiveBudget = (item) => {
        setStoredBudgets(prev => {
            const newData = prev.map(x => x.id === item.id ? x.archived ? ({...x, archived: false}) : ({...x, archived: true}) : x);
            setBudgets(groupItems(newData, 'created_on', archiveBudgets));
            return newData
        });
    }

    const deleteBudget = async (id) => {
        const tempBudg = budgets;
        setBudgets(groupItems(storedBudgets.filter(x => x.id !== id), 'created_on', archiveBudgets));

        if(!user){
            setStoredBudgets(pevBg => pevBg.filter(x => x.id !== id));
            return;
        }

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

    const removeAllBudgets = () => {
        setStoredBudgets([]);
        setBudgets([]);
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

            setBudgets(groupItems([tempBudget, ...storedBudgets], 'created_on', archiveBudgets));

            if(!user){
                setStoredBudgets(pevDe => [tempBudget, ...pevDe]);
            }
        }
        
        axiosInterceptor.post(`/budgets`, amount)
            .then(({data: budget}) => {
                let updatedStored = storedBudgets;
                if(retry){
                    updatedStored = storedBudgets.filter(xx => xx.id !== amount.id);
                }
                setBudgets(groupItems([{...budget, remaining_amount: budget.budget}, ...updatedStored], 'created_on', archiveBudgets));
                setStoredBudgets([{...budget, remaining_amount: budget.budget}, ...updatedStored])
            })
            .catch((error) => {
                if(user){
                    setBudgets(tempBudg);
                    ToastAndroid.showWithGravityAndOffset(error.response.data.message, ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
                }
            });
    }

    const editBudget = async (id, editedBudget) => {
        const tempDeductions = budgets;
        
        setBudgets(groupItems(storedBudgets.map(x => x.id === id ? ({...editedBudget, created_on: new Date(editedBudget.created_on).toISOString()}) : x), 'created_on', archiveBudgets));

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

        //             await fetch(url + '/budgets/image/' + id, {
        //                 method: 'POST',
        //                 body: formData,
        //             })
        //             editedDeduction.image = imageName;
        //         } catch (error) {
        //             ToastAndroid.showWithGravityAndOffset('Image not updated', ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
        //         }
        //     }
        // }

        await axiosInterceptor.post(`/budgets/${id}`, editedBudget)
            .then(({data: budget})=> {
                setStoredBudgets(prev => {
                    const updatedArray = prev.map(x => x.id === id ? {...budget, remaining_amount: budget.budget} : x);
                    setBudgets(groupItems(updatedArray, 'created_on', archiveBudgets));
                    return updatedArray;
                });
            })
            .catch((error) => {
                if(user){
                    setBudgets(tempDeductions);
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
        <BudgetContext.Provider value={{budgets, editBudget, fetchBudgets, archiveBudgets, setArchiveBudgets, deleteBudget, archiveBudget, addBudget, addUser, removeAllBudgets}}>
            {children}
        </BudgetContext.Provider>
    )
}