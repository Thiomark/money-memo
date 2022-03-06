import React, { useState, createContext, useContext, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../utils/helperFunctions';
import axios from 'axios';
import { ToastAndroid } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('user').then(x => {
            const { token } = JSON.parse(x);
            setUser(token)
        })
    }, [])
    
    
    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${url}/users/login`, {
                email, password
            });
            setUser(data);
            await AsyncStorage.setItem('user', JSON.stringify(data));
        } catch (err) {
            ToastAndroid.showWithGravityAndOffset(err?.response?.data?.message || err, ToastAndroid.LONG, ToastAndroid.TOP, 0, 50);
        }
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