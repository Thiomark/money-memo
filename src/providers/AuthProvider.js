import React, { useState, createContext, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInterceptor from '../utils/axiosInterceptor';
import { ToastAndroid } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('user').then(x => {
            if(x){
                const { token } = JSON.parse(x);
                setUser(token)
            }
        })
    }, [])
    
    
    const login = (credentials) => {
        axiosInterceptor.post(`/users/login`, credentials)
            .then(({data}) => {
                setUser(data);
                AsyncStorage.setItem('user', JSON.stringify(data));
            })
            .catch((error) => {
                ToastAndroid.showWithGravityAndOffset(error?.response?.data?.message || error, ToastAndroid.LONG, ToastAndroid.TOP, 0, 50);
            })
    }

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    }

    const register = () => {
        //console.log('sddss');
    }

    return (
        <AuthContext.Provider value={{user, login, register, logout}}>
            { children }
        </AuthContext.Provider>
    );
};