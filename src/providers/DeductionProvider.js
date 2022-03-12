import {createContext, useContext, useEffect, useState} from 'react';
import { groupItems } from '../utils/helperFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInterceptor from '../utils/axiosInterceptor';
import { ToastAndroid } from 'react-native';
import { AuthContext } from './AuthProvider'
import { BudgetContext } from './BudgetProvider';
import {getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL} from 'firebase/storage';
import { createDeduction } from '../utils/helperFunctions'
import {url} from '../utils/helperFunctions'

export const DeductionContext = createContext();

export const DeductionProvider = ({children}) => {
    const [storedDeductions, setStoredDeductions] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [deduction, setDeduction] = useState(null);
    const [image, setImage] = useState(null);
    const {user} = useContext(AuthContext);
    const {fetchBudgets} = useContext(BudgetContext);
    const [firestoreImages, setFirestoreImages] = useState([]);

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

    const fetchImages = (id) => {
        // const storage = getStorage();
        // const listRef = ref(storage, `budgets/${id}`);

        // listAll(listRef)
        //     .then((res) => {
        //         res.items.forEach((itemRef) => {
        //             getDownloadURL(ref(storage, `budgets/${id}/${itemRef.name}`))
        //                 .then((url) => {
        //                     setFirestoreImages(prev => [...prev, {url, name: itemRef.name}])
        //                 })
        //         });
        //     })
        //     .finally(() => {
        //         //! do something
        //     })
    }

    const fetchLocalDeductions = (budgets_id, arrayOfDeductions, sortBy = 'created_on') => {
        const selectedArray = arrayOfDeductions ? arrayOfDeductions : storedDeductions;
        const localDeductions = selectedArray.filter(x => x.budgets_id === budgets_id);
        const structedDeductions = groupItems(localDeductions, sortBy);
        setDeductions(structedDeductions);
    }

    const fetchSingleDeduction = (id) => {
        const [singleDeduction] = storedDeductions.filter(x => x.id !== id);
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

        if(deduction.image && user){
            try {
                imageName = `budget-img-${Date.now()}-${deduction.amount}`
                const storage = getStorage();
                const reff = ref(storage, `budgets/${id}/${imageName}`);
                const img = await fetch(deduction.image);
                const bytes = await img.blob();
                console.log(bytes);
                await uploadBytes(reff, bytes);
            } catch (error) {
                imageName = null;
                ToastAndroid.showWithGravityAndOffset('Image not saved', ToastAndroid.LONG, ToastAndroid.BOTTOM, 0, 50);
            }
        }

        deduction.image = imageName;

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

    const deleteDeduction = async (budgetID, id, imageUrl) => {

        fetchLocalDeductions(budgetID, storedDeductions.filter(x => x.id !== id));

        try {
            if(imageUrl && user){
                const storage = getStorage();
                const desertRef = ref(storage, `budgets/${id}/${imageUrl}`);
                await deleteObject(desertRef)
            }
        } catch (error) {
            console.log(error);
        }

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

    const tagOtherDeductions = (img) => {
        
    }

    return (
        <DeductionContext.Provider value={{deductions, setImage, image, storedDeductions, fetchImages, firestoreImages, tagOtherDeductions, fetchServerDeductions, deduction, editDeduction, fetchSingleDeduction, fetchLocalDeductions, addDeduction, deleteDeduction}}>
            {children}
        </DeductionContext.Provider>
    )
}
