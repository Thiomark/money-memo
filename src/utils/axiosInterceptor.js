import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let headers = {};

const instance = axios.create({
    baseURL: 'http://192.168.0.101:5000/api/v1',
    headers
})

instance.interceptors.request.use(
    async (config) => {
        const user = await AsyncStorage.getItem('user');
        const { token } = JSON.parse(user);
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    }
);

export default instance