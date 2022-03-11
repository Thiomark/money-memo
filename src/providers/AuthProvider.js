import React, { useState, createContext, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInterceptor from '../utils/axiosInterceptor';
import { ToastAndroid } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        AsyncStorage.getItem('user').then(x => {
            if(x){
                const { token } = JSON.parse(x);
                setUser(token)
            }
        })
    }, [])
    
    
    const login = (credentials) => {
        setIsSubmitting(true);
        axiosInterceptor.post(`/users/login`, credentials)
            .then(({data}) => {
                setUser(data);
                AsyncStorage.setItem('user', JSON.stringify(data));
            })
            .catch((error) => {
                ToastAndroid.showWithGravityAndOffset(error?.response?.data?.message || error.message, ToastAndroid.LONG, ToastAndroid.TOP, 0, 50);
            })
            .finally(() => {
                setIsSubmitting(false);
            })
    }

    const register = (credentials) => {
        return;
        setIsSubmitting(true);
        axiosInterceptor.post(`/users/register`, credentials)
            .then(({data}) => {
                setUser(data);
                AsyncStorage.setItem('user', JSON.stringify(data));
            })
            .catch((error) => {
                ToastAndroid.showWithGravityAndOffset(error?.response?.data?.message || error.message, ToastAndroid.LONG, ToastAndroid.TOP, 0, 50);
            })
            .finally(() => {
                setIsSubmitting(false);
            })
    }

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    }

    return (
        <AuthContext.Provider value={{user, isSubmitting, login, register, logout}}>
            { children }
        </AuthContext.Provider>
    );
};