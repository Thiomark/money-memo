import React, { useState, createContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../utils/helperFunctions';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${url}/users/login`, {
                email, password
            });
            await AsyncStorage.setItem('user', JSON.stringify(data));
        } catch (error) {
            
        }
    }

    const register = () => {

    }

    return (
        <AuthContext.Provider value={{user, login, register}}>
            { children }
        </AuthContext.Provider>
    );
};