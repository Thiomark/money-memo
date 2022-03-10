import axios from 'axios';
import {url} from './helperFunctions'
import AsyncStorage from '@react-native-async-storage/async-storage';

let headers = {};

const instance = axios.create({
    baseURL: url,
    headers
})

instance.interceptors.request.use(
    async (config) => {
        const user = await AsyncStorage.getItem('user');
        if(user){
            const { token } = JSON.parse(user);
            if(token){
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config;
    }
);

export default instance